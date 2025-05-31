import React from 'react';
import ProductCard from './product-card';
import { Product } from '@/types';

interface Props {
    products: Product[];
}

function ListProduct({ products }:Props) {
    // const filteredProducts = category === 'all' ? products : products.filter((product) => product.category === category);

    return (
        <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-opacity duration-500`}
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
