import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Store, Truck, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface RoleOption {
    id: 'customer' | 'vendor' | 'delivery';
    title: string;
    description: string;
    icon: React.ElementType;
    features: string[];
}

const roles: RoleOption[] = [
    {
        id: 'customer',
        title: 'Client',
        description: 'Je souhaite acheter des articles',
        icon: ShoppingBag,
        features: [
            'Parcourir les produits',
            'Ajouter au panier',
            'Passer des commandes',
            'Suivre mes livraisons',
            'Laisser des avis',
        ],
    },
    {
        id: 'vendor',
        title: 'Vendeur',
        description: 'Je souhaite vendre mes articles',
        icon: Store,
        features: [
            'Créer ma boutique',
            'Mettre en vente mes produits',
            'Gérer mes commandes',
            'Recevoir des paiements',
            'Voir mes statistiques',
        ],
    },
    {
        id: 'delivery',
        title: 'Livreur',
        description: 'Je souhaite livrer des commandes',
        icon: Truck,
        features: [
            'Postuler comme livreur',
            'Accepter des livraisons',
            'Suivre mes courses',
            'Recevoir des commissions',
            'Gérer mon planning',
        ],
    },
];

export default function ChooseRole() {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = () => {
        if (!selectedRole) {
            toast.error('Veuillez sélectionner un rôle');
            return;
        }

        setIsLoading(true);
        
        router.post(route('auth.store-role'), { role: selectedRole }, {
            onSuccess: () => {
                toast.success('Rôle enregistré avec succès !');
            },
            onError: (errors) => {
                toast.error('Une erreur est survenue');
                console.error(errors);
                setIsLoading(false);
            },
            onFinish: () => {
                setIsLoading(false);
            },
        });
    };

    return (
        <>
            <Head title="Choisir mon rôle" />
            
            <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Bienvenue sur Vide-Dressing !
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Pour commencer, dites-nous comment vous souhaitez utiliser la plateforme
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {roles.map((role) => {
                            const Icon = role.icon;
                            const isSelected = selectedRole === role.id;
                            
                            return (
                                <Card
                                    key={role.id}
                                    className={cn(
                                        'cursor-pointer transition-all duration-200 hover:shadow-lg relative overflow-hidden',
                                        isSelected 
                                            ? 'ring-2 ring-primary border-primary shadow-lg scale-[1.02]' 
                                            : 'hover:border-primary/50'
                                    )}
                                    onClick={() => setSelectedRole(role.id)}
                                >
                                    {isSelected && (
                                        <div className="absolute top-3 right-3 bg-primary text-white rounded-full p-1">
                                            <Check size={16} />
                                        </div>
                                    )}
                                    
                                    <CardHeader className="text-center pb-2">
                                        <div className={cn(
                                            'mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors',
                                            isSelected 
                                                ? 'bg-primary text-white' 
                                                : 'bg-primary/10 text-primary'
                                        )}>
                                            <Icon size={32} />
                                        </div>
                                        <CardTitle className="text-xl">{role.title}</CardTitle>
                                        <CardDescription className="text-sm">
                                            {role.description}
                                        </CardDescription>
                                    </CardHeader>
                                    
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {role.features.map((feature, index) => (
                                                <li 
                                                    key={index} 
                                                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                                                >
                                                    <Check size={14} className="text-green-500 flex-shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="text-center">
                        <Button
                            size="lg"
                            onClick={handleSubmit}
                            disabled={!selectedRole || isLoading}
                            className="min-w-[200px]"
                        >
                            {isLoading ? (
                                <>
                                    <span className="animate-spin mr-2">⏳</span>
                                    Enregistrement...
                                </>
                            ) : (
                                'Continuer'
                            )}
                        </Button>
                        
                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            Vous pourrez modifier votre rôle plus tard dans les paramètres
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
