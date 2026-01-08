<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\User;

class Shop extends Model
{
    /** @use HasFactory<ShopFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'address',
        'phone',
        'email',
        'logo',
        'city',
        'cover_image',
        'website',
        'facebook',
        'instagram',
        'user_id',
        'is_approved',
        'approved_at',
        'approved_by',
        'rejection_reason',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'approved_at' => 'datetime',
    ];

    /**
     * Scope pour les boutiques approuvées et visibles
     */
    public function scopeVisible($query)
    {
        return $query->where('is_approved', true);
    }

    /**
     * Scope pour les boutiques en attente d'approbation
     */
    public function scopePending($query)
    {
        return $query->where('is_approved', false)->whereNull('rejection_reason');
    }

    /**
     * Relation avec l'admin qui a approuvé
     */
    public function approvedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * @return BelongsToMany
     */
    public function followers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'followers','shop_id', 'user_id')->withTimestamps();
    }

    /**
     * @return HasMany
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(ShopReview::class);
    }

    public function user_review(?int $userId = null): HasOne
    {
        $userId = $userId ?? auth()->id();
        return $this->hasOne(ShopReview::class)->where('user_id', $userId);
    }
}
