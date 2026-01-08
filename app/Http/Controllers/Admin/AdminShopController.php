<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminShopController extends Controller
{
    /**
     * Afficher la liste des boutiques
     */
    public function index(Request $request)
    {
        $query = Shop::with(['user', 'products'])
            ->withCount(['products', 'followers', 'reviews']);

        // Recherche
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Filtre par statut d'approbation
        if ($approval = $request->get('approval')) {
            if ($approval === 'approved') {
                $query->where('is_approved', true);
            } elseif ($approval === 'pending') {
                $query->where('is_approved', false)->whereNull('rejection_reason');
            } elseif ($approval === 'rejected') {
                $query->where('is_approved', false)->whereNotNull('rejection_reason');
            }
        }

        // Tri
        $sortBy = $request->get('sort', 'created_at');
        $sortDir = $request->get('dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $shops = $query->paginate(15)->withQueryString();

        // Statistiques
        $stats = [
            'total_shops' => Shop::count(),
            'approved_shops' => Shop::where('is_approved', true)->count(),
            'pending_shops' => Shop::where('is_approved', false)->whereNull('rejection_reason')->count(),
            'rejected_shops' => Shop::where('is_approved', false)->whereNotNull('rejection_reason')->count(),
        ];

        return Inertia::render('admin/shops/index', [
            'shops' => $shops,
            'stats' => $stats,
            'filters' => [
                'search' => $request->get('search', ''),
                'approval' => $request->get('approval', ''),
                'sort' => $sortBy,
                'dir' => $sortDir,
            ],
        ]);
    }

    /**
     * Afficher les détails d'une boutique
     */
    public function show(Shop $shop)
    {
        $shop->load(['user', 'products.images', 'products.category', 'reviews.user'])
             ->loadCount(['products', 'followers', 'reviews']);

        return Inertia::render('admin/shops/show', [
            'shop' => $shop,
        ]);
    }

    /**
     * Supprimer une boutique et tous ses produits
     */
    public function destroy(Shop $shop)
    {
        // Charger les produits avec leurs images
        $shop->load('products.images');
        
        // Supprimer les images des produits et les produits
        foreach ($shop->products as $product) {
            foreach ($product->images as $image) {
                if ($image->url) {
                    Storage::disk('s3')->delete($image->url);
                }
            }
            // Supprimer le produit manuellement car la FK a onDelete('set null')
            $product->delete();
        }

        // Supprimer le logo et la cover de la boutique
        if ($shop->logo) {
            Storage::disk('s3')->delete($shop->logo);
        }
        if ($shop->cover_image) {
            Storage::disk('s3')->delete($shop->cover_image);
        }

        // La suppression de la boutique supprimera les reviews et followers en cascade
        $shopName = $shop->name;
        $shop->delete();

        return redirect()->route('admin.shops.index')
            ->with('success', "La boutique \"{$shopName}\" et tous ses produits ont été supprimés.");
    }

    /**
     * Approuver une boutique
     */
    public function approve(Shop $shop)
    {
        $shop->update([
            'is_approved' => true,
            'approved_at' => now(),
            'approved_by' => auth()->id(),
            'rejection_reason' => null,
        ]);

        return back()->with('success', "La boutique \"{$shop->name}\" a été approuvée.");
    }

    /**
     * Rejeter une boutique
     */
    public function reject(Request $request, Shop $shop)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $shop->update([
            'is_approved' => false,
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        return back()->with('success', "La boutique \"{$shop->name}\" a été rejetée.");
    }
}
