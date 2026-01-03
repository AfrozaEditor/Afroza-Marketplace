import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { HeroSection } from '@/components/hero-section';
import { Button } from '@/components/ui/button';
import { Category, Shop } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, ShoppingCart, Star, Users } from 'lucide-react';
import { MarketplaceFilters } from '@/components/filter/marketplace-filter';
import Faq from '@/components/faq';
import { useDebouncedCallback } from 'use-debounce';

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
            <Head title="Marketplace"/>
            <HeroSection
                className="bg-gradient-to-l from-primary to-chart-3 text-white max-h-3xl"
                title="Marketplace"
                description="Découvrez les meilleures boutiques de seconde main et connectez-vous directement avec les vendeurs."
                buttons={{
                    primary: {
                        text: "Commencer à acheter",
                        href: "/products",
                    },
                    secondary: {
                        text: "Découvrir les boutiques",
                        href: "#boutiques",
                    },
                }}
            />
            <div className="container p-4 mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-80 lg:shrink-0">
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
                <div className="w-full" id='boutiques'>
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Boutiques ({shops.total})</h2>
                    <div className="text-sm text-gray-500">
                        {shops.from && shops.to ? (
                            <span>Affichage {shops.from}-{shops.to} sur {shops.total} résultats</span>
                        ) : (
                            <span>{shops.total} résultats</span>
                        )}
                    </div>
                </div>

                {shops.data.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Aucune boutique trouvée avec ces critères.</p>
                        <Button variant="outline" className="mt-4" onClick={resetFilters}>
                            Réinitialiser les filtres
                        </Button>
                    </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {shops.data.map(shop => (
                        <Card key={shop.id} className="overflow-hidden hover:shadow-lg transition-all">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={shop.cover_image}
                                    alt={shop.name}
                                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                                />
                                {/*{shop.featured && (*/}
                                {/*    <Badge className="absolute top-2 right-2 bg-videdressing-accent">*/}
                                {/*        En vedette*/}
                                {/*    </Badge>*/}
                                {/*)}*/}
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle>{shop.name}</CardTitle>
                                {shop.reviews.length > 0 && (
                                    <div className="flex items-center gap-1 text-amber-500">
                                        
                                        <Star size={16} fill="currentColor" />
                                        <span>{shop.reviews.reduce((acc, review) => acc + review.rating, 0) / shop.reviews.length }/5</span>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="pb-2">
                                <p className="text-sm text-gray-600 line-clamp-2 truncate">{shop.description}</p>
                                <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span className="flex items-center gap-1">
                          <ShoppingCart size={14} /> {shop.products.length}
                        </span>
                                    <span className="flex items-center gap-1">
                          <Users size={14} /> {shop.followers.length}
                        </span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link
                                    href={route('marketplace.show', shop.slug)}
                                    className="w-full"
                                >
                                    <Button
                                        className="w-full bg-primary hover:bg-primary/80"
                                    >
                                        Visiter la boutique
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                )}

                {/* Pagination */}
                {shops.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t gap-4">
                        <div className="text-sm text-muted-foreground">
                            Page {shops.current_page} sur {shops.last_page} ({shops.total} boutiques)
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={shops.current_page === 1}
                                onClick={() => {
                                    const prevLink = shops.links.find(l => l.label.includes('Previous') || l.label.includes('Précédent') || l.label === '&laquo; Previous');
                                    goToPage(prevLink?.url || null);
                                }}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Précédent
                            </Button>
                            
                            <div className="flex gap-1">
                                {shops.links
                                    .filter(link => !link.label.includes('Previous') && !link.label.includes('Next') && !link.label.includes('&laquo;') && !link.label.includes('&raquo;'))
                                    .map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => goToPage(link.url)}
                                        className="min-w-[40px]"
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
                                    const nextLink = shops.links.find(l => l.label.includes('Next') || l.label.includes('Suivant') || l.label === 'Next &raquo;');
                                    goToPage(nextLink?.url || null);
                                }}
                            >
                                Suivant
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
                </div>
                </div>

            <div className="bg-gradient-to-l from-primary to-chart-3 text-white rounded-xl p-6 md:p-8 my-12 w-full mx-0">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="mb-6 md:mb-0 md:pr-8">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Vendez sur notre marketplace</h2>
                        <p className=" mb-6">Rejoignez des milliers de vendeurs et donnez une seconde vie à vos vêtements et accessoires. C'est simple, rapide et écologique.</p>
                        <div className="flex flex-wrap gap-3">
                            <Link href={route('marketplace.create')}>
                                <Button className="bg-primary hover:bg-accent/50">
                                    Ouvrir ma boutique
                                </Button>
                            </Link>

                            <Button variant="outline" className="border-primary text-primary">
                                En savoir plus
                            </Button>
                        </div>
                    </div>
                    <div className="md:w-1/3">
                        <img
                            src="https://source.unsplash.com/Sw7nYNqZyYI"
                            alt="Devenir vendeur"
                            className="rounded-lg shadow-md"
                        />
                    </div>
                </div>
            </div>
            {/* FAQ Section */}
            <Faq/>
            </div>
        </AppLayout>
    );
}

export default Index;
