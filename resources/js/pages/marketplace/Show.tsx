import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatDateShort } from '@/lib/utils';
import { Product, Shop } from '@/types';
import { ChevronLeft, ChevronRight, Heart, MessageSquare, Share, ShoppingCart, Star, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ListProduct from '@/components/product/list-product';
import ShopReview from '@/components/review/shop-review';
import { ShopReview as Review } from '@/types';

interface Props {
    shop: Shop & {
        logo_url?: string;
        cover_image_url?: string;
        is_followed?: boolean;
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
    const [isFollowing, setIsFollowing] = useState(shop.is_followed || false);
    const averageRating = shop.reviews.length > 0 ? shop.reviews.reduce((acc, review) => acc + review.rating, 0) / shop.reviews.length : 0;

    const handleFollow = () => {
    router.post(route('shops.follow', { slug: shop.slug }), {}, {
        preserveState: false,
        preserveScroll: true,
        onSuccess: (page) => {
            // Récupérer isFollowing depuis les props flash
            const flash = page.props.flash;
            // const isFollowing = page.props.isFollowing;
            if (flash) {
                setIsFollowing(flash.isFollowing);
                toast[flash.isFollowing ? 'success' : 'info'](flash.message);
            }
            // setIsFollowing(true);

            // Afficher le message de succès
            // toast[isFollowing ? 'success' : 'info'](page.props.success);
        },
        onError: () => {
            toast.error("Une erreur est survenue");
        }
    });
};
    // const handleFollow = () => {
    //     // if (!auth.user) {
    //     //     toast.error("Vous devez être connecté pour suivre une boutique");
    //     //     return;
    //     // }
    //     // setIsFollowing(!isFollowing);
    //     // if (!isFollowing) {
    //     //     toast.success(`Vous suivez maintenant ${shop.name}`);
    //     // } else {
    //     //     toast.error(`Vous ne suivez plus ${shop.name}`);
    //     // }
    //     router.post(route('shops.follow', { slug: shop.slug }), {}, {
    //         preserveState: true,
    //         preserveScroll: true,
    //         onSuccess: (response) => {
    //             setIsFollowing(response.isFollowing);
    //             toast[response.isFollowing ? 'success' : 'info'](
    //                 response.isFollowing
    //                     ? `Vous suivez maintenant ${shop.name}`
    //                     : `Vous ne suivez plus ${shop.name}`
    //             );
    //         },
    //         onError: () => {
    //             toast.error("Une erreur est survenue");
    //         }
    //     });
    // };

    console.log(isFollowing);

    console.log(shop.logo);
    console.log(shop.cover_image);
    console.log(shop.products);

    return (
        <AppLayout>
            <div className="relative h-48 overflow-hidden md:h-64">
                <img
                    src={shop.cover_image_url}
                    alt={`${shop.name} couverture`}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>

            <div className="relative container mx-auto -mt-16 px-4 md:px-8">
                <div className="mb-8 flex flex-col gap-4 md:flex-row">
                    {/* Profile image and info */}
                    <div className="flex w-full flex-col items-center gap-4 rounded-lg bg-white p-4 shadow-md md:flex-row md:gap-6 md:p-6">
                        <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-md md:h-32 md:w-32">
                            <img
                                src={shop.logo_url}
                                alt={shop.name}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="flex-grow text-center md:text-left">
                            <div className="flex flex-col items-center justify-between gap-2 md:flex-row md:items-start">
                                <div>
                                    <h1 className="text-2xl font-bold md:text-3xl">{shop.name}</h1>
                                    <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 md:justify-start">
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <Star size={18} fill="currentColor" />
                                            <span>
                                                {/*{seller.rating}/5 ({seller.reviews} avis)*/}
                                                {averageRating}/5 ({shop.reviews.length} avis)
                                            </span>
                                        </div>
                                        <span className="text-gray-500">|</span>
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <ShoppingCart size={16} />
                                            <span>{shop.products.length} produits</span>
                                        </div>
                                        <span className="text-gray-500">|</span>
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <Users size={16} />
                                            <span>
                                                {shop.followers.length} abonnés
                                            </span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-gray-600">{shop.description}</p>
                                    <div className="mt-2 flex flex-wrap justify-center gap-1 md:justify-start">
                                        {/*{seller.categories.map(cat => (*/}
                                        {/*    <Badge key={cat} variant="outline" className="bg-gray-100">*/}
                                        {/*        {cat}*/}
                                        {/*    </Badge>*/}
                                        {/*))}*/}
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-col gap-2 md:mt-0">
                                    <Button
                                        onClick={handleFollow}
                                        variant={isFollowing ? 'default' : 'outline'}
                                        className={isFollowing ? 'bg-primary' : ''}
                                    >
                                        <Heart size={16} className="mr-2" fill={isFollowing ? 'white' : 'none'} />
                                        {isFollowing ? 'Abonné' : 'Suivre'}
                                    </Button>
                                    <div className="flex gap-2 justify-center">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                // Utilisez le router d'Inertia pour faire la requête POST
                                                // router.post(route('chat.start', { user: shop.user.id }));
                                                router.post(route('chat.start', { user: shop.user.id }), {}, {
                                                onSuccess: (page) => {
                                                    // Redirige vers la page de chat avec le paramètre conversation
                                                    if (page.props?.conversation_id) {
                                                    router.visit(route('chat.index', { conversation: page.props.conversation_id }));
                                                    } else if (page.url) {
                                                    // Si le backend fait déjà la redirection, rien à faire
                                                    window.location.href = page.url;
                                                    }
                                                }
                                                });
                                            }}

                                        >
                                            <MessageSquare size={16} />
                                            {/*<span>Contacter</span>*/}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            // onClick={handleShare}
                                        >
                                            <Share size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm text-gray-500 md:justify-start">
                                <span>Membre depuis {formatDateShort(shop.created_at)}</span>
                                <span>•</span>
                                {/*<span>{seller.location}</span>*/}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Filters sidebar - Desktop */}
                    <div className="hidden md:block md:col-span-1">
                        <div className="sticky top-24">
                            <Card className="shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg">Filtres</CardTitle>
                                        <Button variant="ghost" size="sm"
                                                // onClick={resetFilters}
                                                className="text-sm h-8 px-2"
                                        >
                                            Réinitialiser
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {/*<BoutiqueFilters {...filterProps} />*/}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="md:col-span-3">
                        <Tabs defaultValue="products">
                            <div className="flex justify-between items-center mb-6">
                                <TabsList className="grid w-full max-w-md grid-cols-3">
                                    <TabsTrigger value="products">Produits ({shop.products.length})</TabsTrigger>
                                    <TabsTrigger value="reviews">Avis ({shop.reviews.length})</TabsTrigger>
                                    <TabsTrigger value="about">À propos</TabsTrigger>
                                </TabsList>

                                <div className="flex items-center gap-2">
                                    <Select defaultValue="newest">
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Trier par" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="newest">Plus récents</SelectItem>
                                            <SelectItem value="price-asc">Prix croissant</SelectItem>
                                            <SelectItem value="price-desc">Prix décroissant</SelectItem>
                                            <SelectItem value="popular">Popularité</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* Mobile Filter Button */}
                                    {/*<Sheet */}
                                    {/*    open={showMobileFilters} onOpenChange={setShowMobileFilters}>*/}
                                    {/*    <SheetTrigger asChild>*/}
                                    {/*        <Button variant="outline" size="icon" className="md:hidden">*/}
                                    {/*            <Filter size={18} />*/}
                                    {/*        </Button>*/}
                                    {/*    </SheetTrigger>*/}
                                    {/*    <SheetContent side="right" className="w-[320px] p-0 flex flex-col">*/}
                                    {/*        <SheetHeader className="p-6 pb-4 border-b">*/}
                                    {/*            <div className="flex justify-between items-center">*/}
                                    {/*                <SheetTitle>Filtres</SheetTitle>*/}
                                    {/*                <SheetClose asChild>*/}
                                    {/*                    <Button variant="ghost" size="icon" className="rounded-full">*/}
                                    {/*                        <X size={20} />*/}
                                    {/*                    </Button>*/}
                                    {/*                </SheetClose>*/}
                                    {/*            </div>*/}
                                    {/*        </SheetHeader>*/}
                                    {/*        <div className="p-6 flex-grow overflow-y-auto">*/}
                                    {/*            <BoutiqueFilters {...filterProps} />*/}
                                    {/*        </div>*/}
                                    {/*        <div className="p-6 border-t bg-gray-50">*/}
                                    {/*            <Button onClick={resetFilters} variant="outline" className="w-full mb-3">*/}
                                    {/*                Réinitialiser*/}
                                    {/*            </Button>*/}
                                    {/*            <SheetClose asChild>*/}
                                    {/*                <Button className="w-full bg-videdressing-primary hover:bg-videdressing-secondary">*/}
                                    {/*                    Appliquer les filtres*/}
                                    {/*                </Button>*/}
                                    {/*            </SheetClose>*/}
                                    {/*        </div>*/}
                                    {/*    </SheetContent>*/}
                                    {/*</Sheet>*/}
                                </div>
                            </div>

                            <TabsContent value="products">
                                {shop.products && (
                                    <ListProduct products={products.data} />
                                )}

                                {shop.products.length === 0 && (
                                    <Card className="text-center py-12 bg-gray-50">
                                        <CardContent className="pt-6">
                                            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit disponible</h3>
                                            <p className="text-gray-500">Cette boutique n'a pas encore de produits en vente.</p>
                                        </CardContent>
                                    </Card>
                                )}
                                <div className="mt-8 flex justify-center gap-2">
                                    {products.links.map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={link.active ? "default" : "outline"}
                                            disabled={!link.url}
                                            onClick={() => {
                                                if (link.url) {
                                                    router.get(link.url);
                                                    // handlePageChange(link.url);
                                                }
                                            }}
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
                            </TabsContent>

                            <TabsContent value="reviews">
                                <ShopReview shop={shop}/>
                            </TabsContent>

                            <TabsContent value="about">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>À propos de {shop.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="mb-6 text-gray-700 leading-relaxed">{shop.description}</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-semibold mb-3 text-lg">Statistiques</h4>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Membre depuis</span>
                                                        <span className="font-medium">{formatDateShort(shop.created_at)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Localisation</span>
                                                        {/*<span className="font-medium">{shop.location}</span>*/}
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Produits en vente</span>
                                                        <span className="font-medium">{shop.products.length}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Abonnés</span>
                                                        <span className="font-medium">{shop.followers.length}</span>
                                                    </div>
                                                    {/*{seller.totalSales && (*/}
                                                    {/*    <div className="flex justify-between">*/}
                                                    {/*        <span className="text-gray-600">Ventes totales</span>*/}
                                                    {/*        <span className="font-medium text-green-600">{seller.totalSales}</span>*/}
                                                    {/*    </div>*/}
                                                    {/*)}*/}
                                                    {/*{seller.responseTime && (*/}
                                                    {/*    <div className="flex justify-between">*/}
                                                    {/*        <span className="text-gray-600">Temps de réponse</span>*/}
                                                    {/*        <span className="font-medium">{seller.responseTime}</span>*/}
                                                    {/*    </div>*/}
                                                    {/*)}*/}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-3 text-lg">Spécialités</h4>
                                                {/*<div className="flex flex-wrap gap-2">*/}
                                                {/*    {shop.categories.map(category => (*/}
                                                {/*        <Badge key={category} className="bg-videdressing-light text-videdressing-primary px-3 py-1">*/}
                                                {/*            {category}*/}
                                                {/*        </Badge>*/}
                                                {/*    ))}*/}
                                                {/*</div>*/}

                                                {/*{seller.verified && (*/}
                                                {/*    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">*/}
                                                {/*        <div className="flex items-center gap-2 text-green-700">*/}
                                                {/*            <Award size={16} />*/}
                                                {/*            <span className="font-medium">Boutique vérifiée</span>*/}
                                                {/*        </div>*/}
                                                {/*        <p className="text-sm text-green-600 mt-1">*/}
                                                {/*            Cette boutique a été vérifiée par notre équipe.*/}
                                                {/*        </p>*/}
                                                {/*    </div>*/}
                                                {/*)}*/}
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
