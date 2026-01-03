<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class VendorOrderController extends Controller
{
    /**
     * Display vendor's orders list
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Get all product IDs belonging to this vendor
        $productIds = Product::where('user_id', $user->id)->pluck('id');
        
        // Get order IDs that contain at least one of the vendor's products
        $orderIds = OrderItem::whereIn('product_id', $productIds)
            ->pluck('order_id')
            ->unique();
        
        // Build query for orders
        $query = Order::whereIn('id', $orderIds)
            ->with(['user', 'items' => function ($q) use ($productIds) {
                // Only load items that belong to this vendor
                $q->whereIn('product_id', $productIds)->with('product');
            }]);
        
        // Apply status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%");
            });
        }
        
        // Get paginated orders
        $orders = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();
        
        // Transform orders to add image URLs
        $orders->getCollection()->transform(function ($order) {
            if ($order->items) {
                $order->items->transform(function ($item) {
                    if ($item->product) {
                        $images = $item->product->images()->get();
                        $imagesData = [];
                        foreach ($images as $image) {
                            $imagesData[] = [
                                'id' => $image->id,
                                'url' => Storage::disk('s3')->temporaryUrl($image->url, now()->addMinutes(30))
                            ];
                        }
                        $item->product->images = $imagesData;
                    }
                    return $item;
                });
            }
            return $order;
        });
        
        // Calculate statistics
        $allOrders = Order::whereIn('id', $orderIds)->get();
        $allOrderItems = OrderItem::whereIn('product_id', $productIds)
            ->whereIn('order_id', $orderIds)
            ->get();
        
        $thisMonthOrders = Order::whereIn('id', $orderIds)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->get();
        
        $thisMonthOrderItems = OrderItem::whereIn('product_id', $productIds)
            ->whereIn('order_id', $thisMonthOrders->pluck('id'))
            ->get();
        
        $stats = [
            'total_orders' => $allOrders->count(),
            'pending_orders' => $allOrders->whereIn('status', ['pending', 'confirmed', 'processing'])->count(),
            'total_revenue' => $allOrderItems->sum(fn($item) => $item->price * $item->quantity),
            'this_month_revenue' => $thisMonthOrderItems->sum(fn($item) => $item->price * $item->quantity),
        ];
        
        return Inertia::render('vendor/orders', [
            'orders' => $orders,
            'filters' => [
                'status' => $request->status ?? 'all',
            ],
            'stats' => $stats,
        ]);
    }
    
    /**
     * Update order status
     */
    public function updateStatus(Request $request, Order $order)
    {
        $user = auth()->user();
        
        // Verify vendor owns at least one product in this order
        $productIds = Product::where('user_id', $user->id)->pluck('id');
        $hasProduct = $order->items()->whereIn('product_id', $productIds)->exists();
        
        if (!$hasProduct) {
            return back()->with('error', 'Vous n\'êtes pas autorisé à modifier cette commande');
        }
        
        $request->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,out_for_delivery,delivered',
            'tracking_number' => 'nullable|string|max:100',
        ]);
        
        $order->status = $request->status;
        
        if ($request->filled('tracking_number')) {
            $order->tracking_number = $request->tracking_number;
        }
        
        // Set timestamps based on status
        switch ($request->status) {
            case 'shipped':
                $order->shipped_at = now();
                break;
            case 'delivered':
                $order->delivered_at = now();
                break;
        }
        
        $order->save();
        
        // TODO: Send notification to customer about status change
        
        return back()->with('success', 'Statut de la commande mis à jour');
    }
    
    /**
     * View order details
     */
    public function show(Order $order)
    {
        $user = auth()->user();
        
        // Verify vendor owns at least one product in this order
        $productIds = Product::where('user_id', $user->id)->pluck('id');
        $hasProduct = $order->items()->whereIn('product_id', $productIds)->exists();
        
        if (!$hasProduct) {
            abort(403, 'Vous n\'êtes pas autorisé à voir cette commande');
        }
        
        // Load order with only vendor's items
        $order->load(['user', 'items' => function ($q) use ($productIds) {
            $q->whereIn('product_id', $productIds)->with('product');
        }]);
        
        // Transform to add image URLs
        $order->items->transform(function ($item) {
            if ($item->product) {
                $images = $item->product->images()->get();
                $imagesData = [];
                foreach ($images as $image) {
                    $imagesData[] = [
                        'id' => $image->id,
                        'url' => Storage::disk('s3')->temporaryUrl($image->url, now()->addMinutes(30))
                    ];
                }
                $item->product->images = $imagesData;
            }
            return $item;
        });
        
        return Inertia::render('vendor/order-show', [
            'order' => $order,
        ]);
    }
}
