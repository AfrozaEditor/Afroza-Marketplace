import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { HeroSection } from '@/components/hero-section';
import { Button } from '@/components/ui/button';
import { Category, Shop } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Star, Users } from 'lucide-react';
import { MarketplaceFilters } from '@/components/filter/marketplace-filter';
import Faq from '@/components/faq';

interface Props {
    shops:  {
        data: Shop[];
        logo_url?: string;
        cover_image_url?: string;
    };
    categories: Category[];
    filters?: {
      search?: string;
    }
}


function Index({shops,categories,filters}: Props) {
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [priceRange, setPriceRange] = useState<number[]>([0, 400000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [productsRange, setProductsRange] = useState<number[]>([0, 200]);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('rating');
  

  // Format price in FCFA
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  // Reset all filters
  const resetFilters = () => {
    // setSearchTerm('');
    // setPriceRange([0, 400000]);
    // setRatingFilter(0);
    // setProductsRange([0, 200]);
    // setFeaturedOnly(false);
    // setSelectedCategories([]);
    // setSortBy('rating');
    router.get('/marketplace', {
            // category: '0',
        }, {
            preserveState: false,
            preserveScroll: false,
            replace: true // Ajouter replace pour s'assurer que l'historique est mis à jour
        });
  };

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (priceRange[0] > 0 || priceRange[1] < 400000) count++;
    if (ratingFilter > 0) count++;
    if (productsRange[0] > 0 || productsRange[1] < 200) count++;
    if (featuredOnly) count++;
    if (selectedCategories.length > 0) count++;
    return count;
  };

  useEffect(() => {
      // Mettre à jour l'URL avec les paramètres de filtrage
      const params = new URLSearchParams(window.location.search);
      if (searchTerm) {
          params.set('search', searchTerm);
      }
      // params.set('min_price', priceRange[0].toString());
      // params.set('max_price', priceRange[1].toString());
      // params.set('sort', sortBy);
  
      router.get(`/marketplace?${params.toString()}`, {}, {
          preserveState: true,
          preserveScroll: true
      });
  }, [searchTerm]);

  // Filter and search functionality
  const filteredSellers = shops.data
    .filter(shop => {
      // Search filter
      if (searchTerm && !shop.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !shop.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Rating filter
    //   if (ratingFilter > 0 && seller.rating < ratingFilter) {
    //     return false;
    //   }

      // Price range filter
    //   if (seller.maxPrice < priceRange[0] || seller.minPrice > priceRange[1]) {
    //     return false;
    //   }

      // Products range filter
      if (shop.products.length < productsRange[0] || shop.products.length > productsRange[1]) {
        return false;
      }

      // Featured filter
    //   if (featuredOnly && !seller.featured) {
    //     return false;
    //   }

      // Categories filter
    //   if (selectedCategories.length > 0 &&
    //       !selectedCategories.some(cat => shop.categories.includes(cat))) {
    //     return false;
    //   }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
        //   return b.rating - a.rating;
        case 'products':
        //   return b.products - a.products;
        case 'followers':
        //   return b.followers - a.followers;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    console.log(filteredSellers)




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
                  setSearchTerm={setSearchTerm}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  ratingFilter={ratingFilter}
                  setRatingFilter={setRatingFilter}
                  productsRange={productsRange}
                  setProductsRange={setProductsRange}
                  featuredOnly={featuredOnly}
                  setFeaturedOnly={setFeaturedOnly}
                //   selectedCategories={selectedCategories}
                //   setSelectedCategories={setSelectedCategories}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  resetFilters={resetFilters}
                  activeFiltersCount={getActiveFiltersCount()}
                  categories={categories}
                />
              </div>
                <div className="w-full" id='boutiques'>
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Boutiques ({shops.data.length})</h2>
                    <div className="text-sm text-gray-500">
                        {shops.data.length} résultats
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredSellers.map(shop => (
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
