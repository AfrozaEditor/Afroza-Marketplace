<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class RoleChanged extends Notification
{
    use Queueable;

    protected string $oldRole;
    protected string $newRole;

    /**
     * Mapping des noms de rôles pour affichage
     */
    protected array $roleLabels = [
        'admin' => 'Administrateur',
        'vendor' => 'Vendeur',
        'customer' => 'Client',
        'delivery' => 'Livreur',
    ];

    /**
     * Create a new notification instance.
     */
    public function __construct(string $oldRole, string $newRole)
    {
        $this->oldRole = $oldRole;
        $this->newRole = $newRole;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the array representation of the notification for database.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $oldRoleLabel = $this->roleLabels[$this->oldRole] ?? $this->oldRole;
        $newRoleLabel = $this->roleLabels[$this->newRole] ?? $this->newRole;

        return [
            'old_role' => $this->oldRole,
            'new_role' => $this->newRole,
            'old_role_label' => $oldRoleLabel,
            'new_role_label' => $newRoleLabel,
            'title' => 'Changement de rôle',
            'message' => "Votre rôle a été modifié de {$oldRoleLabel} à {$newRoleLabel}",
            'action_url' => '/',
        ];
    }

    /**
     * Get the broadcastable representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        $oldRoleLabel = $this->roleLabels[$this->oldRole] ?? $this->oldRole;
        $newRoleLabel = $this->roleLabels[$this->newRole] ?? $this->newRole;

        return new BroadcastMessage([
            'id' => $this->id,
            'type' => 'role.changed',
            'old_role' => $this->oldRole,
            'new_role' => $this->newRole,
            'old_role_label' => $oldRoleLabel,
            'new_role_label' => $newRoleLabel,
            'title' => 'Changement de rôle',
            'message' => "Votre rôle a été modifié de {$oldRoleLabel} à {$newRoleLabel}",
            'action_url' => '/',
            'created_at' => now()->toISOString(),
        ]);
    }
}
