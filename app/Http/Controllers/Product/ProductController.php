<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // $products = Product::with(['category', 'shop', 'user'])
        // ->orderBy('created_at', 'desc')
        // ->paginate(9);
        $query = Product::with(['category', 'shop', 'user', 'reviews']);

    // Filtre par catégorie (inclut les sous-catégories)
    if ($request->filled('category') && $request->category !== '0') {
        $categoryId = $request->category;
        $category = Category::with('children')->find($categoryId);
        
        if ($category) {
            // Récupérer les IDs de cette catégorie et de ses enfants
            $categoryIds = [$category->id];
            if ($category->children && $category->children->count() > 0) {
                $categoryIds = array_merge($categoryIds, $category->children->pluck('id')->toArray());
            }
            $query->whereIn('category_id', $categoryIds);
        }
    }

    // Filtre par recherche
    // if ($request->has('search')) {
    //     $query->where('name', 'like', '%' . $request->search . '%');
    // }
    // if ($request->filled('search')) {
    // $search = $request->search;
    // $query->where(function($q) use ($search) {
    //     $q->where('name', 'like', '%' . $search . '%')
    //       ->orWhere('description', 'like', '%' . $search . '%');
    // });
    // }
    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function($q) use ($search) {
            $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
              ->orWhereRaw('LOWER(description) LIKE ?', ['%' . strtolower($search) . '%']);
        });
    }

    // Filtre par prix
    if ($request->has('min_price')) {
        $query->where('price', '>=', $request->min_price);
    }
    if ($request->has('max_price')) {
        $query->where('price', '<=', $request->max_price);
    }

    // Tri
    $sort = $request->get('sort', 'newest');
    switch ($sort) {
        case 'price-asc':
            $query->orderBy('price', 'asc');
            break;
        case 'price-desc':
            $query->orderBy('price', 'desc');
            break;
        default:
            $query->orderBy('created_at', 'desc');
    }

    $products = $query->paginate(9)->withQueryString();

        // Générer les URLs temporaires pour chaque produit
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

    // Charger les catégories parents avec leurs enfants
    $categories = Category::whereNull('parent_id')
        ->with('children')
        ->orderBy('name')
        ->get();

        return Inertia::render('product/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
            'category' => $request->get('category', '0'),
            'search' => $request->get('search', ''),
            'min_price' => $request->get('min_price', '0'),
            'max_price' => $request->get('max_price', '2000000'),
            'sort' => $sort
        ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('product/Create',[
            'categories' => Category::whereNull('parent_id')
                ->with('children')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated =$request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|numeric|min:1',
            'category_id' => 'nullable|integer|exists:categories,id',
            'category' => 'nullable|string',
            'images' => 'required|array|min:1|max:6',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',

        ]);

        $categoryId = $validated['category_id'] ?? null;

        if (!$categoryId && !empty($validated['category'])) {
            $categoryId = Category::where('name', $validated['category'])->value('id');
        }

        if (!$categoryId) {
            throw ValidationException::withMessages([
                'category_id' => 'Veuillez sélectionner une sous-catégorie valide.',
            ]);
        }

        $selectedCategory = Category::find($categoryId);

        if (!$selectedCategory || is_null($selectedCategory->parent_id)) {
            throw ValidationException::withMessages([
                'category_id' => 'Veuillez sélectionner une catégorie enfant (sous-catégorie).',
            ]);
        }

        $user = Auth::user();

        $productData = [
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'quantity' => $validated['stock'],
            'category_id' => $selectedCategory->id,
            'user_id' => Auth::id(),
            'slug' => Str::slug("$validated[name] de $user->name"),
        ];

        if ($user->shop) {
        $productData['shop_id'] = $user->shop->id;
        }

        $product = Product::create($productData);

        if($request->hasfile('images')){
            foreach($request->file('images') as $image){
                $imageName = Str::uuid().'.'.$image->getClientOriginalExtension();
                $path = Storage::disk('s3')->putFileAs('products', $image, $imageName);
                $product->images()->create(['url' => $path]);
            }
        }

        return back()->with('success', 'Produit créé avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $product = Product::where('slug', $slug)->with(['category', 'shop', 'user', 'reviews'])->firstOrFail();
        $product->is_favorite = $product->favorites->contains(auth()->id());
        $images = $product->images()->get();
        $imagesUrls =[];
        foreach($images as $image){
            $imagesUrls[] = Storage::disk('s3')->temporaryUrl($image->url, now()->addMinutes(30));
        }

        $userId = auth()->id();

        // Récupère l'avis de l'utilisateur connecté s'il existe
        $userReview = $product->reviews->where('user_id', $userId)->first();

        $product->user_review = $userReview;

        return Inertia::render('product/Show',[
            'product' => $product,
            'images' => $imagesUrls,
        ]);
    }

    public function toggleFavorite(Request $request, string $slug)
    {
        $product = Product::where('slug', $slug)->firstOrFail();
        $user = auth()->user(); // Ou auth()->user();

        // La méthode toggle() ajoute le lien si inexistant, ou le supprime si existant.
        // Elle retourne un tableau avec 'attached' et 'detached' (les IDs).
        $syncResult = $product->favorites()->toggle($user->id);
        $isFavorite = !empty($syncResult['attached']);

        return back()->with([
        'isFavorite' => $isFavorite,
        'success' => $isFavorite
            ? 'Produit ajouté à vos favoris.'
            : 'Produit retiré de vos favoris.'
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
        $product = Product::findOrFail($id);
        // Supprimer les images associées du stockage S3
        foreach ($product->images as $image) {
            $imagePath = parse_url($image->url, PHP_URL_PATH);
            Storage::disk('s3')->delete(ltrim($imagePath, '/'));
    }

        $product->delete();

        return back()->with('success', 'Produit supprimé avec succès.');
    }

    public function favorites()
    {
        return Inertia::render('product/Favorites');
    }
}
