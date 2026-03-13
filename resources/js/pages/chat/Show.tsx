import { useState, useEffect, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft, Send } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Auth, User } from '@/types';

// interface User {
//   id: number;
//   name: string;
// }

interface Message {
  id: number;
  content: string;
  created_at: string;
  user: User;
  is_mine: boolean;
}

interface ConversationData {
  id: number;
  name: string;
  is_group: boolean;
  participants: User[];
}

interface Props {
  conversation: ConversationData;
  messages: Message[];
  auth: Auth;
}

export default function ChatShow({ conversation, messages, auth }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageList, setMessageList] = useState<Message[]>(messages);

  const { data, setData, post, processing, reset } = useForm({
    content: '',
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.content.trim()) return;

    post(route('chat.message', conversation.id), {
      onSuccess: () => {
        // Optimistically add the message to the list
        const newMessage: Message = {
          id: Date.now(), // Temporary ID
          content: data.content,
          created_at: new Date().toISOString(),
          user: {
            id: auth.user.id, // Will be replaced with actual user ID from server
            name: auth.user.name,
            avatar: auth.user.avatar, // Assuming avatar is part of user data
          },
          is_mine: true,
        };

        setMessageList([...messageList, newMessage]);
        reset('content');
      },
    });
  };

  return (
    <AppLayout>
      <Head title={`Chat avec ${conversation.name}`} />
      <div className="py-6">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center">
                <Link href={route('chat.index')} className="mr-2">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <CardTitle>{conversation.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messageList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun message. Commencez la conversation !
                </div>
              ) : (
                messageList.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.is_mine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.is_mine
                          ? 'bg-primary text-white rounded-br-none'
                          : 'bg-gray-100 rounded-bl-none'
                      }`}
                    >
                      {!message.is_mine && conversation.is_group && (
                        <div className="font-medium text-sm">
                          {message.user.name}
                        </div>
                      )}
                      <p>{message.content}</p>
                      <div
                        className={`text-xs mt-1 ${
                          message.is_mine ? 'text-primary-foreground/80' : 'text-gray-500'
                        }`}
                      >
                        {formatDistanceToNow(new Date(message.created_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </CardContent>
            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="text"
                  value={data.content}
                  onChange={(e) => setData('content', e.target.value)}
                  placeholder="Tapez votre message..."
                  className="flex-1"
                />
                <Button type="submit" disabled={processing || !data.content.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
