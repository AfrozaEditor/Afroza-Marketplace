<?php

use App\Http\Controllers\Marketplace\MarketplaceController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Promotion\PromotionController;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home', [
        'latestProducts' => Product::with(['category', 'shop'])
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
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::resource('marketplace', MarketplaceController::class);
Route::resource('products', ProductController::class);
Route::resource('promotions', PromotionController::class);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
