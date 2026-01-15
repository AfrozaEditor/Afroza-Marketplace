<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'shop_id',
        'user_id',
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'quantity',
//        'image',
        'active',
        'is_approved',
        'approved_at',
        'approved_by',
        'rejection_reason',
    ];

    protected $casts = [
        'active' => 'boolean',
        'is_approved' => 'boolean',
        'price' => 'decimal:2',
        'quantity' => 'integer',
        'approved_at' => 'datetime',
    ];

    /**
     * Scope pour les produits approuvés et visibles
     */
    public function scopeVisible($query)
    {
        return $query->where('is_approved', true)->where('active', true);
    }

    /**
     * Scope pour les produits en attente d'approbation
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
     * @use BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }


    /**
     * @use BelongsTo
     */
    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    /**
     * @use BelongsTo
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @use HasMany
     */
    public function images(): HasMany
    {
        return $this->hasMany(Image::class);
    }

    /**
     * @return BelongsToMany
     */
    public function favorites(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites','product_id', 'user_id')->withTimestamps();
    }

    /**
     * @use HasMany
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(ProductReview::class);
    }

    public function user_review(?int $userId = null): HasOne
    {
        $userId = $userId ?? auth()->id();
        return $this->hasOne(ProductReview::class)->where('user_id', $userId);
    }

    /**
     * Signalements du produit
     */
    public function reports()
    {
        return $this->morphMany(Report::class, 'reportable');
    }
}
