import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
    ChevronRight,
    DollarSign,
    TrendingUp,
    ShoppingBag,
    Mail,
    Phone
} from 'lucide-react';
import type { Order } from '@/types';
import Heading from '@/components/heading';
import { Head, Link, router } from '@inertiajs/react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

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
    stats: {
        total_orders: number;
        pending_orders: number;
        total_revenue: number;
        this_month_revenue: number;
    };
}

const getStatusInfo = (status: string) => {
    switch (status) {
        case 'delivered':
            return {
                label: 'Livré',
                variant: 'default' as const,
                color: 'text-green-600',
                bgColor: 'bg-green-100 dark:bg-green-900/30'
            };
        case 'shipped':
            return {
                label: 'Expédié',
                variant: 'secondary' as const,
                color: 'text-blue-600',
                bgColor: 'bg-blue-100 dark:bg-blue-900/30'
            };
        case 'out_for_delivery':
            return {
                label: 'En livraison',
                variant: 'secondary' as const,
                color: 'text-purple-600',
                bgColor: 'bg-purple-100 dark:bg-purple-900/30'
            };
        case 'processing':
            return {
                label: 'En préparation',
                variant: 'outline' as const,
                color: 'text-orange-600',
                bgColor: 'bg-orange-100 dark:bg-orange-900/30'
            };
        case 'confirmed':
            return {
                label: 'Confirmé',
                variant: 'outline' as const,
                color: 'text-teal-600',
                bgColor: 'bg-teal-100 dark:bg-teal-900/30'
            };
        case 'pending':
            return {
                label: 'En attente',
                variant: 'outline' as const,
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
            };
        case 'cancelled':
            return {
                label: 'Annulé',
                variant: 'destructive' as const,
                color: 'text-red-600',
                bgColor: 'bg-red-100 dark:bg-red-900/30'
            };
        case 'refunded':
            return {
                label: 'Remboursé',
                variant: 'outline' as const,
                color: 'text-gray-600',
                bgColor: 'bg-gray-100 dark:bg-gray-900/30'
            };
        default:
            return {
                label: 'Inconnu',
                variant: 'outline' as const,
                color: 'text-gray-600',
                bgColor: 'bg-gray-100 dark:bg-gray-900/30'
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

function VendorOrders({ orders, filters, stats }: Props) {
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showStatusDialog, setShowStatusDialog] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        router.get('/vendor/orders', { status: value === 'all' ? undefined : value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/vendor/orders', { 
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

    const openStatusDialog = (order: Order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setTrackingNumber(order.tracking_number || '');
        setShowStatusDialog(true);
    };

    const handleUpdateStatus = () => {
        if (!selectedOrder) return;
        
        setIsUpdating(true);
        router.patch(`/vendor/orders/${selectedOrder.id}/status`, {
            status: newStatus,
            tracking_number: trackingNumber,
        }, {
            onSuccess: () => {
                toast.success('Statut mis à jour avec succès');
                setShowStatusDialog(false);
            },
            onError: () => {
                toast.error('Erreur lors de la mise à jour');
            },
            onFinish: () => {
                setIsUpdating(false);
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Gestion des commandes" />
            <div className="container mx-auto p-4">
                <div className="mb-8">
                    <Heading 
                        title="Gestion des commandes" 
                        description="Gérez les commandes de vos clients"
                    />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total commandes</p>
                                    <p className="text-2xl font-bold dark:text-white">{stats.total_orders}</p>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                    <ShoppingBag className="text-blue-600" size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">En attente</p>
                                    <p className="text-2xl font-bold dark:text-white">{stats.pending_orders}</p>
                                </div>
                                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                                    <Clock className="text-yellow-600" size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Revenus totaux</p>
                                    <p className="text-2xl font-bold dark:text-white">{stats.total_revenue?.toLocaleString()} FCFA</p>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                                    <DollarSign className="text-green-600" size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Ce mois</p>
                                    <p className="text-2xl font-bold dark:text-white">{stats.this_month_revenue?.toLocaleString()} FCFA</p>
                                </div>
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                                    <TrendingUp className="text-purple-600" size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
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
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-neutral-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Commande
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Client
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Articles
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Statut
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Paiement
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                    {orders.data.length > 0 ? (
                                        orders.data.map((order) => {
                                            const statusInfo = getStatusInfo(order.status);
                                            return (
                                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <p className="font-medium dark:text-white">#{order.order_number}</p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {formatDate(order.created_at)}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="font-medium dark:text-white">{order.customer_name}</p>
                                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                                <Mail size={12} />
                                                                {order.customer_email}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                                <Phone size={12} />
                                                                {order.customer_phone}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="dark:text-white">{order.items?.length || 0} article(s)</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="font-semibold dark:text-white">
                                                            {Number(order.total).toLocaleString()} FCFA
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge 
                                                            variant={statusInfo.variant}
                                                            className={statusInfo.bgColor}
                                                        >
                                                            {statusInfo.label}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getPaymentStatusBadge(order.payment_status)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <Link href={`/order/${order.id}`}>
                                                                    <Eye size={16} />
                                                                </Link>
                                                            </Button>
                                                            {!['cancelled', 'delivered', 'refunded'].includes(order.status) && (
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="sm"
                                                                    onClick={() => openStatusDialog(order)}
                                                                >
                                                                    Mettre à jour
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center">
                                                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                                                <p className="text-gray-500 dark:text-gray-400">Aucune commande trouvée</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {orders.data.length > 0 && orders.last_page > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
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

                {/* Dialog de mise à jour du statut */}
                <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Mettre à jour le statut</DialogTitle>
                            <DialogDescription>
                                Commande #{selectedOrder?.order_number}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Nouveau statut</Label>
                                <Select value={newStatus} onValueChange={setNewStatus}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">En attente</SelectItem>
                                        <SelectItem value="confirmed">Confirmé</SelectItem>
                                        <SelectItem value="processing">En préparation</SelectItem>
                                        <SelectItem value="shipped">Expédié</SelectItem>
                                        <SelectItem value="out_for_delivery">En livraison</SelectItem>
                                        <SelectItem value="delivered">Livré</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            {(newStatus === 'shipped' || newStatus === 'out_for_delivery') && (
                                <div className="space-y-2">
                                    <Label>Numéro de suivi (optionnel)</Label>
                                    <Input
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        placeholder="Ex: TRK123456789"
                                    />
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                                Annuler
                            </Button>
                            <Button onClick={handleUpdateStatus} disabled={isUpdating}>
                                {isUpdating ? 'Mise à jour...' : 'Mettre à jour'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}

export default VendorOrders;
