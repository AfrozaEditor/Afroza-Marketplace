import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { PlusCircle, Search, Send, MessageCircle, Users, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import AppLayout from '@/layouts/app-layout';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import ChatArea from '@/components/chat/chat-area';
import { Message } from '@/types';
import axios from 'axios';
import { cn } from '@/lib/utils';

// interface LastMessage {
//   content: string;
//   created_at: string;
//   is_mine: boolean;
// }

// interface Conversation {
//   id: number;
//   name: string;
//   last_message: LastMessage | null;
//   unread_count: number;
// }

// interface Props {
//   conversations: Conversation[];
// }

interface LastMessage {
  content: string;
  created_at: string;
  is_mine: boolean;
}

interface Conversation {
  id: number;
  name: string;
  last_message: LastMessage | null;
  unread_count: number;
  avatar?: string;
  online?: boolean;
}

interface Props {
  conversations: Conversation[];
}

export default function ChatIndex({ conversations }: Props) {
const [searchQuery, setSearchQuery] = useState('');
const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
const [messages, setMessages] = useState<Message[]>([]);
  const [showMobileChat, setShowMobileChat] = useState(false);
const [isSending, setIsSending] = useState(false);
const [onlineUserIds, setOnlineUserIds] = useState<number[]>([]);
const [conversationList, setConversationList] = useState<Conversation[]>(conversations);
const { data, setData, post, processing, reset } = useForm({
    content: '',
  });

  const page = usePage();
  const urlParams = new URLSearchParams(window.location.search);
  const conversationIdFromUrl = urlParams.get('conversation');

  // Écouter le canal global "online" pour les statuts en ligne
  useEffect(() => {
    if (!window.Echo) return;

    const onlineChannel = window.Echo.join('online');

    onlineChannel.here((users: { id: number }[]) => {
      setOnlineUserIds(users.map(u => u.id));
    });

    onlineChannel.joining((user: { id: number }) => {
      setOnlineUserIds(prev => [...prev, user.id]);
    });

    onlineChannel.leaving((user: { id: number }) => {
      setOnlineUserIds(prev => prev.filter(id => id !== user.id));
    });

    return () => {
      window.Echo.leave('online');
    };
  }, []);

  // Mettre à jour la liste des conversations avec le statut en ligne
  useEffect(() => {
    const authUser = page.props.auth as { user?: { id: number } } | undefined;
    setConversationList(conversations.map(conv => ({
      ...conv,
      online: onlineUserIds.some(id => id !== authUser?.user?.id)
    })));
  }, [conversations, onlineUserIds, page.props.auth]);

  useEffect(() => {
    if (conversationIdFromUrl && conversations.length > 0) {
      const conv = conversations.find(c => c.id === Number(conversationIdFromUrl));
      if (conv) {
        handleSelectConversation(conv);
        setShowMobileChat(true);
      }
    }
    // eslint-disable-next-line
  }, [conversationIdFromUrl, conversations]);

  const filteredConversations = conversationList.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectConversation = async (conversation: Conversation) => {
    // setSelectedConversation(conversation);
    setSelectedConversation({
        ...conversation,
        unread_count: 0 // Réinitialiser le compteur à 0
    });
    setMessages([]); // Optionnel : Réinitialiser les messages pendant le chargement

    try {
        const response = await axios.get(route('chat.messages', { conversation: conversation.id }));
        // La réponse de Laravel est directement disponible ici
        if (response.data && response.data.props && response.data.props.messages) {
            setMessages(response.data.props.messages);
        }

        // Mettre à jour la liste des conversations pour refléter le nouveau unread_count
        const updatedConversations = filteredConversations.map(conv =>
            conv.id === conversation.id
                ? { ...conv, unread_count: 0 }
                : conv
        );
    } catch (error) {
        console.error('Erreur lors du chargement des messages:', error);
        // Gérer l'erreur (ex: afficher un message à l'utilisateur)
    }
};

    useEffect(() => {
        if (!selectedConversation) return;

        setIsSending(false);
        // Configuration de l'écoute des messages WebSocket
        const channel = window.Echo.private(`chat.${selectedConversation.id}`);

        const listener = (event: { message: Message }) => {
            // Vérifiez si le message existe déjà dans les messages
            setMessages(prevMessages => {
                        // Vérifier si le message existe déjà (y compris les messages optimistes)
                        if (!prevMessages.some(msg => msg.id === event.message.id ||
                                                     (msg.content === event.message.content &&
                                                      new Date(msg.created_at).getTime() >= new Date().getTime() - 5000))) {
                            return [...prevMessages, event.message];
                        }
                        return prevMessages;
                    });
            };

        channel.listen('.message.new', listener);
        //     setMessages(prevMessages => {
        //         // Vérification plus robuste pour éviter les doublons
        //         const isDuplicate = prevMessages.some(msg =>
        //             msg.id === event.message.id ||
        //             (msg.content === event.message.content &&
        //                 Math.abs(new Date(msg.created_at).getTime() - new Date(event.message.created_at).getTime()) < 5000)
        //         );
        //
        //         if (!isDuplicate) {
        //             return [...prevMessages, event.message];
        //         }
        //         return prevMessages;
        //     });
        // };

        // channel.listen('.message.new', listener);


        return () => {
            channel.stopListening('.message.new');
            channel.unsubscribe();
        };
    }, [selectedConversation]);


    const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;

    setIsSending(true);

    const optimisticMessage: Message = {
        id: Date.now(),
        content: content,
        created_at: new Date().toISOString(),
        is_mine: true,
        conversation_id: selectedConversation.id,
        user: {} as any // Placeholder pour l'utilisateur
    };

    setMessages(prev => [...prev, optimisticMessage]);

    // // Change the post call to correctly handle the response from Inertia
    // router.post(route('chat.message', selectedConversation.id), {
    //     content: content,
    //     preserveScroll: true,
    //     onSuccess: ({ props }: any) => { // Destructure props from the page object
    //         console.log('Server response props:', props);
    //         if (props && props.message) { // Access message from props
    //             setMessages(prev =>
    //                 prev.map(msg =>
    //                     msg.id === optimisticMessage.id ? props.message : msg // Use props.message
    //                 )
    //             );
    //         } else {
    //             console.warn("Server response did not contain 'message' in props.");
    //             setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
    //         }
    //     },
    //     onError: (errors: any) => {
    //         console.error('Error:', errors);
    //         setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
    //     }
    // });
      axios.post(route('chat.message', selectedConversation.id), {
          content: content
      })
          .then(response => {
              // Remplacer le message optimiste par le vrai message du serveur
              if (response.data.props && response.data.props.message) {
                  setMessages(prev => prev.map(msg =>
                      msg.id === optimisticMessage.id
                          ? response.data.props.message
                          : msg
                  ));
              }
          })
          .catch(error => {
              console.error('Erreur lors de l\'envoi du message:', error);
              // Retirer le message optimiste en cas d'erreur
              setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
              setIsSending(false);
          });

  };

console.log('Last messages:', conversations.map(c => c.last_message));
console.log('Unread Messages:', conversations.map(c => c.unread_count));


  return (
    // <AppLayout>
    //   <Head title="Messagerie" />
    //   <div className="py-12">
    //     <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
    //       <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
    //         <div className="p-6">
    //           <div className="flex justify-between items-center mb-6">
    //             <h2 className="text-xl font-semibold">Messagerie</h2>
    //           </div>

    //           {conversations.length === 0 ? (
    //             <div className="text-center py-8">
    //               <p className="text-gray-500 mb-4">Vous n'avez aucune conversation</p>
    //             </div>
    //           ) : (
    //             <div className="space-y-4">
    //               {conversations.map((conversation) => (
    //                 <Link
    //                   key={conversation.id}
    //                   href={route('chat.show', { conversation: conversation.id })}
    //                   className="block"
    //                 >
    //                   <Card className={`hover:bg-gray-50 transition ${conversation.unread_count > 0 ? 'border-primary' : ''}`}>
    //                     <CardContent className="p-4">
    //                       <div className="flex justify-between items-center">
    //                         <div>
    //                           <h3 className="font-medium text-lg">{conversation.name}</h3>
    //                           {conversation.last_message && (
    //                             <p className="text-gray-600 text-sm line-clamp-1">
    //                               {conversation.last_message.is_mine ? 'Vous: ' : ''}
    //                               {conversation.last_message.content}
    //                             </p>
    //                           )}
    //                         </div>
    //                         <div className="text-right">
    //                           {conversation.last_message && (
    //                             <p className="text-xs text-gray-500">
    //                               {formatDistanceToNow(new Date(conversation.last_message.created_at), {
    //                                 addSuffix: true,
    //                                 locale: fr
    //                               })}
    //                             </p>
    //                           )}
    //                           {conversation.unread_count > 0 && (
    //                             <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-xs mt-1">
    //                               {conversation.unread_count}
    //                             </span>
    //                           )}
    //                         </div>
    //                       </div>
    //                     </CardContent>
    //                   </Card>
    //                 </Link>
    //               ))}
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </AppLayout>
    <AppLayout>
      <Head title="Messagerie" />
      <div className="container mx-auto px-4 py-6">
        {/* Header de la page */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messagerie</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {conversations.length} conversation{conversations.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden">
          <div className="flex h-[calc(100vh-14rem)]">
            {/* Liste des conversations */}
            <div className={cn(
              "w-full md:w-96 border-r dark:border-gray-700 flex flex-col",
              showMobileChat ? 'hidden md:flex' : ''
            )}>
              {/* Barre de recherche */}
              <div className="p-4 border-b dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Rechercher une conversation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Liste scrollable */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      Aucune conversation
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Commencez une conversation avec un vendeur
                    </p>
                  </div>
                ) : (
                  <div className="divide-y dark:divide-gray-700">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => {
                          handleSelectConversation(conversation)
                          setShowMobileChat(true);
                          router.visit(route('chat.index', { conversation: conversation.id }), {
                            preserveScroll: true,
                            replace: true
                          });
                        }}
                        className={cn(
                          "p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50",
                          selectedConversation?.id === conversation.id 
                            ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-primary' 
                            : ''
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {/* Avatar avec indicateur en ligne */}
                          <div className="relative shrink-0">
                            <img
                              src={conversation.avatar || '/default-avatar.png'}
                              alt={conversation.name[0]}
                              className={cn(
                                "w-14 h-14 rounded-full object-cover transition-all flex justify-center items-center font-bold text-xl",
                                selectedConversation?.id === conversation.id 
                                  ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-800' 
                                  : ''
                              )}
                            />
                            {conversation.online && (
                              <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                            )}
                          </div>
                          
                          {/* Contenu */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className={cn(
                                "font-semibold text-gray-900 dark:text-white truncate",
                                conversation.unread_count > 0 ? 'text-gray-900 dark:text-white' : ''
                              )}>
                                {conversation.name}
                              </h3>
                              {conversation.last_message && (
                                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 ml-2">
                                  {formatDistanceToNow(new Date(conversation.last_message.created_at), {
                                    addSuffix: false,
                                    locale: fr
                                  })}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              {conversation.last_message ? (
                                <p className={cn(
                                  "text-sm truncate max-w-[200px]",
                                  conversation.unread_count > 0 
                                    ? 'text-gray-700 dark:text-gray-300 font-medium' 
                                    : 'text-gray-500 dark:text-gray-400'
                                )}>
                                  {conversation.last_message.is_mine && (
                                    <span className="text-gray-400">Vous: </span>
                                  )}
                                  {conversation.last_message.content}
                                </p>
                              ) : (
                                <p className="text-sm text-gray-400 italic">
                                  Aucun message
                                </p>
                              )}
                              
                              {/* Badge de messages non lus */}
                              {conversation.unread_count > 0 && (
                                <span className="shrink-0 ml-2 bg-primary text-white text-xs font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-1.5">
                                  {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Zone de chat */}
            <div className={cn(
              "flex-1 flex flex-col bg-gray-50 dark:bg-gray-900",
              !showMobileChat ? 'hidden md:flex' : ''
            )}>
              {selectedConversation ? (
                <ChatArea
                  conversation={selectedConversation}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  setShowMobileChat={setShowMobileChat}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="w-12 h-12 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Bienvenue dans votre messagerie
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                    Sélectionnez une conversation pour commencer à discuter avec un vendeur ou un acheteur
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      En ligne
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full" />
                      Hors ligne
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
