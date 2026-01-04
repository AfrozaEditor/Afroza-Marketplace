<?php

namespace App\Notifications;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class NewShopFollower extends Notification
{
    use Queueable;

    protected User $follower;
    protected Shop $shop;

    /**
     * Create a new notification instance.
     */
    public function __construct(User $follower, Shop $shop)
    {
        $this->follower = $follower;
        $this->shop = $shop;
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
        return [
            'follower_id' => $this->follower->id,
            'follower_name' => $this->follower->name,
            'follower_avatar' => $this->follower->avatar ?? null,
            'shop_id' => $this->shop->id,
            'shop_name' => $this->shop->name,
            'shop_slug' => $this->shop->slug,
            'title' => 'Nouveau follower',
            'message' => $this->follower->name . ' suit maintenant votre boutique ' . $this->shop->name,
            'action_url' => '/marketplace/' . $this->shop->slug,
        ];
    }

    /**
     * Get the broadcastable representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'id' => $this->id,
            'type' => 'new.shop.follower',
            'follower_id' => $this->follower->id,
            'follower_name' => $this->follower->name,
            'follower_avatar' => $this->follower->avatar ?? null,
            'shop_id' => $this->shop->id,
            'shop_name' => $this->shop->name,
            'shop_slug' => $this->shop->slug,
            'title' => 'Nouveau follower',
            'message' => $this->follower->name . ' suit maintenant votre boutique ' . $this->shop->name,
            'action_url' => '/marketplace/' . $this->shop->slug,
            'created_at' => now()->toISOString(),
        ]);
    }
}
