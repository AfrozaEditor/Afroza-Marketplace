import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Category, Product, Shop, SharedData } from '@/types';
import NewsLetter from '@/components/home/news-letter';
import Features from '@/components/home/features';
import CategoryGrid from '@/components/home/category-grid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/product/product-card';
import {
    ArrowRight,
    ShoppingBag,
    Store,
    Truck,
    Shield,
    Sparkles,
    TrendingUp,
    Heart,
    Star,
    Zap,
    Gift,
    Clock,
    Package,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Flame,
    LayoutGrid,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryGroup {
    category: Category;
    products: Product[];
}

interface Props {
    latestProducts: Product[];
    featuredProducts: Product[];
    productsByCategory: CategoryGroup[];
    shops: Shop[];
    categories: Category[];
}

const heroImages = [
    'https://images.pexels.com/photos/5868722/pexels-photo-5868722.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/5632381/pexels-photo-5632381.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6567607/pexels-photo-6567607.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6347888/pexels-photo-6347888.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/5650026/pexels-photo-5650026.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/5868731/pexels-photo-5868731.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6347720/pexels-photo-6347720.jpeg?auto=compress&cs=tinysrgb&w=800',
];

function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [end, duration]);

    return <span>{count.toLocaleString()}{suffix}</span>;
}

function formatRating(value: unknown): string {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue.toFixed(1) : '0.0';
}

function SectionHeader({
    icon: Icon,
    badge,
    title,
    subtitle,
    href,
    linkLabel = 'Voir tout',
}: {
    icon: React.ElementType;
    badge?: string;
    title: string;
    subtitle?: string;
    href?: string;
    linkLabel?: string;
}) {
    return (
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                    {badge && <Badge className="mb-1 bg-primary/10 text-primary border-0 text-xs">{badge}</Badge>}
                    <h2 className="text-2xl font-bold dark:text-white">{title}</h2>
                    {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
                </div>
            </div>
            {href && (
                <Link href={href}>
                    <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                        {linkLabel}
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </Link>
            )}
        </div>
    );
}

function ShopCard({ shop }: { shop: Shop }) {
    return (
        <Link href={`/marketplace/${shop.slug}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group h-full">
                <div className="relative h-24 bg-linear-to-br from-primary/20 to-primary/5 overflow-hidden">
                    {shop.cover_url ? (
                        <img src={shop.cover_url} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <Store className="h-16 w-16 text-primary" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                </div>
                <CardContent className="p-4 -mt-7 relative">
                    <div className="mb-3 flex items-end gap-2">
                        <div className="h-12 w-12 rounded-xl border-2 border-white dark:border-gray-800 bg-white dark:bg-gray-800 shadow-md overflow-hidden shrink-0">
                            {shop.logo_url ? (
                                <img src={shop.logo_url} alt={shop.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                    <Store className="h-5 w-5 text-primary" />
                                </div>
                            )}
                        </div>
                        {shop.city && (
                            <span className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />{shop.city}
                            </span>
                        )}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">{shop.name}</h3>
                    {shop.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{shop.description}</p>}
                    <div className="mt-3">
                        <Badge variant="secondary" className="text-xs gap-1">
                            <Package className="h-3 w-3" />{shop.products_count ?? 0} articles
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

function NewProductsCarousel({ products }: { products: Product[] }) {
    const [visibleCount, setVisibleCount] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPausedDesktop, setIsPausedDesktop] = useState(false);

    useEffect(() => {
        const computeVisibleCount = () => {
            const width = window.innerWidth;
            if (width >= 1280) {
                setVisibleCount(4);
                return;
            }
            if (width >= 1024) {
                setVisibleCount(3);
                return;
            }
            if (width >= 640) {
                setVisibleCount(2);
                return;
            }
            setVisibleCount(1);
        };

        computeVisibleCount();
        window.addEventListener('resize', computeVisibleCount);
        return () => window.removeEventListener('resize', computeVisibleCount);
    }, []);

    const maxIndex = Math.max(products.length - visibleCount, 0);

    useEffect(() => {
        setCurrentIndex((prev) => Math.min(prev, maxIndex));
    }, [maxIndex]);

    const goToNext = () => {
        if (maxIndex === 0) return;
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const goToPrev = () => {
        if (maxIndex === 0) return;
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    useEffect(() => {
        if (products.length <= visibleCount || isPausedDesktop) return;

        const interval = window.setInterval(() => {
            setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
        }, 4500);

        return () => window.clearInterval(interval);
    }, [products.length, visibleCount, isPausedDesktop, maxIndex]);

    return (
        <div
            className="relative"
            onMouseEnter={() => {
                if (window.matchMedia('(min-width: 1024px)').matches) {
                    setIsPausedDesktop(true);
                }
            }}
            onMouseLeave={() => setIsPausedDesktop(false)}
        >
            <button
                type="button"
                onClick={goToPrev}
                className="absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border bg-white/95 p-2 shadow-md transition hover:bg-white lg:flex dark:border-gray-700 dark:bg-gray-900/95"
                aria-label="Voir les produits précédents"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            <button
                type="button"
                onClick={goToNext}
                className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border bg-white/95 p-2 shadow-md transition hover:bg-white lg:flex dark:border-gray-700 dark:bg-gray-900/95"
                aria-label="Voir les produits suivants"
            >
                <ChevronRight className="h-5 w-5" />
            </button>

            <div className="overflow-hidden pb-2">
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${(currentIndex * 100) / visibleCount}%)` }}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="shrink-0 px-1.5"
                            style={{ width: `${100 / visibleCount}%` }}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-3 flex justify-center gap-1.5">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        aria-label={`Aller à la position ${index + 1}`}
                        onClick={() => setCurrentIndex(index)}
                        className={cn(
                            'h-2 rounded-full transition-all',
                            currentIndex === index ? 'w-6 bg-primary' : 'w-2 bg-primary/30',
                        )}
                    />
                ))}
            </div>

            <div className="mt-4 flex justify-center gap-2 lg:hidden">
                <Button type="button" variant="outline" size="sm" onClick={goToPrev} className="gap-1.5">
                    <ChevronLeft className="h-4 w-4" /> Précédent
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={goToNext} className="gap-1.5">
                    Suivant <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {isPausedDesktop && (
                <p className="mt-2 hidden text-center text-xs text-muted-foreground lg:block">
                    Défilement en pause (survol)
                </p>
            )}
        </div>
    );
}

function Home({ latestProducts, featuredProducts, productsByCategory, shops, categories }: Props) {
    const [isVisible, setIsVisible] = useState(false);
    const { auth } = usePage<SharedData>().props;
    const isLoggedIn = !!auth.user;

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <AppLayout>
            <Head title="Accueil - Afroza Marketplace" />

            {!isLoggedIn && (
                <section className="relative min-h-175 flex items-center overflow-hidden">
                    <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-2 opacity-40">
                        {[
                            { imgs: heroImages.slice(0, 4), cls: 'animate-scroll-up-slow', mt: '' },
                            { imgs: heroImages.slice(2, 6), cls: 'animate-scroll-down-slow', mt: 'mt-12' },
                            { imgs: heroImages.slice(4, 8), cls: 'animate-scroll-up', mt: 'mt-6' },
                            { imgs: heroImages.slice(6, 10), cls: 'animate-scroll-down', mt: 'mt-16', hidden: 'hidden md:block' },
                            { imgs: heroImages.slice(8, 12), cls: 'animate-scroll-up-slow', mt: 'mt-8', hidden: 'hidden lg:block' },
                            { imgs: heroImages.slice(0, 4), cls: 'animate-scroll-down-slow', mt: 'mt-20', hidden: 'hidden lg:block' },
                        ].map((col, ci) => (
                            <div key={ci} className={cn('relative overflow-hidden', col.mt, col.hidden)}>
                                <div className={cn('flex flex-col gap-3', col.cls)}>
                                    {[...col.imgs, ...col.imgs].map((img, ii) => (
                                        <div key={ii} className="aspect-3/4 rounded-xl overflow-hidden shrink-0">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="absolute inset-0 bg-linear-to-b from-gray-900/90 via-gray-900/85 to-gray-900/95" />
                    <div className="absolute top-20 left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                    <div className="relative z-10 container mx-auto px-4 py-16">
                        <div className={cn('max-w-3xl mx-auto text-center transition-all duration-1000', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')}>
                            <Badge className="mb-6 bg-primary/90 hover:bg-primary text-white px-5 py-2 text-sm">
                                <Sparkles className="w-4 h-4 mr-2" />La marketplace #1 au Cameroun
                            </Badge>
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                                Achetez et vendez <span className="text-primary">tout ce qui compte</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                                La marketplace camerounaise pour acheter et vendre des articles de qualité. Mode, électronique, maison et bien plus encore !
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 mb-12">
                                <Link href="/products">
                                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white group h-14 px-10 text-lg">
                                        <ShoppingBag className="mr-2 h-5 w-5" />Explorer les produits
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 h-14 px-10 text-lg backdrop-blur-sm">
                                        <Store className="mr-2 h-5 w-5" />Ouvrir ma boutique
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex justify-center gap-8 md:gap-16 pt-8 border-t border-white/20">
                                {[{ end: 10000, suffix: '+', label: 'Produits' }, { end: 500, suffix: '+', label: 'Vendeurs' }, { end: 5000, suffix: '+', label: 'Clients satisfaits' }].map(({ end, suffix, label }) => (
                                    <div key={label} className="text-center">
                                        <div className="text-3xl md:text-4xl font-bold text-white"><AnimatedCounter end={end} suffix={suffix} /></div>
                                        <div className="text-sm text-gray-400 mt-1">{label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {!isLoggedIn && (
                <section className="bg-linear-to-r from-primary via-primary/90 to-primary py-4 overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-center gap-4 text-white animate-marquee">
                            <Zap className="w-5 h-5" /><span className="font-medium">Livraison gratuite à partir de 25 000 FCFA</span>
                            <span className="mx-4">•</span>
                            <Gift className="w-5 h-5" /><span className="font-medium">-10% sur votre première commande avec le code BIENVENUE</span>
                            <span className="mx-4">•</span>
                            <Clock className="w-5 h-5" /><span className="font-medium">Livraison en 24-48h</span>
                        </div>
                    </div>
                </section>
            )}

            {isLoggedIn && (
                <>
                    <section className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent py-8 border-b border-primary/10">
                        <div className="container mx-auto px-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold dark:text-white">Bonjour, {auth.user.name.split(' ')[0]} ! 👋</h1>
                                    <p className="text-muted-foreground mt-1">Que cherchez-vous aujourd&apos;hui ?</p>
                                </div>
                                <div className="flex gap-3 flex-wrap">
                                    <Link href="/marketplace"><Button className="gap-2 bg-primary text-white"><ShoppingBag className="h-4 w-4" />Explorer</Button></Link>
                                    <Link href="/favorites"><Button variant="outline" className="gap-2"><Heart className="h-4 w-4" />Favoris</Button></Link>
                                    <Link href={route('order.index')}><Button variant="outline" className="gap-2"><Package className="h-4 w-4" />Mes commandes</Button></Link>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
                                {[
                                    { label: 'Nouveautés', value: latestProducts.length, icon: Sparkles },
                                    { label: 'Top notés', value: featuredProducts.length, icon: Flame },
                                    { label: 'Catégories actives', value: productsByCategory.length, icon: LayoutGrid },
                                    { label: 'Boutiques', value: shops.length, icon: Store },
                                ].map((item) => (
                                    <Card key={item.label} className="border-primary/10 bg-white/90 dark:bg-gray-900/80">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-primary/10 p-2">
                                                    <item.icon className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-semibold dark:text-white">{item.value}</p>
                                                    <p className="text-xs text-muted-foreground">{item.label}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>

                    {featuredProducts.length > 0 && (
                        <section className="py-12 bg-white dark:bg-gray-950">
                            <div className="container mx-auto px-4">
                                <SectionHeader icon={Flame} badge="Top rated" title="Produits mis en avant" subtitle="Les articles les mieux notés par notre communauté" href="/marketplace" />
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {featuredProducts.slice(0, 8).map((product, index) => (
                                        <div key={product.id} className="space-y-2">
                                            <div className="relative">
                                                <ProductCard product={product} />
                                                <Badge className="absolute left-2 top-2 bg-black/70 text-white border-0">#{index + 1}</Badge>
                                            </div>
                                            <div className="flex items-center justify-between px-1 text-xs">
                                                <span className="inline-flex items-center gap-1 text-amber-500">
                                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                                    {formatRating(product.reviews_avg_rating)} / 5
                                                </span>
                                                <span className="text-muted-foreground">
                                                    {product.reviews_count ?? product.reviews?.length ?? 0} avis
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {latestProducts.length > 0 && (
                        <section className="py-12 bg-gray-50 dark:bg-gray-900">
                            <div className="container mx-auto px-4">
                                <SectionHeader icon={TrendingUp} badge="Récent" title="Nouveautés" subtitle="Défilement carte par carte avec navigation" href="/products" />
                                <NewProductsCarousel products={latestProducts} />
                            </div>
                        </section>
                    )}

                    {productsByCategory.length > 0 && (
                        <section className="py-12 bg-white dark:bg-gray-950">
                            <div className="container mx-auto px-4">
                                <SectionHeader icon={LayoutGrid} title="Parcourir par catégorie" subtitle="Explorez les articles par univers" />
                                <div className="space-y-14">
                                    {productsByCategory.map(({ category, products }) => (
                                        <div key={category.id}>
                                            <div className="flex items-center justify-between mb-5">
                                                <div className="flex items-center gap-2">
                                                    {category.image ? (
                                                        <img src={category.image} alt={category.name} className="h-8 w-8 rounded-lg object-cover" />
                                                    ) : (
                                                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                            <ShoppingBag className="h-4 w-4 text-primary" />
                                                        </div>
                                                    )}
                                                    <h3 className="text-lg font-semibold dark:text-white">{category.name}</h3>
                                                </div>
                                                <Link href={`/marketplace?category=${category.slug}`}>
                                                    <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
                                                        Voir plus<ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                                {products.slice(0, 6).map((product) => <ProductCard key={product.id} product={product} />)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {shops.length > 0 && (
                        <section className="py-12 bg-gray-50 dark:bg-gray-900">
                            <div className="container mx-auto px-4">
                                <SectionHeader icon={Store} badge="Marketplace" title="Boutiques disponibles" subtitle="Découvrez nos vendeurs et leurs articles" href="/marketplace" linkLabel="Toutes les boutiques" />
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {shops.map((shop) => <ShopCard key={shop.id} shop={shop} />)}
                                </div>
                            </div>
                        </section>
                    )}
                </>
            )}

            <section className="py-12 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: ShoppingBag, title: 'Large Choix', desc: '10 000+ articles', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
                            { icon: Shield, title: 'Paiement Sécurisé', desc: '100% sécurisé', color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
                            { icon: Truck, title: 'Livraison Rapide', desc: '24-48h partout', color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
                            { icon: Heart, title: 'Satisfaction', desc: 'Garantie ou remboursé', color: 'text-pink-500 bg-pink-50 dark:bg-pink-900/20' },
                        ].map((item, index) => (
                            <div key={index} className={cn('flex items-center md:gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default flex-col text-center gap-2', item.color)}>
                                <item.icon className="w-10 h-10 shrink-0" />
                                <div>
                                    <h3 className="font-semibold dark:text-white">{item.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <CategoryGrid categories={categories} />

            {!isLoggedIn && (
                <section className="py-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920")' }} />
                    <div className="absolute inset-0 bg-linear-to-r from-primary/95 to-purple-600/90" />
                    <div className="container mx-auto px-4 relative">
                        <div className="max-w-3xl mx-auto text-center text-white">
                            <Badge className="mb-6 bg-white/20 text-white border-white/30">
                                <Star className="w-4 h-4 mr-2" />Rejoignez notre communauté
                            </Badge>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Vendez vos articles en quelques clics</h2>
                            <p className="text-xl text-white/90 mb-8 leading-relaxed">Créez votre boutique gratuitement et commencez à vendre dès aujourd'hui.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/register">
                                    <Button size="lg" className="bg-white text-primary hover:bg-gray-100 h-14 px-8 text-lg">
                                        <Store className="mr-2 h-5 w-5" />Créer ma boutique
                                    </Button>
                                </Link>
                            </div>
                            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                                <div><div className="text-3xl font-bold">0 FCFA</div><div className="text-sm text-white/80">Frais d'inscription</div></div>
                                <div><div className="text-3xl font-bold">5%</div><div className="text-sm text-white/80">Commission seulement</div></div>
                                <div><div className="text-3xl font-bold">24h</div><div className="text-sm text-white/80">Mise en ligne rapide</div></div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <Features />

            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold dark:text-white mb-3">Ce que disent nos clients</h2>
                        <p className="text-gray-600 dark:text-gray-400">Des milliers de clients satisfaits</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { name: 'Marie K.', location: 'Douala', text: 'J\'ai trouvé des vêtements de marque à prix très abordables. La livraison était rapide et le service client excellent !', rating: 5 },
                            { name: 'Jean-Pierre M.', location: 'Yaoundé', text: 'En tant que vendeur, j\'apprécie la simplicité de la plateforme. J\'ai pu vendre tous mes anciens appareils électroniques facilement.', rating: 5 },
                            { name: 'Amélie T.', location: 'Bafoussam', text: 'Les catégories sont bien organisées et j\'ai trouvé exactement ce que je cherchais pour la chambre de bébé. Merci !', rating: 5 },
                        ].map((testimonial, index) => (
                            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span className="text-primary font-semibold">{testimonial.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold dark:text-white">{testimonial.name}</div>
                                        <div className="text-sm text-gray-500">{testimonial.location}</div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <NewsLetter />
        </AppLayout>
    );
}

export default Home;
