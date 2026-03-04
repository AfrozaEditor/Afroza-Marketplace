import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ChevronDown, Lock, Eye, UserCheck, Database, Globe, Mail } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

function Privacy() {
    const sections = [
        {
            id: 'introduction',
            title: '1. Introduction',
            icon: Shield,
            content: `Chez Afroza Marketplace (opéré par Afroza Editor), nous accordons une importance capitale à la protection de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos informations personnelles.

Cette politique s'applique à tous les utilisateurs de notre plateforme, qu'ils soient acheteurs, vendeurs ou simples visiteurs.

En utilisant nos services, vous acceptez les pratiques décrites dans cette politique.`
        },
        {
            id: 'collecte',
            title: '2. Données que nous collectons',
            icon: Database,
            content: `**2.1 Informations que vous nous fournissez**
Lors de votre inscription et utilisation de nos services :
• Nom et prénom
• Adresse email
• Numéro de téléphone
• Adresse postale
• Photo de profil
• Informations de paiement (traitées de manière sécurisée)

**2.2 Informations collectées automatiquement**
Lors de votre navigation sur notre plateforme :
• Adresse IP
• Type de navigateur et appareil
• Pages visitées et temps passé
• Données de géolocalisation (avec votre consentement)
• Cookies et technologies similaires

**2.3 Informations de tiers**
• Informations provenant des réseaux sociaux (si connexion via Google, Facebook)
• Informations de nos partenaires de paiement`
        },
        {
            id: 'utilisation',
            title: '3. Comment nous utilisons vos données',
            icon: Eye,
            content: `Nous utilisons vos données personnelles pour :

**3.1 Fournir nos services**
• Gérer votre compte utilisateur
• Traiter vos commandes et paiements
• Faciliter les communications entre acheteurs et vendeurs
• Assurer la livraison des articles

**3.2 Améliorer notre plateforme**
• Personnaliser votre expérience utilisateur
• Analyser l'utilisation de nos services
• Développer de nouvelles fonctionnalités
• Corriger les bugs et améliorer les performances

**3.3 Communications**
• Envoyer des confirmations de commande
• Notifications importantes concernant votre compte
• Newsletter et offres promotionnelles (avec votre consentement)
• Répondre à vos demandes de support

**3.4 Sécurité et conformité**
• Prévenir la fraude et les activités malveillantes
• Respecter nos obligations légales
• Résoudre les litiges`
        },
        {
            id: 'partage',
            title: '4. Partage de vos données',
            icon: Globe,
            content: `**4.1 Avec qui partageons-nous vos données ?**

• **Autres utilisateurs** : Certaines informations (nom, photo, avis) sont visibles par d'autres utilisateurs pour faciliter les transactions.

• **Partenaires de paiement** : Pour traiter vos transactions de manière sécurisée (Orange Money, MTN, etc.).

• **Services de livraison** : Pour assurer la livraison de vos commandes.

• **Prestataires techniques** : Hébergement, analyse, service client (tous soumis à des obligations de confidentialité).

**4.2 Nous ne vendons jamais vos données**
Vos données personnelles ne sont jamais vendues à des tiers à des fins de marketing.

**4.3 Obligations légales**
Nous pouvons divulguer vos données si la loi l'exige ou pour protéger nos droits et ceux de nos utilisateurs.`
        },
        {
            id: 'securite',
            title: '5. Sécurité de vos données',
            icon: Lock,
            content: `**5.1 Mesures de protection**
Nous mettons en œuvre des mesures de sécurité appropriées :
• Chiffrement SSL/TLS pour toutes les communications
• Stockage sécurisé des mots de passe (hashage)
• Accès restreint aux données personnelles
• Surveillance continue des systèmes
• Sauvegardes régulières

**5.2 Vos responsabilités**
Pour protéger votre compte :
• Utilisez un mot de passe fort et unique
• Ne partagez jamais vos identifiants
• Déconnectez-vous sur les appareils partagés
• Signalez toute activité suspecte

**5.3 Notification en cas de violation**
En cas de violation de données affectant vos informations, nous vous informerons dans les meilleurs délais conformément à la réglementation applicable.`
        },
        {
            id: 'droits',
            title: '6. Vos droits',
            icon: UserCheck,
            content: `Vous disposez des droits suivants concernant vos données personnelles :

**6.1 Droit d'accès**
Vous pouvez demander une copie des données personnelles que nous détenons à votre sujet.

**6.2 Droit de rectification**
Vous pouvez corriger vos informations personnelles via votre profil ou en nous contactant.

**6.3 Droit à l'effacement**
Vous pouvez demander la suppression de votre compte et de vos données personnelles.

**6.4 Droit d'opposition**
Vous pouvez vous opposer au traitement de vos données à des fins de marketing.

**6.5 Droit à la portabilité**
Vous pouvez demander l'export de vos données dans un format lisible.

**6.6 Comment exercer vos droits**
Contactez-nous à : privacy@afroza-editor.cm
Nous répondrons à votre demande dans un délai de 30 jours.`
        },
        {
            id: 'conservation',
            title: '7. Conservation des données',
            icon: Database,
            content: `**7.1 Durée de conservation**
Nous conservons vos données personnelles :
• Compte actif : pendant toute la durée de votre inscription
• Après suppression du compte : 3 ans maximum pour des raisons légales
• Données de transaction : 10 ans (obligations comptables)
• Données de navigation : 13 mois maximum

**7.2 Suppression des données**
À l'expiration des délais de conservation, vos données sont :
• Supprimées définitivement, ou
• Anonymisées de manière irréversible pour des analyses statistiques`
        },
        {
            id: 'cookies',
            title: '8. Cookies',
            icon: Globe,
            content: `Nous utilisons des cookies et technologies similaires. Pour plus de détails, consultez notre Politique de Cookies.

**Types de cookies utilisés :**
• **Essentiels** : Nécessaires au fonctionnement du site
• **Analytiques** : Pour comprendre comment vous utilisez notre site
• **Fonctionnels** : Pour mémoriser vos préférences
• **Marketing** : Pour vous proposer des publicités pertinentes (avec votre consentement)

Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.`
        },
        {
            id: 'mineurs',
            title: '9. Protection des mineurs',
            icon: Shield,
            content: `Notre plateforme n'est pas destinée aux enfants de moins de 13 ans. Nous ne collectons pas sciemment de données personnelles concernant des enfants.

Les mineurs de 13 à 18 ans doivent obtenir l'autorisation de leurs parents ou tuteurs légaux pour utiliser nos services.

Si vous pensez qu'un mineur a fourni des données personnelles sans autorisation, contactez-nous immédiatement.`
        },
        {
            id: 'modifications',
            title: '10. Modifications de cette politique',
            icon: Eye,
            content: `Nous pouvons mettre à jour cette politique de confidentialité pour refléter les changements dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires.

**En cas de modification importante :**
• Nous vous informerons par email ou notification sur la plateforme
• La date de "dernière mise à jour" sera modifiée
• Un résumé des changements sera fourni

Nous vous encourageons à consulter régulièrement cette politique.`
        },
        {
            id: 'contact',
            title: '11. Nous contacter',
            icon: Mail,
            content: `Pour toute question concernant cette politique ou vos données personnelles :

**Responsable de la protection des données**
Afroza Editor
Email : privacy@afroza-editor.cm
Téléphone : +237 6XX XXX XXX
Adresse : Yaoundé, Ngoa-Ekele, Rue de la Joie, Cameroun

Nous nous efforçons de répondre à toutes les demandes dans un délai de 30 jours.`
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
                        <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Politique de Confidentialité</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>

                {/* Summary Card */}
                <Card className="mb-8 bg-primary/5 border-primary/20">
                    <CardContent className="p-6">
                        <h3 className="font-semibold mb-3 dark:text-white">En résumé</h3>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li className="flex items-start gap-2">
                                <Lock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                Vos données sont protégées par des mesures de sécurité avancées
                            </li>
                            <li className="flex items-start gap-2">
                                <Eye className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                Nous ne vendons jamais vos données personnelles
                            </li>
                            <li className="flex items-start gap-2">
                                <UserCheck className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                Vous avez le contrôle sur vos données (accès, rectification, suppression)
                            </li>
                        </ul>
                    </CardContent>
                </Card>

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
                                        <div className="flex items-center gap-3">
                                            <section.icon className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-lg text-left">{section.title}</CardTitle>
                                        </div>
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
                        Pour toute question sur notre politique de confidentialité, contactez-nous à{' '}
                        <a href="mailto:privacy@afroza-editor.cm" className="text-primary hover:underline">
                            privacy@afroza-editor.cm
                        </a>
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}

export default Privacy;
