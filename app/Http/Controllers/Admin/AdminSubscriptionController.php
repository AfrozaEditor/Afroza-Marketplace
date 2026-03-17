<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Notifications\SubscriptionApproved;
use App\Notifications\SubscriptionRejected;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminSubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->get('status', 'all');

        $query = Subscription::with(['user', 'plan', 'approvedByUser'])
            ->orderBy('created_at', 'desc');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $subscriptions = $query->paginate(15)->withQueryString();

        // Charger le plan actif de chaque utilisateur
        $subscriptions->getCollection()->transform(function ($subscription) {
            if ($subscription->status === 'pending') {
                $subscription->user_active_plan = Subscription::where('user_id', $subscription->user_id)
                    ->where('status', 'active')
                    ->with('plan')
                    ->first()?->plan;
            }
            return $subscription;
        });

        $statusCounts = [
            'all' => Subscription::count(),
            'pending' => Subscription::where('status', 'pending')->count(),
            'active' => Subscription::where('status', 'active')->count(),
            'rejected' => Subscription::where('status', 'rejected')->count(),
        ];

        $plans = SubscriptionPlan::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('admin/subscriptions/index', [
            'subscriptions' => $subscriptions,
            'statusCounts' => $statusCounts,
            'currentStatus' => $status,
            'plans' => $plans,
        ]);
    }

    public function approve(Subscription $subscription)
    {
        if ($subscription->status !== 'pending') {
            return back()->with('error', 'Cette demande ne peut pas être approuvée.');
        }

        DB::beginTransaction();

        try {
            // Expirer l'ancien abonnement actif
            Subscription::where('user_id', $subscription->user_id)
                ->where('status', 'active')
                ->update([
                    'status' => 'expired',
                    'ends_at' => now(),
                ]);

            // Activer le nouvel abonnement
            $subscription->update([
                'status' => 'active',
                'starts_at' => now(),
                'ends_at' => now()->addMonth(),
                'approved_by' => auth()->id(),
                'approved_at' => now(),
            ]);

            // Notifier le vendeur
            $subscription->user->notify(new SubscriptionApproved($subscription));

            DB::commit();

            return back()->with('success', 'L\'abonnement a été approuvé avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Une erreur est survenue.');
        }
    }

    public function reject(Request $request, Subscription $subscription)
    {
        if ($subscription->status !== 'pending') {
            return back()->with('error', 'Cette demande ne peut pas être rejetée.');
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        DB::beginTransaction();

        try {
            $subscription->update([
                'status' => 'rejected',
                'rejection_reason' => $validated['rejection_reason'],
                'rejected_at' => now(),
            ]);

            $subscription->user->notify(
                new SubscriptionRejected($subscription, $validated['rejection_reason'])
            );

            DB::commit();

            return back()->with('success', 'La demande a été rejetée.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Une erreur est survenue.');
        }
    }
}
