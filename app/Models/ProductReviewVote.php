<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductReviewVote extends Model
{
    protected $fillable = ['review_id', 'user_id', 'type'];

    public function review()
    {
        return $this->belongsTo(ProductReview::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
