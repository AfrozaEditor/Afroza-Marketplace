<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
//use Illuminate\Queue\SerializesModels;

class NewMessage implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    public $message;
    public $conversation_id;

    public function __construct($message, $conversation_id)
    {
        \Log::info('Message avant broadcasting', ['message' => $message]);

        // Vérifier si le message peut être encodé en JSON
        $jsonEncoded = json_encode($message);
        if (json_last_error() !== JSON_ERROR_NONE) {
            \Log::error('Erreur JSON dans le message', [
                'error' => json_last_error_msg(),
                'message' => $message
            ]);
        }


        $this->message = $message;
        $this->conversation_id = $conversation_id;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('chat.' . $this->conversation_id);
    }

//    public function broadcastWith()
//    {
//        // Retournez uniquement les attributs nécessaires pour le front-end
////        return [
////            'id' => $this->message['id'],
////            'content' => $this->message['content'], // <-- CORRIGÉ : Il y avait un tiret (-) au lieu d'un crochet ouvrant ([)
////            'created_at' => $this->message['created_at'], // <-- CORRIGÉ : Accès en tant que clé de tableau.
////            // Si c'est une instance Carbon dans le tableau,
////            // vous devrez peut-être la formater avant de la mettre dans le tableau initial.
////            // Sinon, si c'est déjà une chaîne, c'est bon.
////            'user' => [ // Assurez-vous que $this->message['user'] existe et est un tableau avec 'id' et 'name'
////                'id' => $this->message['user']['id'],   // <-- CORRIGÉ : Accès en tant que clé de tableau
////                'name' => $this->message['user']['name'], // <-- CORRIGÉ : Accès en tant que clé de tableau
////                // Ajoutez d'autres attributs de l'utilisateur si besoin, toujours en utilisant la syntaxe de tableau
////            ],
////            // ... d'autres attributs simples du message
////            'message' => $this->message
//        return [
//            'id' => $this->message['id'],
//            'content' => $this->message['content'],
//            'created_at' => $this->message['created_at'],
//            'is_mine' => false,
////            'user' => [
////                'id' => $this->message.user['id'],
////                'name' => $this->message['name'],
////            ]
//        ];
//    }

    public function broadcastWith()
    {
        return [
            'message' => $this->message
        ];

    }


    public function broadcastAs()
    {
        return 'message.new';
    }
}
