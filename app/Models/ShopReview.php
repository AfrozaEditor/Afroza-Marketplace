<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShopReview extends Model
{
    /** @use HasFactory<ShopReviewFactory> */
    use HasFactory;

    protected $fillable = [
        'shop_id',
        'user_id',
        'title',
        'rating',
        'comment',
        'is_approved',
        'helpful',
        'not_helpful',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_approved' => 'boolean',
        'helpful' => 'integer',
        'not_helpful' => 'integer',
    ];

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }
}
