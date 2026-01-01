import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Clock, Home, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Faq from '@/components/faq';

interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

function Contact() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();
    // const { toast } = useToast();

    const onSubmit = (data: ContactFormData) => {
        console.log('Contact form submitted:', data);
        // toast({
        //     title: "Message envoyé !",
        //     description: "Nous vous répondrons dans les plus brefs délais.",
        // });
        reset();
    };

    const handleWhatsAppContact = () => {
        const phoneNumber = "656921921"; // Remplacer par le vrai numéro
        const message = "Bonjour, j'aimerais avoir des informations sur vos services.";
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };
    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contactez-nous</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Nous sommes là pour vous aider ! N'hésitez pas à nous contacter pour toute question ou demande d'information.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Informations de contact */}
                        <div className="lg:col-span-1">
                            <Card className="h-fit">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Home className="h-6 w-6 text-primary" />
                                        <span>Nos coordonnées</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-start space-x-3">
                                        <MapPin className="h-5 w-5 text-primary mt-1" />
                                        <div>
                                            <h4 className="font-medium dark:text-white">Adresse</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                123 Avenue de la Mode<br />
                                                Yaoundé, Cameroun
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <Phone className="h-5 w-5 text-primary mt-1" />
                                        <div>
                                            <h4 className="font-medium dark:text-white">Téléphone</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">+237 656 92 19 21</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <Mail className="h-5 w-5 text-primary mt-1" />
                                        <div>
                                            <h4 className="font-medium dark:text-white">Email</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">contact@videdressing.sn</p>
                                        </div>
                                    </div>

                                    {/*<div className="flex items-start space-x-3">*/}
                                    {/*    <Clock className="h-5 w-5 text-primary mt-1" />*/}
                                    {/*    <div>*/}
                                    {/*        <h4 className="font-medium">Horaires</h4>*/}
                                    {/*        <p className="text-sm text-gray-600">*/}
                                    {/*            Lun - Ven: 9h00 - 18h00<br />*/}
                                    {/*            Sam: 9h00 - 16h00<br />*/}
                                    {/*            Dim: Fermé*/}
                                    {/*        </p>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}

                                    {/* Bouton WhatsApp */}
                                    <div className="pt-4 border-t">
                                        <Button
                                            onClick={handleWhatsAppContact}
                                            className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center space-x-2"
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                            <span>Contacter nous sur WhatsApp</span>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Formulaire de contact */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Send className="h-5 w-5 text-primary" />
                                        <span>Envoyez-nous un message</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="name">Nom complet *</Label>
                                                <Input
                                                    id="name"
                                                    {...register('name', { required: 'Le nom est requis' })}
                                                    className="mt-1"
                                                    placeholder="Votre nom complet"
                                                />
                                                {errors.name && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="email">Email *</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    {...register('email', {
                                                        required: 'L\'email est requis',
                                                        pattern: {
                                                            value: /^\S+@\S+$/i,
                                                            message: 'Email invalide'
                                                        }
                                                    })}
                                                    className="mt-1"
                                                    placeholder="votre@email.com"
                                                />
                                                {errors.email && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="phone">Téléphone</Label>
                                                <Input
                                                    id="phone"
                                                    {...register('phone')}
                                                    className="mt-1"
                                                    placeholder="+221 77 123 45 67"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="subject">Sujet *</Label>
                                                <Input
                                                    id="subject"
                                                    {...register('subject', { required: 'Le sujet est requis' })}
                                                    className="mt-1"
                                                    placeholder="Objet de votre message"
                                                />
                                                {errors.subject && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.subject.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="message">Message *</Label>
                                            <Textarea
                                                id="message"
                                                {...register('message', { required: 'Le message est requis' })}
                                                className="mt-1"
                                                rows={6}
                                                placeholder="Décrivez votre demande en détail..."
                                            />
                                            {errors.message && (
                                                <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-primary hover:bg-secondary text-white flex items-center justify-center space-x-2"
                                        >
                                            <Send className="h-4 w-4" />
                                            <span>Envoyer le message</span>
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Section FAQ rapide */}
                    <div className="mt-12">
                        <Faq/>
                        {/*<Card>*/}
                        {/*    <CardHeader>*/}
                        {/*        <CardTitle>Questions fréquentes</CardTitle>*/}
                        {/*    </CardHeader>*/}
                        {/*    <CardContent>*/}
                        {/*        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">*/}
                        {/*            <div>*/}
                        {/*                <h4 className="font-medium mb-2">Comment vendre sur la plateforme ?</h4>*/}
                        {/*                <p className="text-sm text-gray-600">*/}
                        {/*                    Créez votre compte vendeur, ajoutez vos produits avec photos et descriptions,*/}
                        {/*                    et commencez à vendre immédiatement.*/}
                        {/*                </p>*/}
                        {/*            </div>*/}
                        {/*            <div>*/}
                        {/*                <h4 className="font-medium mb-2">Quels sont les frais de commission ?</h4>*/}
                        {/*                <p className="text-sm text-gray-600">*/}
                        {/*                    Nous prélevons une commission de 5% sur chaque vente réalisée.*/}
                        {/*                    Aucun frais d'inscription.*/}
                        {/*                </p>*/}
                        {/*            </div>*/}
                        {/*            <div>*/}
                        {/*                <h4 className="font-medium mb-2">Comment ça marche la livraison ?</h4>*/}
                        {/*                <p className="text-sm text-gray-600">*/}
                        {/*                    Nous proposons plusieurs options de livraison : retrait en point relais,*/}
                        {/*                    livraison à domicile, ou livraison express.*/}
                        {/*                </p>*/}
                        {/*            </div>*/}
                        {/*            <div>*/}
                        {/*                <h4 className="font-medium mb-2">Puis-je retourner un article ?</h4>*/}
                        {/*                <p className="text-sm text-gray-600">*/}
                        {/*                    Oui, vous avez 14 jours pour retourner un article si celui-ci ne correspond*/}
                        {/*                    pas à la description.*/}
                        {/*                </p>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </CardContent>*/}
                        {/*</Card>*/}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default Contact;
