<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\EmailVerification;
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

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     * Envoie un code OTP à l'email pour vérification.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', Rules\Password::defaults()],
            'role' => ['required', 'string', 'in:customer,vendor,delivery'],
        ]);

        // Créer une vérification OTP
        $verification = EmailVerification::createForEmail($request->email, [
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role,
        ]);

        // Envoyer l'email avec le code OTP
        Notification::route('mail', $request->email)
            ->notify(new EmailVerificationOtp($verification->otp));

        // Stocker l'email dans la session pour la page de vérification
        session(['verification_email' => $request->email]);

        return redirect()->route('verification.otp.show', ['email' => $request->email])
            ->with('success', 'Un code de vérification a été envoyé à votre adresse email.');
    }

    public function index()
    {
        $users = User::all();

        return Inertia::render('admin/users/index',[
            'users' => $users,
        ]);
    }

    public function destroy(string $id)
    {
        //
    }
}
