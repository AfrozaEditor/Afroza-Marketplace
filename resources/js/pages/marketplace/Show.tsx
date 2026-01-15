import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatDateShort } from '@/lib/utils';
import { Category, Product, Shop } from '@/types';
import { 
    ChevronLeft, 
    ChevronRight, 
    Filter, 
    Heart, 
    MessageSquare, 
    Search, 
    Share2, 
    ShoppingCart, 
    Star, 
    Users, 
    X,
    MapPin,
    Calendar,
    ShieldCheck,
    Store,
    Flag,
    Bookmark,
    Package,
    TrendingUp,
    Clock
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import ListProduct from '@/components/product/list-product';
import ShopReview from '@/components/review/shop-review';
import { ReportDialog } from '@/components/report/report-dialog';
import { useDebouncedCallback } from 'use-debounce';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface Props {
    shop: Shop & {
        logo_url?: string;
        cover_image_url?: string;
        is_followed?: boolean;
        is_favorite?: boolean;
    };
    products: {
        data: Product[];
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
}

function Show({ shop, products }: Props) {
    const { categories } = usePage<{ categories: Category[] }>().props;
    const [isFollowing, setIsFollowing] = useState(shop.is_followed || false);
    const [isFavorite, setIsFavorite] = useState(shop.is_favorite || false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    
    const averageRating = shop.reviews.length > 0 
        ? (shop.reviews.reduce((acc, review) => acc + review.rating, 0) / shop.reviews.length).toFixed(1)
        : '0';

    // Récupérer les paramètres actuels de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const [filters, setFilters] = useState({
        search: urlParams.get('search') || '',
        category: urlParams.get('category') || 'all',
        minPrice: urlParams.get('min_price') || '',
        maxPrice: urlParams.get('max_price') || '',
        sort: urlParams.get('sort') || 'newest',
    });

    const applyFilters = (newFilters: typeof filters) => {
        const params: Record<string, string> = {};
        
        if (newFilters.search) params.search = newFilters.search;
        if (newFilters.category && newFilters.category !== 'all') params.category = newFilters.category;
        if (newFilters.minPrice) params.min_price = newFilters.minPrice;
        if (newFilters.maxPrice) params.max_price = newFilters.maxPrice;
        if (newFilters.sort && newFilters.sort !== 'newest') params.sort = newFilters.sort;

        router.get(route('marketplace.show', { marketplace: shop.slug }), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const debouncedSearch = useDebouncedCallback((value: string) => {
        const newFilters = { ...filters, search: value };
        setFilters(newFilters);
        applyFilters(newFilters);
    }, 500);

    const debouncedPrice = useDebouncedCallback((key: 'minPrice' | 'maxPrice', value: string) => {
        const newFilters = { ...filters, [key]: value };
        applyFilters(newFilters);
    }, 500);

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        
        if (key === 'search') {
            debouncedSearch(value);
        } else if (key === 'minPrice' || key === 'maxPrice') {
            debouncedPrice(key, value);
        } else {
            applyFilters(newFilters);
        }
    };

    const resetFilters = () => {
        const defaultFilters = {
            search: '',
            category: 'all',
            minPrice: '',
            maxPrice: '',
            sort: 'newest',
        };
        setFilters(defaultFilters);
        router.get(route('marketplace.show', { marketplace: shop.slug }), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const hasActiveFilters = useMemo(() => {
        return filters.search || 
               (filters.category && filters.category !== 'all') || 
               filters.minPrice || 
               filters.maxPrice;
    }, [filters]);

    const handleFollow = () => {
        router.post(route('shops.follow', { slug: shop.slug }), {}, {
            preserveState: false,
            preserveScroll: true,
            onSuccess: (page) => {
                const flash = page.props.shop;
                if (flash) {
                    flash.is_followed ? toast.success("Boutique suivie") : toast.info("Boutique plus suivie");
                }
            },
            onError: () => {
                toast.error("Une erreur est survenue");
            }
        });
    };

    const handleFavorite = () => {
        router.post(route('shops.favorite', { slug: shop.slug }), {}, {
            preserveScroll: true,
            onSuccess: (page) => {
                const flash = page.props.flash;
                if (flash) {
                    setIsFavorite(flash.isFavorite);
                    flash.isFavorite ? toast.success(flash.message) : toast.info(flash.message);
                }
            },
            onError: () => {
                toast.error("Une erreur est survenue");
            }
        });
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shop.name,
                    text: shop.description,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Erreur de partage:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Lien copié dans le presse-papiers');
        }
    };

    // Statistiques de la boutique
    const stats = [
        { icon: Package, label: 'Produits', value: shop.products.length },
        { icon: Users, label: 'Abonnés', value: shop.followers.length },
        { icon: Star, label: 'Note', value: `${averageRating}/5` },
        { icon: TrendingUp, label: 'Avis', value: shop.reviews.length },
    ];

    // JSX des filtres réutilisable
    const filtersContent = (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="search">Rechercher</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        id="search"
                        placeholder="Nom du produit..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Prix (FCFA)</Label>
                <div className="flex gap-2 items-center">
                    <Input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="w-full"
                    />
                    <span className="text-gray-400">-</span>
                    <Input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <AppLayout>
            {/* Hero Banner */}
            <div className="relative h-56 md:h-72 overflow-hidden">
                <img
                    src={shop.cover_image_url || '/placeholder-cover.jpg'}
                    alt={`${shop.name} couverture`}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Actions flottantes */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={handleShare}
                        className="rounded-full bg-white/90 hover:bg-white"
                    >
                        <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={handleFavorite}
                        className={cn(
                            "rounded-full",
                            isFavorite ? "bg-primary text-white hover:bg-primary/90" : "bg-white/90 hover:bg-white"
                        )}
                    >
                        <Bookmark className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />
                    </Button>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {/* Profile Card */}
                <div className="relative -mt-20 mb-8">
                    <Card className="overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Avatar */}
                                <div className="flex flex-col items-center md:items-start">
                                    <div className="relative">
                                        <div className="h-28 w-28 md:h-32 md:w-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white">
                                            <img
                                                src={shop.logo_url || '/placeholder-logo.jpg'}
                                                alt={shop.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        {shop.is_approved && (
                                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full">
                                            <ShieldCheck className="h-4 w-4" />
                                        </div>
                                        )}
                                    </div>
                                </div>

                                {/* Infos */}
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                        <div>
                                            <div className="flex items-center justify-center md:justify-start gap-2">
                                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                                    {shop.name}
                                                </h1>
                                                {shop.is_approved &&
                                                    <Badge className="bg-green-100 text-green-700 border-green-200">
                                                        Vérifié
                                                    </Badge>
                                                }       
                                            </div>
                                            
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                                    <span className="font-medium text-gray-900 dark:text-white">{averageRating}</span>
                                                    <span>({shop.reviews.length} avis)</span>
                                                </div>
                                                {shop.city && (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{shop.city}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Depuis {formatDateShort(shop.created_at)}</span>
                                                </div>
                                            </div>
                                            
                                            <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl line-clamp-2">
                                                {shop.description}
                                            </p>
                                        </div>

                                        {/* Boutons d'action */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={handleFollow}
                                                    variant={isFollowing ? 'default' : 'outline'}
                                                    className={cn("flex-1", isFollowing && "bg-primary")}
                                                >
                                                    <Heart className="h-4 w-4 mr-2" fill={isFollowing ? 'white' : 'none'} />
                                                    {isFollowing ? 'Abonné' : 'Suivre'}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => {
                                                        router.post(route('chat.start', { user: shop.user.id }), {}, {
                                                            onSuccess: (page) => {
                                                                if (page.props?.conversation_id) {
                                                                    router.visit(route('chat.index', { conversation: page.props.conversation_id }));
                                                                }
                                                            }
                                                        });
                                                    }}
                                                >
                                                    <MessageSquare className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <ReportDialog 
                                                type="shop" 
                                                targetId={shop.id} 
                                                targetName={shop.name}
                                                trigger={
                                                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500 w-full">
                                                        <Flag className="h-4 w-4 mr-2" />
                                                        Signaler
                                                    </Button>
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <Separator className="my-6" />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                                        <stat.icon className="h-6 w-6 mx-auto text-primary mb-2" />
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                        <p className="text-sm text-gray-500">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Contenu principal */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
                    {/* Sidebar Filtres - Desktop */}
                    <div className="hidden md:block md:col-span-1">
                        <div className="sticky top-24">
                            <Card className="shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Filter className="h-5 w-5 text-primary" />
                                            Filtres
                                        </CardTitle>
                                        {hasActiveFilters && (
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={resetFilters}
                                                className="text-sm h-8 px-2 text-primary"
                                            >
                                                Réinitialiser
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {filtersContent}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Contenu principal */}
                    <div className="md:col-span-3">
                        <Tabs defaultValue="products" className="w-full">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <TabsList className="grid w-full max-w-md grid-cols-3 h-12">
                                    <TabsTrigger value="products" className="gap-2">
                                        <Package className="h-4 w-4" />
                                        <span className="hidden sm:inline">Produits</span>
                                        <Badge variant="secondary" className="ml-1">{products.total}</Badge>
                                    </TabsTrigger>
                                    <TabsTrigger value="reviews" className="gap-2">
                                        <Star className="h-4 w-4" />
                                        <span className="hidden sm:inline">Avis</span>
                                        <Badge variant="secondary" className="ml-1">{shop.reviews.length}</Badge>
                                    </TabsTrigger>
                                    <TabsTrigger value="about" className="gap-2">
                                        <Store className="h-4 w-4" />
                                        <span className="hidden sm:inline">À propos</span>
                                    </TabsTrigger>
                                </TabsList>

                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <Select value={filters.sort} onValueChange={(value) => handleFilterChange('sort', value)}>
                                        <SelectTrigger className="w-full sm:w-auto">
                                            <SelectValue placeholder="Trier par" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="newest">Plus récents</SelectItem>
                                            <SelectItem value="price-asc">Prix croissant</SelectItem>
                                            <SelectItem value="price-desc">Prix décroissant</SelectItem>
                                            <SelectItem value="popular">Popularité</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* Bouton filtres mobile */}
                                    <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                                        <SheetTrigger asChild>
                                            <Button variant="outline" size="icon" className="md:hidden relative">
                                                <Filter className="h-4 w-4" />
                                                {hasActiveFilters && (
                                                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
                                                )}
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent side="right" className="w-[320px] p-0 flex flex-col">
                                            <SheetHeader className="p-6 pb-4 border-b">
                                                <SheetTitle>Filtres</SheetTitle>
                                            </SheetHeader>
                                            <div className="p-6 flex-grow overflow-y-auto">
                                                {filtersContent}
                                            </div>
                                            <div className="p-6 border-t bg-gray-50 dark:bg-gray-800">
                                                {hasActiveFilters && (
                                                    <Button onClick={resetFilters} variant="outline" className="w-full mb-3">
                                                        Réinitialiser
                                                    </Button>
                                                )}
                                                <SheetClose asChild>
                                                    <Button className="w-full">
                                                        Voir les résultats ({products.total})
                                                    </Button>
                                                </SheetClose>
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </div>
                            </div>

                            <TabsContent value="products">
                                {products.data.length > 0 ? (
                                    <>
                                        <ListProduct products={products.data} />
                                        
                                        {/* Pagination */}
                                        {products.last_page > 1 && (
                                            <div className="mt-8 flex justify-center gap-2">
                                                {products.links.map((link, i) => (
                                                    <Button
                                                        key={i}
                                                        variant={link.active ? "default" : "outline"}
                                                        disabled={!link.url}
                                                        size="sm"
                                                        onClick={() => link.url && router.get(link.url)}
                                                    >
                                                        {link.label === "&laquo; Previous" ? (
                                                            <ChevronLeft className="h-4 w-4" />
                                                        ) : link.label === "Next &raquo;" ? (
                                                            <ChevronRight className="h-4 w-4" />
                                                        ) : (
                                                            link.label
                                                        )}
                                                    </Button>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Card className="text-center py-12 bg-gray-50 dark:bg-gray-800">
                                        <CardContent className="pt-6">
                                            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                {hasActiveFilters ? 'Aucun produit trouvé' : 'Aucun produit disponible'}
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                {hasActiveFilters 
                                                    ? 'Essayez de modifier vos filtres pour trouver plus de produits.'
                                                    : 'Cette boutique n\'a pas encore de produits en vente.'
                                                }
                                            </p>
                                            {hasActiveFilters && (
                                                <Button onClick={resetFilters} variant="outline" className="mt-4">
                                                    Réinitialiser les filtres
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            <TabsContent value="reviews">
                                <ShopReview shop={shop} />
                            </TabsContent>

                            <TabsContent value="about">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>À propos de {shop.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {shop.description}
                                        </p>

                                        <Separator />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-lg flex items-center gap-2">
                                                    <TrendingUp className="h-5 w-5 text-primary" />
                                                    Statistiques
                                                </h4>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                            <Calendar className="h-4 w-4" />
                                                            Membre depuis
                                                        </span>
                                                        <span className="font-medium">{formatDateShort(shop.created_at)}</span>
                                                    </div>
                                                    {shop.city && (
                                                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                                <MapPin className="h-4 w-4" />
                                                                Localisation
                                                            </span>
                                                            <span className="font-medium">{shop.city}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                            <Package className="h-4 w-4" />
                                                            Produits en vente
                                                        </span>
                                                        <span className="font-medium">{shop.products.length}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                            <Users className="h-4 w-4" />
                                                            Abonnés
                                                        </span>
                                                        <span className="font-medium">{shop.followers.length}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-lg flex items-center gap-2">
                                                    <ShieldCheck className="h-5 w-5 text-green-500" />
                                                    Garanties vendeur
                                                </h4>
                                                <div className="space-y-3">
                                                    {shop.is_approved && (
                                                        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                                                            <ShieldCheck className="h-5 w-5 text-green-600" />
                                                            <div>
                                                                <p className="font-medium text-green-700 dark:text-green-400">Boutique vérifiée</p>
                                                                <p className="text-sm text-green-600 dark:text-green-500">Identité confirmée</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                                                        <Clock className="h-5 w-5 text-blue-600" />
                                                        <div>
                                                            <p className="font-medium text-blue-700 dark:text-blue-400">Réponse rapide</p>
                                                            <p className="text-sm text-blue-600 dark:text-blue-500">Généralement sous 24h</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default Show;
