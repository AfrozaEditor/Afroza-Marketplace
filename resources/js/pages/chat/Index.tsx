import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { PlusCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import AppLayout from '@/layouts/app-layout';

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
}

interface Props {
  conversations: Conversation[];
}

export default function ChatIndex({ conversations }: Props) {
  return (
    <AppLayout>
      <Head title="Messagerie" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Messagerie</h2>
                {/*<Link*/}
                {/*    // href={route('chat.new')}*/}
                {/*    href=""*/}
                {/*>*/}
                {/*  <Button>*/}
                {/*    <PlusCircle className="mr-2 h-4 w-4" />*/}
                {/*    Nouvelle conversation*/}
                {/*  </Button>*/}
                {/*</Link>*/}
              </div>

              {conversations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Vous n'avez aucune conversation</p>
                  {/*<Link*/}
                  {/*    // href={route('chat.new')}*/}
                  {/*    href=""*/}
                  {/*>*/}
                  {/*  <Button>Démarrer une conversation</Button>*/}
                  {/*</Link>*/}
                </div>
              ) : (
                <div className="space-y-4">
                  {conversations.map((conversation) => (
                    <Link
                      key={conversation.id}
                      href={route('chat.show', { conversation: conversation.id })}
                      className="block"
                    >
                      <Card className={`hover:bg-gray-50 transition ${conversation.unread_count > 0 ? 'border-primary' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-lg">{conversation.name}</h3>
                              {conversation.last_message && (
                                <p className="text-gray-600 text-sm line-clamp-1">
                                  {conversation.last_message.is_mine ? 'Vous: ' : ''}
                                  {conversation.last_message.content}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              {conversation.last_message && (
                                <p className="text-xs text-gray-500">
                                  {formatDistanceToNow(new Date(conversation.last_message.created_at), {
                                    addSuffix: true,
                                    locale: fr
                                  })}
                                </p>
                              )}
                              {conversation.unread_count > 0 && (
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-xs mt-1">
                                  {conversation.unread_count}
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
