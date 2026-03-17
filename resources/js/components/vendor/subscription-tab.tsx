import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { formatPrice } from '@/lib/utils';
import { SubscriptionData, SubscriptionPlan } from '@/types';
import { router } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Crown, Loader2, Sparkles, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    subscription: SubscriptionData;
}

function PlanCard({
    plan,
    isCurrent,
    isPending,
    hasPending,
    onUpgrade,
}: {
    plan: SubscriptionPlan;
    isCurrent: boolean;
    isPending: boolean;
    hasPending: boolean;
    onUpgrade: (plan: SubscriptionPlan) => void;
}) {
    const features = [
        {
            label: plan.product_limit ? `${plan.product_limit} produits` : 'Produits illimités',
            included: true,
        },
        { label: `${plan.commission_rate}% de commission`, included: true },
        { label: `Badge "${plan.badge_label}"`, included: plan.has_badge },
        { label: 'Priorité dans la recherche', included: plan.priority_search },
        { label: 'Mise en avant', included: plan.featured_placement },
        { label: 'Support dédié', included: plan.dedicated_support },
    ];

    const planIcon =
        plan.slug === 'enterprise' ? (
            <Sparkles className="h-6 w-6 text-purple-500" />
        ) : plan.slug === 'pro' ? (
            <Zap className="h-6 w-6 text-blue-500" />
        ) : (
            <Crown className="h-6 w-6 text-gray-500" />
        );

    return (
        <Card
            className={`relative flex flex-col ${
                isCurrent ? 'ring-2 ring-primary' : ''
            } ${plan.slug === 'pro' ? 'border-primary shadow-lg' : ''}`}
        >
            {plan.slug === 'pro' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Recommandé</Badge>
                </div>
            )}
            {isCurrent && (
                <div className="absolute -top-3 right-4">
                    <Badge variant="outline" className="bg-background">
                        Plan actuel
                    </Badge>
                </div>
            )}
            <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-2">{planIcon}</div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4">
                    <span className="text-3xl font-bold">
                        {plan.price === 0 ? 'Gratuit' : formatPrice(plan.price)}
                    </span>
                    {plan.price > 0 && <span className="text-sm text-muted-foreground"> /mois</span>}
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 flex-1">
                    {features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                            {f.included ? (
                                <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                            ) : (
                                <X className="h-4 w-4 shrink-0 text-gray-300" />
                            )}
                            <span className={!f.included ? 'text-muted-foreground' : ''}>{f.label}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-6">
                    {isCurrent ? (
                        <Button disabled className="w-full" variant="outline">
                            Plan actuel
                        </Button>
                    ) : isPending ? (
                        <Button disabled variant="outline" className="w-full">
                            Demande en cours...
                        </Button>
                    ) : (
                        <Button
                            onClick={() => onUpgrade(plan)}
                            className="w-full"
                            variant={plan.slug === 'pro' ? 'default' : 'outline'}
                            disabled={hasPending}
                        >
                            Demander l'upgrade
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default function SubscriptionTab({ subscription }: Props) {
    const [upgradeDialog, setUpgradeDialog] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
    const [notes, setNotes] = useState('');
    const [processing, setProcessing] = useState(false);

    const { current_plan, pending_request, available_plans, product_count, remaining_slots } = subscription;

    const handleUpgrade = (plan: SubscriptionPlan) => {
        setSelectedPlan(plan);
        setNotes('');
        setUpgradeDialog(true);
    };

    const submitUpgrade = () => {
        if (!selectedPlan) return;
        setProcessing(true);

        router.post(
            route('vendor.subscription.request-upgrade'),
            {
                plan_id: selectedPlan.id,
                notes: notes || null,
            },
            {
                onSuccess: () => {
                    toast.success('Votre demande d\'upgrade a été envoyée.');
                    setUpgradeDialog(false);
                },
                onError: (errors) => {
                    const msg = errors.upgrade || 'Une erreur est survenue.';
                    toast.error(msg);
                },
                onFinish: () => setProcessing(false),
            },
        );
    };

    const cancelRequest = () => {
        router.post(route('vendor.subscription.cancel-request'), {}, {
            onSuccess: () => toast.success('Votre demande a été annulée.'),
            onError: () => toast.error('Une erreur est survenue.'),
        });
    };

    const usagePercent =
        current_plan && current_plan.product_limit
            ? Math.min(100, Math.round((product_count / current_plan.product_limit) * 100))
            : 0;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Mon Abonnement</h2>

            {/* Current Plan Card */}
            {current_plan && (
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-lg">Plan {current_plan.name}</CardTitle>
                                {current_plan.has_badge && (
                                    <Badge
                                        className={
                                            current_plan.slug === 'enterprise'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }
                                    >
                                        {current_plan.badge_label}
                                    </Badge>
                                )}
                            </div>
                            <Badge variant="outline" className="text-green-700 border-green-300">
                                Actif
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {/* Product Usage */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">Produits publiés</p>
                                <p className="text-2xl font-bold">
                                    {product_count}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        {' '}
                                        / {current_plan.product_limit ?? '∞'}
                                    </span>
                                </p>
                                {current_plan.product_limit && (
                                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                        <div
                                            className={`h-2 rounded-full transition-all ${
                                                usagePercent >= 90
                                                    ? 'bg-red-500'
                                                    : usagePercent >= 70
                                                      ? 'bg-yellow-500'
                                                      : 'bg-green-500'
                                            }`}
                                            style={{ width: `${usagePercent}%` }}
                                        />
                                    </div>
                                )}
                                {remaining_slots !== null && remaining_slots <= 3 && remaining_slots > 0 && (
                                    <p className="text-xs text-yellow-600">
                                        Plus que {remaining_slots} emplacement{remaining_slots > 1 ? 's' : ''} disponible{remaining_slots > 1 ? 's' : ''}
                                    </p>
                                )}
                                {remaining_slots === 0 && (
                                    <p className="text-xs text-red-600">Limite atteinte – Passez au plan supérieur</p>
                                )}
                            </div>

                            {/* Commission Rate */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">Taux de commission</p>
                                <p className="text-2xl font-bold">{current_plan.commission_rate}%</p>
                                <p className="text-xs text-muted-foreground">Sur chaque vente</p>
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">Tarif mensuel</p>
                                <p className="text-2xl font-bold">
                                    {current_plan.price === 0 ? 'Gratuit' : formatPrice(current_plan.price)}
                                </p>
                                {current_plan.price > 0 && (
                                    <p className="text-xs text-muted-foreground">Par mois</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Pending Request Alert */}
            {pending_request && (
                <Card className="border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20">
                    <CardContent className="flex items-start gap-3 pt-6">
                        <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="font-medium text-yellow-800 dark:text-yellow-200">
                                Demande d'upgrade en attente
                            </p>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                Vous avez demandé un upgrade vers le plan{' '}
                                <strong>{pending_request.plan.name}</strong>. Un administrateur traitera
                                votre demande prochainement.
                            </p>
                            {pending_request.notes && (
                                <p className="text-sm text-yellow-600 mt-1">
                                    Votre message : « {pending_request.notes} »
                                </p>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-3 border-yellow-400 text-yellow-800 hover:bg-yellow-100"
                                onClick={cancelRequest}
                            >
                                Annuler la demande
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Rejected Request Alert */}
            {subscription.subscription?.status === 'active' &&
                (() => {
                    // Check if there's a recently rejected request (show info)
                    return null;
                })()}

            {/* Plans Comparison */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Comparer les plans</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {available_plans.map((plan) => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            isCurrent={current_plan?.id === plan.id}
                            isPending={pending_request?.plan.id === plan.id}
                            hasPending={!!pending_request}
                            onUpgrade={handleUpgrade}
                        />
                    ))}
                </div>
            </div>

            {/* Upgrade Request Dialog */}
            <Dialog open={upgradeDialog} onOpenChange={setUpgradeDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Demander l'upgrade vers {selectedPlan?.name}</DialogTitle>
                        <DialogDescription>
                            Votre demande sera envoyée à un administrateur pour validation. Le paiement se
                            fait directement avec l'équipe Afroza.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedPlan && (
                        <div className="space-y-4">
                            <Card className="bg-muted/50">
                                <CardContent className="pt-4 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{selectedPlan.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedPlan.product_limit
                                                    ? `${selectedPlan.product_limit} produits`
                                                    : 'Produits illimités'}
                                                {' · '}
                                                {selectedPlan.commission_rate}% commission
                                            </p>
                                        </div>
                                        <p className="text-lg font-bold">
                                            {formatPrice(selectedPlan.price)}
                                            <span className="text-sm font-normal text-muted-foreground"> /mois</span>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Message (optionnel)</label>
                                <Textarea
                                    placeholder="Ajoutez un message pour l'administrateur..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUpgradeDialog(false)}>
                            Annuler
                        </Button>
                        <Button onClick={submitUpgrade} disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Envoyer la demande
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
