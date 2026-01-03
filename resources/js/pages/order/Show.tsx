import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
    CheckCircle, 
    Clock, 
    Package, 
    Truck, 
    XCircle,
    RefreshCw,
    MapPin,
    Phone,
    Mail,
    User,
    CreditCard,
    ArrowLeft,
    Calendar,
    Copy,
    ExternalLink
} from 'lucide-react';
import type { Order } from '@/types';
import Heading from '@/components/heading';
import { Head, Link, router } from '@inertiajs/react';
import { formatDate } from '@/lib/utils';

interface Props {
    order: Order;
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

const getPaymentMethodLabel = (method: string) => {
    switch (method) {
        case 'mobile_money':
            return 'Mobile Money';
        case 'card':
            return 'Carte bancaire';
        case 'cash_on_delivery':
            return 'Paiement à la livraison';
        default:
            return method;
    }
};

const getShippingMethodLabel = (method: string) => {
    switch (method) {
        case 'standard':
            return 'Livraison standard';
        case 'express':
            return 'Livraison express';
        case 'pickup':
            return 'Retrait en point relais';
        default:
            return method;
    }
};

// Étapes du suivi de commande
const orderSteps = [
    { status: 'pending', label: 'Commande passée', icon: Package },
    { status: 'confirmed', label: 'Confirmée', icon: CheckCircle },
    { status: 'processing', label: 'En préparation', icon: Clock },
    { status: 'shipped', label: 'Expédiée', icon: Truck },
    { status: 'out_for_delivery', label: 'En livraison', icon: MapPin },
    { status: 'delivered', label: 'Livrée', icon: CheckCircle },
];

const getStepIndex = (status: string) => {
    if (status === 'cancelled' || status === 'refunded') return -1;
    const index = orderSteps.findIndex(step => step.status === status);
    return index;
};

function Show({ order }: Props) {
    const statusInfo = getStatusInfo(order.status);
    const StatusIcon = statusInfo.icon;
    const currentStepIndex = getStepIndex(order.status);

    const handleCancel = () => {
        if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
            router.post(`/order/${order.id}/cancel`);
        }
    };

    const copyOrderNumber = () => {
        navigator.clipboard.writeText(order.order_number);
    };

    const canBeCancelled = ['pending', 'confirmed', 'processing'].includes(order.status);

    return (
        <AppLayout>
            <Head title={`Commande #${order.order_number}`} />
            <div className="container mx-auto p-4 max-w-5xl">
                {/* Header */}
                <div className="mb-6">
                    <Button variant="ghost" size="sm" asChild className="mb-4">
                        <Link href="/order" className="flex items-center gap-2">
                            <ArrowLeft size={16} />
                            Retour aux commandes
                        </Link>
                    </Button>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold dark:text-white">
                                    Commande #{order.order_number}
                                </h1>
                                <button onClick={copyOrderNumber} className="text-gray-400 hover:text-gray-600">
                                    <Copy size={16} />
                                </button>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Passée le {formatDate(order.created_at)}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant={statusInfo.variant} className="flex items-center gap-1 py-1.5 px-3">
                                <StatusIcon size={16} className={statusInfo.color} />
                                {statusInfo.label}
                            </Badge>
                            {getPaymentStatusBadge(order.payment_status)}
                        </div>
                    </div>
                </div>

                {/* Suivi de commande */}
                {order.status !== 'cancelled' && order.status !== 'refunded' && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Suivi de commande</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                {/* Ligne de progression */}
                                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-neutral-700 md:hidden" />
                                
                                {/* Steps pour mobile */}
                                <div className="space-y-6 md:hidden">
                                    {orderSteps.map((step, index) => {
                                        const StepIcon = step.icon;
                                        const isCompleted = index <= currentStepIndex;
                                        const isCurrent = index === currentStepIndex;
                                        
                                        return (
                                            <div key={step.status} className="flex items-center gap-4 relative">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                                                    isCompleted 
                                                        ? 'bg-primary text-white' 
                                                        : 'bg-gray-100 dark:bg-neutral-800 text-gray-400'
                                                }`}>
                                                    <StepIcon size={18} />
                                                </div>
                                                <div>
                                                    <p className={`font-medium ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                                        {step.label}
                                                    </p>
                                                    {isCurrent && (
                                                        <p className="text-sm text-primary">En cours</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Steps pour desktop */}
                                <div className="hidden md:flex justify-between relative">
                                    {/* Ligne de fond */}
                                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-neutral-700" />
                                    {/* Ligne de progression */}
                                    <div 
                                        className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500" 
                                        style={{ width: `${Math.max(0, (currentStepIndex / (orderSteps.length - 1)) * 100)}%` }}
                                    />
                                    
                                    {orderSteps.map((step, index) => {
                                        const StepIcon = step.icon;
                                        const isCompleted = index <= currentStepIndex;
                                        const isCurrent = index === currentStepIndex;
                                        
                                        return (
                                            <div key={step.status} className="flex flex-col items-center relative z-10">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                    isCompleted 
                                                        ? 'bg-primary text-white' 
                                                        : 'bg-gray-100 dark:bg-neutral-800 text-gray-400'
                                                }`}>
                                                    <StepIcon size={18} />
                                                </div>
                                                <p className={`mt-2 text-sm font-medium text-center ${
                                                    isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                                                }`}>
                                                    {step.label}
                                                </p>
                                                {isCurrent && (
                                                    <p className="text-xs text-primary">En cours</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Numéro de suivi */}
                            {order.tracking_number && (
                                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Numéro de suivi</p>
                                            <p className="font-mono font-medium dark:text-white">{order.tracking_number}</p>
                                        </div>
                                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                                            <ExternalLink size={14} />
                                            Suivre
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Alerte si annulée */}
                {order.status === 'cancelled' && (
                    <Card className="mb-6 border-red-200 dark:border-red-900">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 text-red-600">
                                <XCircle size={24} />
                                <div>
                                    <p className="font-medium">Commande annulée</p>
                                    {order.cancelled_at && (
                                        <p className="text-sm">Annulée le {formatDate(order.cancelled_at)}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Articles */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Articles ({order.items?.length || 0})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.items?.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                            <img
                                                src={item.product?.images?.[0]?.url || '/placeholder.svg'}
                                                alt={item.product?.name}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                            <div className="flex-grow min-w-0">
                                                <Link 
                                                    href={`/products/${item.product?.id}`}
                                                    className="font-medium text-gray-900 dark:text-white hover:text-primary truncate block"
                                                >
                                                    {item.product?.name}
                                                </Link>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Vendu par {item.product?.user?.name || 'Vendeur'}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Quantité: {item.quantity} × {item.price} FCFA
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold dark:text-white">
                                                    {item.price * item.quantity} FCFA
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator className="my-6" />

                                {/* Récapitulatif */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Sous-total</span>
                                        <span className="dark:text-white">{order.total} FCFA</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Frais de livraison</span>
                                        <span className="dark:text-white">{order.shipping_cost || 0} FCFA</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span className="dark:text-white">Total</span>
                                        <span className="text-primary">
                                            {Number(order.total) + Number(order.shipping_cost || 0)} FCFA
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Informations latérales */}
                    <div className="space-y-6">
                        {/* Livraison */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Truck size={18} />
                                    Livraison
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Méthode</p>
                                    <p className="font-medium dark:text-white">
                                        {getShippingMethodLabel(order.shipping_method)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Adresse</p>
                                    <p className="font-medium dark:text-white">{order.delivery_address}</p>
                                    <p className="text-gray-600 dark:text-gray-400">{order.delivery_city}</p>
                                </div>
                                {order.shipped_at && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Expédié le</p>
                                        <p className="font-medium dark:text-white">{formatDate(order.shipped_at)}</p>
                                    </div>
                                )}
                                {order.delivered_at && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Livré le</p>
                                        <p className="font-medium dark:text-white">{formatDate(order.delivered_at)}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Client */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User size={18} />
                                    Informations client
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <User size={16} className="text-gray-400" />
                                    <span className="dark:text-white">{order.customer_name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail size={16} className="text-gray-400" />
                                    <span className="dark:text-white">{order.customer_email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={16} className="text-gray-400" />
                                    <span className="dark:text-white">{order.customer_phone}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Paiement */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CreditCard size={18} />
                                    Paiement
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Méthode</p>
                                    <p className="font-medium dark:text-white">
                                        {getPaymentMethodLabel(order.payment_method)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Statut</p>
                                    {getPaymentStatusBadge(order.payment_status)}
                                </div>
                                {order.payment_reference && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Référence</p>
                                        <p className="font-mono text-sm dark:text-white">{order.payment_reference}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        {canBeCancelled && (
                            <Card>
                                <CardContent className="pt-6">
                                    <Button 
                                        variant="destructive" 
                                        className="w-full"
                                        onClick={handleCancel}
                                    >
                                        <XCircle size={16} className="mr-2" />
                                        Annuler la commande
                                    </Button>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                                        Vous pouvez annuler tant que la commande n'est pas expédiée
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {order.status === 'delivered' && (
                            <Card>
                                <CardContent className="pt-6 space-y-3">
                                    <Button className="w-full bg-primary hover:bg-primary/90">
                                        Laisser un avis
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        Signaler un problème
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default Show;