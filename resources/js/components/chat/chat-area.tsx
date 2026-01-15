import { useState, useRef, useEffect, useCallback } from 'react';
import { usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  ArrowLeft, 
  Smile, 
  MoreVertical, 
  Phone, 
  Video, 
  Image as ImageIcon,
  Paperclip,
  CheckCheck,
  MessageCircle
} from 'lucide-react';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Message } from '@/types';
import debounce from 'lodash/debounce';
import EmojiPicker from 'emoji-picker-react';
import { toast } from 'sonner';
import axios from 'axios';
import { cn } from '@/lib/utils';

interface ChatAreaProps {
  conversation: {
    id: number;
    name: string;
    avatar?: string;
    online?: boolean;
  };
  messages?: Message[];
  onSendMessage: (content: string) => void;
  setShowMobileChat: (content: boolean) => void;
}

interface PresenceUser {
  id: number;
  name: string;
}

// Fonction pour grouper les messages par date
function groupMessagesByDate(messages: Message[]) {
  const groups: { date: string; messages: Message[] }[] = [];
  
  messages.forEach((message) => {
    const messageDate = new Date(message.created_at);
    let dateLabel: string;
    
    if (isToday(messageDate)) {
      dateLabel = "Aujourd'hui";
    } else if (isYesterday(messageDate)) {
      dateLabel = "Hier";
    } else {
      dateLabel = format(messageDate, 'd MMMM yyyy', { locale: fr });
    }
    
    const existingGroup = groups.find(g => g.date === dateLabel);
    if (existingGroup) {
      existingGroup.messages.push(message);
    } else {
      groups.push({ date: dateLabel, messages: [message] });
    }
  });
  
  return groups;
}

export default function ChatArea({
  conversation,
  messages = [],
  onSendMessage,
  setShowMobileChat
}: ChatAreaProps) {
  const page = usePage();
  const currentUserId = (page.props.auth as any)?.user?.id;
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Grouper les messages par date
  const groupedMessages = groupMessagesByDate(messages);

    // Optimisation du défilement
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

  // Écouter les événements typing via presence channel
  useEffect(() => {
    if (!conversation.id || !window.Echo) return;

    const channel = window.Echo.join(`chat.${conversation.id}`);

    // Quand quelqu'un rejoint le channel (online)
    channel.here((users: PresenceUser[]) => {
      const userIds = users.map((u: PresenceUser) => u.id);
      setOnlineUsers(userIds);
      // Vérifier si l'autre participant est en ligne
      setIsOnline(userIds.length > 1);
    });

    channel.joining((user: PresenceUser) => {
      setOnlineUsers(prev => [...prev, user.id]);
      setIsOnline(true);
    });

    channel.leaving((user: PresenceUser) => {
      setOnlineUsers(prev => prev.filter(id => id !== user.id));
      setIsOnline(onlineUsers.length > 2);
    });

    // Écouter les événements de typing
    channel.listen('.user.typing', (data: { user_id: number; user_name: string; is_typing: boolean }) => {
      // Ignorer si c'est l'utilisateur courant (au cas où toOthers() ne fonctionne pas)
      if (data.user_id === currentUserId) return;
      
      if (data.is_typing) {
        setTypingUsers(prev => {
          if (!prev.includes(data.user_name)) {
            return [...prev, data.user_name];
          }
          return prev;
        });
      } else {
        setTypingUsers(prev => prev.filter(name => name !== data.user_name));
      }
    });

    return () => {
      window.Echo.leave(`chat.${conversation.id}`);
    };
  }, [conversation.id]);

    // Défilement automatique lors de nouveaux messages
    useEffect(() => {
        const timeoutId = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timeoutId);
    }, [messages, scrollToBottom]);

  // Envoyer le statut typing au serveur
  const sendTypingStatus = useCallback(
    debounce(async (typing: boolean) => {
      try {
        await axios.post(`/chat/${conversation.id}/typing`, { is_typing: typing });
      } catch (error) {
        console.error('Erreur lors de l\'envoi du statut typing:', error);
      }
    }, 300),
    [conversation.id]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    // Envoyer le statut "typing"
    if (!isTyping) {
      setIsTyping(true);
      sendTypingStatus(true);
    }

    // Reset le timeout pour arrêter le typing après 2 secondes d'inactivité
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingStatus(false);
    }, 2000);
  };

    const handleEmojiClick = (emojiData: { emoji: string }) => {
        setMessage(prev => prev + emojiData.emoji);
        setShowEmojiPicker(false);
        messageInputRef.current?.focus();
    };


    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Arrêter le typing
    setIsTyping(false);
    sendTypingStatus(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const content = message.trim();
    setMessage('');

    try {
      await onSendMessage(content);
      toast.success("Message envoyé avec succès");
      messageInputRef.current?.focus();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setMessage(content); // Restaurer le message en cas d'erreur
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header amélioré */}
      <div className="px-4 py-3 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              onClick={() => setShowMobileChat(false)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="relative">
              <img
                src={conversation.avatar || '/default-avatar.png'}
                alt={conversation.name[0]}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-offset-2 ring-primary/20 dark:ring-offset-gray-800 flex justify-center items-center font-bold text-xl"
              />
              <span
                className={cn(
                  "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 transition-colors",
                  isOnline ? 'bg-green-500' : 'bg-gray-400'
                )}
              />
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {conversation.name}
              </h3>
              {typingUsers.length > 0 ? (
                <div className="flex items-center gap-1">
                  <span className="flex gap-0.5">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  <span className="text-sm text-primary font-medium ml-1">
                    {typingUsers.join(', ')} écrit...
                  </span>
                </div>
              ) : (
                <span className={cn(
                  "text-sm",
                  isOnline ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'
                )}>
                  {isOnline ? '● En ligne' : 'Hors ligne'}
                </span>
              )}
            </div>
          </div>
          
          <div className="items-center gap-1 hidden">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <Video className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Button>
          </div>
        </div>
      </div>

      {/* Zone des messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6"
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Démarrez la conversation !
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              Envoyez votre premier message à {conversation.name}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedMessages.map((group) => (
              <div key={group.date}>
                {/* Séparateur de date */}
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-white dark:bg-gray-700 px-4 py-1.5 rounded-full shadow-sm">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {group.date}
                    </span>
                  </div>
                </div>
                
                {/* Messages du groupe */}
                <div className="space-y-3">
                  {group.messages.map((msg, index) => {
                    const showAvatar = !msg.is_mine && (
                      index === 0 || 
                      group.messages[index - 1]?.is_mine
                    );
                    
                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex items-end gap-2",
                          msg.is_mine ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {!msg.is_mine && (
                          <div className="w-8 shrink-0">
                            {showAvatar && (
                              <img
                                src={conversation.avatar || '/default-avatar.png'}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            )}
                          </div>
                        )}
                        
                        <div
                          className={cn(
                            "max-w-[75%] group relative",
                            msg.is_mine ? 'order-1' : 'order-2'
                          )}
                        >
                          <div
                            className={cn(
                              "px-4 py-2.5 rounded-2xl shadow-sm transition-shadow hover:shadow-md",
                              msg.is_mine 
                                ? 'bg-primary text-white rounded-br-md' 
                                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
                            )}
                          >
                            <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                              {msg.content}
                            </p>
                          </div>
                          
                          <div className={cn(
                            "flex items-center gap-1 mt-1 px-1",
                            msg.is_mine ? 'justify-end' : 'justify-start'
                          )}>
                            <span className="text-[11px] text-gray-400 dark:text-gray-500">
                              {format(new Date(msg.created_at), 'HH:mm')}
                            </span>
                            {msg.is_mine && (
                              <CheckCheck className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie améliorée */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          {/* Boutons d'action */}
          <div className="flex gap-1">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 h-10 w-10"
            >
              <Paperclip className="h-5 w-5 text-gray-500" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 h-10 w-10"
            >
              <ImageIcon className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
          
          {/* Champ de saisie */}
          <div className="relative flex-1">
            <Input
              ref={messageInputRef}
              type="text"
              value={message}
              onChange={handleInputChange}
              placeholder="Écrivez un message..."
              className="w-full pr-12 py-6 rounded-full bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="h-5 w-5 text-gray-500 hover:text-primary transition-colors" />
            </Button>
            
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-full right-0 mb-2 z-50 shadow-xl rounded-xl overflow-hidden"
              >
                <EmojiPicker 
                  onEmojiClick={handleEmojiClick} 
                  height={350}
                  width={320}
                />
              </div>
            )}
          </div>
          
          {/* Bouton envoyer */}
          <Button 
            type="submit" 
            disabled={!message.trim()}
            size="icon"
            className={cn(
              "rounded-full h-12 w-12 transition-all duration-200",
              message.trim() 
                ? "bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl hover:scale-105" 
                : "bg-gray-200 dark:bg-gray-700"
            )}
          >
            <Send className={cn(
              "h-5 w-5 transition-transform",
              message.trim() ? "text-white" : "text-gray-400"
            )} />
          </Button>
        </form>
      </div>
    </div>
  );
}
