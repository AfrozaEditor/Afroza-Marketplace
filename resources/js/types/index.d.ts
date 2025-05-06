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
    [key: string]: unknown; // This allows for additional properties...
}

export interface Cart {
    id: number;
    user: User;
    total_price: number;
    total_quantity: number;
    created_at: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    created_at: string;
    category: Category;
    shop: Shop;
    price: number;

}

export interface Category {

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
}
