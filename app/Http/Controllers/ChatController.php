<?php

namespace App\Http\Controllers;

use App\Events\NewMessage;
use App\Events\UserTyping;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Notifications\NewMessage as NewMessageNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ChatController extends Controller
{
    /**
     * Afficher la page principale du chat
     */
    public function index()
    {
        // $conversations = Auth::user()->conversations()
        //     ->with(['participants' => function ($query) {
        //         $query->where('user_id', '!=', Auth::id());
        //     }, 'messages' => function ($query) {
        //         $query->latest()->take(1);
        //     }])
        //     ->get()
        //     ->map(function ($conversation) {
        //         $lastMessage = $conversation->messages->last();
        //         $unreadCount = $conversation->messages()
        //             ->where('user_id', '!=', Auth::id())
        //             ->where('read', false)
        //             ->count();

        //         return [
        //             'id' => $conversation->id,
        //             'name' => $conversation->is_group ? $conversation->name : $conversation->participants->first()->name,
        //             'last_message' => $lastMessage ? [
        //                 'content' => $lastMessage->content,
        //                 'created_at' => $lastMessage->created_at,
        //                 'is_mine' => $lastMessage->user_id === Auth::id(),
        //             ] : null,
        //             'unread_count' => $unreadCount,
        //         ];
        //     });
$conversations = Auth::user()->conversations()
    ->with(['participants' => function ($query) {
        $query->where('user_id', '!=', Auth::id());
    }])
    ->withCount(['messages as unread_count' => function ($query) {
        $query->where('user_id', '!=', Auth::id())
            ->where('read', false);
    }])
    ->with(['lastMessage' => function ($query) {
        $query->latest();
            // ->select('id', 'conversation_id', 'content', 'created_at', 'user_id');
    }])
    ->get()
    ->map(function ($conversation) {
        $participant = $conversation->participants->first();

        return [
            'id' => $conversation->id,
            'name' => $conversation->is_group ? $conversation->name : ($participant?->name ?? 'Utilisateur'),
            'avatar' => $this->resolveAvatarUrl($participant?->avatar),
            'last_message' => $conversation->lastMessage ? [
                'content' => $conversation->lastMessage->content,
                'created_at' => $conversation->lastMessage->created_at,
                'is_mine' => $conversation->lastMessage->user_id === Auth::id(),
            ] : null,
            'unread_count' => $conversation->unread_count,
        ];
    });

        return Inertia::render('chat/Index', [
            'conversations' => $conversations,
        ]);
    }


    public function getMessages(Conversation $conversation)
{
    // Vérifier que l'utilisateur fait partie de la conversation
    if (!$conversation->participants()->where('user_id', Auth::id())->exists()) {
        abort(403);
    }

    $messages = $conversation->messages()
        ->with('user:id,name,avatar')
        ->orderBy('created_at', 'asc')
        ->get()
        ->map(function ($message) {
            return [
                'id' => $message->id,
                'content' => $message->content,
                'created_at' => $message->created_at,
                'is_mine' => $message->user_id === Auth::id(),
                'user' => [
                    'id' => $message->user->id,
                    'name' => $message->user->name,
                    'avatar' => $this->resolveAvatarUrl($message->user->avatar),
                ],
            ];
        });

    return response()->json(['props' => ['messages' => $messages]]);
}

    /**
     * Afficher une conversation spécifique
     */
    public function show(Conversation $conversation)
    {
        // Vérifier que l'utilisateur fait partie de la conversation
        if (!$conversation->participants()->where('user_id', Auth::id())->exists()) {
            abort(403);
        }

        // Marquer les messages comme lus
        $conversation->messages()
            ->where('user_id', '!=', Auth::id())
            ->where('read', false)
            ->update(['read' => true]);

        $messages = $conversation->messages()
            ->with('user')
            ->get()
            ->map(function ($message) {
                return [
                    'id' => $message->id,
                    'content' => $message->content,
                    'created_at' => $message->created_at,
                    'user' => [
                        'id' => $message->user->id,
                        'name' => $message->user->name,
                        'avatar' => $this->resolveAvatarUrl($message->user->avatar),
                    ],
                    'is_mine' => $message->user_id === Auth::id(),
                ];
            });

//        $participants = $conversation->participants()
//            ->where('user_id', '!=', Auth::id())
//            ->get(['id', 'name']);
        // Modifiez cette partie pour récupérer correctement les participants
        $participants = User::whereIn('id', $conversation->participants()->pluck('user_id'))
            ->where('id', '!=', Auth::id())
            ->first(['id', 'name', 'avatar']);


        return Inertia::render('chat/Show', [
            'conversation' => [
                'id' => $conversation->id,
                'name' => $conversation->is_group ? $conversation->name : ($participants?->name ?? 'Utilisateur'),
                'avatar' => $this->resolveAvatarUrl($participants?->avatar),
//                'name' => 'Conversation',
                'is_group' => $conversation->is_group,
                'participants' => $participants,
            ],
            'messages' => $messages,
            'auth' => [
                'user' => Auth::user()->only(['id', 'name']),
            ],

        ]);
    }

    /**
     * Créer une nouvelle conversation
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        // Vérifier si une conversation existe déjà entre les deux utilisateurs
        $existingConversation = Auth::user()->conversations()
            ->whereHas('participants', function ($query) use ($validated) {
                $query->where('user_id', $validated['user_id']);
            })
            ->whereDoesntHave('participants', function ($query) use ($validated) {
                $query->where('user_id', '!=', Auth::id())
                    ->where('user_id', '!=', $validated['user_id']);
            })
            ->first();

        if ($existingConversation) {
            return redirect()->route('chat.show', $existingConversation);
        }

        // Créer une nouvelle conversation
        $conversation = Conversation::create([
            'is_group' => false,
        ]);

        // Ajouter les participants
        $conversation->participants()->attach([
            Auth::id(),
            $validated['user_id'],
        ]);

        return redirect()->route('chat.show', $conversation);
    }

    /**
     * Envoyer un message
     */
//    public function sendMessage(Request $request, Conversation $conversation)
//    {
//        // Vérifier que l'utilisateur fait partie de la conversation
//        if (!$conversation->participants()->where('user_id', Auth::id())->exists()) {
//            abort(403);
//        }
//
//        $validated = $request->validate([
//            'content' => 'required|string|max:5000',
//        ]);
//
//        $message = $conversation->messages()->create([
//            'user_id' => Auth::id(),
//            'content' => $validated['content'],
//            'read' => false,
//        ]);
//
//        $messageData = [
//            'id' => $message->id,
//            'content' => $message->content,
//            'created_at' => $message->created_at,
//            'is_mine' => false,
//            'user' => [
//                'id' => Auth::id(),
//                'name' => Auth::user()->name
//            ]
//        ];
//
//        // Émettre l'événement pour tous les participants sauf l'expéditeur
//        broadcast(new NewMessage($messageData, $conversation->id))->toOthers();
//        // Modification du message pour les autres utilisateurs
////        $broadcastMessage = array_merge($messageData, ['is_mine' => false]);
////        broadcast(new NewMessage($broadcastMessage, $conversation->id))->toOthers();
//
//
//
////         return back();
//        return response()->json([
//        'props' => [
//            'message' => array_merge($messageData, ['is_mine' => true])
//        ]
//    ]);
//    }

//    public function sendMessage(Request $request, Conversation $conversation)
//    {
//        // Vérifications de base
//        if (!Auth::check()) {
//            return response()->json(['error' => 'Non authentifié'], 401);
//        }
//
//        if (!$conversation->participants()->where('user_id', Auth::id())->exists()) {
//            return response()->json(['error' => 'Non autorisé'], 403);
//        }
//
//        // Validation et création
//        $validated = $request->validate([
//            'content' => 'required|string|max:5000',
//        ]);
//
//        $message = $conversation->messages()->create([
//            'user_id' => Auth::id(),
//            'content' => $validated['content'],
//            'read' => false,
//        ]);
//
//        // Réponse simple sans broadcasting
//        return response()->json([
//            'success' => true,
//            'message' => [
//                'id' => $message->id,
//                'content' => $message->content,
//                'created_at' => $message->created_at,
//                'is_mine' => true,
//                'user' => [
//                    'id' => Auth::id(),
//                    'name' => Auth::user()->name
//                ]
//            ]
//        ]);
//    }
//

//    public function sendMessage(Request $request, Conversation $conversation)
//    {
//        try {
//            // Log pour diagnostic
//            \Log::info('Début sendMessage', [
//                'conversation_id' => $conversation->id,
//                'user_id' => Auth::id(),
//                'user_authenticated' => Auth::check()
//            ]);
//
//            // Vérifier l'authentification
//            if (!Auth::check()) {
//                \Log::error('Utilisateur non authentifié');
//                return response()->json(['error' => 'Non authentifié'], 401);
//            }
//
//            // Vérifier que l'utilisateur fait partie de la conversation
//            if (!$conversation->participants()->where('user_id', Auth::id())->exists()) {
//                \Log::error('Utilisateur non autorisé pour cette conversation', [
//                    'user_id' => Auth::id(),
//                    'conversation_id' => $conversation->id
//                ]);
//                return response()->json(['error' => 'Non autorisé'], 403);
//            }
//
//            // Validation
//            $validated = $request->validate([
//                'content' => 'required|string|max:5000',
//            ]);
//
//            \Log::info('Validation réussie', ['content_length' => strlen($validated['content'])]);
//
//            // Créer le message
//            $message = $conversation->messages()->create([
//                'user_id' => Auth::id(),
//                'content' => $validated['content'],
//                'read' => false,
//            ]);
//
//            \Log::info('Message créé avec succès', ['message_id' => $message->id]);
//
//            // Préparer les données du message
//            $messageData = [
//                'id' => $message->id,
//                'content' => $message->content,
//                'created_at' => $message->created_at->format('c'), // Format standardisé
//                'is_mine' => false,
//                'user' => [
//                    'id' => Auth::id(),
//                    'name' => Auth::user()->name
//                ]
//            ];
//
//            // AJOUTEZ CETTE LIGNE POUR DÉBOGUER
//            \Log::info('Données de message pour broadcasting', ['data' => $messageData]);
//            $jsonString = json_encode($messageData);
//            $cleanData = json_decode($jsonString, true);
//
//            // Tentative de broadcasting avec gestion d'erreur
//            try {
//                \Log::info('Tentative de broadcasting');
//                broadcast(new NewMessage($cleanData, $conversation->id))->toOthers();
//                \Log::info('Broadcasting réussi');
//            } catch (\Exception $broadcastError) {
//                // Log l'erreur de broadcasting mais continue l'exécution
//                \Log::error('Erreur de broadcasting', [
//                    'error' => $broadcastError->getMessage(),
//                    'trace' => $broadcastError->getTraceAsString()
//                ]);
//                // Ne pas faire échouer la requête à cause du broadcasting
//            }
//
//            // Retourner la réponse avec is_mine = true for l'expéditeur
//            return response()->json([
//                'success' => true,
//                'message' => array_merge($messageData, ['is_mine' => true])
//            ]);
//
//        } catch (\Illuminate\Validation\ValidationException $e) {
//            \Log::error('Erreur de validation', ['errors' => $e->errors()]);
//            return response()->json([
//                'success' => false,
//                'errors' => $e->errors()
//            ], 422);
//
//        } catch (\Exception $e) {
//            \Log::error('Erreur générale dans sendMessage', [
//                'error' => $e->getMessage(),
//                'line' => $e->getLine(),
//                'file' => $e->getFile(),
//                'trace' => $e->getTraceAsString()
//            ]);
//
//            return response()->json([
//                'success' => false,
//                'error' => 'Erreur lors de l\'envoi du message',
//                'debug' => config('app.debug') ? $e->getMessage() : null
//            ], 500);
//        }
//    }


    public function sendMessage(Request $request, Conversation $conversation)
    {
        try {
            // Log pour diagnostic
            \Log::info('Début sendMessage', [
                'conversation_id' => $conversation->id,
                'user_id' => Auth::id(),
                'user_authenticated' => Auth::check()
            ]);

            // Vérifier l'authentification
            if (!Auth::check()) {
                \Log::error('Utilisateur non authentifié');
                return response()->json(['error' => 'Non authentifié'], 401);
            }

            // Vérifier que l'utilisateur fait partie de la conversation
            if (!$conversation->participants()->where('user_id', Auth::id())->exists()) {
                \Log::error('Utilisateur non autorisé pour cette conversation', [
                    'user_id' => Auth::id(),
                    'conversation_id' => $conversation->id
                ]);
                return response()->json(['error' => 'Non autorisé'], 403);
            }

            // Validation
            $validated = $request->validate([
                'content' => 'required|string|max:5000',
            ]);

            \Log::info('Validation réussie', ['content_length' => strlen($validated['content'])]);

            // Créer le message
            $message = $conversation->messages()->create([
                'user_id' => Auth::id(),
                'content' => $validated['content'],
                'read' => false,
            ]);

            \Log::info('Message créé avec succès', ['message_id' => $message->id]);

            // Préparer les données du message - structure simple
            $messageData = [
                'id' => $message->id,
                'content' => $message->content,
                'created_at' => $message->created_at->format('c'), // Format ISO 8601
                'user' => [
                    'id' => Auth::id(),
                    'name' => Auth::user()->name,
                    'avatar' => $this->resolveAvatarUrl(Auth::user()->avatar),
                ]
            ];

            \Log::info('Données de message pour broadcasting', ['data' => $messageData]);

            // Tentative de broadcasting avec gestion d'erreur
            try {
                \Log::info('Tentative de broadcasting');
                broadcast(new NewMessage($messageData, $conversation->id))->toOthers();
                \Log::info('Broadcasting réussi');
                
                // Envoyer des notifications aux autres participants
                $otherParticipants = $conversation->participants()
                    ->where('user_id', '!=', Auth::id())
                    ->get();
                
                foreach ($otherParticipants as $participant) {
                    $participant->notify(new NewMessageNotification($message, Auth::user(), $conversation->id));
                }
                \Log::info('Notifications envoyées', ['participants_count' => $otherParticipants->count()]);
                
            } catch (\Exception $broadcastError) {
                \Log::error('Erreur de broadcasting', [
                    'error' => $broadcastError->getMessage(),
                    'trace' => $broadcastError->getTraceAsString()
                ]);
            }

            // Retourner la réponse au client actuel
            return response()->json([
                'success' => true,
                'message' => array_merge($messageData, ['is_mine' => true])
            ]);

        } catch (\Exception $e) {
            \Log::error('Erreur globale', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['error' => 'Une erreur est survenue'], 500);
        }
    }
    /**
     * Liste des utilisateurs pour créer une nouvelle conversation
     */
    public function users()
    {
        $users = User::where('id', '!=', Auth::id())
            ->get(['id', 'name', 'avatar'])
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'avatar' => $this->resolveAvatarUrl($user->avatar),
                ];
            });

        return Inertia::render('chat/NewConversation', [
            'users' => $users,
        ]);
    }

    public function startConversation(User $user)
    {
        // Vérifie si une conversation existe déjà entre les deux utilisateurs
        $existingConversation = auth()->user()->conversations()
            ->whereHas('participants', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->whereDoesntHave('participants', function ($query) use ($user) {
                $query->where('user_id', '!=', auth()->id())
                    ->where('user_id', '!=', $user->id);
            })
            ->first();

        // Si la conversation n'existe pas, on la crée
        if (!$existingConversation) {
            $conversation = Conversation::create([
                'is_group' => false
            ]);

            // Ajouter les deux utilisateurs à la conversation
            $conversation->participants()->attach([
                auth()->id(),
                $user->id
            ]);
        } else {
            $conversation = $existingConversation;
        }

        // return redirect()->route('chat.index', $conversation->id);
       return redirect()->route('chat.index', ['conversation' => $conversation->id]);
    }

    /**
     * Broadcast typing status to conversation participants
     */
    public function typing(Request $request, Conversation $conversation)
    {
        // Vérifier que l'utilisateur fait partie de la conversation
        if (!$conversation->participants()->where('user_id', Auth::id())->exists()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $validated = $request->validate([
            'is_typing' => 'required|boolean',
        ]);

        broadcast(new UserTyping(
            Auth::id(),
            Auth::user()->name,
            $conversation->id,
            $validated['is_typing']
        ))->toOthers();

        return response()->json(['success' => true]);
    }

    /**
     * Get online status for conversation participants
     */
    public function getOnlineStatus(Conversation $conversation)
    {
        // Vérifier que l'utilisateur fait partie de la conversation
        if (!$conversation->participants()->where('user_id', Auth::id())->exists()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        // Cette fonctionnalité utilise les presence channels côté frontend
        // Le backend retourne simplement les participants
        $participants = $conversation->participants()
            ->where('user_id', '!=', Auth::id())
            ->get(['id', 'name']);

        return response()->json([
            'participants' => $participants,
        ]);
    }

    private function resolveAvatarUrl(?string $avatar): ?string
    {
        if (!$avatar) {
            return null;
        }

        if (Str::startsWith($avatar, ['http://', 'https://'])) {
            return $avatar;
        }

        try {
            return Storage::disk('s3')->temporaryUrl($avatar, now()->addMinutes(60));
        } catch (\Throwable $e) {
            return null;
        }
    }

}
