<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        return [
            'id' => $conversation->id,
            'name' => $conversation->is_group ? $conversation->name : $conversation->participants->first()->name,
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
        ->orderBy('created_at', 'asc')
        ->get()
        ->map(function ($message) {
            return [
                'id' => $message->id,
                'content' => $message->content,
                'created_at' => $message->created_at,
                'is_mine' => $message->user_id === Auth::id()
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
            ->first();


        return Inertia::render('chat/Show', [
            'conversation' => [
                'id' => $conversation->id,
                'name' => $conversation->is_group ? $conversation->name : $participants->name,
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
    public function sendMessage(Request $request, Conversation $conversation)
    {
        // Vérifier que l'utilisateur fait partie de la conversation
        if (!$conversation->participants()->where('user_id', Auth::id())->exists()) {
            abort(403);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:5000',
        ]);

        $message = $conversation->messages()->create([
            'user_id' => Auth::id(),
            'content' => $validated['content'],
            'read' => false,
        ]);

        // return back();
        return response()->json([
        'message' => [
            'id' => $message->id,
            'content' => $message->content,
            'created_at' => $message->created_at,
            'is_mine' => true
        ]
    ]);
    }

    /**
     * Liste des utilisateurs pour créer une nouvelle conversation
     */
    public function users()
    {
        $users = User::where('id', '!=', Auth::id())
            ->get(['id', 'name']);

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

        return redirect()->route('chat.index', $conversation);
//        return redirect()->route('chat.show', ['conversation' => $conversation->id]);
    }

}
