<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use App\Models\User;
use App\Notifications\DeliveryProfileApproved;
use App\Notifications\DeliveryProfileRejected;
use App\Notifications\DeliveryProfileSuspended;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AdminDeliveryController extends Controller
{
    /**
     * Display a listing of all delivery profiles
     */
    public function index(Request $request)
    {
        $status = $request->get('status', 'all');
        
        $query = Delivery::with('user')
            ->orderBy('created_at', 'desc');
        
        // Filter by status
        if ($status !== 'all') {
            $query->where('statut', $status);
        }
        
        $deliveries = $query->paginate(15)->withQueryString();
        
        // Générer les URLs temporaires pour les documents
        $deliveries->getCollection()->transform(function ($delivery) {
            if ($delivery->url_id_card) {
                $delivery->url_id_card_signed = Storage::disk('s3')->temporaryUrl($delivery->url_id_card, now()->addMinutes(30));
            }
            if ($delivery->url_driver_license) {
                $delivery->url_driver_license_signed = Storage::disk('s3')->temporaryUrl($delivery->url_driver_license, now()->addMinutes(30));
            }
            if ($delivery->url_insurance_certificate) {
                $delivery->url_insurance_certificate_signed = Storage::disk('s3')->temporaryUrl($delivery->url_insurance_certificate, now()->addMinutes(30));
            }
            return $delivery;
        });
        
        // Get counts for each status
        $statusCounts = [
            'all' => Delivery::count(),
            'en_attente' => Delivery::where('statut', 'en_attente')->count(),
            'approuvé' => Delivery::where('statut', 'approuvé')->count(),
            'rejeté' => Delivery::where('statut', 'rejeté')->count(),
            'suspendu' => Delivery::where('statut', 'suspendu')->count(),
        ];
        
        return Inertia::render('admin/deliveries/index', [
            'deliveries' => $deliveries,
            'statusCounts' => $statusCounts,
            'currentStatus' => $status,
        ]);
    }

    /**
     * Display the specified delivery profile details
     */
    public function show(Delivery $delivery)
    {
        $delivery->load('user', 'orders');
        
        return Inertia::render('admin/deliveries/show', [
            'delivery' => $delivery,
        ]);
    }

    /**
     * Approve a delivery profile
     */
    public function approve(Delivery $delivery)
    {
        DB::beginTransaction();
        
        try {
            // Update delivery status
            $delivery->update([
                'statut' => 'approuvé',
                'approved_at' => now(),
                'rejection_reason' => null,
                'rejected_at' => null,
                'suspension_reason' => null,
                'suspended_at' => null,
            ]);
            
            // Assign delivery role to user
            $user = $delivery->user;
            if (!$user->hasRole('delivery')) {
                $user->assignRole('delivery');
            }
            
            // Send notification to user
            $user->notify(new DeliveryProfileApproved($delivery));
            
            DB::commit();
            
            return redirect()->back()->with('success', 'Le profil livreur a été approuvé avec succès.');
            
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Une erreur est survenue lors de l\'approbation.');
        }
    }

    /**
     * Reject a delivery profile
     */
    public function reject(Request $request, Delivery $delivery)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);
        
        DB::beginTransaction();
        
        try {
            // Update delivery status
            $delivery->update([
                'statut' => 'rejeté',
                'rejection_reason' => $validated['rejection_reason'],
                'rejected_at' => now(),
            ]);
            
            // Remove delivery role if exists
            $user = $delivery->user;
            if ($user->hasRole('delivery')) {
                $user->removeRole('delivery');
            }
            
            // Send notification to user
            $user->notify(new DeliveryProfileRejected($delivery, $validated['rejection_reason']));
            
            DB::commit();
            
            return redirect()->back()->with('success', 'Le profil livreur a été rejeté.');
            
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Une erreur est survenue lors du rejet.');
        }
    }

    /**
     * Suspend a delivery profile
     */
    public function suspend(Request $request, Delivery $delivery)
    {
        $validated = $request->validate([
            'suspension_reason' => 'required|string|max:1000',
        ]);
        
        DB::beginTransaction();
        
        try {
            // Update delivery status
            $delivery->update([
                'statut' => 'suspendu',
                'suspension_reason' => $validated['suspension_reason'],
                'suspended_at' => now(),
            ]);
            
            // Remove delivery role
            $user = $delivery->user;
            if ($user->hasRole('delivery')) {
                $user->removeRole('delivery');
            }
            
            // Send notification to user
            $user->notify(new DeliveryProfileSuspended($delivery, $validated['suspension_reason']));
            
            DB::commit();
            
            return redirect()->back()->with('success', 'Le profil livreur a été suspendu.');
            
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Une erreur est survenue lors de la suspension.');
        }
    }
}
