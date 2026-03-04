import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import {
    ShoppingBag,
    Search,
    Heart,
    ShoppingCart,
    CreditCard,
    Truck,
    Shield,
    CheckCircle,
    ArrowRight,
    Star,
    MessageCircle,
    Package,
    AlertCircle
} from 'lucide-react';

function HelpBuying() {
    const steps = [
        {
            number: 1,
            title: 'Trouvez vos articles',
            description: 'Parcourez nos catégories ou utilisez la recherche pour trouver les articles qui vous intéressent. Filtrez par prix, taille, état ou localisation.',
            icon: Search,
            color: 'bg-blue-500'
        },
        {
            number: 2,
            title: 'Ajoutez au panier',
            description: 'Sélectionnez vos articles préférés et ajoutez-les à votre panier. Vous pouvez aussi sauvegarder des articles en favoris pour plus tard.',
            icon: ShoppingCart,
            color: 'bg-green-500'
        },
        {
            number: 3,
            title: 'Payez en toute sécurité',
            description: 'Choisissez votre mode de paiement préféré (Mobile Money, carte bancaire) et validez votre commande en toute confiance.',
            icon: CreditCard,
            color: 'bg-purple-500'
        },
        {
            number: 4,
            title: 'Recevez votre commande',
            description: 'Suivez votre livraison en temps réel et recevez vos articles chez vous ou en point relais selon votre choix.',
            icon: Package,
            color: 'bg-orange-500'
        }
    ];

    const features = [
        {
            icon: Shield,
            title: 'Achat sécurisé',
            description: 'Vos paiements sont protégés et vos données personnelles sécurisées.'
        },
        {
            icon: Heart,
            title: 'Favoris',
            description: 'Sauvegardez vos articles préférés et recevez des alertes de prix.'
        },
        {
            icon: MessageCircle,
            title: 'Contact vendeur',
            description: 'Posez vos questions directement au vendeur via notre messagerie.'
        },
        {
            icon: Star,
            title: 'Avis vérifiés',
            description: 'Consultez les avis des autres acheteurs avant d\'acheter.'
        }
    ];

    const tips = [
        {
            title: 'Vérifiez les photos',
            description: 'Examinez attentivement toutes les photos de l\'article, y compris les éventuels défauts mentionnés.'
        },
        {
            title: 'Lisez la description',
            description: 'Prenez le temps de lire la description complète : état, taille, composition, etc.'
        },
        {
            title: 'Consultez les avis',
            description: 'Regardez les évaluations du vendeur et ses précédentes transactions.'
        },
        {
            title: 'Posez des questions',
            description: 'N\'hésitez pas à contacter le vendeur si vous avez besoin d\'informations supplémentaires.'
        },
        {
            title: 'Comparez les prix',
            description: 'Vérifiez les prix d\'articles similaires pour vous assurer d\'obtenir un bon deal.'
        },
        {
            title: 'Vérifiez les frais',
            description: 'Prenez en compte les frais de livraison avant de valider votre achat.'
        }
    ];

    const paymentMethods = [
        { name: 'Orange Money', emoji: '🟠' },
        { name: 'MTN Mobile Money', emoji: '🟡' },
        { name: 'Carte Visa/Mastercard', emoji: '💳' },
        { name: 'Wave', emoji: '🌊' },
    ];

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <ShoppingBag className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Comment acheter sur Afroza Marketplace</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Découvrez des milliers d'articles uniques et faites vos achats en toute confiance sur notre plateforme.
                    </p>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 mb-12 text-center">
                    <h2 className="text-2xl font-bold mb-4 dark:text-white">Prêt à découvrir ?</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Explorez notre sélection d'articles et trouvez des pièces uniques.
                    </p>
                    <Button size="lg" asChild>
                        <Link href="/products">
                            Parcourir les articles
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Steps */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">Comment ça marche</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step) => (
                            <Card key={step.number} className="relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-full h-1 ${step.color}`} />
                                <CardContent className="pt-8 pb-6 text-center">
                                    <div className={`w-12 h-12 rounded-full ${step.color} text-white flex items-center justify-center text-xl font-bold mx-auto mb-4`}>
                                        {step.number}
                                    </div>
                                    <step.icon className="h-8 w-8 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2 dark:text-white">{step.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Features */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">Vos avantages</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2 dark:text-white">{feature.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-16">
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Modes de paiement acceptés</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {paymentMethods.map((method, index) => (
                                <div key={index} className="flex items-center justify-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <span className="text-2xl">{method.emoji}</span>
                                    <span className="font-medium dark:text-white">{method.name}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                            Tous vos paiements sont sécurisés et chiffrés
                        </p>
                    </Card>
                </div>

                {/* Tips */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">
                        <AlertCircle className="inline h-6 w-6 mr-2 text-primary" />
                        Conseils pour bien acheter
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tips.map((tip, index) => (
                            <Card key={index} className="p-6">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold mb-1 dark:text-white">{tip.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{tip.description}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* FAQ Link */}
                <div className="text-center">
                    <Card className="p-8 bg-gray-50 dark:bg-gray-800">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Besoin d'aide ?</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Consultez notre FAQ ou contactez notre support client.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button variant="outline" asChild>
                                <Link href="/help">
                                    Centre d'aide
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/contact">Nous contacter</Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

export default HelpBuying;
