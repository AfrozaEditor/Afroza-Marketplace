<?php

namespace App\Notifications;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionApproved extends Notification
{
    use Queueable;

    public function __construct(
        protected Subscription $subscription,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $plan = $this->subscription->plan;

        return (new MailMessage)
            ->subject('Votre abonnement ' . $plan->name . ' est activé !')
            ->greeting('Bonjour ' . $notifiable->name)
            ->line('Votre demande d\'upgrade vers le plan ' . $plan->name . ' a été approuvée.')
            ->line('Vous bénéficiez maintenant de tous les avantages du plan ' . $plan->name . '.')
            ->action('Voir mon abonnement', url('/dashboard'))
            ->line('Merci de votre confiance !');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Abonnement approuvé',
            'type' => 'subscription_approved',
            'plan_name' => $this->subscription->plan->name,
            'message' => 'Votre abonnement ' . $this->subscription->plan->name . ' a été activé avec succès.',
            'action_url' => '/dashboard',
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
}
