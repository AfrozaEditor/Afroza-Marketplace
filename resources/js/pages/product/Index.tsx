import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Category, Product } from '@/types';
import ListProduct from '@/components/product/list-product';
import { router } from '@inertiajs/react';
import { FilterSidebar } from '@/components/filter/filter-sidebar';

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
    // const [selectedCategory, setSelectedCategory] = useState<Category>(defaultCategory);
    // const [priceRange, setPriceRange] = useState<number[]>([0, 60000]);
    // const [sortBy, setSortBy] = useState('newest');
    // const [searchTerm, setSearchTerm] = useState('');
    const maxPrice = 60000; // Prix maximum en FCFA
        // Initialiser les états avec les valeurs des filtres
    const [selectedCategory, setSelectedCategory] = useState<Category>(
        filters?.category && categories
            ? categories.find(c => c.id === parseInt(filters.category)) || defaultCategory
            : defaultCategory
    );
    const [priceRange, setPriceRange] = useState<number[]>([
        filters?.min_price ? parseInt(filters.min_price) : 0,
        filters?.max_price ? parseInt(filters.max_price) : 60000
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
        max_price: '60000'
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
    return (
        <AppLayout>
            {/* Page header */}
            <div className="bg-gray-50 py-8">
                <div
                    className="container mx-auto px-4"
                >
                    <h1 className="text-3xl font-bold mb-2">Articles Disponibles</h1>
                    <p className="text-gray-600">Découvrez notre collection d'articles de mode de seconde main.</p>

                    <div className="mt-8 bg-white rounded-lg shadow-sm p-4">
                        <div className="flex flex-wrap gap-4 items-center justify-between">
                            <div className="relative flex-grow max-w-md">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Rechercher des articles..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <select
                                    className="border rounded p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="newest">Plus récents</option>
                                    <option value="price-asc">Prix croissant</option>
                                    <option value="price-desc">Prix décroissant</option>
                                    <option value="popular">Popularité</option>
                                </select>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    // onClick={() => setShowFilters(!showFilters)}
                                    className="md:hidden"
                                >
                                    <SlidersHorizontal size={18} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 py-8">
                <div className='flex flex-col md:flex-row gap-8'>
                    {/* Sidebar */}
                <div className="w-full md:w-64 md:shrink-0">
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
                <div className="w-full">
                    <div className="mb-6 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Produits ({products.data.length})</h2>
                        <div className="text-sm text-gray-500">
                            {products.data.length} résultats
                        </div>
                    </div>
                    <ListProduct products={products.data} />
                </div>
                </div>

                {/* <ListProduct products={products.data} /> */}
                {/* Pagination */}
                <div className="mt-8 flex justify-center gap-2">
                    {products.links.map((link, i) => (
                        <Button
                            key={i}
                            variant={link.active ? "default" : "outline"}
                            disabled={!link.url}
                            onClick={() => {
                                if (link.url) {
                                    // router.get(link.url);
                                    handlePageChange(link.url);
                                }
                            }}
                        >
                            {link.label === "&laquo; Previous" ? (
                                <ChevronLeft className="h-4 w-4" />
                            ) : link.label === "Next &raquo;" ? (
                                <ChevronRight className="h-4 w-4" />
                            ) : (
                                link.label
                            )}
                        </Button>
                    ))}
                </div>

                <div className="mt-4 text-center text-sm text-muted-foreground">
                    Affichage de {(products.current_page - 1) * products.per_page + 1} à{" "}
                    {Math.min(products.current_page * products.per_page, products.total)} sur{" "}
                    {products.total} produits
                </div>
            </div>

        </AppLayout>
    );
}

export default Index;
