import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import ListProduct from '@/components/product/list-product';

interface Props {
    products: Product[];
}

function Index({products}: Props) {
    console.log(products);
    return (
        <AppLayout>
            {/* Page header */}
            <div className="bg-gray-50 py-8">
                <div className="container mx-auto px-4 md:px-8">
                    <h1 className="text-3xl font-bold mb-2">Boutique</h1>
                    <p className="text-gray-600">Découvrez notre collection d'articles de mode de seconde main.</p>

                    <div className="mt-8 bg-white rounded-lg shadow-sm p-4">
                        <div className="flex flex-wrap gap-4 items-center justify-between">
                            <div className="relative flex-grow max-w-md">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Rechercher des articles..."
                                    className="pl-10"
                                    // value={searchTerm}
                                    // onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <select
                                    className="border rounded p-2 focus:outline-none focus:ring-1 focus:ring-videdressing-primary"
                                    // value={sortBy}
                                    // onChange={(e) => setSortBy(e.target.value)}
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
                <ListProduct products={products} />
            </div>

        </AppLayout>
    );
}

export default Index;
