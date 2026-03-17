<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeUserNotification extends Notification
{
    use Queueable;

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $roleName = $notifiable->getRole()?->name;

        [$roleLabel, $roleTips, $actionUrl, $actionLabel] = match ($roleName) {
            'vendor' => [
                'Vendeur',
                [
                    'Créez votre boutique avec une belle description et votre logo.',
                    'Ajoutez vos produits avec des photos claires et des prix précis.',
                    'Répondez rapidement aux messages pour augmenter vos ventes.',
                ],
                url('/marketplace/create'),
                'Créer ma boutique',
            ],
            'delivery' => [
                'Livreur',
                [
                    'Complétez votre profil livreur pour activer votre compte.',
                    'Gardez vos informations de contact et disponibilité à jour.',
                    'Suivez les commandes et confirmez les livraisons en temps réel.',
                ],
                url('/delivery/register'),
                'Compléter mon profil livreur',
            ],
            default => [
                'Acheteur',
                [
                    'Explorez les produits et boutiques qui vous intéressent.',
                    'Discutez avec les vendeurs via la messagerie intégrée.',
                    'Passez votre commande et suivez sa progression facilement.',
                ],
                url('/products'),
                'Découvrir les produits',
            ],
        };

        $mail = (new MailMessage)
            ->subject('Bienvenue sur Afroza Marketplace 🎉')
            ->greeting('Bonjour ' . $notifiable->name . ' 👋')
            ->line('Bienvenue sur Afroza Marketplace ! Votre compte a bien été créé.')
            ->line('Votre profil actuel : ' . $roleLabel)
            ->line('Voici vos prochaines étapes recommandées :');

        foreach ($roleTips as $index => $tip) {
            $mail->line(($index + 1) . '. ' . $tip);
        }

        return $mail
            ->action($actionLabel, $actionUrl)
            ->line('Besoin d’aide ? Répondez à ce message ou utilisez la messagerie dans l’application.')
            ->line('Merci de votre confiance et excellente expérience sur Afroza Marketplace.');
    }
}
