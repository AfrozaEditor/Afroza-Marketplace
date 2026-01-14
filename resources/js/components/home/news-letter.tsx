import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2, Check, AlertCircle, Mail, Gift, Bell, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

type SubscriptionStatus = 'idle' | 'loading' | 'success' | 'error';

function NewsLetter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<SubscriptionStatus>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email || !email.includes('@')) {
            toast.error('Veuillez entrer une adresse email valide.');
            return;
        }

        setStatus('loading');
        
        router.post('/newsletter/subscribe', { email }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setStatus('success');
                setEmail('');
                toast.success('Merci ! Vous êtes maintenant inscrit à notre newsletter.');
                setTimeout(() => setStatus('idle'), 3000);
            },
            onError: (errors: any) => {
                setStatus('error');
                if (errors.email) {
                    toast.error(errors.email);
                } else {
                    toast.error('Une erreur est survenue. Veuillez réessayer.');
                }
                setTimeout(() => setStatus('idle'), 3000);
            },
        });
    };

    return (
        <section className="py-16 relative overflow-hidden">
            {/* Background avec motif */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-purple-600" />
            
            {/* Éléments décoratifs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white/30 rounded-full animate-ping" />
                <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-white/40 rounded-full animate-pulse" />
            </div>

            <div className="container mx-auto px-4 relative">
                <div className="max-w-4xl mx-auto">
                    {/* Avantages */}
                    <div className="flex flex-wrap justify-center gap-6 mb-8">
                        {[
                            { icon: Gift, text: 'Offres exclusives' },
                            { icon: Bell, text: 'Alertes nouveautés' },
                            { icon: Sparkles, text: 'Promotions VIP' },
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-white/90">
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Titre */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Restez informé des meilleures offres
                        </h2>
                        <p className="text-white/90 text-lg max-w-xl mx-auto">
                            Inscrivez-vous à notre newsletter et recevez en avant-première nos promotions et nouveautés
                        </p>
                    </div>

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                        <div className="relative flex-grow">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="email"
                                placeholder="Entrez votre adresse email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={status === 'loading' || status === 'success'}
                                className="pl-12 pr-4 py-6 rounded-xl w-full bg-white/95 border-0 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-white/50 text-base"
                            />
                        </div>
                        <Button 
                            type="submit"
                            disabled={status === 'loading' || status === 'success'}
                            size="lg"
                            className={`px-8 py-6 rounded-xl font-semibold transition-all ${
                                status === 'success' 
                                    ? 'bg-green-500 hover:bg-green-500 text-white' 
                                    : 'bg-white text-primary hover:bg-gray-100 hover:scale-105'
                            }`}
                        >
                            {status === 'loading' && (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Inscription...
                                </>
                            )}
                            {status === 'success' && (
                                <>
                                    <Check className="h-5 w-5 mr-2" />
                                    Inscrit !
                                </>
                            )}
                            {status === 'error' && (
                                <>
                                    <AlertCircle className="h-5 w-5 mr-2" />
                                    Réessayer
                                </>
                            )}
                            {status === 'idle' && "S'inscrire"}
                        </Button>
                    </form>

                    {/* Note de confidentialité */}
                    <p className="text-center text-white/70 text-sm mt-6">
                        🔒 Vos données sont protégées. Désinscription possible à tout moment.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default NewsLetter;
