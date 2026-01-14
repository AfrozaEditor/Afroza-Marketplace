import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, Category, type NavItem, type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Select } from '@radix-ui/react-select';
import { 
    Facebook, 
    Instagram, 
    Menu, 
    MessageCircle, 
    Moon, 
    Search, 
    ShoppingCart, 
    Sun, 
    Twitter, 
    User, 
    X,
    Heart,
    Phone,
    MapPin,
    ChevronDown,
    Sparkles,
    Store,
    Tag
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppearance } from '@/hooks/use-appearance';
import AppLogo from './app-logo';
import NotificationDropdown from './notifications/NotificationDropdown';
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
import { Badge } from './ui/badge';

const mainNavItems: NavItem[] = [
    {
        title: 'Accueil',
        href: '/',
    },
    {
        title: 'Produits',
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
    const [isScrolled, setIsScrolled] = useState(false);
    const { appearance, updateAppearance } = useAppearance();
    
    console.log(auth.user?.cart);
    const isVendor = auth.user?.role === 'vendor';
    const isCustomer = auth.user?.role === 'customer';

    // Effet de scroll pour le header sticky
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
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
        <header className={cn(
            "sticky top-0 z-50 transition-all duration-300",
            isScrolled && "shadow-lg"
        )}>
            {/* Top Bar - Info & réseaux sociaux */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hidden md:block">
                <div className="container mx-auto flex h-9 items-center justify-between px-4">
                    {/* Info gauche */}
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                            <Phone className="h-3 w-3" />
                            +237 6XX XXX XXX
                        </span>
                        <span className="text-gray-600">|</span>
                        <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                            <MapPin className="h-3 w-3" />
                            Douala, Cameroun
                        </span>
                    </div>
                    
                    {/* Actions droite */}
                    <div className="flex items-center gap-4">
                        {/* Langue */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
                                <span>🇫🇷 FR</span>
                                <ChevronDown className="h-3 w-3" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-[100px]">
                                <DropdownMenuItem>🇫🇷 Français</DropdownMenuItem>
                                <DropdownMenuItem>🇬🇧 English</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Dark mode toggle */}
                        <button
                            onClick={() => updateAppearance(appearance === 'dark' ? 'light' : 'dark')}
                            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                            title={appearance === 'dark' ? 'Mode clair' : 'Mode sombre'}
                        >
                            {appearance === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                        </button>
                        
                        <span className="text-gray-600">|</span>
                        
                        {/* Réseaux sociaux */}
                        <div className="flex items-center gap-2">
                            {[
                                { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
                                { icon: Instagram, href: 'https://instagram.com/afrozaeditor', label: 'Instagram' },
                                { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-primary transition-colors"
                                    title={social.label}
                                >
                                    <social.icon className="h-3.5 w-3.5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Section principale du header */}
            <div className={cn(
                "bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-all duration-300",
                isScrolled && "py-1"
            )}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between gap-4 py-3">
                        {/* Logo */}
                        <Link href="/" className="flex items-center flex-shrink-0 group">
                            <AppLogo />
                        </Link>

                        {/* Barre de recherche - Desktop */}
                        <div className="mx-4 hidden flex-1 max-w-2xl lg:flex">
                            <form onSubmit={handleSearch} className="w-full">
                                <div className="relative flex rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary/40 focus-within:border-primary transition-colors shadow-sm">
                                    <Select onValueChange={(value) => setSelectedSearchCategory(value)}>
                                        <SelectTrigger className="w-36 rounded-none border-0 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 text-sm focus:ring-0">
                                            <SelectValue placeholder="Catégorie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        type="text"
                                        placeholder="Rechercher des produits, marques, vendeurs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-1 border-0 bg-white dark:bg-gray-900 py-2.5 px-4 focus-visible:ring-0 text-sm"
                                    />
                                    <Button
                                        type="submit"
                                        className="rounded-none px-5 bg-primary hover:bg-primary/90"
                                        disabled={!searchQuery.trim()}
                                    >
                                        <Search className="h-4 w-4" />
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Actions droite - Desktop */}
                        <div className="hidden md:flex items-center gap-2">
                            {/* Favoris */}
                            {auth.user && (
                                <Link
                                    href="/favorites"
                                    className="relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                                    title="Mes favoris"
                                >
                                    <Heart className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors" />
                                </Link>
                            )}

                            {/* Messages */}
                            {auth.user && (
                                <Link
                                    href={route('chat.index')}
                                    className="relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                                    title="Messages"
                                >
                                    <MessageCircle className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors" />
                                </Link>
                            )}

                            {/* Notifications */}
                            {auth.user && (
                                <NotificationDropdown className="text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2.5" />
                            )}

                            {/* Panier */}
                            <Link
                                href={route('my-cart')}
                                className="relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                                title="Mon panier"
                            >
                                <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors" />
                                {(auth.user?.cart?.total_quantity ?? 0) > 0 && (
                                    <Badge className="absolute -top-0.5 -right-0.5 h-5 min-w-[20px] px-1.5 text-[10px] bg-primary border-2 border-white dark:border-gray-900">
                                        {auth.user?.cart?.total_quantity}
                                    </Badge>
                                )}
                            </Link>

                            <span className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

                            {/* Menu utilisateur ou connexion */}
                            {auth.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex items-center gap-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-sm font-medium">
                                                {auth.user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-medium hidden lg:block">{auth.user.name}</span>
                                            <ChevronDown className="h-4 w-4 text-gray-400" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <UserMenuContent user={auth.user} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link href={route('login')}>
                                        <Button variant="ghost" size="sm" className="text-sm">
                                            Connexion
                                        </Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-sm">
                                            S'inscrire
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Actions mobile */}
                        <div className="flex items-center gap-1 md:hidden">
                            {auth.user && (
                                <Link
                                    href={route('my-cart')}
                                    className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    {(auth.user?.cart?.total_quantity ?? 0) > 0 && (
                                        <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 text-[9px] bg-primary">
                                            {auth.user?.cart?.total_quantity}
                                        </Badge>
                                    )}
                                </Link>
                            )}
                            <button 
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                                onClick={toggleMenu}
                            >
                                {isMenuOpen ? (
                                    <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                                ) : (
                                    <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Barre de recherche mobile */}
                    <div className="md:hidden pb-3">
                        <form onSubmit={handleSearch}>
                            <div className="relative flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                <Input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 border-0 bg-transparent py-2 px-3 focus-visible:ring-0 text-sm"
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="rounded-none px-4 bg-primary"
                                    disabled={!searchQuery.trim()}
                                >
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Navigation principale - Desktop */}
            <div className="bg-primary hidden md:block">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        {/* Navigation */}
                        <NavigationMenu>
                            <NavigationMenuList className="gap-1">
                                {mainNavItems.map((item) => (
                                    <NavigationMenuItem key={item.title}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "px-4 py-3 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all inline-flex items-center",
                                                page.url === item.href && "bg-white/15 text-white"
                                            )}
                                        >
                                            {item.title}
                                        </Link>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>

                        {/* CTA Buttons */}
                        <div className="flex items-center gap-2 py-1.5">
                            {isVendor && (
                                <Link href={route('products.create')}>
                                    <Button size="sm" className="bg-white text-primary hover:bg-white/90 gap-1.5 text-xs font-semibold shadow-sm">
                                        <Tag className="h-3.5 w-3.5" />
                                        Vendre
                                    </Button>
                                </Link>
                            )}
                            {isCustomer && (
                                <Link href={route('products.index')}>
                                    <Button size="sm" className="bg-white/15 text-white hover:bg-white/25 gap-1.5 text-xs font-semibold border border-white/20">
                                        <Store className="h-3.5 w-3.5" />
                                        Acheter
                                    </Button>
                                </Link>
                            )}
                            {!auth.user && (
                                <Link href={route('register')}>
                                    <Button size="sm" className="bg-white text-primary hover:bg-white/90 gap-1.5 text-xs font-semibold shadow-sm">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        Commencer
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation mobile */}
            {isMenuOpen && (
                <>
                    {/* Overlay sombre */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl z-50 md:hidden animate-slide-in-left overflow-hidden">
                        {/* Header du menu */}
                        <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-4">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-white font-bold text-lg">Menu</span>
                                <button 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                                >
                                    <X className="h-5 w-5 text-white" />
                                </button>
                            </div>
                            
                            {/* User info */}
                            {auth.user ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-lg font-bold">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{auth.user.name}</p>
                                        <p className="text-white/70 text-sm">{auth.user.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Link href={route('login')} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20">
                                            Connexion
                                        </Button>
                                    </Link>
                                    <Link href={route('register')} className="flex-1">
                                        <Button size="sm" className="w-full bg-white text-primary hover:bg-white/90">
                                            S'inscrire
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Navigation links */}
                        <div className="overflow-y-auto h-[calc(100%-200px)] py-4">
                            <nav className="px-4 space-y-1">
                                {mainNavItems.map((item) => (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                                            page.url === item.href && "bg-primary/10 text-primary font-medium"
                                        )}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                            </nav>

                            {/* Separator */}
                            <div className="my-4 px-4">
                                <Separator />
                            </div>

                            {/* Quick actions */}
                            <div className="px-4 space-y-2">
                                {auth.user && (
                                    <>
                                        <Link
                                            href="/favorites"
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <Heart className="h-5 w-5" />
                                            Mes favoris
                                        </Link>
                                        <Link
                                            href={route('chat.index')}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <MessageCircle className="h-5 w-5" />
                                            Messages
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* CTA buttons */}
                            <div className="px-4 mt-4 space-y-2">
                                {isVendor && (
                                    <Link href={route('products.create')} onClick={() => setIsMenuOpen(false)}>
                                        <Button className="w-full bg-primary text-white gap-2">
                                            <Tag className="h-4 w-4" />
                                            Vendre un article
                                        </Button>
                                    </Link>
                                )}
                                {isCustomer && (
                                    <Link href={route('products.index')} onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="outline" className="w-full gap-2">
                                            <Store className="h-4 w-4" />
                                            Voir les articles
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Footer du menu mobile */}
                        <div className="absolute bottom-0 left-0 right-0 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 py-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Thème</span>
                                <button
                                    onClick={() => updateAppearance(appearance === 'dark' ? 'light' : 'dark')}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm"
                                >
                                    {appearance === 'dark' ? (
                                        <>
                                            <Sun className="h-4 w-4" />
                                            Clair
                                        </>
                                    ) : (
                                        <>
                                            <Moon className="h-4 w-4" />
                                            Sombre
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
                <>
                <div className="bg-white dark:bg-neutral-900 container mx-auto">
                    <div className="flex h-12 items-center px-4 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
                <Separator />
                </>
            )}
        </header>
    );
}
