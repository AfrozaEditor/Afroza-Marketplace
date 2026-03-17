<?php

namespace App\Listeners;

use App\Models\Conversation;
use App\Models\User;
use App\Notifications\WelcomeUserNotification;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class SendWelcomeOnRegistered
{
    /**
     * Handle the event.
     */
    public function handle(Registered $event): void
    {
        $user = $event->user;

        if (!$user instanceof User) {
            return;
        }

        $user->notify(new WelcomeUserNotification());

        $sender = $this->resolveWelcomeSender($user);
        if (!$sender) {
            Log::warning('Welcome chat message skipped: no sender available.', [
                'new_user_id' => $user->id,
            ]);
            return;
        }

        $conversation = $this->findOrCreateDirectConversation($user, $sender);

        $welcomeContent = $this->buildWelcomeMessage($user);

        $alreadySent = $conversation->messages()
            ->where('user_id', $sender->id)
            ->where('content', $welcomeContent)
            ->exists();

        if ($alreadySent) {
            return;
        }

        $conversation->messages()->create([
            'user_id' => $sender->id,
            'content' => $welcomeContent,
            'read' => false,
        ]);
    }

    private function resolveWelcomeSender(User $newUser): ?User
    {
        $admin = User::role('admin')
            ->where('id', '!=', $newUser->id)
            ->orderBy('id')
            ->first();

        if ($admin) {
            return $admin;
        }

        $existingUser = User::where('id', '!=', $newUser->id)
            ->orderBy('id')
            ->first();

        if ($existingUser) {
            return $existingUser;
        }

        $supportUser = User::firstOrCreate(
            ['email' => 'support@afrozamarketplace.app'],
            [
                'name' => 'Support Afroza',
                'password' => bcrypt(Str::random(40)),
                'status' => 'active',
            ]
        );

        if ($supportUser->id === $newUser->id) {
            return null;
        }

        return $supportUser;
    }

    private function findOrCreateDirectConversation(User $newUser, User $sender): Conversation
    {
        $existingConversation = $newUser->conversations()
            ->whereHas('participants', function ($query) use ($sender) {
                $query->where('user_id', $sender->id);
            })
            ->whereDoesntHave('participants', function ($query) use ($newUser, $sender) {
                $query->where('user_id', '!=', $newUser->id)
                    ->where('user_id', '!=', $sender->id);
            })
            ->first();

        if ($existingConversation) {
            return $existingConversation;
        }

        $conversation = Conversation::create([
            'is_group' => false,
        ]);

        $conversation->participants()->attach([
            $newUser->id,
            $sender->id,
        ]);

        return $conversation;
    }

    private function buildWelcomeMessage(User $user): string
    {
        $role = $user->getRole()?->name;

        $roleSpecific = match ($role) {
            'vendor' => "🎯 Vos prochaines étapes (Vendeur) :\n"
                . "• Créez votre boutique (nom, logo, description).\n"
                . "• Publiez vos premiers produits avec des photos de qualité.\n"
                . "• Répondez rapidement aux messages pour convertir plus de ventes.",
            'delivery' => "🎯 Vos prochaines étapes (Livreur) :\n"
                . "• Complétez votre profil livreur pour activer votre compte.\n"
                . "• Vérifiez vos informations de contact et disponibilité.\n"
                . "• Suivez les commandes qui vous sont assignées dans le dashboard.",
            default => "🎯 Vos prochaines étapes (Acheteur) :\n"
                . "• Explorez les produits et boutiques de la marketplace.\n"
                . "• Discutez avec les vendeurs dans cette messagerie.\n"
                . "• Passez votre première commande en toute sécurité.",
        };

        return "👋 Bienvenue sur Afroza Marketplace, {$user->name} !\n\n"
            . "Nous sommes ravis de vous accueillir. Voici comment la plateforme fonctionne :\n"
            . "1) Parcourez les produits et boutiques.\n"
            . "2) Contactez les vendeurs via la messagerie intégrée.\n"
            . "3) Commandez, vendez ou livrez selon votre rôle.\n\n"
            . $roleSpecific
            . "\n\nBesoin d'aide ? Répondez à ce message, nous sommes là pour vous accompagner.";
    }
}
