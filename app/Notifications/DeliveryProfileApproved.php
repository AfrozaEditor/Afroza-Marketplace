<?php

namespace App\Notifications;

use App\Models\Delivery;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DeliveryProfileApproved extends Notification implements ShouldQueue
{
    use Queueable;

    protected Delivery $delivery;

    /**
     * Create a new notification instance.
     */
    public function __construct(Delivery $delivery)
    {
        $this->delivery = $delivery;
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
            ->subject('🎉 Votre profil livreur a été approuvé !')
            ->greeting('Félicitations ' . $this->delivery->name . ' !')
            ->line('Nous avons le plaisir de vous informer que votre profil de livreur a été approuvé.')
            ->line('Vous pouvez maintenant accéder à votre tableau de bord et commencer à accepter des commandes de livraison.')
            ->action('Accéder au tableau de bord', url('/delivery-dashboard'))
            ->line('Zone de livraison : ' . $this->delivery->city . ' (' . $this->delivery->delivery_radius_km . ' km)')
            ->line('Merci de faire partie de notre équipe de livreurs !');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => '🎉 Profil approuvé !',
            'type' => 'delivery_profile_approved',
            'delivery_id' => $this->delivery->id,
            'message' => 'Votre profil livreur a été approuvé ! Vous pouvez maintenant commencer à livrer.',
            'action_url' => '/delivery-dashboard',
        ];
    }

    /**
     * Get the broadcastable representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'title' => '🎉 Profil approuvé !',
            'type' => 'delivery_profile_approved',
            'delivery_id' => $this->delivery->id,
            'message' => 'Votre profil livreur a été approuvé ! Vous pouvez maintenant commencer à livrer.',
            'action_url' => '/delivery-dashboard',
        ]);
    }
}
