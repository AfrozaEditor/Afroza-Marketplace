<?php

namespace App\Http\Controllers\Marketplace;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MarketplaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $shops = Shop::with('products')->get();

        // Générer les URLs temporaires pour les logos et images de couverture
        foreach ($shops as $shop) {
            if ($shop->logo) {
                $shop->logo_url = Storage::disk('s3')->temporaryUrl($shop->logo, now()->addMinutes(5));
            }
            if ($shop->cover_image) {
                $shop->cover_image_url = Storage::disk('s3')->temporaryUrl($shop->cover_image, now()->addMinutes(5));
            }
        }


        return Inertia::render('marketplace/Index',[
            'shops' => $shops,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('marketplace/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // 'name' => 'required|string|min:3|unique:shops,name',
            'name' => 'required|string|min:3',
            'description' => 'nullable|string|min:20',
            'address' => 'nullable|string|min:5',
            'city' => 'nullable|string|min:2',
            'phone' => 'nullable|string|min:8',
            'email' => 'nullable|email',
            'website' => 'nullable|url',
            'facebook' => 'nullable|url',
            'instagram' => 'nullable|url',
            'logo' => 'nullable|image|max:1024', // 1MB max
            'cover_image' => 'nullable|image|max:3072', // 3MB max
            // 'acceptTerms' => 'required|accepted'

        ]);

        try {
        // Gérer l'upload du logo
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->storePublicly('shops/logos', 's3');
            $validated['logo'] = $logoPath;
        }

        // Gérer l'upload de l'image de couverture
        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->storePublicly('shops/covers', 's3');
            $validated['cover_image'] = $coverPath;
        }

        // Créer un slug unique pour la boutique
        $validated['slug'] = Str::slug($validated['name']);
        
        // Ajouter l'ID de l'utilisateur
        $validated['user_id'] = auth()->id();

        // Créer la boutique
        $shop = Shop::create($validated);

        return redirect()
            ->route('marketplace.show', $shop->slug)
            ->with('success', 'Votre boutique a été créée avec succès!');

        } catch (\Exception $e) {
            // Supprimer les fichiers uploadés en cas d'erreur
            if (isset($logoPath)) {
                Storage::disk('s3')->delete($logoPath);
            }
            if (isset($coverPath)) {
                Storage::disk('s3')->delete($coverPath);
            }

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Une erreur est survenue lors de la création de la boutique.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $shop = Shop::where('slug', $slug)->with(['products', 'user' ])->firstOrFail();

        // Générer les URLs temporaires si les fichiers existent
        if ($shop->logo) {
            $shop->logo_url = Storage::disk('s3')->temporaryUrl($shop->logo, now()->addMinutes(5));
        }
        
        if ($shop->cover_image) {
            $shop->cover_image_url = Storage::disk('s3')->temporaryUrl($shop->cover_image, now()->addMinutes(5));
        }
        
        return Inertia::render('marketplace/Show', [
            'shop' => $shop,
        ]);
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
