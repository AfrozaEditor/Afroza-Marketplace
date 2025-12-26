import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Heading from '@/components/heading';
import type { BreadcrumbItem, Product } from '@/types';
import { router } from '@inertiajs/react';

// Mock data pour les favoris
const mockFavorites = [
    {
        id: 1,
        name: 'Robe élégante',
        image: '/placeholder.svg',
        price: 75000,
        brand: 'Zara',
    },
    {
        id: 2,
        name: 'Chaussures de sport',
        image: '/placeholder.svg',
        price: 50000,
        brand: 'Nike',
    },
    {
        id: 3,
        name: 'Sac à main en cuir',
        image: '/placeholder.svg',
        price: 120000,
        brand: 'Louis Vuitton',
    },
];

interface Props {
    favorites: Product[];
}

function Favorites({favorites}:Props) {

    const handleAddToCart = (product: any) => {
        console.log("Yo ça marche")
    };

    const handleRemoveFromFavorites = (productId: number) => {
        console.log('Removing from favorites:', productId);
        // Logique pour supprimer des favoris
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Mes favoris',
            href: '/',
        },
    ];

    console.log(favorites)

    return (
        <AppLayout 
            // breadcrumbs={breadcrumbs}
        >
            <div className="container mx-auto p-4">
                    <div className="mb-8">
                        <Heading title="Mes Favoris" description="Retrouvez ici tous les articles que vous avez ajoutés à vos favoris."/>
                    </div>

                    {favorites.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.map((product) => (
                                <Card key={product.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="relative">
                                            <img
                                                src={product.images && product.images.length > 0
                                ? product.images[0] : 'https://placehold.co/600x400'}
                                                alt={product.name}
                                                className="w-full h-48 object-cover rounded-md mb-4"
                                            />
                                        </div>
                                        <div className="mb-2">
                                            {/* <p className="text-sm text-gray-500">{product.brand}</p> */}
                                            <p className="text-gray-600 font-semibold">{product.price} FCFA</p>
                                        </div>
                                        <div className="flex items-center justify-between space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center space-x-1 flex-1"
                                                onClick={() => handleRemoveFromFavorites(product.id)}
                                            >
                                                <Trash2 size={16} />
                                                <span>Supprimer</span>
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-primary hover:bg-secondary flex items-center space-x-1 flex-1"
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                <ShoppingCart size={16} />
                                                <span>Ajouter</span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Heart size={64} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun favori</h3>
                            <p className="text-gray-600 mb-6">Vous n'avez pas encore ajouté d'articles à vos favoris.</p>
                            <Button 
                                className="bg-primary hover:bg-secondary"
                                onClick={() => {
                                    router.get(route('products.index'));
                                }}
                            >
                                Découvrir nos produits
                            </Button>
                        </div>
                    )}
                </div>
        </AppLayout>
    );
}

export default Favorites;
