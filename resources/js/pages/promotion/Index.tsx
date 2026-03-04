import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { addDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { formatDate, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    ArrowRight, 
    Clock, 
    Percent, 
    Tag, 
    Search, 
    Sparkles, 
    Gift, 
    Zap, 
    Star, 
    Copy, 
    Check,
    Calendar,
    Users,
    TrendingUp,
    Timer
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import NewsLetter from '@/components/home/news-letter';
import { toast } from 'sonner';

const today = new Date();

const promotions = [
    {
        id: 1,
        title: 'Soldes d\'été',
        discount: '30%',
        description: 'Profitez de 30% de réduction sur tous les articles d\'été.',
        endDate: addDays(today, 7),
        category: 'seasonal',
        image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db',
        code: 'ETE30',
        featured: true
    },
    {
        id: 2,
        title: 'Offre flash du weekend',
        discount: '25%',
        description: 'Offre limitée de 48h sur une sélection d\'articles.',
        endDate: addDays(today, 2),
        category: 'flash',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da',
        code: 'FLASH25',
        featured: false
    },
    {
        id: 3,
        title: 'Première commande',
        discount: '15%',
        description: 'Réduction pour votre première commande sur notre site.',
        endDate: addDays(today, 30),
        category: 'new',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d',
        code: 'BIENVENUE15',
        featured: false
    },
    {
        id: 4,
        title: 'Offre de parrainage',
        discount: '10€',
        description: 'Parrainez un ami et recevez 10€ de réduction sur votre prochaine commande.',
        endDate: addDays(today, 60),
        category: 'referral',
        image: 'https://images.unsplash.com/photo-1565462905102-140e712045aa',
        code: 'PARRAIN10',
        featured: false
    },
    {
        id: 5,
        title: 'Vente privée',
        discount: '40%',
        description: 'Accès exclusif à notre vente privée avec jusqu\'à 40% de réduction.',
        endDate: addDays(today, 5),
        category: 'exclusive',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
        code: 'PRIVE40',
        featured: false
    },
    {
        id: 6,
        title: 'Offre de fidélité',
        discount: '20%',
        description: 'Merci pour votre fidélité ! Profitez de 20% sur votre prochaine commande.',
        endDate: addDays(today, 14),
        category: 'loyalty',
        image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df',
        code: 'FIDELE20',
        featured: false
    }
];

const categoryLabels: Record<string, string> = {
    all: 'Toutes les offres',
    flash: 'Offres flash',
    seasonal: 'Saisonnières',
    exclusive: 'Exclusives',
    new: 'Nouveaux clients',
    referral: 'Parrainage',
    loyalty: 'Fidélité'
};

const categoryIcons: Record<string, React.ElementType> = {
    flash: Zap,
    seasonal: Calendar,
    exclusive: Star,
    new: Gift,
    referral: Users,
    loyalty: TrendingUp
};

function Index() {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const filterPromotions = (category: string) => {
        let filtered = promotions;
        
        if (category !== 'all') {
            filtered = filtered.filter(promo => promo.category === category);
        }
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(promo => 
                promo.title.toLowerCase().includes(query) ||
                promo.description.toLowerCase().includes(query) ||
                promo.code.toLowerCase().includes(query)
            );
        }
        
        return filtered;
    };

    const calculateDaysLeft = (endDate: Date) => {
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const copyCode = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);
            toast.success('Code copié !', { description: `Le code ${code} a été copié dans le presse-papiers.` });
            setTimeout(() => setCopiedCode(null), 2000);
        } catch (err) {
            toast.error('Erreur lors de la copie');
        }
    };

    const featuredPromotion = promotions.find(p => p.featured) || promotions[0];
    const filteredPromotions = filterPromotions(activeTab);

    return (
        <AppLayout>
            <Head title="Promotions - Afroza Marketplace"/>
            
            {/* Hero Section Modernisé */}
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
                {/* Éléments décoratifs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-orange-500/15 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
                
                <div className="relative container mx-auto px-4 py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <Badge className="mb-4 bg-primary/20 text-primary border border-primary/30">
                            <Percent className="w-3 h-3 mr-1" />
                            {promotions.length} offres actives
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Nos <span className="text-primary">Promotions</span>
                        </h1>
                        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                            Découvrez nos meilleures offres et économisez sur vos achats. 
                            Des réductions exclusives, des ventes flash et bien plus encore.
                        </p>
                        
                        {/* Barre de recherche */}
                        <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                            <div className="relative grow">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    type="text"
                                    placeholder="Rechercher une offre ou un code..."
                                    className="pl-12 h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        {/* Stats rapides */}
                        <div className="flex justify-center gap-8 mt-10 pt-8 border-t border-white/10">
                            {[
                                { icon: Percent, value: promotions.length, label: 'Offres' },
                                { icon: Zap, value: promotions.filter(p => p.category === 'flash').length, label: 'Ventes flash' },
                                { icon: Gift, value: '40%', label: 'Jusqu\'à' },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="flex items-center justify-center gap-2 text-2xl font-bold text-white">
                                        <stat.icon className="h-5 w-5 text-primary" />
                                        {stat.value}
                                    </div>
                                    <p className="text-sm text-gray-400">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Offre à la une */}
            {featuredPromotion && (
                <section className="bg-white dark:bg-gray-900 py-12">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <h2 className="text-2xl font-bold dark:text-white">Offre à la une</h2>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8 items-center bg-gradient-to-r from-primary to-primary/80 rounded-2xl overflow-hidden">
                            <div className="p-8 md:p-12 text-white order-2 md:order-1">
                                <Badge className="mb-4 bg-white/20 text-white border-0">
                                    <Timer className="w-3 h-3 mr-1" />
                                    {calculateDaysLeft(featuredPromotion.endDate)} jours restants
                                </Badge>
                                <h3 className="text-3xl md:text-4xl font-bold mb-4">{featuredPromotion.title}</h3>
                                <p className="text-lg mb-6 text-white/90">{featuredPromotion.description}</p>
                                <p className="text-sm text-white/70 mb-6">
                                    Offre valable jusqu'au {formatDate(featuredPromotion.endDate)}
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button className="bg-white text-primary hover:bg-gray-100" asChild>
                                        <Link href="/products">
                                            En profiter maintenant
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                                        <span className="font-mono font-bold text-lg mr-3">{featuredPromotion.code}</span>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-white hover:bg-white/20"
                                            onClick={() => copyCode(featuredPromotion.code)}
                                        >
                                            {copiedCode === featuredPromotion.code ? (
                                                <Check className="h-4 w-4" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-64 md:h-96 order-1 md:order-2">
                                <img
                                    src={featuredPromotion.image}
                                    alt={featuredPromotion.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary/50" />
                                <div className="absolute top-4 right-4">
                                    <Badge className="bg-white text-primary text-xl font-bold px-4 py-2">
                                        -{featuredPromotion.discount}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Liste des promotions */}
            <section className="py-12 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                            <h2 className="text-xl font-bold dark:text-white">Toutes les offres</h2>
                            <TabsList className="bg-white dark:bg-gray-800 flex-wrap h-auto gap-1 p-1">
                                {Object.entries(categoryLabels).slice(0, 5).map(([key, label]) => (
                                    <TabsTrigger key={key} value={key} className="text-sm">
                                        {label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>
                        
                        <TabsContent value={activeTab} className="mt-0">
                            {filteredPromotions.length === 0 ? (
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
                                    <Percent className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        Aucune offre trouvée
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Essayez une autre catégorie ou terme de recherche
                                    </p>
                                    <Button variant="outline" onClick={() => {
                                        setSearchQuery('');
                                        setActiveTab('all');
                                    }}>
                                        Voir toutes les offres
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredPromotions.map((promo) => {
                                        const IconComponent = categoryIcons[promo.category] || Tag;
                                        const daysLeft = calculateDaysLeft(promo.endDate);
                                        
                                        return (
                                            <Card 
                                                key={promo.id} 
                                                className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800"
                                            >
                                                <div className="relative h-48 overflow-hidden">
                                                    <img
                                                        src={promo.image}
                                                        alt={promo.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                                    
                                                    {/* Badge discount */}
                                                    <Badge className="absolute top-3 right-3 bg-primary text-white text-lg font-bold px-3 py-1">
                                                        -{promo.discount}
                                                    </Badge>
                                                    
                                                    {/* Badge catégorie */}
                                                    <div className="absolute top-3 left-3">
                                                        <Badge className="bg-black/50 backdrop-blur-sm text-white border-0">
                                                            <IconComponent className="w-3 h-3 mr-1" />
                                                            {categoryLabels[promo.category]}
                                                        </Badge>
                                                    </div>
                                                    
                                                    {/* Jours restants */}
                                                    <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {daysLeft} jour{daysLeft > 1 ? 's' : ''} restant{daysLeft > 1 ? 's' : ''}
                                                    </div>
                                                </div>
                                                
                                                <CardContent className="p-5">
                                                    <h3 className="font-bold text-lg mb-2 dark:text-white group-hover:text-primary transition-colors">
                                                        {promo.title}
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                                        {promo.description}
                                                    </p>
                                                    
                                                    {/* Code promo */}
                                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <Tag className="h-4 w-4 text-primary" />
                                                            <span className="font-mono font-bold text-primary">{promo.code}</span>
                                                        </div>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm"
                                                            onClick={() => copyCode(promo.code)}
                                                            className="hover:bg-primary/10"
                                                        >
                                                            {copiedCode === promo.code ? (
                                                                <Check className="h-4 w-4 text-green-500" />
                                                            ) : (
                                                                <Copy className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                                
                                                <CardFooter className="px-5 pb-5 pt-0">
                                                    <Button className="w-full group/btn" asChild>
                                                        <Link href="/products">
                                                            Utiliser cette offre
                                                            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                                        </Link>
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* Comment utiliser les codes */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <Badge className="mb-4 bg-primary/10 text-primary border-0">
                            Guide
                        </Badge>
                        <h2 className="text-3xl font-bold mb-4 dark:text-white">Comment utiliser nos codes promo</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Suivez ces étapes simples pour profiter de nos offres promotionnelles lors de vos achats.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Percent,
                                title: '1. Choisissez une offre',
                                description: 'Parcourez nos promotions et sélectionnez celle qui correspond à vos besoins.'
                            },
                            {
                                icon: Copy,
                                title: '2. Copiez le code',
                                description: 'Cliquez sur le bouton copier pour enregistrer le code dans votre presse-papiers.'
                            },
                            {
                                icon: Check,
                                title: '3. Appliquez le code',
                                description: 'Collez le code dans le champ prévu lors du paiement pour bénéficier de la réduction.'
                            }
                        ].map((step, index) => (
                            <Card key={index} className="text-center border-0 shadow-lg dark:bg-gray-700">
                                <CardContent className="pt-8 pb-6">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <step.icon className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 dark:text-white">{step.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <NewsLetter />
        </AppLayout>
    );
}

export default Index;
