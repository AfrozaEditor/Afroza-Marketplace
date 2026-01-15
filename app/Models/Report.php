<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'reportable_type',
        'reportable_id',
        'reason',
        'description',
        'status',
        'admin_notes',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    /**
     * Les raisons de signalement disponibles
     */
    public const REASONS = [
        'contrefacon' => 'Contrefaçon / Article non authentique',
        'inapproprie' => 'Contenu inapproprié',
        'spam' => 'Spam ou publicité',
        'fraude' => 'Fraude ou arnaque suspectée',
        'non_conforme' => 'Description non conforme',
        'autre' => 'Autre raison',
    ];

    /**
     * L'élément signalé (produit ou boutique)
     */
    public function reportable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * L'utilisateur qui a fait le signalement
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * L'admin qui a traité le signalement
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Scope pour les signalements en attente
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope pour les signalements de produits
     */
    public function scopeForProducts($query)
    {
        return $query->where('reportable_type', Product::class);
    }

    /**
     * Scope pour les signalements de boutiques
     */
    public function scopeForShops($query)
    {
        return $query->where('reportable_type', Shop::class);
    }
}
