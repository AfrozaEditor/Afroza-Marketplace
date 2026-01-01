<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Conversation;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Canal de présence pour le chat (permet de voir qui est en ligne)
Broadcast::channel('chat.{conversationId}', function ($user, $conversationId) {
    if ($user->conversations()->where('conversations.id', $conversationId)->exists()) {
        return [
            'id' => $user->id,
            'name' => $user->name,
        ];
    }
    return false;
});

// Canal de présence pour les utilisateurs en ligne globalement
Broadcast::channel('online', function ($user) {
    return [
        'id' => $user->id,
        'name' => $user->name,
    ];
});

// Canal privé pour les notifications utilisateur
Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});


