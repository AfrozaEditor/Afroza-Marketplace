<?php

namespace App\Notifications;

use App\Models\Newsletter;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewsletterNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected Newsletter $newsletter;
    protected object $subscriber;

    /**
     * Create a new notification instance.
     */
    public function __construct(Newsletter $newsletter, object $subscriber)
    {
        $this->newsletter = $newsletter;
        $this->subscriber = $subscriber;
    }

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
        $unsubscribeUrl = url('/newsletter/unsubscribe/' . $this->subscriber->token);
        $viewInBrowserUrl = url('/newsletter/view/' . $this->newsletter->id);
        
        return (new MailMessage)
            ->subject($this->newsletter->subject)
            ->view('emails.newsletter', [
                'newsletter' => $this->newsletter,
                'subscriber' => $this->subscriber,
                'unsubscribeUrl' => $unsubscribeUrl,
                'viewInBrowserUrl' => $viewInBrowserUrl,
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'newsletter_id' => $this->newsletter->id,
            'subject' => $this->newsletter->subject,
        ];
    }
}
