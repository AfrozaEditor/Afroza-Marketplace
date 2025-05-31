import React, { useState } from 'react';
import { z } from 'zod';
import AppLayout from '@/layouts/app-layout';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, MapPin, Package, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// Form validation schema
const deliveryRegistrationSchema = z.object({
    // Personal information
    fullName: z.string().min(2, { message: "Le nom complet est requis" }),
    email: z.string().email({ message: "Email invalide" }),
    phone: z.string().min(10, { message: "Numéro de téléphone invalide" }),
    address: z.string().min(5, { message: "Adresse requise" }),
    city: z.string().min(2, { message: "Ville requise" }),
    postalCode: z.string().min(5, { message: "Code postal requis" }),

    // Vehicle information
    vehicleType: z.string().min(1, { message: "Type de véhicule requis" }),
    vehicleModel: z.string().min(1, { message: "Modèle du véhicule requis" }),
    licensePlate: z.string().min(1, { message: "Numéro d'immatriculation requis" }),

    // Delivery preferences
    deliveryZone: z.string().min(1, { message: "Zone de livraison requise" }),
    availability: z.string().min(1, { message: "Disponibilité requise" }),

    // Legal and documents
    idCardNumber: z.string().min(1, { message: "Numéro de carte d'identité requis" }),
    drivingLicense: z.string().min(1, { message: "Numéro de permis de conduire requis" }),
    insuranceNumber: z.string().min(1, { message: "Numéro d'assurance requis" }),

    // Additional information
    experience: z.string().optional(),
});

type DeliveryRegistrationFormValues = z.infer<typeof deliveryRegistrationSchema>;


function Create() {

    const [activeStep, setActiveStep] = useState<string>("personal");
    const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
    // const locationParams = useLocation();
    // const queryParams = new URLSearchParams(locationParams.search);
    // const emailFromParams = queryParams.get('email') || '';

    const form = useForm<DeliveryRegistrationFormValues>({
        resolver: zodResolver(deliveryRegistrationSchema),
        defaultValues: {
            fullName: "",
            // email: emailFromParams,
            email: "",
            phone: "",
            address: "",
            city: "",
            postalCode: "",

            vehicleType: "",
            vehicleModel: "",
            licensePlate: "",

            deliveryZone: "",
            availability: "",

            idCardNumber: "",
            drivingLicense: "",
            insuranceNumber: "",

            experience: "",
        },
    });

    const handleMapLocationSelect = (selectedLocation: { lat: number; lng: number; address: string }) => {
        setLocation(selectedLocation);
        form.setValue('address', selectedLocation.address);

        // Extract city and postal code from the address if possible
        const addressParts = selectedLocation.address.split(',');
        if (addressParts.length >= 3) {
            const postalCodeAndCity = addressParts[addressParts.length - 2].trim();
            const postalCodeMatch = postalCodeAndCity.match(/\d{5}/);

            if (postalCodeMatch) {
                const postalCode = postalCodeMatch[0];
                const city = postalCodeAndCity.replace(postalCode, '').trim();

                form.setValue('postalCode', postalCode);
                form.setValue('city', city);
            }
        }
    };

    const nextStep = () => {
        switch (activeStep) {
            case 'personal':
                setActiveStep('vehicle');
                break;
            case 'vehicle':
                setActiveStep('zone');
                break;
            case 'zone':
                setActiveStep('documents');
                break;
            case 'documents':
                setActiveStep('review');
                break;
            default:
                break;
        }
    };

    const prevStep = () => {
        switch (activeStep) {
            case 'vehicle':
                setActiveStep('personal');
                break;
            case 'zone':
                setActiveStep('vehicle');
                break;
            case 'documents':
                setActiveStep('zone');
                break;
            case 'review':
                setActiveStep('documents');
                break;
            default:
                break;
        }
    };

    const onSubmit = (values: DeliveryRegistrationFormValues) => {
        console.log("Form submission values:", values);
        toast.success("Votre inscription en tant que livreur a été soumise avec succès!");
        // navigate('/');
    };

    return (
        <AppLayout>
            <div className="container mx-auto py-10 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold">Inscription Livreur</h1>
                        <p className="text-muted-foreground mt-2">Rejoignez notre équipe de livreurs et commencez à gagner de l'argent</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex space-x-2">
                                    <div className={`rounded-full p-2 ${activeStep === 'personal' ? 'bg-primary' : 'bg-gray-200'}`}>
                                        <User size={20} className={activeStep === 'personal' ? 'text-white' : 'text-gray-500'} />
                                    </div>
                                    <div className={`rounded-full p-2 ${activeStep === 'vehicle' ? 'bg-primary' : 'bg-gray-200'}`}>
                                        <Package size={20} className={activeStep === 'vehicle' ? 'text-white' : 'text-gray-500'} />
                                    </div>
                                    <div className={`rounded-full p-2 ${activeStep === 'zone' ? 'bg-primary' : 'bg-gray-200'}`}>
                                        <MapPin size={20} className={activeStep === 'zone' ? 'text-white' : 'text-gray-500'} />
                                    </div>
                                    <div className={`rounded-full p-2 ${activeStep === 'documents' || activeStep === 'review' ? 'bg-primary' : 'bg-gray-200'}`}>
                                        <CheckCircle size={20} className={activeStep === 'documents' || activeStep === 'review' ? 'text-white' : 'text-gray-500'} />
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Étape {activeStep === 'personal' ? '1' : activeStep === 'vehicle' ? '2' : activeStep === 'zone' ? '3' : '4'} sur 4
                                </div>
                            </div>

                            <CardTitle className="text-xl">
                                {activeStep === 'personal' && "Informations personnelles"}
                                {activeStep === 'vehicle' && "Informations sur votre véhicule"}
                                {activeStep === 'zone' && "Zone de livraison"}
                                {activeStep === 'documents' && "Documents légaux"}
                                {activeStep === 'review' && "Récapitulatif et soumission"}
                            </CardTitle>
                            <CardDescription>
                                {activeStep === 'personal' && "Veuillez fournir vos informations personnelles"}
                                {activeStep === 'vehicle' && "Informations sur le véhicule que vous utiliserez pour les livraisons"}
                                {activeStep === 'zone' && "Indiquez votre zone de livraison et vos disponibilités"}
                                {activeStep === 'documents' && "Documents légaux nécessaires pour devenir livreur"}
                                {activeStep === 'review' && "Vérifiez vos informations avant de soumettre"}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <Tabs value={activeStep} onValueChange={setActiveStep}>
                                        {/* Personal Information */}
                                        <TabsContent value="personal" className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="fullName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Nom complet</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Jean Dupont" {...field} />
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
                                                            <Input placeholder="exemple@email.com" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Numéro de téléphone</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="06 12 34 56 78" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Adresse</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="123 Rue de Paris" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="city"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Ville</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Paris" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="postalCode"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Code postal</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="75001" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="flex justify-end pt-4">
                                                <Button type="button" onClick={nextStep}>Continuer</Button>
                                            </div>
                                        </TabsContent>

                                        {/* Vehicle Information */}
                                        <TabsContent value="vehicle" className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="vehicleType"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Type de véhicule</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Voiture, Moto, Vélo, etc." {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="vehicleModel"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Modèle du véhicule</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="ex: Renault Clio, Honda CBR, etc." {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="licensePlate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Numéro d'immatriculation</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="AB-123-CD" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="flex justify-between pt-4">
                                                <Button type="button" variant="outline" onClick={prevStep}>Retour</Button>
                                                <Button type="button" onClick={nextStep}>Continuer</Button>
                                            </div>
                                        </TabsContent>

                                        {/* Delivery Zone */}
                                        <TabsContent value="zone" className="space-y-4">
                                            <div className="space-y-4">
                                                <h4 className="font-medium">Sélectionnez votre zone de livraison sur la carte</h4>
                                                {/*<DeliveryMap onLocationSelect={handleMapLocationSelect} />*/}
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name="deliveryZone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Zone de livraison</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="ex: Paris 10ème, Paris 11ème" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Les zones où vous êtes prêt à effectuer des livraisons
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="availability"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Disponibilité</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="ex: Lundi-Vendredi, 9h-17h" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Vos jours et heures de disponibilité pour effectuer des livraisons
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="flex justify-between pt-4">
                                                <Button type="button" variant="outline" onClick={prevStep}>Retour</Button>
                                                <Button type="button" onClick={nextStep}>Continuer</Button>
                                            </div>
                                        </TabsContent>

                                        {/* Documents Information */}
                                        <TabsContent value="documents" className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="idCardNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Numéro de carte d'identité</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Numéro de votre carte d'identité" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="drivingLicense"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Numéro de permis de conduire</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Numéro de votre permis de conduire" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="insuranceNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Numéro d'assurance</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Numéro de votre assurance" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="experience"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Expérience en livraison (optionnel)</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="Décrivez votre expérience en livraison..." {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Parlez-nous de votre expérience en matière de livraison ou de service client
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="flex justify-between pt-4">
                                                <Button type="button" variant="outline" onClick={prevStep}>Retour</Button>
                                                <Button type="button" onClick={nextStep}>Vérifier et soumettre</Button>
                                            </div>
                                        </TabsContent>

                                        {/* Review and Submit */}
                                        <TabsContent value="review" className="space-y-4">
                                            <div className="divide-y">
                                                <div className="py-2">
                                                    <h3 className="font-medium">Informations personnelles</h3>
                                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                                        <div>Nom complet:</div>
                                                        <div className="font-medium">{form.getValues('fullName')}</div>
                                                        <div>Email:</div>
                                                        <div className="font-medium">{form.getValues('email')}</div>
                                                        <div>Téléphone:</div>
                                                        <div className="font-medium">{form.getValues('phone')}</div>
                                                        <div>Adresse:</div>
                                                        <div className="font-medium">{form.getValues('address')}</div>
                                                        <div>Ville:</div>
                                                        <div className="font-medium">{form.getValues('city')}</div>
                                                        <div>Code postal:</div>
                                                        <div className="font-medium">{form.getValues('postalCode')}</div>
                                                    </div>
                                                </div>

                                                <div className="py-2">
                                                    <h3 className="font-medium">Informations véhicule</h3>
                                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                                        <div>Type de véhicule:</div>
                                                        <div className="font-medium">{form.getValues('vehicleType')}</div>
                                                        <div>Modèle:</div>
                                                        <div className="font-medium">{form.getValues('vehicleModel')}</div>
                                                        <div>Immatriculation:</div>
                                                        <div className="font-medium">{form.getValues('licensePlate')}</div>
                                                    </div>
                                                </div>

                                                <div className="py-2">
                                                    <h3 className="font-medium">Zone de livraison</h3>
                                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                                        <div>Zone:</div>
                                                        <div className="font-medium">{form.getValues('deliveryZone')}</div>
                                                        <div>Disponibilité:</div>
                                                        <div className="font-medium">{form.getValues('availability')}</div>
                                                    </div>
                                                </div>

                                                <div className="py-2">
                                                    <h3 className="font-medium">Documents</h3>
                                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                                        <div>Carte d'identité:</div>
                                                        <div className="font-medium">••••••{form.getValues('idCardNumber').slice(-4)}</div>
                                                        <div>Permis de conduire:</div>
                                                        <div className="font-medium">••••••{form.getValues('drivingLicense').slice(-4)}</div>
                                                        <div>Assurance:</div>
                                                        <div className="font-medium">••••••{form.getValues('insuranceNumber').slice(-4)}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col space-y-2 mt-4">
                                                <p className="text-sm text-muted-foreground">
                                                    En soumettant ce formulaire, vous acceptez nos conditions générales et notre politique de confidentialité.
                                                </p>
                                                <div className="flex justify-between pt-4">
                                                    <Button type="button" variant="outline" onClick={prevStep}>Retour</Button>
                                                    <Button type="submit">Soumettre</Button>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

export default Create;
