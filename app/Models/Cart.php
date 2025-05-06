<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    /** @use HasFactory<CartFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_price',
        'total_quantity',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
        'total_price' => 'decimal:2',
        'total_quantity' => 'integer',
    ];

    /**
     * @use BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @use HasMany
     */
    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }
}
