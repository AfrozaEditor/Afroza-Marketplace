import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Mail, Phone, MessageSquare, ArrowLeft } from 'lucide-react';

interface Props {
    delivery: {
        id: number;
        name: string;
        suspension_reason: string;
        suspended_at: string;
    };
    contactEmail: string;
    contactPhone?: string;
}

export default function DeliverySuspended({ delivery, contactEmail, contactPhone }: Props) {
    return (
        <>
            <Head title="Compte Suspendu" />
            
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <Card className="w-full max-w-lg shadow-xl">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                            <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <CardTitle className="text-2xl text-orange-600 dark:text-orange-400">
                            Compte Livreur Suspendu
                        </CardTitle>
                        <CardDescription className="text-base">
                            Bonjour {delivery.name}, votre profil de livreur a été temporairement suspendu.
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                        {/* Raison de la suspension */}
                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                            <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                                Raison de la suspension :
                            </h3>
                            <p className="text-orange-700 dark:text-orange-400">
                                {delivery.suspension_reason || "Aucune raison spécifique n'a été fournie."}
                            </p>
                            {delivery.suspended_at && (
                                <p className="text-sm text-orange-600 dark:text-orange-500 mt-2">
                                    Suspendu le : {new Date(delivery.suspended_at).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            )}
                        </div>

                        {/* Que faire ? */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                                Que pouvez-vous faire ?
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    <span>Contactez notre équipe d'administration pour plus d'informations sur la suspension.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    <span>Si vous pensez qu'il s'agit d'une erreur, expliquez votre situation.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    <span>Une fois le problème résolu, votre compte pourra être réactivé.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                                Contactez-nous
                            </h3>
                            
                            <div className="space-y-2">
                                <a 
                                    href={`mailto:${contactEmail}?subject=Demande de réactivation - Livreur ${delivery.name}&body=Bonjour,%0A%0AJe souhaite demander la réactivation de mon compte livreur.%0A%0ANom: ${delivery.name}%0ARaison de la suspension: ${delivery.suspension_reason || 'Non spécifiée'}%0A%0AMerci de votre attention.`}
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
                            <Link href="/logout" method="post" as="button" className="flex-1">
                                <Button variant="destructive" className="w-full">
                                    Se déconnecter
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
