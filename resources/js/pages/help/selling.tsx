import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import {
    Store,
    Camera,
    Tag,
    CreditCard,
    Shield,
    TrendingUp,
    CheckCircle,
    ArrowRight,
    Lightbulb,
    Star,
    Package,
    MessageCircle
} from 'lucide-react';

function HelpSelling() {
    const steps = [
        {
            number: 1,
            title: 'Créez votre boutique',
            description: 'Inscrivez-vous et configurez votre profil vendeur. Ajoutez une photo de profil, une description attractive et vos coordonnées.',
            icon: Store,
            tips: ['Choisissez un nom de boutique mémorable', 'Ajoutez une photo de qualité', 'Rédigez une bio accrocheuse']
        },
        {
            number: 2,
            title: 'Photographiez vos articles',
            description: 'Prenez des photos claires et bien éclairées de vos articles sous plusieurs angles. La qualité des photos est essentielle pour vendre.',
            icon: Camera,
            tips: ['Utilisez la lumière naturelle', 'Montrez tous les détails', 'Photographiez les éventuels défauts']
        },
        {
            number: 3,
            title: 'Fixez vos prix',
            description: 'Définissez des prix compétitifs en consultant les articles similaires sur la plateforme. Tenez compte de l\'état et de la marque.',
            icon: Tag,
            tips: ['Comparez avec des articles similaires', 'Soyez réaliste sur l\'état', 'Proposez des promotions']
        },
        {
            number: 4,
            title: 'Publiez et vendez',
            description: 'Une fois votre annonce publiée, répondez rapidement aux questions des acheteurs et maintenez une bonne communication.',
            icon: TrendingUp,
            tips: ['Répondez sous 24h', 'Soyez honnête dans vos descriptions', 'Expédiez rapidement']
        }
    ];

    const benefits = [
        {
            icon: CreditCard,
            title: 'Commission réduite',
            description: 'Seulement 5% de commission sur vos ventes, sans frais d\'inscription ni abonnement.'
        },
        {
            icon: Shield,
            title: 'Paiement sécurisé',
            description: 'Les paiements sont sécurisés et transférés directement sur votre compte après confirmation.'
        },
        {
            icon: Package,
            title: 'Gestion simplifiée',
            description: 'Un tableau de bord intuitif pour gérer vos ventes, stocks et commandes en un seul endroit.'
        },
        {
            icon: MessageCircle,
            title: 'Messagerie intégrée',
            description: 'Communiquez facilement avec vos acheteurs via notre système de chat sécurisé.'
        }
    ];

    const bestPractices = [
        {
            icon: Camera,
            title: 'Photos de qualité',
            description: 'Les annonces avec de belles photos se vendent 3x plus vite.'
        },
        {
            icon: Tag,
            title: 'Prix juste',
            description: 'Un prix réaliste attire plus d\'acheteurs et accélère la vente.'
        },
        {
            icon: Star,
            title: 'Service client',
            description: 'Répondez rapidement et soyez disponible pour vos clients.'
        },
        {
            icon: CheckCircle,
            title: 'Descriptions détaillées',
            description: 'Plus votre description est précise, moins vous aurez de questions.'
        }
    ];

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Store className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Comment vendre sur Afroza Marketplace</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Transformez vos articles inutilisés en argent. Vendez facilement et en toute sécurité sur notre plateforme.
                    </p>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 mb-12 text-center">
                    <h2 className="text-2xl font-bold mb-4 dark:text-white">Prêt à commencer ?</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Rejoignez des milliers de vendeurs et commencez à vendre dès aujourd'hui.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" asChild>
                            <Link href="/register">Créer mon compte vendeur</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/products/create">Publier une annonce</Link>
                        </Button>
                    </div>
                </div>

                {/* Steps Section */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">Les étapes pour vendre</h2>
                    <div className="grid gap-6">
                        {steps.map((step, index) => (
                            <Card key={step.number} className="overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    <div className="bg-primary/5 p-6 flex items-center justify-center md:w-48">
                                        <div className="text-center">
                                            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mx-auto mb-2">
                                                {step.number}
                                            </div>
                                            <step.icon className="h-8 w-8 text-primary mx-auto" />
                                        </div>
                                    </div>
                                    <div className="flex-1 p-6">
                                        <h3 className="text-xl font-semibold mb-2 dark:text-white">{step.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">{step.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {step.tips.map((tip, tipIndex) => (
                                                <span
                                                    key={tipIndex}
                                                    className="inline-flex items-center gap-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full"
                                                >
                                                    <Lightbulb className="h-3 w-3" />
                                                    {tip}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">Pourquoi vendre chez nous ?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, index) => (
                            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                                    <benefit.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2 dark:text-white">{benefit.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Best Practices */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">Conseils pour bien vendre</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {bestPractices.map((practice, index) => (
                            <Card key={index} className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <practice.icon className="h-5 w-5 text-primary" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1 dark:text-white">{practice.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{practice.description}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* FAQ Link */}
                <div className="text-center">
                    <Card className="p-8 bg-gray-50 dark:bg-gray-800">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Des questions ?</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Consultez notre centre d'aide ou contactez notre équipe support.
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

export default HelpSelling;
