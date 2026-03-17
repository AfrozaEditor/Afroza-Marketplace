<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Notifications\SubscriptionUpgradeRequested;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class SubscriptionController extends Controller
{
    public function requestUpgrade(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
            'notes' => 'nullable|string|max:500',
        ]);

        $user = auth()->user();
        $newPlan = SubscriptionPlan::findOrFail($request->plan_id);

        // Vérifier qu'il n'y a pas déjà une demande en attente
        $pendingExists = Subscription::where('user_id', $user->id)
            ->where('status', 'pending')
            ->exists();

        if ($pendingExists) {
            return back()->withErrors([
                'upgrade' => 'Vous avez déjà une demande d\'upgrade en attente.',
            ]);
        }

        // Vérifier que ce n'est pas le plan actuel
        $activeSub = $user->activeSubscription;
        if ($activeSub && $activeSub->subscription_plan_id === $newPlan->id) {
            return back()->withErrors([
                'upgrade' => 'Vous êtes déjà sur ce plan.',
            ]);
        }

        // Créer la demande d'upgrade
        Subscription::create([
            'user_id' => $user->id,
            'subscription_plan_id' => $newPlan->id,
            'status' => 'pending',
            'requested_at' => now(),
            'notes' => $request->notes,
        ]);

        // Notifier les admins
        $admins = User::role('admin')->get();
        Notification::send($admins, new SubscriptionUpgradeRequested($user, $newPlan));

        return back()->with('success', 'Votre demande d\'upgrade a été envoyée. Un administrateur la traitera prochainement.');
    }

    public function cancelRequest()
    {
        $user = auth()->user();

        $pending = Subscription::where('user_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if ($pending) {
            $pending->update(['status' => 'cancelled']);
        }

        return back()->with('success', 'Votre demande a été annulée.');
    }
}
