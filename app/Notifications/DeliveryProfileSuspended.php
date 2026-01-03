<?php

namespace App\Notifications;

use App\Models\Delivery;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DeliveryProfileSuspended extends Notification implements ShouldQueue
{
    use Queueable;

    protected Delivery $delivery;
    protected string $reason;

    /**
     * Create a new notification instance.
     */
    public function __construct(Delivery $delivery, string $reason)
    {
        $this->delivery = $delivery;
        $this->reason = $reason;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('⚠️ Votre compte livreur a été suspendu')
            ->greeting('Bonjour ' . $this->delivery->name . ',')
            ->line('Nous vous informons que votre compte livreur a été temporairement suspendu.')
            ->line('**Raison de la suspension :**')
            ->line($this->reason)
            ->line('Pendant cette période, vous ne pourrez pas accéder aux fonctionnalités de livraison.')
            ->action('Contacter le support', url('/contact'))
            ->line('Si vous pensez qu\'il s\'agit d\'une erreur, veuillez contacter notre équipe.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => '⚠️ Compte suspendu',
            'type' => 'delivery_profile_suspended',
            'delivery_id' => $this->delivery->id,
            'message' => 'Votre compte livreur a été suspendu. Raison: ' . $this->reason,
            'reason' => $this->reason,
            'action_url' => '/delivery/suspended',
        ];
    }

    /**
     * Get the broadcastable representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'title' => '⚠️ Compte suspendu',
            'type' => 'delivery_profile_suspended',
            'delivery_id' => $this->delivery->id,
            'message' => 'Votre compte livreur a été suspendu. Raison: ' . $this->reason,
            'reason' => $this->reason,
            'action_url' => '/delivery/suspended',
        ]);
    }
}
