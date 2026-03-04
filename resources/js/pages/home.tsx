import React, { useEffect, useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Category, Product } from '@/types';
import NewsLetter from '@/components/home/news-letter';
import Features from '@/components/home/features';
import ProductCarousel from '@/components/home/product-carousel';
import CategoryGrid from '@/components/home/category-grid';
import { HeroSection } from '@/components/hero-section';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    latestProducts: Product[];
    categories: Category[];
}

// Images pour le hero avec défilement
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

// Compteur animé
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [end, duration]);

    return <span>{count.toLocaleString()}{suffix}</span>;
}

// Composant pour les images défilantes verticalement
function ScrollingImages({ images, direction = 'up' }: { images: string[]; direction?: 'up' | 'down' }) {
    return (
        <div className="relative h-full overflow-hidden">
            <div
                className={cn(
                    "flex flex-col gap-4",
                    direction === 'up' ? 'animate-scroll-up' : 'animate-scroll-down'
                )}
            >
                {/* Double les images pour un défilement infini */}
                {[...images, ...images].map((img, index) => (
                    <div
                        key={index}
                        className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl flex-shrink-0"
                    >
                        <img
                            src={img}
                            alt={`Hero ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function Home({ latestProducts, categories }: Props) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <AppLayout>
            <Head title="Accueil - Afroza Marketplace" />

            {/* Hero Section avec images défilantes en arrière-plan */}
            <section className="relative min-h-[700px] flex items-center overflow-hidden">
                {/* Arrière-plan avec colonnes d'images défilantes */}
                <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-2 opacity-40">
                    {/* Colonne 1 - défilement vers le haut */}
                    <div className="relative overflow-hidden">
                        <div className="animate-scroll-up-slow flex flex-col gap-3">
                            {[...heroImages.slice(0, 4), ...heroImages.slice(0, 4)].map((img, index) => (
                                <div key={`col1-${index}`} className="aspect-[3/4] rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Colonne 2 - défilement vers le bas */}
                    <div className="relative overflow-hidden mt-12">
                        <div className="animate-scroll-down-slow flex flex-col gap-3">
                            {[...heroImages.slice(2, 6), ...heroImages.slice(2, 6)].map((img, index) => (
                                <div key={`col2-${index}`} className="aspect-[3/4] rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Colonne 3 - défilement vers le haut */}
                    <div className="relative overflow-hidden mt-6">
                        <div className="animate-scroll-up flex flex-col gap-3">
                            {[...heroImages.slice(4, 8), ...heroImages.slice(4, 8)].map((img, index) => (
                                <div key={`col3-${index}`} className="aspect-[3/4] rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Colonne 4 - défilement vers le bas (visible à partir de md) */}
                    <div className="relative overflow-hidden hidden md:block mt-16">
                        <div className="animate-scroll-down flex flex-col gap-3">
                            {[...heroImages.slice(6, 10), ...heroImages.slice(6, 10)].map((img, index) => (
                                <div key={`col4-${index}`} className="aspect-[3/4] rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Colonne 5 - défilement vers le haut (visible à partir de lg) */}
                    <div className="relative overflow-hidden hidden lg:block mt-8">
                        <div className="animate-scroll-up-slow flex flex-col gap-3">
                            {[...heroImages.slice(8, 12), ...heroImages.slice(8, 12)].map((img, index) => (
                                <div key={`col5-${index}`} className="aspect-[3/4] rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Colonne 6 - défilement vers le bas (visible à partir de lg) */}
                    <div className="relative overflow-hidden hidden lg:block mt-20">
                        <div className="animate-scroll-down-slow flex flex-col gap-3">
                            {[...heroImages.slice(0, 4), ...heroImages.slice(0, 4)].map((img, index) => (
                                <div key={`col6-${index}`} className="aspect-[3/4] rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Overlay sombre pour lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/85 to-gray-900/95" />

                {/* Éléments décoratifs animés */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

                {/* Contenu au premier plan */}
                <div className="relative z-10 container mx-auto px-4 py-16">
                    <div className={cn(
                        "max-w-3xl mx-auto text-center transition-all duration-1000",
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    )}>
                        <Badge className="mb-6 bg-primary/90 hover:bg-primary text-white px-5 py-2 text-sm">
                            <Sparkles className="w-4 h-4 mr-2" />
                            La marketplace #1 au Cameroun
                        </Badge>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Achetez et vendez <span className="text-primary">tout ce qui compte</span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                            La marketplace camerounaise pour acheter et vendre des articles de qualité.
                            Mode, électronique, maison et bien plus encore !
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            <Link href="/products">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white group h-14 px-10 text-lg">
                                    <ShoppingBag className="mr-2 h-5 w-5" />
                                    Explorer les produits
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 h-14 px-10 text-lg backdrop-blur-sm">
                                    <Store className="mr-2 h-5 w-5" />
                                    Ouvrir ma boutique
                                </Button>
                            </Link>
                        </div>

                        {/* Mini stats dans le hero */}
                        <div className="flex justify-center gap-8 md:gap-16 pt-8 border-t border-white/20">
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-white">
                                    <AnimatedCounter end={10000} suffix="+" />
                                </div>
                                <div className="text-sm text-gray-400 mt-1">Produits</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-white">
                                    <AnimatedCounter end={500} suffix="+" />
                                </div>
                                <div className="text-sm text-gray-400 mt-1">Vendeurs</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-white">
                                    <AnimatedCounter end={5000} suffix="+" />
                                </div>
                                <div className="text-sm text-gray-400 mt-1">Clients satisfaits</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Badges flottants */}
                <div className="absolute bottom-8 left-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 animate-bounce-slow hidden lg:block z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">+250 ventes</p>
                            <p className="text-xs text-gray-500">cette semaine</p>
                        </div>
                    </div>
                </div>

                <div className="absolute top-24 right-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 animate-bounce-slow hidden lg:block z-10" style={{ animationDelay: '1s' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                            <Heart className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">98% satisfaction</p>
                            <p className="text-xs text-gray-500">clients heureux</p>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-24 right-16 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 animate-bounce-slow hidden xl:block z-10" style={{ animationDelay: '1.5s' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <Zap className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Livraison 24h</p>
                            <p className="text-xs text-gray-500">partout au Cameroun</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bannière promotionnelle */}
            <section className="bg-gradient-to-r from-primary via-primary/90 to-primary py-4 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-4 text-white animate-marquee">
                        <Zap className="w-5 h-5" />
                        <span className="font-medium">Livraison gratuite à partir de 25 000 FCFA</span>
                        <span className="mx-4">•</span>
                        <Gift className="w-5 h-5" />
                        <span className="font-medium">-10% sur votre première commande avec le code BIENVENUE</span>
                        <span className="mx-4">•</span>
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">Livraison en 24-48h</span>
                    </div>
                </div>
            </section>

            {/* Section Avantages rapides */}
            <section className="py-12 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: ShoppingBag, title: 'Large Choix', desc: '10 000+ articles', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
                            { icon: Shield, title: 'Paiement Sécurisé', desc: '100% sécurisé', color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
                            { icon: Truck, title: 'Livraison Rapide', desc: '24-48h partout', color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
                            { icon: Heart, title: 'Satisfaction', desc: 'Garantie ou remboursé', color: 'text-pink-500 bg-pink-50 dark:bg-pink-900/20' },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex items-center md:gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default flex-col text-center gap-2",
                                    item.color
                                )}
                            >
                                <item.icon className="w-10 h-10 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold dark:text-white">{item.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Catégories avec design amélioré */}
            <CategoryGrid categories={categories} />

            {/* Section Tendances / Nouveautés */}
            <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
                <div className="container mx-auto px-4">
                    {/* Header de section avec icône */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                            <TrendingUp className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold dark:text-white mb-3">
                            Nouveautés & Tendances
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Découvrez les derniers articles ajoutés par nos vendeurs
                        </p>
                    </div>
                </div>

                {/* Affichage des produits */}
                {latestProducts.length > 0 ? (
                    latestProducts.length >= 4 ? (
                        /* Carrousel défilant infini pour 4+ produits */
                        <div className="relative w-full">
                            {/* Dégradés sur les côtés pour un effet de fade */}
                            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none" />
                            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none" />

                            {/* Container du défilement */}
                            <div className="flex animate-marquee hover:[animation-play-state:paused]">
                                {/* Premier groupe de produits */}
                                {latestProducts.slice(0, 6).map((product) => (
                                    <div key={product.id} className="flex-shrink-0 w-72 px-3">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                                {/* Duplication pour le défilement infini */}
                                {latestProducts.slice(0, 6).map((product) => (
                                    <div key={`dup-${product.id}`} className="flex-shrink-0 w-72 px-3">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Grille statique pour moins de 4 produits */
                        <div className="container mx-auto px-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                                {latestProducts.map((product) => (
                                    <div key={product.id} className="w-full max-w-sm">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ) : (
                    /* Message si aucun produit */
                    <div className="container mx-auto px-4 text-center py-12">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-auto">
                            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Aucun produit disponible pour le moment
                            </p>
                            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                                Revenez bientôt pour découvrir nos nouveautés !
                            </p>
                        </div>
                    </div>
                )}

                <div className="container mx-auto px-4">
                    <div className="text-center mt-10">
                        <Link href="/products">
                            <Button size="lg" className="group bg-primary hover:bg-primary/90">
                                Voir toutes les nouveautés
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Section CTA - Devenir vendeur */}
            <section className="py-20 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url("https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920")',
                    }}
                />
                <div className="absolute inset-0 bg-linear-to-r from-primary/95 to-purple-600/90" />

                {/* Shapes décoratives */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full" />
                </div>

                <div className="container mx-auto px-4 relative">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <Badge className="mb-6 bg-white/20 text-white border-white/30">
                            <Star className="w-4 h-4 mr-2" />
                            Rejoignez notre communauté
                        </Badge>

                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Vendez vos articles en quelques clics
                        </h2>

                        <p className="text-xl text-white/90 mb-8 leading-relaxed">
                            Créez votre boutique gratuitement et commencez à vendre dès aujourd'hui.
                            Rejoignez plus de 500 vendeurs qui font confiance à Afroza Marketplace.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 h-14 px-8 text-lg">
                                    <Store className="mr-2 h-5 w-5" />
                                    Créer ma boutique
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 h-14 px-8 text-lg">
                                    En savoir plus
                                </Button>
                            </Link>
                        </div>

                        {/* Avantages vendeurs */}
                        <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                            <div>
                                <div className="text-3xl font-bold">0 FCFA</div>
                                <div className="text-sm text-white/80">Frais d'inscription</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">5%</div>
                                <div className="text-sm text-white/80">Commission seulement</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">24h</div>
                                <div className="text-sm text-white/80">Mise en ligne rapide</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features améliorées */}
            <Features />

            {/* Témoignages (nouveau) */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold dark:text-white mb-3">
                            Ce que disent nos clients
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Des milliers de clients satisfaits
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                name: 'Marie K.',
                                location: 'Douala',
                                text: 'J\'ai trouvé des vêtements de marque à prix très abordables. La livraison était rapide et le service client excellent !',
                                rating: 5
                            },
                            {
                                name: 'Jean-Pierre M.',
                                location: 'Yaoundé',
                                text: 'En tant que vendeur, j\'apprécie la simplicité de la plateforme. J\'ai pu vendre tous mes anciens appareils électroniques facilement.',
                                rating: 5
                            },
                            {
                                name: 'Amélie T.',
                                location: 'Bafoussam',
                                text: 'Les catégories sont bien organisées et j\'ai trouvé exactement ce que je cherchais pour la chambre de bébé. Merci !',
                                rating: 5
                            },
                        ].map((testimonial, index) => (
                            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                                    "{testimonial.text}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span className="text-primary font-semibold">
                                            {testimonial.name.charAt(0)}
                                        </span>
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

            {/* Newsletter */}
            <NewsLetter />
        </AppLayout>
    );
}

export default Home;
