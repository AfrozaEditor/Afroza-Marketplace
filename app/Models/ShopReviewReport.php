<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShopReviewReport extends Model
{
    protected $fillable = [
        'review_id',
        'user_id',
        'reason',
        'details',
//        'status',
    ];

//    protected $casts = [
//        'status' => 'string', // e.g., 'pending', 'resolved', 'rejected'
//    ];

    public function review()
    {
        return $this->belongsTo(ShopReview::class, 'review_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
