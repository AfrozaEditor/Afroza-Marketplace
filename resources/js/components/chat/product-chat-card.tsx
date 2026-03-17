import { Link } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import { ChatProduct } from '@/types';
import { cn } from '@/lib/utils';

interface ProductChatCardProps {
    product: ChatProduct;
    variant?: 'inline' | 'pinned';
}

export default function ProductChatCard({ product, variant = 'inline' }: ProductChatCardProps) {
    return (
        <Link
            href={route('products.show', product.slug)}
            className={cn(
                "block rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:shadow-md transition-shadow",
                variant === 'pinned' ? 'mx-4 mt-4' : 'max-w-xs'
            )}
        >
            <div className="flex items-center gap-3 p-3">
                {product.image && (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                )}
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2">
                        {product.name}
                    </p>
                    <p className="text-primary font-bold text-sm mt-1">
                        {product.price.toLocaleString()} FCFA
                    </p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 shrink-0" />
            </div>
        </Link>
    );
}
