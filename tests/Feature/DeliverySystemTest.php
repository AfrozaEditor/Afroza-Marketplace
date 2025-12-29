<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Delivery;
use App\Models\Order;
use App\Services\GeolocationService;
use Tests\TestCase;

class DeliverySystemTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
    }

    /**
     * Test: Create delivery profile with circular zone
     */
    public function test_create_delivery_profile()
    {
        $user = User::factory()->create();
        $user->assignRole('delivery');

        $response = $this->actingAs($user)->post('/delivery', [
            'name' => 'Jean Dupont',
            'email' => 'jean@example.com',
            'phone' => '+237670000000',
            'address' => '123 Rue de la Paix',
            'city' => 'Yaoundé',
            'postal_code' => '1000',
            'delivery_latitude' => 3.8667,
            'delivery_longitude' => 11.5167,
            'delivery_radius_km' => 5,
            'delivery_area' => 'Yaoundé Centre',
            'availability' => 'Lun-Ven 8h-18h',
            'vehicle_type' => 'voiture',
            'vehicle_model' => 'Renault Clio',
            'vehicle_plate' => 'CM-1234-AB',
            'id_card' => 'ID123456',
            'url_id_card' => 'tests/fixtures/id_card.jpg',
            'id_driver_license' => 'LICENSE123456',
            'url_driver_license' => 'tests/fixtures/license.jpg',
            'delivery_experience' => '2 years experience',
        ]);

        $this->assertDatabaseHas('delivery', [
            'user_id' => $user->id,
            'name' => 'Jean Dupont',
            'delivery_latitude' => 3.8667,
            'delivery_longitude' => 11.5167,
            'delivery_radius_km' => 5,
            'statut' => 'en attente',
        ]);
    }

    /**
     * Test: Calculate distance between two points
     */
    public function test_calculate_distance()
    {
        // Yaoundé to Douala (approx 260 km)
        $distance = GeolocationService::calculateDistance(
            3.8667,  // Yaoundé lat
            11.5167, // Yaoundé lng
            4.0511,  // Douala lat
            9.7679   // Douala lng
        );

        $this->assertTrue($distance > 250 && $distance < 270);
    }

    /**
     * Test: Check if order is in delivery zone
     */
    public function test_order_in_delivery_zone()
    {
        $delivery = Delivery::factory()->create([
            'delivery_latitude' => 3.8667,
            'delivery_longitude' => 11.5167,
            'delivery_radius_km' => 5,
        ]);

        // Order within 2km from delivery center
        $order = Order::factory()->create([
            'delivery_address_latitude' => 3.8700,
            'delivery_address_longitude' => 11.5200,
        ]);

        $this->assertTrue(GeolocationService::isOrderInDeliveryZone($order, $delivery));
    }

    /**
     * Test: Order outside delivery zone
     */
    public function test_order_outside_delivery_zone()
    {
        $delivery = Delivery::factory()->create([
            'delivery_latitude' => 3.8667,
            'delivery_longitude' => 11.5167,
            'delivery_radius_km' => 5,
        ]);

        // Order more than 5km away
        $order = Order::factory()->create([
            'delivery_address_latitude' => 4.0511, // Douala (260km away)
            'delivery_address_longitude' => 9.7679,
        ]);

        $this->assertFalse(GeolocationService::isOrderInDeliveryZone($order, $delivery));
    }

    /**
     * Test: Get orders in delivery zone
     */
    public function test_get_orders_in_zone()
    {
        $delivery = Delivery::factory()->create([
            'delivery_latitude' => 3.8667,
            'delivery_longitude' => 11.5167,
            'delivery_radius_km' => 5,
            'statut' => 'approuvé',
        ]);

        // Create 3 orders, 2 in zone, 1 outside
        Order::factory(2)->create([
            'status' => 'pending',
            'delivery_address_latitude' => 3.8700,
            'delivery_address_longitude' => 11.5200,
        ]);

        Order::factory()->create([
            'status' => 'pending',
            'delivery_address_latitude' => 4.0511,
            'delivery_address_longitude' => 9.7679,
        ]);

        $ordersInZone = GeolocationService::getOrdersInZone($delivery);

        $this->assertCount(2, $ordersInZone);
    }

    /**
     * Test: Accept order
     */
    public function test_accept_order_in_zone()
    {
        $user = User::factory()->create();
        $user->assignRole('delivery');

        $delivery = Delivery::factory()->create([
            'user_id' => $user->id,
            'delivery_latitude' => 3.8667,
            'delivery_longitude' => 11.5167,
            'delivery_radius_km' => 5,
            'statut' => 'approuvé',
        ]);

        $order = Order::factory()->create([
            'status' => 'pending',
            'delivery_address_latitude' => 3.8700,
            'delivery_address_longitude' => 11.5200,
        ]);

        $response = $this->actingAs($user)->post(
            "/delivery/accept-order/{$order->id}",
            ['status' => 'en_cours_de_livraison']
        );

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'delivery_id' => $delivery->id,
            'status' => 'en_cours_de_livraison',
        ]);
    }

    /**
     * Test: Cannot accept order outside zone
     */
    public function test_cannot_accept_order_outside_zone()
    {
        $user = User::factory()->create();
        $user->assignRole('delivery');

        $delivery = Delivery::factory()->create([
            'user_id' => $user->id,
            'delivery_latitude' => 3.8667,
            'delivery_longitude' => 11.5167,
            'delivery_radius_km' => 5,
            'statut' => 'approuvé',
        ]);

        $order = Order::factory()->create([
            'status' => 'pending',
            'delivery_address_latitude' => 4.0511, // Douala
            'delivery_address_longitude' => 9.7679,
        ]);

        $response = $this->actingAs($user)->post(
            "/delivery/accept-order/{$order->id}"
        );

        $this->assertFalse($response->getStatusCode() === 200);
    }

    /**
     * Test: Update order delivery status
     */
    public function test_update_order_status()
    {
        $user = User::factory()->create();
        $user->assignRole('delivery');

        $delivery = Delivery::factory()->create(['user_id' => $user->id]);
        $order = Order::factory()->create(['delivery_id' => $delivery->id]);

        $response = $this->actingAs($user)->patch(
            "/delivery/update-order-status/{$order->id}",
            ['status' => 'livré']
        );

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'livré',
        ]);
    }

    /**
     * Test: Validate coordinates
     */
    public function test_validate_coordinates()
    {
        // Valid coordinates
        $this->assertTrue(GeolocationService::validateCoordinates(3.8667, 11.5167));

        // Invalid latitude
        $this->assertFalse(GeolocationService::validateCoordinates(95, 11.5167));

        // Invalid longitude
        $this->assertFalse(GeolocationService::validateCoordinates(3.8667, 200));
    }
}
