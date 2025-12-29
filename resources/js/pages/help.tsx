import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, CreditCard, Mail, MessageCircle, Phone, Search, Shield, ShoppingBag, Store, Truck, User } from 'lucide-react';
import { Input } from '@/components/ui/input';

function Help() {

    const [searchTerm, setSearchTerm] = useState('');
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

    const toggleSection = (sectionId: string) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const faqCategories = [
        {
            id: 'account',
            title: 'Compte et inscription',
            icon: User,
            questions: [
                {
                    question: 'Comment créer un compte ?',
                    answer: 'Cliquez sur "Connexion" puis "S\'inscrire". Remplissez le formulaire avec vos informations personnelles et validez votre email.'
                },
                {
                    question: 'J\'ai oublié mon mot de passe',
                    answer: 'Sur la page de connexion, cliquez sur "Mot de passe oublié" et suivez les instructions envoyées par email.'
                },
                {
                    question: 'Comment modifier mes informations personnelles ?',
                    answer: 'Connectez-vous à votre compte, allez dans "Mon profil" et modifiez vos informations.'
                }
            ]
        },
        {
            id: 'selling',
            title: 'Vendre sur la plateforme',
            icon: Store,
            questions: [
                {
                    question: 'Comment vendre mes articles ?',
                    answer: 'Créez votre boutique, ajoutez vos produits avec photos et descriptions détaillées, puis publiez vos annonces.'
                },
                {
                    question: 'Quels sont les frais de commission ?',
                    answer: 'Nous prélevons une commission de 5% sur chaque vente réalisée. Aucun frais d\'inscription ou d\'abonnement.'
                },
                {
                    question: 'Comment fixer le prix de mes articles ?',
                    answer: 'Consultez les prix similaires sur la plateforme et tenez compte de l\'état, de la marque et de la rareté de votre article.'
                }
            ]
        },
        {
            id: 'buying',
            title: 'Acheter sur la plateforme',
            icon: ShoppingBag,
            questions: [
                {
                    question: 'Comment passer commande ?',
                    answer: 'Ajoutez les articles à votre panier, vérifiez votre commande et procédez au paiement sécurisé.'
                },
                {
                    question: 'Puis-je négocier le prix ?',
                    answer: 'Vous pouvez contacter le vendeur via la messagerie pour discuter du prix, selon ses conditions.'
                },
                {
                    question: 'Comment suivre ma commande ?',
                    answer: 'Rendez-vous dans "Mes commandes" pour suivre l\'état de vos achats en temps réel.'
                }
            ]
        },
        {
            id: 'payment',
            title: 'Paiement et facturation',
            icon: CreditCard,
            questions: [
                {
                    question: 'Quels moyens de paiement acceptez-vous ?',
                    answer: 'Nous acceptons les cartes bancaires, Orange Money, Mobile Money et Wave.'
                },
                {
                    question: 'Le paiement est-il sécurisé ?',
                    answer: 'Oui, tous les paiements sont sécurisés et chiffrés. Nous ne stockons jamais vos informations bancaires.'
                },
                {
                    question: 'Quand suis-je débité ?',
                    answer: 'Le paiement est prélevé immédiatement après validation de votre commande.'
                }
            ]
        },
        {
            id: 'delivery',
            title: 'Livraison et retrait',
            icon: Truck,
            questions: [
                {
                    question: 'Quelles sont les options de livraison ?',
                    answer: 'Livraison à domicile, retrait en point relais, ou livraison express. Les délais varient selon l\'option choisie.'
                },
                {
                    question: 'Combien coûte la livraison ?',
                    answer: 'Les frais varient selon la zone et le mode de livraison choisi. Ils sont affichés avant validation de commande.'
                },
                {
                    question: 'Puis-je modifier l\'adresse de livraison ?',
                    answer: 'Contactez-nous rapidement après commande. Modification possible avant expédition uniquement.'
                }
            ]
        },
        {
            id: 'returns',
            title: 'Retours et remboursements',
            icon: Shield,
            questions: [
                {
                    question: 'Puis-je retourner un article ?',
                    answer: 'Oui, vous avez 24 heures pour retourner un article s\'il ne correspond pas à la description.'
                },
                {
                    question: 'Comment demander un remboursement ?',
                    answer: 'Contactez le service client avec votre numéro de commande et le motif du retour.'
                },
                {
                    question: 'Sous quel délai suis-je remboursé ?',
                    answer: 'Le remboursement est effectué sous 5 à 7 jours ouvrés après réception du retour.'
                }
            ]
        }
    ];

    const filteredCategories = faqCategories.map(category => ({
        ...category,
        questions: category.questions.filter(
            q =>
                q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.questions.length > 0 || searchTerm === '');



    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                {/*<div>*/}
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Centre d'aide</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Trouvez rapidement les réponses à vos questions ou contactez notre équipe
                        </p>
                    </div>

                    {/* Barre de recherche */}
                    <div
                        // className="relative mb-8"
                        className="flex items-center justify-center relative mb-8 max-w-2xl mx-auto"
                    >
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                            type="text"
                            placeholder="Rechercher dans l'aide..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 py-3 text-lg"
                        />
                    </div>

                    {/* Contact rapide */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                        <Card className="text-center p-6 hover:shadow-md transition-shadow cursor-pointer">
                            <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                            <h3 className="font-semibold mb-2">Chat en direct</h3>
                            <p className="text-sm text-gray-600 mb-3">Réponse immédiate</p>
                            <Button size="sm" className="bg-primary hover:bg-secondary">
                                Démarrer le chat
                            </Button>
                        </Card>

                        <Card className="text-center p-6 hover:shadow-md transition-shadow cursor-pointer">
                            <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
                            <h3 className="font-semibold mb-2">Email</h3>
                            <p className="text-sm text-gray-600 mb-3">Réponse sous 24h</p>
                            <Button size="sm" variant="outline">
                                Nous écrire
                            </Button>
                        </Card>

                        <Card className="text-center p-6 hover:shadow-md transition-shadow cursor-pointer">
                            <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
                            <h3 className="font-semibold mb-2">Téléphone</h3>
                            <p className="text-sm text-gray-600 mb-3">Lun-Ven 9h-18h</p>
                            <Button size="sm" variant="outline">
                                +237 656 92 19 21
                            </Button>
                        </Card>
                    </div>

                    {/* FAQ par catégorie */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions fréquentes</h2>

                        {filteredCategories.map((category) => (
                            <Card key={category.id}>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-3">
                                        <category.icon className="h-6 w-6 text-primary" />
                                        <span>{category.title}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {category.questions.map((faq, index) => (
                                            <Collapsible key={index}>
                                                <CollapsibleTrigger
                                                    className="flex justify-between items-center w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                                    onClick={() => toggleSection(`${category.id}-${index}`)}
                                                >
                                                    <span className="font-medium">{faq.question}</span>
                                                    <ChevronDown
                                                        className={`h-5 w-5 transition-transform ${
                                                            openSections[`${category.id}-${index}`] ? 'rotate-180' : ''
                                                        }`}
                                                    />
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="px-3 pb-3">
                                                    <div className="pt-2 text-gray-600 border-t border-gray-100">
                                                        {faq.answer}
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Section contact */}
                    <div className="mt-12 text-center">
                        <Card className="p-8">
                            <h3 className="text-xl font-bold mb-4">Vous n'avez pas trouvé votre réponse ?</h3>
                            <p className="text-gray-600 mb-6">
                                Notre équipe support est là pour vous aider personnellement
                            </p>
                            {/*<Button className="bg-primary hover:bg-secondary">*/}
                            {/*    Contacter le support*/}
                            {/*</Button>*/}
                            <div className="flex items-center justify-center">
                                <Button className="bg-primary hover:bg-secondary" asChild>
                                    <a href="/contact">Contacter le support</a>
                                </Button>
                            </div>
                        </Card>
                    </div>
                {/*</div>*/}
            </div>
        </AppLayout>
    );
}

export default Help;
