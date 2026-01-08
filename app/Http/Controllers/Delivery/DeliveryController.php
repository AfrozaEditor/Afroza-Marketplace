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
            $validated['statut'] = 'en_attente'; // Pending admin approval

            $delivery = Delivery::create($validated);

            return redirect()->route('home')->with('success', 'Votre profil livreur a été créé avec succès. Il est en attente de validation.');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Échec de la création du profil livreur: ' . $e->getMessage()]);
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

        // Récupérer toutes les commandes assignées (actives et historique)
        $orders = Order::where('delivery_id', $delivery->id)
            ->with(['user', 'items'])
            ->orderByRaw("CASE status 
                WHEN 'out_for_delivery' THEN 1 
                WHEN 'shipped' THEN 2 
                WHEN 'processing' THEN 3 
                WHEN 'confirmed' THEN 4 
                WHEN 'pending' THEN 5 
                WHEN 'delivered' THEN 6 
                WHEN 'cancelled' THEN 7 
                WHEN 'refunded' THEN 8 
                ELSE 9 END")
            ->get();

        return response()->json([
            'orders' => $orders->map(fn($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'total' => $order->total,
                'shipping_cost' => $order->shipping_cost,
                'delivery_address' => $order->delivery_address,
                'delivery_city' => $order->delivery_city,
                'latitude' => $order->delivery_address_latitude,
                'longitude' => $order->delivery_address_longitude,
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'user' => $order->user ? $order->user->only('id', 'name', 'email') : null,
                'items_count' => $order->items->count(),
                'notes' => $order->notes,
                'created_at' => $order->created_at,
                'shipped_at' => $order->shipped_at,
                'delivered_at' => $order->delivered_at,
            ]),
            'stats' => [
                'total' => $orders->count(),
                'pending' => $orders->whereIn('status', ['pending', 'confirmed', 'processing'])->count(),
                'in_transit' => $orders->whereIn('status', ['shipped', 'out_for_delivery'])->count(),
                'delivered' => $orders->where('status', 'delivered')->count(),
                'cancelled' => $orders->whereIn('status', ['cancelled', 'refunded'])->count(),
            ]
        ]);
    }

    /**
     * Accept an order for delivery
     */
    public function acceptOrder(Request $request, int $orderId)
    {
        $delivery = Delivery::where('user_id', auth()->id())->firstOrFail();
        $order = Order::findOrFail($orderId);

        // Vérifier que la commande n'est pas déjà assignée
        if ($order->delivery_id !== null) {
            return response()->json(['error' => 'Cette commande est déjà assignée à un livreur'], 400);
        }

        // Vérifier que la commande est dans un état acceptant un livreur
        if (!in_array($order->status, ['confirmed', 'processing'])) {
            return response()->json(['error' => 'Cette commande ne peut pas être acceptée (statut: ' . $order->status . ')'], 400);
        }

        // Verify order is in delivery zone
        if (!GeolocationService::isOrderInDeliveryZone($order, $delivery)) {
            return response()->json(['error' => 'Cette commande est en dehors de votre zone de livraison'], 400);
        }

        $order->update([
            'delivery_id' => $delivery->id,
            'status' => 'shipped',
            'shipped_at' => now(),
        ]);

        return response()->json(['message' => 'Commande acceptée avec succès', 'order' => $order]);
    }

    /**
     * Update order delivery status
     */
    public function updateOrderStatus(Request $request, int $orderId)
    {
        $delivery = Delivery::where('user_id', auth()->id())->firstOrFail();
        $order = Order::findOrFail($orderId);

        if ($order->delivery_id !== $delivery->id) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:shipped,out_for_delivery,delivered,cancelled'
        ]);

        // Définir les transitions autorisées
        $allowedTransitions = [
            'shipped' => ['out_for_delivery', 'cancelled'],
            'out_for_delivery' => ['delivered', 'cancelled'],
        ];

        $currentStatus = $order->status;
        $newStatus = $validated['status'];

        // Vérifier si la transition est autorisée
        if (isset($allowedTransitions[$currentStatus]) && !in_array($newStatus, $allowedTransitions[$currentStatus])) {
            return response()->json([
                'error' => "Transition de '{$currentStatus}' vers '{$newStatus}' non autorisée"
            ], 400);
        }

        // Préparer les données de mise à jour
        $updateData = ['status' => $newStatus];

        // Ajouter les timestamps appropriés
        if ($newStatus === 'out_for_delivery') {
            // Pas de timestamp spécifique, juste le changement de statut
        } elseif ($newStatus === 'delivered') {
            $updateData['delivered_at'] = now();
        } elseif ($newStatus === 'cancelled') {
            $updateData['cancelled_at'] = now();
            $updateData['cancellation_reason'] = $request->input('cancellation_reason', 'Annulé par le livreur');
        }

        $order->update($updateData);

        return response()->json([
            'message' => 'Statut mis à jour avec succès',
            'order' => $order->fresh()
        ]);
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

    /**
     * Show the suspended delivery page
     */
    public function suspended()
    {
        $user = auth()->user();
        $delivery = $user->delivery;

        // Si l'utilisateur n'a pas de profil livreur ou n'est pas suspendu, rediriger
        if (!$delivery || $delivery->statut !== 'suspendu') {
            return redirect()->route('home');
        }

        return \Inertia\Inertia::render('delivery/Suspended', [
            'delivery' => [
                'id' => $delivery->id,
                'name' => $delivery->name,
                'suspension_reason' => $delivery->suspension_reason,
                'suspended_at' => $delivery->suspended_at,
            ],
            'contactEmail' => config('mail.from.address', 'contact@vide-dressing.com'),
            'contactPhone' => config('app.contact_phone', null),
        ]);
    }

    /**
     * Show the pending approval page
     */
    public function pendingApproval()
    {
        $user = auth()->user();
        $delivery = $user->delivery;

        // Si l'utilisateur n'a pas de profil livreur ou est déjà approuvé, rediriger
        if (!$delivery || $delivery->statut === 'approuve') {
            return redirect()->route('delivery-dashboard');
        }

        return \Inertia\Inertia::render('delivery/PendingApproval', [
            'delivery' => [
                'id' => $delivery->id,
                'name' => $delivery->name,
                'created_at' => $delivery->created_at,
            ],
            'contactEmail' => config('mail.from.address', 'contact@vide-dressing.com'),
            'contactPhone' => config('app.contact_phone', null),
        ]);
    }

    /**
     * Dashboard avec vérification du statut
     */
    public function dashboard()
    {
        $user = auth()->user();
        $delivery = $user->delivery;

        // Si pas de profil livreur, rediriger vers la création
        if (!$delivery) {
            return redirect()->route('delivery.register');
        }

        // Si suspendu, rediriger vers la page suspendu
        if ($delivery->statut === 'suspendu') {
            return redirect()->route('delivery.suspended');
        }

        // Si rejeté, rediriger vers la page de rejet (ou page d'édition)
        if ($delivery->statut === 'rejete') {
            return redirect()->route('delivery.edit', $delivery->id)
                ->with('error', 'Votre profil a été rejeté. Raison: ' . ($delivery->rejection_reason ?? 'Non spécifiée'));
        }

        // Si en attente, rediriger vers la page d'attente
        if ($delivery->statut === 'en_attente') {
            return redirect()->route('delivery.pending-approval');
        }

        // Approuvé - afficher le dashboard
        return \Inertia\Inertia::render('delivery/Dashboard');
    }
}

