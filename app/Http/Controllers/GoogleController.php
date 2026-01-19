<?php

namespace App\Http\Controllers;


use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use App\Notifications\NewUserRegistered;
use Inertia\Inertia;

class GoogleController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        // Recherche l'utilisateur existant par email
        $existingUser = User::where('email', $googleUser->getEmail())->first();

        if ($existingUser) {
            // Utilisateur existant - mettre à jour google_id si nécessaire
            if (!$existingUser->google_id) {
                $existingUser->update(['google_id' => $googleUser->getId()]);
            }

            Auth::login($existingUser);

            // Si l'utilisateur n'a pas de rôle, rediriger vers le choix du rôle
            if ($existingUser->roles->isEmpty()) {
                return redirect()->route('auth.choose-role');
            }

            return redirect('/');
        }

        // Nouvel utilisateur - créer et rediriger vers le choix du rôle
        $user = User::create([
            'name' => $googleUser->getName(),
            'email' => $googleUser->getEmail(),
            'google_id' => $googleUser->getId(),
            'password' => bcrypt(Str::random(24)),
            'email_verified_at' => now(), // Email vérifié via Google
        ]);

        Auth::login($user);

        // Rediriger vers la page de choix du rôle
        return redirect()->route('auth.choose-role');
    }

    /**
     * Afficher la page de choix du rôle
     */
    public function showChooseRole()
    {
        $user = auth()->user();

        // Si l'utilisateur a déjà un rôle, rediriger vers l'accueil
        if ($user->roles->isNotEmpty()) {
            return redirect('/');
        }

        return Inertia::render('auth/ChooseRole');
    }

    /**
     * Enregistrer le rôle choisi
     */
    public function storeRole(Request $request)
    {
        $request->validate([
            'role' => ['required', 'string', 'in:customer,vendor,delivery'],
        ]);

        $user = auth()->user();

        // Vérifier que l'utilisateur n'a pas déjà un rôle
        if ($user->roles->isNotEmpty()) {
            return redirect('/')->with('error', 'Vous avez déjà un rôle attribué.');
        }

        $user->assignRole($request->role);

        $messages = [
            'customer' => 'Bienvenue ! Vous pouvez maintenant faire vos achats.',
            'vendor' => 'Bienvenue ! Vous pouvez maintenant créer votre boutique.',
            'delivery' => 'Bienvenue ! Vous pouvez maintenant postuler comme livreur.',
        ];

        // Notifier les administrateurs
        $admins = User::role('admin')->get();
        Notification::send($admins, new NewUserRegistered($user));

        event(new Registered($user));

        if ($request->role === 'delivery') {
            return redirect()->route('delivery.register')->with('success', 'Bienvenue ! Veuillez compléter votre profil de livreur pour commencer.');
        }
        else
            return redirect('/')->with('success', $messages[$request->role]);
    }
}
