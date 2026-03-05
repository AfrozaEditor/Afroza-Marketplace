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
    DialogTrigger,
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
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { 
    Ban, 
    Filter, 
    MessageSquare, 
    MoreVertical, 
    Pencil, 
    PlusCircle, 
    Search, 
    Trash, 
    Unlock, 
    User as UserIcon, 
    X 
} from 'lucide-react';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface UserData {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    status: string;
    roles: string[];
    created_at: string;
    updated_at: string;
}

interface Props {
    users: UserData[];
    roles: string[];
}

const roleLabels: Record<string, string> = {
    admin: 'Administrateur',
    vendor: 'Vendeur',
    customer: 'Client',
    delivery: 'Livreur',
};

const roleBadgeVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    admin: 'destructive',
    vendor: 'default',
    customer: 'secondary',
    delivery: 'outline',
};

const Index = ({ users, roles }: Props) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortField, setSortField] = useState<keyof UserData | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);

    const [visibleColumns, setVisibleColumns] = useState({
        Id: true,
        Nom: true,
        Email: true,
        Rôle: true,
        Statut: true,
        'Date de création': true,
    });

    const isMobile = useIsMobile();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tableau de bord', href: '/admin' },
        { title: 'Utilisateurs', href: '/admin/users' },
    ];

    // Form for creating user
    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'customer',
    });

    // Form for editing user
    const editForm = useForm({
        name: '',
        email: '',
        password: '',
        role: '',
    });

    const filteredUsers = useMemo(() => {
        let result = [...users];

        result = result.filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter);
            const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });

        if (sortField) {
            result.sort((a, b) => {
                const aValue = a[sortField];
                const bValue = b[sortField];

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }

                return 0;
            });
        }

        return result;
    }, [users, searchQuery, roleFilter, statusFilter, sortField, sortDirection]);

    const handleSort = (field: keyof UserData) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('admin.users.store'), {
            onSuccess: () => {
                toast.success('Utilisateur créé avec succès');
                setIsCreateOpen(false);
                createForm.reset();
            },
            onError: () => {
                toast.error('Erreur lors de la création');
            },
        });
    };

    const handleEditUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        
        editForm.put(route('admin.users.update', editingUser.id), {
            onSuccess: () => {
                toast.success('Utilisateur mis à jour');
                setIsEditOpen(false);
                setEditingUser(null);
                editForm.reset();
            },
            onError: () => {
                toast.error('Erreur lors de la mise à jour');
            },
        });
    };

    const openEditModal = (user: UserData) => {
        setEditingUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.roles[0] || 'customer',
        });
        setIsEditOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            router.delete(route('admin.users.destroy', id), {
                onSuccess: () => toast.success('Utilisateur supprimé'),
                onError: () => toast.error('Erreur lors de la suppression'),
            });
        }
    };

    const handleBlock = (id: number) => {
        router.post(route('admin.users.block', id), {}, {
            onSuccess: () => toast.success('Utilisateur bloqué'),
            onError: () => toast.error('Erreur'),
        });
    };

    const handleUnblock = (id: number) => {
        router.post(route('admin.users.unblock', id), {}, {
            onSuccess: () => toast.success('Utilisateur débloqué'),
            onError: () => toast.error('Erreur'),
        });
    };

    const getRoleBadge = (roles: string[]) => {
        if (roles.length === 0) return <Badge variant="outline">Aucun rôle</Badge>;
        
        return (
            <div className="flex flex-wrap gap-1">
                {roles.map((role) => (
                    <Badge key={role} variant={roleBadgeVariants[role] || 'outline'}>
                        {roleLabels[role] || role}
                    </Badge>
                ))}
            </div>
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500 hover:bg-green-600">Actif</Badge>;
            case 'blocked':
                return <Badge variant="destructive">Bloqué</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const columns = [
        {
            title: 'Id',
            accessor: 'id' as const,
            sortable: true,
            className: 'w-[80px]',
        },
        {
            title: 'Nom',
            accessor: (user: UserData) => (
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                    </div>
                    <span className="font-medium">{user.name}</span>
                </div>
            ),
            sortable: true,
            className: 'min-w-[200px]',
        },
        {
            title: 'Email',
            accessor: 'email' as const,
            sortable: true,
        },
        {
            title: 'Rôle',
            accessor: (user: UserData) => getRoleBadge(user.roles),
            sortable: false,
            className: 'w-[150px]',
        },
        {
            title: 'Statut',
            accessor: (user: UserData) => getStatusBadge(user.status),
            sortable: false,
            className: 'w-[100px]',
        },
        {
            title: 'Date de création',
            accessor: (user: UserData) => formatDate(user.created_at),
            sortable: true,
            className: 'w-[150px]',
        },
    ];

    console.log(roles)

    const renderActions = (user: UserData) => {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openEditModal(user)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.post(route('chat.start', user.id))}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Envoyer un message
                    </DropdownMenuItem>
                    {user.status === 'active' ? (
                        <DropdownMenuItem onClick={() => handleBlock(user.id)}>
                            <Ban className="h-4 w-4 mr-2 text-orange-500" />
                            <span className="text-orange-500">Bloquer</span>
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem onClick={() => handleUnblock(user.id)}>
                            <Unlock className="h-4 w-4 mr-2 text-green-500" />
                            <span className="text-green-500">Débloquer</span>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-red-500">
                        <Trash className="h-4 w-4 mr-2" />
                        Supprimer
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des Utilisateurs" />
            <div className="container p-4 mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <Heading 
                        title="Gestion des Utilisateurs" 
                        description="Gérez et suivez tous les utilisateurs de la plateforme" 
                    />
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="mt-2 sm:mt-0">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Nouvel utilisateur
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Créer un utilisateur</DialogTitle>
                                <DialogDescription>
                                    Ajoutez un nouvel utilisateur à la plateforme
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateUser}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nom complet</Label>
                                        <Input
                                            id="name"
                                            value={createForm.data.name}
                                            onChange={(e) => createForm.setData('name', e.target.value)}
                                            placeholder="John Doe"
                                        />
                                        {createForm.errors.name && (
                                            <p className="text-sm text-red-500">{createForm.errors.name}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={createForm.data.email}
                                            onChange={(e) => createForm.setData('email', e.target.value)}
                                            placeholder="john@example.com"
                                        />
                                        {createForm.errors.email && (
                                            <p className="text-sm text-red-500">{createForm.errors.email}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Mot de passe</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={createForm.data.password}
                                            onChange={(e) => createForm.setData('password', e.target.value)}
                                            placeholder="••••••••"
                                        />
                                        {createForm.errors.password && (
                                            <p className="text-sm text-red-500">{createForm.errors.password}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="role">Rôle</Label>
                                        <Select
                                            value={createForm.data.role}
                                            onValueChange={(value) => createForm.setData('role', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un rôle" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((role) => (
                                                    <SelectItem key={role} value={role}>
                                                        {roleLabels[role] || role}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {createForm.errors.role && (
                                            <p className="text-sm text-red-500">{createForm.errors.role}</p>
                                        )}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                        Annuler
                                    </Button>
                                    <Button type="submit" disabled={createForm.processing}>
                                        {createForm.processing ? 'Création...' : 'Créer'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filters */}
                <div className="my-4 flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            type="search"
                            placeholder="Rechercher des utilisateurs..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Tous les rôles" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les rôles</SelectItem>
                                {roles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {roleLabels[role] || role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Tous statuts" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous statuts</SelectItem>
                                <SelectItem value="active">Actif</SelectItem>
                                <SelectItem value="blocked">Bloqué</SelectItem>
                            </SelectContent>
                        </Select>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Colonnes visibles</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {Object.keys(visibleColumns).map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column}
                                        checked={visibleColumns[column as keyof typeof visibleColumns]}
                                        onCheckedChange={(checked) =>
                                            setVisibleColumns({
                                                ...visibleColumns,
                                                [column]: checked,
                                            })
                                        }
                                    >
                                        {column}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Active filters display */}
                {(roleFilter !== 'all' || statusFilter !== 'all') && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        <span className="text-muted-foreground text-sm">Filtres :</span>
                        {roleFilter !== 'all' && (
                            <Badge variant="outline" className="flex items-center gap-1">
                                Rôle: {roleLabels[roleFilter] || roleFilter}
                                <button onClick={() => setRoleFilter('all')}>
                                    <X className="h-3 w-3 cursor-pointer" />
                                </button>
                            </Badge>
                        )}
                        {statusFilter !== 'all' && (
                            <Badge variant="outline" className="flex items-center gap-1">
                                Statut: {statusFilter === 'active' ? 'Actif' : 'Bloqué'}
                                <button onClick={() => setStatusFilter('all')}>
                                    <X className="h-3 w-3 cursor-pointer" />
                                </button>
                            </Badge>
                        )}
                        <Button 
                            variant="link" 
                            size="sm" 
                            className="h-6 text-xs" 
                            onClick={() => { setRoleFilter('all'); setStatusFilter('all'); }}
                        >
                            Réinitialiser
                        </Button>
                    </div>
                )}

                {/* Stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-card rounded-lg border p-4">
                        <div className="text-2xl font-bold">{users.length}</div>
                        <div className="text-sm text-muted-foreground">Total utilisateurs</div>
                    </div>
                    <div className="bg-card rounded-lg border p-4">
                        <div className="text-2xl font-bold text-green-600">
                            {users.filter(u => u.status === 'active').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Actifs</div>
                    </div>
                    <div className="bg-card rounded-lg border p-4">
                        <div className="text-2xl font-bold text-blue-600">
                            {users.filter(u => u.roles.includes('vendor')).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Vendeurs</div>
                    </div>
                    <div className="bg-card rounded-lg border p-4">
                        <div className="text-2xl font-bold text-red-600">
                            {users.filter(u => u.status === 'blocked').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Bloqués</div>
                    </div>
                </div>

                {/* Table */}
                <div className="py-2">
                    <DataTable
                        filteredTickets={filteredUsers}
                        columns={columns}
                        handleSort={handleSort}
                        visibleColumns={visibleColumns}
                        renderActions={renderActions}
                    />
                </div>

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Modifier l'utilisateur</DialogTitle>
                            <DialogDescription>
                                Modifiez les informations de l'utilisateur
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditUser}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Nom complet</Label>
                                    <Input
                                        id="edit-name"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                    />
                                    {editForm.errors.name && (
                                        <p className="text-sm text-red-500">{editForm.errors.name}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input
                                        id="edit-email"
                                        type="email"
                                        value={editForm.data.email}
                                        onChange={(e) => editForm.setData('email', e.target.value)}
                                    />
                                    {editForm.errors.email && (
                                        <p className="text-sm text-red-500">{editForm.errors.email}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-password">
                                        Nouveau mot de passe <span className="text-muted-foreground">(optionnel)</span>
                                    </Label>
                                    <Input
                                        id="edit-password"
                                        type="password"
                                        value={editForm.data.password}
                                        onChange={(e) => editForm.setData('password', e.target.value)}
                                        placeholder="Laisser vide pour ne pas changer"
                                    />
                                    {editForm.errors.password && (
                                        <p className="text-sm text-red-500">{editForm.errors.password}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-role">Rôle</Label>
                                    <Select
                                        value={editForm.data.role}
                                        onValueChange={(value) => editForm.setData('role', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un rôle" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem key={role} value={role}>
                                                    {roleLabels[role] || role}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {editForm.errors.role && (
                                        <p className="text-sm text-red-500">{editForm.errors.role}</p>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                                    Annuler
                                </Button>
                                <Button type="submit" disabled={editForm.processing}>
                                    {editForm.processing ? 'Enregistrement...' : 'Enregistrer'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
};

export default Index;
