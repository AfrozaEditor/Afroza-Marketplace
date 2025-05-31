import { Head, router } from '@inertiajs/react';
import { Eye, EyeClosed, LoaderCircle, Store, Truck, User } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// type RegisterForm = {
//     name: string;
//     email: string;
//     password: string;
//     password_confirmation: string;
// };

const formSchema = z.object({
    name: z.string().min(2, {
        message: 'Le nom doit contenir au moins 2 caractères.'
    }),
    email: z.string().email({
        message: 'Veuillez entrer une adresse email valide.'
    }),
    password: z.string().min(8, {
        message: 'Le mot de passe doit contenir au moins 8 caractères.'
    }),
    role: z.enum(['customer', 'vendor', 'delivery'], {
        required_error: 'Veuillez sélectionner un rôle.'
    })
});

type RegisterFormValues = z.infer<typeof formSchema>;

export default function Register() {
    // const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
    //     name: '',
    //     email: '',
    //     password: '',
    //     password_confirmation: '',
    // });
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            // password_confirmation: "",
            role: 'customer'
        }
    });

    const submit = async (data: RegisterFormValues) => {
        router.post(route('register'), data, {
            onSuccess: () => {
                toast.success('Compte créé avec succès!', {
                    description: 'Vous allez être redirigé vers la page d\'accueil.'
                });
                // Optionnel : reset le formulaire
                form.reset();
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la création du compte.', {
                    description: 'Veuillez vérifier vos informations et réessayer.'
                });
            }
        });
    };

    return (
        <AuthLayout title="Créer un compte" description="Enter your details below to create your account">
            <Head title="Register" />
            <Form {...form}>
                <form
                    className="flex flex-col gap-6"
                    onSubmit={form.handleSubmit(submit)}
                >
                    {/* <div className="grid gap-6"> */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom</FormLabel>
                                <FormControl>
                                    <Input placeholder="Votre nom" {...field} />
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
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="example@gmail.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mot de passe</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input type={showPassword ? 'text' : 'password'}
                                               placeholder="Mot de passe" {...field} />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="absolute right-3 top-2.5 h-5 w-5 p-0"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <Eye className="h-4 w-4 text-primary" />
                                            ) : (
                                                <EyeClosed className="h-4 w-4 text-primary" />
                                            )}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/*<div className="grid gap-2">*/}
                    {/*    <Label htmlFor="password_confirmation">Confirm password</Label>*/}
                    {/*    <Input*/}
                    {/*        id="password_confirmation"*/}
                    {/*        type="password"*/}
                    {/*        required*/}
                    {/*        tabIndex={4}*/}
                    {/*        autoComplete="new-password"*/}
                    {/*        value={data.password_confirmation}*/}
                    {/*        onChange={(e) => setData('password_confirmation', e.target.value)}*/}
                    {/*        disabled={processing}*/}
                    {/*        placeholder="Confirm password"*/}
                    {/*    />*/}
                    {/*    <InputError message={errors.password_confirmation} />*/}
                    {/*</div>*/}
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Je m'inscris en tant que</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        className="grid grid-cols-3 gap-4 mt-2"
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <FormItem
                                                        className={`flex flex-col items-center space-y-3 rounded-md border p-4 cursor-pointer ${field.value === 'customer' ? 'border-primary bg-muted/50' : ''}`}
                                                        onClick={() => field.onChange('customer')}
                                                    >
                                                        <FormControl>
                                                            <RadioGroupItem value="customer" className="sr-only" />
                                                        </FormControl>
                                                        <User
                                                            className={`h-6 w-6 ${field.value === 'customer' ? 'text-primary' : ''}`} />
                                                        <FormLabel
                                                            className="font-normal text-center">Acheteur</FormLabel>
                                                    </FormItem>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-lg">Rôle dédié uniquement pour l'achat des produits auprès de nos vendeurs</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <FormItem
                                                className={`flex flex-col items-center space-y-3 rounded-md border p-4 cursor-pointer ${field.value === 'vendor' ? 'border-primary bg-muted/50' : ''}`}
                                                onClick={() => field.onChange('vendor')}
                                            >
                                                <FormControl>
                                                    <RadioGroupItem value="vendor" className="sr-only" />
                                                </FormControl>
                                                <Store
                                                    className={`h-6 w-6 ${field.value === 'vendor' ? 'text-primary' : ''}`} />
                                                <FormLabel className="font-normal text-center">Vendeur</FormLabel>
                                            </FormItem>
                                            <FormItem
                                                className={`flex flex-col items-center space-y-3 rounded-md border p-4 cursor-pointer ${field.value === 'delivery' ? 'border-primary bg-muted/50' : ''}`}
                                                onClick={() => field.onChange('delivery')}
                                            >
                                                <FormControl>
                                                    <RadioGroupItem value="delivery" className="sr-only" />
                                                </FormControl>
                                                <Truck
                                                    className={`h-6 w-6 ${field.value === 'delivery' ? 'text-primary' : ''}`} />
                                                <FormLabel className="font-normal text-center">Livreur</FormLabel>
                                            </FormItem>
                                        </TooltipProvider>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="mt-2 w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? (
                            <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Créer un compte
                    </Button>
                    {/* </div> */}

                    <div className="text-muted-foreground text-center text-sm">
                        Vous avez déjà un compte?{' '}
                        <TextLink href={route('login')} tabIndex={6}>
                            Se connecter
                        </TextLink>
                    </div>
                </form>
            </Form>
        </AuthLayout>
    );
}
