<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use Illuminate\Http\Request;

class DeliveryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'polygon_coordinates' => 'nullable|json',
            'delivery_area' => 'nullable|string|max:100',
            'availability' => 'nullable|string|max:100',
            'vehicle_type' => 'nullable|string|max:50',
            'vehicle_model' => 'nullable|string|max:100',
            'vehicle_plate' => 'nullable|string|max:20',
            'id_card' => 'required|string|max:255',
            'url_id_card' => 'required|image|max:3072',
            'id_driver_license' => 'required|string|max:255',
            'url_driver_license' => 'required|image|max:3072',
            'insurance_certificate' => 'nullable|string|max:255',
            'url_insurance_certificate' => 'nullable|image|max:3072',
            'delivery_experience' => 'nullable|string',
        ]);

        try {
            
            if($request->hasFile('url_id_card')) {
                $cardPath = $request->file('url_id_card')->storePublicly('delivery/id_cards', 's3');
            $validated['url_id_card'] = $cardPath;
            }

            if($request->hasFile('url_driver_license')) {
                $licensePath = $request->file('url_driver_license')->storePublicly('delivery/driver_licenses', 's3');
            $validated['url_driver_license'] = $licensePath;
            }

            if($request->hasFile('url_insurance_certificate')) {
                $insurancePath = $request->file('url_insurance_certificate')->storePublicly('delivery/insurance_certificates', 's3');
            $validated['url_insurance_certificate'] = $insurancePath;
            }

            
            $validated['user_id'] = auth()->id();


            // Create the delivery
            $delivery = Delivery::create($validated);


        } catch (\Exception $e) {
            return response()->json(['error' => 'File upload failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
