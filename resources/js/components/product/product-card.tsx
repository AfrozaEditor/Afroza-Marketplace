import { Link } from '@inertiajs/react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/types';

interface Props {
    product: Product;
}

function ProductCard({product}: Props) {

    const handleAddToCart = () => {

    }

    return (
        <div
            className={`transform transition-all duration-500
            //     // ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            // }
            `}
        >
            <Link href={route('products.show', product.slug)} className="block">
                <Card className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 pt-0">
                    <div className="relative h-48 overflow-hidden group">
                        <img
                            src="../../../../public/favicon.ico"
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                className="bg-white p-2 rounded-full text-teal-500 hover:text-teal-700 transition-colors shadow-md"
                                onClick={(e) => {
                                    e.preventDefault();
                                    // Add to wishlist logic
                                }}
                            >
                                <Heart size={20} />
                            </Button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <div className="flex items-center text-white">
                                <Star className="text-yellow-400" size={16} />
                                <span className="ml-1">0</span>
                                <span className="mx-1">•</span>
                                <span>0 reviews</span>
                            </div>
                        </div>
                    </div>
                    <CardHeader>
                        <CardTitle>{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between">
                        <div className="flex flex-col">
                            <span className="font-bold text-teal-600">{product.price} FCFA</span>
                            <span className="text-xs text-gray-500">
                                {/* {Math.round(12 * 0.8).toLocaleString()} XAF with code */}
                                PAR {product.user.name}
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
