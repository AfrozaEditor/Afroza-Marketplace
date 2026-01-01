import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import TiptapEditor from '@/components/TiptapEditor';
import { 
    ArrowLeft,
    Save,
    Eye,
    Send,
    Clock,
    Loader2,
    Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { BreadcrumbItem } from '@/types';

interface Props {
    subscriberCount: number;
}

export default function Create({ subscriberCount }: Props) {
    const [showSchedule, setShowSchedule] = useState(false);
    const [sending, setSending] = useState(false);
    const [sendingTest, setSendingTest] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        preview_text: '',
        content: '',
        scheduled_at: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tableau de bord', href: '/admin' },
        { title: 'Newsletters', href: '/admin/newsletters' },
        { title: 'Nouvelle newsletter', href: '/admin/newsletters/create' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        post('/admin/newsletters', {
            onSuccess: () => {
                toast.success('Newsletter sauvegardée en brouillon.');
            },
            onError: () => {
                toast.error('Erreur lors de la sauvegarde.');
            },
        });
    };

    const handleSaveAndSend = () => {
        if (!data.subject || !data.content) {
            toast.error('Veuillez remplir le sujet et le contenu.');
            return;
        }

        if (subscriberCount === 0) {
            toast.error('Aucun abonné actif pour recevoir cette newsletter.');
            return;
        }

        if (!confirm(`Envoyer cette newsletter à ${subscriberCount} abonnés ?`)) {
            return;
        }

        setSending(true);
        
        // First save as draft, then send
        router.post('/admin/newsletters', {
            ...data,
            send_immediately: true,
        }, {
            onSuccess: () => {
                toast.success('Newsletter envoyée avec succès !');
            },
            onError: () => {
                toast.error('Erreur lors de l\'envoi.');
                setSending(false);
            },
            onFinish: () => {
                setSending(false);
            },
        });
    };

    const handleSendTest = () => {
        if (!data.subject || !data.content) {
            toast.error('Veuillez remplir le sujet et le contenu.');
            return;
        }

        const email = prompt('Email pour le test :');
        if (!email) return;

        setSendingTest(true);
        
        router.post('/admin/newsletters/send-test', {
            subject: data.subject,
            preview_text: data.preview_text,
            content: data.content,
            email: email,
        }, {
            onSuccess: () => {
                toast.success('Email de test envoyé !');
            },
            onError: () => {
                toast.error('Erreur lors de l\'envoi du test.');
            },
            onFinish: () => {
                setSendingTest(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nouvelle newsletter" />
            
            <div className="p-4 container mx-auto space-y-6">
                <div className="flex justify-between items-start">
                    <Heading 
                        title="Nouvelle newsletter" 
                        description="Créez et envoyez une newsletter à vos abonnés"
                    />
                    <Button variant="outline" asChild>
                        <Link href="/admin/newsletters">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contenu</CardTitle>
                                    <CardDescription>
                                        Rédigez le contenu de votre newsletter
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Sujet *</Label>
                                        <Input
                                            id="subject"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            placeholder="Ex: Les dernières tendances mode..."
                                            className={errors.subject ? 'border-red-500' : ''}
                                        />
                                        {errors.subject && (
                                            <p className="text-red-500 text-sm">{errors.subject}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="preview_text">Texte d'aperçu</Label>
                                        <Textarea
                                            id="preview_text"
                                            value={data.preview_text}
                                            onChange={(e) => setData('preview_text', e.target.value)}
                                            placeholder="Ce texte apparaîtra dans l'aperçu de l'email..."
                                            rows={2}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Optionnel. Texte visible dans l'aperçu de l'email avant ouverture.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Contenu de la newsletter *</Label>
                                        <div className="min-h-[400px]">
                                            <TiptapEditor
                                                content={data.content}
                                                onChange={(content) => setData('content', content)}
                                                placeholder="Commencez à rédiger votre newsletter..."
                                            />
                                        </div>
                                        {errors.content && (
                                            <p className="text-red-500 text-sm">{errors.content}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Recipient Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Destinataires
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-4">
                                        <div className="text-3xl font-bold text-primary">{subscriberCount}</div>
                                        <p className="text-sm text-muted-foreground">abonnés actifs</p>
                                    </div>
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/admin/newsletters/subscribers">
                                            Gérer les abonnés
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Schedule */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        Programmation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="schedule-toggle">Programmer l'envoi</Label>
                                        <Switch
                                            id="schedule-toggle"
                                            checked={showSchedule}
                                            onCheckedChange={setShowSchedule}
                                        />
                                    </div>
                                    
                                    {showSchedule && (
                                        <div className="space-y-2">
                                            <Label htmlFor="scheduled_at">Date et heure</Label>
                                            <Input
                                                id="scheduled_at"
                                                type="datetime-local"
                                                value={data.scheduled_at}
                                                onChange={(e) => setData('scheduled_at', e.target.value)}
                                                min={new Date().toISOString().slice(0, 16)}
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button 
                                        type="submit" 
                                        variant="outline" 
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Save className="h-4 w-4 mr-2" />
                                        )}
                                        Sauvegarder brouillon
                                    </Button>

                                    <Button 
                                        type="button"
                                        variant="outline" 
                                        className="w-full"
                                        onClick={handleSendTest}
                                        disabled={sendingTest || !data.subject || !data.content}
                                    >
                                        {sendingTest ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Eye className="h-4 w-4 mr-2" />
                                        )}
                                        Envoyer un test
                                    </Button>

                                    <Button 
                                        type="button"
                                        className="w-full"
                                        onClick={handleSaveAndSend}
                                        disabled={sending || subscriberCount === 0 || !data.subject || !data.content}
                                    >
                                        {sending ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Send className="h-4 w-4 mr-2" />
                                        )}
                                        Envoyer maintenant
                                    </Button>

                                    {subscriberCount === 0 && (
                                        <p className="text-sm text-amber-600 text-center">
                                            Aucun abonné actif
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
