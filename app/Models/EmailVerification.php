<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class EmailVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'otp',
        'registration_data',
        'expires_at',
        'attempts',
        'verified',
    ];

    protected $casts = [
        'registration_data' => 'array',
        'expires_at' => 'datetime',
        'verified' => 'boolean',
    ];

    /**
     * Générer un code OTP à 6 chiffres
     */
    public static function generateOtp(): string
    {
        return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Créer une nouvelle vérification OTP
     */
    public static function createForEmail(string $email, array $registrationData = []): self
    {
        // Supprimer les anciennes vérifications pour cet email
        static::where('email', $email)->delete();

        return static::create([
            'email' => $email,
            'otp' => static::generateOtp(),
            'registration_data' => $registrationData,
            'expires_at' => Carbon::now()->addMinutes(10), // Expire dans 10 minutes
            'attempts' => 0,
            'verified' => false,
        ]);
    }

    /**
     * Vérifier si le code OTP est expiré
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Vérifier si le nombre maximum de tentatives est atteint
     */
    public function hasMaxAttempts(): bool
    {
        return $this->attempts >= 5;
    }

    /**
     * Vérifier le code OTP
     */
    public function verify(string $otp): bool
    {
        if ($this->isExpired()) {
            return false;
        }

        if ($this->hasMaxAttempts()) {
            return false;
        }

        $this->increment('attempts');

        if ($this->otp === $otp) {
            $this->update(['verified' => true]);
            return true;
        }

        return false;
    }

    /**
     * Obtenir le temps restant avant expiration en secondes
     */
    public function getRemainingTimeAttribute(): int
    {
        return max(0, $this->expires_at->diffInSeconds(now(), false) * -1);
    }

    /**
     * Scope pour les vérifications non expirées
     */
    public function scopeNotExpired($query)
    {
        return $query->where('expires_at', '>', now());
    }

    /**
     * Scope pour les vérifications non vérifiées
     */
    public function scopeNotVerified($query)
    {
        return $query->where('verified', false);
    }
}
