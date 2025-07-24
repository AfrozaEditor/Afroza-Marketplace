import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Eye, Package, Truck } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import Heading from '@/components/heading';

const mockOrders = [
    {
        id: 'CMD-001',
        date: '2024-01-15',
        status: 'delivered',
        total: 85000,
        items: [
            {
                id: 1,
                name: 'Robe Zara élégante',
                image: '/placeholder.svg',
                price: 45000,
                quantity: 1,
                seller: 'Marie Style'
            },
            {
                id: 2,
                name: 'Sac à main cuir',
                image: '/placeholder.svg',
                price: 40000,
                quantity: 1,
                seller: 'Luxury Bags'
            }
        ]
    },
    {
        id: 'CMD-002',
        date: '2024-01-20',
        status: 'shipped',
        total: 65000,
        items: [
            {
                id: 3,
                name: 'Jeans Levi\'s vintage',
                image: '/placeholder.svg',
                price: 35000,
                quantity: 1,
                seller: 'Vintage Store'
            },
            {
                id: 4,
                name: 'T-shirt designer',
                image: '/placeholder.svg',
                price: 30000,
                quantity: 1,
                seller: 'Fashion Hub'
            }
        ]
    },
    {
        id: 'CMD-003',
        date: '2024-01-25',
        status: 'processing',
        total: 120000,
        items: [
            {
                id: 5,
                name: 'Manteau d\'hiver',
                image: '/placeholder.svg',
                price: 120000,
                quantity: 1,
                seller: 'Winter Collection'
            }
        ]
    }
];

const getStatusInfo = (status: string) => {
    switch (status) {
        case 'delivered':
            return {
                label: 'Livré',
                variant: 'default' as const,
                icon: CheckCircle,
                color: 'text-green-600'
            };
        case 'shipped':
            return {
                label: 'Expédié',
                variant: 'secondary' as const,
                icon: Truck,
                color: 'text-blue-600'
            };
        case 'processing':
            return {
                label: 'En préparation',
                variant: 'outline' as const,
                icon: Clock,
                color: 'text-orange-600'
            };
        default:
            return {
                label: 'Inconnu',
                variant: 'outline' as const,
                icon: Package,
                color: 'text-gray-600'
            };
    }
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mes commandes',
        href: '/',
    },
];


function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="container mx-auto p-4">
                    <div className="mb-8">
                        <Heading title="Mes commandes" description="Suivez l'état de vos commandes et consultez votre historique d'achats"/>
                    </div>

                    <div className="space-y-6">
                        {mockOrders.map((order) => {
                            const statusInfo = getStatusInfo(order.status);
                            const StatusIcon = statusInfo.icon;

                            return (
                                <Card key={order.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div>
                                                    <CardTitle className="text-lg font-semibold">
                                                        Commande #{order.id}
                                                    </CardTitle>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Passée le {new Date(order.date).toLocaleDateString('fr-FR')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Badge variant={statusInfo.variant} className="flex items-center space-x-1">
                                                    <StatusIcon size={14} className={statusInfo.color} />
                                                    <span>{statusInfo.label}</span>
                                                </Badge>
                                                <div className="text-right">
                                                    <p className="font-semibold text-lg">{order.total} FCFA</p>
                                                    <p className="text-sm text-gray-500">{order.items.length} article(s)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="space-y-4">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-grow">
                                                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                        <p className="text-sm text-gray-600">Vendu par {item.seller}</p>
                                                        <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold">{item.price} FCFA</p>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                                                    <Eye size={16} />
                                                    <span>Voir les détails</span>
                                                </Button>

                                                {order.status === 'delivered' && (
                                                    <Button size="sm" className="bg-primary hover:bg-secondary">
                                                        Laisser un avis
                                                    </Button>
                                                )}

                                                {order.status === 'shipped' && (
                                                    <Button size="sm" variant="outline">
                                                        Suivre le colis
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {mockOrders.length === 0 && (
                        <div className="text-center py-12">
                            <Package size={64} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune commande</h3>
                            <p className="text-gray-600 mb-6">Vous n'avez pas encore passé de commande.</p>
                            <Button className="bg-primary hover:bg-secondary">
                                Découvrir nos produits
                            </Button>
                        </div>
                    )}
                </div>
        </AppLayout>
    );
}

export default Index;
