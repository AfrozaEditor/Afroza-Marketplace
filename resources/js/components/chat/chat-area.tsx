import { useState, useRef, useEffect } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Send, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Message } from '@/types';

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

export default function ChatArea({ conversation, messages = [], onSendMessage , setShowMobileChat }: ChatAreaProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message.trim());
    setMessage('');
  };

  return (
    <>
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant='outline'
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
        {/* <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div> */}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </>
  );
}