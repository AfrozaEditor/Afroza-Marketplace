<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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
        $query = Product::with(['category', 'shop', 'user']);

    // Filtre par catégorie
    if ($request->filled('category')&& $request->category !== '0') {
        $query->where('category_id', $request->category);
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
        return $product;
    });

    $categories = Category::all();

        return Inertia::render('product/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
            'category' => $request->get('category', '0'),
            'search' => $request->get('search', ''),
            'min_price' => $request->get('min_price', '0'),
            'max_price' => $request->get('max_price', '60000'),
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
            'categories'=>Category::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated =$request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|numeric|min:1',
            // 'category' => 'required|exists:categories,id',
            'category' => 'required|string',
            // 'images' => 'required|array',
           'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',

        ]);

        $user = Auth::user();

        $productData = [
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'quantity' => $validated['stock'],
            'category_id' => Category::where('name', $validated['category'])->first()->id,
            'user_id' => Auth::id(),
            'slug' => Str::slug("$validated[name] de $user->name"),
        ];

        if ($user->shop) {
        $productData['shop_id'] = $user->shop->id;
        }

        $product = Product::create($productData);

        if($request->hasfile('images')){
            foreach($request->file('images') as $image){
                $imageName = time().'.'.$image->getClientOriginalExtension();
                $path = Storage::disk('s3')->putFileAs('products', $image, $imageName);
                $product->images()->create(['url' => $path]);
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $product = Product::where('slug', $slug)->with(['category', 'shop', 'user'])->firstOrFail();
        $images = $product->images()->get();
        $imagesUrls =[];
        foreach($images as $image){
            $imagesUrls[] = Storage::disk('s3')->temporaryUrl($image->url, now()->addMinutes(30));
        }
        return Inertia::render('product/Show',[
            'product' => $product,
            'images' => $imagesUrls,
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
