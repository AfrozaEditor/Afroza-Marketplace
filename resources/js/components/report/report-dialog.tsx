import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Flag, AlertTriangle, ShieldAlert, Megaphone, CircleAlert, HelpCircle, FileWarning } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface ReportDialogProps {
    type: 'product' | 'shop';
    targetId: number;
    targetSlug?: string;
    targetName: string;
    trigger?: React.ReactNode;
}

const REASONS = [
    { value: 'contrefacon', label: 'Contrefaçon / Article non authentique', icon: ShieldAlert, color: 'text-red-500' },
    { value: 'inapproprie', label: 'Contenu inapproprié', icon: AlertTriangle, color: 'text-orange-500' },
    { value: 'spam', label: 'Spam ou publicité', icon: Megaphone, color: 'text-yellow-500' },
    { value: 'fraude', label: 'Fraude ou arnaque suspectée', icon: CircleAlert, color: 'text-red-600' },
    { value: 'non_conforme', label: 'Description non conforme', icon: FileWarning, color: 'text-blue-500' },
    { value: 'autre', label: 'Autre raison', icon: HelpCircle, color: 'text-gray-500' },
];

export function ReportDialog({ type, targetId, targetSlug, targetName, trigger }: ReportDialogProps) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        if (!reason) {
            toast.error('Veuillez sélectionner une raison');
            return;
        }

        setIsSubmitting(true);

        const routeName = type === 'product' ? 'products.report' : 'shops.report';
        const routeParams = type === 'product' ? { product: targetId } : { shop: targetId };

        router.post(route(routeName, routeParams), {
            reason,
            description: description || null,
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                const flash = page.props.flash as { type: string; message: string } | undefined;
                if (flash?.type === 'success') {
                    toast.success(flash.message);
                } else if (flash?.type === 'error') {
                    toast.error(flash.message);
                }
                setOpen(false);
                setReason('');
                setDescription('');
            },
            onError: () => {
                toast.error('Une erreur est survenue lors du signalement');
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                        <Flag className="h-4 w-4 mr-2" />
                        Signaler
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Flag className="h-5 w-5 text-red-500" />
                        Signaler {type === 'product' ? 'ce produit' : 'cette boutique'}
                    </DialogTitle>
                    <DialogDescription>
                        Vous signalez <span className="font-medium text-gray-900 dark:text-white">{targetName}</span>.
                        Veuillez sélectionner la raison de votre signalement.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Raison du signalement *</Label>
                        <RadioGroup value={reason} onValueChange={setReason} className="space-y-2">
                            {REASONS.map((r) => (
                                <div
                                    key={r.value}
                                    className={cn(
                                        "flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer",
                                        reason === r.value
                                            ? "border-primary bg-primary/5"
                                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                    )}
                                    onClick={() => setReason(r.value)}
                                >
                                    <RadioGroupItem value={r.value} id={r.value} />
                                    <r.icon className={cn("h-5 w-5", r.color)} />
                                    <Label htmlFor={r.value} className="flex-1 cursor-pointer text-sm">
                                        {r.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                            Description (optionnel)
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Décrivez plus en détail le problème..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[100px] resize-none"
                            maxLength={1000}
                        />
                        <p className="text-xs text-gray-500 text-right">
                            {description.length}/1000 caractères
                        </p>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!reason || isSubmitting}
                        className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="animate-spin mr-2">⏳</span>
                                Envoi en cours...
                            </>
                        ) : (
                            <>
                                <Flag className="h-4 w-4 mr-2" />
                                Envoyer le signalement
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
