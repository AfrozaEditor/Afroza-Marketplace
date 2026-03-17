<?php

namespace App\Notifications;

use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionUpgradeRequested extends Notification
{
    use Queueable;

    public function __construct(
        protected User $vendor,
        protected SubscriptionPlan $plan,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Nouvelle demande d\'abonnement - ' . $this->plan->name)
            ->greeting('Bonjour ' . $notifiable->name)
            ->line($this->vendor->name . ' a demandé un upgrade vers le plan ' . $this->plan->name . '.')
            ->line('Prix : ' . number_format($this->plan->price, 0, ',', ' ') . ' FCFA/mois')
            ->action('Voir les demandes', url('/admin/subscriptions?status=pending'))
            ->line('Veuillez traiter cette demande depuis le panneau d\'administration.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Nouvelle demande d\'abonnement',
            'type' => 'subscription_upgrade_requested',
            'user_id' => $this->vendor->id,
            'user_name' => $this->vendor->name,
            'plan_name' => $this->plan->name,
            'message' => $this->vendor->name . ' a demandé un upgrade vers le plan ' . $this->plan->name . '.',
            'action_url' => '/admin/subscriptions?status=pending',
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
}
