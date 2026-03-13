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
    images: Image[] | string[];
    reviews: ProductReview[];
    reviews_avg_rating?: number | string | null;
    reviews_count?: number | string | null;
    is_favorite?: boolean;
    user_review?: ProductReview | null;
}

export interface Image {
    id: number;
    url: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: string;
    image?: string;
    description?: string;
    parent_id?: number | null;
    parent?: Category;
    children?: Category[];
}

export interface Shop {
    id: number;
    name: string;
    user: User;
    slug: string;
    description: string;
    active: boolean;
    products: Product[];
    products_count?: number;
    created_at: string;
    logo: string;
    logo_url?: string;
    cover_image: string;
    cover_url?: string;
    address?: string;
    city?: string;
    phone?: string;
    email?: string;
    website?: string;
    facebook?: string;
    instagram?: string;
    followers: User[];
    reviews: ShopReview[];
    user_review?: ShopReview | null;
    is_approved?: boolean;
}

export interface Message {
  id: number;
  content: string;
  created_at: string;
  user: User;
  is_mine: boolean;
  conversation_id?: number;
}

export interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string;
    category: string | null;
    tags: string[];
    status: string;
    read_time: number;
    featured: boolean;
    views: number;
    published_at: string;
    author?: User;
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
    reviewer_name: string;
    reviewer_email: string;
    title: string;
    rating: number;
    comment: string;
    is_approved: boolean;
    created_at: string;
    helpful: number;
    not_helpful: number;
}

export interface ShopReviewVote {
    id: number;
    user: User;
    shop_review: ShopReview;
    is_helpful: boolean;
    created_at: string;
}

export interface ProductReview {
    id: number;
    product: Product;
    user: User;
    reviewer_name: string;
    reviewer_email: string;
    title: string;
    rating: number;
    comment: string;
    is_approved: boolean;
    created_at: string;
    helpful: number;
    not_helpful: number;
}

export interface Order {
    id: number;
    order_number: string;
    user_id: number;
    user?: User;
    delivery_id?: number;
    delivery?: Delivery;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded';
    total: number;
    delivery_address: string;
    delivery_city: string;
    delivery_region: string;
    delivery_postal_code?: string;
    delivery_address_latitude?: number;
    delivery_address_longitude?: number;
    shipping_method: 'standard' | 'express' | 'pickup';
    shipping_cost: number;
    payment_method: 'card' | 'mobile_money' | 'cash_on_delivery' | 'bank_transfer';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    payment_reference?: string;
    paid_at?: string;
    notes?: string;
    tracking_number?: string;
    shipped_at?: string;
    delivered_at?: string;
    cancelled_at?: string;
    cancellation_reason?: string;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product: Product;
    quantity: number;
    price: number;
}

export interface Delivery {
    id: number;
    user_id: number;
    user?: User;
    vehicle_type: string;
    license_plate?: string;
    is_available: boolean;
    current_latitude?: number;
    current_longitude?: number;
    created_at: string;
}
