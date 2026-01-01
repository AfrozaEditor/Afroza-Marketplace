<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Newsletter extends Model
{
    protected $fillable = [
        'author_id',
        'subject',
        'preview_text',
        'content',
        'status',
        'scheduled_at',
        'sent_at',
        'recipients_count',
        'opened_count',
        'clicked_count',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeSent($query)
    {
        return $query->where('status', 'sent');
    }

    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    public function getOpenRateAttribute(): float
    {
        if ($this->recipients_count === 0) return 0;
        return round(($this->opened_count / $this->recipients_count) * 100, 2);
    }

    public function getClickRateAttribute(): float
    {
        if ($this->recipients_count === 0) return 0;
        return round(($this->clicked_count / $this->recipients_count) * 100, 2);
    }
}
