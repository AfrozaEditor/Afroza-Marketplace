import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
    Plus,
    Search,
    MoreHorizontal,
    Pencil,
    Trash2,
    Eye,
    FileText,
    Star,
    StarOff,
    Archive,
    Send,
    Clock,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { BreadcrumbItem } from '@/types';

interface Blog {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    category: string | null;
    status: 'draft' | 'published' | 'archived';
    featured: boolean;
    read_time: number;
    views: number;
    published_at: string | null;
    created_at: string;
    author: {
        id: number;
        name: string;
    };
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    blogs: PaginatedData<Blog>;
    statusCounts: {
        all: number;
        draft: number;
        published: number;
        archived: number;
    };
    currentStatus: string;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'draft':
            return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300"><Clock className="w-3 h-3 mr-1" />Brouillon</Badge>;
        case 'published':
            return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Publié</Badge>;
        case 'archived':
            return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300"><Archive className="w-3 h-3 mr-1" />Archivé</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export default function Index({ blogs, statusCounts, currentStatus }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tableau de bord', href: '/admin' },
        { title: 'Gestion des blogs', href: '/admin/blogs' },
    ];

    const handleStatusFilter = (status: string) => {
        router.get('/admin/blogs', { status }, { preserveState: true });
    };

    const handleDelete = (blog: Blog) => {
        setSelectedBlog(blog);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedBlog) return;
        
        router.delete(`/admin/blogs/${selectedBlog.id}`, {
            onSuccess: () => {
                toast.success('Article supprimé avec succès.');
                setDeleteDialogOpen(false);
                setSelectedBlog(null);
            },
            onError: () => {
                toast.error('Erreur lors de la suppression.');
            },
        });
    };

    const handlePublish = (blog: Blog) => {
        router.post(`/admin/blogs/${blog.id}/publish`, {}, {
            onSuccess: () => {
                toast.success('Article publié avec succès.');
            },
        });
    };

    const handleArchive = (blog: Blog) => {
        router.post(`/admin/blogs/${blog.id}/archive`, {}, {
            onSuccess: () => {
                toast.success('Article archivé.');
            },
        });
    };

    const handleToggleFeatured = (blog: Blog) => {
        router.post(`/admin/blogs/${blog.id}/toggle-featured`, {}, {
            onSuccess: () => {
                toast.success(blog.featured ? 'Article retiré des favoris.' : 'Article mis en avant.');
            },
        });
    };

    const filteredBlogs = blogs.data.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.category && blog.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des blogs" />
            
            <div className="p-4 container mx-auto space-y-6">
                <div className="flex justify-between items-start">
                    <Heading 
                        title="Gestion des blogs" 
                        description="Créez et gérez les articles de blog"
                    />
                    <Button asChild>
                        <Link href="/admin/blogs/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Nouvel article
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${currentStatus === 'all' ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => handleStatusFilter('all')}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Tous</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statusCounts.all}</div>
                        </CardContent>
                    </Card>
                    
                    <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${currentStatus === 'draft' ? 'ring-2 ring-yellow-500' : ''}`}
                        onClick={() => handleStatusFilter('draft')}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-yellow-600">Brouillons</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{statusCounts.draft}</div>
                        </CardContent>
                    </Card>
                    
                    <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${currentStatus === 'published' ? 'ring-2 ring-green-500' : ''}`}
                        onClick={() => handleStatusFilter('published')}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-green-600">Publiés</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{statusCounts.published}</div>
                        </CardContent>
                    </Card>
                    
                    <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${currentStatus === 'archived' ? 'ring-2 ring-gray-500' : ''}`}
                        onClick={() => handleStatusFilter('archived')}
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Archivés</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-600">{statusCounts.archived}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Table */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div>
                                <CardTitle>Liste des articles</CardTitle>
                                <CardDescription>
                                    {currentStatus === 'all' 
                                        ? 'Tous les articles' 
                                        : `Articles avec le statut "${currentStatus}"`
                                    }
                                </CardDescription>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Rechercher..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40%]">Article</TableHead>
                                        <TableHead>Catégorie</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Vues</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBlogs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                                Aucun article trouvé
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredBlogs.map((blog) => (
                                            <TableRow key={blog.id}>
                                                <TableCell>
                                                    <div className="flex items-start gap-2">
                                                        {blog.featured && (
                                                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mt-1 flex-shrink-0" />
                                                        )}
                                                        <div>
                                                            <div className="font-medium line-clamp-1">{blog.title}</div>
                                                            {blog.excerpt && (
                                                                <div className="text-sm text-muted-foreground line-clamp-1">
                                                                    {blog.excerpt}
                                                                </div>
                                                            )}
                                                            <div className="text-xs text-muted-foreground mt-1">
                                                                Par {blog.author?.name} • {blog.read_time} min de lecture
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {blog.category ? (
                                                        <Badge variant="secondary">{blog.category}</Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(blog.status)}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-muted-foreground">{blog.views}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        {blog.published_at 
                                                            ? formatDate(blog.published_at)
                                                            : formatDate(blog.created_at)
                                                        }
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/blog/${blog.slug}`} target="_blank">
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    Voir
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/blogs/${blog.id}/edit`}>
                                                                    <Pencil className="h-4 w-4 mr-2" />
                                                                    Modifier
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleToggleFeatured(blog)}>
                                                                {blog.featured ? (
                                                                    <>
                                                                        <StarOff className="h-4 w-4 mr-2" />
                                                                        Retirer des favoris
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Star className="h-4 w-4 mr-2" />
                                                                        Mettre en avant
                                                                    </>
                                                                )}
                                                            </DropdownMenuItem>
                                                            {blog.status === 'draft' && (
                                                                <DropdownMenuItem 
                                                                    onClick={() => handlePublish(blog)}
                                                                    className="text-green-600"
                                                                >
                                                                    <Send className="h-4 w-4 mr-2" />
                                                                    Publier
                                                                </DropdownMenuItem>
                                                            )}
                                                            {blog.status === 'published' && (
                                                                <DropdownMenuItem 
                                                                    onClick={() => handleArchive(blog)}
                                                                >
                                                                    <Archive className="h-4 w-4 mr-2" />
                                                                    Archiver
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem 
                                                                onClick={() => handleDelete(blog)}
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Supprimer
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {blogs.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Page {blogs.current_page} sur {blogs.last_page} ({blogs.total} articles)
                                </div>
                                <div className="flex gap-2">
                                    {blogs.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer l'article</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer "{selectedBlog?.title}" ?
                            Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
