<?php

namespace App\Http\Controllers\Cart;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    private function updateCartTotals(Cart $cart)
    {
    $totals = $cart->items()
        ->join('products', 'cart_items.product_id', '=', 'products.id')
        ->selectRaw('SUM(cart_items.quantity * products.price) as total_price, SUM(cart_items.quantity) as total_quantity')
        ->first();

    $cart->update([
        'total_price' => $totals->total_price ?? 0,
        'total_quantity' => $totals->total_quantity ?? 0
    ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         $request->validate([
        'product_id' => 'required|exists:products,id',
        'quantity' => 'required|integer|min:1'
        ]);

        $user = auth()->user();
        
        // Récupérer ou créer le panier
        $cart = Cart::firstOrCreate([
            'user_id' => $user->id
        ]);

        // Vérifier si le produit existe déjà dans le panier
        $cartItem = $cart->items()->where('product_id', $request->product_id)->first();

        if ($cartItem) {
            // Mettre à jour la quantité si le produit existe déjà
            $cartItem->update([
                'quantity' => $cartItem->quantity + $request->quantity
            ]);
        } else {
            // Ajouter un nouvel item au panier
            $cart->items()->create([
                'product_id' => $request->product_id,
                'quantity' => $request->quantity
            ]);
        }

        // Mettre à jour les totaux du panier
        $this->updateCartTotals($cart);

        return redirect()->back()->with('success', 'Produit ajouté au panier');
    }

    /**
     * Display the specified resource.
     */

    public function myCart()
    {
        $user = auth()->user();
        $cart = Cart::with('items')->where('user_id',$user->id)->first();
        if(!$cart){
            return 'Pas de panier';
        }
        return Inertia::render('cart/Show',[
            'cart' => $cart->load([
                'items.product' // Ceci charge explicitement la relation product pour chaque item
            ])
            ,
        ]);
    }

    public function removeItem($id)
    {
        $cart = Cart::where('user_id', auth()->id())->firstOrFail();
        $cart->items()->findOrFail($id)->delete();
        
        $this->updateCartTotals($cart);

        return redirect()->back();
    }

    public function clearCart()
    {
        $user = auth()->user();
        $cart = Cart::where('user_id', $user->id)->first();

        if ($cart) {
            // Supprimer tous les articles du panier
            $cart->items()->delete();
            
            // Mettre à jour les totaux
            $cart->update([
                'total_price' => 0,
                'total_quantity' => 0
            ]);

            return redirect()->back()->with('success', 'Le panier a été vidé');
        }

        return redirect()->back()->with('error', 'Panier non trouvé');
    }

    public function show(string $id)
    {
//        $cart = Cart::with('items')->find($id);
//        return Inertia::render('cart/Show',[
//            'cart' => $cart,
//        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
