<?php

namespace App\Http\Controllers\Marketplace;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Notifications\NewShopFollower;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MarketplaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Shop::with(['products', 'followers', 'reviews']);

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
                  ->orWhereRaw('LOWER(description) LIKE ?', ['%' . strtolower($search) . '%']);
            });
        }

        // Rating filter - filter shops with average rating >= min_rating
        if ($request->filled('min_rating') && $request->min_rating > 0) {
            $minRating = (float) $request->min_rating;
            $query->whereHas('reviews', function($q) use ($minRating) {
                $q->havingRaw('AVG(rating) >= ?', [$minRating]);
            }, '>=', 1);
        }

        // Products count filter
        if ($request->filled('min_products')) {
            $minProducts = (int) $request->min_products;
            $query->has('products', '>=', $minProducts);
        }
        if ($request->filled('max_products')) {
            $maxProducts = (int) $request->max_products;
            $query->has('products', '<=', $maxProducts);
        }

        // City filter
        if ($request->filled('city') && $request->city !== 'all') {
            $query->where('city', $request->city);
        }

        // Sorting
        $sortBy = $request->get('sort', 'newest');
        switch ($sortBy) {
            case 'rating':
                $query->withAvg('reviews', 'rating')->orderByDesc('reviews_avg_rating');
                break;
            case 'products':
                $query->withCount('products')->orderByDesc('products_count');
                break;
            case 'followers':
                $query->withCount('followers')->orderByDesc('followers_count');
                break;
            case 'name':
                $query->orderBy('name', 'asc');
                break;
            case 'newest':
                $query->orderByDesc('created_at');
                break;
            default:
                $query->orderByDesc('created_at');
        }

        $shops = $query->paginate(6)->withQueryString();

        // Générer les URLs temporaires pour les logos et images de couverture
        foreach ($shops as $shop) {
            if ($shop->logo) {
                $logo_url = Storage::disk('s3')->temporaryUrl($shop->logo, now()->addMinutes(30));
                $shop->logo = $logo_url;
            }
            if ($shop->cover_image) {
                $cover_image_url = Storage::disk('s3')->temporaryUrl($shop->cover_image, now()->addMinutes(30));
                $shop->cover_image = $cover_image_url;
            }
        }

        // Get all unique cities for filter
        $cities = Shop::distinct()->pluck('city')->filter()->values();

        return Inertia::render('marketplace/Index', [
            'shops' => $shops,
            'cities' => $cities,
            'filters' => [
                'search' => $request->get('search', ''),
                'min_rating' => $request->get('min_rating', 0),
                'min_products' => $request->get('min_products', 0),
                'max_products' => $request->get('max_products', 200),
                'city' => $request->get('city', ''),
                'sort' => $request->get('sort', 'rating'),
            ]
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
            'description' => 'required|string|min:20',
            'address' => 'required|string|min:5',
            'city' => 'required|string|min:2',
            'phone' => 'required|string|min:8',
            'email' => 'required|email',
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
    public function show(Request $request, string $slug)
    {
        $shop = Shop::where('slug', $slug)->with(['products.user', 'user', 'followers', 'reviews'])->firstOrFail();

        // Ajouter cette ligne pour vérifier si l'utilisateur suit la boutique
    $shop->is_followed = $shop->followers->contains(auth()->id());

        // Générer les URLs temporaires si les fichiers existent
        if ($shop->logo) {
            $shop->logo_url = Storage::disk('s3')->temporaryUrl($shop->logo, now()->addMinutes(5));
        }

        if ($shop->cover_image) {
            $shop->cover_image_url = Storage::disk('s3')->temporaryUrl($shop->cover_image, now()->addMinutes(5));
        }

        // Construire la requête des produits avec filtres
        $productsQuery = $shop->products()->with(['user', 'reviews', 'category']);

        // Filtre par recherche
        if ($request->filled('search')) {
            $search = $request->search;
            $productsQuery->where(function($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
                  ->orWhereRaw('LOWER(description) LIKE ?', ['%' . strtolower($search) . '%']);
            });
        }

        // Filtre par catégorie
        if ($request->filled('category') && $request->category !== 'all') {
            $productsQuery->where('category_id', $request->category);
        }

        // Filtre par prix minimum
        if ($request->filled('min_price')) {
            $productsQuery->where('price', '>=', (float) $request->min_price);
        }

        // Filtre par prix maximum
        if ($request->filled('max_price')) {
            $productsQuery->where('price', '<=', (float) $request->max_price);
        }

        // // Filtre par état
        // if ($request->filled('condition') && $request->condition !== 'all') {
        //     $productsQuery->where('etat', $request->condition);
        // }

        // Tri
        $sortBy = $request->get('sort', 'newest');
        switch ($sortBy) {
            case 'price-asc':
                $productsQuery->orderBy('price', 'asc');
                break;
            case 'price-desc':
                $productsQuery->orderBy('price', 'desc');
                break;
            case 'popular':
                $productsQuery->withCount('favorites')->orderByDesc('favorites_count');
                break;
            case 'newest':
            default:
                $productsQuery->orderBy('created_at', 'desc');
        }

        $products = $productsQuery->paginate(6)->withQueryString();

        $products->transform(function ($product) {
            $images = $product->images()->get();
            $imagesUrls = [];
            foreach ($images as $image) {
                $imagesUrls[] = Storage::disk('s3')->temporaryUrl($image->url, now()->addMinutes(5));
            }
            $product->images = $imagesUrls;
            $product->is_favorite = $product->favorites->contains(auth()->id());
            return $product;
        });

        $userId = auth()->id();

        // Récupère l'avis de l'utilisateur connecté s'il existe
        $userReview = $shop->reviews->where('user_id', $userId)->first();

        $shop->user_review = $userReview;
        return Inertia::render('marketplace/Show', [
            'shop' => $shop,
            'products' => $products
        ]);
    }

    public function toggleFollow(Request $request, string $slug)
    {
        $shop = Shop::where('slug', $slug)->with('user')->firstOrFail();
        $user = auth()->user();

        // La méthode toggle() ajoute le lien si inexistant, ou le supprime si existant.
        // Elle retourne un tableau avec 'attached' et 'detached' (les IDs).
        $syncResult = $shop->followers()->toggle($user->id);
        $isFollowing = !empty($syncResult['attached']);

        // Notifier le vendeur uniquement si c'est un nouveau follow (pas un unfollow)
        if ($isFollowing && $shop->user && $shop->user->id !== $user->id) {
            $shop->user->notify(new NewShopFollower($user, $shop));
        }

        return back()->with([
        'isFollowing' => $isFollowing,
        'success' => $isFollowing
            ? 'Vous suivez maintenant cette boutique.'
            : 'Vous ne suivez plus cette boutique.'
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
