import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import {
    Truck,
    MapPin,
    Clock,
    Package,
    CheckCircle,
    AlertCircle,
    Phone,
    Mail,
    ArrowRight,
    Home,
    Building,
    Bike
} from 'lucide-react';

function HelpDelivery() {
    const deliveryOptions = [
        {
            icon: Truck,
            title: 'Livraison standard',
            duration: '3-5 jours ouvrés',
            description: 'Livraison à domicile dans toutes les grandes villes du Cameroun.',
            price: 'À partir de 1 500 FCFA',
            features: ['Suivi en temps réel', 'SMS de notification', 'Livraison à domicile']
        },
        {
            icon: Bike,
            title: 'Livraison express',
            duration: '24-48 heures',
            description: 'Pour les commandes urgentes, livraison rapide dans les zones couvertes.',
            price: 'À partir de 3 000 FCFA',
            features: ['Priorité de traitement', 'Suivi en temps réel', 'Garantie de délai']
        },
        {
            icon: Building,
            title: 'Retrait en point relais',
            duration: '2-4 jours ouvrés',
            description: 'Retirez votre colis dans un point relais proche de chez vous.',
            price: 'À partir de 1 000 FCFA',
            features: ['Horaires flexibles', 'Conservation 7 jours', 'Notification par SMS']
        },
        {
            icon: Home,
            title: 'Retrait vendeur',
            duration: 'À convenir',
            description: 'Récupérez directement votre article chez le vendeur (si proposé).',
            price: 'Gratuit',
            features: ['Sans frais', 'Contact direct', 'Vérification sur place']
        }
    ];

    const zones = [
        { city: 'Yaoundé', delay: '1-2 jours', price: '1 500 FCFA' },
        { city: 'Douala', delay: '1-2 jours', price: '1 500 FCFA' },
        { city: 'Bafoussam', delay: '2-3 jours', price: '2 000 FCFA' },
        { city: 'Bamenda', delay: '3-4 jours', price: '2 500 FCFA' },
        { city: 'Garoua', delay: '4-5 jours', price: '3 000 FCFA' },
        { city: 'Maroua', delay: '4-5 jours', price: '3 500 FCFA' },
        { city: 'Autres villes', delay: '3-7 jours', price: 'Variable' },
    ];

    const trackingSteps = [
        { status: 'Commande confirmée', description: 'Votre commande a été validée et payée' },
        { status: 'En préparation', description: 'Le vendeur prépare votre colis' },
        { status: 'Expédié', description: 'Votre colis est en route vers vous' },
        { status: 'En livraison', description: 'Le livreur est en chemin' },
        { status: 'Livré', description: 'Votre colis a été livré avec succès' },
    ];

    const faqs = [
        {
            question: 'Comment suivre ma commande ?',
            answer: 'Rendez-vous dans "Mes commandes" pour voir le statut en temps réel de votre livraison. Vous recevrez aussi des notifications par SMS et email.'
        },
        {
            question: 'Puis-je modifier mon adresse de livraison ?',
            answer: 'Oui, tant que votre colis n\'a pas été expédié. Contactez-nous rapidement via le support client pour effectuer la modification.'
        },
        {
            question: 'Que faire si je suis absent lors de la livraison ?',
            answer: 'Le livreur tentera de vous contacter. Si vous êtes absent, le colis sera déposé en point relais ou une nouvelle tentative sera programmée.'
        },
        {
            question: 'Les frais de livraison sont-ils remboursables ?',
            answer: 'En cas de retour pour non-conformité du produit, les frais de livraison vous seront remboursés. Pour les autres cas, consultez notre politique de retour.'
        }
    ];

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Truck className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Livraison</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Découvrez nos options de livraison et suivez vos commandes en temps réel partout au Cameroun.
                    </p>
                </div>

                {/* Delivery Options */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">Options de livraison</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {deliveryOptions.map((option, index) => (
                            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardHeader className="bg-primary/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <option.icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{option.title}</CardTitle>
                                                <p className="text-sm text-primary font-medium">{option.duration}</p>
                                            </div>
                                        </div>
                                        <span className="text-lg font-bold text-primary">{option.price}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">{option.description}</p>
                                    <ul className="space-y-2">
                                        {option.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span className="dark:text-gray-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Zones de livraison */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">Zones et tarifs</h2>
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                <MapPin className="inline h-4 w-4 mr-2" />
                                                Ville
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                <Clock className="inline h-4 w-4 mr-2" />
                                                Délai estimé
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                Prix standard
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {zones.map((zone, index) => (
                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{zone.city}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{zone.delay}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-primary">{zone.price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                        * Les tarifs peuvent varier selon le poids et les dimensions du colis
                    </p>
                </div>

                {/* Tracking Steps */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">Suivi de commande</h2>
                    <Card className="p-6">
                        <div className="flex flex-col md:flex-row justify-between">
                            {trackingSteps.map((step, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-2">
                                            {index + 1}
                                        </div>
                                        <h4 className="text-sm font-semibold dark:text-white">{step.status}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[120px]">{step.description}</p>
                                    </div>
                                    {index < trackingSteps.length - 1 && (
                                        <div className="hidden md:block w-12 h-0.5 bg-primary/30 mx-2" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* FAQ */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">Questions fréquentes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {faqs.map((faq, index) => (
                            <Card key={index} className="p-6">
                                <h3 className="font-semibold mb-2 dark:text-white flex items-start gap-2">
                                    <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    {faq.question}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 ml-7">{faq.answer}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Contact */}
                <div className="text-center">
                    <Card className="p-8 bg-gray-50 dark:bg-gray-800">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Un problème avec votre livraison ?</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Notre équipe support est disponible pour vous aider.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild>
                                <Link href="/contact">
                                    <Phone className="mr-2 h-4 w-4" />
                                    Contacter le support
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/help">
                                    Centre d'aide
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

export default HelpDelivery;
