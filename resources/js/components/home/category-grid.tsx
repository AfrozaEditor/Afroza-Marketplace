import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Category } from '@/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronRight, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';

interface Props {
    categories: Category[];
}

// Couleurs de fond pour les catégories
const categoryStyles: Record<string, { gradient: string; shadow: string; image: string }> = {
    'mode-accessoires': { 
        gradient: 'from-pink-500 to-rose-600', 
        shadow: 'hover:shadow-pink-500/25',
        image: 'cat_mode.jpg'
    },
    'electronique-high-tech': { 
        gradient: 'from-blue-500 to-indigo-600', 
        shadow: 'hover:shadow-blue-500/25',
        image: 'cat_tech.jpg'
    },
    'maison-decoration': { 
        gradient: 'from-amber-500 to-orange-600', 
        shadow: 'hover:shadow-amber-500/25' ,
        image: 'cat_maison.jpg'
    },
    'bebe-enfants': { 
        gradient: 'from-cyan-500 to-teal-600', 
        shadow: 'hover:shadow-cyan-500/25' ,
        image: 'cat_bebe.jpg'
    },
    'beaute-sante': { 
        gradient: 'from-purple-500 to-violet-600', 
        shadow: 'hover:shadow-purple-500/25' ,
        image: 'cat_beaute.jpg'
    },
    'sports-loisirs': { 
        gradient: 'from-green-500 to-emerald-600', 
        shadow: 'hover:shadow-green-500/25' ,
        image: 'cat_sports.jpg'
    },
    'auto-moto': { 
        gradient: 'from-slate-600 to-gray-700', 
        shadow: 'hover:shadow-slate-500/25' ,
        image: 'cat_auto.jpg'
    },
    'livres-education': { 
        gradient: 'from-yellow-500 to-amber-600', 
        shadow: 'hover:shadow-yellow-500/25' ,
        image: 'cat_livre.jpg'
    },
    'services': { 
        gradient: 'from-sky-500 to-blue-600', 
        shadow: 'hover:shadow-sky-500/25' ,
        image: 'cat_service.jpg'
    },
    'divers': { 
        gradient: 'from-stone-500 to-neutral-600', 
        shadow: 'hover:shadow-stone-500/25' ,
        image: 'cat_divers.jpg'
    },
};

function CategoryGrid({ categories }: Props) {
    const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

    const getIcon = (iconName?: string) => {
        if (!iconName) return Icons.Package;
        const IconComponent = (Icons as any)[iconName];
        return IconComponent || Icons.Package;
    };

    // Filtrer pour n'afficher que les catégories principales
    const mainCategories = categories.filter(cat => !cat.parent_id);

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                {/* Header avec animation */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                        Explorer par catégorie
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold dark:text-white mb-3">
                        Trouvez ce que vous cherchez
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Parcourez nos 10 catégories et des dizaines de sous-catégories pour trouver l'article parfait
                    </p>
                </div>

                {/* Grille principale - 5 colonnes sur desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                    {mainCategories.map((category, index) => {
                        const IconComponent = getIcon(category.icon);
                        const isExpanded = expandedCategory === category.id;
                        const styles = categoryStyles[category.slug] || { gradient: 'from-gray-500 to-gray-600', shadow: 'hover:shadow-gray-500/25' };

                        return (
                            <div 
                                key={category.id} 
                                className="relative group"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <Link
                                    href={`/products?category=${category.id}`}
                                    className="block"
                                    onMouseEnter={() => setExpandedCategory(category.id)}
                                    onMouseLeave={() => setExpandedCategory(null)}
                                >
                                    <Card className={cn(
                                        "overflow-hidden transition-all duration-500 p-0 border-0",
                                        "hover:shadow-2xl hover:-translate-y-2",
                                        "bg-gradient-to-br",
                                        styles.gradient,
                                        styles.shadow
                                    )}
                                    >
                                        <div
                                            className="absolute inset-0 z-0 pointer-events-none"
                                            style={{
                                            backgroundImage: `url('${styles.image}')`,
                                            opacity: 0.3,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                            }}
                                        />
                                        <div className="relative z-10 h-36 sm:h-44 flex flex-col items-center justify-center p-4 text-white">
                                            {/* Cercle décoratif */}
                                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full transition-transform duration-500 group-hover:scale-150" />
                                            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-black/10 rounded-full" />
                                            
                                            {/* Icône avec animation */}
                                            <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <IconComponent className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-lg" />
                                            </div>
                                            
                                            {/* Nom de la catégorie */}
                                            <h3 className="relative z-10 text-sm sm:text-base font-bold text-center leading-tight drop-shadow-md">
                                                {category.name}
                                            </h3>
                                            
                                            {/* Nombre de sous-catégories */}
                                            {category.children && category.children.length > 0 && (
                                                <span className="relative z-10 text-xs text-white/80 mt-1">
                                                    {category.children.length} sous-catégories
                                                </span>
                                            )}

                                            {/* Flèche animée au survol */}
                                            <ArrowRight className={cn(
                                                "absolute bottom-3 right-3 w-5 h-5 transition-all duration-300",
                                                "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                                            )} />
                                        </div>
                                        {/* <div className="absolute inset-0 bg-black/50 z-0" /> */}
                                    </Card>
                                </Link>

                                {/* Menu déroulant des sous-catégories */}
                                {category.children && category.children.length > 0 && (
                                    <div 
                                        className={cn(
                                            "absolute left-0 right-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 transition-all duration-300 origin-top",
                                            isExpanded 
                                                ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto" 
                                                : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
                                        )}
                                        onMouseEnter={() => setExpandedCategory(category.id)}
                                        onMouseLeave={() => setExpandedCategory(null)}
                                    >
                                        <div className="p-2 max-h-64 overflow-y-auto">
                                            {category.children.map((child, childIndex) => (
                                                <Link
                                                    key={child.id}
                                                    href={`/products?category=${child.id}`}
                                                    className={cn(
                                                        "flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300",
                                                        "hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200",
                                                        "hover:translate-x-1"
                                                    )}
                                                    style={{ animationDelay: `${childIndex * 30}ms` }}
                                                >
                                                    <ChevronRight className="w-4 h-4 text-primary" />
                                                    <span>{child.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                        
                                        {/* Lien vers tous les produits de la catégorie */}
                                        <div className="border-t dark:border-gray-700 p-2">
                                            <Link
                                                href={`/products?category=${category.id}`}
                                                className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                            >
                                                Voir tout {category.name}
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Lien vers toutes les catégories */}
                <div className="text-center mt-10">
                    <Link 
                        href="/products"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
                    >
                        Voir tous les produits
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default CategoryGrid;
