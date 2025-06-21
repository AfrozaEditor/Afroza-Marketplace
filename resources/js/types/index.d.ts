import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    cart?: Cart;
    role: string;
    notifications?: Notification[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface Cart {
    id: number;
    user: User;
    total_price: number;
    total_quantity: number;
    created_at: string;
    items: CartItem[];
}

export interface CartItem {
    id: number;
    cart: Cart;
    product: Product;
    quantity: number;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    created_at: string;
    category: Category;
    user: User;
    shop: Shop;
    price: number;
    quantity: number;
    images: string[];

}

export interface Image {
    id: number;
    url: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    parent: Category;
}

export interface Shop {
    id: number;
    name: string;
    user: User;
    slug: string;
    description: string;
    active: boolean;
    products: Product[];
    created_at: string;
    logo: string;
    cover_image: string;
    followers: User[];
    reviews: ShopReview[];
}

export interface Message {
  id: number;
  content: string;
  created_at: string;
  user: User;
  is_mine: boolean;
}

export interface Notification {
    id: number;
    content: string;
    title: string;
    time: number;
    message: string;
    unread: boolean;
}

export interface ShopReview {
    id: number;
    shop: Shop;
    user: User;
    title: string;
    rating: number;
    comment: string;
    is_approved: boolean;
    created_at: string;
    helpful: number;
    notHelpful: number;
}
