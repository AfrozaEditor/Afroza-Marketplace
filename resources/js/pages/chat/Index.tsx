import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Search, Users, Sparkles, Home, ArrowLeft, ShoppingCart, Heart, Store } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import AppLayout from '@/layouts/app-layout';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import ChatArea from '@/components/chat/chat-area';
import { Message, ChatProduct, SharedData } from '@/types';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

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
const [productContext, setProductContext] = useState<ChatProduct | null>(null);
const { data, setData, post, processing, reset } = useForm({
    content: '',
  });

  const page = usePage<SharedData>();
  const urlParams = new URLSearchParams(window.location.search);
  const conversationIdFromUrl = urlParams.get('conversation');
  const { auth } = page.props;

  const isVendor = auth.user?.role === 'vendor';
  const isAdmin = auth.user?.role === 'admin';
  const isDelivery = auth.user?.role === 'delivery';
  const isCustomer = auth.user?.role === 'customer';

  const dashboardLink = () => {
    if (isAdmin) return route('admin');
    if (isVendor) return route('dashboard');
    if (isDelivery) return route('delivery-dashboard');
    return '/';
  };

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
    setConversationList(conversations.map(conv => ({
      ...conv,
      online: onlineUserIds.some(id => id !== auth.user?.id)
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

    // Charger le contexte produit si product_id est dans l'URL
    const productIdFromUrl = urlParams.get('product_id');
    if (productIdFromUrl) {
      axios.get(route('chat.productInfo'), { params: { product_id: productIdFromUrl } })
        .then(response => {
          setProductContext(response.data.product);
        })
        .catch(err => {
          console.error('Erreur lors du chargement du produit:', err);
        });
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

            // Si ce message n'est pas le mien et que la conversation est ouverte, le marquer comme lu
            if (!event.message.is_mine) {
                axios.post(route('chat.markRead', { conversation: selectedConversation.id }))
                    .catch(err => console.error('Erreur markRead:', err));
            }
        };

        // Écouter les accusés de lecture
        const readListener = (event: { message_ids: number[]; read_by_user_id: number }) => {
            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    event.message_ids.includes(msg.id) ? { ...msg, read: true } : msg
                )
            );
        };

        channel.listen('.message.new', listener);
        channel.listen('.messages.read', readListener);

        return () => {
            channel.stopListening('.message.new');
            channel.stopListening('.messages.read');
            channel.unsubscribe();
        };
    }, [selectedConversation]);


    const handleSendMessage = (content: string, productId?: number) => {
    if (!selectedConversation) return;

    setIsSending(true);

    const optimisticMessage: Message = {
        id: Date.now(),
        content: content,
        created_at: new Date().toISOString(),
        is_mine: true,
        read: false,
        conversation_id: selectedConversation.id,
        product: productId && productContext ? productContext : undefined,
        user: {} as any // Placeholder pour l'utilisateur
    };

    setMessages(prev => [...prev, optimisticMessage]);

    const payload: { content: string; product_id?: number } = { content };
    if (productId) {
        payload.product_id = productId;
    }

    axios.post(route('chat.message', selectedConversation.id), payload)
          .then(response => {
              // Remplacer le message optimiste par le vrai message du serveur
              if (response.data.props && response.data.props.message) {
                  setMessages(prev => prev.map(msg =>
                      msg.id === optimisticMessage.id
                          ? response.data.props.message
                          : msg
                  ));
              }
              // Effacer le contexte produit après envoi du premier message avec produit
              if (productId) {
                  setProductContext(null);
                  const url = new URL(window.location.href);
                  url.searchParams.delete('product_id');
                  window.history.replaceState({}, '', url.toString());
              }
          })
          .catch(error => {
              console.error('Erreur lors de l\'envoi du message:', error);
              // Retirer le message optimiste en cas d'erreur
              setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
              setIsSending(false);
          });

  };


  return (
    <AppLayout hideFooter hideHeader>
      <Head title="Messagerie" />
      <div className="fixed inset-0 z-40 flex flex-col bg-white dark:bg-gray-900">
        {/* Quick nav buttons - left side, centered vertically, visible on hover */}
        <div className="group/nav absolute left-0 top-1/2 -translate-y-1/2 z-50 flex items-center">
          {/* Trigger zone visible */}
          <div className="h-10 w-5 rounded-r-lg bg-white/80 shadow-md backdrop-blur-sm dark:bg-gray-800/80 flex items-center justify-center cursor-pointer group-hover/nav:hidden">
            <Home className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
          </div>
          {/* Buttons revealed on hover */}
          <div className="hidden group-hover/nav:flex flex-col gap-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-r-2xl shadow-lg px-1.5 py-2">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Home className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right"><p>Accueil</p></TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => window.history.back()}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right"><p>Retour</p></TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={route('products.index')}>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Store className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right"><p>Boutique</p></TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={route('my-cart')}>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right"><p>Panier</p></TooltipContent>
              </Tooltip>

              {!isCustomer && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={dashboardLink()}>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right"><p>Dashboard</p></TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>
        </div>

        {/* Chat container - full screen */}
        <div className="flex h-full w-full">
            {/* Liste des conversations */}
            <div className={cn(
              "w-full md:w-96 border-r dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800",
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
                              src={conversation.avatar || '/default-user.png'}
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
                  isRecipientOnline={onlineUserIds.some(id => id !== auth.user?.id)}
                  productContext={productContext}
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
    </AppLayout>
  );
}
