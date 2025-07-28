<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'reviewer_name',
        'reviewer_email',
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

    public function votes(): HasMany
    {
        return $this->hasMany(ShopReviewVote::class, 'review_id');
    }

    public function reports(): HasMany
    {
        return $this->hasMany(ShopReviewReport::class, 'review_id');
    }
}
