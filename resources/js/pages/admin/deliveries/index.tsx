import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Check, 
    X, 
    Eye, 
    MoreHorizontal, 
    Clock, 
    CheckCircle, 
    XCircle, 
    Ban,
    Truck,
    MapPin,
    Phone,
    Mail,
    FileText,
    Search
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { BreadcrumbItem } from '@/types';

interface Delivery {
    id: number;
    user_id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postal_code: string | null;
    delivery_latitude: number;
    delivery_longitude: number;
    delivery_radius_km: number;
    delivery_area: string | null;
    availability: string | null;
    vehicle_type: string | null;
    vehicle_model: string | null;
    vehicle_plate: string | null;
    id_card: string;
    url_id_card: string;
    id_driver_license: string;
    url_driver_license: string;
    insurance_certificate: string | null;
    url_insurance_certificate: string | null;
    delivery_experience: string | null;
    statut: 'en_attente' | 'approuvé' | 'rejeté' | 'suspendu';
    rejection_reason?: string;
    suspension_reason?: string;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
        email: string;
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
    deliveries: PaginatedData<Delivery>;
    statusCounts: {
        all: number;
        en_attente: number;
        approuvé: number;
        rejeté: number;
        suspendu: number;
    };
    currentStatus: string;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'en_attente':
            return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
        case 'approuvé':
            return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Approuvé</Badge>;
        case 'rejeté':
            return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300"><XCircle className="w-3 h-3 mr-1" />Rejeté</Badge>;
        case 'suspendu':
            return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300"><Ban className="w-3 h-3 mr-1" />Suspendu</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export default function Index({ deliveries, statusCounts, currentStatus }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [showSuspendDialog, setShowSuspendDialog] = useState(false);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    
    const rejectForm = useForm({
        rejection_reason: '',
    });
    
    const suspendForm = useForm({
        suspension_reason: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tableau de bord', href: '/admin' },
        { title: 'Gestion des livreurs', href: '/admin/deliveries' },
    ];

    const handleStatusFilter = (status: string) => {
        router.get('/admin/deliveries', { status }, { preserveState: true });
    };

    const handleApprove = (delivery: Delivery) => {
        if (confirm(`Êtes-vous sûr de vouloir approuver le profil de ${delivery.name} ?`)) {
            router.post(`/admin/deliveries/${delivery.id}/approve`, {}, {
                onSuccess: () => {
                    toast.success('Le profil livreur a été approuvé avec succès.');
                },
                onError: () => {
                    toast.error('Une erreur est survenue lors de l\'approbation.');
                },
            });
        }
    };

    const handleReject = (delivery: Delivery) => {
        setSelectedDelivery(delivery);
        rejectForm.reset();
        setShowRejectDialog(true);
    };

    const submitReject = () => {
        if (!selectedDelivery) return;
        
        rejectForm.post(`/admin/deliveries/${selectedDelivery.id}/reject`, {
            onSuccess: () => {
                setShowRejectDialog(false);
                setSelectedDelivery(null);
                toast.success('Le profil livreur a été rejeté.');
            },
            onError: () => {
                toast.error('Une erreur est survenue lors du rejet.');
            },
        });
    };

    const handleSuspend = (delivery: Delivery) => {
        setSelectedDelivery(delivery);
        suspendForm.reset();
        setShowSuspendDialog(true);
    };

    const submitSuspend = () => {
        if (!selectedDelivery) return;
        
        suspendForm.post(`/admin/deliveries/${selectedDelivery.id}/suspend`, {
            onSuccess: () => {
                setShowSuspendDialog(false);
                setSelectedDelivery(null);
                toast.success('Le profil livreur a été suspendu.');
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la suspension.');
            },
        });
    };

    const viewDetails = (delivery: Delivery) => {
        setSelectedDelivery(delivery);
        setShowDetailsDialog(true);
    };

    const filteredDeliveries = deliveries.data.filter(delivery =>
        delivery.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des livreurs" />
            
            <div className="p-4 container mx-auto space-y-6">
                <Heading 
                    title="Gestion des livreurs" 
                    description="Approuvez, rejetez ou suspendez les profils des livreurs"
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${currentStatus === 'all' ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => handleStatusFilter('all')}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Tous</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statusCounts.all}</div>
                        </CardContent>
                    </Card>
                    
                    <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${currentStatus === 'en_attente' ? 'ring-2 ring-yellow-500' : ''}`}
                        onClick={() => handleStatusFilter('en_attente')}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-yellow-600">En attente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{statusCounts.en_attente}</div>
                        </CardContent>
                    </Card>
                    
                    <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${currentStatus === 'approuvé' ? 'ring-2 ring-green-500' : ''}`}
                        onClick={() => handleStatusFilter('approuvé')}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-green-600">Approuvés</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{statusCounts.approuvé}</div>
                        </CardContent>
                    </Card>
                    
                    <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${currentStatus === 'rejeté' ? 'ring-2 ring-red-500' : ''}`}
                        onClick={() => handleStatusFilter('rejeté')}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-red-600">Rejetés</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{statusCounts.rejeté}</div>
                        </CardContent>
                    </Card>
                    
                    <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${currentStatus === 'suspendu' ? 'ring-2 ring-gray-500' : ''}`}
                        onClick={() => handleStatusFilter('suspendu')}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Suspendus</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-600">{statusCounts.suspendu}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Table */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div>
                                <CardTitle>Liste des profils livreurs</CardTitle>
                                <CardDescription>
                                    {currentStatus === 'all' 
                                        ? 'Tous les profils livreurs' 
                                        : `Profils avec le statut "${currentStatus}"`
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
                                        <TableHead>Livreur</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Zone</TableHead>
                                        <TableHead>Véhicule</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDeliveries.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                Aucun profil livreur trouvé
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredDeliveries.map((delivery) => (
                                            <TableRow key={delivery.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{delivery.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {delivery.user?.name}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center text-sm">
                                                            <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                                                            {delivery.email}
                                                        </div>
                                                        <div className="flex items-center text-sm">
                                                            <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                                                            {delivery.phone}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center text-sm">
                                                        <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                                                        {delivery.city} ({delivery.delivery_radius_km} km)
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center text-sm">
                                                        <Truck className="h-3 w-3 mr-1 text-muted-foreground" />
                                                        {delivery.vehicle_type || 'Non spécifié'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(delivery.statut)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-muted-foreground">
                                                        {formatDate(delivery.created_at)}
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
                                                            <DropdownMenuItem onClick={() => viewDetails(delivery)}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Voir les détails
                                                            </DropdownMenuItem>
                                                            {delivery.statut === 'en_attente' && (
                                                                <>
                                                                    <DropdownMenuItem 
                                                                        onClick={() => handleApprove(delivery)}
                                                                        className="text-green-600"
                                                                    >
                                                                        <Check className="h-4 w-4 mr-2" />
                                                                        Approuver
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem 
                                                                        onClick={() => handleReject(delivery)}
                                                                        className="text-red-600"
                                                                    >
                                                                        <X className="h-4 w-4 mr-2" />
                                                                        Rejeter
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                            {delivery.statut === 'approuvé' && (
                                                                <DropdownMenuItem 
                                                                    onClick={() => handleSuspend(delivery)}
                                                                    className="text-orange-600"
                                                                >
                                                                    <Ban className="h-4 w-4 mr-2" />
                                                                    Suspendre
                                                                </DropdownMenuItem>
                                                            )}
                                                            {delivery.statut === 'suspendu' && (
                                                                <DropdownMenuItem 
                                                                    onClick={() => handleApprove(delivery)}
                                                                    className="text-green-600"
                                                                >
                                                                    <Check className="h-4 w-4 mr-2" />
                                                                    Réactiver
                                                                </DropdownMenuItem>
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
                        {deliveries.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Page {deliveries.current_page} sur {deliveries.last_page} ({deliveries.total} résultats)
                                </div>
                                <div className="flex gap-2">
                                    {deliveries.links.map((link, index) => (
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

            {/* Reject Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rejeter le profil livreur</DialogTitle>
                        <DialogDescription>
                            Veuillez indiquer la raison du rejet pour {selectedDelivery?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Raison du rejet..."
                            value={rejectForm.data.rejection_reason}
                            onChange={(e) => rejectForm.setData('rejection_reason', e.target.value)}
                            rows={4}
                        />
                        {rejectForm.errors.rejection_reason && (
                            <p className="text-sm text-red-500 mt-1">{rejectForm.errors.rejection_reason}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                            Annuler
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={submitReject}
                            disabled={rejectForm.processing}
                        >
                            {rejectForm.processing ? 'En cours...' : 'Rejeter'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Suspend Dialog */}
            <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Suspendre le profil livreur</DialogTitle>
                        <DialogDescription>
                            Veuillez indiquer la raison de la suspension pour {selectedDelivery?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Raison de la suspension..."
                            value={suspendForm.data.suspension_reason}
                            onChange={(e) => suspendForm.setData('suspension_reason', e.target.value)}
                            rows={4}
                        />
                        {suspendForm.errors.suspension_reason && (
                            <p className="text-sm text-red-500 mt-1">{suspendForm.errors.suspension_reason}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSuspendDialog(false)}>
                            Annuler
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={submitSuspend}
                            disabled={suspendForm.processing}
                        >
                            {suspendForm.processing ? 'En cours...' : 'Suspendre'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Details Dialog */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Détails du profil livreur</DialogTitle>
                    </DialogHeader>
                    {selectedDelivery && (
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Informations personnelles</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-muted-foreground">Nom:</span> {selectedDelivery.name}</p>
                                        <p><span className="text-muted-foreground">Email:</span> {selectedDelivery.email}</p>
                                        <p><span className="text-muted-foreground">Téléphone:</span> {selectedDelivery.phone}</p>
                                        <p><span className="text-muted-foreground">Adresse:</span> {selectedDelivery.address}</p>
                                        <p><span className="text-muted-foreground">Ville:</span> {selectedDelivery.city}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Zone de livraison</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-muted-foreground">Latitude:</span> {selectedDelivery.delivery_latitude}</p>
                                        <p><span className="text-muted-foreground">Longitude:</span> {selectedDelivery.delivery_longitude}</p>
                                        <p><span className="text-muted-foreground">Rayon:</span> {selectedDelivery.delivery_radius_km} km</p>
                                        <p><span className="text-muted-foreground">Zone:</span> {selectedDelivery.delivery_area || 'Non spécifié'}</p>
                                        <p><span className="text-muted-foreground">Disponibilité:</span> {selectedDelivery.availability || 'Non spécifié'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Info */}
                            <div>
                                <h4 className="font-semibold mb-2">Informations véhicule</h4>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <p><span className="text-muted-foreground">Type:</span> {selectedDelivery.vehicle_type || 'Non spécifié'}</p>
                                    <p><span className="text-muted-foreground">Modèle:</span> {selectedDelivery.vehicle_model || 'Non spécifié'}</p>
                                    <p><span className="text-muted-foreground">Plaque:</span> {selectedDelivery.vehicle_plate || 'Non spécifié'}</p>
                                </div>
                            </div>

                            {/* Documents */}
                            <div>
                                <h4 className="font-semibold mb-2">Documents</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="border rounded-lg p-3">
                                        <p className="text-sm text-muted-foreground mb-2">Carte d'identité</p>
                                        <p className="text-sm font-medium">{selectedDelivery.id_card}</p>
                                        {selectedDelivery.url_id_card && (
                                            <a 
                                                href={selectedDelivery.url_id_card} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-xs text-primary hover:underline flex items-center mt-1"
                                            >
                                                <FileText className="h-3 w-3 mr-1" />
                                                Voir le document
                                            </a>
                                        )}
                                    </div>
                                    <div className="border rounded-lg p-3">
                                        <p className="text-sm text-muted-foreground mb-2">Permis de conduire</p>
                                        <p className="text-sm font-medium">{selectedDelivery.id_driver_license}</p>
                                        {selectedDelivery.url_driver_license && (
                                            <a 
                                                href={selectedDelivery.url_driver_license} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-xs text-primary hover:underline flex items-center mt-1"
                                            >
                                                <FileText className="h-3 w-3 mr-1" />
                                                Voir le document
                                            </a>
                                        )}
                                    </div>
                                    {selectedDelivery.insurance_certificate && (
                                        <div className="border rounded-lg p-3">
                                            <p className="text-sm text-muted-foreground mb-2">Assurance</p>
                                            <p className="text-sm font-medium">{selectedDelivery.insurance_certificate}</p>
                                            {selectedDelivery.url_insurance_certificate && (
                                                <a 
                                                    href={selectedDelivery.url_insurance_certificate} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-primary hover:underline flex items-center mt-1"
                                                >
                                                    <FileText className="h-3 w-3 mr-1" />
                                                    Voir le document
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Experience */}
                            {selectedDelivery.delivery_experience && (
                                <div>
                                    <h4 className="font-semibold mb-2">Expérience</h4>
                                    <p className="text-sm text-muted-foreground">{selectedDelivery.delivery_experience}</p>
                                </div>
                            )}

                            {/* Status Info */}
                            <div className="border-t pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-muted-foreground mr-2">Statut actuel:</span>
                                        {getStatusBadge(selectedDelivery.statut)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Créé le {formatDate(selectedDelivery.created_at)}
                                    </div>
                                </div>
                                {selectedDelivery.rejection_reason && (
                                    <div className="mt-2 p-3 bg-red-50 rounded-lg">
                                        <p className="text-sm text-red-800">
                                            <strong>Raison du rejet:</strong> {selectedDelivery.rejection_reason}
                                        </p>
                                    </div>
                                )}
                                {selectedDelivery.suspension_reason && (
                                    <div className="mt-2 p-3 bg-orange-50 rounded-lg">
                                        <p className="text-sm text-orange-800">
                                            <strong>Raison de la suspension:</strong> {selectedDelivery.suspension_reason}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                            Fermer
                        </Button>
                        {selectedDelivery?.statut === 'en_attente' && (
                            <>
                                <Button 
                                    variant="destructive"
                                    onClick={() => {
                                        setShowDetailsDialog(false);
                                        handleReject(selectedDelivery);
                                    }}
                                >
                                    Rejeter
                                </Button>
                                <Button 
                                    onClick={() => {
                                        setShowDetailsDialog(false);
                                        handleApprove(selectedDelivery);
                                    }}
                                >
                                    Approuver
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
