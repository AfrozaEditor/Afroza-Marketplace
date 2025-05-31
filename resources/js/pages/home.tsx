import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { AppHeader } from '@/components/app-header';
import Heading from '@/components/heading';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { BookOpen, Folder } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ListProduct from '@/components/product/list-product';
import { HeroSection } from '@/components/hero-section';
import { Product } from '@/types';
import NewsLetter from '@/components/home/news-letter';


const breadcrumbs = [
    {
        title: 'Accueil',
        href: '/',
    },
    {
        title: 'Produits',
        href: '/products',
        icon: Folder,
    },
];

interface Props {
    latestProducts: Product[];
}

const categories = [
    {
        id: 1,
        name: 'Femmes',
        description: 'Vêtements et accessoires pour femmes',
        image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg',
    },
    {
        id: 2,
        name: 'Hommes',
        description: 'Collection masculine tendance',
        image: 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg',
    },
    {
        id: 3,
        name: 'Accessoires',
        description: 'Complétez votre style',
        image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
    },
    {
        id: 4,
        name: 'Chaussures',
        description: 'Pour tous les styles',
        image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    },
];

function Home({latestProducts}: Props) {
    console.log(latestProducts);

    return (
        <AppLayout>
            <Head title="Accueil" />

            {/*<div className="relative w-full h-96">*/}
            {/*    <div*/}
            {/*        className="absolute inset-0 bg-cover bg-center"*/}
            {/*        style={{*/}
            {/*            backgroundImage: 'url("https://images.pexels.com/photos/5868722/pexels-photo-5868722.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',*/}
            {/*            backgroundPosition: 'center 30%'*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <div className="absolute inset-0 bg-black/40"></div>*/}
            {/*    </div>*/}

            {/*    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">*/}
            {/*        <h1 className="text-4xl md:text-5xl font-bold mb-4">*/}
            {/*            Collection d'été*/}
            {/*        </h1>*/}
            {/*        <p className="text-xl md:text-2xl mb-8">*/}
            {/*            Jusqu'à 50% de réduction*/}
            {/*        </p>*/}
            {/*        <Button className="bg-primary hover:bg-primary/80 transition-colors font-medium">*/}
            {/*            <Link*/}
            {/*                href="#"*/}
            {/*            >*/}
            {/*                Acheter Maintenant*/}
            {/*            </Link>*/}
            {/*        </Button>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <HeroSection
                title="Collection d'été"
                description="Jusqu'à 50% de réduction"
                // image="https://images.pexels.com/photos/5868722/pexels-photo-5868722.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                className="h-96 text-white" // Ajout de la hauteur fixe
                buttons={{
                    primary: {
                        text: "Acheter Maintenant",
                        href: "/available"
                    }
                }}
                style={{
                    backgroundImage: 'url("https://images.pexels.com/photos/5868722/pexels-photo-5868722.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
                    backgroundPosition: 'center 30%',
                }}
            />

            {/*<div className="mx-auto max-w-7xl p-6">*/}
            {/*    /!* Contenu de votre page *!/*/}
            {/*    <h1 className="text-2xl font-bold">Bienvenue sur notre site</h1>*/}

            {/*    /!* Ajoutez ici le reste du contenu de votre page d'accueil *!/*/}
            {/*</div>*/}
            <div className="mx-auto w-full px-4">
                <h2 className="text-3xl font-bold text-center mb-6">Nos Catégories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/products?category=${category.id}`}
                            className="block group"
                        >
                            <Card className="overflow-hidden transition-transform hover:scale-105 p-0">
                                <div className="relative h-48 overflow-hidden w-full">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <span>{category.name}</span>
                                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/20 transition-colors" />
                                    <div className="absolute inset-0 bg-black/25 bg-opacity-30 flex items-center justify-center transition-opacity group-hover:bg-opacity-20">
                                        <h3 className="text-white text-xl font-semibold">
                                            {category.name}
                                        </h3>
                                    </div>
                                </div>
                                {/*<CardHeader className="relative z-10">*/}
                                {/*    <CardTitle className="text-xl">{category.name}</CardTitle>*/}
                                {/*    <CardDescription className="truncate">{category.description}</CardDescription>*/}
                                {/*</CardHeader>*/}
                                {/*<CardFooter className="flex justify-end">*/}
                                {/*    <Button variant="ghost" className="group-hover:translate-x-1 transition-transform">*/}
                                {/*        Découvrir →*/}
                                {/*    </Button>*/}
                                {/*</CardFooter>*/}
                            </Card>
                        </Link>
                    ))}
                </div>
                <h2 className="text-3xl font-bold text-center my-6">Nouveautés</h2>
                 <ListProduct products={latestProducts}/>
            </div>
            <NewsLetter/>
        </AppLayout>
    );
}

export default Home;
