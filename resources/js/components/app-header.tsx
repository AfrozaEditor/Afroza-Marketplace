import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, Category, type NavItem, type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Select } from '@radix-ui/react-select';
import { Bell, Facebook, Instagram, Menu, MessageCircle, Search, ShoppingCart, Twitter, User, X } from 'lucide-react';
import { useState } from 'react';
import AppLogo from './app-logo';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';

const mainNavItems: NavItem[] = [
    {
        title: 'Accueil',
        href: '/',
    },
    // {
    //     title: 'Boutique',
    //     href: '/products',
    // },
    {
        title: 'Disponibles',
        href: '/products',
    },
    {
        title: 'Promotions',
        href: '/promotions',
    },
    {
        title: 'Fonctionnalités',
        href: '/features',
    },
    {
        title: 'Blog',
        href: '/blog',
    },
    {
        title: 'Marketplace',
        href: '/marketplace',
    },
];

// const rightNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
    categories: Category[];
}

export function AppHeader({ breadcrumbs = [], categories = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // const getInitials = useInitials();
    // console.log(categories[0].name);
    console.log(auth.user?.cart);
    // console.log(auth.user.role);
    const isVendor = auth.user?.role === 'vendor';
    const isCustomer = auth.user?.role === 'customer';

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // const handleSearch = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (searchQuery.trim()) {
    //         router.get(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    //         setSearchQuery('');
    //     }
    // };
    const [selectedSearchCategory, setSelectedSearchCategory] = useState('');

    // Modifiez la fonction handleSearch
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();

        if (searchQuery.trim()) {
            params.set('search', searchQuery.trim());
        }

        if (selectedSearchCategory) {
            params.set('category', selectedSearchCategory);
        }

        router.get(
            `/products?${params.toString()}`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
        setSearchQuery('');
    };

    return (
        <header className="sticky top-0 z-10">
            {/* Barre de réseaux sociaux */}
            <div className="bg-primary hidden md:block">
                <div className="container mx-auto flex h-10 items-center justify-between px-4">
                    <div>
                        <Button className="p-0">
                            <span className="mr-1 text-sm">Français</span>
                            <span className="text-xs">▼</span>
                        </Button>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Menu utilisateur */}
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2 text-white">
                                        <User className="h-5 w-5" />
                                        <span>{auth.user.name}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            // <UserMenu user={auth.user} />
                            // <Button size="icon" asChild className="text-white gap-1 bg-primary flex items-center justify-center hover:text-gray-600 hover:bg-teal-600">
                            <Link href={route('login')} className="flex size-15 items-center justify-center gap-2 text-sm text-white">
                                <User className="h-5 w-5" />
                                <span>Profil</span>
                            </Link>
                        )}
                        {/*<Link href="" className="relative flex items-center text-sm text-white transition-colors hover:text-teal-200">*/}
                        {/*    <Bell size={16} className="mr-1" />*/}
                        {/*    <span className="absolute -top-1 -right-1 flex h-2 w-2 items-center justify-center rounded-full bg-red-500 text-sm text-white"></span>*/}
                        {/*</Link>*/}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="relative p-2 text-white hover:bg-transparent hover:text-gray-200">
                                    <Bell size={16} />
                                    {/*{unreadCount > 0 && (*/}
                                    {/*    <Badge*/}
                                    {/*        variant="destructive"*/}
                                    {/*        className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center px-1.5 py-0.5 text-xs"*/}
                                    {/*    >*/}
                                    {/*        {unreadCount}*/}
                                    {/*    </Badge>*/}
                                    {/*)}*/}
                                </Button>
                            </DropdownMenuTrigger>
                            {/*<DropdownMenuContent align="end" className="w-80 border bg-white shadow-lg">*/}
                            {/*    <DropdownMenuLabel>Notifications</DropdownMenuLabel>*/}
                            {/*    <DropdownMenuSeparator />*/}
                            {/*    {auth.user && auth.user.notifications.length > 0 ? (*/}
                            {/*        auth.user.notifications.map((notification) => (*/}
                            {/*            <DropdownMenuItem*/}
                            {/*                key={notification.id}*/}
                            {/*                className="flex cursor-pointer flex-col items-start p-4 hover:bg-gray-50"*/}
                            {/*            >*/}
                            {/*                <div className="flex w-full items-start justify-between">*/}
                            {/*                    <div className="flex-1">*/}
                            {/*                        <div className="flex items-center gap-2">*/}
                            {/*                            <h4 className="text-sm font-medium">{notification.title}</h4>*/}
                            {/*                            {notification.unread && <div className="h-2 w-2 rounded-full bg-blue-500"></div>}*/}
                            {/*                        </div>*/}
                            {/*                        <p className="mt-1 text-sm text-gray-600">{notification.content}</p>*/}
                            {/*                        <span className="mt-2 text-xs text-gray-400">{notification.time}</span>*/}
                            {/*                    </div>*/}
                            {/*                </div>*/}
                            {/*            </DropdownMenuItem>*/}
                            {/*        ))*/}
                            {/*    ) : (*/}
                            {/*        <DropdownMenuItem className="py-4 text-center text-gray-500">Aucune notification</DropdownMenuItem>*/}
                            {/*    )}*/}
                            {/*    <DropdownMenuSeparator />*/}
                            {/*    <DropdownMenuItem className="cursor-pointer py-2 text-center text-blue-600 hover:text-blue-800">*/}
                            {/*        Voir toutes les notifications*/}
                            {/*    </DropdownMenuItem>*/}
                            {/*</DropdownMenuContent>*/}
                        </DropdownMenu>
                        <Link href={route('chat.index')} className="flex items-center text-sm text-white transition-colors hover:text-teal-200">
                            <MessageCircle size={16} className="mr-1" />
                            {/*<span>chat</span>*/}
                        </Link>
                        <div className="flex items-center justify-center gap-4">
                            <Link
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white transition-colors hover:text-gray-200"
                            >
                                <Facebook className="h-4 w-4" />
                                {/*<span className="sr-only">Facebook</span>*/}
                            </Link>
                            <Link
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white transition-colors hover:text-gray-200"
                            >
                                <Instagram className="h-4 w-4" />
                                {/*<span className="sr-only">Instagram</span>*/}
                            </Link>
                            <Link
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white transition-colors hover:text-gray-200"
                            >
                                <Twitter className="h-4 w-4" />
                            </Link>
                        </div>

                        {/* Panier */}
                        {/*<Button size="icon" asChild className="text-white bg-primary gap-1 hover:bg-teal-600">*/}
                        <Link href={route('my-cart')} className="flex items-center justify-center text-white">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="ml-1 flex items-center justify-center rounded-full bg-orange-400 px-1.5 py-0.5 text-xs font-bold">
                                {auth.user?.cart?.total_quantity ?? 0}
                            </span>
                            <span className="ml-2 text-sm">{auth.user?.cart?.total_price ? `${auth.user.cart.total_price} FCFA` : '0 FCFA'}</span>
                        </Link>
                        {/*</Button>*/}
                    </div>
                </div>
            </div>
            <Separator />
            <div className="bg-primary border-b border-gray-200">
                <div
                    // className="mx-auto flex h-16 items-center justify-between px-4 md:max-w-7xl"
                    className="container mx-auto px-4"
                >
                    <div className="flex items-center justify-between gap-4 py-3">
                        {/* Logo */}
                        <Link href="/" className="flex items-center">
                            <AppLogo />
                        </Link>

                        {/* Barre de recherche - Desktop */}
                        <div className="mx-8 hidden max-w-2xl flex-1 md:flex">
                            <form onSubmit={handleSearch} className="w-full">
                                <div className="relative flex">
                                    <Select onValueChange={(value) => setSelectedSearchCategory(value)}>
                                        <SelectTrigger className="w-40 rounded-l-md rounded-r-none border-r bg-white px-4 py-2 text-gray-800 focus:outline-none">
                                            <SelectValue placeholder="Catégorie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* <SelectItem value="">Toutes les catégories</SelectItem> */}
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                            {/* <SelectItem key={1} value='essai'>
                                                Essai
                                            </SelectItem> */}
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        type="text"
                                        placeholder="Rechercher des produits, marques, vendeurs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-l-none border-0 bg-gray-50 py-3 pr-24 transition-colors focus:bg-white"
                                    />
                                    <Button
                                        type="submit"
                                        size="sm"
                                        className="bg-primary hover:bg-primary/80 absolute top-1/2 right-2 h-8 -translate-y-1/2 transform px-4 py-1.5"
                                        disabled={!searchQuery.trim()}
                                    >
                                        <Search size={18} />
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Menu mobile: icône panier + burger */}
                        <div className="flex items-center space-x-3 md:hidden">
                            {/*<Link href="/panier" className="relative text-videdressing-primary p-2 hover:bg-gray-100 rounded-lg transition-colors">*/}
                            {/*    <ShoppingCart size={22} />*/}
                            {/*    /!*{itemCount > 0 && (*!/*/}
                            {/*    /!*    <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs h-4 min-w-[1rem] flex items-center justify-center">*!/*/}
                            {/*    /!*        {itemCount}*!/*/}
                            {/*    /!*    </Badge>*!/*/}
                            {/*    /!*)}*!/*/}
                            {/*</Link>*/}
                            <Button variant="ghost" className="flex text-white hover:bg-gray-100" onClick={toggleMenu}>
                                {isMenuOpen ? <X size={22} /> : <Menu className='h-10 w-10'/>}
                            </Button>
                        </div>

                        {/* Actions Desktop à droite */}
                        <div className="hidden items-center space-x-4 md:flex">
                            {/*Button de connexion/inscription*/}
                            {!auth.user && (
                                <Button
                                    className="bg-white text-teal-600 hover:bg-white/80"
                                    // disabled={!!auth.user}
                                >
                                    <Link href={route('register')}>
                                        <span>S'inscrire</span>
                                    </Link>
                                </Button>
                            )}
                            {isVendor && (
                                <Button
                                    className="bg-white text-teal-600 hover:bg-white/80"
                                    // disabled={!isVendor}
                                >
                                    <Link href={route('products.create')}>
                                        <span>Vends tes articles</span>
                                    </Link>
                                </Button>
                            )}
                            {/*/!* Barre de recherche *!/*/}
                            {/*<Button variant="ghost" size="icon" className="hidden md:flex">*/}
                            {/*    <Search className="h-5 w-5" />*/}
                            {/*</Button>*/}
                            {isCustomer && (
                                <Button
                                    className="bg-white text-teal-600 hover:bg-white/80"
                                    // disabled={!isVendor}
                                >
                                    <Link href={route('products.index')}>
                                        <span>Achète des articles</span>
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                    <Separator />

                    {/* Navigation principale - Desktop */}
                    <div className="hidden items-center justify-center space-x-8 py-1 md:flex">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {mainNavItems.map((item) => (
                                    <NavigationMenuItem key={item.title}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                'bg-primary text-[16px] text-white hover:text-white/80',
                                                page.url === item.href,
                                            )}
                                        >
                                            {item.title}
                                        </Link>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>
            </div>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
                <div className="border-b border-gray-200 bg-white">
                    <div className="mx-auto flex h-12 items-center px-4 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </header>
    );
}
