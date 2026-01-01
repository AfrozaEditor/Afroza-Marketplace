<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductReview extends Model
{
    protected $fillable = [
        'product_id',
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

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(ProductReviewVote::class, 'review_id');
    }

    public function reports(): HasMany
    {
        return $this->hasMany(ProductReviewReport::class, 'review_id');
    }
}
