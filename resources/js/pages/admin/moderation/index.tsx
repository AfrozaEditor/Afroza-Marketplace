import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    AlertTriangle,
    Ban,
    Check,
    CheckCircle,
    Eye,
    Flag,
    MessageSquare,
    MoreVertical,
    Package,
    Shield,
    ShieldAlert,
    ShoppingBag,
    Star,
    Store,
    Trash2,
    User,
    Users,
    X,
    XCircle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { BreadcrumbItem } from '@/types';

interface ProductReviewReport {
    id: number;
    reason: string;
    details: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        avatar?: string;
    };
    review: {
        id: number;
        rating: number;
        comment: string;
        status: string;
        created_at: string;
        user: {
            id: number;
            name: string;
            avatar?: string;
        };
        product: {
            id: number;
            name: string;
        };
    };
}

interface ShopReviewReport {
    id: number;
    reason: string;
    details: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        avatar?: string;
    };
    review: {
        id: number;
        rating: number;
        comment: string;
        status: string;
        created_at: string;
        user: {
            id: number;
            name: string;
            avatar?: string;
        };
        shop: {
            id: number;
            name: string;
        };
    };
}

interface ReportedProduct {
    id: number;
    name: string;
    status: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        avatar?: string;
    };
    category: {
        id: number;
        name: string;
    };
}

interface Stats {
    total_product_review_reports: number;
    pending_product_review_reports: number;
    total_shop_review_reports: number;
    pending_shop_review_reports: number;
    reported_products: number;
    blocked_users: number;
}

interface Props {
    productReviewReports: {
        data: ProductReviewReport[];
        links: any;
        current_page: number;
        last_page: number;
    };
    shopReviewReports: {
        data: ShopReviewReport[];
        links: any;
        current_page: number;
        last_page: number;
    };
    reportedProducts: {
        data: ReportedProduct[];
        links: any;
    };
    stats: Stats;
    currentTab: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/admin' },
    { title: 'Modération', href: '/admin/moderation' },
];

const reasonLabels: { [key: string]: string } = {
    'spam': 'Spam',
    'inappropriate': 'Contenu inapproprié',
    'harassment': 'Harcèlement',
    'fake': 'Faux avis',
    'offensive': 'Contenu offensant',
    'other': 'Autre',
};

export default function ModerationIndex({
    productReviewReports,
    shopReviewReports,
    // reportedProducts,
    stats,
    currentTab,
}: Props) {
    const [activeTab, setActiveTab] = useState(currentTab);

    const handleApproveProductReview = (reviewId: number) => {
        router.post(route('admin.moderation.product-reviews.approve', reviewId), {}, {
            onSuccess: () => toast.success('Avis approuvé'),
            onError: () => toast.error('Erreur lors de l\'approbation'),
        });
    };

    const handleRejectProductReview = (reviewId: number) => {
        router.post(route('admin.moderation.product-reviews.reject', reviewId), {}, {
            onSuccess: () => toast.success('Avis rejeté'),
            onError: () => toast.error('Erreur lors du rejet'),
        });
    };

    const handleDeleteProductReview = (reviewId: number) => {
        router.delete(route('admin.moderation.product-reviews.delete', reviewId), {
            onSuccess: () => toast.success('Avis supprimé'),
            onError: () => toast.error('Erreur lors de la suppression'),
        });
    };

    const handleDismissProductReviewReport = (reportId: number) => {
        router.delete(route('admin.moderation.product-review-reports.dismiss', reportId), {
            onSuccess: () => toast.success('Signalement ignoré'),
            onError: () => toast.error('Erreur'),
        });
    };

    const handleApproveShopReview = (reviewId: number) => {
        router.post(route('admin.moderation.shop-reviews.approve', reviewId), {}, {
            onSuccess: () => toast.success('Avis approuvé'),
            onError: () => toast.error('Erreur lors de l\'approbation'),
        });
    };

    const handleRejectShopReview = (reviewId: number) => {
        router.post(route('admin.moderation.shop-reviews.reject', reviewId), {}, {
            onSuccess: () => toast.success('Avis rejeté'),
            onError: () => toast.error('Erreur lors du rejet'),
        });
    };

    const handleDeleteShopReview = (reviewId: number) => {
        router.delete(route('admin.moderation.shop-reviews.delete', reviewId), {
            onSuccess: () => toast.success('Avis supprimé'),
            onError: () => toast.error('Erreur lors de la suppression'),
        });
    };

    const handleDismissShopReviewReport = (reportId: number) => {
        router.delete(route('admin.moderation.shop-review-reports.dismiss', reportId), {
            onSuccess: () => toast.success('Signalement ignoré'),
            onError: () => toast.error('Erreur'),
        });
    };

    const handleApproveProduct = (productId: number) => {
        router.post(route('admin.moderation.products.approve', productId), {}, {
            onSuccess: () => toast.success('Produit approuvé'),
            onError: () => toast.error('Erreur lors de l\'approbation'),
        });
    };

    // const handleRejectProduct = (productId: number) => {
    //     router.post(route('admin.moderation.products.reject', productId), {}, {
    //         onSuccess: () => toast.success('Produit rejeté'),
    //         onError: () => toast.error('Erreur lors du rejet'),
    //     });
    // };

    const handleBlockUser = (userId: number) => {
        router.post(route('admin.moderation.users.block', userId), {}, {
            onSuccess: () => toast.success('Utilisateur bloqué'),
            onError: () => toast.error('Erreur'),
        });
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-3 w-3 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        );
    };

    const statsCards = [
        {
            title: 'Signalements Avis Produits',
            value: stats.pending_product_review_reports,
            total: stats.total_product_review_reports,
            icon: <MessageSquare className="h-5 w-5 text-orange-600" />,
            bgColor: 'bg-orange-50',
            color: 'text-orange-600',
        },
        {
            title: 'Signalements Avis Boutiques',
            value: stats.pending_shop_review_reports,
            total: stats.total_shop_review_reports,
            icon: <Store className="h-5 w-5 text-blue-600" />,
            bgColor: 'bg-blue-50',
            color: 'text-blue-600',
        },
        {
            title: 'Produits Signalés',
            value: stats.reported_products,
            icon: <Package className="h-5 w-5 text-purple-600" />,
            bgColor: 'bg-purple-50',
            color: 'text-purple-600',
        },
        {
            title: 'Utilisateurs Bloqués',
            value: stats.blocked_users,
            icon: <Ban className="h-5 w-5 text-red-600" />,
            bgColor: 'bg-red-50',
            color: 'text-red-600',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modération" />
            
            <div className="container mx-auto p-4 space-y-6">
                <Heading
                    title="Modération de Contenu"
                    description="Gérez les signalements et le contenu publié sur la plateforme"
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statsCards.map((stat, index) => (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                                        <div className="flex items-baseline gap-2">
                                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                            {stat.total !== undefined && (
                                                <span className="text-sm text-muted-foreground">/ {stat.total}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                        {stat.icon}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3 h-auto">
                        <TabsTrigger value="product_reviews" className="gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <span className="hidden sm:inline">Avis Produits</span>
                            {stats.pending_product_review_reports > 0 && (
                                <Badge variant="destructive" className="ml-1">
                                    {stats.pending_product_review_reports}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="shop_reviews" className="gap-2">
                            <Store className="h-4 w-4" />
                            <span className="hidden sm:inline">Avis Boutiques</span>
                            {stats.pending_shop_review_reports > 0 && (
                                <Badge variant="destructive" className="ml-1">
                                    {stats.pending_shop_review_reports}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="products" className="gap-2">
                            <Package className="h-4 w-4" />
                            <span className="hidden sm:inline">Produits Signalés</span>
                            {stats.reported_products > 0 && (
                                <Badge variant="destructive" className="ml-1">
                                    {stats.reported_products}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    {/* Product Reviews Tab */}
                    <TabsContent value="product_reviews" className="space-y-4">
                        <h2 className="text-xl font-semibold">
                            Signalements d'avis produits ({productReviewReports.data.length})
                        </h2>

                        {productReviewReports.data.length > 0 ? (
                            <div className="space-y-4">
                                {productReviewReports.data.map((report) => (
                                    <Card key={report.id} className="overflow-hidden">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col lg:flex-row">
                                                {/* Report Info */}
                                                <div className="flex-1 p-4 border-b lg:border-b-0 lg:border-r">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <Flag className="h-4 w-4 text-red-500" />
                                                            <Badge variant="destructive">
                                                                {reasonLabels[report.reason] || report.reason}
                                                            </Badge>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatDate(report.created_at)}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="mb-3">
                                                        <p className="text-sm font-medium mb-1">Signalé par :</p>
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarImage src={report.user.avatar} />
                                                                <AvatarFallback>{report.user.name[0]}</AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-sm">{report.user.name}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {report.details && (
                                                        <div>
                                                            <p className="text-sm font-medium mb-1">Détails :</p>
                                                            <p className="text-sm text-muted-foreground">{report.details}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Review Content */}
                                                <div className="flex-1 p-4 bg-muted/30">
                                                    <div className="mb-3">
                                                        <p className="text-sm font-medium mb-1">Avis signalé :</p>
                                                        <Link 
                                                            href={`/products/${report.review.product?.id}`}
                                                            className="text-sm text-primary hover:underline"
                                                        >
                                                            {report.review.product?.name}
                                                        </Link>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={report.review.user?.avatar} />
                                                            <AvatarFallback>{report.review.user?.name[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm font-medium">{report.review.user?.name}</span>
                                                        {renderStars(report.review.rating)}
                                                    </div>
                                                    
                                                    <p className="text-sm bg-white p-3 rounded-lg border">
                                                        {report.review.comment}
                                                    </p>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex lg:flex-col gap-2 p-4 justify-center items-center border-t lg:border-t-0 lg:border-l bg-muted/10">
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleApproveProductReview(report.review.id)}
                                                    >
                                                        <Check className="h-4 w-4 mr-1" />
                                                        Approuver
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleRejectProductReview(report.review.id)}
                                                    >
                                                        <X className="h-4 w-4 mr-1" />
                                                        Rejeter
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button size="sm" variant="outline">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem onClick={() => handleDismissProductReviewReport(report.id)}>
                                                                <XCircle className="h-4 w-4 mr-2" />
                                                                Ignorer le signalement
                                                            </DropdownMenuItem>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                        <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                                                        <span className="text-red-500">Supprimer l'avis</span>
                                                                    </DropdownMenuItem>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Supprimer cet avis ?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Cette action est irréversible. L'avis sera définitivement supprimé.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            className="bg-red-600 hover:bg-red-700"
                                                                            onClick={() => handleDeleteProductReview(report.review.id)}
                                                                        >
                                                                            Supprimer
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                            <DropdownMenuItem onClick={() => handleBlockUser(report.review.user?.id)}>
                                                                <Ban className="h-4 w-4 mr-2 text-red-500" />
                                                                <span className="text-red-500">Bloquer l'auteur</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                                    <h3 className="font-semibold text-lg mb-2">Aucun signalement en attente</h3>
                                    <p className="text-muted-foreground text-center">
                                        Tous les signalements d'avis produits ont été traités
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Shop Reviews Tab */}
                    <TabsContent value="shop_reviews" className="space-y-4">
                        <h2 className="text-xl font-semibold">
                            Signalements d'avis boutiques ({shopReviewReports.data.length})
                        </h2>

                        {shopReviewReports.data.length > 0 ? (
                            <div className="space-y-4">
                                {shopReviewReports.data.map((report) => (
                                    <Card key={report.id} className="overflow-hidden">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col lg:flex-row">
                                                {/* Report Info */}
                                                <div className="flex-1 p-4 border-b lg:border-b-0 lg:border-r">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <Flag className="h-4 w-4 text-red-500" />
                                                            <Badge variant="destructive">
                                                                {reasonLabels[report.reason] || report.reason}
                                                            </Badge>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatDate(report.created_at)}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="mb-3">
                                                        <p className="text-sm font-medium mb-1">Signalé par :</p>
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarImage src={report.user.avatar} />
                                                                <AvatarFallback>{report.user.name[0]}</AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-sm">{report.user.name}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {report.details && (
                                                        <div>
                                                            <p className="text-sm font-medium mb-1">Détails :</p>
                                                            <p className="text-sm text-muted-foreground">{report.details}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Review Content */}
                                                <div className="flex-1 p-4 bg-muted/30">
                                                    <div className="mb-3">
                                                        <p className="text-sm font-medium mb-1">Avis signalé :</p>
                                                        <Link 
                                                            href={`/shops/${report.review.shop?.id}`}
                                                            className="text-sm text-primary hover:underline flex items-center gap-1"
                                                        >
                                                            <Store className="h-4 w-4" />
                                                            {report.review.shop?.name}
                                                        </Link>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={report.review.user?.avatar} />
                                                            <AvatarFallback>{report.review.user?.name[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm font-medium">{report.review.user?.name}</span>
                                                        {renderStars(report.review.rating)}
                                                    </div>
                                                    
                                                    <p className="text-sm bg-white p-3 rounded-lg border">
                                                        {report.review.comment}
                                                    </p>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex lg:flex-col gap-2 p-4 justify-center items-center border-t lg:border-t-0 lg:border-l bg-muted/10">
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleApproveShopReview(report.review.id)}
                                                    >
                                                        <Check className="h-4 w-4 mr-1" />
                                                        Approuver
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleRejectShopReview(report.review.id)}
                                                    >
                                                        <X className="h-4 w-4 mr-1" />
                                                        Rejeter
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button size="sm" variant="outline">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem onClick={() => handleDismissShopReviewReport(report.id)}>
                                                                <XCircle className="h-4 w-4 mr-2" />
                                                                Ignorer le signalement
                                                            </DropdownMenuItem>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                        <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                                                        <span className="text-red-500">Supprimer l'avis</span>
                                                                    </DropdownMenuItem>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Supprimer cet avis ?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Cette action est irréversible. L'avis sera définitivement supprimé.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            className="bg-red-600 hover:bg-red-700"
                                                                            onClick={() => handleDeleteShopReview(report.review.id)}
                                                                        >
                                                                            Supprimer
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                            <DropdownMenuItem onClick={() => handleBlockUser(report.review.user?.id)}>
                                                                <Ban className="h-4 w-4 mr-2 text-red-500" />
                                                                <span className="text-red-500">Bloquer l'auteur</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                                    <h3 className="font-semibold text-lg mb-2">Aucun signalement en attente</h3>
                                    <p className="text-muted-foreground text-center">
                                        Tous les signalements d'avis boutiques ont été traités
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Products Tab */}
                    {/* <TabsContent value="products" className="space-y-4">
                        <h2 className="text-xl font-semibold">
                            Produits signalés ({reportedProducts.data.length})
                        </h2>

                        {reportedProducts.data.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {reportedProducts.data.map((product) => (
                                    <Card key={product.id} className="overflow-hidden">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-lg">{product.name}</CardTitle>
                                                    <CardDescription>
                                                        <Badge variant="outline">{product.category?.name}</Badge>
                                                    </CardDescription>
                                                </div>
                                                <Badge variant="destructive">Signalé</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center gap-2 mb-4">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={product.user?.avatar} />
                                                    <AvatarFallback>{product.user?.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm">{product.user?.name}</span>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                                    onClick={() => handleApproveProduct(product.id)}
                                                >
                                                    <Check className="h-4 w-4 mr-1" />
                                                    Approuver
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="flex-1"
                                                    onClick={() => handleRejectProduct(product.id)}
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    Rejeter
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                                    <h3 className="font-semibold text-lg mb-2">Aucun produit signalé</h3>
                                    <p className="text-muted-foreground text-center">
                                        Tous les produits sont conformes aux règles de la plateforme
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent> */}
                </Tabs>
            </div>
        </AppLayout>
    );
}
