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
    Tag,
    ListOrdered,
    LayoutDashboard,
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
        <header className={cn('sticky top-0 z-50 transition-all duration-300', isScrolled && 'shadow-lg')}>
            {/* Top Bar - Info & réseaux sociaux */}
            <div className="hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 md:block">
                <div className="container mx-auto flex h-9 items-center justify-between px-4">
                    {/* Info gauche */}
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1.5 transition-colors hover:text-white">
                            <Phone className="h-3 w-3" />
                            +237 6XX XXX XXX
                        </span>
                        <span className="text-gray-600">|</span>
                        <span className="flex items-center gap-1.5 transition-colors hover:text-white">
                            <MapPin className="h-3 w-3" />
                            Yaoundé, Cameroun
                        </span>
                    </div>

                    {/* Actions droite */}
                    <div className="flex items-center gap-4">
                        {/* Langue */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-white">
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
                            className="rounded-full p-1 text-gray-400 transition-all hover:bg-white/10 hover:text-white"
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
                                    className="hover:text-primary text-gray-400 transition-colors"
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
            <div
                className={cn(
                    'border-b border-gray-100 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-900',
                    isScrolled && 'py-1',
                )}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between gap-4 py-3">
                        {/* Logo */}
                        <Link href="/" className="group flex flex-shrink-0 items-center">
                            <AppLogo />
                        </Link>

                        {/* Barre de recherche - Desktop */}
                        <div className="mx-4 hidden max-w-2xl flex-1 lg:flex">
                            <form onSubmit={handleSearch} className="w-full">
                                <div className="border-primary/20 hover:border-primary/40 focus-within:border-primary relative flex overflow-hidden rounded-full border-2 shadow-sm transition-colors">
                                    <Select onValueChange={(value) => setSelectedSearchCategory(value)}>
                                        <SelectTrigger className="w-36 rounded-none border-0 border-r border-gray-200 bg-gray-50 px-3 text-sm focus:ring-0 dark:border-gray-700 dark:bg-gray-800">
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
                                        className="flex-1 border-0 bg-white px-4 py-2.5 text-sm focus-visible:ring-0 dark:bg-gray-900"
                                    />
                                    <Button type="submit" className="bg-primary hover:bg-primary/90 rounded-none px-5" disabled={!searchQuery.trim()}>
                                        <Search className="h-4 w-4" />
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Actions droite - Desktop */}
                        <div className="hidden items-center gap-2 md:flex">
                            {/* Favoris */}
                            {auth.user && (
                                <Link
                                    href="/favorites"
                                    className="group relative rounded-full p-2.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                                    title="Mes favoris"
                                >
                                    <Heart className="group-hover:text-primary h-5 w-5 text-gray-600 transition-colors dark:text-gray-400" />
                                </Link>
                            )}

                            {/* Messages */}
                            {auth.user && (
                                <Link
                                    href={route('chat.index')}
                                    className="group relative rounded-full p-2.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                                    title="Messages"
                                >
                                    <MessageCircle className="group-hover:text-primary h-5 w-5 text-gray-600 transition-colors dark:text-gray-400" />
                                </Link>
                            )}

                            {/* Notifications */}
                            {auth.user && (
                                <NotificationDropdown className="hover:text-primary rounded-full p-2.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" />
                            )}

                            {/* Panier */}
                            <Link
                                href={route('my-cart')}
                                className="group relative rounded-full p-2.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                                title="Mon panier"
                            >
                                <ShoppingCart className="group-hover:text-primary h-5 w-5 text-gray-600 transition-colors dark:text-gray-400" />
                                {(auth.user?.cart?.total_quantity ?? 0) > 0 && (
                                    <span className="flex items-center bg-primary text-white font-bold absolute -top-0.5 -right-0.5 h-5 min-w-5 rounded-full border-2 border-white px-1.5 text-[10px] dark:border-gray-900">
                                        {auth.user?.cart?.total_quantity}
                                    </span>
                                )}
                            </Link>

                            <span className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />

                            {/* Menu utilisateur ou connexion */}
                            {auth.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex items-center gap-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <div className="from-primary to-primary/60 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-sm font-medium text-white">
                                                {auth.user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="hidden text-sm font-medium lg:block">{auth.user.name}</span>
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
                            {/* Notifications */}
                            {auth.user && (
                                <NotificationDropdown className="hover:text-primary rounded-full p-2.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" />
                            )}
                            {auth.user && (
                                <Link href={route('my-cart')} className="relative rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    {(auth.user?.cart?.total_quantity ?? 0) > 0 && (
                                        <span className="flex items-center text-white font-bold bg-primary absolute -top-0.5 -right-0.5 h-4 min-w-[16px] rounded-full px-1.5 text-[10px]">
                                            {auth.user?.cart?.total_quantity}
                                        </span>
                                    )}
                                </Link>
                            )}
                            <button className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800" onClick={toggleMenu}>
                                {isMenuOpen ? (
                                    <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                                ) : (
                                    <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Barre de recherche mobile */}
                    <div className="pb-3 md:hidden">
                        <form onSubmit={handleSearch}>
                            <div className="relative flex overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                <Input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 border-0 bg-transparent px-3 py-2 text-sm focus-visible:ring-0"
                                />
                                <Button type="submit" size="sm" className="bg-primary rounded-none px-4" disabled={!searchQuery.trim()}>
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
                                                'inline-flex items-center px-4 py-3 text-sm font-medium text-white/90 transition-all hover:bg-white/10 hover:text-white',
                                                page.url === item.href && 'bg-white/15 text-white',
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
                                    <Button size="sm" className="text-primary gap-1.5 bg-white text-xs font-semibold shadow-sm hover:bg-white/90">
                                        <Tag className="h-3.5 w-3.5" />
                                        Vendre
                                    </Button>
                                </Link>
                            )}
                            {isCustomer && (
                                <Link href={route('products.index')}>
                                    <Button
                                        size="sm"
                                        className="gap-1.5 border border-white/20 bg-white/15 text-xs font-semibold text-white hover:bg-white/25"
                                    >
                                        <Store className="h-3.5 w-3.5" />
                                        Acheter
                                    </Button>
                                </Link>
                            )}
                            {!auth.user && (
                                <Link href={route('register')}>
                                    <Button size="sm" className="text-primary gap-1.5 bg-white text-xs font-semibold shadow-sm hover:bg-white/90">
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
                    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setIsMenuOpen(false)} />
                    <div className="animate-slide-in-left fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] overflow-hidden bg-white shadow-2xl md:hidden dark:bg-gray-900">
                        {/* Header du menu */}
                        <div className="from-primary to-primary/80 bg-gradient-to-r px-4 py-4">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-lg font-bold text-white">Menu</span>
                                <button onClick={() => setIsMenuOpen(false)} className="rounded-full p-1.5 transition-colors hover:bg-white/20">
                                    <X className="h-5 w-5 text-white" />
                                </button>
                            </div>

                            {/* User info */}
                            {auth.user ? (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{auth.user.name}</p>
                                        <p className="text-sm text-white/70">{auth.user.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Link href={route('login')} className="flex-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20"
                                        >
                                            Connexion
                                        </Button>
                                    </Link>
                                    <Link href={route('register')} className="flex-1">
                                        <Button size="sm" className="text-primary w-full bg-white hover:bg-white/90">
                                            S'inscrire
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Navigation links */}
                        <div className="h-[calc(100%-200px)] overflow-y-auto py-4">
                            <nav className="space-y-1 px-4">
                                {mainNavItems.map((item) => (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                                            page.url === item.href && 'bg-primary/10 text-primary font-medium',
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
                            <div className="space-y-2 px-4">
                                {auth.user && (
                                    <>
                                        <Link
                                            href="/settings/profile"
                                            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <User className="h-5 w-5" />
                                            Mon profil
                                        </Link>
                                        <Link
                                            href="/settings/profile"
                                            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <LayoutDashboard className="h-5 w-5" />
                                            Tableau de bord
                                        </Link>
                                        <Link
                                            href="/favorites"
                                            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <Heart className="h-5 w-5" />
                                            Mes favoris
                                        </Link>
                                        <Link
                                            href={route('order.index')}
                                            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <ListOrdered className="h-5 w-5" />
                                            Mes commandes
                                        </Link>
                                        <Link
                                            href={route('chat.index')}
                                            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <MessageCircle className="h-5 w-5" />
                                            Messages
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* CTA buttons */}
                            <div className="mt-4 space-y-2 px-4">
                                {isVendor && (
                                    <Link href={route('products.create')} onClick={() => setIsMenuOpen(false)}>
                                        <Button className="bg-primary w-full gap-2 text-white">
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
                        <div className="absolute right-0 bottom-0 left-0 border-t bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Thème</span>
                                <button
                                    onClick={() => updateAppearance(appearance === 'dark' ? 'light' : 'dark')}
                                    className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm dark:bg-gray-800"
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
                    <div className="container mx-auto bg-white dark:bg-neutral-900">
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
