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
    ArrowLeft,
    Search,
    MoreHorizontal,
    Trash2,
    Download,
    UserCheck,
    UserX,
    Mail,
    Calendar,
    RefreshCw,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { BreadcrumbItem } from '@/types';

interface Subscriber {
    id: number;
    email: string;
    name: string | null;
    status: 'active' | 'unsubscribed' | 'bounced';
    subscribed_at: string;
    unsubscribed_at: string | null;
    user: {
        id: number;
        name: string;
    } | null;
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
    subscribers: PaginatedData<Subscriber>;
    statusCounts: {
        all: number;
        active: number;
        unsubscribed: number;
        bounced: number;
    };
    currentStatus: string;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'active':
            return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300"><UserCheck className="w-3 h-3 mr-1" />Actif</Badge>;
        case 'unsubscribed':
            return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300"><UserX className="w-3 h-3 mr-1" />Désinscrit</Badge>;
        case 'bounced':
            return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300"><Mail className="w-3 h-3 mr-1" />Rebond</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export default function Subscribers({ subscribers, statusCounts, currentStatus }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tableau de bord', href: '/admin' },
        { title: 'Newsletters', href: '/admin/newsletters' },
        { title: 'Abonnés', href: '/admin/newsletters/subscribers' },
    ];

    const handleStatusFilter = (status: string) => {
        router.get('/admin/newsletters/subscribers', { status }, { preserveState: true });
    };

    const handleDelete = (subscriber: Subscriber) => {
        setSelectedSubscriber(subscriber);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedSubscriber) return;
        
        router.delete(`/admin/newsletters/subscribers/${selectedSubscriber.id}`, {
            onSuccess: () => {
                toast.success('Abonné supprimé.');
                setDeleteDialogOpen(false);
                setSelectedSubscriber(null);
            },
            onError: () => {
                toast.error('Erreur lors de la suppression.');
            },
        });
    };

    const handleExport = () => {
        window.location.href = '/admin/newsletters/subscribers/export';
    };

    const handleToggleStatus = (subscriber: Subscriber) => {
        const newStatus = subscriber.status === 'active' ? 'unsubscribed' : 'active';
        
        router.patch(`/admin/newsletters/subscribers/${subscriber.id}`, {
            status: newStatus,
        }, {
            onSuccess: () => {
                toast.success(`Statut mis à jour.`);
            },
            onError: () => {
                toast.error('Erreur lors de la mise à jour.');
            },
        });
    };

    const filteredSubscribers = subscribers.data.filter(subscriber =>
        subscriber.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (subscriber.name && subscriber.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Abonnés newsletter" />
            
            <div className="p-4 container mx-auto space-y-6">
                <div className="flex justify-between items-start">
                    <Heading 
                        title="Gestion des abonnés" 
                        description="Gérez les abonnés à votre newsletter"
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleExport}>
                            <Download className="h-4 w-4 mr-2" />
                            Exporter CSV
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/newsletters">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${currentStatus === 'all' ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => handleStatusFilter('all')}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statusCounts.all}</div>
                        </CardContent>
                    </Card>
                    
                    <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${currentStatus === 'active' ? 'ring-2 ring-green-500' : ''}`}
                        onClick={() => handleStatusFilter('active')}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-green-600">Actifs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{statusCounts.active}</div>
                        </CardContent>
                    </Card>
                    
                    <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${currentStatus === 'unsubscribed' ? 'ring-2 ring-gray-500' : ''}`}
                        onClick={() => handleStatusFilter('unsubscribed')}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Désinscrits</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-600">{statusCounts.unsubscribed}</div>
                        </CardContent>
                    </Card>
                    
                    <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${currentStatus === 'bounced' ? 'ring-2 ring-red-500' : ''}`}
                        onClick={() => handleStatusFilter('bounced')}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-red-600">Rebonds</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{statusCounts.bounced}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Table */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div>
                                <CardTitle>Liste des abonnés</CardTitle>
                                <CardDescription>
                                    {currentStatus === 'all' 
                                        ? 'Tous les abonnés' 
                                        : `Abonnés avec le statut "${currentStatus}"`
                                    }
                                </CardDescription>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Rechercher email..."
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
                                        <TableHead>Email</TableHead>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Inscrit le</TableHead>
                                        <TableHead>Compte utilisateur</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSubscribers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                <Mail className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                                Aucun abonné trouvé
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredSubscribers.map((subscriber) => (
                                            <TableRow key={subscriber.id}>
                                                <TableCell className="font-medium">
                                                    {subscriber.email}
                                                </TableCell>
                                                <TableCell>
                                                    {subscriber.name || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(subscriber.status)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(subscriber.subscribed_at)}
                                                    </div>
                                                    {subscriber.unsubscribed_at && (
                                                        <div className="text-xs text-muted-foreground">
                                                            Désinscrit: {formatDate(subscriber.unsubscribed_at)}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {subscriber.user ? (
                                                        <Badge variant="outline">
                                                            {subscriber.user.name}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
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
                                                            <DropdownMenuItem 
                                                                onClick={() => handleToggleStatus(subscriber)}
                                                            >
                                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                                {subscriber.status === 'active' ? 'Désinscrire' : 'Réactiver'}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem 
                                                                onClick={() => handleDelete(subscriber)}
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Supprimer
                                                            </DropdownMenuItem>
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
                        {subscribers.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Page {subscribers.current_page} sur {subscribers.last_page} ({subscribers.total} abonnés)
                                </div>
                                <div className="flex gap-2">
                                    {subscribers.links.map((link, index) => (
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
                        <AlertDialogTitle>Supprimer l'abonné</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer "{selectedSubscriber?.email}" ?
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
