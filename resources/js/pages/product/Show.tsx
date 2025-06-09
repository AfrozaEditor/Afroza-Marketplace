import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import { Product } from '@/types';

interface Props {
    product: Product;
    images: string[];
}

function Show({product, images}:Props) {
    const [mainImage, setMainImage] = useState(images[0]);
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (amount: number) => {
        const newQuantity = quantity + amount;
        if (newQuantity >= 1 && newQuantity <= product.quantity) {
            setQuantity(newQuantity);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1 && value <= product.quantity) {
            setQuantity(value);
        }
    };

    const handleAddToCart = () => {
    router.post(route('cart.store'), {
        product_id: product.id,
        quantity: quantity
    });
};

    const plugin = React.useRef(
        Autoplay({delay: 5000, stopOnInteraction: true})
    )

    // const handleContactSeller {
    //
    // }
    // console.log(product.images[0].url);
    console.log(images);

    const breadcrumbs = [
        { title: 'Accueil', href: '/' },
        { title: 'Produits', href: '/products' },
        { title: product.name, href: `/products/${product.slug}` },
    ];

    return (
        <AppLayout
            // breadcrumbs={breadcrumbs}
        >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 py-6 px-4">
                {/* Product Images */}
                <Card className="overflow-hidden border-0 shadow-none">
                    <CardContent className="p-0">
                        <div className='flex gap-4'>
                            <div className="flex flex-col gap-2 w-24">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`aspect-square rounded-md overflow-hidden cursor-pointer ${mainImage === image ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'}`}
                                    onClick={() => setMainImage(image)}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} - vue ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className='flex-1'>
                            <Carousel
                        // className="w-full"
                        plugins={[plugin.current]}
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                        >
                            <CarouselContent>
                                {images.map((image, index) => (
                                    <CarouselItem key={product.id}>
                                        <div className="aspect-square w-full overflow-hidden rounded-md">
                                            <img
                                                // src="http://localhost:9000/products/1748515032.jpg"
                                                src={image}
                                                // src={'/placeholder.svg'}
                                                alt={`${product.name} - image ${index + 1}`}
                                                // alt={`${product.name}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2" />
                            <CarouselNext className="right-2" />
                        </Carousel>
                        </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Product Info */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-2xl">{product.name}</CardTitle>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    Catégorie: {product.category.name}
                                    {/*Catégorie: R*/}
                                </p>
                            </div>
                            {/*{product.isPromoted && discount > 0 && (*/}
                            {/*    <Badge className="bg-red-500 hover:bg-red-600">-{discount}%</Badge>*/}
                            {/*)}*/}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center space-x-2">
                            {/*{product.discountedPrice ? (*/}
                            {/*    <>*/}
                            {/*        <span className="text-3xl font-bold">{product.discountedPrice.toFixed(2)} €</span>*/}
                            {/*        <span className="text-xl text-muted-foreground line-through">{product.price.toFixed(2)} €</span>*/}
                            {/*    </>*/}
                            {/*) : (*/}
                            <span className="text-3xl font-bold">{product.price} FCFA</span>
                            {/*)}*/}
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-medium">Description</h3>
                            <p className="text-muted-foreground">{product.description}</p>

                            <div>
                                <p className="mb-2 text-sm">
                                    Disponibilité: <span className="font-medium text-green-600">{product.quantity} en stock</span>
                                </p>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="mb-2 font-medium">Quantité</h3>
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <Input
                                        type="number"
                                        value={quantity}
                                        onChange={handleInputChange}
                                        min={1}
                                        max={product.quantity}
                                        className="w-20 text-center"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= product.quantity}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <div className="flex w-full flex-col gap-3 sm:flex-row">
                            <Button
                                className="flex-1"
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className="mr-2 h-4 w-4" /> Ajouter au panier
                            </Button>
                            <Button variant="outline" className="flex-1">
                                <Heart className="mr-2 h-4 w-4" /> Ajouter aux favoris
                            </Button>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                // Utilisez le router d'Inertia pour faire la requête POST
                                router.post(route('chat.start', { user: product.user.id }));
                            }}
                        >
                            <MessageCircle className="mr-2 h-4 w-4" /> Contacter le vendeur
                        </Button>
                    </CardFooter>
                </Card>
                <section>

                </section>
            </div>
        </AppLayout>
    );
}

export default Show;
