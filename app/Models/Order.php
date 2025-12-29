<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
      'user_id',
      'delivery_id',
      'status',
      'total',
      'delivery_address',
      'delivery_address_latitude',
      'delivery_address_longitude',
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'delivery_address_latitude' => 'decimal:8',
        'delivery_address_longitude' => 'decimal:8',
    ];

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo
     */
    public function delivery(): BelongsTo
    {
        return $this->belongsTo(Delivery::class);
    }

    /**
     * @use HasMany
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}


