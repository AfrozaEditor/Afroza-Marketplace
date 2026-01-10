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
import { formatDate, formatPrice } from '@/lib/utils';
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
    ToggleLeft,
    ToggleRight,
    Heart,
    Star,
    Image as ImageIcon,
    CheckCircle,
    XCircle,
    Clock,
    ShieldCheck,
    ShieldX,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface ProductImage {
    id: number;
    url: string;
}

interface ProductData {
    id: number;
    name: string;
    slug: string;
    description?: string;
    price: number;
    quantity: number;
    active: boolean;
    is_approved: boolean;
    approved_at?: string;
    rejection_reason?: string;
    shop?: {
        id: number;
        name: string;
        slug: string;
    };
    user?: {
        id: number;
        name: string;
        email: string;
    };
    category?: {
        id: number;
        name: string;
    };
    images: ProductImage[];
    reviews_count: number;
    favorites_count: number;
    created_at: string;
}

interface Props {
    products: {
        data: ProductData[];
        links: any;
        meta?: any;
    };
    stats: {
        total_products: number;
        active_products: number;
        inactive_products: number;
        approved_products: number;
        pending_products: number;
        rejected_products: number;
    };
    filters: {
        search: string;
        status: string;
        approval: string;
        shop_id: string;
        sort: string;
        dir: string;
    };
}

const Index = ({ products, stats, filters }: Props) => {
    const [searchQuery, setSearchQuery] = useState(filters.search);
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [approvalFilter, setApprovalFilter] = useState(filters.approval || 'all');
    const [sortField, setSortField] = useState<keyof ProductData | null>(filters.sort as keyof ProductData || null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(filters.dir as 'asc' | 'desc' || 'desc');
    const [deleteProduct, setDeleteProduct] = useState<ProductData | null>(null);
    const [rejectProduct, setRejectProduct] = useState<ProductData | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [visibleColumns, setVisibleColumns] = useState({
        Id: true,
        Image: true,
        Produit: true,
        Boutique: true,
        Catégorie: true,
        Prix: true,
        Stock: true,
        Statut: true,
        Approbation: true,
        'Date de création': true,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tableau de bord', href: '/admin' },
        { title: 'Produits', href: '/admin/products' },
    ];

    // Filtrage local
    const filteredProducts = useMemo(() => {
        let result = [...products.data];

        if (searchQuery) {
            result = result.filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.shop?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter && statusFilter !== 'all') {
            result = result.filter((product) => 
                statusFilter === 'active' ? product.active : !product.active
            );
        }

        if (approvalFilter && approvalFilter !== 'all') {
            result = result.filter((product) => {
                if (approvalFilter === 'approved') return product.is_approved;
                if (approvalFilter === 'pending') return !product.is_approved && !product.rejection_reason;
                if (approvalFilter === 'rejected') return !product.is_approved && product.rejection_reason;
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
    }, [products.data, searchQuery, statusFilter, approvalFilter, sortField, sortDirection]);

    const handleSort = (field: keyof ProductData) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleToggleActive = (product: ProductData) => {
        router.post(`/admin/products/${product.id}/toggle-active`, {}, {
            preserveState: true,
            onSuccess: () => {
                toast.success(product.active ? 'Produit désactivé' : 'Produit activé');
            },
            onError: () => {
                toast.error('Erreur lors de la mise à jour');
            }
        });
    };

    const handleDelete = () => {
        if (!deleteProduct) return;
        
        setIsDeleting(true);
        router.delete(`/admin/products/${deleteProduct.id}`, {
            onSuccess: () => {
                toast.success('Produit supprimé avec succès');
                setDeleteProduct(null);
            },
            onError: () => {
                toast.error('Erreur lors de la suppression');
            },
            onFinish: () => {
                setIsDeleting(false);
            }
        });
    };

    const handleApprove = (product: ProductData) => {
        setIsProcessing(true);
        router.post(`/admin/products/${product.id}/approve`, {}, {
            preserveState: true,
            onSuccess: () => {
                toast.success('Produit approuvé avec succès');
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
        if (!rejectProduct) return;
        
        setIsProcessing(true);
        router.post(`/admin/products/${rejectProduct.id}/reject`, {
            reason: rejectionReason,
        }, {
            preserveState: true,
            onSuccess: () => {
                toast.success('Produit rejeté');
                setRejectProduct(null);
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

    const getApprovalStatus = (product: ProductData) => {
        if (product.is_approved) {
            return { label: 'Approuvé', variant: 'default' as const, icon: CheckCircle };
        }
        if (product.rejection_reason) {
            return { label: 'Rejeté', variant: 'destructive' as const, icon: XCircle };
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
            title: 'Image',
            accessor: (product: ProductData) => (
                <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                        <img 
                            src={product.images[0].url.startsWith('http') ? product.images[0].url : `/storage/${product.images[0].url}`} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                    )}
                </div>
            ),
            sortable: false,
            className: 'w-[70px]',
        },
        {
            title: 'Produit',
            accessor: (product: ProductData) => (
                <div className="max-w-xs">
                    <Link 
                        href={`/products/${product.slug}`}
                        className="font-medium hover:underline line-clamp-1"
                    >
                        {product.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {product.favorites_count}
                        </span>
                        <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {product.reviews_count}
                        </span>
                    </div>
                </div>
            ),
            sortable: true,
        },
        {
            title: 'Boutique',
            accessor: (product: ProductData) => (
                product.shop ? (
                    <Link 
                        href={`/shops/${product.shop.slug}`}
                        className="text-sm hover:underline flex items-center gap-1"
                    >
                        <Store className="w-3 h-3" />
                        {product.shop.name}
                    </Link>
                ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                )
            ),
            sortable: false,
        },
        {
            title: 'Catégorie',
            accessor: (product: ProductData) => (
                <Badge variant="outline">
                    {product.category?.name || 'Non catégorisé'}
                </Badge>
            ),
            sortable: false,
        },
        {
            title: 'Prix',
            accessor: (product: ProductData) => (
                <span className="font-medium">{formatPrice(product.price)}</span>
            ),
            sortable: true,
        },
        {
            title: 'Stock',
            accessor: (product: ProductData) => (
                <Badge variant={product.quantity > 0 ? 'secondary' : 'destructive'}>
                    {product.quantity > 0 ? product.quantity : 'Épuisé'}
                </Badge>
            ),
            sortable: true,
        },
        {
            title: 'Statut',
            accessor: (product: ProductData) => (
                <Badge variant={product.active ? 'default' : 'secondary'}>
                    {product.active ? 'Actif' : 'Inactif'}
                </Badge>
            ),
            sortable: true,
        },
        {
            title: 'Approbation',
            accessor: (product: ProductData) => {
                const status = getApprovalStatus(product);
                const Icon = status.icon;
                return (
                    <div className="flex flex-col gap-1">
                        <Badge variant={status.variant} className="flex items-center gap-1 w-fit">
                            <Icon className="w-3 h-3" />
                            {status.label}
                        </Badge>
                        {product.rejection_reason && (
                            <span className="text-xs text-destructive truncate max-w-[150px]" title={product.rejection_reason}>
                                {product.rejection_reason}
                            </span>
                        )}
                    </div>
                );
            },
            sortable: false,
        },
        {
            title: 'Date de création',
            accessor: (product: ProductData) => formatDate(product.created_at),
            sortable: true,
            className: 'w-[150px]',
        },
    ];

    const renderActions = (product: ProductData) => (
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
                    <Link href={`/products/${product.slug}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir le produit
                    </Link>
                </DropdownMenuItem>
                
                {/* Actions d'approbation */}
                {!product.is_approved && (
                    <DropdownMenuItem 
                        onClick={() => handleApprove(product)}
                        disabled={isProcessing}
                        className="text-green-600 focus:text-green-600"
                    >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Approuver
                    </DropdownMenuItem>
                )}
                {!product.rejection_reason && (
                    <DropdownMenuItem 
                        onClick={() => setRejectProduct(product)}
                        className="text-orange-600 focus:text-orange-600"
                    >
                        <ShieldX className="mr-2 h-4 w-4" />
                        Rejeter
                    </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleToggleActive(product)}>
                    {product.active ? (
                        <>
                            <ToggleLeft className="mr-2 h-4 w-4" />
                            Désactiver
                        </>
                    ) : (
                        <>
                            <ToggleRight className="mr-2 h-4 w-4" />
                            Activer
                        </>
                    )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDeleteProduct(product)}
                >
                    <Trash className="mr-2 h-4 w-4" />
                    Supprimer
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des produits" />

            <div className="container p-4 mx-auto">
                <Heading title="Gestion des produits" description="Gérez tous les produits de la plateforme" />

                {/* Statistiques */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 my-6">
                    <div className="bg-card rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Total</p>
                                <p className="text-xl font-bold">{stats.total_products}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <ToggleRight className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Actifs</p>
                                <p className="text-xl font-bold">{stats.active_products}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-500/10 rounded-lg">
                                <ToggleLeft className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Inactifs</p>
                                <p className="text-xl font-bold">{stats.inactive_products}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Approuvés</p>
                                <p className="text-xl font-bold">{stats.approved_products}</p>
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
                                <p className="text-xl font-bold">{stats.pending_products}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <XCircle className="h-5 w-5 text-red-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Rejetés</p>
                                <p className="text-xl font-bold">{stats.rejected_products}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recherche et filtres */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher un produit..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous</SelectItem>
                            <SelectItem value="active">Actifs</SelectItem>
                            <SelectItem value="inactive">Inactifs</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={approvalFilter} onValueChange={setApprovalFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Approbation" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous</SelectItem>
                            <SelectItem value="approved">Approuvés</SelectItem>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="rejected">Rejetés</SelectItem>
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

                {/* Info filtre boutique */}
                {filters.shop_id && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Store className="h-4 w-4" />
                        Filtré par boutique ID: {filters.shop_id}
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => router.get('/admin/products')}
                        >
                            Réinitialiser
                        </Button>
                    </div>
                )}

                {/* Table */}
                <DataTable
                    columns={columns}
                    filteredTickets={filteredProducts}
                    visibleColumns={visibleColumns}
                    handleSort={handleSort}
                    renderActions={renderActions}
                />

                {/* Dialog de confirmation de suppression */}
                <Dialog open={!!deleteProduct} onOpenChange={(open) => !open && setDeleteProduct(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Supprimer le produit</DialogTitle>
                            <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer le produit <strong>"{deleteProduct?.name}"</strong> ?
                                <br /><br />
                                Cette action est irréversible.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setDeleteProduct(null)}
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
                <Dialog open={!!rejectProduct} onOpenChange={(open) => !open && setRejectProduct(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Rejeter le produit</DialogTitle>
                            <DialogDescription>
                                Vous êtes sur le point de rejeter le produit <strong>"{rejectProduct?.name}"</strong>.
                                Veuillez indiquer la raison du rejet.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Label htmlFor="rejection-reason">Raison du rejet</Label>
                            <Textarea
                                id="rejection-reason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Expliquez pourquoi ce produit est rejeté..."
                                className="mt-2"
                                rows={3}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setRejectProduct(null);
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
