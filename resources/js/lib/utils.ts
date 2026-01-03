import { Category, Image, Product } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDateShort(date: string | Date): string {
    const formattedDate = format(new Date(date), 'MMMM yyyy', { locale: fr });
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

export function formatDate(date: string | Date): string {
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
}

/**
 * Get image URL from either a string or an Image object
 */
export function getImageUrl(image: string | Image | undefined): string {
    if (!image) return '/placeholder.svg';
    if (typeof image === 'string') return image;
    return image.url || '/placeholder.svg';
}

/**
 * Get first image URL from an array of images
 */
export function getFirstImageUrl(images: (string | Image)[] | undefined): string {
    if (!images || images.length === 0) return '/placeholder.svg';
    return getImageUrl(images[0]);
}


export const filterProducts = (
    products: Product[],
    filters: {
        searchTerm: string;
        priceRange: number[];
        selectedCategory: Category;
        selectedBrands: string[];
        selectedSizes: string[];
        selectedConditions: string[];
    }
) => {
    return products.filter((product) => {
        // Filtre par recherche
        if (
            filters.searchTerm &&
            !product.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
        ) {
            return false;
        }

        // Filtre par catégorie
        if (
            filters.selectedCategory &&
            filters.selectedCategory.name !== 'Tous' &&
            product.category.id !== filters.selectedCategory.id
        ) {
            return false;
        }

        // Filtre par prix
        if (
            product.price < filters.priceRange[0] ||
            product.price > filters.priceRange[1]
        ) {
            return false;
        }

        return true;
    });
};

export function formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price) + ' FCFA';
}
