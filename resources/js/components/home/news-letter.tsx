import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2, Check, AlertCircle } from 'lucide-react';
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
                // Reset status after 3 seconds
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
        <section className="py-6">
            <div className="container mx-auto px-4">
                <div className="text-center bg-gradient-to-l from-primary to-chart-3 rounded-xl py-12 px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Inscrivez-vous à notre newsletter</h2>
                    <p className="text-gray-100 mb-8 text-lg">Recevez nos dernières offres et nouvelles tendances directement dans votre boîte mail</p>

                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-0 max-w-lg mx-auto">
                        <Input
                            type="email"
                            placeholder="Votre adresse email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={status === 'loading' || status === 'success'}
                            className="px-4 py-3 rounded-l-md flex-grow focus:outline-none focus:ring-2 focus:ring-white/20 sm:rounded-r-none text-black font-extrabold placeholder:text-white"
                        />
                        <Button 
                            type="submit"
                            disabled={status === 'loading' || status === 'success'}
                            className={`px-6 py-3 font-medium rounded-md sm:rounded-l-none transition-colors ${
                                status === 'success' 
                                    ? 'bg-green-500 hover:bg-green-500 text-white' 
                                    : 'bg-white text-primary hover:bg-gray-100'
                            }`}
                        >
                            {status === 'loading' && (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Inscription...
                                </>
                            )}
                            {status === 'success' && (
                                <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Inscrit !
                                </>
                            )}
                            {status === 'error' && (
                                <>
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    Réessayer
                                </>
                            )}
                            {status === 'idle' && "S'inscrire"}
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default NewsLetter;
