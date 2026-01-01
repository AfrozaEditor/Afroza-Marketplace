import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Plus,
    Search,
    MoreHorizontal,
    Pencil,
    Trash2,
    Eye,
    Send,
    Clock,
    CheckCircle,
    Mail,
    Users,
    BarChart3,
    FileText,
    Calendar,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { BreadcrumbItem } from '@/types';

interface Newsletter {
    id: number;
    subject: string;
    preview_text: string | null;
    status: 'draft' | 'scheduled' | 'sending' | 'sent';
    scheduled_at: string | null;
    sent_at: string | null;
    recipients_count: number;
    opened_count: number;
    clicked_count: number;
    created_at: string;
    author: {
        id: number;
        name: string;
    };
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    newsletters: PaginatedData<Newsletter>;
    statusCounts: {
        all: number;
        draft: number;
        sent: number;
        scheduled: number;
    };
    subscriberStats: {
        total: number;
        active: number;
        unsubscribed: number;
    };
    currentStatus: string;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'draft':
            return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300"><FileText className="w-3 h-3 mr-1" />Brouillon</Badge>;
        case 'scheduled':
            return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300"><Calendar className="w-3 h-3 mr-1" />Programmée</Badge>;
        case 'sending':
            return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300"><Clock className="w-3 h-3 mr-1" />En cours</Badge>;
        case 'sent':
            return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Envoyée</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export default function Index({ newsletters, statusCounts, subscriberStats, currentStatus }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tableau de bord', href: '/admin' },
        { title: 'Newsletters', href: '/admin/newsletters' },
    ];

    const handleStatusFilter = (status: string) => {
        router.get('/admin/newsletters', { status }, { preserveState: true });
    };

    const handleDelete = (newsletter: Newsletter) => {
        setSelectedNewsletter(newsletter);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedNewsletter) return;
        
        router.delete(`/admin/newsletters/${selectedNewsletter.id}`, {
            onSuccess: () => {
                toast.success('Newsletter supprimée.');
                setDeleteDialogOpen(false);
                setSelectedNewsletter(null);
            },
            onError: () => {
                toast.error('Erreur lors de la suppression.');
            },
        });
    };

    const handleSend = (newsletter: Newsletter) => {
        if (confirm(`Envoyer la newsletter "${newsletter.subject}" à ${subscriberStats.active} abonnés ?`)) {
            router.post(`/admin/newsletters/${newsletter.id}/send`, {}, {
                onSuccess: () => {
                    toast.success('Newsletter envoyée avec succès !');
                },
                onError: () => {
                    toast.error('Erreur lors de l\'envoi.');
                },
            });
        }
    };

    const filteredNewsletters = newsletters.data.filter(newsletter =>
        newsletter.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Newsletters" />
            
            <div className="p-4 container mx-auto space-y-6">
                <div className="flex justify-between items-start">
                    <Heading 
                        title="Gestion des newsletters" 
                        description="Créez et envoyez des newsletters à vos abonnés"
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/newsletters/subscribers">
                                <Users className="h-4 w-4 mr-2" />
                                Abonnés ({subscriberStats.active})
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/admin/newsletters/create">
                                <Plus className="h-4 w-4 mr-2" />
                                Nouvelle newsletter
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Users className="h-4 w-4" /> Abonnés actifs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{subscriberStats.active}</div>
                            <p className="text-xs text-muted-foreground">
                                {subscriberStats.unsubscribed} désinscrits
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${currentStatus === 'draft' ? 'ring-2 ring-yellow-500' : ''}`}
                        onClick={() => handleStatusFilter('draft')}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-yellow-600">Brouillons</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{statusCounts.draft}</div>
                        </CardContent>
                    </Card>
                    
                    <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${currentStatus === 'scheduled' ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => handleStatusFilter('scheduled')}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-blue-600">Programmées</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{statusCounts.scheduled}</div>
                        </CardContent>
                    </Card>
                    
                    <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${currentStatus === 'sent' ? 'ring-2 ring-green-500' : ''}`}
                        onClick={() => handleStatusFilter('sent')}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-green-600">Envoyées</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{statusCounts.sent}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Table */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div>
                                <CardTitle>Liste des newsletters</CardTitle>
                                <CardDescription>
                                    {currentStatus === 'all' 
                                        ? 'Toutes les newsletters' 
                                        : `Newsletters avec le statut "${currentStatus}"`
                                    }
                                </CardDescription>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Rechercher..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40%]">Sujet</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Destinataires</TableHead>
                                        <TableHead>Performance</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredNewsletters.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                <Mail className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                                Aucune newsletter trouvée
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredNewsletters.map((newsletter) => (
                                            <TableRow key={newsletter.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium line-clamp-1">{newsletter.subject}</div>
                                                        {newsletter.preview_text && (
                                                            <div className="text-sm text-muted-foreground line-clamp-1">
                                                                {newsletter.preview_text}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(newsletter.status)}
                                                </TableCell>
                                                <TableCell>
                                                    {newsletter.recipients_count > 0 ? (
                                                        <span className="flex items-center gap-1">
                                                            <Users className="h-3 w-3" />
                                                            {newsletter.recipients_count}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {newsletter.status === 'sent' ? (
                                                        <div className="text-xs space-y-1">
                                                            <div>Ouvertures: {newsletter.opened_count} ({newsletter.recipients_count > 0 ? Math.round((newsletter.opened_count / newsletter.recipients_count) * 100) : 0}%)</div>
                                                            <div>Clics: {newsletter.clicked_count}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        {newsletter.sent_at 
                                                            ? formatDate(newsletter.sent_at)
                                                            : newsletter.scheduled_at
                                                            ? `Prévu: ${formatDate(newsletter.scheduled_at)}`
                                                            : formatDate(newsletter.created_at)
                                                        }
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem asChild>
                                                                <a href={`/admin/newsletters/${newsletter.id}/preview`} target="_blank">
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    Aperçu
                                                                </a>
                                                            </DropdownMenuItem>
                                                            {newsletter.status !== 'sent' && (
                                                                <>
                                                                    <DropdownMenuItem asChild>
                                                                        <Link href={`/admin/newsletters/${newsletter.id}/edit`}>
                                                                            <Pencil className="h-4 w-4 mr-2" />
                                                                            Modifier
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem 
                                                                        onClick={() => handleSend(newsletter)}
                                                                        className="text-green-600"
                                                                    >
                                                                        <Send className="h-4 w-4 mr-2" />
                                                                        Envoyer maintenant
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem 
                                                                        onClick={() => handleDelete(newsletter)}
                                                                        className="text-red-600"
                                                                    >
                                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                                        Supprimer
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {newsletters.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Page {newsletters.current_page} sur {newsletters.last_page}
                                </div>
                                <div className="flex gap-2">
                                    {newsletters.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer la newsletter</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer "{selectedNewsletter?.subject}" ?
                            Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
