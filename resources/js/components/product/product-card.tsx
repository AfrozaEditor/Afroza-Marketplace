import { Link, router } from '@inertiajs/react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/types';
import { toast } from 'sonner';

interface Props {
    product: Product & {
        is_favorite?: boolean;
    };
}

function ProductCard({product}: Props) {
    const [isFavorite, setIsFavorite] = useState(product.is_favorite || false);
    
    const handleAddToCart = () => {

    }

    const handleFavorite = () => {
        router.post(route('products.favorite', { slug: product.slug }), {}, {
            preserveState: false,
            preserveScroll: true,
            onSuccess: (page) => {
                // Récupérer isFollowing depuis les props flash
                const flash = page.props.flash;
                // const isFollowing = page.props.isFollowing;
                if (flash) {
                    setIsFavorite(flash.isFavorite);
                    toast[flash.isFavorite ? 'success' : 'info'](flash.message);
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


    return (
        <div
            className={`transform transition-all duration-500
            //     // ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            // }
            `}
        >
            <Link href={route('products.show', product.slug)} className="block">
                <Card className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 pt-0">
                    <div className="relative h-48 overflow-hidden group">
                        <img
                            src={product.images && product.images.length > 0
                                ? product.images[0] : 'https://placehold.co/600x400'}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                // className="bg-white p-2 rounded-full text-teal-primary hover:text-teal-secondary transition-colors shadow-md"
                                onClick={handleFavorite}
                                className={isFavorite ? 'bg-primary p-2 rounded-full text-teal-primary hover:text-teal-secondary transition-colors shadow-md' : 'bg-white dark:bg-neutral-700 p-2 rounded-full text-teal-primary hover:text-teal-secondary transition-colors shadow-md'}

                            >
                                <Heart size={20} />
                            </Button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <div className="flex items-center text-white">
                                <Star className="text-yellow-400" size={16} />
                                <span className="ml-1">{product.reviews.length > 0 ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length : 0}</span>
                                <span className="mx-1">•</span>
                                <span>{product.reviews.length} Avis</span>
                            </div>
                        </div>
                    </div>
                    <CardHeader>
                        <CardTitle className='text-xl dark:text-white'>{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between">
                        <div className="flex flex-col">
                            <span className="font-bold text-teal-600 text-xl">{product.price} FCFA</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {/* {Math.round(12 * 0.8).toLocaleString()} XAF with code */}
                                PAR {product.user.name.toUpperCase()}
                            </span>
                        </div>
                        <Button
                            className="bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600 transition-colors transform hover:scale-105 active:scale-95"
                        >
                            <ShoppingCart size={18} />
                        </Button>
                    </CardContent>
                    {/*<div className="p-4">*/}
                    {/*    <h3 className="font-medium mb-2 text-gray-800 line-clamp-2">Essai</h3>*/}
                    {/*    <div className="flex justify-between items-center">*/}
                    {/*        <div className="flex flex-col">*/}
                    {/*            <span className="font-bold text-teal-600">XAF 0</span>*/}
                    {/*            <span className="text-xs text-gray-500">*/}
                    {/*                {Math.round(12 * 0.8).toLocaleString()} XAF with code*/}
                    {/*            </span>*/}
                    {/*        </div>*/}
                    {/*        <Button*/}
                    {/*            className="bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600 transition-colors transform hover:scale-105 active:scale-95"*/}
                    {/*        >*/}
                    {/*            <ShoppingCart size={18} />*/}
                    {/*        </Button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </Card>
            </Link>
        </div>
    );
}

export default ProductCard;
