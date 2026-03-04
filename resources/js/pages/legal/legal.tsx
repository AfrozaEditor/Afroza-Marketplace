import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, Building, Mail, Phone, MapPin, Globe, FileText, Users, Briefcase } from 'lucide-react';

function Legal() {
    const companyInfo = {
        name: 'Afroza Editor',
        legalForm: 'Société à Responsabilité Limitée (SARL)',
        capital: '1 000 000 FCFA',
        registration: 'RC/YAO/2024/XXXXX',
        taxId: 'MXXXXXXXXX',
        address: 'Ngoa-Ekele, Rue de la Joie, Yaoundé, Cameroun',
        phone: '+237 6XX XXX XXX',
        email: 'contact@afroza-editor.cm',
        website: 'https://afroza-marketplace.cm',
        director: 'Directeur Général',
        hostingProvider: {
            name: 'Amazon Web Services (AWS)',
            address: 'Amazon Web Services, Inc., 410 Terry Avenue North, Seattle, WA 98109-5210, USA'
        }
    };

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Scale className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Mentions Légales</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Informations légales relatives au site Afroza Marketplace
                    </p>
                </div>

                {/* Éditeur du site */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="h-5 w-5 text-primary" />
                            Éditeur du site
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Raison sociale</h4>
                                    <p className="text-gray-600 dark:text-gray-400">{companyInfo.name}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Forme juridique</h4>
                                    <p className="text-gray-600 dark:text-gray-400">{companyInfo.legalForm}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Capital social</h4>
                                    <p className="text-gray-600 dark:text-gray-400">{companyInfo.capital}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Numéro d'immatriculation</h4>
                                    <p className="text-gray-600 dark:text-gray-400">{companyInfo.registration}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Numéro d'identification fiscale</h4>
                                    <p className="text-gray-600 dark:text-gray-400">{companyInfo.taxId}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Siège social</h4>
                                        <p className="text-gray-600 dark:text-gray-400">{companyInfo.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Téléphone</h4>
                                        <p className="text-gray-600 dark:text-gray-400">{companyInfo.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Email</h4>
                                        <a href={`mailto:${companyInfo.email}`} className="text-primary hover:underline">
                                            {companyInfo.email}
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Globe className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Site web</h4>
                                        <a href={companyInfo.website} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                                            {companyInfo.website}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Directeur de publication */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Directeur de la publication
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 dark:text-gray-400">
                            Le directeur de la publication est le représentant légal de la société {companyInfo.name}, en sa qualité de {companyInfo.director}.
                        </p>
                    </CardContent>
                </Card>

                {/* Hébergeur */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-primary" />
                            Hébergeur
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="font-semibold text-gray-900 dark:text-white">{companyInfo.hostingProvider.name}</p>
                            <p className="text-gray-600 dark:text-gray-400">{companyInfo.hostingProvider.address}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Propriété intellectuelle */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Propriété intellectuelle
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                        <p>
                            L'ensemble de ce site relève de la législation camerounaise et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                        </p>
                        <p className="mt-4">
                            La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
                        </p>
                        <p className="mt-4">
                            Les marques, logos, et autres signes distinctifs présents sur le site sont la propriété exclusive de {companyInfo.name} ou de leurs propriétaires respectifs. Toute utilisation de ces éléments sans autorisation préalable est interdite.
                        </p>
                    </CardContent>
                </Card>

                {/* Limitation de responsabilité */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Scale className="h-5 w-5 text-primary" />
                            Limitation de responsabilité
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                        <p>
                            Les informations contenues sur ce site sont aussi précises que possible et le site est régulièrement mis à jour. Toutefois, il peut contenir des inexactitudes ou des omissions.
                        </p>
                        <p className="mt-4">
                            {companyInfo.name} ne pourra être tenue responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications techniques requises, soit de l'apparition d'un bug ou d'une incompatibilité.
                        </p>
                        <p className="mt-4">
                            {companyInfo.name} ne pourra également être tenue responsable des dommages indirects consécutifs à l'utilisation du site.
                        </p>
                    </CardContent>
                </Card>

                {/* Données personnelles */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Protection des données personnelles
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                        <p>
                            Conformément aux dispositions relatives à la protection des données personnelles, l'utilisateur dispose d'un droit d'accès, de rectification, de suppression et d'opposition de ses données personnelles.
                        </p>
                        <p className="mt-4">
                            Pour exercer ce droit, l'utilisateur peut contacter :
                        </p>
                        <ul className="mt-2">
                            <li>Par email : <a href="mailto:privacy@afroza-editor.cm" className="text-primary hover:underline">privacy@afroza-editor.cm</a></li>
                            <li>Par courrier : {companyInfo.address}</li>
                        </ul>
                        <p className="mt-4">
                            Pour plus d'informations, consultez notre <a href="/privacy" className="text-primary hover:underline">Politique de Confidentialité</a>.
                        </p>
                    </CardContent>
                </Card>

                {/* Cookies */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            Cookies
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                        <p>
                            Le site Afroza Marketplace peut collecter automatiquement des informations standard. Toutes les informations collectées indirectement ne seront utilisées que pour suivre le volume, le type et la configuration du trafic utilisant ce site, pour en développer la conception et l'agencement.
                        </p>
                        <p className="mt-4">
                            Pour plus d'informations sur les cookies, consultez notre <a href="/cookies" className="text-primary hover:underline">Politique de Cookies</a>.
                        </p>
                    </CardContent>
                </Card>

                {/* Droit applicable */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Scale className="h-5 w-5 text-primary" />
                            Droit applicable et juridiction
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                        <p>
                            Les présentes mentions légales sont régies par le droit camerounais. En cas de litige, et après échec de toute tentative de recherche d'une solution amiable, les tribunaux camerounais seront seuls compétents.
                        </p>
                        <p className="mt-4">
                            Le tribunal compétent est celui du ressort du siège social de {companyInfo.name}, soit le Tribunal de Première Instance de Yaoundé.
                        </p>
                    </CardContent>
                </Card>

                {/* Contact */}
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6 text-center">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">Une question ?</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter :
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href={`mailto:${companyInfo.email}`}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                <Mail className="h-4 w-4" />
                                {companyInfo.email}
                            </a>
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
                            >
                                Formulaire de contact
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

export default Legal;
