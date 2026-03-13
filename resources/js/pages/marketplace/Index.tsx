import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { HeroSection } from '@/components/hero-section';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Category, Shop } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
    ChevronLeft, 
    ChevronRight, 
    ShoppingCart, 
    Star, 
    Users, 
    Store, 
    Sparkles,
    Search,
    MapPin,
    TrendingUp,
    Award,
    Heart,
    ExternalLink,
    Filter,
    Grid3X3,
    LayoutList
} from 'lucide-react';
import { MarketplaceFilters } from '@/components/filter/marketplace-filter';
import Faq from '@/components/faq';
import { useDebouncedCallback } from 'use-debounce';
import { cn } from '@/lib/utils';

interface PaginatedShops {
    data: Shop[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    shops: PaginatedShops;
    categories: Category[];
    cities: string[];
    filters: {
        search: string;
        min_rating: number;
        min_products: number;
        max_products: number;
        city: string;
        sort: string;
    };
}


function Index({ shops, categories, cities = [], filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [priceRange, setPriceRange] = useState<number[]>([0, 400000]);
    const [ratingFilter, setRatingFilter] = useState(filters.min_rating || 0);
    const [productsRange, setProductsRange] = useState<number[]>([
        filters.min_products || 0,
        filters.max_products || 200
    ]);
    const [featuredOnly, setFeaturedOnly] = useState(false);
    const [selectedCity, setSelectedCity] = useState(filters.city || '');
    const [sortBy, setSortBy] = useState(filters.sort || 'rating');
    const [isInitialized, setIsInitialized] = useState(false);

    // Format price in FCFA
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR').format(price);
    };

    // Apply filters function
    const applyFilters = (overrides: Record<string, any> = {}) => {
        const params: Record<string, any> = {
            search: searchTerm,
            min_rating: ratingFilter,
            min_products: productsRange[0],
            max_products: productsRange[1],
            city: selectedCity,
            sort: sortBy,
            ...overrides
        };

        // Clean up empty/default values
        Object.keys(params).forEach(key => {
            if (params[key] === '' || params[key] === null || params[key] === undefined) {
                delete params[key];
            }
        });
        
        // Remove default values
        if (params.min_rating === 0) delete params.min_rating;
        if (params.min_products === 0) delete params.min_products;
        if (params.max_products === 200) delete params.max_products;
        if (params.sort === 'rating') delete params.sort;

        router.get('/marketplace', params, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    // Debounced search
    const debouncedSearch = useDebouncedCallback((value: string) => {
        applyFilters({ search: value });
    }, 500);

    // Reset all filters
    const resetFilters = () => {
        setSearchTerm('');
        setPriceRange([0, 400000]);
        setRatingFilter(0);
        setProductsRange([0, 200]);
        setFeaturedOnly(false);
        setSelectedCity('');
        setSortBy('rating');
        router.get('/marketplace', {}, {
            preserveState: false,
            preserveScroll: false,
            replace: true
        });
    };

    // Count active filters
    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.search) count++;
        if (filters.min_rating > 0) count++;
        if (filters.min_products > 0 || filters.max_products < 200) count++;
        if (filters.city) count++;
        if (filters.sort && filters.sort !== 'rating') count++;
        return count;
    };

    // Initialize once
    useEffect(() => {
        setIsInitialized(true);
    }, []);

    // Handle search changes
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        debouncedSearch(value);
    };

    // Handle immediate filter changes (rating, sort, city)
    const handleRatingChange = (value: number) => {
        setRatingFilter(value);
        applyFilters({ min_rating: value });
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        applyFilters({ sort: value });
    };

    const handleCityChange = (value: string) => {
        setSelectedCity(value);
        applyFilters({ city: value });
    };

    // Handle products range with debounce
    const handleProductsRangeChange = (value: number[]) => {
        setProductsRange(value);
    };

    // Debounced products range
    const debouncedProductsRange = useDebouncedCallback((value: number[]) => {
        applyFilters({ min_products: value[0], max_products: value[1] });
    }, 500);

    useEffect(() => {
        if (isInitialized) {
            debouncedProductsRange(productsRange);
        }
    }, [productsRange, isInitialized]);

    // Pagination handler
    const goToPage = (url: string | null) => {
        if (url) {
            router.get(url, {}, { preserveState: true, preserveScroll: true });
        }
    };




    return (
        <AppLayout>
            <Head title="Marketplace - Afroza Marketplace"/>
            
            {/* Hero Section Modernisé */}
            <div className="relative bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
                {/* Éléments décoratifs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                
                <div className="relative container mx-auto px-4 py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <Badge className="mb-4 bg-primary/20 text-primary border border-primary/30">
                            <Store className="w-3 h-3 mr-1" />
                            {shops.total} boutiques actives
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Explorez notre <span className="text-primary">Marketplace</span>
                        </h1>
                        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                            Découvrez des boutiques uniques et connectez-vous avec des vendeurs passionnés. 
                            Trouvez des trésors et soutenez le commerce local.
                        </p>
                        
                        {/* Barre de recherche */}
                        <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                            <div className="relative grow">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    type="text"
                                    placeholder="Rechercher une boutique..."
                                    className="pl-12 h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400"
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                            </div>
                            <Button className="h-12 px-6 bg-primary hover:bg-primary/90">
                                <Search className="h-4 w-4 mr-2" />
                                Rechercher
                            </Button>
                        </div>
                        
                        {/* Stats rapides */}
                        <div className="flex justify-center gap-8 mt-10 pt-8 border-t border-white/10">
                            {[
                                { icon: Store, value: shops.total, label: 'Boutiques' },
                                { icon: Star, value: '4.8', label: 'Note moyenne' },
                                { icon: Users, value: '10K+', label: 'Acheteurs' },
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

            <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="container p-4 mx-auto py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filtres */}
                        <div className="w-full lg:w-80 lg:shrink-0">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sticky top-24">
                                <MarketplaceFilters
                                    searchTerm={searchTerm}
                                    setSearchTerm={handleSearchChange}
                                    priceRange={priceRange}
                                    setPriceRange={setPriceRange}
                                    ratingFilter={ratingFilter}
                                    setRatingFilter={handleRatingChange}
                                    productsRange={productsRange}
                                    setProductsRange={handleProductsRangeChange}
                                    featuredOnly={featuredOnly}
                                    setFeaturedOnly={setFeaturedOnly}
                                    sortBy={sortBy}
                                    setSortBy={handleSortChange}
                                    resetFilters={resetFilters}
                                    activeFiltersCount={getActiveFiltersCount()}
                                    categories={categories}
                                    cities={cities}
                                    selectedCity={selectedCity}
                                    setSelectedCity={handleCityChange}
                                />
                            </div>
                        </div>
                        
                        {/* Liste des boutiques */}
                        <div className="flex-1" id='boutiques'>
                            {/* Header des résultats */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold dark:text-white">
                                            Boutiques
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            {shops.from && shops.to ? (
                                                <span>{shops.from}-{shops.to} sur {shops.total} résultats</span>
                                            ) : (
                                                <span>{shops.total} résultats</span>
                                            )}
                                        </p>
                                    </div>
                                    
                                    {/* Tri et vue */}
                                    <div className="flex items-center gap-3">
                                        <select
                                            className="h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                                            value={sortBy}
                                            onChange={(e) => handleSortChange(e.target.value)}
                                        >
                                            <option value="rating">Mieux notées</option>
                                            <option value="products">Plus de produits</option>
                                            <option value="followers">Plus populaires</option>
                                            <option value="newest">Plus récentes</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {shops.data.length === 0 ? (
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
                                    <Store className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        Aucune boutique trouvée
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Essayez de modifier vos critères de recherche
                                    </p>
                                    <Button variant="outline" onClick={resetFilters}>
                                        Réinitialiser les filtres
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {shops.data.map(shop => {
                                        const avgRating = shop.reviews.length > 0 
                                            ? (shop.reviews.reduce((acc, review) => acc + review.rating, 0) / shop.reviews.length).toFixed(1)
                                            : null;
                                        
                                        return (
                                            <Card key={shop.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800">
                                                {/* Image de couverture */}
                                                <div className="relative h-44 overflow-hidden">
                                                    <img
                                                        src={shop.cover_image || 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=800'}
                                                        alt={shop.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                                                    
                                                    {/* Badge note */}
                                                    {avgRating && (
                                                        <div className="absolute top-3 right-3 bg-secondary backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-lg">
                                                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                                            <span className="text-sm font-semibold">{avgRating}</span>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Bouton favori */}
                                                    <button className="absolute top-3 left-3 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors opacity-0 group-hover:opacity-100">
                                                        <Heart className="h-4 w-4" />
                                                    </button>
                                                    
                                                    {/* Nom de la boutique en overlay */}
                                                    <div className="absolute bottom-3 left-3 right-3">
                                                        <h3 className="text-lg font-bold text-white truncate">{shop.name}</h3>
                                                        {(shop as Shop).city && (
                                                            <p className="text-sm text-white/80 flex items-center gap-1">
                                                                <MapPin className="h-3 w-3" />
                                                                {(shop as Shop).city}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <CardContent className="p-4">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                                                        {shop.description || 'Découvrez notre sélection de produits uniques.'}
                                                    </p>
                                                    
                                                    {/* Stats */}
                                                    <div className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center gap-4">
                                                            <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                                                <ShoppingCart className="h-4 w-4 text-primary" />
                                                                <span className="font-medium">{shop.products?.length || 0}</span>
                                                                <span className="hidden sm:inline">produits</span>
                                                            </span>
                                                            <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                                                <Users className="h-4 w-4 text-primary" />
                                                                <span className="font-medium">{shop.followers?.length || 0}</span>
                                                                <span className="hidden sm:inline">abonnés</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                                
                                                <CardFooter className="p-4 pt-0">
                                                    <Link href={route('marketplace.show', shop.slug)} className="w-full">
                                                        <Button className="w-full bg-primary hover:bg-primary/90 group-hover:shadow-lg transition-all">
                                                            Visiter la boutique
                                                            <ExternalLink className="h-4 w-4 ml-2" />
                                                        </Button>
                                                    </Link>
                                                </CardFooter>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Pagination */}
                            {shops.last_page > 1 && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mt-8">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <p className="text-sm text-gray-500">
                                            Page {shops.current_page} sur {shops.last_page} ({shops.total} boutiques)
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={shops.current_page === 1}
                                                onClick={() => {
                                                    const prevLink = shops.links.find(l => l.label.includes('Previous') || l.label.includes('Précédent'));
                                                    goToPage(prevLink?.url || null);
                                                }}
                                            >
                                                <ChevronLeft className="h-4 w-4 mr-1" />
                                                Précédent
                                            </Button>
                                            
                                            <div className="hidden sm:flex gap-1">
                                                {shops.links
                                                    .filter(link => !link.label.includes('Previous') && !link.label.includes('Next') && !link.label.includes('&'))
                                                    .slice(0, 5)
                                                    .map((link, index) => (
                                                    <Button
                                                        key={index}
                                                        variant={link.active ? 'default' : 'outline'}
                                                        size="sm"
                                                        disabled={!link.url}
                                                        onClick={() => goToPage(link.url)}
                                                        className="min-w-10"
                                                    >
                                                        {link.label}
                                                    </Button>
                                                ))}
                                            </div>
                                            
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={shops.current_page === shops.last_page}
                                                onClick={() => {
                                                    const nextLink = shops.links.find(l => l.label.includes('Next') || l.label.includes('Suivant'));
                                                    goToPage(nextLink?.url || null);
                                                }}
                                            >
                                                Suivant
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CTA Vendeur */}
                    <div className="mt-16 relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary/90 to-purple-600">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
                        
                        <div className="relative p-8 md:p-12">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-1 text-white">
                                    <Badge className="mb-4 bg-white/20 text-white border-white/30">
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        Rejoignez-nous
                                    </Badge>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                        Lancez votre boutique aujourd'hui
                                    </h2>
                                    <p className="text-white/80 mb-6 text-lg">
                                        Rejoignez des centaines de vendeurs et donnez une seconde vie à vos articles. 
                                        C'est simple, rapide et écologique.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <Link href={route('marketplace.create')}>
                                            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                                                <Store className="h-5 w-5 mr-2" />
                                                Ouvrir ma boutique
                                            </Button>
                                        </Link>
                                        <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                            En savoir plus
                                        </Button>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3">
                                    <img
                                        src="https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=600"
                                        alt="Devenir vendeur"
                                        className="rounded-xl shadow-2xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* FAQ Section */}
                    <div className="mt-16">
                        <Faq/>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default Index;
