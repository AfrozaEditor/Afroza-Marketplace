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
    public function index()
    {
        $products = Product::with(['category', 'shop', 'user'])
        ->orderBy('created_at', 'desc')
        ->paginate(10);

        // Générer les URLs temporaires pour chaque produit
    $products->transform(function ($product) {
        $images = $product->images()->get();
        $imagesUrls = [];
        foreach ($images as $image) {
            $imagesUrls[] = Storage::disk('s3')->temporaryUrl($image->url, now()->addMinutes(30));
        }
        $product->images = $imagesUrls;
        return $product;
    });

        return Inertia::render('product/Index', [
            'products' => $products
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
            'stock' => 'required|numeric|min:0',
            // 'category' => 'required|exists:categories,id',
            'category' => 'required|string',
            // 'images' => 'required|array',
           'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',

        ]);

        $user = Auth::user();

        $product = Product::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'quantity' => $validated['stock'],
            'category_id' => Category::where('name', $validated['category'])->first()->id,
            'user_id' => Auth::id(),
            'slug' => Str::slug("$validated[name] de $user->name"),
        ]);

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
