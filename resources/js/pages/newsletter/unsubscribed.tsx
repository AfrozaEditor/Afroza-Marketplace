import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, ArrowLeft } from 'lucide-react';

interface Props {
    email: string;
}

export default function Unsubscribed({ email }: Props) {
    return (
        <AppLayout>
            <Head title="Désabonnement confirmé" />

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto">
                    <Card className="text-center">
                        <CardHeader>
                            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <CardTitle className="text-2xl">Désabonnement confirmé</CardTitle>
                            <CardDescription>
                                Vous avez été désinscrit de notre newsletter
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                L'adresse <strong>{email}</strong> ne recevra plus nos newsletters.
                            </p>
                            
                            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                                <p>
                                    Si vous changez d'avis, vous pouvez vous réinscrire à tout moment 
                                    depuis notre site.
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 pt-4">
                                <Link href="/">
                                    <Button className="w-full gap-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        Retour à l'accueil
                                    </Button>
                                </Link>
                                <Link href="/newsletter/subscribe">
                                    <Button variant="outline" className="w-full gap-2">
                                        <Mail className="h-4 w-4" />
                                        Se réinscrire
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
