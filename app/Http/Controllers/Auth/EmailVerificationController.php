<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\EmailVerification;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Notifications\EmailVerificationOtp;
use App\Notifications\NewUserRegistered;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationController extends Controller
{
    /**
     * Afficher la page de vérification OTP
     */
    public function show(Request $request): Response|RedirectResponse
    {
        $email = $request->query('email') ?? session('verification_email');
        
        if (!$email) {
            return redirect()->route('register')
                ->with('error', 'Veuillez d\'abord vous inscrire.');
        }

        $verification = EmailVerification::where('email', $email)
            ->notExpired()
            ->notVerified()
            ->first();

        if (!$verification) {
            return redirect()->route('register')
                ->with('error', 'Session de vérification expirée. Veuillez vous réinscrire.');
        }

        return Inertia::render('auth/verify-otp', [
            'email' => $email,
            'expiresAt' => $verification->expires_at->toISOString(),
            'remainingTime' => $verification->remaining_time,
        ]);
    }

    /**
     * Vérifier le code OTP
     */
    public function verify(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        $verification = EmailVerification::where('email', $request->email)
            ->notExpired()
            ->notVerified()
            ->first();

        if (!$verification) {
            return back()->withErrors([
                'otp' => 'Session de vérification expirée. Veuillez demander un nouveau code.',
            ]);
        }

        if ($verification->hasMaxAttempts()) {
            return back()->withErrors([
                'otp' => 'Nombre maximum de tentatives atteint. Veuillez demander un nouveau code.',
            ]);
        }

        if (!$verification->verify($request->otp)) {
            $attemptsLeft = 5 - $verification->attempts;
            return back()->withErrors([
                'otp' => "Code incorrect. Il vous reste {$attemptsLeft} tentative(s).",
            ]);
        }

        // Le code est correct, créer l'utilisateur
        $registrationData = $verification->registration_data;

        $user = User::create([
            'name' => $registrationData['name'],
            'email' => $registrationData['email'],
            'password' => Hash::make($registrationData['password']),
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        $user->assignSingleRole($registrationData['role']);

        // Assigner le plan Starter aux vendeurs
        if ($registrationData['role'] === 'vendor') {
            $starterPlan = SubscriptionPlan::where('slug', 'starter')->first();
            if ($starterPlan) {
                Subscription::create([
                    'user_id' => $user->id,
                    'subscription_plan_id' => $starterPlan->id,
                    'status' => 'active',
                    'starts_at' => now(),
                ]);
            }
        }

        // Notifier les administrateurs
        $admins = User::role('admin')->get();
        Notification::send($admins, new NewUserRegistered($user));

        event(new Registered($user));

        // Supprimer la vérification
        $verification->delete();

        // Connecter l'utilisateur
        Auth::login($user);

        // Nettoyer la session
        session()->forget('verification_email');

        $role = $user->getRole();
        if ($role && $role->name === 'delivery') {
            return to_route('delivery.register');
        }

        return to_route('home')->with('success', 'Votre compte a été créé avec succès !');
    }

    /**
     * Renvoyer le code OTP
     */
    public function resend(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->email;

        // Vérifier si une vérification existe
        $existingVerification = EmailVerification::where('email', $email)->first();

        if (!$existingVerification) {
            return back()->withErrors([
                'email' => 'Aucune demande de vérification trouvée pour cet email.',
            ]);
        }

        // Vérifier le délai entre les envois (minimum 60 secondes)
        if ($existingVerification->updated_at->diffInSeconds(now()) < 60) {
            $waitTime = 60 - $existingVerification->updated_at->diffInSeconds(now());
            return back()->withErrors([
                'resend' => "Veuillez attendre {$waitTime} secondes avant de demander un nouveau code.",
            ]);
        }

        // Créer un nouveau code OTP
        $registrationData = $existingVerification->registration_data;
        $newVerification = EmailVerification::createForEmail($email, $registrationData);

        // Envoyer le nouveau code
        Notification::route('mail', $email)
            ->notify(new EmailVerificationOtp($newVerification->otp));

        return back()->with('success', 'Un nouveau code a été envoyé à votre adresse email.');
    }
}
