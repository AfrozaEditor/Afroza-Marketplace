import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import TiptapEditor from '@/components/TiptapEditor';
import { 
    ArrowLeft,
    Save,
    Eye,
    Send,
    Image as ImageIcon,
    X,
    Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { BreadcrumbItem } from '@/types';

const categories = [
    'Conseils',
    'Tendances',
    'Durabilité',
    'Guides',
    'Interviews',
    'Actualités',
    'Mode',
    'Lifestyle',
];

export default function Create() {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featured_image: null as File | null,
        category: '',
        tags: [] as string[],
        status: 'draft' as 'draft' | 'published',
        featured: false,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tableau de bord', href: '/admin' },
        { title: 'Gestion des blogs', href: '/admin/blogs' },
        { title: 'Nouvel article', href: '/admin/blogs/create' },
    ];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('featured_image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData('featured_image', null);
        setPreviewImage(null);
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setData('title', title);
        if (!data.slug) {
            setData('slug', generateSlug(title));
        }
    };

    const handleSubmit = (status: 'draft' | 'published') => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('slug', data.slug);
        formData.append('excerpt', data.excerpt);
        formData.append('content', data.content);
        formData.append('category', data.category);
        formData.append('status', status);
        formData.append('featured', data.featured ? '1' : '0');
        
        if (data.featured_image) {
            formData.append('featured_image', data.featured_image);
        }
        
        if (data.tags.length > 0) {
            data.tags.forEach((tag, index) => {
                formData.append(`tags[${index}]`, tag);
            });
        }

        router.post('/admin/blogs', formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.success(status === 'published' ? 'Article publié avec succès.' : 'Brouillon enregistré.');
            },
            onError: () => {
                toast.error('Erreur lors de l\'enregistrement.');
            },
        });
    };

    const [tagInput, setTagInput] = useState('');

    const addTag = () => {
        if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
            setData('tags', [...data.tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setData('tags', data.tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nouvel article" />
            
            <div className="p-4 container mx-auto space-y-6">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/admin/blogs">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Heading 
                            title="Nouvel article" 
                            description="Créez un nouvel article de blog"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => handleSubmit('draft')}
                            disabled={processing || !data.title || !data.content}
                        >
                            {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                            Enregistrer comme brouillon
                        </Button>
                        <Button 
                            onClick={() => handleSubmit('published')}
                            disabled={processing || !data.title || !data.content}
                        >
                            {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                            Publier
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contenu de l'article</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Titre *</Label>
                                    <Input
                                        id="title"
                                        placeholder="Titre de l'article"
                                        value={data.title}
                                        onChange={handleTitleChange}
                                    />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug (URL)</Label>
                                    <Input
                                        id="slug"
                                        placeholder="titre-de-larticle"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        URL: /blog/{data.slug || 'titre-de-larticle'}
                                    </p>
                                    {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="excerpt">Extrait</Label>
                                    <Textarea
                                        id="excerpt"
                                        placeholder="Court résumé de l'article (affiché dans les listes)"
                                        value={data.excerpt}
                                        onChange={(e) => setData('excerpt', e.target.value)}
                                        rows={3}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {data.excerpt.length}/500 caractères
                                    </p>
                                    {errors.excerpt && <p className="text-sm text-red-500">{errors.excerpt}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Contenu *</Label>
                                    <TiptapEditor
                                        content={data.content}
                                        onChange={(content) => setData('content', content)}
                                        placeholder="Rédigez votre article ici..."
                                    />
                                    {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Featured Image */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Image à la une</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {previewImage ? (
                                    <div className="relative">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-8 w-8"
                                            onClick={removeImage}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Label htmlFor="featured-image" className="cursor-pointer">
                                        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                                            <ImageIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">
                                                Cliquez pour ajouter une image
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                JPG, PNG max 5MB
                                            </p>
                                        </div>
                                    </Label>
                                )}
                                <input
                                    id="featured-image"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                                {errors.featured_image && <p className="text-sm text-red-500 mt-2">{errors.featured_image}</p>}
                            </CardContent>
                        </Card>

                        {/* Category & Tags */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Organisation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Catégorie</Label>
                                    <Select
                                        value={data.category}
                                        onValueChange={(value) => setData('category', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner une catégorie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Tags</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Ajouter un tag"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                        />
                                        <Button type="button" variant="outline" onClick={addTag}>
                                            +
                                        </Button>
                                    </div>
                                    {data.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {data.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(tag)}
                                                        className="hover:text-destructive"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Options */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Options</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Article en vedette</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Afficher en priorité sur la page blog
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.featured}
                                        onCheckedChange={(checked) => setData('featured', checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
