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
import { Badge } from '@/components/ui/badge';
import TiptapEditor from '@/components/TiptapEditor';
import { 
    ArrowLeft,
    Save,
    Eye,
    Send,
    Clock,
    Loader2,
    Users,
    CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { BreadcrumbItem } from '@/types';
import { formatDate } from '@/lib/utils';

interface Newsletter {
    id: number;
    subject: string;
    preview_text: string | null;
    content: string;
    status: 'draft' | 'scheduled' | 'sending' | 'sent';
    scheduled_at: string | null;
    sent_at: string | null;
    recipients_count: number;
    opened_count: number;
    clicked_count: number;
    created_at: string;
}

interface Props {
    newsletter: Newsletter;
    subscriberCount: number;
}

export default function Edit({ newsletter, subscriberCount }: Props) {
    const [showSchedule, setShowSchedule] = useState(!!newsletter.scheduled_at);
    const [sending, setSending] = useState(false);
    const [sendingTest, setSendingTest] = useState(false);
    
    const { data, setData, put, processing, errors } = useForm({
        subject: newsletter.subject,
        preview_text: newsletter.preview_text || '',
        content: newsletter.content,
        scheduled_at: newsletter.scheduled_at ? newsletter.scheduled_at.slice(0, 16) : '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tableau de bord', href: '/admin' },
        { title: 'Newsletters', href: '/admin/newsletters' },
        { title: 'Modifier', href: `/admin/newsletters/${newsletter.id}/edit` },
    ];

    const isSent = newsletter.status === 'sent';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        put(`/admin/newsletters/${newsletter.id}`, {
            onSuccess: () => {
                toast.success('Newsletter mise à jour.');
            },
            onError: () => {
                toast.error('Erreur lors de la sauvegarde.');
            },
        });
    };

    const handleSend = () => {
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
        
        router.post(`/admin/newsletters/${newsletter.id}/send`, {}, {
            onSuccess: () => {
                toast.success('Newsletter envoyée avec succès !');
            },
            onError: () => {
                toast.error('Erreur lors de l\'envoi.');
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

    const getStatusBadge = () => {
        switch (newsletter.status) {
            case 'draft':
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Brouillon</Badge>;
            case 'scheduled':
                return <Badge variant="outline" className="bg-blue-100 text-blue-800">Programmée</Badge>;
            case 'sending':
                return <Badge variant="outline" className="bg-purple-100 text-purple-800">En cours d'envoi</Badge>;
            case 'sent':
                return <Badge variant="outline" className="bg-green-100 text-green-800">Envoyée</Badge>;
            default:
                return null;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifier - ${newsletter.subject}`} />
            
            <div className="p-4 container mx-auto space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <Heading 
                            title="Modifier la newsletter" 
                            description={isSent ? "Cette newsletter a déjà été envoyée (lecture seule)" : "Modifiez le contenu de votre newsletter"}
                        />
                        <div className="mt-2">
                            {getStatusBadge()}
                        </div>
                    </div>
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
                                        {isSent ? 'Contenu de la newsletter envoyée' : 'Rédigez le contenu de votre newsletter'}
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
                                            disabled={isSent}
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
                                            disabled={isSent}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Contenu de la newsletter *</Label>
                                        <div className="min-h-[400px]">
                                            <TiptapEditor
                                                content={data.content}
                                                onChange={(content) => setData('content', content)}
                                                placeholder="Commencez à rédiger votre newsletter..."
                                                editable={!isSent}
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
                            {/* Stats for sent newsletters */}
                            {isSent && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            Statistiques
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-3 bg-muted rounded-lg">
                                                <div className="text-2xl font-bold">{newsletter.recipients_count}</div>
                                                <div className="text-sm text-muted-foreground">Destinataires</div>
                                            </div>
                                            <div className="text-center p-3 bg-muted rounded-lg">
                                                <div className="text-2xl font-bold">{newsletter.opened_count}</div>
                                                <div className="text-sm text-muted-foreground">Ouvertures</div>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-semibold">
                                                {newsletter.recipients_count > 0 
                                                    ? Math.round((newsletter.opened_count / newsletter.recipients_count) * 100) 
                                                    : 0}% 
                                                <span className="text-sm font-normal text-muted-foreground">taux d'ouverture</span>
                                            </div>
                                        </div>
                                        {newsletter.sent_at && (
                                            <div className="text-sm text-center text-muted-foreground">
                                                Envoyée le {formatDate(newsletter.sent_at)}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Recipient Info */}
                            {!isSent && (
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
                                    </CardContent>
                                </Card>
                            )}

                            {/* Schedule (only for non-sent) */}
                            {!isSent && (
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
                            )}

                            {/* Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button 
                                        type="button"
                                        variant="outline" 
                                        className="w-full"
                                        asChild
                                    >
                                        <a href={`/admin/newsletters/${newsletter.id}/preview`} target="_blank">
                                            <Eye className="h-4 w-4 mr-2" />
                                            Aperçu
                                        </a>
                                    </Button>

                                    {!isSent && (
                                        <>
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
                                                Sauvegarder
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
                                                onClick={handleSend}
                                                disabled={sending || subscriberCount === 0 || !data.subject || !data.content}
                                            >
                                                {sending ? (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Send className="h-4 w-4 mr-2" />
                                                )}
                                                Envoyer maintenant
                                            </Button>
                                        </>
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
