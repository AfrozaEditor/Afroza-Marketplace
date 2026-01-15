import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { 
    ChevronLeft, 
    ChevronRight, 
    Search, 
    SlidersHorizontal, 
    Grid3X3, 
    List, 
    Sparkles,
    TrendingUp,
    Package,
    Filter,
    X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Category, Product } from '@/types';
import ListProduct from '@/components/product/list-product';
import { Head, router } from '@inertiajs/react';
import { FilterSidebar } from '@/components/filter/filter-sidebar';
import { cn } from '@/lib/utils';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

interface Props {
    // products: Product[];
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    categories: Category[];
    filters?: {
        category?: string;
        search?: string;
        min_price?: string;
        max_price?: string;
        sort?: string;
    };
}

function Index({products, categories, filters}: Props) {
    const defaultCategory = { id: 0, name: 'Tous', slug: 'tous' } as Category;
    const maxPrice = 60000; // Prix maximum en FCFA
    
    // Fonction pour trouver une catégorie par ID (y compris dans les enfants)
    const findCategoryById = (id: number): Category | undefined => {
        for (const cat of categories) {
            if (cat.id === id) return cat;
            if (cat.children) {
                const child = cat.children.find(c => c.id === id);
                if (child) return child;
            }
        }
        return undefined;
    };
    
    // Initialiser les états avec les valeurs des filtres
    const [selectedCategory, setSelectedCategory] = useState<Category>(
        filters?.category && categories
            ? findCategoryById(parseInt(filters.category || '0')) || defaultCategory
            : defaultCategory
    );
    const [priceRange, setPriceRange] = useState<number[]>([
        filters?.min_price ? parseInt(filters.min_price) : 0,
        filters?.max_price ? parseInt(filters.max_price) : 2000000
    ]);
    const [sortBy, setSortBy] = useState(filters?.sort || 'newest');
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');

    console.log(selectedCategory);

    const resetFilters = () => {
        // Définir les valeurs par défaut
    // const params = new URLSearchParams();
    // params.set('sort', 'newest');
    // // Obligatoire d'ajouter category=0 pour forcer la réinitialisation
    // params.set('category', '0');
    // params.set('min_price', '0');
    // params.set('max_price', '60000');


    // setSelectedCategory(defaultCategory);
    // setPriceRange([0, 60000]);
    // setSearchTerm('');
    // setSortBy('newest');

    // Utiliser router.get avec des paramètres vides
    router.get('/products', {
        // category: '0',
        sort: 'newest',
        min_price: '0',
        max_price: '2000000'
    }, {
        preserveState: false,
        preserveScroll: false,
        replace: true // Ajouter replace pour s'assurer que l'historique est mis à jour
    });
};

    // Filter and sort products
    // const filteredProducts = filterProducts(products.data, {
    //     searchTerm,
    //     priceRange,
    //     selectedCategory,
    //     selectedBrands: [],
    //     selectedSizes: [],
    //     selectedConditions: []
    // });
    // // Appliquer le tri
    // const sortedProducts = [...filteredProducts].sort((a, b) => {
    //     switch (sortBy) {
    //         case 'price-asc':
    //             return a.price - b.price;
    //         case 'price-desc':
    //             return b.price - a.price;
    //         case 'newest':
    //             return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    //         default:
    //             return 0;
    //     }
    // });

    useEffect(() => {
    // Mettre à jour l'URL avec les paramètres de filtrage
    const params = new URLSearchParams(window.location.search);
    if (selectedCategory) {
        params.set('category', selectedCategory.id.toString());
    }
    if (searchTerm) {
        params.set('search', searchTerm);
    }
    params.set('min_price', priceRange[0].toString());
    params.set('max_price', priceRange[1].toString());
    params.set('sort', sortBy);

    router.get(`/products?${params.toString()}`, {}, {
        preserveState: true,
        preserveScroll: true
    });
}, [selectedCategory, searchTerm, priceRange, sortBy]);

const handlePageChange = (url: string) => {
    if (url) {
        const urlParams = new URLSearchParams(new URL(url).search);

        // Ajouter les filtres actuels
        if (selectedCategory) {
            urlParams.set('category', selectedCategory.id.toString());
        }
        if (searchTerm) {
            urlParams.set('search', searchTerm);
        }
        urlParams.set('min_price', priceRange[0].toString());
        urlParams.set('max_price', priceRange[1].toString());
        urlParams.set('sort', sortBy);

        router.get(`/products?${urlParams.toString()}`, {}, {
            preserveState: true,
            preserveScroll: true
        });
    }
};



    console.log(products);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    
    // Statistiques rapides
    const stats = [
        { icon: Package, label: 'Produits', value: products.total.toLocaleString() },
        { icon: TrendingUp, label: 'Nouveautés', value: '24h' },
        { icon: Sparkles, label: 'En promo', value: '15%' },
    ];

    return (
        <AppLayout>
            <Head title="Produits - Afroza Marketplace" />
            
            {/* Hero Section */}
            <div className="relative bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
                {/* Éléments décoratifs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
                
                <div className="relative container mx-auto px-4 py-12">
                    <div className="max-w-2xl">
                        <Badge className="mb-4 bg-primary/20 text-primary border border-primary/30">
                            <Sparkles className="w-3 h-3 mr-1" />
                            {products.total} articles disponibles
                        </Badge>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                            Découvrez nos articles
                        </h1>
                        <p className="text-gray-300 text-lg mb-6">
                            Mode, électronique, maison et plus encore. Trouvez la perle rare parmi notre sélection.
                        </p>
                        
                        {/* Barre de recherche principale */}
                        <div className="flex gap-2">
                            <div className="relative grow">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    type="text"
                                    placeholder="Rechercher des articles..."
                                    className="pl-12 h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button className="h-12 px-6 bg-primary hover:bg-primary/90">
                                Rechercher
                            </Button>
                        </div>
                    </div>
                    
                    {/* Stats rapides */}
                    <div className="flex gap-6 mt-8 pt-6 border-t border-white/10">
                        {stats.map((stat, index) => (
                            <div key={index} className="flex items-center gap-2 text-white/80">
                                <stat.icon className="h-4 w-4 text-primary" />
                                <span className="text-sm">{stat.label}:</span>
                                <span className="font-semibold text-white">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="container mx-auto px-4 py-6">
                    {/* Barre d'outils */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            {/* Catégories rapides */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                                <Badge 
                                    variant={selectedCategory.id === 0 ? "default" : "outline"}
                                    className="cursor-pointer whitespace-nowrap"
                                    onClick={() => setSelectedCategory(defaultCategory)}
                                >
                                    Tous
                                </Badge>
                                {categories.slice(0, 5).map((cat) => (
                                    <Badge 
                                        key={cat.id}
                                        variant={selectedCategory.id === cat.id ? "default" : "outline"}
                                        className="cursor-pointer whitespace-nowrap"
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        {cat.name}
                                    </Badge>
                                ))}
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                {/* Tri */}
                                <select
                                    className="h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="newest">Plus récents</option>
                                    <option value="price-asc">Prix croissant</option>
                                    <option value="price-desc">Prix décroissant</option>
                                    <option value="popular">Popularité</option>
                                </select>
                                
                                {/* Vue grille/liste */}
                                <div className="hidden md:flex items-center border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={cn(
                                            "p-1.5 rounded",
                                            viewMode === 'grid' ? "bg-primary text-white" : "text-gray-500 hover:text-gray-700"
                                        )}
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={cn(
                                            "p-1.5 rounded",
                                            viewMode === 'list' ? "bg-primary text-white" : "text-gray-500 hover:text-gray-700"
                                        )}
                                    >
                                        <List className="h-4 w-4" />
                                    </button>
                                </div>
                                
                                {/* Filtres mobile */}
                                <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="sm" className="md:hidden">
                                            <Filter className="h-4 w-4 mr-2" />
                                            Filtres
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-80">
                                        <SheetHeader>
                                            <SheetTitle>Filtres</SheetTitle>
                                        </SheetHeader>
                                        <div className="mt-4">
                                            <FilterSidebar
                                                selectedCategory={selectedCategory}
                                                setSelectedCategory={setSelectedCategory}
                                                priceRange={priceRange}
                                                setPriceRange={setPriceRange}
                                                maxPrice={maxPrice}
                                                resetFilters={resetFilters}
                                                categories={categories}
                                            />
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col md:flex-row gap-6'>
                        {/* Sidebar Desktop */}
                        <div className="hidden md:block w-64 shrink-0">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sticky top-24">
                                <FilterSidebar
                                    selectedCategory={selectedCategory}
                                    setSelectedCategory={setSelectedCategory}
                                    priceRange={priceRange}
                                    setPriceRange={setPriceRange}
                                    maxPrice={maxPrice}
                                    resetFilters={resetFilters}
                                    categories={categories}
                                />
                            </div>
                        </div>
                        
                        {/* Liste des produits */}
                        <div className="flex-1">
                            {/* Résultats header */}
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold dark:text-white">
                                        {selectedCategory.id !== 0 ? selectedCategory.name : 'Tous les produits'}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {products.total} résultat{products.total > 1 ? 's' : ''}
                                    </p>
                                </div>
                                
                                {/* Filtres actifs */}
                                {(selectedCategory.id !== 0 || searchTerm || priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                                    <Button variant="ghost" size="sm" onClick={resetFilters} className="text-primary">
                                        <X className="h-4 w-4 mr-1" />
                                        Réinitialiser
                                    </Button>
                                )}
                            </div>

                            {products.data.length === 0 ? (
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
                                    <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        Aucun produit trouvé
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Essayez de modifier vos critères de recherche
                                    </p>
                                    <Button onClick={resetFilters}>
                                        Voir tous les produits
                                    </Button>
                                </div>
                            ) : (
                                <ListProduct products={products.data} viewMode={viewMode} />
                            )}

                            {/* Pagination améliorée */}
                            {products.last_page > 1 && (
                                <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-4">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Affichage de {(products.current_page - 1) * products.per_page + 1} à{' '}
                                            {Math.min(products.current_page * products.per_page, products.total)} sur{' '}
                                            <span className="font-medium">{products.total}</span> produits
                                        </p>
                                        
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={products.current_page === 1}
                                                onClick={() => {
                                                    const prevLink = products.links.find(l => l.label.includes('Previous'));
                                                    if (prevLink?.url) handlePageChange(prevLink.url);
                                                }}
                                            >
                                                <ChevronLeft className="h-4 w-4 mr-1" />
                                                Précédent
                                            </Button>
                                            
                                            <div className="hidden sm:flex gap-1">
                                                {products.links
                                                    .filter(link => !link.label.includes('Previous') && !link.label.includes('Next'))
                                                    .slice(0, 5)
                                                    .map((link, i) => (
                                                        <Button
                                                            key={i}
                                                            variant={link.active ? "default" : "outline"}
                                                            size="sm"
                                                            disabled={!link.url}
                                                            onClick={() => link.url && handlePageChange(link.url)}
                                                            className="min-w-10"
                                                        >
                                                            {link.label}
                                                        </Button>
                                                    ))}
                                            </div>
                                            
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={products.current_page === products.last_page}
                                                onClick={() => {
                                                    const nextLink = products.links.find(l => l.label.includes('Next'));
                                                    if (nextLink?.url) handlePageChange(nextLink.url);
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
                </div>
            </div>
        </AppLayout>
    );
}

export default Index;
