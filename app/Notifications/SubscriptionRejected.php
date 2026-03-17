<?php

namespace App\Notifications;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionRejected extends Notification
{
    use Queueable;

    public function __construct(
        protected Subscription $subscription,
        protected string $reason,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $plan = $this->subscription->plan;

        return (new MailMessage)
            ->subject('Demande d\'abonnement ' . $plan->name . ' - Non approuvée')
            ->greeting('Bonjour ' . $notifiable->name)
            ->line('Votre demande d\'upgrade vers le plan ' . $plan->name . ' n\'a pas été approuvée.')
            ->line('Motif : ' . $this->reason)
            ->action('Voir mon abonnement', url('/dashboard'))
            ->line('Vous pouvez soumettre une nouvelle demande à tout moment.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Demande d\'abonnement rejetée',
            'type' => 'subscription_rejected',
            'plan_name' => $this->subscription->plan->name,
            'reason' => $this->reason,
            'message' => 'Votre demande d\'abonnement ' . $this->subscription->plan->name . ' a été rejetée. Motif : ' . $this->reason,
            'action_url' => '/dashboard',
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
}
