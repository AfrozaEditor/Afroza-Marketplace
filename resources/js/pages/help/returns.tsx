import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import {
    RotateCcw,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    CreditCard,
    Package,
    Shield,
    ArrowRight,
    MessageCircle,
    Phone,
    Camera,
    FileText
} from 'lucide-react';

function HelpReturns() {
    const returnReasons = [
        {
            icon: Package,
            title: 'Article non conforme',
            description: 'L\'article reçu ne correspond pas à la description ou aux photos de l\'annonce.',
            refundable: true
        },
        {
            icon: AlertTriangle,
            title: 'Article défectueux',
            description: 'L\'article présente un défaut non mentionné dans l\'annonce.',
            refundable: true
        },
        {
            icon: XCircle,
            title: 'Erreur de commande',
            description: 'Vous avez reçu un article différent de celui commandé.',
            refundable: true
        },
        {
            icon: RotateCcw,
            title: 'Changement d\'avis',
            description: 'Vous ne souhaitez plus l\'article (sous conditions).',
            refundable: false
        }
    ];

    const returnSteps = [
        {
            number: 1,
            title: 'Signaler le problème',
            description: 'Contactez-nous dans les 24h suivant la réception avec photos et description du problème.',
            icon: Camera
        },
        {
            number: 2,
            title: 'Validation de la demande',
            description: 'Notre équipe examine votre demande et vous contacte sous 48h.',
            icon: FileText
        },
        {
            number: 3,
            title: 'Retour de l\'article',
            description: 'Si approuvé, renvoyez l\'article dans son état d\'origine.',
            icon: Package
        },
        {
            number: 4,
            title: 'Remboursement',
            description: 'Une fois l\'article reçu et vérifié, le remboursement est effectué sous 5-7 jours.',
            icon: CreditCard
        }
    ];

    const conditions = [
        { condition: 'Délai de signalement', detail: '24 heures après réception' },
        { condition: 'État de l\'article', detail: 'Comme reçu, non utilisé' },
        { condition: 'Emballage', detail: 'Original si possible' },
        { condition: 'Documentation', detail: 'Photos + numéro de commande' },
    ];

    const nonRefundable = [
        'Articles personnalisés ou sur mesure',
        'Sous-vêtements et maillots de bain',
        'Articles périssables ou cosmétiques ouverts',
        'Articles endommagés par l\'acheteur',
        'Retours hors délai (après 24h)'
    ];

    const faqs = [
        {
            question: 'Combien de temps ai-je pour signaler un problème ?',
            answer: 'Vous disposez de 24 heures après la réception de votre commande pour signaler tout problème. Passé ce délai, les réclamations ne pourront plus être traitées.'
        },
        {
            question: 'Qui paie les frais de retour ?',
            answer: 'Si l\'article est non conforme ou défectueux, les frais de retour sont à notre charge. Pour un changement d\'avis, les frais restent à la charge de l\'acheteur.'
        },
        {
            question: 'Comment suis-je remboursé ?',
            answer: 'Le remboursement est effectué via le même moyen de paiement utilisé lors de l\'achat (Mobile Money, carte bancaire, etc.).'
        },
        {
            question: 'Puis-je échanger un article ?',
            answer: 'Les échanges directs ne sont pas possibles. Vous devez retourner l\'article pour remboursement puis passer une nouvelle commande.'
        }
    ];

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <RotateCcw className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Retours & Remboursements</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Notre politique de retour simple et transparente pour vous garantir une expérience d'achat sereine.
                    </p>
                </div>

                {/* Protection Banner */}
                <Card className="mb-12 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="flex items-center gap-4 p-6">
                        <Shield className="h-12 w-12 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <div>
                            <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">Protection Acheteur</h3>
                            <p className="text-green-700 dark:text-green-400">
                                Tous vos achats sont protégés. Si votre article ne correspond pas à la description, nous vous remboursons intégralement.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Return Reasons */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">Motifs de retour acceptés</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {returnReasons.map((reason, index) => (
                            <Card key={index} className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${reason.refundable ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                                        <reason.icon className={`h-6 w-6 ${reason.refundable ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold dark:text-white">{reason.title}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${reason.refundable ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                {reason.refundable ? 'Remboursable' : 'Sous conditions'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{reason.description}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Return Steps */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">Processus de retour</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {returnSteps.map((step) => (
                            <Card key={step.number} className="text-center p-6 relative">
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                        {step.number}
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <step.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                                    <h3 className="font-semibold mb-2 dark:text-white">{step.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Conditions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    {/* Conditions requises */}
                    <Card className="p-6">
                        <CardHeader className="px-0 pt-0">
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Conditions requises
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-0 pb-0">
                            <table className="w-full">
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {conditions.map((item, index) => (
                                        <tr key={index}>
                                            <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">{item.condition}</td>
                                            <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{item.detail}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    {/* Non remboursable */}
                    <Card className="p-6">
                        <CardHeader className="px-0 pt-0">
                            <CardTitle className="flex items-center gap-2">
                                <XCircle className="h-5 w-5 text-red-500" />
                                Articles non remboursables
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-0 pb-0">
                            <ul className="space-y-3">
                                {nonRefundable.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm">
                                        <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-600 dark:text-gray-400">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Refund Timeline */}
                <Card className="mb-16 p-6">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Délais de remboursement
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span className="text-3xl font-bold text-primary">24h</span>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Délai pour signaler</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span className="text-3xl font-bold text-primary">48h</span>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Traitement de la demande</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span className="text-3xl font-bold text-primary">5-7j</span>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Remboursement effectif</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* FAQ */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">Questions fréquentes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {faqs.map((faq, index) => (
                            <Card key={index} className="p-6">
                                <h3 className="font-semibold mb-2 dark:text-white">{faq.question}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Contact */}
                <div className="text-center">
                    <Card className="p-8 bg-gray-50 dark:bg-gray-800">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Besoin d'effectuer un retour ?</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Contactez notre service client avec votre numéro de commande et les photos de l'article.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild>
                                <Link href="/contact">
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    Demander un retour
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

export default HelpReturns;
