import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cookie, ChevronDown, Settings, BarChart3, Shield, Target, Info } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

function Cookies() {
    const [cookiePreferences, setCookiePreferences] = React.useState({
        essential: true,
        analytics: true,
        functional: true,
        marketing: false
    });

    const cookieTypes = [
        {
            id: 'essential',
            title: 'Cookies essentiels',
            icon: Shield,
            required: true,
            description: 'Ces cookies sont indispensables au fonctionnement du site. Ils permettent d\'utiliser les fonctionnalités principales comme la navigation sécurisée, l\'accès à votre compte et le panier d\'achat.',
            examples: [
                { name: 'session_id', purpose: 'Maintenir votre session connectée', duration: 'Session' },
                { name: 'csrf_token', purpose: 'Protection contre les attaques CSRF', duration: 'Session' },
                { name: 'cart_id', purpose: 'Conserver votre panier d\'achat', duration: '30 jours' },
            ]
        },
        {
            id: 'analytics',
            title: 'Cookies analytiques',
            icon: BarChart3,
            required: false,
            description: 'Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site. Ils nous permettent d\'améliorer nos services et l\'expérience utilisateur.',
            examples: [
                { name: '_ga', purpose: 'Google Analytics - Statistiques de visite', duration: '2 ans' },
                { name: '_gid', purpose: 'Google Analytics - Identification des visiteurs', duration: '24 heures' },
                { name: 'page_views', purpose: 'Compteur de pages vues', duration: '30 jours' },
            ]
        },
        {
            id: 'functional',
            title: 'Cookies fonctionnels',
            icon: Settings,
            required: false,
            description: 'Ces cookies permettent de mémoriser vos préférences et de personnaliser votre expérience sur notre plateforme.',
            examples: [
                { name: 'language', purpose: 'Mémoriser votre langue préférée', duration: '1 an' },
                { name: 'theme', purpose: 'Mémoriser votre thème (clair/sombre)', duration: '1 an' },
                { name: 'recent_views', purpose: 'Articles récemment consultés', duration: '30 jours' },
            ]
        },
        {
            id: 'marketing',
            title: 'Cookies marketing',
            icon: Target,
            required: false,
            description: 'Ces cookies sont utilisés pour vous proposer des publicités pertinentes et mesurer l\'efficacité de nos campagnes marketing.',
            examples: [
                { name: 'fbp', purpose: 'Facebook Pixel - Publicités ciblées', duration: '90 jours' },
                { name: 'ads_session', purpose: 'Suivi des campagnes publicitaires', duration: 'Session' },
                { name: 'referrer', purpose: 'Source de votre visite', duration: '30 jours' },
            ]
        }
    ];

    const [openSections, setOpenSections] = React.useState<{ [key: string]: boolean }>({});

    const toggleSection = (sectionId: string) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const handlePreferenceChange = (cookieType: string, value: boolean) => {
        if (cookieType !== 'essential') {
            setCookiePreferences(prev => ({
                ...prev,
                [cookieType]: value
            }));
        }
    };

    const acceptAll = () => {
        setCookiePreferences({
            essential: true,
            analytics: true,
            functional: true,
            marketing: true
        });
    };

    const rejectOptional = () => {
        setCookiePreferences({
            essential: true,
            analytics: false,
            functional: false,
            marketing: false
        });
    };

    const savePreferences = () => {
        // Sauvegarder les préférences dans un cookie
        console.log('Saving preferences:', cookiePreferences);
        // En production, vous utiliseriez localStorage ou un cookie pour stocker ces préférences
    };

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Cookie className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Politique de Cookies</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>

                {/* Introduction */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="h-5 w-5 text-primary" />
                            Qu'est-ce qu'un cookie ?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-600 dark:text-gray-400">
                        <p className="mb-4">
                            Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, smartphone, tablette) lorsque vous visitez un site web. Les cookies permettent au site de mémoriser vos actions et préférences (connexion, langue, taille de police, etc.) pendant une période donnée.
                        </p>
                        <p>
                            Sur Afroza Marketplace, nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. Cette politique explique quels cookies nous utilisons et comment les gérer.
                        </p>
                    </CardContent>
                </Card>

                {/* Cookie Preferences */}
                <Card className="mb-8 border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle>Gérer vos préférences</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {cookieTypes.map((type) => (
                                <div key={type.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <type.icon className="h-5 w-5 text-primary" />
                                        <div>
                                            <Label htmlFor={type.id} className="font-medium dark:text-white">
                                                {type.title}
                                                {type.required && <span className="ml-2 text-xs text-gray-500">(obligatoire)</span>}
                                            </Label>
                                        </div>
                                    </div>
                                    <Switch
                                        id={type.id}
                                        checked={cookiePreferences[type.id as keyof typeof cookiePreferences]}
                                        onCheckedChange={(value) => handlePreferenceChange(type.id, value)}
                                        disabled={type.required}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-3 mt-6">
                            <Button onClick={acceptAll}>
                                Tout accepter
                            </Button>
                            <Button variant="outline" onClick={rejectOptional}>
                                Refuser les optionnels
                            </Button>
                            <Button variant="secondary" onClick={savePreferences}>
                                Sauvegarder mes choix
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Cookie Types */}
                <div className="space-y-4 mb-8">
                    <h2 className="text-2xl font-bold dark:text-white">Détail des cookies utilisés</h2>
                    
                    {cookieTypes.map((type) => (
                        <Card key={type.id}>
                            <Collapsible open={openSections[type.id]} onOpenChange={() => toggleSection(type.id)}>
                                <CollapsibleTrigger className="w-full">
                                    <CardHeader className="flex flex-row items-center justify-between py-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-lg transition-colors">
                                        <div className="flex items-center gap-3">
                                            <type.icon className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-lg text-left">{type.title}</CardTitle>
                                        </div>
                                        <ChevronDown className={`h-5 w-5 transition-transform ${openSections[type.id] ? 'rotate-180' : ''}`} />
                                    </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <CardContent className="pt-0">
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">{type.description}</p>
                                        
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 dark:bg-gray-800">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Nom</th>
                                                        <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Finalité</th>
                                                        <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">Durée</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                    {type.examples.map((cookie, index) => (
                                                        <tr key={index}>
                                                            <td className="px-4 py-2 font-mono text-xs text-primary">{cookie.name}</td>
                                                            <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{cookie.purpose}</td>
                                                            <td className="px-4 py-2 text-gray-500 dark:text-gray-500">{cookie.duration}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </CollapsibleContent>
                            </Collapsible>
                        </Card>
                    ))}
                </div>

                {/* How to manage cookies */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5 text-primary" />
                            Comment gérer les cookies dans votre navigateur
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-600 dark:text-gray-400">
                        <p className="mb-4">
                            Vous pouvez également contrôler et/ou supprimer les cookies via les paramètres de votre navigateur. Voici les liens vers les instructions pour les navigateurs les plus courants :
                        </p>
                        <ul className="space-y-2">
                            <li>
                                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    → Google Chrome
                                </a>
                            </li>
                            <li>
                                <a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    → Mozilla Firefox
                                </a>
                            </li>
                            <li>
                                <a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    → Safari
                                </a>
                            </li>
                            <li>
                                <a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    → Microsoft Edge
                                </a>
                            </li>
                        </ul>
                        <p className="mt-4 text-sm">
                            <strong>Note :</strong> La désactivation de certains cookies peut affecter le fonctionnement de notre site et limiter certaines fonctionnalités.
                        </p>
                    </CardContent>
                </Card>

                {/* Footer note */}
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>
                        Pour toute question concernant notre utilisation des cookies, contactez-nous à{' '}
                        <a href="mailto:privacy@afroza-editor.cm" className="text-primary hover:underline">
                            privacy@afroza-editor.cm
                        </a>
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}

export default Cookies;
