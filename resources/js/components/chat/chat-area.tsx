import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ArrowLeft, Smile } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Message } from '@/types';
import debounce from 'lodash/debounce';
import EmojiPicker from 'emoji-picker-react';
import { toast } from 'sonner';
import axios from 'axios';

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

export default function ChatArea({
  conversation,
  messages = [],
  onSendMessage,
  setShowMobileChat
}: ChatAreaProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Optimisation du défilement
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      const { scrollHeight, clientHeight } = messagesEndRef.current;
      const maxScroll = scrollHeight - clientHeight;
      const shouldAutoScroll = maxScroll - messagesEndRef.current.scrollTop;

      if (shouldAutoScroll) {
        messagesEndRef.current.scrollTo({
          top: scrollHeight,
          behavior: 'smooth'
        });
      }
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

  // Nettoyage du timeout au démontage
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="p-4 border-b dark:border-neutral-700 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            className="md:hidden mr-2 border-none hover:bg-primary/50"
            onClick={() => setShowMobileChat(false)}
          >
            <ArrowLeft size={24} />
          </Button>
          <div className="relative">
            <img
              src={conversation.avatar || '/default-avatar.png'}
              alt={conversation.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {/* Indicateur en ligne */}
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
          </div>
          <div className="ml-3">
            <h3 className="font-medium dark:text-white">{conversation.name}</h3>
            {typingUsers.length > 0 ? (
              <span className="text-sm text-primary animate-pulse">
                {typingUsers.join(', ')} est en train d'écrire...
              </span>
            ) : (
              <span className={`text-sm ${isOnline ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'}`}>
                {isOnline ? 'En ligne' : 'Hors ligne'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        ref={messagesEndRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Démarrez la conversation !
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.is_mine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.is_mine ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-neutral-700 dark:text-white'
                }`}
              >
                <p>{msg.content}</p>
                <span className={`text-xs ${
                  msg.is_mine ? 'text-primary-foreground/80' : 'text-gray-500 dark:text-gray-400'
                } block mt-1`}>
                  {formatDistanceToNow(new Date(msg.created_at), {
                    addSuffix: true,
                    locale: fr
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        {/* <div ref={messagesEndRef} /> */}
      </div>

      <div className="p-4 border-t dark:border-neutral-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <div className="relative flex-1">
            <Input
            ref={messageInputRef}
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Écrivez votre message..."
            className="flex-1"
          />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                    <Smile className="h-5 w-5 text-gray-500 hover:text-primary" />
                </Button>
                {showEmojiPicker && (
                    <div
                        ref={emojiPickerRef}
                        className="absolute bottom-full right-0 mb-2 z-50"
                    >
                        <EmojiPicker onEmojiClick={handleEmojiClick} height={300} />
                    </div>
                )}
            </div>
          <Button type="submit" disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </>
  );
}
