import React from 'react';
import ProductCard from './product-card';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
    products: Product[];
    className?: string;
}

function ListProduct({ products, className }:Props) {
    // const filteredProducts = category === 'all' ? products : products.filter((product) => product.category === category);

    return (
        <div
            className={cn(`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 transition-opacity duration-500 w-full`,className)}
        >
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    // id={product.id}
                    // name={product.name[language as keyof typeof product.name]}
                    // price={product.price}
                    // image={product.image}
                    // rating={product.rating}
                    // reviews={product.reviews}
                />
            ))}
        </div>
    );
}

export default ListProduct;
