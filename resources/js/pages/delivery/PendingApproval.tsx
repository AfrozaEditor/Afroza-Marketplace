import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Mail, Phone, MessageSquare, ArrowLeft, CheckCircle2, FileText, Shield } from 'lucide-react';

interface Props {
    delivery: {
        id: number;
        name: string;
        created_at: string;
    };
    contactEmail: string;
    contactPhone?: string;
}

export default function DeliveryPendingApproval({ delivery, contactEmail, contactPhone }: Props) {
    return (
        <>
            <Head title="Profil en attente d'approbation" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <Card className="w-full max-w-lg shadow-xl">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                            <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
                        </div>
                        <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">
                            Profil en attente d'approbation
                        </CardTitle>
                        <CardDescription className="text-base">
                            Bonjour {delivery.name}, votre profil de livreur est en cours de vérification.
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                        {/* Message d'attente */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                                Votre demande est en cours de traitement
                            </h3>
                            <p className="text-blue-700 dark:text-blue-400">
                                Notre équipe examine actuellement votre profil et vos documents. 
                                Vous recevrez une notification dès que votre profil sera approuvé.
                            </p>
                            {delivery.created_at && (
                                <p className="text-sm text-blue-600 dark:text-blue-500 mt-2">
                                    Demande soumise le : {new Date(delivery.created_at).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            )}
                        </div>

                        {/* Étapes de vérification */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                                Processus de vérification
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-green-800 dark:text-green-300">Profil soumis</p>
                                        <p className="text-sm text-green-600 dark:text-green-400">Vos informations ont été reçues</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 animate-pulse" />
                                    <div>
                                        <p className="font-medium text-blue-800 dark:text-blue-300">Vérification des documents</p>
                                        <p className="text-sm text-blue-600 dark:text-blue-400">En cours d'examen...</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <Shield className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-500 dark:text-gray-400">Approbation finale</p>
                                        <p className="text-sm text-gray-400 dark:text-gray-500">En attente</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ce qui se passe ensuite */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                                Prochaines étapes
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>Une fois approuvé, vous pourrez accéder au tableau de bord livreur.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>Vous verrez les commandes disponibles dans votre zone de livraison.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>Vous recevrez une notification par email et dans l'application.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                                Une question ?
                            </h3>
                            
                            <div className="space-y-2">
                                <a 
                                    href={`mailto:${contactEmail}?subject=Question sur mon profil livreur - ${delivery.name}&body=Bonjour,%0A%0AJ'ai une question concernant l'approbation de mon profil livreur.%0A%0ANom: ${delivery.name}%0A%0AMerci de votre attention.`}
                                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg border hover:border-primary transition-colors"
                                >
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">Par email</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{contactEmail}</p>
                                    </div>
                                </a>

                                {contactPhone && (
                                    <a 
                                        href={`tel:${contactPhone}`}
                                        className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg border hover:border-primary transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                            <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-gray-200">Par téléphone</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{contactPhone}</p>
                                        </div>
                                    </a>
                                )}

                                <Link 
                                    href="/chat"
                                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg border hover:border-primary transition-colors"
                                >
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                        <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">Via messagerie</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Ouvrir une conversation</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Link href="/" className="flex-1">
                                <Button variant="outline" className="w-full">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Retour à l'accueil
                                </Button>
                            </Link>
                            <Link href="/delivery/profile" className="flex-1">
                                <Button variant="default" className="w-full">
                                    Voir mon profil
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
