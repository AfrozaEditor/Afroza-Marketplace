import Heading from '@/components/heading';
// import getPriorityBadge from '@/components/tickets/get-priority-badge';
// import getStatusBadge from '@/components/tickets/get-status-badge';
// import TicketsFilter from '@/components/tickets/tickets-filter';
// import TicketsKanban from '@/components/tickets/tickets-kanban';
import DataTable from '@/components/dt-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { BreadcrumbItem, User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Filter, Kanban, ListFilter, Pencil, PlusCircle, Search, SlidersHorizontal, Ticket as TicketIcon, Trash, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    users: User[];
}

const Index = ({ users }: Props) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [view, setView] = useState<'kanban' | 'list'>('list');
    const [sortField, setSortField] = useState<keyof User | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        entity: '',
        assigned_to: '',
    });

    const [visibleColumns, setVisibleColumns] = useState({
        Id: true,
        Nom: true,
        Email: true,
        // Priorité: true,
        'Date de création': true,
        'Date de mise à jour': true,
    });

    const isMobile = useIsMobile();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tableau de bord',
            href: '/admin',
        },
        {
            title: 'Utilisateurs',
            href: '/',
        },
    ];

    const filteredTickets = useMemo(() => {
        let result = [...users];

        result = result.filter((ticket) => {
            const matchesSearch =
                ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                String(ticket.code).toLowerCase().includes(searchQuery.toLowerCase());

            // const matchesStatus = !filters.status || (ticket.status && ticket.status.name === filters.status);

            // const matchesPriority = !filters.priority || (ticket.priority && ticket.priority.name === filters.priority);

            // const matchesEntity = !filters.entity || (ticket.entity && ticket.entity.name === filters.entity);

            // const matchesAssignedTo =
            //     !filters.assigned_to ||
            //     (ticket.assigned_to &&
            //         ticket.assigned_to.first_name &&
            //         ticket.assigned_to.first_name.toLowerCase().includes(filters.assigned_to.toLowerCase()));

            return matchesSearch
            //  && matchesStatus && matchesPriority && matchesEntity && matchesAssignedTo;
        });

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
    }, [users, searchQuery, filters, sortField, sortDirection]);

    const handleResetFilters = () => {
        setFilters({
            status: '',
            priority: '',
            entity: '',
            assigned_to: '',
        });
    };

    const handleSort = (field: keyof User) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet Utilisateur ?')) {
            router.delete(route('users.destroy', id), {
                onError: () => {
                    toast.error("Une erreur est survenue lors de la suppression de l'utilisateur");
                },
            });
        }
    };

    const columns = [
        {
            title: 'Id',
            accessor: 'id' as const,
            sortable: true,
            className: 'w-[130px]',
        },
        {
            title: 'Nom',
            accessor: (user: User) => (
                <Link href="" className="hover:text-primary truncate hover:underline">
                    {user.name}
                </Link>
            ),
            sortable: true,
            className: 'max-w-[340px] w-full]',
        },
        {
            title: 'Email',
            accessor: 'email' as const,
            sortable: true,
            // className: 'w-[130px]',
        },
        // {
        //     title: 'Priorité',
        //     accessor: (ticket: Tickets) => getPriorityBadge(ticket.priority),
        //     sortable: true,
        // },
        {
            title: 'Date de création',
            accessor: (user: User) => formatDate(user.created_at),
            sortable: true,
            className: 'w-[190px]',
        },
        {
            title: 'Date de mise à jour',
            accessor: (user: User) => formatDate(user.updated_at),
            sortable: true,
            className: 'w-[190px]',
        },

        // {
        //     title: 'Assigné à',
        //     accessor: (ticket: Tickets) =>
        //         ticket.assigned_to?.email || ticket.group ? (
        //             <span>{ticket.assigned_to?.email || ticket.group?.name}</span>
        //         ) : (
        //             <span className="text-muted-foreground italic">Non assigné</span>
        //         ),
        //     sortable: true,
        // },
    ];

    const renderActions = (ticket: User) => {
        return (
            <div className="flex gap-2">
                <Button variant="destructive" size="icon" className="h-7 w-7 p-0" onClick={() => handleDelete(ticket.id)}>
                    <Trash className="h-4 w-4" />
                </Button>
                <Link href="">
                    <Button variant="outline" size="icon" className="h-7 w-7 p-0">
                        <Pencil className="h-4 w-4" />
                    </Button>
                </Link>
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tous les Utilisateurs" />
            <div className="container p-4 mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <Heading title="Tous les Utilisateurs" description="Gérez et suivez tous les utilisateurs de Vide Dressing" />
                    {/* {!isMobile && (
                        <Link
                            href={route('tickets.create')}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 inline-flex items-center self-start rounded-md px-4 py-2 text-sm font-medium sm:self-auto"
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Nouveau ticket
                        </Link>
                    )} */}
                </div>

                <div className="my-4 flex flex-col justify-center align-items-center gap-4 sm:flex-row">
                    <div className="relative flex-1 justify-center w-full">
                        <Search 
                            className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" 
                        />
                        <Input
                            type="search"
                            placeholder="Rechercher des utilisateurs..."
                            className="pl-10 h-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {view === 'list' && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="lg" className="flex h-11 items-center gap-1">
                                        <Filter className="h-4 w-4" />
                                        Colonnes
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
                        )}

                        <div className="flex items-center gap-2 rounded-md border p-1">
                            <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setView('list')}>
                                <ListFilter className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={view === 'kanban' ? 'secondary' : 'ghost'}
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setView('kanban')}
                            >
                                <Kanban className="h-4 w-4" />
                            </Button>
                        </div>

                        <Button variant="outline" size="lg" onClick={() => setFilterOpen(!filterOpen)} className={filterOpen ? 'bg-muted' : ''}>
                            <SlidersHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {(filters.status || filters.priority || filters.entity || filters.assigned_to) && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        <div className="text-muted-foreground mt-1 mr-1 text-sm">Filtres actifs :</div>
                        {filters.status && (
                            <Badge variant="outline" className="flex items-center gap-1">
                                Statut: {filters.status}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFilters({ ...filters, status: '' });
                                    }}
                                    className="ml-1 flex items-center justify-center"
                                >
                                    <X className="h-3 w-3 cursor-pointer" />
                                </button>
                            </Badge>
                        )}
                        {filters.priority && (
                            <Badge variant="outline" className="flex items-center gap-1">
                                Priorité: {filters.priority === 'low' ? 'Faible' : filters.priority === 'medium' ? 'Moyen' : 'Élevé'}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFilters({ ...filters, priority: '' });
                                    }}
                                    className="ml-1 flex items-center justify-center"
                                >
                                    <X className="h-3 w-3 cursor-pointer" />
                                </button>
                            </Badge>
                        )}
                        {filters.entity && (
                            <Badge variant="outline" className="flex items-center gap-1">
                                Département: {filters.entity}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFilters({ ...filters, entity: '' });
                                    }}
                                    className="ml-1 flex items-center justify-center"
                                >
                                    <X className="h-3 w-3 cursor-pointer" />
                                </button>
                            </Badge>
                        )}
                        {filters.assigned_to && (
                            <Badge variant="outline" className="flex items-center gap-1">
                                Assigné à: {filters.assigned_to}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFilters({ ...filters, assigned_to: '' });
                                    }}
                                    className="ml-1 flex items-center justify-center"
                                >
                                    <X className="h-3 w-3 cursor-pointer" />
                                </button>
                            </Badge>
                        )}
                        {(filters.status || filters.priority || filters.entity || filters.assigned_to) && (
                            <Button variant="link" size="sm" className="h-6 text-xs underline" onClick={handleResetFilters}>
                                Réinitialiser tous
                            </Button>
                        )}
                    </div>
                )}

                {/* {filterOpen && (
                    <TicketsFilter
                        entities={entities}
                        priorities={priorities}
                        statuses={status}
                        users={users}
                        filters={filters}
                        setFilters={setFilters}
                        onReset={handleResetFilters}
                        className="mb-3"
                    />
                )} */}

                <div className="py-2">
                    {/* {view === 'kanban' ? (
                        <TicketsKanban tickets={filteredTickets} statuses={status} />
                    ) : ( */}
                        <DataTable
                            filteredTickets={filteredTickets}
                            columns={columns}
                            handleSort={handleSort}
                            visibleColumns={visibleColumns}
                            renderActions={renderActions}
                        />
                    {/* )} */}
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
