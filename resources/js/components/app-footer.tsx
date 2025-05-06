import React from 'react';
import { NavItem } from '@/types';
import AppLogo from './app-logo';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Link } from '@inertiajs/react';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';


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
        title: 'Blog',
        href: '/categories',
    },
    {
        title: 'Marketplace',
        href: '/categories',
    },
]

const helpNavItems: NavItem[] = [
    {
        title: 'Centre d\'Aide',
        href: '/',
    },
    {
        title: 'A Propos',
        href: '/products',
    },
    {
        title: 'Contact',
        href: '/categories',
    },
]

const legalNavItems: NavItem[] = [
    {
        title: 'Conditions Générales',
        href: '/',
    },
    {
        title: 'Politique de Confidentialité',
        href: '/products',
    },
]

function AppFooter() {
    return (
        <footer className="bg-gray-800 pt-12 pb-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    <div>
                        <Link href="#" className="mb-4 flex items-center">
                            <AppLogo/>
                        </Link>
                        <p className="text-gray-400 mb-4">
                            La plateforme qui vous permet de donner une seconde vie à vos vêtements.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>

                    {/*<div>*/}
                    {/*    <ul className="space-y-2">*/}
                    {/*        <li>*/}
                    {/*            <Link to="/" className="text-gray-400 hover:text-white transition-colors">*/}
                    {/*                {t('nav.home')}*/}
                    {/*            </Link>*/}
                    {/*        </li>*/}
                    {/*        <li>*/}
                    {/*            <Link to="/shop" className="text-gray-400 hover:text-white transition-colors">*/}
                    {/*                {t('nav.shop')}*/}
                    {/*            </Link>*/}
                    {/*        </li>*/}
                    {/*        <li>*/}
                    {/*            <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">*/}
                    {/*                {t('nav.blog')}*/}
                    {/*            </Link>*/}
                    {/*        </li>*/}
                    {/*        <li>*/}
                    {/*            <Link to="/marketplace" className="text-gray-400 hover:text-white transition-colors">*/}
                    {/*                {t('nav.marketplace')}*/}
                    {/*            </Link>*/}
                    {/*        </li>*/}
                    {/*    </ul>*/}
                    {/*</div>*/}

                    <div>
                        <h3 className="text-lg text-white font-semibold mb-4">Liens Rapides</h3>
                        <NavigationMenu>
                            <NavigationMenuList className="grid grid-cols-1">
                                {mainNavItems.map((item) => (
                                    <NavigationMenuItem key={item.title}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                "bg-gray-800 p-0 text-gray-400 hover:bg-gray-800 hover:text-white",
                                                // page.url === item.href
                                            )}
                                        >
                                            {item.title}
                                        </Link>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                    <div >
                    <h3 className="text-lg text-white font-semibold mb-4">Aide</h3>
                    <NavigationMenu>
                        <NavigationMenuList className="grid grid-cols-1">
                            {helpNavItems.map((item) => (
                                <NavigationMenuItem key={item.title}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            "bg-gray-800 p-0 text-gray-400 hover:bg-gray-800 hover:text-white",
                                            // page.url === item.href
                                        )}
                                    >
                                        {item.title}
                                    </Link>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                    <div className="">
                    <h3 className="text-lg text-white font-semibold mb-4">Légal</h3>
                    <NavigationMenu>
                        <NavigationMenuList className="grid grid-cols-1">
                            {legalNavItems.map((item) => (
                                <NavigationMenuItem key={item.title}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            "bg-gray-800 p-0 text-gray-400 hover:bg-gray-800 hover:text-white",
                                            // page.url === item.href
                                        )}
                                    >
                                        {item.title}
                                    </Link>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                    {/*<div>*/}
                    {/*    <h3 className="text-lg font-semibold mb-4">Aide</h3>*/}
                    {/*    <ul className="space-y-2">*/}
                    {/*        <li>*/}
                    {/*            <Link to="/help" className="text-gray-400 hover:text-white transition-colors">*/}
                    {/*                {t('footer.help')}*/}
                    {/*            </Link>*/}
                    {/*        </li>*/}
                    {/*        <li>*/}
                    {/*            <Link to="/about" className="text-gray-400 hover:text-white transition-colors">*/}
                    {/*                {t('footer.about')}*/}
                    {/*            </Link>*/}
                    {/*        </li>*/}
                    {/*        <li>*/}
                    {/*            <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">*/}
                    {/*                {t('footer.contact')}*/}
                    {/*            </Link>*/}
                    {/*        </li>*/}
                    {/*    </ul>*/}
                    {/*</div>*/}

                    {/*<div>*/}
                    {/*    <h3 className="text-lg font-semibold mb-4">Légal</h3>*/}
                    {/*    <ul className="space-y-2">*/}
                    {/*        <li>*/}
                    {/*            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">*/}
                    {/*                {t('footer.terms')}*/}
                    {/*            </Link>*/}
                    {/*        </li>*/}
                    {/*        <li>*/}
                    {/*            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">*/}
                    {/*                {t('footer.privacy')}*/}
                    {/*            </Link>*/}
                    {/*        </li>*/}
                    {/*    </ul>*/}
                    {/*</div>*/}
                </div>
                <Separator className="border-gray-700"/>
                <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Vide Dressing Marketplace. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}

export default AppFooter;
