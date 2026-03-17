<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class VendorProfileController extends Controller
{
    public function show(int $id)
    {
        $vendor = User::with(['shop', 'activeSubscription.plan'])->findOrFail($id);

        // Badge du vendeur
        $badge = null;
        if ($vendor->activeSubscription && $vendor->activeSubscription->plan && $vendor->activeSubscription->plan->has_badge) {
            $badge = $vendor->activeSubscription->plan->badge_label;
        }

        // Boutique du vendeur
        $shop = $vendor->shop;
        if ($shop) {
            $shop->load(['reviews', 'followers']);
            if ($shop->logo) {
                $shop->logo_url = Storage::disk('s3')->url($shop->logo);
            }
            if ($shop->cover_image) {
                $shop->cover_url = Storage::disk('s3')->url($shop->cover_image);
            }
        }

        // Produits du vendeur
        $products = Product::with(['category', 'reviews', 'shop'])
            ->where('user_id', $vendor->id)
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get()
            ->map(function ($product) {
                $images = $product->images()->get();
                $imagesUrls = [];
                foreach ($images as $image) {
                    $imagesUrls[] = Storage::disk('s3')->url($image->url);
                }
                $product->images = $imagesUrls;
                $product->is_favorite = $product->favorites->contains(auth()->id());
                return $product;
            });

        return Inertia::render('vendor/profile', [
            'vendor' => [
                'id' => $vendor->id,
                'name' => $vendor->name,
                'avatar' => $this->resolveAvatarUrl($vendor->avatar),
                'created_at' => $vendor->created_at,
            ],
            'badge' => $badge,
            'shop' => $shop,
            'products' => $products,
        ]);
    }


    private function resolveAvatarUrl(?string $avatar): ?string
    {
        if (!$avatar) {
            return null;
        }

        if (Str::startsWith($avatar, ['http://', 'https://'])) {
            return $avatar;
        }

        try {
            return Storage::disk('s3')->url($avatar);
        } catch (\Throwable $e) {
            return null;
        }
    }
}
