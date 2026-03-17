import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CreditCard, Shield, Truck, Smartphone, Wallet, Package, Loader2, MapPin } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Cart, Delivery, SharedData } from '@/types';
import axios from "axios";



interface Props {
    cart: Cart;
    deliveries?: Delivery[];
}


function Create({cart, deliveries = []}: Props) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    
    const [isLoading, setIsLoading] = useState(false);
    const [isGeolocating, setIsGeolocating] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Formulaire de livraison - pré-rempli avec les infos utilisateur
    const [shippingForm, setShippingForm] = useState({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'CE',
        latitude: null as number | null,
        longitude: null as number | null,
    });

    // Formulaire de facturation
    const [billingForm, setBillingForm] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'CE'
    });

    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('mobile_money');
    const [shippingMethod, setShippingMethod] = useState('standard');

    const subTotal = Math.ceil(cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0));
    const shippingCost = shippingMethod === 'express' ? 2000 : shippingMethod === 'pickup' ? 500 : 0;
    const total = subTotal + shippingCost;

    const handleShippingChange = (field: string, value: string) => {
        setShippingForm(prev => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleBillingChange = (field: string, value: string) => {
        setBillingForm(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!shippingForm.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
        if (!shippingForm.lastName.trim()) newErrors.lastName = 'Le nom est requis';
        if (!shippingForm.email.trim()) newErrors.email = 'L\'email est requis';
        if (!shippingForm.phone.trim()) newErrors.phone = 'Le téléphone est requis';
        if (!shippingForm.address.trim()) newErrors.address = 'L\'adresse est requise';
        if (!shippingForm.city.trim()) newErrors.city = 'La ville est requise';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Récupérer la position GPS actuelle de l'utilisateur
     */
    const handleGeolocation = () => {
        if (!navigator.geolocation) {
            toast.error('La géolocalisation n\'est pas supportée par votre navigateur');
            return;
        }

        setIsGeolocating(true);
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                
                setShippingForm(prev => ({
                    ...prev,
                    latitude,
                    longitude,
                }));
                
                toast.success('Position GPS enregistrée avec succès !');
                setIsGeolocating(false);
            },
            (error) => {
                setIsGeolocating(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        toast.error('Veuillez autoriser la géolocalisation dans votre navigateur');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        toast.error('Position non disponible. Vérifiez votre GPS.');
                        break;
                    case error.TIMEOUT:
                        toast.error('Délai de géolocalisation dépassé. Réessayez.');
                        break;
                    default:
                        toast.error('Erreur lors de la géolocalisation');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    };

    /**
     * Effacer les coordonnées GPS
     */
    const clearGeolocation = () => {
        setShippingForm(prev => ({
            ...prev,
            latitude: null,
            longitude: null,
        }));
        toast.info('Coordonnées GPS effacées');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Veuillez remplir tous les champs obligatoires');
            return;
        }
        
        if (cart.items.length === 0) {
            toast.error('Votre panier est vide');
            return;
        }

        setIsLoading(true);

        // Préparer les données de la commande
        const orderData = {
            customer_name: `${shippingForm.firstName} ${shippingForm.lastName}`,
            customer_email: shippingForm.email,
            customer_phone: shippingForm.phone,
            delivery_address: shippingForm.address,
            delivery_city: shippingForm.city,
            delivery_postal_code: shippingForm.postalCode,
            delivery_region: shippingForm.country,
            delivery_address_latitude: shippingForm.latitude,
            delivery_address_longitude: shippingForm.longitude,
            shipping_method: shippingMethod,
            shipping_cost: shippingCost,
            payment_method: paymentMethod,
            notes: '',
        };

        // Paiement Mobile Money via Lygos
        if (paymentMethod === 'mobile_money' || paymentMethod === 'card') {
            try {
                const { data } = await axios.post("/lygos/pay", {
                    ...orderData,
                    total,
                });

                window.location.href = data.payment_url;
            } catch (error) {
                toast.error("Erreur lors du paiement");
                console.error(error);
                setIsLoading(false);
            }
        } else {
            // Paiement à la livraison
            router.post('/order', orderData, {
                onSuccess: () => {
                    toast.success('Commande passée avec succès !');
                },
                onError: (errors) => {
                    toast.error('Erreur lors de la création de la commande');
                    console.error(errors);
                    setIsLoading(false);
                },
                onFinish: () => {
                    setIsLoading(false);
                }
            });
        }
    };




    return (
        <AppLayout>
            <Head title="Finaliser ma commande" />
            <div className="container mx-auto px-4 py-8 md:px-8">
                <div className="mb-6 flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/my-cart">
                            <ArrowLeft size={20} />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold md:text-3xl dark:text-white">Finaliser ma commande</h1>
                </div>

                {cart.items.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Package size={64} className="mx-auto text-gray-400 mb-4" />
                            <h2 className="text-xl font-semibold dark:text-white mb-2">Votre panier est vide</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">Ajoutez des articles à votre panier pour passer commande</p>
                            <Button asChild>
                                <Link href="/products">Découvrir nos produits</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Formulaires */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Informations de livraison */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                    <CardTitle className="flex items-center gap-2">
                                        <Truck size={20} />
                                        Adresse de livraison
                                    </CardTitle>
                                      <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleGeolocation}
                disabled={isGeolocating}
                className="gap-2"
            >
                {isGeolocating ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        Localisation...
                    </>
                ) : (
                    <>
                        <MapPin size={16} />
                        Me localiser
                    </>
                )}
            </Button>
        </div>
    </CardHeader>
    
    {/* Indicateur de coordonnées GPS */}
    {shippingForm.latitude && shippingForm.longitude && (
        <div className="mx-6 mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
                <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                    <MapPin size={14} />
                    Position GPS enregistrée
                </p>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearGeolocation}
                    className="text-red-500 hover:text-red-700 h-auto py-1 px-2"
                >
                    Supprimer
                </Button>
            </div>
            <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                Lat: {shippingForm.latitude.toFixed(6)}, Lng: {shippingForm.longitude.toFixed(6)}
            </p>
        </div>
    )}

    {/* Message d'aide si pas de GPS */}
    {!shippingForm.latitude && (
        <div className="mx-6 mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
                <MapPin size={14} />
                Cliquez sur "Me localiser" pour une livraison plus précise
            </p>
        </div>
    )}
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor="firstName">Prénom *</Label>
                                            <Input
                                                id="firstName"
                                                value={shippingForm.firstName}
                                                onChange={(e) => handleShippingChange('firstName', e.target.value)}
                                                className={errors.firstName ? 'border-red-500' : ''}
                                            />
                                            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="lastName">Nom *</Label>
                                            <Input
                                                id="lastName"
                                                value={shippingForm.lastName}
                                                onChange={(e) => handleShippingChange('lastName', e.target.value)}
                                                className={errors.lastName ? 'border-red-500' : ''}
                                            />
                                            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
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
                                                className={errors.email ? 'border-red-500' : ''}
                                            />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Téléphone *</Label>
                                            <Input
                                                id="phone"
                                                value={shippingForm.phone}
                                                onChange={(e) => handleShippingChange('phone', e.target.value)}
                                                className={errors.phone ? 'border-red-500' : ''}
                                                placeholder="+237 656 921 921"
                                            />
                                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="address">Adresse complète *</Label>
                                        <Input
                                            id="address"
                                            value={shippingForm.address}
                                            onChange={(e) => handleShippingChange('address', e.target.value)}
                                            className={errors.address ? 'border-red-500' : ''}
                                            placeholder="Rue, quartier, repère..."
                                        />
                                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div>
                                            <Label htmlFor="city">Ville *</Label>
                                            <Input
                                                id="city"
                                                value={shippingForm.city}
                                                onChange={(e) => handleShippingChange('city', e.target.value)}
                                                className={errors.city ? 'border-red-500' : ''}
                                            />
                                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
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
                                                    <SelectItem value="CE">Centre</SelectItem>
                                                    <SelectItem value="LT">Littoral</SelectItem>
                                                    <SelectItem value="OE">Ouest</SelectItem>
                                                    <SelectItem value="ES">Est</SelectItem>
                                                    <SelectItem value="NO">Nord</SelectItem>
                                                    <SelectItem value="SU">Sud</SelectItem>
                                                    <SelectItem value="EN">Extrême-Nord</SelectItem>
                                                    <SelectItem value="AD">Adamaoua</SelectItem>
                                                    <SelectItem value="NW">Nord-Ouest</SelectItem>
                                                    <SelectItem value="SW">Sud-Ouest</SelectItem>
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
                                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                                        <div className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors ${shippingMethod === 'standard' ? 'border-primary bg-primary/5' : 'hover:border-gray-300'}`}>
                                            <RadioGroupItem value="standard" id="standard" />
                                            <Label htmlFor="standard" className="flex-1 cursor-pointer">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium dark:text-white">Livraison standard</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">3-5 jours ouvrés</p>
                                                    </div>
                                                    <span className="font-medium text-green-600">Gratuit</span>
                                                </div>
                                            </Label>
                                        </div>
                                        <div className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors ${shippingMethod === 'express' ? 'border-primary bg-primary/5' : 'hover:border-gray-300'}`}>
                                            <RadioGroupItem value="express" id="express" />
                                            <Label htmlFor="express" className="flex-1 cursor-pointer">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium dark:text-white">Livraison express</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">1-2 jours ouvrés</p>
                                                    </div>
                                                    <span className="font-medium">2 000 FCFA</span>
                                                </div>
                                            </Label>
                                        </div>
                                        <div className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors ${shippingMethod === 'pickup' ? 'border-primary bg-primary/5' : 'hover:border-gray-300'}`}>
                                            <RadioGroupItem value="pickup" id="pickup" />
                                            <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium dark:text-white">Retrait en point relais</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">2-3 jours ouvrés</p>
                                                    </div>
                                                    <span className="font-medium">500 FCFA</span>
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
                                        <Label htmlFor="sameAsShipping" className="cursor-pointer">Identique à l'adresse de livraison</Label>
                                    </div>

                                    {!sameAsShipping && (
                                        <div className="space-y-4 pt-4 border-t dark:border-neutral-700">
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <Label htmlFor="billingFirstName">Prénom *</Label>
                                                    <Input
                                                        id="billingFirstName"
                                                        value={billingForm.firstName}
                                                        onChange={(e) => handleBillingChange('firstName', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="billingLastName">Nom *</Label>
                                                    <Input
                                                        id="billingLastName"
                                                        value={billingForm.lastName}
                                                        onChange={(e) => handleBillingChange('lastName', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="billingAddress">Adresse complète *</Label>
                                                <Input
                                                    id="billingAddress"
                                                    value={billingForm.address}
                                                    onChange={(e) => handleBillingChange('address', e.target.value)}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                <div>
                                                    <Label htmlFor="billingCity">Ville *</Label>
                                                    <Input
                                                        id="billingCity"
                                                        value={billingForm.city}
                                                        onChange={(e) => handleBillingChange('city', e.target.value)}
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
                                                            <SelectItem value="CE">Centre</SelectItem>
                                                            <SelectItem value="LT">Littoral</SelectItem>
                                                            <SelectItem value="OE">Ouest</SelectItem>
                                                            <SelectItem value="ES">Est</SelectItem>
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
                                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                                        <div className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors ${paymentMethod === 'mobile_money' ? 'border-primary bg-primary/5' : 'hover:border-gray-300'}`}>
                                            <RadioGroupItem value="mobile_money" id="mobile_money" />
                                            <Label htmlFor="mobile_money" className="flex-1 cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <Smartphone size={20} className="text-orange-500" />
                                                    <div>
                                                        <p className="font-medium dark:text-white">Mobile Money</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Orange Money, MTN Money, etc.</p>
                                                    </div>
                                                </div>
                                            </Label>
                                        </div>
                                        <div className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'hover:border-gray-300'}`}>
                                            <RadioGroupItem value="card" id="card" />
                                            <Label htmlFor="card" className="flex-1 cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <CreditCard size={20} className="text-blue-500" />
                                                    <div>
                                                        <p className="font-medium dark:text-white">Carte bancaire</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Visa, Mastercard</p>
                                                    </div>
                                                </div>
                                            </Label>
                                        </div>
                                        <div className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors ${paymentMethod === 'cash_on_delivery' ? 'border-primary bg-primary/5' : 'hover:border-gray-300'}`}>
                                            <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                                            <Label htmlFor="cash_on_delivery" className="flex-1 cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <Wallet size={20} className="text-green-500" />
                                                    <div>
                                                        <p className="font-medium dark:text-white">Paiement à la livraison</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Payez en espèces à la réception</p>
                                                    </div>
                                                </div>
                                            </Label>
                                        </div>
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
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {cart.items.map((item) => (
                                            <div key={item.product.id} className="flex items-center gap-3">
                                                <img
                                                    src={item.product.images?.[0]?.url || '/placeholder.svg'}
                                                    alt={item.product.name}
                                                    className="h-14 w-14 rounded object-cover"
                                                />
                                                <div className="flex-1 text-sm min-w-0">
                                                    <p className="font-medium dark:text-white truncate">{item.product.name}</p>
                                                    <p className="text-gray-600 dark:text-gray-400">Qté: {item.quantity}</p>
                                                </div>
                                                <p className="text-sm font-medium dark:text-white">{item.product.price * item.quantity} FCFA</p>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator />

                                    {/* Totaux */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Sous-total ({cart.items.length} articles)</span>
                                            <span className="dark:text-white">{subTotal.toLocaleString()} FCFA</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Livraison</span>
                                            <span className={shippingCost === 0 ? 'text-green-600' : 'dark:text-white'}>
                                                {shippingCost === 0 ? 'Gratuit' : `${shippingCost.toLocaleString()} FCFA`}
                                            </span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-bold text-lg">
                                            <span className="dark:text-white">Total</span>
                                            <span className="text-primary">{total.toLocaleString()} FCFA</span>
                                        </div>
                                    </div>

                                    {/* Sécurité */}
                                    <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-900/20 p-3 text-sm">
                                        <Shield size={16} className="text-green-600" />
                                        <span className="text-green-700 dark:text-green-400">Paiement 100% sécurisé</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex-col gap-3">
                                    <Button 
                                        type="submit" 
                                        className="w-full" 
                                        size="lg" 
                                        disabled={isLoading || cart.items.length === 0}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Traitement...
                                            </>
                                        ) : (
                                            `Payer ${total.toLocaleString()} FCFA`
                                        )}
                                    </Button>
                                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                                        En passant commande, vous acceptez nos conditions générales de vente
                                    </p>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </form>
                )}
            </div>
        </AppLayout>
    );
}

export default Create;
