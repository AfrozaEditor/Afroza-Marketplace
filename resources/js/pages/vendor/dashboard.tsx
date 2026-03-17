import DataTable from '@/components/dt-table';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import SubscriptionTab from '@/components/vendor/subscription-tab';
import AppLayout from '@/layouts/app-layout';
import { formatDate, formatPrice } from '@/lib/utils';
import { Product, Shop, SubscriptionData } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    BarChart2,
    Camera,
    CheckCircle2,
    Clock,
    DollarSign,
    Eye,
    Loader2,
    Package,
    Pencil,
    PlusCircle,
    Settings,
    ShoppingBag,
    ShoppingCart,
    Store,
    Trash,
    TrendingUp,
    Upload,
    Users,
    Crown,
} from 'lucide-react';
import { useMemo, useState, useRef } from 'react';
import { toast } from 'sonner';

interface OrderSummary {
    id: number;
    reference: string;
    customer: string;
    customer_avatar: string | null;
    date: string;
    status: string;
    amount: number;
    items_count: number;
}

interface Stats {
    total_sales: number;
    total_orders: number;
    total_products: number;
    active_products: number;
    sold_products: number;
    pending_orders: number;
    processing_orders: number;
    completed_orders: number;
    total_followers: number;
}

interface ShopWithUrls extends Shop {
    logo_url?: string;
    cover_image_url?: string;
}

interface Props {
    products: Product[];
    shop: ShopWithUrls | null;
    orders: OrderSummary[];
    stats: Stats;
    subscription: SubscriptionData;
}

const getStatusBadgeColor = (status: string) => {
    switch (status) {
        case 'active':
        case 'delivered':
        case 'completed':
            return 'bg-green-100 text-green-800';
        case 'sold':
        case 'processing':
            return 'bg-blue-100 text-blue-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'pending': return 'En attente';
        case 'processing': return 'En cours';
        case 'shipped': return 'Expédié';
        case 'delivered': return 'Livré';
        case 'completed': return 'Terminé';
        case 'cancelled': return 'Annulé';
        default: return status;
    }
};

export default function Dashboard({ products, shop, orders, stats, subscription }: Props) {
    const [activeTab, setActiveTab] = useState<string>('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<keyof Product | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const logoInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(shop?.logo_url || null);
    const [coverPreview, setCoverPreview] = useState<string | null>(shop?.cover_image_url || null);

    const [visibleColumns, setVisibleColumns] = useState({
        Id: true,
        Nom: true,
        Catégorie: true,
        Quantité: true,
        'Date de création': true,
    });

    // Formulaire pour la boutique
    const shopForm = useForm({
        name: shop?.name || '',
        description: shop?.description || '',
        address: shop?.address || '',
        city: shop?.city || '',
        phone: shop?.phone || '',
        email: shop?.email || '',
        website: shop?.website || '',
        facebook: shop?.facebook || '',
        instagram: shop?.instagram || '',
        logo: null as File | null,
        cover_image: null as File | null,
    });

    const filteredProducts = useMemo(() => {
        let result = [...products];

        result = result.filter((product) => {
            return product.name.toLowerCase().includes(searchQuery.toLowerCase());
        });

        if (sortField) {
            result.sort((a, b) => {
                const aValue = a[sortField];
                const bValue = b[sortField];

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }

                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
                }

                return 0;
            });
        }

        return result;
    }, [products, searchQuery, sortField, sortDirection]);

    const handleSort = (field: keyof Product) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
            router.delete(route('products.destroy', id), {
                onSuccess: () => {
                    toast.success('Article supprimé avec succès');
                },
                onError: () => {
                    toast.error("Une erreur est survenue lors de la suppression");
                },
            });
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            shopForm.setData('logo', file);
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            shopForm.setData('cover_image', file);
            const reader = new FileReader();
            reader.onloadend = () => setCoverPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleShopSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', shopForm.data.name);
        formData.append('description', shopForm.data.description || '');
        formData.append('address', shopForm.data.address || '');
        formData.append('city', shopForm.data.city || '');
        formData.append('phone', shopForm.data.phone || '');
        formData.append('email', shopForm.data.email || '');
        formData.append('website', shopForm.data.website || '');
        formData.append('facebook', shopForm.data.facebook || '');
        formData.append('instagram', shopForm.data.instagram || '');
        
        if (shopForm.data.logo instanceof File) {
            formData.append('logo', shopForm.data.logo);
        }
        if (shopForm.data.cover_image instanceof File) {
            formData.append('cover_image', shopForm.data.cover_image);
        }
        
        if (shop) {
            formData.append('_method', 'PUT');
        }
        
        const routeName = shop ? 'vendor.shop.update' : 'vendor.shop.create';

        router.post(route(routeName), formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.success(shop ? 'Boutique mise à jour avec succès' : 'Boutique créée avec succès');
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Une erreur est survenue');
            },
        });
    };

    const columns = [
        {
            title: 'Nom',
            accessor: (product: Product) => (
                <div className="flex items-center gap-3">
                    {product.images && product.images[0] && (
                        <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="h-10 w-10 rounded-md object-cover"
                        />
                    )}
                    <Link href={route('products.edit', product.id)} className="hover:text-primary hover:underline">
                        {product.name}
                    </Link>
                </div>
            ),
            sortable: true,
            className: 'max-w-[340px] w-full',
        },
        {
            title: 'Catégorie',
            accessor: (product: Product) => (
                <Badge variant="outline">{product.category?.name || '-'}</Badge>
            ),
            sortable: true,
        },
        {
            title: 'Prix',
            accessor: (product: Product) => (
                <span className="font-medium">{formatPrice(product.price)}</span>
            ),
            sortable: true,
        },
        {
            title: 'Quantité',
            accessor: (product: Product) => (
                <Badge className={product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {product.quantity > 0 ? product.quantity : 'Épuisé'}
                </Badge>
            ),
            sortable: true,
        },
        {
            title: 'Date de création',
            accessor: (product: Product) => formatDate(product.created_at),
            sortable: true,
            className: 'w-[150px]',
        },
    ];

    const renderActions = (product: Product) => {
        return (
            <div className="flex gap-2">
                <Link href={route('products.edit', product.id)}>
                    <Button variant="outline" size="icon" className="h-7 w-7 p-0">
                        <Pencil className="h-4 w-4" />
                    </Button>
                </Link>
                <Button variant="destructive" size="icon" className="h-7 w-7 p-0" onClick={() => handleDelete(product.id)}>
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
        );
    };

    const activePercent = stats.total_products > 0
        ? Math.round((stats.active_products / stats.total_products) * 100)
        : 0;

    const completedPercent = stats.total_orders > 0
        ? Math.round((stats.completed_orders / stats.total_orders) * 100)
        : 0;

    return (
        <AppLayout>
            <Head title="Dashboard Vendeur" />
            <div className="container mx-auto flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <Heading
                        title="Tableau de bord vendeur"
                        description="Gérez vos articles, commandes et votre boutique"
                    />
                    <div className="flex gap-2 items-center">
                        <Link href={route('products.create')}>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Ajouter un article
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards - Improved */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Ventes Totales */}
                    <Card className="relative overflow-hidden">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Ventes Totales</p>
                                    <p className="text-2xl font-bold tracking-tight">{formatPrice(stats.total_sales)}</p>
                                </div>
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                    <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500/20">
                                <div className="h-full bg-green-500 transition-all" style={{ width: `${completedPercent}%` }} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Commandes */}
                    <Card className="relative overflow-hidden">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Commandes</p>
                                    <p className="text-2xl font-bold tracking-tight">{stats.total_orders}</p>
                                    <div className="flex items-center gap-2 text-xs">
                                        {stats.pending_orders > 0 && (
                                            <span className="flex items-center gap-1 text-yellow-600">
                                                <Clock className="h-3 w-3" />
                                                {stats.pending_orders} en attente
                                            </span>
                                        )}
                                        {stats.processing_orders > 0 && (
                                            <span className="flex items-center gap-1 text-blue-600">
                                                <TrendingUp className="h-3 w-3" />
                                                {stats.processing_orders} en cours
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                    <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500/20">
                                <div className="h-full bg-blue-500 transition-all" style={{ width: `${completedPercent}%` }} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Articles */}
                    <Card className="relative overflow-hidden">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Articles</p>
                                    <p className="text-2xl font-bold tracking-tight">{stats.total_products}</p>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="flex items-center gap-1 text-green-600">
                                            <CheckCircle2 className="h-3 w-3" />
                                            {stats.active_products} actifs
                                        </span>
                                        {stats.sold_products > 0 && (
                                            <span className="text-muted-foreground">
                                                · {stats.sold_products} épuisés
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                    <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500/20">
                                <div className="h-full bg-purple-500 transition-all" style={{ width: `${activePercent}%` }} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Abonnés */}
                    <Card className="relative overflow-hidden">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Abonnés</p>
                                    <p className="text-2xl font-bold tracking-tight">{stats.total_followers}</p>
                                </div>
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                                    <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500/20">
                                <div className="h-full bg-orange-500 transition-all" style={{ width: stats.total_followers > 0 ? '100%' : '0%' }} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2 gap-2 md:grid-cols-6 h-auto">
                        <TabsTrigger value="overview" className="gap-2">
                            <BarChart2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Vue d'ensemble</span>
                        </TabsTrigger>
                        <TabsTrigger value="products" className="gap-2">
                            <Package className="h-4 w-4" />
                            <span className="hidden sm:inline">Mes articles</span>
                        </TabsTrigger>
                        <TabsTrigger value="orders" className="gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            <span className="hidden sm:inline">Commandes</span>
                        </TabsTrigger>
                        <TabsTrigger value="shop" className="gap-2">
                            <Store className="h-4 w-4" />
                            <span className="hidden sm:inline">Ma boutique</span>
                        </TabsTrigger>
                        <TabsTrigger value="subscription" className="gap-2">
                            <Crown className="h-4 w-4" />
                            <span className="hidden sm:inline">Abonnement</span>
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="gap-2">
                            <Settings className="h-4 w-4" />
                            <span className="hidden sm:inline">Paramètres</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        {/* Quick Summary Bars */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Articles actifs</span>
                                        <span className="text-sm font-bold text-green-600">{activePercent}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                                        <div
                                            className="h-full rounded-full bg-green-500 transition-all duration-500"
                                            style={{ width: `${activePercent}%` }}
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {stats.active_products} sur {stats.total_products} articles
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Commandes complétées</span>
                                        <span className="text-sm font-bold text-blue-600">{completedPercent}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                                        <div
                                            className="h-full rounded-full bg-blue-500 transition-all duration-500"
                                            style={{ width: `${completedPercent}%` }}
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {stats.completed_orders} sur {stats.total_orders} commandes
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Résumé rapide</span>
                                    </div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {stats.pending_orders > 0 && (
                                            <Badge variant="outline" className="border-yellow-300 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                                                <Clock className="mr-1 h-3 w-3" />
                                                {stats.pending_orders} en attente
                                            </Badge>
                                        )}
                                        {stats.processing_orders > 0 && (
                                            <Badge variant="outline" className="border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                                <TrendingUp className="mr-1 h-3 w-3" />
                                                {stats.processing_orders} en cours
                                            </Badge>
                                        )}
                                        {stats.sold_products > 0 && (
                                            <Badge variant="outline" className="border-red-300 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                                <Package className="mr-1 h-3 w-3" />
                                                {stats.sold_products} épuisés
                                            </Badge>
                                        )}
                                        {stats.pending_orders === 0 && stats.processing_orders === 0 && stats.sold_products === 0 && (
                                            <Badge variant="outline" className="border-green-300 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                                Tout est en ordre
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Recent Products */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-3">
                                    <div>
                                        <CardTitle className="text-lg">Articles récents</CardTitle>
                                        <CardDescription>{stats.total_products} articles au total</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('products')}>
                                        Voir tout
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="divide-y">
                                        {products.slice(0, 5).map((product) => (
                                            <Link key={product.id} href={route('products.edit', product.id)} className="flex items-center gap-4 py-3 hover:bg-muted/50 -mx-3 px-3 rounded-lg transition-colors">
                                                {product.images?.[0] ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="h-12 w-12 rounded-lg object-cover ring-1 ring-border"
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center ring-1 ring-border">
                                                        <Package className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-medium truncate">{product.name}</h3>
                                                    <p className="text-sm font-semibold text-primary">{formatPrice(product.price)}</p>
                                                </div>
                                                <Badge className={product.quantity > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}>
                                                    {product.quantity > 0 ? `${product.quantity} en stock` : 'Épuisé'}
                                                </Badge>
                                            </Link>
                                        ))}
                                        {products.length === 0 && (
                                            <p className="text-center text-muted-foreground py-4">
                                                Aucun article pour le moment
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Orders */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-3">
                                    <div>
                                        <CardTitle className="text-lg">Commandes récentes</CardTitle>
                                        <CardDescription>{stats.total_orders} commandes au total</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('orders')}>
                                        Voir tout
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="divide-y">
                                        {orders.slice(0, 5).map((order) => (
                                            <div key={order.id} className="flex items-center gap-4 py-3">
                                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center ring-1 ring-border shrink-0">
                                                    {order.customer_avatar ? (
                                                        <img src={order.customer_avatar} alt={order.customer} className="h-10 w-10 rounded-full object-cover" />
                                                    ) : (
                                                        <Users className="h-5 w-5 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-medium">{order.reference}</h3>
                                                    <p className="text-xs text-muted-foreground">{order.customer} · {order.date}</p>
                                                </div>
                                                <div className="text-right space-y-1">
                                                    <p className="text-sm font-semibold">{formatPrice(order.amount)}</p>
                                                    <Badge className={getStatusBadgeColor(order.status)} variant="secondary">
                                                        {getStatusLabel(order.status)}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                        {orders.length === 0 && (
                                            <p className="text-center text-muted-foreground py-4">
                                                Aucune commande pour le moment
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Shop Status */}
                        {shop ? (
                            <Card className="overflow-hidden">
                                {shop.cover_image_url && (
                                    <div className="h-32 w-full overflow-hidden">
                                        <img src={shop.cover_image_url} alt="Couverture" className="h-full w-full object-cover" />
                                    </div>
                                )}
                                <CardContent className={shop.cover_image_url ? 'p-5 -mt-8 relative' : 'p-5'}>
                                    <div className="flex items-end gap-4">
                                        {shop.logo_url ? (
                                            <img src={shop.logo_url} alt={shop.name} className="h-16 w-16 rounded-xl object-cover ring-4 ring-background shadow-sm" />
                                        ) : (
                                            <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center ring-4 ring-background shadow-sm">
                                                <Store className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0 pb-1">
                                            <h3 className="font-semibold text-lg truncate">{shop.name}</h3>
                                            <p className="text-sm text-muted-foreground truncate">{shop.description || 'Aucune description'}</p>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => setActiveTab('shop')}>
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Modifier
                                        </Button>
                                    </div>
                                    {shop.city && (
                                        <p className="mt-3 text-sm text-muted-foreground flex items-center gap-1">
                                            📍 {shop.city}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-dashed border-2">
                                <CardContent className="flex flex-col items-center justify-center py-10">
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                        <Store className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">Créez votre boutique</h3>
                                    <p className="text-muted-foreground text-center mb-6 max-w-sm">
                                        Créez votre boutique pour personnaliser votre présence et attirer plus de clients
                                    </p>
                                    <Button size="lg" onClick={() => setActiveTab('shop')}>
                                        <PlusCircle className="h-4 w-4 mr-2" />
                                        Créer ma boutique
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Products Tab */}
                    <TabsContent value="products" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Mes articles ({products.length})</h2>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Rechercher..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-64"
                                />
                            </div>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <DataTable
                                filteredTickets={filteredProducts}
                                columns={columns}
                                handleSort={handleSort}
                                visibleColumns={visibleColumns}
                                renderActions={renderActions}
                            />
                        ) : (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Package className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="font-semibold text-lg mb-2">Aucun article</h3>
                                    <p className="text-muted-foreground text-center mb-4">
                                        Commencez à vendre en ajoutant votre premier article
                                    </p>
                                    <Link href={route('products.create')}>
                                        <Button>
                                            <PlusCircle className="h-4 w-4 mr-2" />
                                            Ajouter un article
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Orders Tab */}
                    <TabsContent value="orders" className="space-y-4">
                        <h2 className="text-xl font-semibold">Mes commandes ({orders.length})</h2>

                        {orders.length > 0 ? (
                            <Card>
                                <CardContent className="p-0">
                                    <div className="rounded-md border">
                                        <div className="hidden md:grid grid-cols-12 bg-muted/50 p-4 text-sm font-medium text-muted-foreground">
                                            <div className="col-span-2">Commande</div>
                                            <div className="col-span-3">Client</div>
                                            <div className="col-span-2 text-center">Date</div>
                                            <div className="col-span-2 text-center">Montant</div>
                                            <div className="col-span-1 text-center">Articles</div>
                                            <div className="col-span-2 text-center">Statut</div>
                                        </div>

                                        {orders.map((order) => (
                                            <div key={order.id} className="grid grid-cols-1 md:grid-cols-12 items-center border-t p-4 text-sm gap-2 md:gap-0">
                                                <div className="md:col-span-2 font-medium">{order.reference}</div>
                                                <div className="md:col-span-3 flex items-center gap-2">
                                                    {order.customer_avatar ? (
                                                        <img src={order.customer_avatar} alt={order.customer} className="h-8 w-8 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                            <Users className="h-4 w-4 text-gray-500" />
                                                        </div>
                                                    )}
                                                    {order.customer}
                                                </div>
                                                <div className="md:col-span-2 md:text-center text-muted-foreground">{order.date}</div>
                                                <div className="md:col-span-2 md:text-center font-medium">{formatPrice(order.amount)}</div>
                                                <div className="md:col-span-1 md:text-center">{order.items_count}</div>
                                                <div className="md:col-span-2 md:text-center">
                                                    <Badge className={getStatusBadgeColor(order.status)}>
                                                        {getStatusLabel(order.status)}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="font-semibold text-lg mb-2">Aucune commande</h3>
                                    <p className="text-muted-foreground text-center">
                                        Vos commandes apparaîtront ici une fois que des clients achèteront vos articles
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Shop Tab */}
                    <TabsContent value="shop" className="space-y-4">
                        <h2 className="text-xl font-semibold">
                            {shop ? 'Gérer ma boutique' : 'Créer ma boutique'}
                        </h2>

                        <form onSubmit={handleShopSubmit}>
                            <div className="grid gap-6 lg:grid-cols-3">
                                {/* Cover & Logo */}
                                <Card className="lg:col-span-3">
                                    <CardHeader>
                                        <CardTitle>Images de la boutique</CardTitle>
                                        <CardDescription>Personnalisez l'apparence de votre boutique</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Cover Image */}
                                        <div>
                                            <Label>Image de couverture</Label>
                                            <div 
                                                className="mt-2 relative h-48 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary cursor-pointer overflow-hidden"
                                                onClick={() => coverInputRef.current?.click()}
                                            >
                                                {coverPreview ? (
                                                    <>
                                                        <img src={coverPreview} alt="Couverture" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Camera className="h-8 w-8 text-white" />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full">
                                                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                                        <p className="text-sm text-muted-foreground">Cliquez pour télécharger</p>
                                                        <p className="text-xs text-muted-foreground">PNG, JPG jusqu'à 5MB</p>
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                ref={coverInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleCoverChange}
                                            />
                                        </div>

                                        {/* Logo */}
                                        <div>
                                            <Label>Logo</Label>
                                            <div className="mt-2 flex items-center gap-4">
                                                <div 
                                                    className="relative h-24 w-24 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary cursor-pointer overflow-hidden"
                                                    onClick={() => logoInputRef.current?.click()}
                                                >
                                                    {logoPreview ? (
                                                        <>
                                                            <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <Camera className="h-6 w-6 text-white" />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center h-full">
                                                            <Store className="h-8 w-8 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Logo de la boutique</p>
                                                    <p className="text-xs text-muted-foreground">PNG, JPG jusqu'à 2MB</p>
                                                </div>
                                            </div>
                                            <input
                                                ref={logoInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleLogoChange}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Basic Info */}
                                <Card className="lg:col-span-2">
                                    <CardHeader>
                                        <CardTitle>Informations de base</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Nom de la boutique *</Label>
                                                <Input
                                                    id="name"
                                                    value={shopForm.data.name}
                                                    onChange={(e) => shopForm.setData('name', e.target.value)}
                                                    placeholder="Ma super boutique"
                                                />
                                                {shopForm.errors.name && (
                                                    <p className="text-sm text-red-500">{shopForm.errors.name}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="city">Ville</Label>
                                                <Input
                                                    id="city"
                                                    value={shopForm.data.city}
                                                    onChange={(e) => shopForm.setData('city', e.target.value)}
                                                    placeholder="Douala"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                value={shopForm.data.description}
                                                onChange={(e) => shopForm.setData('description', e.target.value)}
                                                placeholder="Décrivez votre boutique..."
                                                rows={4}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Adresse</Label>
                                            <Input
                                                id="address"
                                                value={shopForm.data.address}
                                                onChange={(e) => shopForm.setData('address', e.target.value)}
                                                placeholder="123 Rue Exemple"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Contact & Social */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Contact & Réseaux</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Téléphone</Label>
                                            <Input
                                                id="phone"
                                                value={shopForm.data.phone}
                                                onChange={(e) => shopForm.setData('phone', e.target.value)}
                                                placeholder="+237 656 921 921"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={shopForm.data.email}
                                                onChange={(e) => shopForm.setData('email', e.target.value)}
                                                placeholder="contact@maboutique.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="website">Site web</Label>
                                            <Input
                                                id="website"
                                                value={shopForm.data.website}
                                                onChange={(e) => shopForm.setData('website', e.target.value)}
                                                placeholder="https://maboutique.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="facebook">Facebook</Label>
                                            <Input
                                                id="facebook"
                                                value={shopForm.data.facebook}
                                                onChange={(e) => shopForm.setData('facebook', e.target.value)}
                                                placeholder="@maboutique"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="instagram">Instagram</Label>
                                            <Input
                                                id="instagram"
                                                value={shopForm.data.instagram}
                                                onChange={(e) => shopForm.setData('instagram', e.target.value)}
                                                placeholder="@maboutique"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <Button type="submit" disabled={shopForm.processing}>
                                    {shopForm.processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {shop ? 'Mettre à jour la boutique' : 'Créer la boutique'}
                                </Button>
                            </div>
                        </form>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="subscription" className="space-y-4">
                        <SubscriptionTab subscription={subscription} />
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-4">
                        <h2 className="text-xl font-semibold">Paramètres</h2>
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="font-semibold text-lg mb-2">Paramètres du compte</h3>
                                <p className="text-muted-foreground text-center mb-4">
                                    Gérez vos paramètres de compte et vos préférences
                                </p>
                                <Link href={route('profile.edit')}>
                                    <Button variant="outline">
                                        Accéder aux paramètres
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
