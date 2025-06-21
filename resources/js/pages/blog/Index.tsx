import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/react';
import { HeroSection } from '@/components/hero-section';
import NewsLetter from '@/components/home/news-letter';


const articles = [
    {
        id: 1,
        title: 'Comment bien photographier vos vêtements pour les vendre rapidement',
        category: 'Conseils',
        date: '2 mai 2025',
        excerpt: 'Découvrez les astuces pour mettre en valeur vos vêtements avec des photos de qualité professionnelle.',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
        readTime: '5 min',
        featured: true,
    },
    {
        id: 2,
        title: 'Les tendances mode printemps-été 2025',
        category: 'Tendances',
        date: '28 avril 2025',
        excerpt: 'Quelles sont les pièces incontournables à avoir dans votre garde-robe cette saison ?',
        image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843',
        readTime: '7 min',
        featured: false,
    },
    {
        id: 3,
        title: 'Économie circulaire : l\'impact positif de la seconde main',
        category: 'Durabilité',
        date: '20 avril 2025',
        excerpt: 'Comment la mode de seconde main contribue à réduire l\'empreinte écologique de l\'industrie textile.',
        image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
        readTime: '8 min',
        featured: false,
    },
    {
        id: 4,
        title: 'Comment reconnaître un vêtement de luxe authentique',
        category: 'Guides',
        date: '15 avril 2025',
        excerpt: 'Les astuces des experts pour identifier les pièces authentiques et éviter les contrefaçons.',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
        readTime: '10 min',
        featured: false,
    },
    {
        id: 5,
        title: 'Interview exclusive : rencontre avec un créateur de mode éthique',
        category: 'Interviews',
        date: '10 avril 2025',
        excerpt: 'Découvrez le parcours inspirant de Marie Durand, créatrice de mode éthique et durable.',
        image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
        readTime: '12 min',
        featured: false,
    },
    {
        id: 6,
        title: 'Comment fixer le bon prix pour vos vêtements d\'occasion',
        category: 'Conseils',
        date: '5 avril 2025',
        excerpt: 'Guide pratique pour déterminer le prix optimal qui vous permettra de vendre rapidement tout en maximisant vos profits.',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
        readTime: '6 min',
        featured: false,
    },
];

function Index() {

    const [searchQuery, setSearchQuery] = useState('');

    const filterArticles = (articles, query) => {
        if (!query) return articles;
        const lowerCaseQuery = query.toLowerCase();
        return articles.filter(article =>
            article.title.toLowerCase().includes(lowerCaseQuery) ||
            article.category.toLowerCase().includes(lowerCaseQuery) ||
            article.excerpt.toLowerCase().includes(lowerCaseQuery)
        );
    };

    const filteredArticles = filterArticles(articles, searchQuery);
    const featuredArticle = articles.find(article => article.featured)

    return (
        <AppLayout>
            <Head title="Blog"/>
            <HeroSection
                className="bg-gradient-to-r from-primary to-white text-black max-h-3xl"
                title="Actualités, conseils et tendances"
                description="Découvrez nos derniers articles sur la mode éthique, les conseils pour vendre efficacement, et les tendances du moment."
            />
            {/* Featured article */}
            {featuredArticle && (
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-8">À la une</h2>
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="rounded-xl overflow-hidden h-80">
                                <img
                                    src={featuredArticle.image}
                                    alt={featuredArticle.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <Badge className="mb-2 bg-videdressing-secondary text-white">
                                    {featuredArticle.category}
                                </Badge>
                                <h3 className="text-3xl font-bold mb-4">{featuredArticle.title}</h3>
                                <p className="text-gray-600 mb-4">{featuredArticle.excerpt}</p>
                                <div className="flex items-center text-sm text-gray-500 mb-6">
                                    <span>{featuredArticle.date}</span>
                                    <span className="mx-2">•</span>
                                    <span>{featuredArticle.readTime} de lecture</span>
                                </div>
                                <button className="text-primary font-medium hover:text-secondary transition-colors">
                                    Lire l'article →
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Articles list */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="mb-8">
                        <Tabs defaultValue="all">
                            <TabsList className="bg-white">
                                <TabsTrigger value="all">Tous</TabsTrigger>
                                <TabsTrigger value="conseils">Conseils</TabsTrigger>
                                <TabsTrigger value="tendances">Tendances</TabsTrigger>
                                <TabsTrigger value="durabilite">Durabilité</TabsTrigger>
                                <TabsTrigger value="guides">Guides</TabsTrigger>
                            </TabsList>
                            <TabsContent value="all">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                                    {filteredArticles.map((article) => (
                                        <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                            <div className="h-48 overflow-hidden">
                                                <img
                                                    src={article.image}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                                />
                                            </div>
                                            <CardHeader className="pb-2">
                                                <div className="flex items-center justify-between">
                                                    <Badge className="bg-light text-primary">
                                                        {article.category}
                                                    </Badge>
                                                    <span className="text-sm text-gray-500">{article.readTime} de lecture</span>
                                                </div>
                                                <CardTitle className="mt-3 text-xl">{article.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <CardDescription>{article.excerpt}</CardDescription>
                                            </CardContent>
                                            <CardFooter className="flex justify-between items-center pt-0">
                                                <span className="text-sm text-gray-500">{article.date}</span>
                                                <Button variant={'link'} className="text-primary font-medium hover:text-secondary transition-colors">
                                                    Lire la suite →
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="conseils">
                                <div className="text-center py-12">
                                    <p className="text-gray-600">Consultez cette catégorie pour voir les articles de conseils.</p>
                                </div>
                            </TabsContent>
                            <TabsContent value="tendances">
                                <div className="text-center py-12">
                                    <p className="text-gray-600">Consultez cette catégorie pour voir les articles de tendances.</p>
                                </div>
                            </TabsContent>
                            <TabsContent value="durabilite">
                                <div className="text-center py-12">
                                    <p className="text-gray-600">Consultez cette catégorie pour voir les articles de durabilité.</p>
                                </div>
                            </TabsContent>
                            <TabsContent value="guides">
                                <div className="text-center py-12">
                                    <p className="text-gray-600">Consultez cette catégorie pour voir les guides.</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </section>

            {/* Newsletter section */}
            {/*<section className="py-16 bg-primary text-white">*/}
            {/*    <div className="container mx-auto px-4">*/}
            {/*        <div className="max-w-2xl mx-auto text-center">*/}
            {/*            <h2 className="text-3xl font-bold mb-4">Restez informé</h2>*/}
            {/*            <p className="mb-8">Abonnez-vous à notre newsletter pour recevoir nos derniers articles et conseils directement dans votre boîte mail.</p>*/}
            {/*            <div className="flex flex-col sm:flex-row gap-4">*/}
            {/*                <Input*/}
            {/*                    type="email"*/}
            {/*                    placeholder="Votre adresse email"*/}
            {/*                    className="flex-grow px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"*/}
            {/*                />*/}
            {/*                <Button className="bg-white text-primary px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">*/}
            {/*                    S'abonner*/}
            {/*                </Button>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}
            <NewsLetter/>
        </AppLayout>
    );
}

export default Index;
