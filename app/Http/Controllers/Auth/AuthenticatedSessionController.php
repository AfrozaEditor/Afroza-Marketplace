<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = $request->user()->load('cart', 'delivery');
        $role = $user->getRole();

        // Gestion spéciale pour les livreurs
        if ($role && $role->name === 'delivery') {
            // Si pas de profil livreur, rediriger vers le formulaire de création
            if (!$user->delivery) {
                return redirect()->route('delivery.register')
                    ->with('info', 'Veuillez compléter votre profil de livreur pour commencer.');
            }
            
            // Si profil suspendu
            if ($user->delivery->statut === 'suspendu') {
                return redirect()->route('delivery.suspended');
            }
            
            // Si profil en attente
            if ($user->delivery->statut === 'en_attente' || $user->delivery->statut === 'en attente') {
                return redirect()->route('home')
                    ->with('info', 'Votre profil de livreur est en cours de vérification. Vous serez notifié une fois approuvé.');
            }
            
            // Si profil rejeté
            if ($user->delivery->statut === 'rejeté') {
                return redirect()->route('delivery.register')
                    ->with('warning', 'Votre profil a été rejeté. Raison: ' . ($user->delivery->rejection_reason ?? 'Non spécifiée') . '. Veuillez le modifier et soumettre à nouveau.');
            }
            
            // Si profil approuvé, aller au dashboard livreur
            if ($user->delivery->statut === 'approuvé') {
                return redirect()->route('delivery.dashboard');
            }
        }

        // Gestion des autres rôles
        if ($role && $role->name === 'vendor') {
            return redirect()->route('dashboard');
        } else if ($role && $role->name === 'admin') {
            return redirect()->route('admin');
        } else {
            return redirect()->route('home');
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
