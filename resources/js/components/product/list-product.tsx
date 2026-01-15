import React from 'react';
import ProductCard from './product-card';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
    products: Product[];
    className?: string;
    viewMode?: 'grid' | 'list';
}

function ListProduct({ products, className, viewMode = 'grid' }:Props) {
    return (
        <div
            className={cn(
                `transition-opacity duration-500 w-full`,
                viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                    : 'flex flex-col gap-4',
                className
            )}
        >
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                />
            ))}
        </div>
    );
}

export default ListProduct;
