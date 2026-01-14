import React, { useEffect, useState, useCallback } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    products: Product[];
    title?: string;
    autoPlay?: boolean;
    interval?: number;
}

function ProductCarousel({ products, title = 'Nouveautés', autoPlay = true, interval = 4000 }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    
    // Nombre de produits visibles selon la taille d'écran
    const [visibleCount, setVisibleCount] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setVisibleCount(1);
            } else if (window.innerWidth < 1024) {
                setVisibleCount(2);
            } else {
                setVisibleCount(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, products.length - visibleCount);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, [maxIndex]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    }, [maxIndex]);

    // Auto-play
    useEffect(() => {
        if (!autoPlay || isHovered || products.length <= visibleCount) return;

        const timer = setInterval(nextSlide, interval);
        return () => clearInterval(timer);
    }, [autoPlay, isHovered, interval, nextSlide, products.length, visibleCount]);

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="w-full py-8">
            {title && (
                <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">
                    {title}
                </h2>
            )}
            
            <div 
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Bouton précédent */}
                {products.length > visibleCount && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white dark:bg-gray-800 shadow-lg hover:scale-110 transition-transform"
                        onClick={prevSlide}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                )}

                {/* Container du carousel */}
                <div className="overflow-hidden mx-8">
                    <div 
                        className="flex transition-transform duration-500 ease-out"
                        style={{ 
                            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                        }}
                    >
                        {products.map((product, index) => (
                            <div 
                                key={product.id}
                                className={cn(
                                    "flex-shrink-0 px-2 transition-opacity duration-300",
                                    visibleCount === 1 && "w-full",
                                    visibleCount === 2 && "w-1/2",
                                    visibleCount === 3 && "w-1/3",
                                )}
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bouton suivant */}
                {products.length > visibleCount && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white dark:bg-gray-800 shadow-lg hover:scale-110 transition-transform"
                        onClick={nextSlide}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {/* Indicateurs */}
            {products.length > visibleCount && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={cn(
                                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                                index === currentIndex 
                                    ? "bg-primary w-8" 
                                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                            )}
                            aria-label={`Aller au slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductCarousel;
