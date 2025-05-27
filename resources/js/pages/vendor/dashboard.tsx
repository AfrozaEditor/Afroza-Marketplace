import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    BarChart2,
    Bell,
    DollarSign,
    MessagesSquare,
    Package,
    PlusCircle,
    Settings,
    ShoppingBag,
    ShoppingCart,
    Users
} from 'lucide-react';
import { useState } from 'react';

const stats = [
    {
        title: 'Ventes Totales',
        value: '128,500 XAF',
        change: '+14%',
        trend: 'up',
        icon: <DollarSign className="text-muted-foreground h-6 w-6" />,
    },
    {
        title: 'Commandes',
        value: '42',
        change: '+12%',
        trend: 'up',
        icon: <ShoppingBag className="text-muted-foreground h-6 w-6" />,
    },
    {
        title: 'Articles en ligne',
        value: '29',
        change: '+5',
        trend: 'up',
        icon: <Package className="text-muted-foreground h-6 w-6" />,
    },
    {
        title: 'Visiteurs',
        value: '342',
        change: '+22%',
        trend: 'up',
        icon: <Users className="text-muted-foreground h-6 w-6" />,
    },
];

const products = [
    {
        id: 1,
        name: "Robe fleurie d'été",
        price: '15,000 XAF',
        status: 'active',
        views: 85,
        image: '/placeholder.svg',
    },
    {
        id: 2,
        name: 'Chemise en lin blanche',
        price: '12,500 XAF',
        status: 'active',
        views: 42,
        image: '/placeholder.svg',
    },
    {
        id: 3,
        name: 'Jean slim noir',
        price: '18,000 XAF',
        status: 'sold',
        views: 124,
        image: '/placeholder.svg',
    },
    {
        id: 4,
        name: 'Veste en cuir marron',
        price: '35,000 XAF',
        status: 'active',
        views: 56,
        image: '/placeholder.svg',
    },
];

const orders = [
    {
        id: 'ORD-001',
        customer: 'Sophie Mbongo',
        date: '2025-04-28',
        status: 'delivered',
        amount: '15,000 XAF',
        items: 1,
    },
    {
        id: 'ORD-002',
        customer: 'Jean Nguema',
        date: '2025-04-27',
        status: 'processing',
        amount: '27,500 XAF',
        items: 2,
    },
    {
        id: 'ORD-003',
        customer: 'Marie Ekang',
        date: '2025-04-25',
        status: 'delivered',
        amount: '18,000 XAF',
        items: 1,
    },
];

const notifications = [
    {
        id: 1,
        message: 'Nouvelle commande reçue',
        time: 'Il y a 10 minutes',
        read: false,
    },
    {
        id: 2,
        message: 'Un client a posé une question sur votre article',
        time: 'Il y a 2 heures',
        read: false,
    },
    {
        id: 3,
        message: 'La commande ORD-001 a été livrée',
        time: 'Il y a 1 jour',
        read: true,
    },
];

const getStatusBadgeColor = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-800';
        case 'sold':
            return 'bg-blue-100 text-blue-800';
        case 'processing':
            return 'bg-yellow-100 text-yellow-800';
        case 'delivered':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<string>('overview');
    const [isAddArticleDialogOpen, setIsAddArticleDialogOpen] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <div className="flex justify-between mb-8">
                        <Heading title="Tableau de bord vendeur" description="Gérez vos articles, commandes et performances" />
                        <div className="flex gap-2 items-center">
                            {/* <Button variant="outline" className="relative">
                                <Bell size={20} />
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                    {notifications.filter((n) => !n.read).length}
                                </span>
                            </Button> */}
                            <Link href={route('products.create')}>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Ajouter un article
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat, index) => (
                            <Card key={index}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                    {stat.icon}
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className={`text-xs ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                        {stat.change} par rapport au mois dernier
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                        {/* ... keep existing code (TabsList) */}
                        <TabsList className="grid w-full grid-cols-2 gap-2 md:grid-cols-5">
                            <TabsTrigger value="overview">
                                <BarChart2 className="mr-2 h-4 w-4" />
                                Vue d'ensemble
                            </TabsTrigger>
                            <TabsTrigger value="products">
                                <Package className="mr-2 h-4 w-4" />
                                Mes articles
                            </TabsTrigger>
                            <TabsTrigger value="orders">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Commandes
                            </TabsTrigger>
                            <TabsTrigger value="chat">
                                <Bell className="mr-2 h-4 w-4" />
                                Notifications
                            </TabsTrigger>
                            <TabsTrigger value="settings">
                                <Settings className="mr-2 h-4 w-4" />
                                Paramètres
                            </TabsTrigger>
                        </TabsList>

                        {/* ... keep existing code (TabsContent for overview) */}
                        <TabsContent value="overview" className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Articles récents</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {products.slice(0, 3).map((product) => (
                                                <div key={product.id} className="flex items-center gap-4">
                                                    <img src={product.image} alt={product.name} className="h-12 w-12 rounded-md object-cover" />
                                                    <div className="flex-1">
                                                        <h3 className="text-sm font-medium">{product.name}</h3>
                                                        <p className="text-sm text-gray-500">{product.price}</p>
                                                    </div>
                                                    <Badge className={getStatusBadgeColor(product.status)}>
                                                        {product.status === 'active' ? 'En vente' : 'Vendu'}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4">
                                            <Button variant="outline" size="sm" asChild className="w-full">
                                                <Link href="">Voir tous les articles</Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Commandes récentes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {orders.slice(0, 3).map((order) => (
                                                <div key={order.id} className="flex items-center gap-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-sm font-medium">{order.id}</h3>
                                                        <p className="text-sm text-gray-500">{order.customer}</p>
                                                    </div>
                                                    <div className="text-right text-sm">
                                                        <div>{order.amount}</div>
                                                        <div className="text-gray-500">{order.date}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4">
                                            <Button variant="outline" size="sm" asChild className="w-full">
                                                <Link href="">Voir toutes les commandes</Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/*<Card>*/}
                            {/*    <CardHeader>*/}
                            {/*        <CardTitle>Notifications</CardTitle>*/}
                            {/*    </CardHeader>*/}
                            {/*    <CardContent>*/}
                            {/*        <div className="space-y-4">*/}
                            {/*            {notifications.map((notification) => (*/}
                            {/*                <div*/}
                            {/*                    key={notification.id}*/}
                            {/*                    className={`rounded-lg p-4 ${notification.read ? 'bg-gray-50' : 'border-l-4 border-blue-500 bg-blue-50'}`}*/}
                            {/*                >*/}
                            {/*                    <div className="flex justify-between">*/}
                            {/*                        <p className={`text-sm ${notification.read ? 'text-gray-700' : 'font-medium text-blue-700'}`}>*/}
                            {/*                            {notification.message}*/}
                            {/*                        </p>*/}
                            {/*                        {!notification.read && <Badge variant="outline">Nouveau</Badge>}*/}
                            {/*                    </div>*/}
                            {/*                    <p className="mt-1 text-xs text-gray-500">{notification.time}</p>*/}
                            {/*                </div>*/}
                            {/*            ))}*/}
                            {/*        </div>*/}
                            {/*    </CardContent>*/}
                            {/*</Card>*/}
                        </TabsContent>

                        <TabsContent value="products" className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Mes articles ({products.length})</h2>
                                {/*<DialogTrigger asChild>*/}
                                {/*    <Button>*/}
                                {/*        <PlusCircle className="mr-2 h-4 w-4" />*/}
                                {/*        Ajouter un article*/}
                                {/*    </Button>*/}
                                {/*</DialogTrigger>*/}
                            </div>

                            {/* ... keep existing code (products list card) */}
                            <Card>
                                <CardContent className="p-0">
                                    <div className="rounded-md border">
                                        <div className="grid grid-cols-12 bg-gray-50 p-4 text-sm font-medium text-gray-500">
                                            <div className="col-span-5">Article</div>
                                            <div className="col-span-2 text-center">Prix</div>
                                            <div className="col-span-2 text-center">Vues</div>
                                            <div className="col-span-2 text-center">Statut</div>
                                            <div className="col-span-1 text-right">Actions</div>
                                        </div>

                                        {products.map((product) => (
                                            <div key={product.id} className="grid grid-cols-12 items-center border-t p-4 text-sm">
                                                <div className="col-span-5 flex items-center gap-4">
                                                    <img src={product.image} alt={product.name} className="h-12 w-12 rounded-md object-cover" />
                                                    <span>{product.name}</span>
                                                </div>
                                                <div className="col-span-2 text-center font-medium">{product.price}</div>
                                                <div className="col-span-2 text-center">{product.views}</div>
                                                <div className="col-span-2 text-center">
                                                    <Badge className={getStatusBadgeColor(product.status)}>
                                                        {product.status === 'active' ? 'En vente' : 'Vendu'}
                                                    </Badge>
                                                </div>
                                                <div className="col-span-1 text-right">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <Settings className="h-4 w-4" />
                                                        <span className="sr-only">Modifier</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* ... keep existing code (TabsContent for orders, chat, settings) */}
                        <TabsContent value="orders" className="space-y-4">
                            <h2 className="text-xl font-semibold">Mes commandes ({orders.length})</h2>

                            <Card>
                                <CardContent className="p-0">
                                    <div className="rounded-md border">
                                        <div className="grid grid-cols-12 bg-gray-50 p-4 text-sm font-medium text-gray-500">
                                            <div className="col-span-2">Commande</div>
                                            <div className="col-span-3">Client</div>
                                            <div className="col-span-2 text-center">Date</div>
                                            <div className="col-span-2 text-center">Montant</div>
                                            <div className="col-span-1 text-center">Articles</div>
                                            <div className="col-span-2 text-center">Statut</div>
                                        </div>

                                        {orders.map((order) => (
                                            <div key={order.id} className="grid grid-cols-12 items-center border-t p-4 text-sm">
                                                <div className="col-span-2 font-medium">{order.id}</div>
                                                <div className="col-span-3">{order.customer}</div>
                                                <div className="col-span-2 text-center">{order.date}</div>
                                                <div className="col-span-2 text-center font-medium">{order.amount}</div>
                                                <div className="col-span-1 text-center">{order.items}</div>
                                                <div className="col-span-2 text-center">
                                                    <Badge className={getStatusBadgeColor(order.status)}>
                                                        {order.status === 'delivered' ? 'Livré' : 'En cours'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/*<TabsContent value="chat">/!*<ChatView className="h-auto border-none shadow-none" />*!/</TabsContent>*/}

                        <TabsContent value="settings">
                            {/*<UserSettings />*/}
                            {/*<ShopSettings />*/}
                        </TabsContent>
                    </Tabs>
                </div>
                {/*<DialogContent className="sm:max-w-[625px]">*/}
                {/*    <DialogHeader>*/}
                {/*        <DialogTitle>Ajouter un nouvel article</DialogTitle>*/}
                {/*        <DialogDescription>Remplissez les informations ci-dessous pour ajouter un nouvel article à votre boutique.</DialogDescription>*/}
                {/*    </DialogHeader>*/}
                {/*    /!*<AddArticleForm onFormSubmit={() => setIsAddArticleDialogOpen(false)} />*!/*/}
                {/*</DialogContent>*/}
        </AppLayout>
    );
}
