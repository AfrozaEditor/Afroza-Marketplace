import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { cn } from '@/lib/utils';
import { Category, type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Bell, Facebook, Instagram, Menu, MessageCircle, Search, ShoppingCart, Twitter, User, X } from 'lucide-react';
import AppLogo from './app-logo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Separator } from './ui/separator';
import { useState } from 'react';
import { Input } from './ui/input';
import { UserMenu } from '@/components/user-menu';
import { Select } from '@radix-ui/react-select';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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

export function AppHeader({ breadcrumbs = [], categories = []}: AppHeaderProps) {
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    return (
        <header className="sticky top-0 z-10">
            {/* Barre de réseaux sociaux */}
            <div className="bg-primary hidden md:block">
                <div className="mx-auto flex h-10 items-center justify-between px-4 md:max-w-7xl">
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
                        <Link href="" className="relative flex items-center text-sm text-white transition-colors hover:text-teal-200">
                            <Bell size={16} className="mr-1" />
                            <span className="absolute -top-1 -right-1 flex h-2 w-2 items-center justify-center rounded-full bg-red-500 text-sm text-white"></span>
                        </Link>
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
                    <div className="flex items-center justify-between py-3 gap-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center">
                            <AppLogo />
                        </Link>

                        {/* Barre de recherche - Desktop */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                            <form onSubmit={handleSearch} className="w-full">
                                <div className="relative flex">
                                    <Select
                                    >
                                        <SelectTrigger 
              className="bg-white text-gray-800 px-4 py-2 rounded-l-md rounded-r-none border-r focus:outline-none w-40"
                                        
                                        >
                                            <SelectValue placeholder="Catégorie" />
                                        </SelectTrigger>
                                        <SelectContent 
                                            // className="bg-white text-gray-800 px-4 py-2 rounded-l-md border-r focus:outline-none w-40"
                                        >
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.name}>
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
                                        className="pr-24 py-3 w-full border-0 rounded-l-none bg-gray-50 focus:bg-white transition-colors"
                                    />
                                    <Button
                                        type="submit"
                                        size="sm"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 h-8 bg-primary hover:bg-primary/80"
                                        disabled={!searchQuery.trim()}
                                    >
                                        <Search size={18} />
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Menu mobile: icône panier + burger */}
                        <div className="md:hidden flex items-center space-x-3">
                            {/*<Link href="/panier" className="relative text-videdressing-primary p-2 hover:bg-gray-100 rounded-lg transition-colors">*/}
                            {/*    <ShoppingCart size={22} />*/}
                            {/*    /!*{itemCount > 0 && (*!/*/}
                            {/*    /!*    <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs h-4 min-w-[1rem] flex items-center justify-center">*!/*/}
                            {/*    /!*        {itemCount}*!/*/}
                            {/*    /!*    </Badge>*!/*/}
                            {/*    /!*)}*!/*/}
                            {/*</Link>*/}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-gray-100"
                                onClick={toggleMenu}
                            >
                                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                            </Button>
                        </div>

                        {/* Actions Desktop à droite */}
                        <div className="hidden md:flex items-center space-x-4">
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
                                                'bg-primary text-white text-[16px] hover:text-white/80',
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
