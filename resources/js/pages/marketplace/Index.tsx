import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { HeroSection } from '@/components/hero-section';
import { Button } from '@/components/ui/button';
import { Shop } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Star, Users } from 'lucide-react';

interface Props {
    shops: Shop[];
}

function Index({shops}: Props) {
    return (
        <AppLayout>
            <Head title="Marketplace"/>
            <HeroSection
                className="bg-gradient-to-r from-primary to-white text-black max-h-3xl"
                title="Marketplace"
                description="Découvrez les meilleures boutiques de seconde main et connectez-vous directement avec les vendeurs."
                buttons={{
                    primary: {
                        text: "Commencer à vendre",
                        href: route('marketplace.create'),
                    },
                    secondary: {
                        text: "Découvrir les boutiques",
                        href: "/products",
                    },
                }}
            />
            <div className="container p-4">

                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Boutiques ({shops.length})</h2>
                    <div className="text-sm text-gray-500">
                        {shops.length} résultats
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {shops.map(shop => (
                        <Card key={shop.id} className="overflow-hidden hover:shadow-lg transition-all">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    // src={shop.image}
                                    alt={shop.name}
                                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                                />
                                {/*{shop.featured && (*/}
                                {/*    <Badge className="absolute top-2 right-2 bg-videdressing-accent">*/}
                                {/*        En vedette*/}
                                {/*    </Badge>*/}
                                {/*)}*/}
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle>{shop.name}</CardTitle>
                                <div className="flex items-center gap-1 text-amber-500">
                                    <Star size={16} fill="currentColor" />
                                    {/*<span>{seller.rating}/5</span>*/}
                                    <span>5/5</span>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <p className="text-sm text-gray-600 line-clamp-2">{shop.description}</p>
                                <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span className="flex items-center gap-1">
                          <ShoppingCart size={14} /> {shop.products.length}
                        </span>
                                    <span className="flex items-center gap-1">
                          <Users size={14} /> {100}
                        </span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link
                                    href={route('marketplace.show', shop.slug)}
                                    className="w-full"
                                >
                                    <Button
                                        className="w-full bg-primary hover:bg-primary/80"
                                    >
                                        Visiter la boutique
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

            <div className="bg-primary/50 rounded-xl p-6 md:p-8 my-12">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Vendez sur notre marketplace</h2>
                        <p className="text-gray-700 mb-6">Rejoignez des milliers de vendeurs et donnez une seconde vie à vos vêtements et accessoires. C'est simple, rapide et écologique.</p>
                        <div className="flex flex-wrap gap-3">
                            <Button className="bg-accent hover:bg-accent/90">
                                Ouvrir ma boutique
                            </Button>
                            <Button variant="outline" className="border-videdressing-primary text-videdressing-primary">
                                En savoir plus
                            </Button>
                        </div>
                    </div>
                    <div className="md:w-1/3">
                        <img
                            src="https://source.unsplash.com/Sw7nYNqZyYI"
                            alt="Devenir vendeur"
                            className="rounded-lg shadow-md"
                        />
                    </div>
                </div>
            </div>
            {/* FAQ Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">Questions fréquentes</h2>

                <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-2">Comment devenir vendeur ?</h3>
                        <p className="text-gray-600">Pour devenir vendeur, créez un compte, puis complétez votre profil vendeur avec vos informations et préférences de paiement. Une fois approuvé, vous pourrez commencer à publier des articles.</p>
                    </div>

                    <div className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-2">Quelles sont les commissions ?</h3>
                        <p className="text-gray-600">Nous appliquons une commission de 10% sur chaque vente. Les frais de livraison sont à la charge de l'acheteur, sauf si vous proposez la livraison gratuite.</p>
                    </div>

                    <div className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-2">Comment sont gérés les retours ?</h3>
                        <p className="text-gray-600">Les acheteurs ont 14 jours pour demander un retour si l'article ne correspond pas à la description. Les frais de retour sont à la charge de l'acheteur, sauf si l'article est défectueux.</p>
                    </div>
                </div>
            </div>
            </div>
        </AppLayout>
    );
}

export default Index;
