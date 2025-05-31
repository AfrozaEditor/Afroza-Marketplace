import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { Cart } from '@/types';
import CartItem from '@/components/cart/cart-item';

interface Props{
    cart: Cart;
}
function CartView({cart}:Props) {

    if (cart.items.length === 0) {
        return (
            <div className="text-center py-12">
                <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Votre panier est vide</h2>
                <p className="text-gray-600 mb-6">Parcourez nos articles et trouvez votre bonheur !</p>
                <Button asChild>
                    <Link href="">Continuer les achats</Link>
                </Button>
            </div>
        );
    }


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-6">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Votre Panier ({cart.total_quantity} articles)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {cart.items.map(item => (
                            <CartItem key={item.product.id} item={item} />
                        ))}
                    </CardContent>
                </Card>
                <Button
                    variant="outline"
                    // onClick={clearCart}
                    className="mt-6"
                >
                    Vider le panier
                </Button>
            </div>

            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Résumé de la commande</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span>Sous-total</span>
                            <span>{cart.total_price} FCFA</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Livraison</span>
                            <span>Gratuite</span> {/* Ou calculer les frais de livraison */}
                        </div>
                        <hr />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{cart.total_price} FCFA</span>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col space-y-2">
                        <Button className="w-full" size="lg" onClick={() => console.log("Proceed to checkout")}>
                            Passer la commande
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/products">Continuer les achats</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

export default CartView;
