import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Heart,
    MessageCircle,
    Minus,
    Plus,
    ShoppingCart,
    Share2,
    Shield,
    Truck,
    RotateCcw,
    Star,
    Flag,
    ChevronRight,
    Package,
    Store,
    User
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link, router } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import { Product } from '@/types';
import ProductReview from '@/components/review/product-review';
import { toast } from 'sonner';
import { ReportDialog } from '@/components/report/report-dialog';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface Props {
    product: Product & {
        is_favorite?: boolean;
    };
    images: string[];
    vendorBadge?: string | null;
}

function Show({product, images, vendorBadge}:Props) {
    const [quantity, setQuantity] = useState(1);
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);
    const [isFavorite, setIsFavorite] = useState(product.is_favorite || false);

    const handleQuantityChange = (amount: number) => {
        const newQuantity = quantity + amount;
        if (newQuantity >= 1 && newQuantity <= product.quantity) {
            setQuantity(newQuantity);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1 && value <= product.quantity) {
            setQuantity(value);
        }
    };

    const handleAddToCart = () => {
        router.post(route('cart.store'), {
            product_id: product.id,
            quantity: quantity
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Produit ajouté au panier');
            }
        });
    };

    const handleFavorite = () => {
        router.post(route('products.favorite', { slug: product.slug }), {}, {
            preserveState: false,
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
                    title: product.name,
                    text: product.description,
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

    const plugin = React.useRef(
        Autoplay({delay: 5000, stopOnInteraction: true})
    );

    useEffect(() => {
        if (!api) return;
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    const goToSlide = useCallback((index: number) => {
        if (api) api.scrollTo(index);
    }, [api]);

    const rating = product.reviews.length > 0 
        ? (product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length).toFixed(1)
        : '0';

    return (
        <AppLayout>
            {/* Breadcrumb */}
            <div className="bg-gray-50 dark:bg-gray-900 border-b">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-primary">Accueil</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/products" className="hover:text-primary">Produits</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href={`/products?category=${product.category.id}`} className="hover:text-primary">
                            {product.category.name}
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-gray-900 dark:text-white font-medium truncate max-w-48">
                            {product.name}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Galerie d'images */}
                        <div className="space-y-4">
                            <div className="relative">
                                <Carousel
                                    setApi={setApi}
                                    plugins={[plugin.current]}
                                    opts={{ align: "start", loop: true }}
                                    className="w-full"
                                >
                                    <CarouselContent>
                                        {images.map((image, index) => (
                                            <CarouselItem key={index}>
                                                <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
                                                    <img
                                                        src={image}
                                                        alt={`${product.name} - image ${index + 1}`}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="left-4 h-10 w-10" />
                                    <CarouselNext className="right-4 h-10 w-10" />
                                </Carousel>
                                
                                {/* Indicateur de position */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                                    {current} / {count}
                                </div>
                            </div>
                            
                            {/* Miniatures */}
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        className={cn(
                                            "aspect-square w-20 shrink-0 rounded-lg overflow-hidden transition-all",
                                            current - 1 === index 
                                                ? 'ring-2 ring-primary ring-offset-2' 
                                                : 'opacity-60 hover:opacity-100'
                                        )}
                                        onClick={() => goToSlide(index)}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} - vue ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Informations produit */}
                        <div className="space-y-6">
                            {/* En-tête */}
                            <div>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <Badge variant="outline" className="mb-2">
                                            {product.category.name}
                                        </Badge>
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                            {product.name}
                                        </h1>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleShare}
                                            className="rounded-full"
                                        >
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant={isFavorite ? "default" : "outline"}
                                            size="icon"
                                            onClick={handleFavorite}
                                            className={cn("rounded-full", isFavorite && "bg-red-500 hover:bg-red-600")}
                                        >
                                            <Heart className="h-4 w-4" fill={isFavorite ? 'white' : 'none'} />
                                        </Button>
                                    </div>
                                </div>
                                
                                {/* Rating */}
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={cn(
                                                    "h-5 w-5",
                                                    star <= Math.round(parseFloat(rating))
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-300"
                                                )}
                                            />
                                        ))}
                                        <span className="ml-2 font-medium">{rating}</span>
                                    </div>
                                    <span className="text-gray-500">
                                        ({product.reviews.length} avis)
                                    </span>
                                </div>
                            </div>

                            {/* Prix */}
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-primary">
                                        {product.price.toLocaleString()} FCFA
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    Livraison calculée à la caisse
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Stock */}
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-green-500" />
                                <span className={cn(
                                    "font-medium",
                                    product.quantity > 5 ? "text-green-600" : product.quantity > 0 ? "text-orange-500" : "text-red-500"
                                )}>
                                    {product.quantity > 5 
                                        ? `${product.quantity} en stock` 
                                        : product.quantity > 0 
                                            ? `Plus que ${product.quantity} en stock !`
                                            : 'Rupture de stock'}
                                </span>
                            </div>

                            <Separator />

                            {/* Quantité et boutons */}
                            <div className="space-y-4">
                                <div>
                                    <label className="font-medium text-gray-900 dark:text-white mb-2 block">
                                        Quantité
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            onClick={() => handleQuantityChange(-1)} 
                                            disabled={quantity <= 1}
                                            className="h-10 w-10 rounded-full"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <Input
                                            type="number"
                                            value={quantity}
                                            onChange={handleInputChange}
                                            min={1}
                                            max={product.quantity}
                                            className="w-20 text-center"
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleQuantityChange(1)}
                                            disabled={quantity >= product.quantity}
                                            className="h-10 w-10 rounded-full"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        className="flex-1 h-12 text-base"
                                        onClick={handleAddToCart}
                                        disabled={product.quantity === 0}
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        Ajouter au panier
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12 text-base"
                                        onClick={() => {
                                            router.post(route('chat.start', { user: product.user.id }), {
                                                product_id: product.id,
                                            });
                                        }}
                                    >
                                        <MessageCircle className="mr-2 h-5 w-5" />
                                        Contacter le vendeur
                                    </Button>
                                </div>
                            </div>

                            {/* Garanties */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                        <Shield className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Paiement sécurisé</p>
                                        <p className="text-gray-500 text-xs">100% sécurisé</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <Truck className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Livraison rapide</p>
                                        <p className="text-gray-500 text-xs">2-5 jours ouvrés</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                        <RotateCcw className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Retours faciles</p>
                                        <p className="text-gray-500 text-xs">14 jours</p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Vendeur */}
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <Link
                                            href={route('vendor.profile', { id: product.user.id })}
                                            className="flex items-center gap-3 group"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold">
                                                {product.shop?.name?.charAt(0) || product.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                                        {product.user.name}
                                                    </p>
                                                    {vendorBadge && (
                                                        <Badge className={cn(
                                                            "text-xs",
                                                            vendorBadge === 'Enterprise'
                                                                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0'
                                                                : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0'
                                                        )}>
                                                            {vendorBadge}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Store className="h-3.5 w-3.5" />
                                                    <span>{product.shop?.name || 'Vendeur vérifié'}</span>
                                                </div>
                                            </div>
                                        </Link>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('vendor.profile', { id: product.user.id })}>
                                                    <User className="h-4 w-4 mr-1" />
                                                    Voir le profil
                                                </Link>
                                            </Button>
                                            {product.shop && (
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={route('marketplace.show', { marketplace: product.shop.slug })}>
                                                        <Store className="h-4 w-4 mr-1" />
                                                        Boutique
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions secondaires */}
                            <div className="flex items-center justify-center">
                                <ReportDialog 
                                    type="product" 
                                    targetId={product.id} 
                                    targetName={product.name}
                                    trigger={
                                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                                            <Flag className="h-4 w-4 mr-2" />
                                            Signaler ce produit
                                        </Button>
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section avis */}
                    <div className="mt-12 pt-8 border-t">
                        <ProductReview product={product} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default Show;
