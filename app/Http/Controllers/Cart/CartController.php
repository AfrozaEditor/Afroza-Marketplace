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

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
