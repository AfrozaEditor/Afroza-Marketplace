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

export default function ChatArea({
  conversation,
  messages = [],
  onSendMessage,
  setShowMobileChat
}: ChatAreaProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

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
//   const scrollToBottom = useCallback(() => {
//   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// }, []);

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


    // Défilement automatique lors de nouveaux messages
    useEffect(() => {
        const timeoutId = setTimeout(scrollToBottom, 100); // Ajouter un petit délai
        return () => clearTimeout(timeoutId);
    }, [messages, scrollToBottom]);

    // Optimisation de la saisie avec debounce
  const debouncedTypingStatus = useCallback(
    debounce((isTyping: boolean) => {
      // Ici, vous pourriez émettre un événement de frappe
      // window.Echo.private(`chat.${conversation.id}`).whisper('typing', { isTyping });
    }, 500),
    [conversation.id]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setIsTyping(true);
    debouncedTypingStatus(true);
  };

    const handleEmojiClick = (emojiData: { emoji: string }) => {
        setMessage(prev => prev + emojiData.emoji);
        setShowEmojiPicker(false);
        messageInputRef.current?.focus();
    };


    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsTyping(false);
    debouncedTypingStatus(false);

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

  conversation.online=true;

  return (
    <>
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            className="md:hidden mr-2 border-none hover:bg-primary/50"
            onClick={() => setShowMobileChat(false)}
          >
            <ArrowLeft size={24} />
          </Button>
          <img
            src={conversation.avatar || '/default-avatar.png'}
            alt={conversation.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <h3 className="font-medium">{conversation.name}</h3>
            <span className="text-sm text-gray-500">
              {conversation.online ? 'En ligne' : 'Hors ligne'}
            </span>
          </div>
        </div>
      </div>

      <div
        ref={messagesEndRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">
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
                  msg.is_mine ? 'bg-primary text-white' : 'bg-gray-100'
                }`}
              >
                <p>{msg.content}</p>
                <span className={`text-xs ${
                  msg.is_mine ? 'text-primary-foreground/80' : 'text-gray-500'
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

      <div className="p-4 border-t">
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
