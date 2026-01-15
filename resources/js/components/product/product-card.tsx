import { Link, router } from '@inertiajs/react';
import { Heart, ShoppingCart, Star, MapPin, Clock } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Props {
    product: Product & {
        is_favorite?: boolean;
    };
    viewMode?: 'grid' | 'list';
}

function ProductCard({product, viewMode = 'grid'}: Props) {
    const [isFavorite, setIsFavorite] = useState(product.is_favorite || false);
    
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(route('products.favorite', { slug: product.slug }), {}, {
            preserveState: false,
            preserveScroll: true,
            onSuccess: (page) => {
                const flash = page.props.flash;
                if (flash) {
                    setIsFavorite(flash.isFavorite);
                    toast[flash.isFavorite ? 'success' : 'info'](flash.message);
                }
            },
            onError: () => {
                toast.error("Une erreur est survenue");
            }
        });
    };

    const rating = product.reviews.length > 0 
        ? (product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length).toFixed(1)
        : '0';

    // Vue Liste
    if (viewMode === 'list') {
        return (
            <Link href={route('products.show', product.slug)} className="block">
                <Card className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="flex flex-col sm:flex-row">
                        {/* Image */}
                        <div className="relative w-full sm:w-48 md:w-56 h-48 sm:h-auto shrink-0 overflow-hidden">
                            <img
                                src={product.images && product.images.length > 0
                                    ? product.images[0] : 'https://placehold.co/600x400'}
                                alt={product.name}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <Button
                                onClick={handleFavorite}
                                size="icon"
                                className={cn(
                                    "absolute top-3 right-3 rounded-full shadow-md transition-all",
                                    isFavorite 
                                        ? 'bg-primary text-white hover:bg-primary/90' 
                                        : 'bg-white/90 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 hover:bg-white'
                                )}
                            >
                                <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                            </Button>
                            {product.category && (
                                <Badge className="absolute bottom-3 left-3 bg-black/70 text-white text-xs">
                                    {product.category.name}
                                </Badge>
                            )}
                        </div>
                        
                        {/* Contenu */}
                        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                            <div>
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>
                                    <span className="font-bold text-xl text-primary whitespace-nowrap">
                                        {product.price.toLocaleString()} FCFA
                                    </span>
                                </div>
                                
                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                                    {product.description}
                                </p>
                                
                                {/* Infos */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                        <span className="font-medium text-gray-700 dark:text-gray-300">{rating}</span>
                                        <span>({product.reviews.length} avis)</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>Par {product.user.name}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-white text-xs font-semibold">
                                        {product.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {product.shop?.name || product.user.name}
                                    </span>
                                </div>
                                <Button
                                    onClick={handleAddToCart}
                                    size="sm"
                                    className="bg-primary hover:bg-primary/90 text-white gap-2"
                                >
                                    <ShoppingCart size={16} />
                                    Ajouter
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </Link>
        );
    }

    // Vue Grille (défaut)
    return (
        <div className="transform transition-all duration-500">
            <Link href={route('products.show', product.slug)} className="block">
                <Card className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 pt-0 group h-full flex flex-col">
                    <div className="relative h-52 overflow-hidden">
                        <img
                            src={product.images && product.images.length > 0
                                ? product.images[0] : 'https://placehold.co/600x400'}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Badge catégorie */}
                        {product.category && (
                            <Badge className="absolute top-3 left-3 bg-black/70 text-white text-xs">
                                {product.category.name}
                            </Badge>
                        )}
                        {/* Bouton favori */}
                        <Button
                            onClick={handleFavorite}
                            size="icon"
                            className={cn(
                                "absolute top-3 right-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all",
                                isFavorite 
                                    ? 'bg-primary text-white hover:bg-primary/90 opacity-100' 
                                    : 'bg-white/90 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 hover:bg-white'
                            )}
                        >
                            <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                        </Button>
                        {/* Overlay avec rating */}
                        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <div className="flex items-center text-white text-sm">
                                <Star className="text-yellow-400 fill-yellow-400" size={14} />
                                <span className="ml-1 font-medium">{rating}</span>
                                <span className="mx-1.5">•</span>
                                <span>{product.reviews.length} avis</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                            {product.name}
                        </h3>
                        
                        <div className="mt-auto flex items-end justify-between">
                            <div className="flex flex-col">
                                <span className="font-bold text-primary text-lg">
                                    {product.price.toLocaleString()} FCFA
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Par {product.user.name}
                                </span>
                            </div>
                            <Button
                                onClick={handleAddToCart}
                                size="icon"
                                className="bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full transition-all"
                            >
                                <ShoppingCart size={18} />
                            </Button>
                        </div>
                    </div>
                </Card>
            </Link>
        </div>
    );
}

export default ProductCard;
