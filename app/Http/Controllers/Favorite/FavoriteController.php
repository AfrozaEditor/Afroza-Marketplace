<?php

namespace App\Http\Controllers\Favorite;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;




class FavoriteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $favorites = Auth::user()->favorites()->get();

            // Générer les URLs temporaires pour chaque produit
        $favorites->transform(function ($product) {
            $images = $product->images()->get();
            $imagesUrls = [];
            foreach ($images as $image) {
                $imagesUrls[] = Storage::disk('s3')->temporaryUrl($image->url, now()->addMinutes(5));
            }
            $product->images = $imagesUrls;
            $product->is_favorite = $product->favorites->contains(auth()->id());
            return $product;
        });

        return Inertia::render('product/Favorites', [
            'favorites' => $favorites,
        ]);
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
    public function show(string $id)
    {
        //
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
