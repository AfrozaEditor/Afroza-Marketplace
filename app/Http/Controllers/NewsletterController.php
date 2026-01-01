<?php

namespace App\Http\Controllers;

use App\Models\Newsletter;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NewsletterController extends Controller
{
    /**
     * Subscribe to newsletter
     */
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'name' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:100',
        ]);

        // Check if already subscribed
        $existing = NewsletterSubscriber::where('email', $validated['email'])->first();
        
        if ($existing) {
            if ($existing->status === 'active') {
                return response()->json([
                    'message' => 'Vous êtes déjà inscrit à notre newsletter.',
                    'already_subscribed' => true,
                ], 200);
            }
            
            // Resubscribe
            $existing->resubscribe();
            return response()->json([
                'message' => 'Vous êtes à nouveau inscrit à notre newsletter !',
                'resubscribed' => true,
            ]);
        }

        // Create new subscriber
        $subscriber = NewsletterSubscriber::create([
            'email' => $validated['email'],
            'name' => $validated['name'] ?? null,
            'user_id' => Auth::id(),
            'source' => $validated['source'] ?? 'website',
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Merci ! Vous êtes maintenant inscrit à notre newsletter.',
            'subscriber' => $subscriber,
        ], 201);
    }

    /**
     * Unsubscribe from newsletter
     */
    public function unsubscribe(Request $request, string $token)
    {
        $subscriber = NewsletterSubscriber::where('token', $token)->firstOrFail();
        
        $subscriber->unsubscribe();

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Vous avez été désinscrit de notre newsletter.',
            ]);
        }

        return Inertia::render('newsletter/unsubscribed', [
            'email' => $subscriber->email,
        ]);
    }

    /**
     * View newsletter in browser
     */
    public function view(Newsletter $newsletter)
    {
        // Only allow viewing sent newsletters
        if ($newsletter->status !== 'sent') {
            abort(404);
        }

        $subscriber = (object) [
            'name' => null,
            'email' => null,
            'token' => 'browser-view',
        ];

        return view('emails.newsletter', [
            'newsletter' => $newsletter,
            'subscriber' => $subscriber,
            'unsubscribeUrl' => url('/newsletter/subscribe'),
            'viewInBrowserUrl' => url()->current(),
        ]);
    }

    /**
     * Check subscription status
     */
    public function status(Request $request)
    {
        $email = $request->query('email');
        
        if (!$email) {
            return response()->json(['subscribed' => false]);
        }

        $subscriber = NewsletterSubscriber::where('email', $email)
            ->where('status', 'active')
            ->exists();

        return response()->json(['subscribed' => $subscriber]);
    }
}
