<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubscriptionPlan extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'product_limit',
        'commission_rate',
        'has_badge',
        'badge_label',
        'priority_search',
        'featured_placement',
        'dedicated_support',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'price' => 'integer',
        'product_limit' => 'integer',
        'commission_rate' => 'decimal:2',
        'has_badge' => 'boolean',
        'priority_search' => 'boolean',
        'featured_placement' => 'boolean',
        'dedicated_support' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function isUnlimited(): bool
    {
        return is_null($this->product_limit);
    }
}
