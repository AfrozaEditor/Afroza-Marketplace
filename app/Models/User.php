<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
        'block_reason',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $with = [
        'cart',
        // 'roles',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($user) {
            // Supprimer la boutique et ses produits avec images
            if ($user->shop) {
                // Supprimer les images des produits de la boutique
                foreach ($user->shop->products as $product) {
                    foreach ($product->images as $image) {
                        if ($image->url) {
                            Storage::disk('public')->delete($image->url);
                        }
                        $image->delete();
                    }
                    // Supprimer les avis sur le produit
                    $product->reviews()->delete();
                    $product->delete();
                }
                
                // Supprimer le logo et cover de la boutique
                if ($user->shop->logo) {
                    Storage::disk('public')->delete($user->shop->logo);
                }
                if ($user->shop->cover_image) {
                    Storage::disk('public')->delete($user->shop->cover_image);
                }
                
                // Supprimer les avis sur la boutique
                $user->shop->reviews()->delete();
                $user->shop->delete();
            }

            // Supprimer les produits directs de l'utilisateur (sans boutique)
            foreach ($user->produits as $product) {
                foreach ($product->images as $image) {
                    if ($image->url) {
                        Storage::disk('public')->delete($image->url);
                    }
                    $image->delete();
                }
                $product->reviews()->delete();
                $product->delete();
            }

            // Supprimer le panier et ses items
            if ($user->cart) {
                $user->cart->items()->delete();
                $user->cart->delete();
            }

            // Supprimer le profil livreur et ses documents
            if ($user->delivery) {
                if ($user->delivery->url_id_card) {
                    Storage::disk('public')->delete($user->delivery->url_id_card);
                }
                if ($user->delivery->url_driver_license) {
                    Storage::disk('public')->delete($user->delivery->url_driver_license);
                }
                if ($user->delivery->url_insurance_certificate) {
                    Storage::disk('public')->delete($user->delivery->url_insurance_certificate);
                }
                $user->delivery->delete();
            }

            // Supprimer les avis laissés par l'utilisateur
            ProductReview::where('user_id', $user->id)->delete();
            ShopReview::where('user_id', $user->id)->delete();

            // Supprimer les votes et signalements
            ProductReviewVote::where('user_id', $user->id)->delete();
            ProductReviewReport::where('user_id', $user->id)->delete();
            ShopReviewVote::where('user_id', $user->id)->delete();
            ShopReviewReport::where('user_id', $user->id)->delete();

            // Supprimer les messages de l'utilisateur
            $user->messages()->delete();

            // Détacher des conversations
            $user->conversations()->detach();

            // Supprimer les favoris
            $user->favorites()->detach();

            // Supprimer les boutiques suivies
            $user->followedShops()->detach();

            // Supprimer l'abonnement newsletter
            NewsletterSubscriber::where('user_id', $user->id)->delete();
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * @use HasOne
     */
    public function cart(): HasOne
    {
        return $this->hasOne(Cart::class);
    }

    public function assignSingleRole($role)
    {
        return $this->syncRoles([$role]);
    }

    public function produits(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function getRole()
    {
        return $this->roles()->first();
    }

    /**
     * Get the conversations this user is part of.
     */
    public function conversations(): BelongsToMany
    {
        return $this->belongsToMany(Conversation::class)
            ->withTimestamps();
    }

    /**
     * Get the messages sent by this user.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }


    public function shop(): HasOne
    {
        return $this->hasOne(Shop::class);
    }

    public function favorites(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'favorites')
            ->withTimestamps();
    }

    public function followedShops(): BelongsToMany
    {
        return $this->belongsToMany(Shop::class, 'followed_shops')
            ->withTimestamps();
    }

    /**
     * Get the delivery profile for the user.
     */
    public function delivery(): HasOne
    {
        return $this->hasOne(Delivery::class);
    }

    /**
     * Check if user is blocked.
     */
    public function isBlocked(): bool
    {
        return $this->status === 'blocked';
    }

    /**
     * Check if user is a suspended delivery driver.
     */
    public function isSuspendedDelivery(): bool
    {
        return $this->delivery && $this->delivery->statut === 'suspendu';
    }
}
