<?php

use App\Http\Controllers\Blog\BlogController;
use App\Http\Controllers\Cart\CartController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\Marketplace\MarketplaceController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Promotion\PromotionController;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home', [
        'latestProducts' => Product::with(['category', 'shop', 'user'])
            ->orderBy('created_at', 'desc')
            ->take(4)
            ->get()
    ]);
})->name('home');

Route::get('features', function (){
    return Inertia::render('feature');
});

Route::middleware(['auth', 'verified','role:vendor'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('vendor/dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified','role:admin'])->group(function () {
    Route::get('admin', function () {
        return Inertia::render('admin/dashboard');
    })->name('admin');
});

Route::middleware('auth')->group(function () {
    Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');
    Route::get('/chat/users', [ChatController::class, 'users'])->name('chat.users');
    Route::get('/chat/{conversation}', [ChatController::class, 'show'])->name('chat.show');
    Route::post('/chat/start/{user}', [ChatController::class, 'startConversation'])->name('chat.start');
    Route::post('/chat/{conversation}/message', [ChatController::class, 'sendMessage'])->name('chat.message');
});


Route::resource('marketplace', MarketplaceController::class);
Route::resource('products', ProductController::class);
Route::resource('promotions', PromotionController::class);
Route::resource('blog', BlogController::class)->only(['index', 'show']);
//Route::resource('cart', CartController::class);
Route::get('/my-cart', [CartController::class, 'myCart'])->name('my-cart');
Route::get('/available',[ProductController::class, 'index']);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
