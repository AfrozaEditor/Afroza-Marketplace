import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Product } from '@/types';

interface Props {
    product: Product;
}

function Show({product}:Props) {

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

    return (
        <AppLayout>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Images */}
                <Card className="overflow-hidden border-0 shadow-none">
                    <CardContent className="p-0">
                        <Carousel className="w-full">
                            <CarouselContent>
                                {/*{product.images.map((image, index) => (*/}
                                {/*    <CarouselItem key={index}>*/}
                                {/*        <div className="aspect-square w-full overflow-hidden rounded-md">*/}
                                {/*            <img*/}
                                {/*                src={image || '/placeholder.svg'}*/}
                                {/*                alt={`${product.name} - image ${index + 1}`}*/}
                                {/*                className="object-cover w-full h-full"*/}
                                {/*            />*/}
                                {/*        </div>*/}
                                {/*    </CarouselItem>*/}
                                {/*))}*/}
                            </CarouselContent>
                            <CarouselPrevious className="left-2" />
                            <CarouselNext className="right-2" />
                        </Carousel>
                    </CardContent>
                </Card>

                {/* Product Info */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl">{product.name}</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {/*Catégorie: {product.category}*/}
                                    Catégorie: R
                                </p>
                            </div>
                            {/*{product.isPromoted && discount > 0 && (*/}
                            {/*    <Badge className="bg-red-500 hover:bg-red-600">-{discount}%</Badge>*/}
                            {/*)}*/}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 mb-4">
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
                                <p className="text-sm mb-2">
                                    Disponibilité: <span className="text-green-600 font-medium">{product.quantity} en stock</span>
                                </p>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-medium mb-2">Quantité</h3>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                    >
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
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <Button
                                className="flex-1"
                                // onClick={handleAddToCart}
                            >
                                <ShoppingCart className="mr-2 h-4 w-4" /> Ajouter au panier
                            </Button>
                            <Button variant="outline" className="flex-1">
                                <Heart className="mr-2 h-4 w-4" /> Ajouter aux favoris
                            </Button>
                        </div>
                        <Button
                            variant="secondary"
                            className="w-full"
                            // onClick={handleContactSeller}
                        >
                            <MessageCircle className="mr-2 h-4 w-4" /> Contacter le vendeur
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}

export default Show;
