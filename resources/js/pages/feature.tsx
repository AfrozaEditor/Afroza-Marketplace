import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { ChevronRight, Cloud, Lock, Server, Shield, Smartphone, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeroSection } from '@/components/hero-section';

function Feature() {

    const features = [
        {
            icon: <Shield className="h-10 w-10 text-primary" />,
            title: 'Sécurité garantie',
            description: 'Protection des paiements et authentification des produits de luxe pour une expérience d\'achat sécurisée.',
            badge: 'Premium'
        },
        {
            icon: <Smartphone className="h-10 w-10 text-primary" />,
            title: 'Application mobile',
            description: 'Achetez et vendez où que vous soyez avec notre application disponible sur iOS et Android.',
            badge: null
        },
        {
            icon: <Lock className="h-10 w-10 text-primary" />,
            title: 'Protection des données',
            description: 'Vos informations personnelles sont protégées conformément aux normes RGPD.',
            badge: null
        },
        {
            icon: <Zap className="h-10 w-10 text-primary" />,
            title: 'Ventes rapides',
            description: 'Algorithme intelligent qui met en relation acheteurs et vendeurs pour des transactions plus rapides.',
            badge: 'Nouveau'
        },
        {
            icon: <Server className="h-10 w-10 text-primary" />,
            title: 'Inventaire intelligent',
            description: 'Gestion automatisée de votre inventaire avec notifications de stock faible et suggestions de prix.',
            badge: 'Pro'
        },
        {
            icon: <Cloud className="h-10 w-10 text-primary" />,
            title: 'Sauvegarde dans le cloud',
            description: 'Accédez à votre historique de vente et d\'achat depuis n\'importe quel appareil.',
            badge: null
        },
    ];


    return (
        <AppLayout>
            <HeroSection className="bg-gradient-to-r from-primary to-white mx-auto text-red mb-10"
                         title="Des outils puissants pour vendre vos vêtements"
                         description="Découvrez comment notre plateforme rend la vente et l'achat de vêtements simples, sécurisés et amusants."
            />
            <section className="bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow duration-300">
                                <CardHeader className="pb-2">
                                    <div className="mb-4">
                                        {feature.icon}
                                    </div>
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                                        {feature.badge && (
                                            <Badge className="bg-videdressing-secondary text-white">
                                                {feature.badge}
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-gray-600">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="my-10 text-center">
                        <Button className="bg-primary hover:bg-videdressing-secondary text-white px-6 py-3 rounded-md text-lg font-medium inline-flex items-center">
                            Commencer maintenant
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium bg-videdressing-light text-videdressing-primary">
                                    Comment ça marche
                                </Badge>
                                <h2 className="text-3xl font-bold mb-6">De la photo à la vente en quelques minutes</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="bg-videdressing-light text-videdressing-primary rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 font-bold">1</div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2">Prenez une photo</h3>
                                            <p className="text-gray-600">Utilisez notre application pour prendre des photos de qualité de vos vêtements.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-videdressing-light text-videdressing-primary rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 font-bold">2</div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2">Décrivez l'article</h3>
                                            <p className="text-gray-600">Ajoutez une description, précisez l'état et définissez un prix compétitif.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-videdressing-light text-videdressing-primary rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 font-bold">3</div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2">Publiez et vendez</h3>
                                            <p className="text-gray-600">Votre annonce est publiée immédiatement et visible par des milliers d'acheteurs potentiels.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-xl overflow-hidden shadow-lg">
                                <img
                                    src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                                    alt="Fonctionnalité de l'application"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}

export default Feature;
