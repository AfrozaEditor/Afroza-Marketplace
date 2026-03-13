import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Category } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image, LoaderCircle, Package, Save, Upload, X } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface Props {
    categories: Category[];
}

const productSchema = z.object({
    name: z.string().min(3, { message: 'Le nom doit contenir au moins 3 caractères.' }),
    description: z.string().min(10, { message: 'La description doit contenir au moins 10 caractères.' }),
    price: z.coerce.number().positive({ message: 'Le prix doit être un nombre positif.' }),
    parentCategory: z.string().min(1, { message: 'Sélectionnez d’abord une catégorie parent.' }),
    categoryId: z.string().min(1, { message: 'Sélectionnez une sous-catégorie.' }),
    stock: z.coerce.number().int().min(1, { message: 'Le stock ne peut pas être égal à 0.' }),
});

type ProductFormData = z.infer<typeof productSchema>

function Create({ categories }: Props) {
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            parentCategory: '',
            categoryId: '',
            stock: 0,
        },
    });

    const selectedParentId = form.watch('parentCategory');
    const selectedParentCategory = categories.find((category) => String(category.id) === selectedParentId);
    const childCategories = selectedParentCategory?.children ?? [];

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);

        if (images.length + files.length > 6) {
            toast.error('Vous ne pouvez ajouter que 6 images maximum.');
            return;
        }

        const newPreviews: string[] = [];
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                newPreviews.push(e.target?.result as string);
                if (newPreviews.length === files.length) {
                    setPreviews((prev) => [...prev, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });

        setImages((prev) => [...prev, ...files]);
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (data: ProductFormData) => {
    if (images.length === 0) {
        toast.error('Ajoutez au moins une image du produit.');
        return;
    }

        // Créer un objet FormData pour envoyer les fichiers
    const formData = new FormData();

    // Ajouter les données du produit
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('category_id', data.categoryId);
    formData.append('stock', data.stock.toString());

    // Ajouter les images
    images.forEach((image) => {
        formData.append('images[]', image);
    });
        router.post(route('products.store'), formData, {
            onSuccess: () => {
                toast.success('Produit créé avec succès!', {
                    description: 'Vous allez être redirigé vers le dashboard.'
                });
                // Optionnel : reset le formulaire
                // form.reset();
                setTimeout(() => {
                    router.visit(route('dashboard'));
                }, 1500);
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la création du produit.', {
                    description: 'Veuillez vérifier vos informations et réessayer.'
                });
                console.error('Erreur lors de la création du produit');
            }
        });
    };

    return (
        <AppLayout>
            <div className="container mx-auto max-w-4xl px-4 py-8">
                <div className="mb-6 flex items-center">
                    <Package className="text-primary mr-2 h-6 w-6" />
                    <h1 className="text-3xl font-bold">Créer votre produit</h1>
                </div>

                <p className="mb-8 text-gray-600">Remplissez les informations ci-dessous pour ajouter un nouveau produit sur Afroza Marketplace.</p>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
                        <Card>
                            <CardContent>
                                <h2 className="mb-4 text-xl font-semibold">Informations générales</h2>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nom du produit *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Entrez le nom de votre produit" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Ce nom sera visible par les clients sur la marketplace.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="parentCategory"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Catégorie parent *</FormLabel>
                                                    <Select
                                                        onValueChange={(value) => {
                                                            field.onChange(value);
                                                            form.setValue('categoryId', '');
                                                        }}
                                                        value={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Sélectionnez la catégorie parent" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {categories.map((cat) => (
                                                                <SelectItem key={cat.id} value={String(cat.id)}>
                                                                    {cat.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription>Étape 1 : choisissez la famille principale du produit.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="categoryId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Sous-catégorie (enfant) *</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedParentId || childCategories.length === 0}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={
                                                                        !selectedParentId
                                                                            ? 'Sélectionnez d’abord une catégorie parent'
                                                                            : childCategories.length === 0
                                                                              ? 'Aucune sous-catégorie disponible'
                                                                              : 'Sélectionnez la sous-catégorie'
                                                                    }
                                                                />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {childCategories.map((child) => (
                                                                <SelectItem key={child.id} value={String(child.id)}>
                                                                    {child.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription>
                                                        Étape 2 : la sous-catégorie enfant détermine où le produit sera enregistré.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {selectedParentCategory && childCategories.length > 0 && form.watch('categoryId') && (
                                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                                            Catégorie sélectionnée : <span className="font-semibold">{selectedParentCategory.name}</span>
                                            {' > '}
                                            <span className="font-semibold">
                                                {childCategories.find((c) => String(c.id) === form.watch('categoryId'))?.name}
                                            </span>
                                        </div>
                                    )}

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description *</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Décrivez votre produit en détails..."
                                                        className="min-h-32"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Une bonne description aide vos clients à comprendre ce que vous vendez.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Prix *</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="Entrez le prix en FCFA" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Le prix de vente de votre produit.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="stock"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Quantité en stock *</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="Ex: 50" min="0" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Stock disponible.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section Images */}
                        <Card>
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="mb-2 text-lg font-medium">Images du produit</h4>
                                        <p className="mb-4 text-sm text-gray-600">
                                            Ajoutez jusqu'à 6 images de votre produit. La première image sera utilisée comme image principale.
                                        </p>
                                    </div>

                                    <div className="flex w-full items-center justify-center">
                                        <Label
                                            htmlFor="images"
                                            className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100"
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="mb-2 h-8 w-8 text-gray-400" />
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Cliquez pour ajouter</span> ou glissez-déposez
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                                            </div>
                                            <Input id="images" type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                                        </Label>
                                    </div>

                                    {previews.length > 0 && (
                                        <div>
                                            <h4 className="mb-3 text-sm font-medium">Images sélectionnées ({previews.length}/6)</h4>
                                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                                {previews.map((preview, index) => (
                                                    <div key={index} className="group relative">
                                                        <img
                                                            src={preview}
                                                            alt={`Aperçu ${index + 1}`}
                                                            className="h-32 w-full rounded-lg border object-cover"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            className="absolute top-2 right-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                                            onClick={() => removeImage(index)}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                        {index === 0 && (
                                                            <div className="absolute bottom-2 left-2 rounded bg-blue-500 px-2 py-1 text-xs text-white">
                                                                Principal
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {previews.length === 0 && (
                                        <div className="py-8 text-center">
                                            <Image className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-500">Aucune image sélectionnée</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <div className="flex justify-end gap-4">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => router.get(route('dashboard'))}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                ) :
                                    <Save className="mr-2 h-4 w-4" />
                                }
                                Créer mon produit
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </AppLayout>
    );
}

export default Create;
