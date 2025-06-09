import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { PlusCircle, Search, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import ChatArea from '@/components/chat/chat-area';
import { Message } from '@/types';
import axios from 'axios';

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

const { data, setData, post, processing, reset } = useForm({
    content: '',
  });

  const filteredConversations = conversations.filter(conversation =>
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

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;

    const optimisticMessage = {
        id: Date.now(),
        content: content,
        created_at: new Date().toISOString(),
        is_mine: true
    };

    setMessages(prev => [...prev, optimisticMessage]);

    // Change the post call to correctly handle the response from Inertia
    router.post(route('chat.message', selectedConversation.id), {
        content: content,
        preserveScroll: true,
        onSuccess: ({ props }: any) => { // Destructure props from the page object
            console.log('Server response props:', props);
            if (props && props.message) { // Access message from props
                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === optimisticMessage.id ? props.message : msg // Use props.message
                    )
                );
            } else {
                console.warn("Server response did not contain 'message' in props.");
                setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
            }
        },
        onError: (errors: any) => {
            console.error('Error:', errors);
            setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        }
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex h-[calc(100vh-12rem)]">
            {/* Liste des conversations */}
            <div className={`w-full md:w-1/3 border-r ${showMobileChat ? 'hidden md:block' : ''}`}>
              <div className="p-4 border-b">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Rechercher une conversation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>

              <div className="overflow-y-auto h-[calc(100vh-16rem)]">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucune conversation trouvée
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      // onClick={() => setSelectedConversation(conversation)}
                      onClick={() => {
                        handleSelectConversation(conversation)
                        setShowMobileChat(true);
                        }
                      }
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation?.id === conversation.id ? 'bg-gray-100' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <img
                            src={conversation.avatar || '/default-avatar.png'}
                            alt={conversation.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {conversation.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">{conversation.name}</h3>
                            {conversation.last_message && (
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(conversation.last_message.created_at), {
                                  addSuffix: true,
                                  locale: fr
                                })}
                              </span>
                            )}
                          </div>
                          {conversation.last_message && 
                          (
                            <p className="text-sm text-gray-500 truncate">
                              {conversation.last_message.is_mine ? 'Vous: ' : ''}
                              {conversation.last_message.content}
                            </p>
                          )}
                        </div>
                        {conversation.unread_count > 0 && (
                          <div className="ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {conversation.unread_count}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Zone de chat */}
            <div  className={`w-full md:w-2/3 flex flex-col ${!showMobileChat ? 'hidden md:flex' : ''}`}>
              {selectedConversation ? (
                <ChatArea
                  conversation={selectedConversation}
                  messages={messages} // Vous pouvez passer vos messages ici
                  onSendMessage={handleSendMessage}
                  setShowMobileChat={setShowMobileChat}
                />
                
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Sélectionnez une conversation pour commencer
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
