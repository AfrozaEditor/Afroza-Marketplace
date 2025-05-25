import { Link } from '@inertiajs/react';
import React from 'react';
import { Button } from '../ui/button';
import { Minus, Plus, X } from 'lucide-react';
import { Input } from '../ui/input';
import { CartItem } from '@/types';

interface Props {
    item: CartItem
}
function CartItems({item}:Props) {
    console.log(item);

    const handleQuantityChange = (newQuantity: number) => {
        // updateQuantity(item.product.id, newQuantity);
    };

    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-4">
                <Link href="">
                    <img
                        // src={item.product.image || '/placeholder.svg'}
                        alt={item.product?.name}
                        className="w-16 h-20 object-cover rounded"
                    />
                </Link>
                <div>
                    <Link href="" className="hover:text-videdressing-primary">
                        <h3 className="font-medium text-sm md:text-base">{item.product?.name}</h3>
                    </Link>
                    {/*<p className="text-xs text-gray-500">{item.product.brand}</p>*/}
                    <p className="text-sm font-semibold text-videdressing-primary">{item.product?.price} FCFA</p>
                </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex items-center border rounded">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.quantity - 1)}
                        disabled={item.quantity <= 1}
                    >
                        <Minus size={16} />
                    </Button>
                    <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
                        className="w-12 h-8 text-center border-0 focus-visible:ring-0"
                        min="1"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.quantity + 1)}
                    >
                        <Plus size={16} />
                    </Button>
                </div>
                <p className="text-sm font-semibold w-20 text-right hidden sm:block">
                    {item.product?.price * item.quantity} FCFA
                </p>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-red-500 h-8 w-8"
                    // onClick={() => removeFromCart(item.product.id)}
                >
                    <X size={18} />
                </Button>
            </div>
        </div>
    );
}

export default CartItems;
