<?php

namespace App\Notifications;

use App\Models\Message;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class NewMessage extends Notification
{
    use Queueable;

    protected Message $message;
    protected User $sender;
    protected int $conversationId;

    /**
     * Create a new notification instance.
     */
    public function __construct(Message $message, User $sender, int $conversationId)
    {
        $this->message = $message;
        $this->sender = $sender;
        $this->conversationId = $conversationId;
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
            'message_id' => $this->message->id,
            'conversation_id' => $this->conversationId,
            'sender_id' => $this->sender->id,
            'sender_name' => $this->sender->name,
            'sender_avatar' => $this->sender->avatar ?? null,
            'content' => \Str::limit($this->message->content, 50),
            'title' => 'Nouveau message',
            'message' => $this->sender->name . ' vous a envoyé un message',
            'action_url' => '/chat?conversation=' . $this->conversationId,
        ];
    }

    /**
     * Get the broadcastable representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'id' => $this->id,
            'type' => 'new.message',
            'message_id' => $this->message->id,
            'conversation_id' => $this->conversationId,
            'sender_id' => $this->sender->id,
            'sender_name' => $this->sender->name,
            'sender_avatar' => $this->sender->avatar ?? null,
            'content' => \Str::limit($this->message->content, 50),
            'title' => 'Nouveau message',
            'message' => $this->sender->name . ' vous a envoyé un message',
            'action_url' => '/chat?conversation=' . $this->conversationId,
            'created_at' => now()->toISOString(),
        ]);
    }

    /**
     * Get the type of the notification being broadcast.
     */
    public function broadcastType(): string
    {
        return 'new.message';
    }
}
