<?php

use App\Http\Controllers\Blog\BlogController;
use App\Http\Controllers\Cart\CartController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\Marketplace\MarketplaceController;
use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Promotion\PromotionController;
use App\Http\Controllers\Review\ProductReviewController;
use App\Http\Controllers\Review\ShopReviewController;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Http\Controllers\GoogleController;

Route::get('/', function () {
    $latestProducts = Product::with(['category', 'shop', 'user','reviews'])
        ->orderBy('created_at', 'desc')
        ->take(4)
        ->get();
    // Générer les URLs temporaires pour chaque produit
    $latestProducts->transform(function ($product) {
        $images = $product->images()->get();
        $imagesUrls = [];
        foreach ($images as $image) {
            $imagesUrls[] = Storage::disk('s3')->temporaryUrl($image->url, now()->addMinutes(5));
        }
        $product->images = $imagesUrls;
        return $product;
    });
    return Inertia::render('home', [
        'latestProducts' => $latestProducts,
        'categories' => Category::all(),
    ]);
})->name('home');

Route::get('features', function (){
    return Inertia::render('feature');
});

Route::middleware(['auth', 'verified','role:vendor'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        $products = Product::with('user')->where('user_id',$user->id)->get();
        return Inertia::render('vendor/dashboard',[
            'products' => $products,
        ]);
    })->name('dashboard');
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::resource('products', ProductController::class);
    Route::resource('marketplace', MarketplaceController::class);

});

Route::middleware(['auth', 'role:delivery'])->group(function () {
    Route::get('delivery', function () {
        return Inertia::render('delivery/Create');
    })->name('delivery');
});

Route::middleware(['auth', 'verified','role:admin'])->group(function () {
    Route::get('admin', function () {
        return Inertia::render('admin/dashboard',[
            'users' => User::all(),
        ]);
    })->name('admin');
});

Route::middleware('auth')->group(function () {
    // Chat routes
    Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');
    Route::get('/chat/users', [ChatController::class, 'users'])->name('chat.users');
    Route::get('/chat/{conversation}', [ChatController::class, 'show'])->name('chat.show');
    Route::get('/chat/{conversation}/messages', [ChatController::class, 'getMessages'])->name('chat.messages');
    Route::post('/chat/start/{user}', [ChatController::class, 'startConversation'])->name('chat.start');
    Route::post('/chat/{conversation}/message', [ChatController::class, 'sendMessage'])->name('chat.message');

    // Cart routes
    Route::resource('cart', CartController::class)->only(['store']);
    Route::get('/my-cart', [CartController::class, 'myCart'])->name('my-cart');
    Route::post('/cart/clear', [CartController::class, 'clearCart'])->name('cart.clear');
    Route::patch('/cart/items/{id}', [CartController::class, 'updateQuantity'])->name('cart.update-quantity');
    Route::delete('/cart/items/{id}', [CartController::class, 'removeItem'])->name('cart.remove-item');

    // Order routes
    Route::resource('order', OrderController::class);

    // Followed shops
    Route::post('/shops/{slug}/follow', [MarketplaceController::class, 'toggleFollow'])->name('shops.follow');

    // Favorites
    Route::post('/products/{slug}/favorite', [ProductController::class, 'toggleFavorite'])->name('products.favorite');
    Route::get('/favorites', [ProductController::class, 'favorites'])->name('favorites');

    // Shop reviews
    Route::resource('shop_reviews', ShopReviewController::class)->only(['store','update']);
    Route::post('/shop-reviews/{review}/vote', [ShopReviewController::class, 'vote'])->name('shop_reviews.vote');
    Route::post('/shop-reviews/{review}/report', [ShopReviewController::class, 'report'])->name('shop_reviews.report');


    // Product reviews
    Route::resource('product_reviews', ProductReviewController::class)->only(['store','update']);
    Route::post('/product-reviews/{review}/vote', [ProductReviewController::class, 'vote'])->name('product_reviews.vote');
    Route::post('/product-reviews/{review}/report', [ProductReviewController::class, 'report'])->name('product_reviews.report');
});

 Route::get('/shop-reviews/user/{shop}', [ShopReviewController::class, 'userReview'])->name('shop_reviews.user');
 Route::get('/product-reviews/user/{product}', [ProductReviewController::class, 'userReview'])->name('product_reviews.user');


Route::resource('marketplace', MarketplaceController::class)->only(['index', 'show']);
Route::resource('products', ProductController::class)->only(['index', 'show']);
Route::resource('promotions', PromotionController::class);
Route::resource('blog', BlogController::class)->only(['index', 'show']);
Route::get('/contact', function () {
   return Inertia::render('contact');
});
Route::get('/about', function () {
   return Inertia::render('about');
});
Route::get('/help', function () {
    return Inertia::render('help');
});


Route::get('auth/google', [GoogleController::class, 'redirectToGoogle']);
Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);

//Route::get('/available',[ProductController::class, 'index']);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
