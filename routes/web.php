<?php

use App\Http\Controllers\Blog\BlogController;
use App\Http\Controllers\Cart\CartController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\Marketplace\MarketplaceController;
use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\Payment\PaymentController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Favorite\FavoriteController;
use App\Http\Controllers\Promotion\PromotionController;
use App\Http\Controllers\Review\ProductReviewController;
use App\Http\Controllers\Review\ShopReviewController;
use App\Http\Controllers\Report\ReportController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Delivery\DeliveryController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\NotificationController;
use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

Route::get('/', function () {
    $makeImageUrls = function ($product) {
        $images = $product->images()->get();
        $imagesUrls = [];
        foreach ($images as $image) {
            $imagesUrls[] = Storage::disk('s3')->temporaryUrl($image->url, now()->addMinutes(30));
        }
        $product->images = $imagesUrls;
        $product->is_favorite = $product->favorites->contains(auth()->id());
        return $product;
    };

    // Derniers produits
    $latestProducts = Product::with(['category', 'shop', 'user', 'reviews', 'favorites'])
        ->visible()
        ->orderBy('created_at', 'desc')
        ->take(12)
        ->get()
        ->map($makeImageUrls);

    // Produits mis en avant (pilotés par les notes + nombre d'avis)
    $ratedFeaturedProducts = Product::with(['category', 'shop', 'user', 'reviews', 'favorites'])
        ->visible()
        ->has('reviews')
        ->withAvg('reviews', 'rating')
        ->withCount('reviews')
        ->orderByRaw('reviews_avg_rating DESC NULLS LAST')
        ->orderByDesc('reviews_count')
        ->take(8)
        ->get();

    // Fallback dynamique: on complète avec les plus récents si pas assez de produits notés
    if ($ratedFeaturedProducts->count() < 8) {
        $missingCount = 8 - $ratedFeaturedProducts->count();

        $fallbackFeatured = Product::with(['category', 'shop', 'user', 'reviews', 'favorites'])
            ->visible()
            ->whereNotIn('id', $ratedFeaturedProducts->pluck('id'))
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->latest('created_at')
            ->take($missingCount)
            ->get();

        $featuredProducts = $ratedFeaturedProducts
            ->concat($fallbackFeatured)
            ->map($makeImageUrls)
            ->values();
    } else {
        $featuredProducts = $ratedFeaturedProducts
            ->map($makeImageUrls)
            ->values();
    }

    // Produits par catégorie (top 4 catégories avec le plus de produits)
    $topCategories = Category::whereNull('parent_id')
        ->withCount(['products' => fn($q) => $q->visible()])
        ->orderByDesc('products_count')
        ->take(4)
        ->get();

    $productsByCategory = $topCategories->map(function ($category) use ($makeImageUrls) {
        $products = Product::with(['category', 'shop', 'user', 'reviews', 'favorites'])
            ->visible()
            ->where('category_id', $category->id)
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get()
            ->map($makeImageUrls);

        return [
            'category' => $category,
            'products' => $products,
        ];
    })->filter(fn($item) => $item['products']->count() > 0)->values();

    // Boutiques disponibles
    $shops = Shop::with(['user', 'products'])
        ->visible()
        ->withCount('products')
        ->orderByDesc('products_count')
        ->take(8)
        ->get()
        ->map(function ($shop) {
            if ($shop->logo) {
                $shop->logo_url = Storage::disk('s3')->temporaryUrl($shop->logo, now()->addMinutes(30));
            }
            if ($shop->cover_image) {
                $shop->cover_url = Storage::disk('s3')->temporaryUrl($shop->cover_image, now()->addMinutes(30));
            }
            return $shop;
        });

    return Inertia::render('home', [
        'latestProducts' => $latestProducts,
        'featuredProducts' => $featuredProducts,
        'productsByCategory' => $productsByCategory,
        'shops' => $shops,
        'categories' => Category::with('children')->whereNull('parent_id')->get(),
    ]);
})->name('home');

Route::get('features', function () {
    return Inertia::render('feature');
});

Route::get('/generate-sitemap', function () {
    Sitemap::create()
        ->add(Url::create('/'))
        ->add(Url::create('/marketplace'))
        ->add(Url::create('/blog'))
        ->add(Url::create('/contact'))
        ->add(Url::create('/products'))
        ->writeToFile(public_path('sitemap.xml'));

    return 'Sitemap generated';
});


Route::middleware(['auth', 'verified', 'role:vendor'])->group(function () {
    Route::get('dashboard', [App\Http\Controllers\Vendor\VendorDashboardController::class, 'index'])->name('dashboard');
    Route::post('vendor/shop', [App\Http\Controllers\Vendor\VendorDashboardController::class, 'createShop'])->name('vendor.shop.create');
    Route::put('vendor/shop', [App\Http\Controllers\Vendor\VendorDashboardController::class, 'updateShop'])->name('vendor.shop.update');
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::resource('products', ProductController::class);
    Route::resource('marketplace', MarketplaceController::class);
    
    // Vendor orders management
    Route::get('vendor/orders', [App\Http\Controllers\Vendor\VendorOrderController::class, 'index'])->name('vendor.orders');
    Route::get('vendor/orders/{order}', [App\Http\Controllers\Vendor\VendorOrderController::class, 'show'])->name('vendor.orders.show');
    Route::patch('vendor/orders/{order}/status', [App\Http\Controllers\Vendor\VendorOrderController::class, 'updateStatus'])->name('vendor.orders.update-status');

});

Route::middleware(['auth', 'role:delivery'])->group(function () {
    Route::get('delivery/profile', [DeliveryController::class, 'show'])->name('delivery.profile');
    Route::get('delivery-dashboard', [DeliveryController::class, 'dashboard'])->name('delivery-dashboard');
    Route::get('delivery/pending-approval', [DeliveryController::class, 'pendingApproval'])->name('delivery.pending-approval');
    Route::get('/delivery/available-orders', [DeliveryController::class, 'availableOrders'])->name('delivery.available-orders');
    Route::get('/delivery/assigned-orders', [DeliveryController::class, 'assignedOrders'])->name('delivery.assigned-orders');
    Route::post('/delivery/accept-order/{orderId}', [DeliveryController::class, 'acceptOrder'])->name('delivery.accept-order');
    Route::patch('/delivery/update-order-status/{orderId}', [DeliveryController::class, 'updateOrderStatus'])->name('delivery.update-order-status');
});

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('admin', function () {
        return Inertia::render('admin/dashboard', [
            'users' => User::all(),
        ]);
    })->name('admin');
    
    // User management routes
    Route::get('/admin/users', [App\Http\Controllers\Admin\AdminUserController::class, 'index'])->name('admin.users.index');
    Route::post('/admin/users', [App\Http\Controllers\Admin\AdminUserController::class, 'store'])->name('admin.users.store');
    Route::put('/admin/users/{user}', [App\Http\Controllers\Admin\AdminUserController::class, 'update'])->name('admin.users.update');
    Route::patch('/admin/users/{user}/role', [App\Http\Controllers\Admin\AdminUserController::class, 'updateRole'])->name('admin.users.update-role');
    Route::post('/admin/users/{user}/block', [App\Http\Controllers\Admin\AdminUserController::class, 'block'])->name('admin.users.block');
    Route::post('/admin/users/{user}/unblock', [App\Http\Controllers\Admin\AdminUserController::class, 'unblock'])->name('admin.users.unblock');
    Route::delete('/admin/users/{user}', [App\Http\Controllers\Admin\AdminUserController::class, 'destroy'])->name('admin.users.destroy');

    // Delivery management routes
    Route::get('/admin/deliveries', [App\Http\Controllers\Admin\AdminDeliveryController::class, 'index'])->name('admin.deliveries.index');
    Route::get('/admin/deliveries/{delivery}', [App\Http\Controllers\Admin\AdminDeliveryController::class, 'show'])->name('admin.deliveries.show');
    Route::post('/admin/deliveries/{delivery}/approve', [App\Http\Controllers\Admin\AdminDeliveryController::class, 'approve'])->name('admin.deliveries.approve');
    Route::post('/admin/deliveries/{delivery}/reject', [App\Http\Controllers\Admin\AdminDeliveryController::class, 'reject'])->name('admin.deliveries.reject');
    Route::post('/admin/deliveries/{delivery}/suspend', [App\Http\Controllers\Admin\AdminDeliveryController::class, 'suspend'])->name('admin.deliveries.suspend');

    // Blog management routes
    Route::get('/admin/blogs', [App\Http\Controllers\Admin\AdminBlogController::class, 'index'])->name('admin.blogs.index');
    Route::get('/admin/blogs/create', [App\Http\Controllers\Admin\AdminBlogController::class, 'create'])->name('admin.blogs.create');
    Route::post('/admin/blogs', [App\Http\Controllers\Admin\AdminBlogController::class, 'store'])->name('admin.blogs.store');
    Route::get('/admin/blogs/{blog}/edit', [App\Http\Controllers\Admin\AdminBlogController::class, 'edit'])->name('admin.blogs.edit');
    Route::put('/admin/blogs/{blog}', [App\Http\Controllers\Admin\AdminBlogController::class, 'update'])->name('admin.blogs.update');
    Route::delete('/admin/blogs/{blog}', [App\Http\Controllers\Admin\AdminBlogController::class, 'destroy'])->name('admin.blogs.destroy');
    Route::post('/admin/blogs/{blog}/publish', [App\Http\Controllers\Admin\AdminBlogController::class, 'publish'])->name('admin.blogs.publish');
    Route::post('/admin/blogs/{blog}/archive', [App\Http\Controllers\Admin\AdminBlogController::class, 'archive'])->name('admin.blogs.archive');
    Route::post('/admin/blogs/{blog}/toggle-featured', [App\Http\Controllers\Admin\AdminBlogController::class, 'toggleFeatured'])->name('admin.blogs.toggle-featured');
    Route::post('/admin/blogs/upload-image', [App\Http\Controllers\Admin\AdminBlogController::class, 'uploadImage'])->name('admin.blogs.upload-image');

    // Newsletter management routes
    Route::get('/admin/newsletters', [App\Http\Controllers\Admin\AdminNewsletterController::class, 'index'])->name('admin.newsletters.index');
    Route::get('/admin/newsletters/create', [App\Http\Controllers\Admin\AdminNewsletterController::class, 'create'])->name('admin.newsletters.create');
    Route::post('/admin/newsletters', [App\Http\Controllers\Admin\AdminNewsletterController::class, 'store'])->name('admin.newsletters.store');
    Route::get('/admin/newsletters/subscribers', [App\Http\Controllers\Admin\AdminNewsletterController::class, 'subscribers'])->name('admin.newsletters.subscribers');
    Route::get('/admin/newsletters/subscribers/export', [App\Http\Controllers\Admin\AdminNewsletterController::class, 'exportSubscribers'])->name('admin.newsletters.subscribers.export');
    Route::patch('/admin/newsletters/subscribers/{subscriber}', [App\Http\Controllers\Admin\AdminNewsletterController::class, 'updateSubscriber'])->name('admin.newsletters.subscribers.update');
    Route::delete('/admin/newsletters/subscribers/{subscriber}', [App\Http\Controllers\Admin\AdminNewsletterController::class, 'destroySubscriber'])->name('admin.newsletters.subscribers.destroy');
    Route::get('/admin/newsletters/{newsletter}/edit', [App\Http\Controllers\Admin\AdminNewsletterController::class, 'edit'])->name('admin.newsletters.edit');
    Route::put('/admin/newsletters/{newsletter}', [App\Http\Controllers\Admin\AdminNewsletterController::class, 'update'])->name('admin.newsletters.update');
    Route::delete('/admin/newsletters/{newsletter}', [App\Http\Controllers\Admin\AdminNewsletterController::class, 'destroy'])->name('admin.newsletters.destroy');
    Route::post('/admin/newsletters/{newsletter}/send', [App\Http\Controllers\Admin\AdminNewsletterController::class, 'send'])->name('admin.newsletters.send');
    Route::get('/admin/newsletters/{newsletter}/preview', [App\Http\Controllers\Admin\AdminNewsletterController::class, 'preview'])->name('admin.newsletters.preview');
    Route::post('/admin/newsletters/send-test', [App\Http\Controllers\Admin\AdminNewsletterController::class, 'sendTest'])->name('admin.newsletters.send-test');

    // Moderation routes
    Route::get('/admin/moderation', [App\Http\Controllers\Admin\AdminModerationController::class, 'index'])->name('admin.moderation.index');
    
    // Product review moderation
    Route::post('/admin/moderation/product-reviews/{review}/approve', [App\Http\Controllers\Admin\AdminModerationController::class, 'approveProductReview'])->name('admin.moderation.product-reviews.approve');
    Route::post('/admin/moderation/product-reviews/{review}/reject', [App\Http\Controllers\Admin\AdminModerationController::class, 'rejectProductReview'])->name('admin.moderation.product-reviews.reject');
    Route::delete('/admin/moderation/product-reviews/{review}', [App\Http\Controllers\Admin\AdminModerationController::class, 'deleteProductReview'])->name('admin.moderation.product-reviews.delete');
    Route::delete('/admin/moderation/product-review-reports/{report}', [App\Http\Controllers\Admin\AdminModerationController::class, 'dismissProductReviewReport'])->name('admin.moderation.product-review-reports.dismiss');
    
    // Shop review moderation
    Route::post('/admin/moderation/shop-reviews/{review}/approve', [App\Http\Controllers\Admin\AdminModerationController::class, 'approveShopReview'])->name('admin.moderation.shop-reviews.approve');
    Route::post('/admin/moderation/shop-reviews/{review}/reject', [App\Http\Controllers\Admin\AdminModerationController::class, 'rejectShopReview'])->name('admin.moderation.shop-reviews.reject');
    Route::delete('/admin/moderation/shop-reviews/{review}', [App\Http\Controllers\Admin\AdminModerationController::class, 'deleteShopReview'])->name('admin.moderation.shop-reviews.delete');
    Route::delete('/admin/moderation/shop-review-reports/{report}', [App\Http\Controllers\Admin\AdminModerationController::class, 'dismissShopReviewReport'])->name('admin.moderation.shop-review-reports.dismiss');
    
    // Product moderation
    Route::post('/admin/moderation/products/{product}/approve', [App\Http\Controllers\Admin\AdminModerationController::class, 'approveProduct'])->name('admin.moderation.products.approve');
    Route::post('/admin/moderation/products/{product}/reject', [App\Http\Controllers\Admin\AdminModerationController::class, 'rejectProduct'])->name('admin.moderation.products.reject');
    
    // User moderation
    Route::post('/admin/moderation/users/{user}/block', [App\Http\Controllers\Admin\AdminModerationController::class, 'blockUser'])->name('admin.moderation.users.block');
    Route::post('/admin/moderation/users/{user}/unblock', [App\Http\Controllers\Admin\AdminModerationController::class, 'unblockUser'])->name('admin.moderation.users.unblock');

    // Shop management routes
    Route::get('/admin/shops', [App\Http\Controllers\Admin\AdminShopController::class, 'index'])->name('admin.shops.index');
    Route::get('/admin/shops/{shop}', [App\Http\Controllers\Admin\AdminShopController::class, 'show'])->name('admin.shops.show');
    Route::post('/admin/shops/{shop}/approve', [App\Http\Controllers\Admin\AdminShopController::class, 'approve'])->name('admin.shops.approve');
    Route::post('/admin/shops/{shop}/reject', [App\Http\Controllers\Admin\AdminShopController::class, 'reject'])->name('admin.shops.reject');
    Route::delete('/admin/shops/{shop}', [App\Http\Controllers\Admin\AdminShopController::class, 'destroy'])->name('admin.shops.destroy');

    // Product management routes
    Route::get('/admin/products', [App\Http\Controllers\Admin\AdminProductController::class, 'index'])->name('admin.products.index');
    Route::get('/admin/products/{product}', [App\Http\Controllers\Admin\AdminProductController::class, 'show'])->name('admin.products.show');
    Route::post('/admin/products/{product}/approve', [App\Http\Controllers\Admin\AdminProductController::class, 'approve'])->name('admin.products.approve');
    Route::post('/admin/products/{product}/reject', [App\Http\Controllers\Admin\AdminProductController::class, 'reject'])->name('admin.products.reject');
    Route::post('/admin/products/{product}/toggle-active', [App\Http\Controllers\Admin\AdminProductController::class, 'toggleActive'])->name('admin.products.toggle-active');
    Route::delete('/admin/products/{product}', [App\Http\Controllers\Admin\AdminProductController::class, 'destroy'])->name('admin.products.destroy');
});

Route::middleware('auth')->group(function () {
    // Delivery profile routes (for users trying to become delivery drivers)
    Route::get('delivery/register', function () {
        return Inertia::render('delivery/Create');
    })->name('delivery.register');
    Route::post('delivery', [DeliveryController::class, 'store'])->name('delivery.store');
    Route::get('delivery/{id}/edit', [DeliveryController::class, 'edit'])->name('delivery.edit');
    Route::patch('delivery/{id}', [DeliveryController::class, 'update'])->name('delivery.update');
    
    // Page pour les livreurs suspendus
    Route::get('delivery/suspended', [DeliveryController::class, 'suspended'])->name('delivery.suspended');

    // Notifications routes
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    Route::delete('/notifications', [NotificationController::class, 'destroyAll'])->name('notifications.destroy-all');
    
    // API routes for notifications (AJAX calls from dropdown)
    Route::get('/api/notifications', [NotificationController::class, 'apiIndex'])->name('api.notifications');
    Route::get('/api/notifications/unread-count', [NotificationController::class, 'apiUnreadCount'])->name('api.notifications.unread-count');
    Route::post('/api/notifications/{id}/read', [NotificationController::class, 'apiMarkAsRead'])->name('api.notifications.read');
    Route::post('/api/notifications/read-all', [NotificationController::class, 'apiMarkAllAsRead'])->name('api.notifications.read-all');
    Route::delete('/api/notifications/{id}', [NotificationController::class, 'apiDestroy'])->name('api.notifications.destroy');

    // Chat routes
    Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');
    Route::get('/chat/users', [ChatController::class, 'users'])->name('chat.users');
    Route::get('/chat/{conversation}', [ChatController::class, 'show'])->name('chat.show');
    Route::get('/chat/{conversation}/messages', [ChatController::class, 'getMessages'])->name('chat.messages');
    Route::post('/chat/start/{user}', [ChatController::class, 'startConversation'])->name('chat.start');
    Route::post('/chat/{conversation}/message', [ChatController::class, 'sendMessage'])->name('chat.message');
    Route::post('/chat/{conversation}/typing', [ChatController::class, 'typing'])->name('chat.typing');
    Route::get('/chat/{conversation}/online-status', [ChatController::class, 'getOnlineStatus'])->name('chat.online-status');

    // Cart routes
    Route::resource('cart', CartController::class)->only(['store']);
    Route::get('/my-cart', [CartController::class, 'myCart'])->name('my-cart');
    Route::post('/cart/clear', [CartController::class, 'clearCart'])->name('cart.clear');
    Route::patch('/cart/items/{id}', [CartController::class, 'updateQuantity'])->name('cart.update-quantity');
    Route::delete('/cart/items/{id}', [CartController::class, 'removeItem'])->name('cart.remove-item');

    // Order routes
    Route::resource('order', OrderController::class);
    Route::post('/order/{order}/cancel', [OrderController::class, 'cancel'])->name('order.cancel');
    Route::get('/order/track/{orderNumber}', [OrderController::class, 'track'])->name('order.track');

    // Followed shops
    Route::post('/shops/{slug}/follow', [MarketplaceController::class, 'toggleFollow'])->name('shops.follow');
    Route::post('/shops/{slug}/favorite', [MarketplaceController::class, 'toggleFavorite'])->name('shops.favorite');

    // Reports
    Route::post('/products/{product}/report', [ReportController::class, 'reportProduct'])->name('products.report');
    Route::post('/shops/{shop}/report', [ReportController::class, 'reportShop'])->name('shops.report');

    // Favorites
    Route::post('/products/{slug}/favorite', [ProductController::class, 'toggleFavorite'])->name('products.favorite');
    Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites');

    // Shop reviews
    Route::resource('shop_reviews', ShopReviewController::class)->only(['store', 'update']);
    Route::post('/shop-reviews/{review}/vote', [ShopReviewController::class, 'vote'])->name('shop_reviews.vote');
    Route::post('/shop-reviews/{review}/report', [ShopReviewController::class, 'report'])->name('shop_reviews.report');


    // Product reviews
    Route::resource('product_reviews', ProductReviewController::class)->only(['store', 'update']);
    Route::post('/product-reviews/{review}/vote', [ProductReviewController::class, 'vote'])->name('product_reviews.vote');
    Route::post('/product-reviews/{review}/report', [ProductReviewController::class, 'report'])->name('product_reviews.report');

    // Payment routes
    // Route::post('/payment/initiate', [PaymentController::class, 'initiatePaiement'])->name('payment.initiate');
    // Route::post('/payment/notify', [PaymentController::class, 'handleNotification'])->name('payment.notify');
    // Route::get('/payment/return', [PaymentController::class, 'handleReturn'])->name('payment.return');
    Route::post('/lygos/pay', [PaymentController::class, 'createPayment']);


});

Route::get('/shop-reviews/user/{shop}', [ShopReviewController::class, 'userReview'])->name('shop_reviews.user');
Route::get('/product-reviews/user/{product}', [ProductReviewController::class, 'userReview'])->name('product_reviews.user');


Route::resource('marketplace', MarketplaceController::class)->only(['index', 'show']);
Route::resource('products', ProductController::class)->only(['index', 'show']);
Route::resource('promotions', PromotionController::class);
Route::resource('blog', BlogController::class)->only(['index', 'show']);

// Newsletter subscription routes (public)
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');
Route::get('/newsletter/unsubscribe/{token}', [NewsletterController::class, 'unsubscribe'])->name('newsletter.unsubscribe');
Route::get('/newsletter/view/{newsletter}', [NewsletterController::class, 'view'])->name('newsletter.view');
Route::get('/newsletter/status', [NewsletterController::class, 'status'])->name('newsletter.status')->middleware('auth');

Route::get('/contact', function () {
    return Inertia::render('contact');
});
Route::get('/about', function () {
    return Inertia::render('about');
});
Route::get('/help', function () {
    return Inertia::render('help');
});

// Help pages
Route::get('/help/selling', function () {
    return Inertia::render('help/selling');
});
Route::get('/help/buying', function () {
    return Inertia::render('help/buying');
});
Route::get('/help/delivery', function () {
    return Inertia::render('help/delivery');
});
Route::get('/help/returns', function () {
    return Inertia::render('help/returns');
});

// Legal pages
Route::get('/terms', function () {
    return Inertia::render('legal/terms');
});
Route::get('/privacy', function () {
    return Inertia::render('legal/privacy');
});
Route::get('/cookies', function () {
    return Inertia::render('legal/cookies');
});
Route::get('/legal', function () {
    return Inertia::render('legal/legal');
});


Route::get('auth/google', [GoogleController::class, 'redirectToGoogle']);
Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);

// Routes pour le choix du rôle après connexion Google
Route::middleware('auth')->group(function () {
    Route::get('auth/choose-role', [GoogleController::class, 'showChooseRole'])->name('auth.choose-role');
    Route::post('auth/choose-role', [GoogleController::class, 'storeRole'])->name('auth.store-role');
});

//Route::get('/available',[ProductController::class, 'index']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
