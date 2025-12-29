<?php

namespace App\Services;

use App\Models\Delivery;
use App\Models\Order;

class GeolocationService
{
    /**
     * Earth's radius in km
     */
    private const EARTH_RADIUS_KM = 6371;

    /**
     * Calculate distance between two coordinates using Haversine formula
     * Returns distance in kilometers
     */
    public static function calculateDistance(
        float $lat1,
        float $lon1,
        float $lat2,
        float $lon2
    ): float {
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return self::EARTH_RADIUS_KM * $c;
    }

    /**
     * Check if an order is within a delivery zone
     */
    public static function isOrderInDeliveryZone(Order $order, Delivery $delivery): bool
    {
        // Validate order has address coordinates
        if (
            !$order->delivery_address_latitude ||
            !$order->delivery_address_longitude
        ) {
            return false;
        }

        // Validate delivery has zone coordinates
        if (
            !$delivery->delivery_latitude ||
            !$delivery->delivery_longitude ||
            !$delivery->delivery_radius_km
        ) {
            return false;
        }

        $distance = self::calculateDistance(
            (float) $delivery->delivery_latitude,
            (float) $delivery->delivery_longitude,
            (float) $order->delivery_address_latitude,
            (float) $order->delivery_address_longitude
        );

        return $distance <= (float) $delivery->delivery_radius_km;
    }

    /**
     * Get all orders within a delivery zone
     */
    public static function getOrdersInZone(Delivery $delivery)
    {
        return Order::query()
            ->where('status', '!=', 'delivered')
            ->where('status', '!=', 'cancelled')
            ->whereNotNull('delivery_address_latitude')
            ->whereNotNull('delivery_address_longitude')
            ->get()
            ->filter(fn($order) => self::isOrderInDeliveryZone($order, $delivery));
    }

    /**
     * Get nearest deliveries for an order
     */
    public static function getNearestDeliveries(Order $order, int $limit = 5)
    {
        if (!$order->delivery_address_latitude || !$order->delivery_address_longitude) {
            return collect();
        }

        return Delivery::query()
            ->where('statut', 'approuvé')
            ->get()
            ->filter(fn($delivery) => self::isOrderInDeliveryZone($order, $delivery))
            ->sortBy(function ($delivery) use ($order) {
                return self::calculateDistance(
                    (float) $delivery->delivery_latitude,
                    (float) $delivery->delivery_longitude,
                    (float) $order->delivery_address_latitude,
                    (float) $order->delivery_address_longitude
                );
            })
            ->take($limit)
            ->values();
    }

    /**
     * Validate coordinates
     */
    public static function validateCoordinates(float $lat, float $lon): bool
    {
        return $lat >= -90 && $lat <= 90 && $lon >= -180 && $lon <= 180;
    }
}
