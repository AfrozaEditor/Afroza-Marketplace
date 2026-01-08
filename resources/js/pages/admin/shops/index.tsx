import Heading from '@/components/heading';
import DataTable from '@/components/dt-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Eye,
    Filter, 
    MoreVertical, 
    Search, 
    Store,
    Trash, 
    Package,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    ShieldCheck,
    ShieldX,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface ShopData {
    id: number;
    name: string;
    slug: string;
    email: string;
    phone?: string;
    city?: string;
    logo?: string;
    is_approved: boolean;
    approved_at?: string;
    rejection_reason?: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    products_count: number;
    followers_count: number;
    reviews_count: number;
    created_at: string;
}

interface Props {
    shops: {
        data: ShopData[];
        links: any;
        meta?: any;
    };
    stats: {
        total_shops: number;
        approved_shops: number;
        pending_shops: number;
        rejected_shops: number;
        total_products: number;
        active_products: number;
    };
    filters: {
        search: string;
        approval: string;
        sort: string;
        dir: string;
    };
}

const Index = ({ shops, stats, filters }: Props) => {
    const [searchQuery, setSearchQuery] = useState(filters.search);
    const [approvalFilter, setApprovalFilter] = useState(filters.approval || 'all');
    const [sortField, setSortField] = useState<keyof ShopData | null>(filters.sort as keyof ShopData || null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(filters.dir as 'asc' | 'desc' || 'desc');
    const [deleteShop, setDeleteShop] = useState<ShopData | null>(null);
    const [rejectShop, setRejectShop] = useState<ShopData | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [visibleColumns, setVisibleColumns] = useState({
        Id: true,
        Logo: true,
        Boutique: true,
        Propriétaire: true,
        Ville: true,
        Produits: true,
        Abonnés: true,
        Approbation: true,
        'Date de création': true,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tableau de bord', href: '/admin' },
        { title: 'Boutiques', href: '/admin/shops' },
    ];

    // Filtrage local
    const filteredShops = useMemo(() => {
        let result = [...shops.data];

        if (searchQuery) {
            result = result.filter((shop) =>
                shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                shop.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                shop.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                shop.user.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (approvalFilter && approvalFilter !== 'all') {
            result = result.filter((shop) => {
                if (approvalFilter === 'approved') return shop.is_approved;
                if (approvalFilter === 'pending') return !shop.is_approved && !shop.rejection_reason;
                if (approvalFilter === 'rejected') return !shop.is_approved && shop.rejection_reason;
                return true;
            });
        }

        if (sortField) {
            result.sort((a, b) => {
                const aValue = a[sortField];
                const bValue = b[sortField];

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
                }
                return 0;
            });
        }

        return result;
    }, [shops.data, searchQuery, approvalFilter, sortField, sortDirection]);

    const handleSort = (field: keyof ShopData) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleDelete = () => {
        if (!deleteShop) return;
        
        setIsDeleting(true);
        router.delete(`/admin/shops/${deleteShop.id}`, {
            onSuccess: () => {
                toast.success('Boutique supprimée avec succès');
                setDeleteShop(null);
            },
            onError: () => {
                toast.error('Erreur lors de la suppression');
            },
            onFinish: () => {
                setIsDeleting(false);
            }
        });
    };

    const handleApprove = (shop: ShopData) => {
        setIsProcessing(true);
        router.post(`/admin/shops/${shop.id}/approve`, {}, {
            preserveState: true,
            onSuccess: () => {
                toast.success('Boutique approuvée avec succès');
            },
            onError: () => {
                toast.error('Erreur lors de l\'approbation');
            },
            onFinish: () => {
                setIsProcessing(false);
            }
        });
    };

    const handleReject = () => {
        if (!rejectShop) return;
        
        setIsProcessing(true);
        router.post(`/admin/shops/${rejectShop.id}/reject`, {
            reason: rejectionReason,
        }, {
            preserveState: true,
            onSuccess: () => {
                toast.success('Boutique rejetée');
                setRejectShop(null);
                setRejectionReason('');
            },
            onError: () => {
                toast.error('Erreur lors du rejet');
            },
            onFinish: () => {
                setIsProcessing(false);
            }
        });
    };

    const getApprovalStatus = (shop: ShopData) => {
        if (shop.is_approved) {
            return { label: 'Approuvée', variant: 'default' as const, icon: CheckCircle };
        }
        if (shop.rejection_reason) {
            return { label: 'Rejetée', variant: 'destructive' as const, icon: XCircle };
        }
        return { label: 'En attente', variant: 'secondary' as const, icon: Clock };
    };

    const columns = [
        {
            title: 'Id',
            accessor: 'id' as const,
            sortable: true,
            className: 'w-[60px]',
        },
        {
            title: 'Logo',
            accessor: (shop: ShopData) => (
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                    {shop.logo ? (
                        <img 
                            src={shop.logo.startsWith('http') ? shop.logo : `/storage/${shop.logo}`} 
                            alt={shop.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Store className="w-5 h-5 text-gray-400" />
                    )}
                </div>
            ),
            sortable: false,
            className: 'w-[60px]',
        },
        {
            title: 'Boutique',
            accessor: (shop: ShopData) => (
                <div>
                    <Link 
                        href={`/shops/${shop.slug}`}
                        className="font-medium hover:underline"
                    >
                        {shop.name}
                    </Link>
                    {shop.email && (
                        <p className="text-sm text-muted-foreground">{shop.email}</p>
                    )}
                </div>
            ),
            sortable: true,
        },
        {
            title: 'Propriétaire',
            accessor: (shop: ShopData) => (
                <div>
                    <p className="font-medium">{shop.user.name}</p>
                    <p className="text-sm text-muted-foreground">{shop.user.email}</p>
                </div>
            ),
            sortable: false,
        },
        {
            title: 'Ville',
            accessor: (shop: ShopData) => shop.city || '-',
            sortable: true,
        },
        {
            title: 'Produits',
            accessor: (shop: ShopData) => (
                <Badge variant="secondary">
                    <Package className="w-3 h-3 mr-1" />
                    {shop.products_count}
                </Badge>
            ),
            sortable: true,
        },
        {
            title: 'Abonnés',
            accessor: (shop: ShopData) => (
                <Badge variant="outline">
                    <Users className="w-3 h-3 mr-1" />
                    {shop.followers_count}
                </Badge>
            ),
            sortable: true,
        },
        {
            title: 'Approbation',
            accessor: (shop: ShopData) => {
                const status = getApprovalStatus(shop);
                const Icon = status.icon;
                return (
                    <div className="flex flex-col gap-1">
                        <Badge variant={status.variant} className="flex items-center gap-1 w-fit">
                            <Icon className="w-3 h-3" />
                            {status.label}
                        </Badge>
                        {shop.rejection_reason && (
                            <span className="text-xs text-destructive truncate max-w-[150px]" title={shop.rejection_reason}>
                                {shop.rejection_reason}
                            </span>
                        )}
                    </div>
                );
            },
            sortable: false,
        },
        {
            title: 'Date de création',
            accessor: (shop: ShopData) => formatDate(shop.created_at),
            sortable: true,
            className: 'w-[150px]',
        },
    ];

    const renderActions = (shop: ShopData) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={`/shops/${shop.slug}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir la boutique
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/admin/products?shop_id=${shop.id}`}>
                        <Package className="mr-2 h-4 w-4" />
                        Voir les produits
                    </Link>
                </DropdownMenuItem>
                
                {/* Actions d'approbation */}
                {!shop.is_approved && (
                    <DropdownMenuItem 
                        onClick={() => handleApprove(shop)}
                        disabled={isProcessing}
                        className="text-green-600 focus:text-green-600"
                    >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Approuver
                    </DropdownMenuItem>
                )}
                {!shop.rejection_reason && (
                    <DropdownMenuItem 
                        onClick={() => setRejectShop(shop)}
                        className="text-orange-600 focus:text-orange-600"
                    >
                        <ShieldX className="mr-2 h-4 w-4" />
                        Rejeter
                    </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDeleteShop(shop)}
                >
                    <Trash className="mr-2 h-4 w-4" />
                    Supprimer
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des boutiques" />

            <div className="container p-4 mx-auto">
                <Heading title="Gestion des boutiques" description="Gérez toutes les boutiques de la plateforme" />

                {/* Statistiques */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 my-6">
                    <div className="bg-card rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Store className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Total</p>
                                <p className="text-xl font-bold">{stats.total_shops}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Approuvées</p>
                                <p className="text-xl font-bold">{stats.approved_shops}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-500/10 rounded-lg">
                                <Clock className="h-5 w-5 text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">En attente</p>
                                <p className="text-xl font-bold">{stats.pending_shops}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <XCircle className="h-5 w-5 text-red-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Rejetées</p>
                                <p className="text-xl font-bold">{stats.rejected_shops}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Package className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Total produits</p>
                                <p className="text-xl font-bold">{stats.total_products}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <Package className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Produits actifs</p>
                                <p className="text-xl font-bold">{stats.active_products}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recherche et filtres */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher une boutique..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={approvalFilter} onValueChange={setApprovalFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Approbation" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes</SelectItem>
                            <SelectItem value="approved">Approuvées</SelectItem>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="rejected">Rejetées</SelectItem>
                        </SelectContent>
                    </Select>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" />
                                Colonnes
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {Object.keys(visibleColumns).map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column}
                                    checked={visibleColumns[column as keyof typeof visibleColumns]}
                                    onCheckedChange={(checked) =>
                                        setVisibleColumns((prev) => ({
                                            ...prev,
                                            [column]: checked,
                                        }))
                                    }
                                >
                                    {column}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Table */}
                <DataTable
                    columns={columns}
                    filteredTickets={filteredShops}
                    visibleColumns={visibleColumns}
                    handleSort={handleSort}
                    renderActions={renderActions}
                />

                {/* Dialog de confirmation de suppression */}
                <Dialog open={!!deleteShop} onOpenChange={(open) => !open && setDeleteShop(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Supprimer la boutique</DialogTitle>
                            <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer la boutique <strong>"{deleteShop?.name}"</strong> ?
                                <br /><br />
                                <span className="text-destructive font-medium">
                                    Attention : Cette action supprimera également tous les produits 
                                    ({deleteShop?.products_count} produit{deleteShop?.products_count !== 1 ? 's' : ''}) 
                                    associés à cette boutique.
                                </span>
                                <br /><br />
                                Cette action est irréversible.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setDeleteShop(null)}
                                disabled={isDeleting}
                            >
                                Annuler
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Suppression...' : 'Supprimer'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Dialog de rejet */}
                <Dialog open={!!rejectShop} onOpenChange={(open) => !open && setRejectShop(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Rejeter la boutique</DialogTitle>
                            <DialogDescription>
                                Vous êtes sur le point de rejeter la boutique <strong>"{rejectShop?.name}"</strong>.
                                Veuillez indiquer la raison du rejet.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Label htmlFor="rejection-reason">Raison du rejet</Label>
                            <Textarea
                                id="rejection-reason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Expliquez pourquoi cette boutique est rejetée..."
                                className="mt-2"
                                rows={3}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setRejectShop(null);
                                    setRejectionReason('');
                                }}
                                disabled={isProcessing}
                            >
                                Annuler
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleReject}
                                disabled={isProcessing || !rejectionReason.trim()}
                            >
                                {isProcessing ? 'Traitement...' : 'Rejeter'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
};

export default Index;
