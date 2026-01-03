<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the user's orders.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        $query = Order::with(['items.product.user', 'delivery'])
            ->where('user_id', $user->id)
            ->latest();

        // Filtrer par statut si fourni
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $orders = $query->paginate(10)->withQueryString();
        
        // Transform orders to add image URLs
        $orders->getCollection()->transform(function ($order) {
            return $this->transformOrderWithImages($order);
        });

        return Inertia::render('order/Index', [
            'orders' => $orders,
            'filters' => [
                'status' => $request->status ?? 'all',
            ],
        ]);
    }

    /**
     * Show the form for creating a new order (checkout).
     */
    public function create()
    {
        $user = auth()->user();
        $cart = Cart::with(['items.product.user', 'items.product.shop'])
            ->where('user_id', $user->id)
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('products.index')
                ->with('error', 'Votre panier est vide.');
        }
        
        // Transform cart items with images
        $cart->items->transform(function ($item) {
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

        return Inertia::render('order/Create', [
            'cart' => $cart,
            'user' => $user,
        ]);
    }

    /**
     * Store a newly created order.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'delivery_address' => 'required|string|max:500',
            'delivery_city' => 'required|string|max:100',
            'delivery_region' => 'required|string|max:100',
            'delivery_postal_code' => 'nullable|string|max:20',
            'delivery_address_latitude' => 'required|numeric',
            'delivery_address_longitude' => 'required|numeric',
            'shipping_method' => 'required|in:standard,express,pickup',
            'payment_method' => 'required|in:card,mobile_money,cash_on_delivery,bank_transfer',
            'notes' => 'nullable|string|max:1000',
        ]);

        $user = auth()->user();
        $cart = Cart::with('items.product')
            ->where('user_id', $user->id)
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return back()->withErrors(['cart' => 'Votre panier est vide.']);
        }

        // Calculer les totaux
        $subtotal = $cart->items->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });
        
        $shippingCost = match($validated['shipping_method']) {
            'express' => 2000,
            'pickup' => 0,
            default => 0,
        };

        try {
            DB::beginTransaction();

            // Créer la commande
            $order = Order::create([
                'user_id' => $user->id,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'delivery_address' => $validated['delivery_address'],
                'delivery_city' => $validated['delivery_city'],
                'delivery_region' => $validated['delivery_region'],
                'delivery_postal_code' => $validated['delivery_postal_code'] ?? null,
                'delivery_address_latitude' => $validated['delivery_address_latitude'],
                'delivery_address_longitude' => $validated['delivery_address_longitude'],
                'shipping_method' => $validated['shipping_method'],
                'shipping_cost' => $shippingCost,
                'payment_method' => $validated['payment_method'],
                'payment_status' => 'pending',
                'status' => 'pending',
                'total' => $subtotal,
                'notes' => $validated['notes'] ?? null,
            ]);

            // Créer les items de la commande
            foreach ($cart->items as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->product->price,
                ]);

                // Réduire le stock du produit
                $cartItem->product->decrement('quantity', $cartItem->quantity);
            }

            // Vider le panier
            $cart->items()->delete();

            DB::commit();

            // Si paiement à la livraison, confirmer directement
            if ($validated['payment_method'] === 'cash_on_delivery') {
                $order->update(['status' => 'confirmed']);
            }

            return redirect()->route('order.show', $order->id)
                ->with('success', 'Commande créée avec succès !');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Une erreur est survenue lors de la création de la commande.']);
        }
    }

    /**
     * Display the specified order.
     */
    public function show(string $id)
    {
        $user = auth()->user();
        
        $order = Order::with(['items.product.user', 'items.product.shop', 'delivery'])
            ->where('user_id', $user->id)
            ->findOrFail($id);
        
        $order = $this->transformOrderWithImages($order);

        return Inertia::render('order/Show', [
            'order' => $order,
        ]);
    }
    
    /**
     * Transform order to add product images
     */
    protected function transformOrderWithImages(Order $order): Order
    {
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
    }

    /**
     * Cancel an order.
     */
    public function cancel(Request $request, string $id)
    {
        $user = auth()->user();
        
        $order = Order::where('user_id', $user->id)
            ->findOrFail($id);

        if (!$order->canBeCancelled()) {
            return back()->withErrors(['error' => 'Cette commande ne peut plus être annulée.']);
        }

        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        try {
            DB::beginTransaction();

            // Restaurer le stock des produits
            foreach ($order->items as $item) {
                $item->product->increment('quantity', $item->quantity);
            }

            // Annuler la commande
            $order->cancel($validated['reason'] ?? null);

            DB::commit();

            return back()->with('success', 'Commande annulée avec succès.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Une erreur est survenue lors de l\'annulation.']);
        }
    }

    /**
     * Track order status.
     */
    public function track(string $orderNumber)
    {
        $order = Order::with(['items.product'])
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        return Inertia::render('order/Track', [
            'order' => $order,
        ]);
    }

    /**
     * Update the specified resource in storage (admin).
     */
    public function update(Request $request, string $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'status' => 'sometimes|in:pending,confirmed,processing,shipped,out_for_delivery,delivered,cancelled,refunded',
            'tracking_number' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:1000',
        ]);

        $order->update($validated);

        // Actions spécifiques selon le statut
        if (isset($validated['status'])) {
            match($validated['status']) {
                'shipped' => $order->update(['shipped_at' => now()]),
                'delivered' => $order->update(['delivered_at' => now()]),
                'cancelled' => $order->update(['cancelled_at' => now()]),
                default => null,
            };
        }

        return back()->with('success', 'Commande mise à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $order = Order::findOrFail($id);
        
        // Ne supprimer que les commandes annulées
        if ($order->status !== 'cancelled') {
            return back()->withErrors(['error' => 'Seules les commandes annulées peuvent être supprimées.']);
        }

        $order->items()->delete();
        $order->delete();

        return redirect()->route('order.index')
            ->with('success', 'Commande supprimée avec succès.');
    }
}
