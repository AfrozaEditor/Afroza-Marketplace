import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, CreditCard, Shield, Truck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

function Create() {
    const [isLoading, setIsLoading] = useState(false);

    // Formulaire de livraison
    const [shippingForm, setShippingForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'CI'
    });

    // Formulaire de facturation
    const [billingForm, setBillingForm] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'CI'
    });

    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [shippingMethod, setShippingMethod] = useState('standard');

    const subTotal = 100;
    const shippingCost = shippingMethod === 'express' ? 2000 : 0;
    const total = subTotal + shippingCost;

    const handleShippingChange = (field: string, value: string) => {
        setShippingForm(prev => ({ ...prev, [field]: value }));
    };

    const handleBillingChange = (field: string, value: string) => {
        setBillingForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulation d'un traitement de paiement
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simulation réussie
            toast.success('Commande validée avec succès !');
            router.post('/commandes');
        } catch (error) {
            toast.error('Erreur lors du traitement du paiement');
        } finally {
            setIsLoading(false);
        }
    };

    // if (cartItems.length === 0) {
    //     return (
    //         <div className="text-center py-12">
    //             <h2 className="text-2xl font-semibold mb-4">Votre panier est vide</h2>
    //             <p className="text-gray-600 mb-6">Ajoutez des articles à votre panier pour procéder au paiement.</p>
    //             <Button asChild>
    //                 <Link href="/products">Continuer les achats</Link>
    //             </Button>
    //         </div>
    //     );
    // }



    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8 md:px-8">
                <div className="mb-6 flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/my-cart">
                            <ArrowLeft size={20} />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold md:text-3xl">Finaliser ma commande</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Formulaires */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Informations de livraison */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Truck size={20} />
                                        Adresse de livraison
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor="firstName">Prénom *</Label>
                                            <Input
                                                id="firstName"
                                                value={shippingForm.firstName}
                                                onChange={(e) => handleShippingChange('firstName', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="lastName">Nom *</Label>
                                            <Input
                                                id="lastName"
                                                value={shippingForm.lastName}
                                                onChange={(e) => handleShippingChange('lastName', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor="email">Email *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={shippingForm.email}
                                                onChange={(e) => handleShippingChange('email', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Téléphone *</Label>
                                            <Input
                                                id="phone"
                                                value={shippingForm.phone}
                                                onChange={(e) => handleShippingChange('phone', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="address">Adresse complète *</Label>
                                        <Input
                                            id="address"
                                            value={shippingForm.address}
                                            onChange={(e) => handleShippingChange('address', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div>
                                            <Label htmlFor="city">Ville *</Label>
                                            <Input
                                                id="city"
                                                value={shippingForm.city}
                                                onChange={(e) => handleShippingChange('city', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="postalCode">Code postal</Label>
                                            <Input
                                                id="postalCode"
                                                value={shippingForm.postalCode}
                                                onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="country">Région *</Label>
                                            <Select value={shippingForm.country} onValueChange={(value) => handleShippingChange('country', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="CI">Centre</SelectItem>
                                                    <SelectItem value="SN">Littoral</SelectItem>
                                                    <SelectItem value="ML">Ouest</SelectItem>
                                                    <SelectItem value="BF">Est</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Options de livraison */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Mode de livraison</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                                        <div className="flex items-center space-x-2 rounded-lg border p-3">
                                            <RadioGroupItem value="standard" id="standard" />
                                            <Label htmlFor="standard" className="flex-1 cursor-pointer">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium">Livraison standard</p>
                                                        <p className="text-sm text-gray-600">3-5 jours ouvrés</p>
                                                    </div>
                                                    <span className="font-medium text-green-600">Gratuit</span>
                                                </div>
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 rounded-lg border p-3">
                                            <RadioGroupItem value="express" id="express" />
                                            <Label htmlFor="express" className="flex-1 cursor-pointer">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium">Livraison express</p>
                                                        <p className="text-sm text-gray-600">1-2 jours ouvrés</p>
                                                    </div>
                                                    <span className="font-medium">{2000} FCFA</span>
                                                </div>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>

                            {/* Adresse de facturation */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Adresse de facturation</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="sameAsShipping"
                                            checked={sameAsShipping}
                                            onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
                                        />
                                        <Label htmlFor="sameAsShipping">Identique à l'adresse de livraison</Label>
                                    </div>

                                    {!sameAsShipping && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <Label htmlFor="billingFirstName">Prénom *</Label>
                                                    <Input
                                                        id="billingFirstName"
                                                        value={billingForm.firstName}
                                                        onChange={(e) => handleBillingChange('firstName', e.target.value)}
                                                        required={!sameAsShipping}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="billingLastName">Nom *</Label>
                                                    <Input
                                                        id="billingLastName"
                                                        value={billingForm.lastName}
                                                        onChange={(e) => handleBillingChange('lastName', e.target.value)}
                                                        required={!sameAsShipping}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="billingAddress">Adresse complète *</Label>
                                                <Input
                                                    id="billingAddress"
                                                    value={billingForm.address}
                                                    onChange={(e) => handleBillingChange('address', e.target.value)}
                                                    required={!sameAsShipping}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                <div>
                                                    <Label htmlFor="billingCity">Ville *</Label>
                                                    <Input
                                                        id="billingCity"
                                                        value={billingForm.city}
                                                        onChange={(e) => handleBillingChange('city', e.target.value)}
                                                        required={!sameAsShipping}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="billingPostalCode">Code postal</Label>
                                                    <Input
                                                        id="billingPostalCode"
                                                        value={billingForm.postalCode}
                                                        onChange={(e) => handleBillingChange('postalCode', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="billingCountry">Région *</Label>
                                                    <Select
                                                        value={billingForm.country}
                                                        onValueChange={(value) => handleBillingChange('country', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="CI">Centre</SelectItem>
                                                            <SelectItem value="SN">Littoral</SelectItem>
                                                            <SelectItem value="ML">Ouest</SelectItem>
                                                            <SelectItem value="BF">Est</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Méthode de paiement */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard size={20} />
                                        Méthode de paiement
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                                        <div className="flex items-center space-x-2 rounded-lg border p-3">
                                            <RadioGroupItem value="card" id="card" />
                                            <Label htmlFor="card" className="flex-1 cursor-pointer">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard size={16} />
                                                    <span>Carte bancaire</span>
                                                </div>
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 rounded-lg border p-3">
                                            <RadioGroupItem value="mobile" id="mobile" />
                                            <Label htmlFor="mobile" className="flex-1 cursor-pointer">
                                                <div className="flex items-center gap-2">
                                                    <span>Paiement mobile (Orange Money, MTN Money)</span>
                                                </div>
                                            </Label>
                                        </div>
                                        {/*<div className="flex items-center space-x-2 rounded-lg border p-3">*/}
                                        {/*    <RadioGroupItem value="cash" id="cash" />*/}
                                        {/*    <Label htmlFor="cash" className="flex-1 cursor-pointer">*/}
                                        {/*        <div className="flex items-center gap-2">*/}
                                        {/*            <span>Paiement à la livraison</span>*/}
                                        {/*        </div>*/}
                                        {/*    </Label>*/}
                                        {/*</div>*/}
                                    </RadioGroup>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Résumé de la commande */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-4">
                                <CardHeader>
                                    <CardTitle>Résumé de la commande</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Articles */}
                                    <div className="space-y-3">
                                        {/*{cartItems.map((item) => (*/}
                                        {/*    <div key={item.product.id} className="flex items-center gap-3">*/}
                                        {/*        <img*/}
                                        {/*            src={item.product.image || '/placeholder.svg'}*/}
                                        {/*            alt={item.product.name}*/}
                                        {/*            className="h-12 w-12 rounded object-cover"*/}
                                        {/*        />*/}
                                        {/*        <div className="flex-1 text-sm">*/}
                                        {/*            <p className="font-medium">{item.product.name}</p>*/}
                                        {/*            <p className="text-gray-600">Qty: {item.quantity}</p>*/}
                                        {/*        </div>*/}
                                        {/*        <p className="text-sm font-medium">{item.product.price * item.quantity} FCFA</p>*/}
                                        {/*    </div>*/}
                                        {/*))}*/}
                                    </div>

                                    <Separator />

                                    {/* Totaux */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Sous-total</span>
                                            <span>{subTotal} FCFA</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Livraison</span>
                                            <span>{shippingCost === 0 ? 'Gratuit' : `${shippingCost} FCFA`}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-bold">
                                            <span>Total</span>
                                            <span>{total} FCFA</span>
                                        </div>
                                    </div>

                                    {/* Sécurité */}
                                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                                        <Shield size={16} className="text-green-600" />
                                        <span>Paiement 100% sécurisé</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                        {isLoading ? 'Traitement...' : `Payer ${total} FCFA`}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

export default Create;
