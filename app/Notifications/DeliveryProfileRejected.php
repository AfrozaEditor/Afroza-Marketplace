<?php

namespace App\Notifications;

use App\Models\Delivery;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DeliveryProfileRejected extends Notification implements ShouldQueue
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
            ->subject('Votre demande de profil livreur')
            ->greeting('Bonjour ' . $this->delivery->name . ',')
            ->line('Nous avons examiné votre demande pour devenir livreur sur notre plateforme.')
            ->line('Malheureusement, votre profil n\'a pas pu être approuvé pour la raison suivante :')
            ->line('**' . $this->reason . '**')
            ->line('Vous pouvez corriger les informations et soumettre une nouvelle demande.')
            ->action('Modifier mon profil', url('/delivery/register'))
            ->line('Si vous avez des questions, n\'hésitez pas à nous contacter.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Profil livreur rejeté',
            'type' => 'delivery_profile_rejected',
            'delivery_id' => $this->delivery->id,
            'message' => 'Votre demande de profil livreur a été rejetée. Raison: ' . $this->reason,
            'reason' => $this->reason,
            'action_url' => '/delivery/register',
        ];
    }

    /**
     * Get the broadcastable representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'title' => 'Profil livreur rejeté',
            'type' => 'delivery_profile_rejected',
            'delivery_id' => $this->delivery->id,
            'message' => 'Votre demande de profil livreur a été rejetée. Raison: ' . $this->reason,
            'reason' => $this->reason,
            'action_url' => '/delivery/register',
        ]);
    }
}
