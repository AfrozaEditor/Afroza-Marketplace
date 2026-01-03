import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    CheckCircle, 
    Clock, 
    Eye, 
    Package, 
    Truck, 
    Search, 
    XCircle,
    RefreshCw,
    MapPin,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import type { Order } from '@/types';
import Heading from '@/components/heading';
import { Head, Link, router } from '@inertiajs/react';
import { formatDate, getFirstImageUrl } from '@/lib/utils';

interface Props {
    orders: {
        data: Order[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filters: {
        status: string;
    };
}

const getStatusInfo = (status: string) => {
    switch (status) {
        case 'delivered':
            return {
                label: 'Livré',
                variant: 'default' as const,
                icon: CheckCircle,
                color: 'text-green-600',
                bgColor: 'bg-green-50 dark:bg-green-900/20'
            };
        case 'shipped':
            return {
                label: 'Expédié',
                variant: 'secondary' as const,
                icon: Truck,
                color: 'text-blue-600',
                bgColor: 'bg-blue-50 dark:bg-blue-900/20'
            };
        case 'out_for_delivery':
            return {
                label: 'En livraison',
                variant: 'secondary' as const,
                icon: MapPin,
                color: 'text-purple-600',
                bgColor: 'bg-purple-50 dark:bg-purple-900/20'
            };
        case 'processing':
            return {
                label: 'En préparation',
                variant: 'outline' as const,
                icon: Clock,
                color: 'text-orange-600',
                bgColor: 'bg-orange-50 dark:bg-orange-900/20'
            };
        case 'confirmed':
            return {
                label: 'Confirmé',
                variant: 'outline' as const,
                icon: CheckCircle,
                color: 'text-teal-600',
                bgColor: 'bg-teal-50 dark:bg-teal-900/20'
            };
        case 'pending':
            return {
                label: 'En attente',
                variant: 'outline' as const,
                icon: Clock,
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
            };
        case 'cancelled':
            return {
                label: 'Annulé',
                variant: 'destructive' as const,
                icon: XCircle,
                color: 'text-red-600',
                bgColor: 'bg-red-50 dark:bg-red-900/20'
            };
        case 'refunded':
            return {
                label: 'Remboursé',
                variant: 'outline' as const,
                icon: RefreshCw,
                color: 'text-gray-600',
                bgColor: 'bg-gray-50 dark:bg-gray-900/20'
            };
        default:
            return {
                label: 'Inconnu',
                variant: 'outline' as const,
                icon: Package,
                color: 'text-gray-600',
                bgColor: 'bg-gray-50 dark:bg-gray-900/20'
            };
    }
};

const getPaymentStatusBadge = (status: string) => {
    switch (status) {
        case 'paid':
            return <Badge variant="default" className="bg-green-500">Payé</Badge>;
        case 'pending':
            return <Badge variant="outline" className="text-yellow-600 border-yellow-600">En attente</Badge>;
        case 'failed':
            return <Badge variant="destructive">Échoué</Badge>;
        case 'refunded':
            return <Badge variant="secondary">Remboursé</Badge>;
        default:
            return <Badge variant="outline">Inconnu</Badge>;
    }
};

function Index({ orders, filters }: Props) {
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
    const [searchQuery, setSearchQuery] = useState('');

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        router.get('/order', { status: value === 'all' ? undefined : value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/order', { 
            status: statusFilter === 'all' ? undefined : statusFilter,
            search: searchQuery 
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url, {}, { preserveState: true, preserveScroll: true });
        }
    };

    const handleCancel = (orderId: number) => {
        if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
            router.post(`/order/${orderId}/cancel`);
        }
    };

    return (
        <AppLayout>
            <Head title="Mes commandes" />
            <div className="container mx-auto p-4">
                <div className="mb-8">
                    <Heading 
                        title="Mes commandes" 
                        description="Suivez l'état de vos commandes et consultez votre historique d'achats"
                    />
                </div>

                {/* Filtres */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        type="text"
                                        placeholder="Rechercher par numéro de commande..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </form>
                            <Select value={statusFilter} onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Filtrer par statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les statuts</SelectItem>
                                    <SelectItem value="pending">En attente</SelectItem>
                                    <SelectItem value="confirmed">Confirmé</SelectItem>
                                    <SelectItem value="processing">En préparation</SelectItem>
                                    <SelectItem value="shipped">Expédié</SelectItem>
                                    <SelectItem value="out_for_delivery">En livraison</SelectItem>
                                    <SelectItem value="delivered">Livré</SelectItem>
                                    <SelectItem value="cancelled">Annulé</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Liste des commandes */}
                <div className="space-y-6">
                    {orders.data.length > 0 ? (
                        orders.data.map((order) => {
                            const statusInfo = getStatusInfo(order.status);
                            const StatusIcon = statusInfo.icon;

                            return (
                                <Card key={order.id} className="border hover:shadow-md transition-shadow dark:border-neutral-700">
                                    <CardHeader className="pb-4">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center space-x-4">
                                                <div className={`p-3 rounded-full ${statusInfo.bgColor}`}>
                                                    <StatusIcon size={20} className={statusInfo.color} />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg font-semibold dark:text-white">
                                                        Commande #{order.order_number}
                                                    </CardTitle>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        Passée le {formatDate(order.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <Badge variant={statusInfo.variant} className="flex items-center space-x-1">
                                                    <span>{statusInfo.label}</span>
                                                </Badge>
                                                {getPaymentStatusBadge(order.payment_status)}
                                                <div className="text-right">
                                                    <p className="font-semibold text-lg dark:text-white">
                                                        {Number(order.total) + Number(order.shipping_cost || 0)} FCFA
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {order.items?.length || 0} article(s)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="space-y-4">
                                            {/* Articles */}
                                            {order.items && order.items.slice(0, 2).map((item) => (
                                                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                                    <img
                                                        src={item.product?.images?.[0]?.url || '/placeholder.svg'}
                                                        alt={item.product?.name}
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-grow min-w-0">
                                                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                                            {item.product?.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Vendu par {item.product?.user?.name || 'Vendeur'}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            Quantité: {item.quantity}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold dark:text-white">
                                                            {item.price * item.quantity} FCFA
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            {order.items && order.items.length > 2 && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                                    + {order.items.length - 2} autre(s) article(s)
                                                </p>
                                            )}

                                            {/* Informations de livraison */}
                                            {order.delivery_address && (
                                                <div className="flex items-start gap-2 pt-2 border-t dark:border-neutral-700">
                                                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                        <span className="font-medium">Livraison:</span>{' '}
                                                        {order.delivery_address}, {order.delivery_city}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex flex-wrap justify-between items-center pt-4 border-t dark:border-neutral-700 gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/order/${order.id}`} className="flex items-center space-x-2">
                                                        <Eye size={16} />
                                                        <span>Voir les détails</span>
                                                    </Link>
                                                </Button>

                                                <div className="flex gap-2">
                                                    {order.tracking_number && (
                                                        <Button size="sm" variant="outline">
                                                            Suivre le colis
                                                        </Button>
                                                    )}

                                                    {order.status === 'delivered' && (
                                                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                                                            Laisser un avis
                                                        </Button>
                                                    )}

                                                    {['pending', 'confirmed', 'processing'].includes(order.status) && (
                                                        <Button 
                                                            size="sm" 
                                                            variant="destructive"
                                                            onClick={() => handleCancel(order.id)}
                                                        >
                                                            Annuler
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="text-center py-12">
                            <Package size={64} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Aucune commande
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {statusFilter !== 'all' 
                                    ? 'Aucune commande trouvée avec ce filtre.' 
                                    : 'Vous n\'avez pas encore passé de commande.'}
                            </p>
                            <Button className="bg-primary hover:bg-primary/90" asChild>
                                <Link href="/products">Découvrir nos produits</Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {orders.data.length > 0 && orders.last_page > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={orders.current_page === 1}
                            onClick={() => handlePageChange(orders.links[0]?.url)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        
                        <span className="flex items-center px-4 text-sm text-gray-600 dark:text-gray-400">
                            Page {orders.current_page} sur {orders.last_page}
                        </span>
                        
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={orders.current_page === orders.last_page}
                            onClick={() => handlePageChange(orders.links[orders.links.length - 1]?.url)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                <div className="mt-4 text-center text-sm text-muted-foreground">
                    {orders.total} commande(s) au total
                </div>
            </div>
        </AppLayout>
    );
}

export default Index;
