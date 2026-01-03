<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'delivery_id',
        'order_number',
        'customer_name',
        'customer_email',
        'customer_phone',
        'status',
        'total',
        'delivery_address',
        'delivery_city',
        'delivery_region',
        'delivery_postal_code',
        'delivery_address_latitude',
        'delivery_address_longitude',
        'shipping_method',
        'shipping_cost',
        'payment_method',
        'payment_status',
        'payment_reference',
        'paid_at',
        'notes',
        'tracking_number',
        'shipped_at',
        'delivered_at',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'delivery_address_latitude' => 'decimal:8',
        'delivery_address_longitude' => 'decimal:8',
        'paid_at' => 'datetime',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = self::generateOrderNumber();
            }
        });
    }

    /**
     * Generate unique order number
     */
    public static function generateOrderNumber(): string
    {
        do {
            $number = 'CMD-' . date('Ymd') . '-' . strtoupper(Str::random(6));
        } while (self::where('order_number', $number)->exists());

        return $number;
    }

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
     * @return HasMany
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the status label
     */
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'pending' => 'En attente',
            'confirmed' => 'Confirmé',
            'processing' => 'En préparation',
            'shipped' => 'Expédié',
            'out_for_delivery' => 'En cours de livraison',
            'delivered' => 'Livré',
            'cancelled' => 'Annulé',
            'refunded' => 'Remboursé',
            default => 'Inconnu',
        };
    }

    /**
     * Get the payment status label
     */
    public function getPaymentStatusLabelAttribute(): string
    {
        return match($this->payment_status) {
            'pending' => 'En attente',
            'paid' => 'Payé',
            'failed' => 'Échoué',
            'refunded' => 'Remboursé',
            default => 'Inconnu',
        };
    }

    /**
     * Check if order can be cancelled
     */
    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['pending', 'confirmed', 'processing']);
    }

    /**
     * Check if order is paid
     */
    public function isPaid(): bool
    {
        return $this->payment_status === 'paid';
    }

    /**
     * Get total with shipping
     */
    public function getTotalWithShippingAttribute(): float
    {
        return $this->total + $this->shipping_cost;
    }

    /**
     * Scope for user orders
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope for status
     */
    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Mark as confirmed
     */
    public function markAsConfirmed(): self
    {
        $this->update([
            'status' => 'confirmed',
            'payment_status' => 'paid',
            'paid_at' => now(),
        ]);

        return $this;
    }

    /**
     * Mark as shipped
     */
    public function markAsShipped(?string $trackingNumber = null): self
    {
        $this->update([
            'status' => 'shipped',
            'tracking_number' => $trackingNumber,
            'shipped_at' => now(),
        ]);

        return $this;
    }

    /**
     * Mark as delivered
     */
    public function markAsDelivered(): self
    {
        $this->update([
            'status' => 'delivered',
            'delivered_at' => now(),
        ]);

        return $this;
    }

    /**
     * Cancel order
     */
    public function cancel(?string $reason = null): self
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $reason,
        ]);

        return $this;
    }
}


