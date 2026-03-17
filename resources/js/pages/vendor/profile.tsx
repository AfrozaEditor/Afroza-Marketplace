import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDate, formatPrice, cn } from '@/lib/utils';
import { Product, Shop } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Award,
    CalendarDays,
    ChevronRight,
    ExternalLink,
    Globe,
    Heart,
    MapPin,
    MessageCircle,
    Package,
    Phone,
    ShoppingBag,
    Star,
    Store,
    TrendingUp,
    Users,
} from 'lucide-react';

interface VendorInfo {
    id: number;
    name: string;
    avatar?: string;
    created_at: string;
}

interface Props {
    vendor: VendorInfo;
    badge: string | null;
    shop: Shop | null;
    products: Product[];
}

function VendorProfile({ vendor, badge, shop, products }: Props) {
    const shopRating = shop?.reviews && shop.reviews.length > 0
        ? (shop.reviews.reduce((acc, r) => acc + r.rating, 0) / shop.reviews.length).toFixed(1)
        : null;

    const totalReviews = shop?.reviews?.length || 0;
    const memberSince = formatDate(vendor.created_at);

    return (
        <AppLayout>
            <Head title={`${vendor.name} - Profil vendeur`} />

            {/* Hero / Couverture */}
            <div className="relative h-40 sm:h-52 md:h-64 overflow-hidden">
                {shop?.cover_url ? (
                    <img
                        src={shop.cover_url}
                        alt="Couverture"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary via-primary/70 to-primary/40" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                {/* Carte profil flottante */}
                <div className="relative -mt-20 sm:-mt-24 mb-8 z-10">
                    <Card className="border-0 shadow-xl">
                        <CardContent className="p-5 sm:p-6">
                            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                                {/* Avatar */}
                                <div className="shrink-0 -mt-14 sm:-mt-16">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                                        {vendor?.avatar ? (
                                            <img src={vendor.avatar} alt={vendor.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-white text-4xl sm:text-5xl font-bold">
                                                {vendor.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Infos principales */}
                                <div className="flex-1 text-center sm:text-left min-w-0">
                                    <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate">
                                            {vendor.name}
                                        </h1>
                                        {badge && (
                                            <Badge className={cn(
                                                "text-xs font-semibold px-2.5 py-0.5 shrink-0",
                                                badge === 'Enterprise'
                                                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-sm shadow-amber-200'
                                                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-sm shadow-blue-200'
                                            )}>
                                                <Award className="h-3 w-3 mr-1" />
                                                {badge}
                                            </Badge>
                                        )}
                                    </div>

                                    {shop ? (
                                        <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center sm:justify-start gap-1.5 text-sm">
                                            <Store className="h-3.5 w-3.5 shrink-0" />
                                            <span className="truncate">{shop.name}</span>
                                            {shop.city && (
                                                <>
                                                    <span className="text-gray-300 dark:text-gray-600">·</span>
                                                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                    <span className="truncate">{shop.city}</span>
                                                </>
                                            )}
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center sm:justify-start gap-1.5 text-sm">
                                            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                                            Membre depuis {memberSince}
                                        </p>
                                    )}

                                    {/* Mini stats inline */}
                                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Package className="h-4 w-4" />
                                            <strong className="text-gray-900 dark:text-white">{products.length}</strong> produits
                                        </span>
                                        {totalReviews > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                <strong className="text-gray-900 dark:text-white">{shopRating}</strong>
                                                <span>({totalReviews} avis)</span>
                                            </span>
                                        )}
                                        {shop?.followers && shop.followers.length > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                <strong className="text-gray-900 dark:text-white">{shop.followers.length}</strong> abonnés
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Boutons actions */}
                                <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto"
                                        onClick={() => router.post(route('chat.start', { user: vendor.id }))}
                                    >
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Contacter
                                    </Button>
                                    {shop && (
                                        <Button className="w-full sm:w-auto" asChild>
                                            <Link href={route('marketplace.show', { marketplace: shop.slug })}>
                                                <Store className="h-4 w-4 mr-2" />
                                                Voir la boutique
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className={cn("grid gap-6 mb-12", shop ? "lg:grid-cols-3" : "lg:grid-cols-1")}>
                    {/* Colonne gauche - Infos vendeur (visible si boutique) */}
                    {shop && (
                        <div className="lg:col-span-1 space-y-6">
                            {/* À propos */}
                            {shop.description && (
                                <Card>
                                    <CardContent className="p-5">
                                        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">À propos</h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {shop.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Infos de contact */}
                            {(shop.address || shop.city || shop.phone || shop.email || shop.website) && (
                                <Card>
                                    <CardContent className="p-5 space-y-3">
                                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Informations</h2>
                                        {(shop.address || shop.city) && (
                                            <div className="flex items-start gap-3 text-sm">
                                                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {[shop.address, shop.city].filter(Boolean).join(', ')}
                                                </span>
                                            </div>
                                        )}
                                        {shop.phone && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                                                <span className="text-gray-600 dark:text-gray-400">{shop.phone}</span>
                                            </div>
                                        )}
                                        {shop.website && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <Globe className="h-4 w-4 text-gray-400 shrink-0" />
                                                <a href={shop.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                                    Site web <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Statistiques détaillées */}
                            <Card>
                                <CardContent className="p-5 space-y-4">
                                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">Statistiques</h2>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-2 text-gray-500">
                                                <Package className="h-4 w-4" /> Produits
                                            </span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{products.length}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-2 text-gray-500">
                                                <Star className="h-4 w-4" /> Note moyenne
                                            </span>
                                            <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                                                {shopRating ? (
                                                    <>
                                                        {shopRating}
                                                        <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                                                    </>
                                                ) : (
                                                    'Aucun avis'
                                                )}
                                            </span>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-2 text-gray-500">
                                                <ShoppingBag className="h-4 w-4" /> Avis reçus
                                            </span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{totalReviews}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-2 text-gray-500">
                                                <CalendarDays className="h-4 w-4" /> Membre depuis
                                            </span>
                                            <span className="font-semibold text-gray-900 dark:text-white text-xs">{memberSince}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Colonne droite (ou pleine largeur sans boutique) - Produits */}
                    <div className={shop ? "lg:col-span-2" : "lg:col-span-1"}>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Produits de {vendor.name}
                            </h2>
                            {shop && (
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={route('marketplace.show', { marketplace: shop.slug })}>
                                        Tout voir
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Link>
                                </Button>
                            )}
                        </div>

                        {products.length > 0 ? (
                            <div className={cn(
                                "grid gap-4",
                                shop
                                    ? "grid-cols-2 md:grid-cols-3"
                                    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                            )}>
                                {products.map((product) => {
                                    const productRating = product.reviews && product.reviews.length > 0
                                        ? (product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length).toFixed(1)
                                        : null;

                                    return (
                                        <Link
                                            key={product.id}
                                            href={route('products.show', { product: product.slug })}
                                            className="group"
                                        >
                                            <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                                                <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                                                    {Array.isArray(product.images) && product.images.length > 0 ? (
                                                        <img
                                                            src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                                                            <Package className="h-10 w-10" />
                                                        </div>
                                                    )}
                                                    {product.is_favorite && (
                                                        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
                                                            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
                                                        </div>
                                                    )}
                                                </div>
                                                <CardContent className="p-3">
                                                    <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">
                                                        {product.name}
                                                    </h3>
                                                    <div className="flex items-center justify-between mt-1.5">
                                                        <p className="text-primary font-bold text-sm">
                                                            {formatPrice(product.price)}
                                                        </p>
                                                        {productRating && (
                                                            <span className="flex items-center gap-0.5 text-xs text-gray-500">
                                                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                                                {productRating}
                                                            </span>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <Card className="border-dashed">
                                <CardContent className="py-16 text-center">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                                        <Package className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 font-medium">Aucun produit pour le moment</p>
                                    <p className="text-gray-400 text-sm mt-1">Ce vendeur n'a pas encore ajouté de produits.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default VendorProfile;
