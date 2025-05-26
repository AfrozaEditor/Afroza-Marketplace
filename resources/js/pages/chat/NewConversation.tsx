import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Search, ArrowLeft } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface User {
  id: number;
  name: string;
}

interface Props {
  users: User[];
}

export default function NewConversation({ users }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const { post, processing } = useForm({
    user_id: 0,
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startConversation = (userId: number) => {
    post(route('chat.store', { user_id: userId }));
  };

  return (
    <AppLayout>
      <Head title="Nouvelle conversation" />
      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center">
                <Link href={route('chat.index')} className="mr-2">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <CardTitle>Nouvelle conversation</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun utilisateur trouvé
                </div>
              ) : (
                <div className="divide-y">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="py-3 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                      </div>
                      <Button
                        onClick={() => startConversation(user.id)}
                        disabled={processing}
                      >
                        Message
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
