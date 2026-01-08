<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminProductController extends Controller
{
    /**
     * Afficher la liste des produits
     */
    public function index(Request $request)
    {
        $query = Product::with(['shop', 'user', 'category', 'images'])
            ->withCount(['reviews', 'favorites']);

        // Recherche
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('shop', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('user', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
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

        // Filtre par statut actif
        if ($status = $request->get('status')) {
            if ($status === 'active') {
                $query->where('active', true);
            } elseif ($status === 'inactive') {
                $query->where('active', false);
            }
        }

        // Filtre par boutique
        if ($shopId = $request->get('shop_id')) {
            $query->where('shop_id', $shopId);
        }

        // Tri
        $sortBy = $request->get('sort', 'created_at');
        $sortDir = $request->get('dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $products = $query->paginate(15)->withQueryString();

        // Statistiques
        $stats = [
            'total_products' => Product::count(),
            'approved_products' => Product::where('is_approved', true)->count(),
            'pending_products' => Product::where('is_approved', false)->whereNull('rejection_reason')->count(),
            'rejected_products' => Product::where('is_approved', false)->whereNotNull('rejection_reason')->count(),
        ];

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'stats' => $stats,
            'filters' => [
                'search' => $request->get('search', ''),
                'status' => $request->get('status', ''),
                'approval' => $request->get('approval', ''),
                'shop_id' => $request->get('shop_id', ''),
                'sort' => $sortBy,
                'dir' => $sortDir,
            ],
        ]);
    }

    /**
     * Afficher les détails d'un produit
     */
    public function show(Product $product)
    {
        $product->load(['shop', 'user', 'category', 'images', 'reviews.user'])
                ->loadCount(['reviews', 'favorites']);

        return Inertia::render('admin/products/show', [
            'product' => $product,
        ]);
    }

    /**
     * Activer/Désactiver un produit
     */
    public function toggleActive(Product $product)
    {
        $product->update(['active' => !$product->active]);

        $status = $product->active ? 'activé' : 'désactivé';
        return back()->with('success', "Le produit a été {$status}.");
    }

    /**
     * Supprimer un produit
     */
    public function destroy(Product $product)
    {
        // Supprimer les images du produit
        foreach ($product->images as $image) {
            if ($image->url) {
                Storage::disk('s3')->delete($image->url);
            }
        }

        $productName = $product->name;
        $product->delete();

        return back()->with('success', "Le produit \"{$productName}\" a été supprimé.");
    }

    /**
     * Approuver un produit
     */
    public function approve(Product $product)
    {
        $product->update([
            'is_approved' => true,
            'approved_at' => now(),
            'approved_by' => auth()->id(),
            'rejection_reason' => null,
        ]);

        return back()->with('success', "Le produit \"{$product->name}\" a été approuvé.");
    }

    /**
     * Rejeter un produit
     */
    public function reject(Request $request, Product $product)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $product->update([
            'is_approved' => false,
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        return back()->with('success', "Le produit \"{$product->name}\" a été rejeté.");
    }
}
