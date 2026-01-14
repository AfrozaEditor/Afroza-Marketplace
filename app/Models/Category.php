<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    /** @use HasFactory<CategoryFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'parent_id',
        'icon',
        'image',
        'description',
    ];

    /**
     * Catégorie parente
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Sous-catégories
     */
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    /**
     * Scope pour les catégories principales (sans parent)
     */
    public function scopeMain($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * @use HasMany
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Récupère tous les produits incluant ceux des sous-catégories
     */
    public function allProducts()
    {
        $categoryIds = $this->children()->pluck('id')->push($this->id);
        return Product::whereIn('category_id', $categoryIds);
    }
}
