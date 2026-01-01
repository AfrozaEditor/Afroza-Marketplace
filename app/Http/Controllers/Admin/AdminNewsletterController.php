<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\SendNewsletterJob;
use App\Models\Newsletter;
use App\Models\NewsletterSubscriber;
use App\Notifications\NewsletterNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class AdminNewsletterController extends Controller
{
    /**
     * Display a listing of newsletters
     */
    public function index(Request $request)
    {
        $status = $request->get('status', 'all');
        
        $query = Newsletter::with('author')
            ->orderBy('created_at', 'desc');
        
        if ($status !== 'all') {
            $query->where('status', $status);
        }
        
        $newsletters = $query->paginate(10)->withQueryString();
        
        $statusCounts = [
            'all' => Newsletter::count(),
            'draft' => Newsletter::where('status', 'draft')->count(),
            'sent' => Newsletter::where('status', 'sent')->count(),
            'scheduled' => Newsletter::where('status', 'scheduled')->count(),
        ];
        
        $subscriberStats = [
            'total' => NewsletterSubscriber::count(),
            'active' => NewsletterSubscriber::active()->count(),
            'unsubscribed' => NewsletterSubscriber::unsubscribed()->count(),
        ];
        
        return Inertia::render('admin/newsletters/index', [
            'newsletters' => $newsletters,
            'statusCounts' => $statusCounts,
            'subscriberStats' => $subscriberStats,
            'currentStatus' => $status,
        ]);
    }

    /**
     * Show the form for creating a new newsletter
     */
    public function create()
    {
        $subscriberCount = NewsletterSubscriber::active()->count();
        
        return Inertia::render('admin/newsletters/create', [
            'subscriberCount' => $subscriberCount,
        ]);
    }

    /**
     * Store a newly created newsletter
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'preview_text' => 'nullable|string|max:500',
            'content' => 'required|string',
            'scheduled_at' => 'nullable|date|after:now',
            'send_immediately' => 'nullable|boolean',
        ]);

        $status = 'draft';
        if (!empty($validated['scheduled_at'])) {
            $status = 'scheduled';
        }

        $newsletter = Newsletter::create([
            'subject' => $validated['subject'],
            'preview_text' => $validated['preview_text'] ?? null,
            'content' => $validated['content'],
            'status' => $status,
            'scheduled_at' => $validated['scheduled_at'] ?? null,
            'author_id' => auth()->id(),
        ]);

        // If send_immediately is true, send the newsletter right away
        if (!empty($request->send_immediately)) {
            return $this->send($newsletter);
        }

        return redirect()->route('admin.newsletters.index')
            ->with('success', 'Newsletter créée avec succès.');
    }

    /**
     * Show the form for editing a newsletter
     */
    public function edit(Newsletter $newsletter)
    {
        $subscriberCount = NewsletterSubscriber::active()->count();
        
        return Inertia::render('admin/newsletters/edit', [
            'newsletter' => $newsletter->load('author'),
            'subscriberCount' => $subscriberCount,
        ]);
    }

    /**
     * Update the specified newsletter
     */
    public function update(Request $request, Newsletter $newsletter)
    {
        if ($newsletter->status === 'sent') {
            return redirect()->back()
                ->with('error', 'Impossible de modifier une newsletter déjà envoyée.');
        }

        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'preview_text' => 'nullable|string|max:500',
            'content' => 'required|string',
            'status' => 'required|in:draft,scheduled',
            'scheduled_at' => 'nullable|date|after:now',
        ]);

        if ($validated['status'] === 'scheduled' && empty($validated['scheduled_at'])) {
            $validated['status'] = 'draft';
        }

        $newsletter->update($validated);

        return redirect()->route('admin.newsletters.index')
            ->with('success', 'Newsletter mise à jour avec succès.');
    }

    /**
     * Remove the specified newsletter
     */
    public function destroy(Newsletter $newsletter)
    {
        if ($newsletter->status === 'sent') {
            return redirect()->back()
                ->with('error', 'Impossible de supprimer une newsletter déjà envoyée.');
        }

        $newsletter->delete();

        return redirect()->route('admin.newsletters.index')
            ->with('success', 'Newsletter supprimée.');
    }

    /**
     * Send newsletter immediately
     */
    public function send(Newsletter $newsletter)
    {
        if ($newsletter->status === 'sent') {
            return redirect()->back()
                ->with('error', 'Cette newsletter a déjà été envoyée.');
        }

        $subscribers = NewsletterSubscriber::active()->get();
        
        if ($subscribers->isEmpty()) {
            return redirect()->back()
                ->with('error', 'Aucun abonné actif pour recevoir cette newsletter.');
        }

        // Update newsletter status
        $newsletter->update([
            'status' => 'sending',
            'recipients_count' => $subscribers->count(),
        ]);

        // Send to each subscriber
        foreach ($subscribers as $subscriber) {
            try {
                Notification::route('mail', $subscriber->email)
                    ->notify(new NewsletterNotification($newsletter, $subscriber));
            } catch (\Exception $e) {
                \Log::error("Failed to send newsletter to {$subscriber->email}: " . $e->getMessage());
            }
        }

        $newsletter->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);

        return redirect()->back()
            ->with('success', "Newsletter envoyée à {$subscribers->count()} abonnés.");
    }

    /**
     * Preview newsletter
     */
    public function preview(Newsletter $newsletter)
    {
        return view('emails.newsletter', [
            'newsletter' => $newsletter,
            'subscriber' => (object) [
                'name' => 'Prénom Exemple',
                'email' => 'exemple@email.com',
                'token' => 'preview-token',
            ],
        ]);
    }

    /**
     * Send test email
     */
    public function sendTest(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'preview_text' => 'nullable|string|max:500',
            'content' => 'required|string',
        ]);

        // Create a temporary newsletter object for the test
        $newsletter = new Newsletter([
            'subject' => $validated['subject'],
            'preview_text' => $validated['preview_text'] ?? null,
            'content' => $validated['content'],
        ]);
        $newsletter->id = 0; // Temporary ID for preview

        $testSubscriber = (object) [
            'name' => 'Test',
            'email' => $validated['email'],
            'token' => 'test-token-' . time(),
        ];

        try {
            Notification::route('mail', $validated['email'])
                ->notify(new NewsletterNotification($newsletter, $testSubscriber));

            return redirect()->back()
                ->with('success', "Email de test envoyé à {$validated['email']}");
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', "Erreur lors de l'envoi: " . $e->getMessage());
        }
    }

    /**
     * List all subscribers
     */
    public function subscribers(Request $request)
    {
        $status = $request->get('status', 'all');
        
        $query = NewsletterSubscriber::with('user')
            ->orderBy('subscribed_at', 'desc');
        
        if ($status !== 'all') {
            $query->where('status', $status);
        }
        
        $subscribers = $query->paginate(20)->withQueryString();
        
        $statusCounts = [
            'all' => NewsletterSubscriber::count(),
            'active' => NewsletterSubscriber::active()->count(),
            'unsubscribed' => NewsletterSubscriber::unsubscribed()->count(),
            'bounced' => NewsletterSubscriber::where('status', 'bounced')->count(),
        ];
        
        return Inertia::render('admin/newsletters/subscribers', [
            'subscribers' => $subscribers,
            'statusCounts' => $statusCounts,
            'currentStatus' => $status,
        ]);
    }

    /**
     * Export subscribers as CSV
     */
    public function exportSubscribers()
    {
        $subscribers = NewsletterSubscriber::active()->get(['email', 'name', 'subscribed_at']);
        
        $filename = 'newsletter_subscribers_' . date('Y-m-d') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function () use ($subscribers) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Email', 'Nom', 'Date inscription']);
            
            foreach ($subscribers as $subscriber) {
                fputcsv($file, [
                    $subscriber->email,
                    $subscriber->name,
                    $subscriber->subscribed_at->format('Y-m-d H:i:s'),
                ]);
            }
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Update subscriber status
     */
    public function updateSubscriber(Request $request, NewsletterSubscriber $subscriber)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,unsubscribed,bounced',
        ]);

        $subscriber->update([
            'status' => $validated['status'],
            'unsubscribed_at' => $validated['status'] === 'unsubscribed' ? now() : null,
        ]);

        return redirect()->back()
            ->with('success', 'Statut de l\'abonné mis à jour.');
    }

    /**
     * Delete a subscriber
     */
    public function destroySubscriber(NewsletterSubscriber $subscriber)
    {
        $subscriber->delete();

        return redirect()->back()
            ->with('success', 'Abonné supprimé.');
    }
}
