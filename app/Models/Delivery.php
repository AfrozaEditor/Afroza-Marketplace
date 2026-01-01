<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Delivery extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'address',
        'city',
        'postal_code',
        'delivery_latitude',
        'delivery_longitude',
        'delivery_radius_km',
        'delivery_area',
        'availability',
        'vehicle_type',
        'vehicle_model',
        'vehicle_plate',
        'id_card',
        'url_id_card',
        'id_driver_license',
        'url_driver_license',
        'insurance_certificate',
        'url_insurance_certificate',
        'delivery_experience',
        'statut',
        'rejection_reason',
        'suspension_reason',
        'approved_at',
        'rejected_at',
        'suspended_at',
    ];

    protected $casts = [
        'delivery_latitude' => 'decimal:8',
        'delivery_longitude' => 'decimal:8',
        'delivery_radius_km' => 'decimal:2',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'suspended_at' => 'datetime',
    ];

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get orders within delivery zone
     * @return HasMany
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'delivery_id');
    }

    /**
     * Check if an order is within delivery zone
     */
    public function isOrderInZone(Order $order): bool
    {
        if (!$order->delivery_address_latitude || !$order->delivery_address_longitude) {
            return false;
        }

        $distance = $this->calculateDistance(
            $this->delivery_latitude,
            $this->delivery_longitude,
            $order->delivery_address_latitude,
            $order->delivery_address_longitude
        );

        return $distance <= $this->delivery_radius_km;
    }

    /**
     * Haversine formula to calculate distance between two coordinates in km
     */
    private function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $R = 6371; // Earth's radius in km
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $R * $c;
    }
}
