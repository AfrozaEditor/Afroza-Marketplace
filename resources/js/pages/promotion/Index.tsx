import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { HeroSection } from '@/components/hero-section';
import { addDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Clock, Percent, Tag } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';


const today = new Date();

const promotions = [
    {
        id: 1,
        title: 'Soldes d\'été',
        discount: '30%',
        description: 'Profitez de 30% de réduction sur tous les articles d\'été.',
        endDate: addDays(today, 7),
        category: 'seasonal',
        image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db',
        code: 'ETE30'
    },
    {
        id: 2,
        title: 'Offre flash du weekend',
        discount: '25%',
        description: 'Offre limitée de 48h sur une sélection d\'articles.',
        endDate: addDays(today, 2),
        category: 'flash',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da',
        code: 'FLASH25'
    },
    {
        id: 3,
        title: 'Première commande',
        discount: '15%',
        description: 'Réduction pour votre première commande sur notre site.',
        endDate: addDays(today, 30),
        category: 'new',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d',
        code: 'BIENVENUE15'
    },
    {
        id: 4,
        title: 'Offre de parrainage',
        discount: '10€',
        description: 'Parrainez un ami et recevez 10€ de réduction sur votre prochaine commande.',
        endDate: addDays(today, 60),
        category: 'referral',
        image: 'https://images.unsplash.com/photo-1565462905102-140e712045aa',
        code: 'PARRAIN10'
    },
    {
        id: 5,
        title: 'Vente privée',
        discount: '40%',
        description: 'Accès exclusif à notre vente privée avec jusqu\'à 40% de réduction.',
        endDate: addDays(today, 5),
        category: 'exclusive',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
        code: 'PRIVE40'
    },
    {
        id: 6,
        title: 'Offre de fidélité',
        discount: '20%',
        description: 'Merci pour votre fidélité ! Profitez de 20% sur votre prochaine commande.',
        endDate: addDays(today, 14),
        category: 'loyalty',
        image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df',
        code: 'FIDELE20'
    }
];

function Index() {
    const [activeTab, setActiveTab] = useState('all');
    const filterPromotions = (category) => {
        if (category === 'all') return promotions;
        return promotions.filter(promo => promo.category === category);
    };

    const calculateDaysLeft = (endDate) => {
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <AppLayout>
            <Head title="Promotions"/>
            <HeroSection
                className="bg-gradient-to-r from-primary to-white text-black max-h-3xl"
                title="Offres spéciales et réductions"
                description="Découvrez nos meilleures offres du moment et économisez sur vos achats de vêtements d'occasion."
            />
            {/* Featured promotion */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="bg-primary rounded-2xl overflow-hidden">
                        <div className="grid md:grid-cols-2">
                            <div className="p-8 md:p-12 flex flex-col justify-center text-white">
                                <Badge className="self-start mb-4 bg-white text-primary">
                                    Offre exclusive
                                </Badge>
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">Soldes d'été</h2>
                                <p className="text-lg mb-6 text-white/90">
                                    Profitez de 30% de réduction sur tous les articles d'été. Offre valable jusqu'au {formatDate(addDays(today, 7))}.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                                    <Button className="bg-white text-primary hover:bg-gray-100">
                                        En profiter maintenant
                                    </Button>
                                    <div className="flex items-center justify-center bg-white/20 rounded-md px-4">
                                        <span className="font-mono font-bold mr-2">ETE30</span>
                                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/30 ml-2">
                                            Copier
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <img
                                    src="https://images.unsplash.com/photo-1607083206968-13611e3d76db"
                                    alt="Soldes d'été"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Promotions list */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="mb-8">
                        <Tabs defaultValue="all" onValueChange={setActiveTab}>
                            <TabsList className="bg-white">
                                <TabsTrigger value="all">Toutes les offres</TabsTrigger>
                                <TabsTrigger value="flash">Offres flash</TabsTrigger>
                                <TabsTrigger value="seasonal">Saisonnières</TabsTrigger>
                                <TabsTrigger value="exclusive">Exclusives</TabsTrigger>
                                <TabsTrigger value="new">Nouveaux clients</TabsTrigger>
                            </TabsList>
                            <TabsContent value="all" className="mt-8">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filterPromotions(activeTab).map((promo) => (
                                        <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                            <div className="h-48 overflow-hidden">
                                                <img
                                                    src={promo.image}
                                                    alt={promo.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <CardTitle className="text-xl">{promo.title}</CardTitle>
                                                    <Badge className="bg-primary text-white">
                                                        -{promo.discount}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-600 mb-4">{promo.description}</p>
                                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                                    <Clock size={16} className="mr-2" />
                                                    <p className="text-gray-500 text-sm mb-2">Expire le {formatDate(promo.endDate)}</p>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Tag size={16} className="mr-2" />
                                                    <span className="font-mono font-medium">{promo.code}</span>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="flex justify-between">
                                                <div className="text-sm">
                          <span className="font-medium text-primary">
                            {calculateDaysLeft(promo.endDate)} jours restants
                          </span>
                                                </div>
                                                <Button variant="ghost" className="text-primary hover:text-secondary">
                                                    Utiliser <ArrowRight size={16} className="ml-1" />
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="flash">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                                    {filterPromotions('flash').map((promo) => (
                                        <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                            {/* Same card content as above */}
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="seasonal">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                                    {filterPromotions('seasonal').map((promo) => (
                                        <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                            {/* Same card content as above */}
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="exclusive">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                                    {filterPromotions('exclusive').map((promo) => (
                                        <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                            {/* Same card content as above */}
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="new">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                                    {filterPromotions('new').map((promo) => (
                                        <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                            {/* Same card content as above */}
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </section>

            {/* How to use promotions */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Comment utiliser nos codes promo</h2>
                        <p className="text-gray-600">
                            Suivez ces étapes simples pour profiter de nos offres promotionnelles lors de vos achats.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-light rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Percent className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">1. Choisissez une offre</h3>
                            <p className="text-gray-600">
                                Parcourez nos promotions et sélectionnez celle qui correspond à vos besoins.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-light rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Tag className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">2. Copiez le code</h3>
                            <p className="text-gray-600">
                                Cliquez sur "Copier" pour enregistrer le code promo dans votre presse-papiers.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-light rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <ArrowRight className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">3. Appliquez le code</h3>
                            <p className="text-gray-600">
                                Collez le code dans le champ prévu lors du paiement pour bénéficier de la réduction.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">Ne manquez aucune promotion</h2>
                        <p className="text-gray-600 mb-8">
                            Inscrivez-vous à notre newsletter pour recevoir en avant-première nos offres exclusives et codes promo.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Input
                                type="email"
                                placeholder="Votre adresse email"
                                className="flex-grow py-[8px] rounded-md border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                            <Button className="bg-primary hover:bg-secondary text-white">
                                S'inscrire
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}

export default Index;
