import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Facebook,
    Instagram,
    ShoppingCart,
    Twitter,
    User,
    Bell, MessageCircle
} from 'lucide-react';
import AppLogo from './app-logo';
import { Separator } from './ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import { UserMenu } from '@/components/user-menu';

const mainNavItems: NavItem[] = [
    {
        title: 'Accueil',
        href: '/',
    },
    {
        title: 'Boutique',
        href: '/products',
    },
    {
        title: 'Disponibles',
        href: '/available',
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
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    // const getInitials = useInitials();
    console.log(auth.user?.cart?.total_quantity);
    // console.log(auth.user.role);
    return (
        <header className="sticky top-0 z-10">
            {/* Barre de réseaux sociaux */}
            <div className="bg-primary">
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
                            // <UserMenu user={auth.user} />
                        ) : (
                            // <Button size="icon" asChild className="text-white gap-1 bg-primary flex items-center justify-center hover:text-gray-600 hover:bg-teal-600">
                                <Link href={route('login')} className="flex text-white items-center justify-center gap-2 text-sm size-15">
                                    <User className="h-5 w-5" />
                                    <span>Profil</span>
                                </Link>
                        )}
                        <Link href="" className="flex items-center relative text-white text-sm hover:text-teal-200 transition-colors">
                            <Bell size={16} className="mr-1" />
                            <span className="absolute -top-1 -right-1 flex h-2 w-2 items-center justify-center rounded-full bg-red-500 text-sm text-white">
                            </span>
                        </Link>
                        <Link href={route('chat.index')} className="flex items-center text-white text-sm hover:text-teal-200 transition-colors">
                            <MessageCircle size={16} className="mr-1" />
                            {/*<span>chat</span>*/}
                        </Link>
                        <div className="flex justify-center items-center gap-4">
                            <Link
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                <Facebook className="h-4 w-4" />
                                {/*<span className="sr-only">Facebook</span>*/}
                            </Link>
                            <Link
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                <Instagram className="h-4 w-4" />
                                {/*<span className="sr-only">Instagram</span>*/}
                            </Link>
                            <Link
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                <Twitter className="h-4 w-4"/>
                            </Link>
                        </div>

                        {/* Panier */}
                        {/*<Button size="icon" asChild className="text-white bg-primary gap-1 hover:bg-teal-600">*/}
                            <Link href={route('my-cart')} className="flex text-white items-center justify-center">
                                <ShoppingCart className="h-5 w-5" />
                                <span className="rounded-full bg-orange-400 px-1.5 py-0.5 text-xs ml-1 font-bold">
                                   {auth.user?.cart?.total_quantity ?? 0}
                                </span>
                                <span className="ml-2 text-sm">
                                    {auth.user?.cart?.total_price ? `${auth.user.cart.total_price} FCFA` : '0 FCFA'}
                                </span>
                            </Link>
                        {/*</Button>*/}
                    </div>
                </div>
            </div>
            <Separator/>
            <div className="border-b border-gray-200 bg-primary">
                <div className="mx-auto flex h-16 items-center justify-between px-4 md:max-w-7xl">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <AppLogo/>
                    </Link>

                    {/* Navigation principale - Desktop */}
                    <div className="hidden md:flex items-center space-x-6">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {mainNavItems.map((item) => (
                                    <NavigationMenuItem key={item.title}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                "bg-primary text-white hover:text-white/80",
                                                page.url === item.href
                                            )}
                                        >
                                            {item.title}
                                        </Link>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Actions à droite */}
                    <div className="flex items-center space-x-4">
                        {/*Button de connexion/inscription*/}
                        <Button className="text-teal-600 bg-white hover:bg-white/80" disabled={!!auth.user}>
                            <Link href={route('register')}>
                                <span>Se connecter</span>
                            </Link>
                        </Button>
                        <Button className="text-teal-600 bg-white hover:bg-white/80" disabled>
                            <Link href={route('marketplace.create')}>
                                <span>Vends tes articles</span>
                            </Link>
                        </Button>
                        {/*/!* Barre de recherche *!/*/}
                        {/*<Button variant="ghost" size="icon" className="hidden md:flex">*/}
                        {/*    <Search className="h-5 w-5" />*/}
                        {/*</Button>*/}

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
