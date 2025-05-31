import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import ListProduct from '@/components/product/list-product';
import { router } from '@inertiajs/react';

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
}

function Index({products}: Props) {
    console.log(products);
    return (
        <AppLayout>
            {/* Page header */}
            <div className="bg-gray-50 py-8">
                <div className="container mx-auto px-4 md:px-8">
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
                <ListProduct products={products.data} />
                {/* Pagination */}
                <div className="mt-8 flex justify-center gap-2">
                    {products.links.map((link, i) => (
                        <Button
                            key={i}
                            variant={link.active ? "default" : "outline"}
                            disabled={!link.url}
                            onClick={() => {
                                if (link.url) {
                                    router.get(link.url);
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
