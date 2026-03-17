import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollText, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

function Terms() {
    const sections = [
        {
            id: 'introduction',
            title: '1. Introduction',
            content: `Bienvenue sur Afroza Marketplace, une plateforme de commerce en ligne opérée par Afroza Editor, société de droit camerounais. Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de notre site web et de nos services.

En accédant à notre plateforme ou en utilisant nos services, vous acceptez d'être lié par ces conditions. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.`
        },
        {
            id: 'definitions',
            title: '2. Définitions',
            content: `• **Plateforme** : Le site web Afroza Marketplace et ses applications mobiles associées.
• **Utilisateur** : Toute personne physique ou morale accédant à la Plateforme.
• **Vendeur** : Utilisateur proposant des articles à la vente sur la Plateforme.
• **Acheteur** : Utilisateur effectuant un achat sur la Plateforme.
• **Services** : L'ensemble des fonctionnalités proposées par la Plateforme.
• **Contenu** : Textes, images, vidéos et autres éléments publiés sur la Plateforme.`
        },
        {
            id: 'inscription',
            title: '3. Inscription et Compte',
            content: `**3.1 Conditions d'inscription**
Pour créer un compte sur la Plateforme, vous devez :
- Être âgé d'au moins 18 ans ou avoir l'autorisation de vos parents/tuteurs légaux
- Fournir des informations exactes et complètes
- Maintenir la confidentialité de vos identifiants de connexion

**3.2 Responsabilité du compte**
Vous êtes responsable de toutes les activités effectuées sous votre compte. En cas d'utilisation non autorisée, vous devez nous en informer immédiatement.

**3.3 Suspension ou clôture**
Nous nous réservons le droit de suspendre ou de clôturer votre compte en cas de violation des présentes conditions ou pour des raisons de sécurité.`
        },
        {
            id: 'vendeurs',
            title: '4. Conditions pour les Vendeurs',
            content: `**4.1 Engagement du vendeur**
En tant que vendeur, vous vous engagez à :
- Fournir des descriptions exactes et complètes de vos articles
- Publier des photos fidèles à la réalité
- Mentionner tout défaut ou imperfection
- Respecter les prix annoncés
- Expédier les articles dans les délais convenus

**4.2 Articles interdits**
Il est strictement interdit de vendre :
- Produits contrefaits ou volés
- Armes et munitions
- Drogues et substances illicites
- Articles à caractère pornographique
- Tout produit illégal au Cameroun

**4.3 Commission**
Une commission de 5% est prélevée sur chaque vente réalisée. Cette commission est automatiquement déduite du montant versé au vendeur.`
        },
        {
            id: 'acheteurs',
            title: '5. Conditions pour les Acheteurs',
            content: `**5.1 Processus d'achat**
L'acheteur s'engage à :
- Vérifier les caractéristiques des articles avant achat
- Effectuer le paiement via les moyens proposés
- Fournir une adresse de livraison correcte
- Réceptionner les articles dans les meilleurs délais

**5.2 Droit de rétractation**
Vous disposez d'un délai de 24 heures après réception pour signaler tout problème. Passé ce délai, aucune réclamation ne pourra être traitée.

**5.3 Protection acheteur**
Nous garantissons le remboursement en cas d'article non conforme à la description, sous réserve de signalement dans les délais impartis.`
        },
        {
            id: 'paiement',
            title: '6. Paiement et Transactions',
            content: `**6.1 Moyens de paiement**
Nous acceptons les paiements par :
- Orange Money
- MTN Mobile Money
- Wave
- Cartes bancaires (Visa, Mastercard)

**6.2 Sécurité des paiements**
Toutes les transactions sont sécurisées et chiffrées. Nous ne stockons jamais vos informations bancaires complètes.

**6.3 Versement aux vendeurs**
Les fonds sont versés aux vendeurs après confirmation de la réception par l'acheteur ou après expiration du délai de rétractation.`
        },
        {
            id: 'livraison',
            title: '7. Livraison',
            content: `**7.1 Options de livraison**
Plusieurs options sont disponibles :
- Livraison standard (3-5 jours)
- Livraison express (24-48h)
- Retrait en point relais
- Retrait chez le vendeur (si disponible)

**7.2 Frais de livraison**
Les frais sont calculés selon la zone géographique et le poids du colis. Ils sont affichés avant validation de la commande.

**7.3 Responsabilité**
Nous ne sommes pas responsables des retards causés par des événements indépendants de notre volonté (grèves, intempéries, etc.).`
        },
        {
            id: 'propriete',
            title: '8. Propriété Intellectuelle',
            content: `**8.1 Contenu de la plateforme**
L'ensemble du contenu de la Plateforme (logo, design, textes, images) est protégé par les droits de propriété intellectuelle et appartient à Afroza Editor.

**8.2 Contenu utilisateur**
En publiant du contenu sur la Plateforme, vous nous accordez une licence non exclusive pour utiliser, reproduire et afficher ce contenu dans le cadre de nos services.

**8.3 Respect des droits**
Il est interdit de publier du contenu portant atteinte aux droits de tiers (contrefaçon, diffamation, etc.).`
        },
        {
            id: 'responsabilite',
            title: '9. Limitation de Responsabilité',
            content: `**9.1 Rôle d'intermédiaire**
Afroza Marketplace agit en tant qu'intermédiaire entre vendeurs et acheteurs. Nous ne sommes pas partie aux transactions effectuées entre utilisateurs.

**9.2 Garanties**
Nous ne garantissons pas :
- La disponibilité permanente de la Plateforme
- L'exactitude des informations fournies par les utilisateurs
- La qualité des articles vendus

**9.3 Indemnisation**
Les utilisateurs s'engagent à nous indemniser en cas de réclamation liée à leur utilisation de la Plateforme.`
        },
        {
            id: 'modification',
            title: '10. Modification des CGU',
            content: `Nous nous réservons le droit de modifier les présentes CGU à tout moment. Les modifications prennent effet dès leur publication sur la Plateforme.

Les utilisateurs seront informés des modifications importantes par email ou notification sur la Plateforme.

L'utilisation continue de la Plateforme après modification vaut acceptation des nouvelles conditions.`
        },
        {
            id: 'contact',
            title: '11. Contact et Litiges',
            content: `**11.1 Service client**
Pour toute question concernant ces CGU :
- Email : afroza.editor@gmail.com
- Téléphone : +237 656 921 921
- Adresse : Yaoundé, Ngoa-Ekele, Rue de la Joie

**11.2 Règlement des litiges**
En cas de litige, une solution amiable sera recherchée en priorité. À défaut, les tribunaux camerounais compétents seront saisis.

**11.3 Droit applicable**
Les présentes CGU sont régies par le droit camerounais.`
        }
    ];

    const [openSections, setOpenSections] = React.useState<{ [key: string]: boolean }>({
        introduction: true
    });

    const toggleSection = (sectionId: string) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <ScrollText className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Conditions Générales d'Utilisation</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>

                {/* Quick Nav */}
                <Card className="mb-8 p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Navigation rapide :</p>
                    <div className="flex flex-wrap gap-2">
                        {sections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-primary/20 transition-colors dark:text-gray-300"
                            >
                                {section.title.split('.')[0]}
                            </a>
                        ))}
                    </div>
                </Card>

                {/* Content */}
                <div className="space-y-4">
                    {sections.map((section) => (
                        <Card key={section.id} id={section.id}>
                            <Collapsible open={openSections[section.id]} onOpenChange={() => toggleSection(section.id)}>
                                <CollapsibleTrigger className="w-full">
                                    <CardHeader className="flex flex-row items-center justify-between py-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-lg transition-colors">
                                        <CardTitle className="text-lg text-left">{section.title}</CardTitle>
                                        <ChevronDown className={`h-5 w-5 transition-transform ${openSections[section.id] ? 'rotate-180' : ''}`} />
                                    </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <CardContent className="pt-0">
                                        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                            {section.content}
                                        </div>
                                    </CardContent>
                                </CollapsibleContent>
                            </Collapsible>
                        </Card>
                    ))}
                </div>

                {/* Footer note */}
                <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>
                        En utilisant Afroza Marketplace, vous acceptez ces conditions générales d'utilisation.
                        <br />
                        Pour toute question, contactez-nous à{' '}
                        <a href="mailto:afroza.editor@gmail.com" className="text-primary hover:underline">
                            afroza.editor@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}

export default Terms;
