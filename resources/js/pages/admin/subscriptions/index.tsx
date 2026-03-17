import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formatDate, formatPrice } from '@/lib/utils';
import { Subscription, SubscriptionPlan } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Check, CheckCircle, Clock, Loader2, MoreHorizontal, X, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    subscriptions: PaginatedData<Subscription>;
    statusCounts: {
        all: number;
        pending: number;
        active: number;
        rejected: number;
    };
    currentStatus: string;
    plans: SubscriptionPlan[];
}

const statusConfig: Record<string, { label: string; className: string }> = {
    active: { label: 'Actif', className: 'bg-green-100 text-green-800' },
    pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
    expired: { label: 'Expiré', className: 'bg-gray-100 text-gray-800' },
    cancelled: { label: 'Annulé', className: 'bg-gray-100 text-gray-800' },
    rejected: { label: 'Rejeté', className: 'bg-red-100 text-red-800' },
};

export default function AdminSubscriptions({ subscriptions, statusCounts, currentStatus, plans }: Props) {
    const [rejectDialog, setRejectDialog] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);

    const filterByStatus = (status: string) => {
        router.get(route('admin.subscriptions.index'), { status }, { preserveState: true });
    };

    const handleApprove = (subscription: Subscription) => {
        setProcessing(true);
        router.post(
            route('admin.subscriptions.approve', subscription.id),
            {},
            {
                onSuccess: () => toast.success('Abonnement approuvé avec succès.'),
                onError: () => toast.error('Une erreur est survenue.'),
                onFinish: () => setProcessing(false),
            },
        );
    };

    const openRejectDialog = (subscription: Subscription) => {
        setSelectedSubscription(subscription);
        setRejectionReason('');
        setRejectDialog(true);
    };

    const handleReject = () => {
        if (!selectedSubscription || !rejectionReason.trim()) return;
        setProcessing(true);
        router.post(
            route('admin.subscriptions.reject', selectedSubscription.id),
            { rejection_reason: rejectionReason },
            {
                onSuccess: () => {
                    toast.success('Demande rejetée.');
                    setRejectDialog(false);
                },
                onError: () => toast.error('Une erreur est survenue.'),
                onFinish: () => setProcessing(false),
            },
        );
    };

    const statusFilters = [
        { key: 'all', label: 'Tous', count: statusCounts.all, icon: <CheckCircle className="h-4 w-4" /> },
        { key: 'pending', label: 'En attente', count: statusCounts.pending, icon: <Clock className="h-4 w-4 text-yellow-600" /> },
        { key: 'active', label: 'Actifs', count: statusCounts.active, icon: <Check className="h-4 w-4 text-green-600" /> },
        { key: 'rejected', label: 'Rejetés', count: statusCounts.rejected, icon: <XCircle className="h-4 w-4 text-red-600" /> },
    ];

    return (
        <AppLayout>
            <Head title="Gestion des Abonnements" />
            <div className="container mx-auto p-4 space-y-6">
                <Heading
                    title="Gestion des Abonnements"
                    description="Approuver ou rejeter les demandes d'abonnement des vendeurs."
                />

                {/* Status Filter Cards */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {statusFilters.map((filter) => (
                        <Card
                            key={filter.key}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                                currentStatus === filter.key ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => filterByStatus(filter.key)}
                        >
                            <CardContent className="flex items-center gap-3 p-4">
                                {filter.icon}
                                <div>
                                    <p className="text-sm font-medium">{filter.label}</p>
                                    <p className="text-2xl font-bold">{filter.count}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Vendeur</TableHead>
                                    <TableHead>Plan demandé</TableHead>
                                    <TableHead className="hidden md:table-cell">Plan actuel</TableHead>
                                    <TableHead className="hidden md:table-cell">Date</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subscriptions.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            Aucun abonnement trouvé.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {subscriptions.data.map((sub) => {
                                    const status = statusConfig[sub.status] ?? {
                                        label: sub.status,
                                        className: 'bg-gray-100 text-gray-800',
                                    };
                                    return (
                                        <TableRow key={sub.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{sub.user?.name}</p>
                                                    <p className="text-xs text-muted-foreground">{sub.user?.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={
                                                        sub.plan.slug === 'enterprise'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : sub.plan.slug === 'pro'
                                                              ? 'bg-blue-100 text-blue-800'
                                                              : 'bg-gray-100 text-gray-800'
                                                    }
                                                >
                                                    {sub.plan.name}
                                                </Badge>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {formatPrice(sub.plan.price)}/mois
                                                </p>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {sub.user_active_plan ? (
                                                    <Badge variant="outline">{sub.user_active_plan.name}</Badge>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <p className="text-sm">
                                                    {sub.requested_at
                                                        ? formatDate(sub.requested_at)
                                                        : formatDate(sub.created_at)}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={status.className}>{status.label}</Badge>
                                                {sub.rejection_reason && (
                                                    <p className="text-xs text-red-600 mt-1 max-w-[200px] truncate" title={sub.rejection_reason}>
                                                        {sub.rejection_reason}
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {sub.status === 'pending' ? (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() => handleApprove(sub)}
                                                                className="text-green-700"
                                                            >
                                                                <Check className="mr-2 h-4 w-4" />
                                                                Approuver
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => openRejectDialog(sub)}
                                                                className="text-red-700"
                                                            >
                                                                <X className="mr-2 h-4 w-4" />
                                                                Rejeter
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {subscriptions.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {subscriptions.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Reject Dialog */}
            <Dialog open={rejectDialog} onOpenChange={setRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rejeter la demande d'abonnement</DialogTitle>
                        <DialogDescription>
                            Rejeter la demande de {selectedSubscription?.user?.name} pour le plan{' '}
                            {selectedSubscription?.plan.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {selectedSubscription?.notes && (
                            <div className="rounded-md bg-muted p-3">
                                <p className="text-sm font-medium mb-1">Message du vendeur :</p>
                                <p className="text-sm text-muted-foreground">{selectedSubscription.notes}</p>
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Motif du rejet *</label>
                            <Textarea
                                placeholder="Indiquez le motif du rejet..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialog(false)}>
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={!rejectionReason.trim() || processing}
                        >
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Rejeter
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
