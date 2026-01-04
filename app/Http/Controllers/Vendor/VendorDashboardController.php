<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class VendorDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Récupérer la boutique du vendeur avec ses followers
        $shop = Shop::where('user_id', $user->id)->with('followers')->first();
        
        // Si le vendeur a une boutique, associer automatiquement tous ses produits orphelins
        if ($shop) {
            Product::where('user_id', $user->id)
                ->whereNull('shop_id')
                ->update(['shop_id' => $shop->id]);
        }
        
        // Récupérer les produits du vendeur
        $products = Product::with(['user', 'category'])
            ->orderBy('created_at', 'desc')
            ->where('user_id', $user->id)
            ->get();
            
        $products->transform(function ($product) {
            $images = $product->images()->get();
            $imagesUrls = [];
            foreach ($images as $image) {
                $imagesUrls[] = Storage::disk('s3')->temporaryUrl($image->url, now()->addMinutes(5));
            }
            $product->images = $imagesUrls;
            return $product;
        });

        // Générer les URLs temporaires pour la boutique
        if ($shop && $shop->logo) {
            $shop->logo_url = Storage::disk('s3')->temporaryUrl($shop->logo, now()->addMinutes(30));
        }
        if ($shop && $shop->cover_image) {
            $shop->cover_image_url = Storage::disk('s3')->temporaryUrl($shop->cover_image, now()->addMinutes(30));
        }

        // Récupérer les commandes liées aux produits du vendeur
        $productIds = $products->pluck('id');
        $orderItems = OrderItem::whereIn('product_id', $productIds)
            ->with(['order.user', 'product'])
            ->get();
        
        $orderIds = $orderItems->pluck('order_id')->unique();
        $orders = Order::whereIn('id', $orderIds)
            ->with(['user', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Calculer les statistiques
        $stats = [
            'total_sales' => $orderItems->sum(function ($item) {
                return $item->price * $item->quantity;
            }),
            'total_orders' => $orders->count(),
            'total_products' => $products->count(),
            'active_products' => $products->where('quantity', '>', 0)->count(),
            'sold_products' => $products->where('quantity', 0)->count(),
            'pending_orders' => $orders->where('status', 'pending')->count(),
            'processing_orders' => $orders->where('status', 'processing')->count(),
            'completed_orders' => $orders->whereIn('status', ['delivered', 'completed'])->count(),
            'total_followers' => $shop ? $shop->followers->count() : 0,
        ];

        // Commandes récentes (5 dernières)
        $recentOrders = $orders->take(5)->map(function ($order) use ($productIds) {
            $vendorItems = $order->items->filter(function ($item) use ($productIds) {
                return $productIds->contains($item->product_id);
            });
            
            return [
                'id' => $order->id,
                'reference' => $order->reference ?? 'ORD-' . str_pad($order->id, 5, '0', STR_PAD_LEFT),
                'customer' => $order->user ? $order->user->name : 'Client',
                'customer_avatar' => $order->user && $order->user->avatar 
                    ? Storage::disk('s3')->temporaryUrl($order->user->avatar, now()->addMinutes(30))
                    : null,
                'date' => $order->created_at->format('Y-m-d'),
                'status' => $order->status,
                'amount' => $vendorItems->sum(function ($item) {
                    return $item->price * $item->quantity;
                }),
                'items_count' => $vendorItems->count(),
            ];
        });

        return Inertia::render('vendor/dashboard', [
            'products' => $products,
            'shop' => $shop,
            'orders' => $recentOrders,
            'stats' => $stats,
        ]);
    }

    public function updateShop(Request $request)
    {
        $user = auth()->user();
        $shop = Shop::where('user_id', $user->id)->first();

        if (!$shop) {
            return back()->with('error', 'Vous n\'avez pas de boutique.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'facebook' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'logo' => 'nullable|image|max:2048',
            'cover_image' => 'nullable|image|max:5120',
        ]);

        // Upload du logo
        if ($request->hasFile('logo')) {
            // Supprimer l'ancien logo
            if ($shop->logo) {
                Storage::disk('s3')->delete($shop->logo);
            }
            $validated['logo'] = $request->file('logo')->store('shops/logos', 's3');
        }

        // Upload de l'image de couverture
        if ($request->hasFile('cover_image')) {
            if ($shop->cover_image) {
                Storage::disk('s3')->delete($shop->cover_image);
            }
            $validated['cover_image'] = $request->file('cover_image')->store('shops/covers', 's3');
        }

        $shop->update($validated);

        return back()->with('success', 'Boutique mise à jour avec succès.');
    }

    public function createShop(Request $request)
    {
        $user = auth()->user();

        // Vérifier si l'utilisateur a déjà une boutique
        if (Shop::where('user_id', $user->id)->exists()) {
            return back()->with('error', 'Vous avez déjà une boutique.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:shops,name',
            'description' => 'nullable|string|max:1000',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'logo' => 'nullable|image|max:2048',
            'cover_image' => 'nullable|image|max:5120',
        ]);

        $validated['user_id'] = $user->id;
        $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']);

        // Upload du logo
        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('shops/logos', 's3');
        }

        // Upload de l'image de couverture
        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('shops/covers', 's3');
        }

        $shop = Shop::create($validated);

        // Transférer automatiquement les produits existants du vendeur à sa nouvelle boutique
        $productsUpdated = Product::where('user_id', $user->id)
            ->whereNull('shop_id')
            ->update(['shop_id' => $shop->id]);

        $message = 'Boutique créée avec succès.';
        if ($productsUpdated > 0) {
            $message .= " {$productsUpdated} produit(s) ont été automatiquement ajoutés à votre boutique.";
        }

        return back()->with('success', $message);
    }
}
