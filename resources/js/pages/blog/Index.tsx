import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { HeroSection } from '@/components/hero-section';
import NewsLetter from '@/components/home/news-letter';
import { Article } from '@/types';
import { formatDate, cn } from '@/lib/utils';
import { 
    Search, 
    Clock, 
    Calendar, 
    ArrowRight, 
    BookOpen, 
    TrendingUp,
    Tag,
    User,
    Eye,
    Sparkles
} from 'lucide-react';

interface Props{
    blogs: {
        data: Article[];
    };
    cats: string[];
    currentCategory: string | null;
}
// const articles = [
//     {
//         id: 1,
//         title: 'Comment bien photographier vos vêtements pour les vendre rapidement',
//         category: 'Conseils',
//         date: '2 mai 2025',
//         excerpt: 'Découvrez les astuces pour mettre en valeur vos vêtements avec des photos de qualité professionnelle.',
//         image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
//         readTime: '5 min',
//         featured: true,
//     },
//     {
//         id: 2,
//         title: 'Les tendances mode printemps-été 2025',
//         category: 'Tendances',
//         date: '28 avril 2025',
//         excerpt: 'Quelles sont les pièces incontournables à avoir dans votre garde-robe cette saison ?',
//         image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843',
//         readTime: '7 min',
//         featured: false,
//     },
//     {
//         id: 3,
//         title: 'Économie circulaire : l\'impact positif de la seconde main',
//         category: 'Durabilité',
//         date: '20 avril 2025',
//         excerpt: 'Comment la mode de seconde main contribue à réduire l\'empreinte écologique de l\'industrie textile.',
//         image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
//         readTime: '8 min',
//         featured: false,
//     },
//     {
//         id: 4,
//         title: 'Comment reconnaître un vêtement de luxe authentique',
//         category: 'Guides',
//         date: '15 avril 2025',
//         excerpt: 'Les astuces des experts pour identifier les pièces authentiques et éviter les contrefaçons.',
//         image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
//         readTime: '10 min',
//         featured: false,
//     },
//     {
//         id: 5,
//         title: 'Interview exclusive : rencontre avec un créateur de mode éthique',
//         category: 'Interviews',
//         date: '10 avril 2025',
//         excerpt: 'Découvrez le parcours inspirant de Marie Durand, créatrice de mode éthique et durable.',
//         image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
//         readTime: '12 min',
//         featured: false,
//     },
//     {
//         id: 6,
//         title: 'Comment fixer le bon prix pour vos vêtements d\'occasion',
//         category: 'Conseils',
//         date: '5 avril 2025',
//         excerpt: 'Guide pratique pour déterminer le prix optimal qui vous permettra de vendre rapidement tout en maximisant vos profits.',
//         image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
//         readTime: '6 min',
//         featured: false,
//     },
// ];

function Index({blogs, cats, currentCategory}: Props) {

    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(currentCategory || 'all');

    const filterArticles = (articles: Article[], query: string, category: string) => {
        let filtered = articles;
        
        // Filtrer par catégorie
        if (category && category !== 'all') {
            filtered = filtered.filter(article => 
                article.category?.toLowerCase() === category.toLowerCase()
            );
        }
        
        // Filtrer par recherche
        if (query) {
            const lowerCaseQuery = query.toLowerCase();
            filtered = filtered.filter(article =>
                article.title.toLowerCase().includes(lowerCaseQuery) ||
                article.excerpt?.toLowerCase().includes(lowerCaseQuery)
            );
        }
        
        return filtered;
    };

    const filteredArticles: Article[] = filterArticles(blogs.data, searchQuery, activeCategory);
    // const featuredArticle : Article | undefined = blogs.find(article => article.featured)

    console.log(blogs);
    console.log(filteredArticles);
    
    // Article à la une (le premier featured ou le plus récent)
    const featuredArticle = blogs.data.find(a => a.featured) || blogs.data[0];
    const otherArticles = filteredArticles.filter(a => a.id !== featuredArticle?.id);
    
    return (
        <AppLayout>
            <Head title="Blog - Afroza Marketplace"/>
            
            {/* Hero Section Modernisé */}
            <div className="relative bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
                {/* Éléments décoratifs */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl" />
                
                <div className="relative container mx-auto px-4 py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <Badge className="mb-4 bg-primary/20 text-primary border border-primary/30">
                            <BookOpen className="w-3 h-3 mr-1" />
                            {blogs.data.length} articles publiés
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Notre <span className="text-primary">Blog</span>
                        </h1>
                        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                            Actualités, conseils et tendances. Découvrez nos articles sur la mode éthique, 
                            les astuces pour vendre efficacement et bien plus encore.
                        </p>
                        
                        {/* Barre de recherche */}
                        <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                            <div className="relative grow">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    type="text"
                                    placeholder="Rechercher un article..."
                                    className="pl-12 h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="flex justify-center gap-8 mt-10 pt-8 border-t border-white/10">
                            {[
                                { icon: BookOpen, value: blogs.data.length, label: 'Articles' },
                                { icon: Tag, value: cats.length, label: 'Catégories' },
                                { icon: TrendingUp, value: '10K+', label: 'Lecteurs' },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="flex items-center justify-center gap-2 text-2xl font-bold text-white">
                                        <stat.icon className="h-5 w-5 text-primary" />
                                        {stat.value}
                                    </div>
                                    <p className="text-sm text-gray-400">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Article à la une */}
            {featuredArticle && (
                <section className="bg-white dark:bg-gray-900 py-12">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <h2 className="text-2xl font-bold dark:text-white">À la une</h2>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8 items-center bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden">
                            <div className="relative h-72 md:h-96 overflow-hidden">
                                <img
                                    src={featuredArticle.featured_image || 'https://images.pexels.com/photos/5632381/pexels-photo-5632381.jpeg?auto=compress&cs=tinysrgb&w=800'}
                                    alt={featuredArticle.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-r from-black/40 to-transparent md:hidden" />
                            </div>
                            <div className="p-6 md:p-8">
                                {featuredArticle.category && (
                                    <Badge className="mb-3 bg-primary/10 text-primary border-0">
                                        {featuredArticle.category}
                                    </Badge>
                                )}
                                <h3 className="text-2xl md:text-3xl font-bold mb-4 dark:text-white">
                                    {featuredArticle.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                                    {featuredArticle.excerpt}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(featuredArticle.published_at)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {featuredArticle.read_time || '5 min'} de lecture
                                    </span>
                                </div>
                                <Link href={`/blog/${featuredArticle.slug}`}>
                                    <Button className="group">
                                        Lire l'article
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Liste des articles */}
            <section className="py-12 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    {/* Filtres par catégorie */}
                    <div className="mb-8">
                        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                <h2 className="text-xl font-bold dark:text-white">Tous les articles</h2>
                                <TabsList className="bg-white dark:bg-gray-800 flex-wrap h-auto gap-1 p-1">
                                    <TabsTrigger value="all" className="text-sm">
                                        Tous
                                    </TabsTrigger>
                                    {cats.map((category) => (
                                        <TabsTrigger 
                                            key={category} 
                                            value={category.toLowerCase()}
                                            className="text-sm"
                                        >
                                            {category}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>
                            
                            <div>
                                {filteredArticles.length === 0 ? (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
                                        <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                            Aucun article trouvé
                                        </h3>
                                        <p className="text-gray-500 mb-4">
                                            Essayez une autre catégorie ou terme de recherche
                                        </p>
                                        <Button variant="outline" onClick={() => {
                                            setSearchQuery('');
                                            setActiveCategory('all');
                                        }}>
                                            Voir tous les articles
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredArticles.map((article) => (
                                            <Card 
                                                key={article.id} 
                                                className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800"
                                            >
                                                <div className="relative h-48 overflow-hidden">
                                                    <img
                                                        src={article.featured_image || 'https://images.pexels.com/photos/5632381/pexels-photo-5632381.jpeg?auto=compress&cs=tinysrgb&w=600'}
                                                        alt={article.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                                                    
                                                    {article.category && (
                                                        <Badge className="absolute top-3 left-3 bg-primary/90 text-white border-0">
                                                            {article.category}
                                                        </Badge>
                                                    )}
                                                    
                                                    {/* Temps de lecture */}
                                                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {article.read_time || '5 min'}
                                                    </div>
                                                </div>
                                                
                                                <CardContent className="p-5">
                                                    <h3 className="font-bold text-lg mb-2 line-clamp-2 dark:text-white group-hover:text-primary transition-colors">
                                                        {article.title}
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                                        {article.excerpt}
                                                    </p>
                                                    
                                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            {formatDate(article.published_at)}
                                                        </span>
                                                        <Link 
                                                            href={`/blog/${article.slug}`}
                                                            className="text-primary font-medium text-sm hover:underline flex items-center gap-1 group/link"
                                                        >
                                                            Lire
                                                            <ArrowRight className="h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform" />
                                                        </Link>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Tabs>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <NewsLetter/>
        </AppLayout>
    );
}

export default Index;
