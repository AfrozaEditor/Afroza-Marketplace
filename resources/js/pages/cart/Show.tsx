import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Cart } from '@/types';
import CartView from '@/components/cart/cart-view';

interface  Props {
    cart: Cart;
}
function Show({cart}: Props) {
    console.log(cart);
    return (
        <AppLayout>
            <div className="bg-white/20 px-4">
                <CartView cart={cart} />
            </div>
        </AppLayout>
    );
}

export default Show;
