import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link2, Mail, MapPin, Phone, Save, Store, Image} from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
// import {useNavigate} from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { router } from '@inertiajs/react';

const shopFormSchema = z.object({
    name: z.string().min(3, "Le nom de la boutique doit avoir au moins 3 caractères"),
    description: z.string().min(20, "La description doit avoir au moins 20 caractères"),
    logo: z.any().optional(),
    cover_image: z.any().optional(),
    address: z.string().min(5, "Veuillez entrer une adresse valide"),
    city: z.string().min(2, "Veuillez entrer une ville valide"),
    phone: z.string().min(8, "Veuillez entrer un numéro de téléphone valide"),
    email: z.string().email("Veuillez entrer un email valide"),
    website: z.string().url("Veuillez entrer une URL valide").optional().or(z.literal('')),
    facebook: z.string().url("Veuillez entrer une URL valide").optional().or(z.literal('')),
    instagram: z.string().url("Veuillez entrer une URL valide").optional().or(z.literal('')),
    // acceptTerms: z.boolean().refine(val => val, {
    //     message: "Vous devez accepter les conditions générales"
    // })
});

type ShopFormValues = z.infer<typeof shopFormSchema>;

function Create() {

    // const navigate = useNavigate();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [logo, setLogo] = useState<File>();
    const [cover, setCover] = useState<File>();

    const form = useForm<ShopFormValues>({
        resolver: zodResolver(shopFormSchema),
        defaultValues: {
            name: "",
            description: "",
            address: "",
            city: "",
            phone: "",
            email: "",
            website: "",
            facebook: "",
            instagram: "",
            // acceptTerms: false
        }
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        setLogo(file);
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        setCover(file);
    };

    const onSubmit = (data: ShopFormValues) => {

    const formData = new FormData();

    // Ajout des données de la boutique
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('address', data.address);
    formData.append('city', data.city);
    formData.append('phone', data.phone);
    formData.append('email', data.email);
    // formData.append('website', data.website);
    // formData.append('address', data.address);
    // formData.append('address', data.address);

    formData.append('logo', logo);
    formData.append('cover_image', cover);

    console.log(logo);
    console.log(formData);

    // Envoyer les données via Inertia
    router.post(route('marketplace.store'), formData, {
        onSuccess: () => {
            toast.success("Votre boutique a été créée avec succès!", {
                description: "Vous allez être redirigé vers votre boutique.",
            });
        },
        onError: (errors) => {
            toast.error("Une erreur est survenue", {
                description: "Veuillez vérifier les informations saisies.",
            });
            console.log(errors);
        }
    });

        // // In a real application, this would be an API call to create the shop
        // // For now, we'll simulate success with a toast notification

        // toast.success("Votre boutique a été créée avec succès!", {
        //     description: "Vous allez être redirigé vers votre tableau de bord.",
        //     duration: 5000,
        // });

        // setTimeout(() => {
        //     router.get("/dashboard");
        // }, 2000);
    };


    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex items-center mb-6">
                    <Store className="mr-2 h-6 w-6 text-primary" />
                    <h1 className="text-3xl font-bold">Créer votre boutique</h1>
                </div>

                <p className="text-gray-600 mb-8">
                    Remplissez ce formulaire pour créer votre boutique et commencer à vendre vos articles sur Afroza Marketplace.
                </p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Informations de la boutique</h2>
                                <div className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nom de la boutique *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Entrez le nom de votre boutique" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Ce nom sera visible par les clients sur la marketplace.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description *</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Décrivez votre boutique, vos articles, votre style..."
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <FormLabel>Logo de la boutique</FormLabel>
                                            <div className="mt-2">
                                                <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-48 w-full overflow-hidden relative bg-gray-50">
                                                    {logoPreview ? (
                                                        <img src={logoPreview} alt="Preview" className="h-full w-full object-contain" />
                                                    ) : (
                                                        <div className="text-center p-4">
                                                            <Image className="mx-auto h-12 w-12 text-gray-400" />
                                                            <div className="mt-2 text-sm text-gray-500">
                                                                <label htmlFor="logo-upload" className="relative cursor-pointer rounded-md font-medium text-videdressing-primary">
                                                                    <span>Cliquez pour ajouter un logo</span>
                                                                    <Input
                                                                        id="logo-upload"
                                                                        name="logo"
                                                                        type="file"
                                                                        accept="image/*"
                                                                        className="sr-only"
                                                                        onChange={handleLogoChange}
                                                                    />
                                                                </label>
                                                            </div>
                                                            <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 1MB</p>
                                                        </div>
                                                    )}
                                                </div>
                                                {logoPreview && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="mt-2"
                                                        onClick={() => setLogoPreview(null)}
                                                    >
                                                        Supprimer l'image
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <FormLabel>Image de couverture</FormLabel>
                                            <div className="mt-2">
                                                <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-48 w-full overflow-hidden relative bg-gray-50">
                                                    {coverPreview ? (
                                                        <img src={coverPreview} alt="Preview" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="text-center p-4">
                                                            <Image className="mx-auto h-12 w-12 text-gray-400" />
                                                            <div className="mt-2 text-sm text-gray-500">
                                                                <label htmlFor="cover-upload" className="relative cursor-pointer rounded-md font-medium text-videdressing-primary">
                                                                    <span>Cliquez pour ajouter une image de couverture</span>
                                                                    <Input
                                                                        id="cover-upload"
                                                                        name="cover_image"
                                                                        type="file"
                                                                        accept="image/*"
                                                                        className="sr-only"
                                                                        onChange={handleCoverChange}
                                                                    />
                                                                </label>
                                                            </div>
                                                            <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 3MB</p>
                                                        </div>
                                                    )}
                                                </div>
                                                {coverPreview && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="mt-2"
                                                        onClick={() => setCoverPreview(null)}
                                                    >
                                                        Supprimer l'image
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Coordonnées</h2>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Adresse *</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                            <Input className="pl-10" placeholder="Adresse de la boutique" {...field} />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Ville *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ville" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Téléphone *</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                        <Input className="pl-10" placeholder="+237 ..." {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email *</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                        <Input className="pl-10" placeholder="email@example.com" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Réseaux sociaux</h2>
                                <div className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="website"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Site web</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Link2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                        <Input className="pl-10" placeholder="https://www.votresite.com" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormDescription>Facultatif</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="facebook"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Facebook</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path fill="currentColor" d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
                                                        </svg>
                                                        <Input className="pl-10" placeholder="https://facebook.com/votreboutique" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormDescription>Facultatif</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="instagram"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Instagram</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3Z" />
                                                        </svg>
                                                        <Input className="pl-10" placeholder="https://instagram.com/votreboutique" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormDescription>Facultatif</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="acceptTerms"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                J'accepte les conditions générales de vente et la politique de confidentialité
                                            </FormLabel>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => router.get(route('marketplace.index'))}
                                >
                                    Annuler
                                </Button>
                                <Button type="submit">
                                    <Save className="mr-2 h-4 w-4" />
                                    Créer ma boutique
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </AppLayout>
    );
}

export default Create;
