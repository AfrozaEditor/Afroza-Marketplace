<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewUserRegistered extends Notification implements ShouldQueue
{
    use Queueable;

    protected User $newUser;

    /**
     * Create a new notification instance.
     */
    public function __construct(User $newUser)
    {
        $this->newUser = $newUser;
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
            ->subject('Nouvel utilisateur inscrit sur Vide-Dressing')
            ->greeting('Bonjour ' . $notifiable->name . ' !')
            ->line('Un nouvel utilisateur vient de s\'inscrire sur la plateforme.')
            ->line('**Nom:** ' . $this->newUser->name)
            ->line('**Email:** ' . $this->newUser->email)
            ->line('**Date d\'inscription:** ' . $this->newUser->created_at->format('d/m/Y à H:i'))
            ->action('Voir les utilisateurs', url('/admin/users'))
            ->line('Merci d\'utiliser Vide-Dressing !');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Nouvel utilisateur inscrit',
            'message' => $this->newUser->name . ' vient de s\'inscrire sur la plateforme.',
            'user_id' => $this->newUser->id,
            'user_name' => $this->newUser->name,
            'user_email' => $this->newUser->email,
            'action_url' => '/admin/users',
            'type' => 'new_user_registered',
        ];
    }

    /**
     * Get the broadcastable representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'title' => 'Nouvel utilisateur inscrit',
            'message' => $this->newUser->name . ' vient de s\'inscrire sur la plateforme.',
            'user_id' => $this->newUser->id,
            'user_name' => $this->newUser->name,
            'user_email' => $this->newUser->email,
            'action_url' => '/admin/users',
            'type' => 'new_user_registered',
        ]);
    }
}
