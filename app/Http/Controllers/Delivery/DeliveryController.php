<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use App\Models\Order;
use App\Services\GeolocationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DeliveryController extends Controller
{
    /**
     * Display a listing of all deliveries (admin only)
     */
    public function index()
    {
        // Only admin can view all deliveries
        if (!auth()->user()->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json(Delivery::with('user')->paginate(15));
    }

    /**
     * Show the form for creating a new delivery profile
     */
    public function create()
    {
        // Check if user already has a delivery profile
        if (Delivery::where('user_id', auth()->id())->exists()) {
            return response()->json(['error' => 'You already have a delivery profile'], 400);
        }

        return response()->json(['message' => 'Ready to create delivery profile']);
    }

    /**
     * Store a new delivery profile with zone
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Personal info
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'postal_code' => 'nullable|string|max:20',

            // Delivery zone (circular)
            'delivery_latitude' => 'required|numeric|min:-90|max:90',
            'delivery_longitude' => 'required|numeric|min:-180|max:180',
            'delivery_radius_km' => 'required|numeric|min:0.5|max:100',
            'delivery_area' => 'nullable|string|max:100',
            'availability' => 'nullable|string|max:255',

            // Vehicle info
            'vehicle_type' => 'nullable|string|max:50',
            'vehicle_model' => 'nullable|string|max:100',
            'vehicle_plate' => 'nullable|string|max:20',

            // Documents
            'id_card' => 'required|string|max:255',
            'url_id_card' => 'required|image|max:3072',
            'id_driver_license' => 'required|string|max:255',
            'url_driver_license' => 'required|image|max:3072',
            'insurance_certificate' => 'nullable|string|max:255',
            'url_insurance_certificate' => 'nullable|image|max:3072',
            'delivery_experience' => 'nullable|string|max:1000',
        ]);

        try {
            // Validate coordinates
            if (!GeolocationService::validateCoordinates(
                $validated['delivery_latitude'],
                $validated['delivery_longitude']
            )) {
                return response()->json(['error' => 'Invalid coordinates'], 400);
            }

            // Upload documents to S3
            if ($request->hasFile('url_id_card')) {
                $cardPath = $request->file('url_id_card')->storePublicly('delivery/id_cards', 's3');
                $validated['url_id_card'] = $cardPath;
            }

            if ($request->hasFile('url_driver_license')) {
                $licensePath = $request->file('url_driver_license')->storePublicly('delivery/driver_licenses', 's3');
                $validated['url_driver_license'] = $licensePath;
            }

            if ($request->hasFile('url_insurance_certificate')) {
                $insurancePath = $request->file('url_insurance_certificate')->storePublicly('delivery/insurance_certificates', 's3');
                $validated['url_insurance_certificate'] = $insurancePath;
            }

            $validated['user_id'] = auth()->id();
            $validated['statut'] = 'en attente'; // Pending admin approval

            $delivery = Delivery::create($validated);

            return response()->json([
                'message' => 'Delivery profile created successfully',
                'delivery' => $delivery
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create delivery profile: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display delivery profile
     */
    public function show(string $id)
    {
        $delivery = Delivery::findOrFail($id);

        // User can only view their own profile or admin can view any
        if (auth()->id() !== $delivery->user_id && !auth()->user()->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($delivery);
    }

    /**
     * Show edit form
     */
    public function edit(string $id)
    {
        $delivery = Delivery::findOrFail($id);

        if (auth()->id() !== $delivery->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($delivery);
    }

    /**
     * Update delivery profile
     */
    public function update(Request $request, string $id)
    {
        $delivery = Delivery::findOrFail($id);

        if (auth()->id() !== $delivery->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'string|max:255',
            'email' => 'email|max:255',
            'phone' => 'string|max:20',
            'address' => 'string|max:255',
            'city' => 'string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'delivery_latitude' => 'numeric|min:-90|max:90',
            'delivery_longitude' => 'numeric|min:-180|max:180',
            'delivery_radius_km' => 'numeric|min:0.5|max:100',
            'delivery_area' => 'nullable|string|max:100',
            'availability' => 'nullable|string|max:255',
            'vehicle_type' => 'nullable|string|max:50',
            'vehicle_model' => 'nullable|string|max:100',
            'vehicle_plate' => 'nullable|string|max:20',
            'delivery_experience' => 'nullable|string|max:1000',
        ]);

        $delivery->update($validated);

        return response()->json(['message' => 'Profile updated successfully', 'delivery' => $delivery]);
    }

    /**
     * Get available orders for a delivery driver
     */
    public function availableOrders()
    {
        $delivery = Delivery::where('user_id', auth()->id())->firstOrFail();

        if ($delivery->statut !== 'approuvé') {
            return response()->json(['error' => 'Your delivery profile is not approved'], 403);
        }

        // Get orders in delivery zone
        $orders = GeolocationService::getOrdersInZone($delivery);

        return response()->json([
            'delivery_zone' => [
                'latitude' => $delivery->delivery_latitude,
                'longitude' => $delivery->delivery_longitude,
                'radius_km' => $delivery->delivery_radius_km,
            ],
            'orders' => $orders->map(fn($order) => [
                'id' => $order->id,
                'status' => $order->status,
                'total' => $order->total,
                'delivery_address' => $order->delivery_address,
                'latitude' => $order->delivery_address_latitude,
                'longitude' => $order->delivery_address_longitude,
                'user' => $order->user->only('name', 'email', 'phone'),
                'items_count' => $order->items->count(),
            ])
        ]);
    }

    /**
     * Get orders assigned to delivery driver
     */
    public function assignedOrders()
    {
        $delivery = Delivery::where('user_id', auth()->id())->firstOrFail();

        $orders = Order::where('delivery_id', $delivery->id)
            ->with(['user', 'items'])
            ->whereNotIn('status', ['delivered', 'cancelled'])
            ->get();

        return response()->json(['orders' => $orders]);
    }

    /**
     * Accept an order for delivery
     */
    public function acceptOrder(Request $request, int $orderId)
    {
        $delivery = Delivery::where('user_id', auth()->id())->firstOrFail();
        $order = Order::findOrFail($orderId);

        // Verify order is in delivery zone
        if (!GeolocationService::isOrderInDeliveryZone($order, $delivery)) {
            return response()->json(['error' => 'Order is outside your delivery zone'], 400);
        }

        $order->update([
            'delivery_id' => $delivery->id,
            'status' => 'pending'
        ]);

        return response()->json(['message' => 'Order accepted', 'order' => $order]);
    }

    /**
     * Update order delivery status
     */
    public function updateOrderStatus(Request $request, int $orderId)
    {
        $delivery = Delivery::where('user_id', auth()->id())->firstOrFail();
        $order = Order::findOrFail($orderId);

        if ($order->delivery_id !== $delivery->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,delivered,cancelled'
        ]);

        $order->update($validated);

        return response()->json(['message' => 'Status updated', 'order' => $order]);
    }

    /**
     * Remove the delivery profile
     */
    public function destroy(string $id)
    {
        $delivery = Delivery::findOrFail($id);

        if (auth()->id() !== $delivery->user_id && !auth()->user()->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $delivery->delete();
        return response()->json(['message' => 'Delivery profile deleted']);
    }
}
