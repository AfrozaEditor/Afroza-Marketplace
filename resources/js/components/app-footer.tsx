import React from 'react';
import { NavItem } from '@/types';
import AppLogo from './app-logo';
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    ChevronRight,
    CreditCard,
    Truck,
    Shield,
    Heart,
    ArrowUp
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const quickLinks: NavItem[] = [
    { title: 'Accueil', href: '/' },
    { title: 'Tous les produits', href: '/products' },
    { title: 'Promotions', href: '/promotions' },
    { title: 'Blog', href: '/blog' },
    { title: 'Marketplace', href: '/marketplace' },
];

const helpLinks: NavItem[] = [
    { title: 'Centre d\'aide', href: '/help' },
    { title: 'Comment vendre', href: '/help/selling' },
    { title: 'Comment acheter', href: '/help/buying' },
    { title: 'Livraison', href: '/help/delivery' },
    { title: 'Retours & Remboursements', href: '/help/returns' },
    { title: 'Contact', href: '/contact' },
];

const legalLinks: NavItem[] = [
    { title: 'Conditions Générales', href: '/terms' },
    { title: 'Politique de Confidentialité', href: '/privacy' },
    { title: 'Politique de Cookies', href: '/cookies' },
    { title: 'Mentions Légales', href: '/legal' },
];

const categoryLinks: NavItem[] = [
    { title: 'Mode & Accessoires', href: '/products?category=1' },
    { title: 'Électronique', href: '/products?category=2' },
    { title: 'Maison & Décoration', href: '/products?category=3' },
    { title: 'Beauté & Santé', href: '/products?category=5' },
    { title: 'Sports & Loisirs', href: '/products?category=6' },
];

const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: Instagram, href: 'https://instagram.com/afrozaeditor', label: 'Instagram', color: 'hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:bg-sky-500' },
    { icon: Youtube, href: 'https://youtube.com', label: 'Youtube', color: 'hover:bg-red-600' },
    { icon: Linkedin, href: 'https://linkedin.com/company/afroza-editor-for-developpement', label: 'LinkedIn', color: 'hover:bg-blue-700' },
];

const paymentMethods = [
    { name: 'Mobile Money', icon: '📱' },
    { name: 'Orange Money', icon: '🟠' },
    { name: 'MTN MoMo', icon: '🟡' },
    { name: 'Visa', icon: '💳' },
];

function AppFooter() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
            {/* Section avantages */}
            <div className="border-b border-gray-800">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        {[
                            { icon: Truck, title: 'Livraison Rapide', desc: 'Partout au Cameroun' },
                            { icon: Shield, title: 'Paiement Sécurisé', desc: '100% sécurisé' },
                            { icon: CreditCard, title: 'Paiement Flexible', desc: 'Mobile Money & Carte' },
                            { icon: Heart, title: 'Satisfaction', desc: 'Garantie ou remboursé' },
                        ].map((item, index) => (
                            <div key={index} className="group flex items-center gap-3">
                                <div className="group-hover:bg-primary/20 rounded-xl bg-gray-800 p-3 transition-colors">
                                    <item.icon className="text-primary h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                                    <p className="text-xs text-gray-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contenu principal du footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
                    {/* Logo et description */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="mb-4 inline-block">
                            <AppLogo />
                        </Link>
                        <p className="mb-6 leading-relaxed text-gray-400">
                            La marketplace camerounaise pour acheter et vendre des articles de qualité. Donnez une seconde vie à vos objets en toute
                            confiance.
                        </p>

                        {/* Réseaux sociaux */}
                        <div className="flex gap-2">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        'flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-all duration-300',
                                        'hover:scale-110 hover:text-white',
                                        social.color,
                                    )}
                                    title={social.label}
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Liens rapides */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-white">Liens Rapides</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.title}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-primary group flex items-center gap-1 text-gray-400 transition-colors"
                                    >
                                        <ChevronRight className="-ml-5 h-4 w-4 opacity-0 transition-all group-hover:ml-0 group-hover:opacity-100" />
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Catégories */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-white">Catégories</h3>
                        <ul className="space-y-2">
                            {categoryLinks.map((link) => (
                                <li key={link.title}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-primary group flex items-center gap-1 text-gray-400 transition-colors"
                                    >
                                        <ChevronRight className="-ml-5 h-4 w-4 opacity-0 transition-all group-hover:ml-0 group-hover:opacity-100" />
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Aide */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-white">Aide</h3>
                        <ul className="space-y-2">
                            {helpLinks.map((link) => (
                                <li key={link.title}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-primary group flex items-center gap-1 text-gray-400 transition-colors"
                                    >
                                        <ChevronRight className="-ml-5 h-4 w-4 opacity-0 transition-all group-hover:ml-0 group-hover:opacity-100" />
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-white">Contact</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                                <span className="text-sm text-gray-400">
                                    Yaoundé, Cameroun
                                    <br />
                                    Ngoa-Ekele, Rue de la Joie
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-primary h-5 w-5 flex-shrink-0" />
                                <a href="https://wa.me/237656921921" className="hover:text-primary text-sm text-gray-400 transition-colors">
                                    +237 656 921 921
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-primary h-5 w-5 flex-shrink-0" />
                                <a href="mailto:afroza.editor@gmail.com" className="hover:text-primary text-sm text-gray-400 transition-colors">
                                    afroza.editor@gmail.com
                                </a>
                            </li>
                        </ul>

                        {/* Téléchargement App */}
                        <div className="mt-6">
                            <p className="mb-2 text-sm text-gray-500">Bientôt disponible sur</p>
                            <div className="flex gap-2">
                                <div className="rounded-lg bg-gray-800 px-3 py-2 text-xs text-gray-400">📱 App Store</div>
                                <div className="rounded-lg bg-gray-800 px-3 py-2 text-xs text-gray-400">🤖 Play Store</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section moyens de paiement */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">Moyens de paiement acceptés :</span>
                            <div className="flex gap-3">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.name}
                                        className="flex items-center gap-2 rounded-md bg-gray-800 px-3 py-1.5 text-sm"
                                        title={method.name}
                                    >
                                        <span>{method.icon}</span>
                                        <span className="hidden text-gray-400 sm:inline">{method.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bouton retour en haut */}
                        <Button
                            onClick={scrollToTop}
                            variant="outline"
                            size="sm"
                            className="hover:border-primary group border-gray-700 text-gray-400 hover:text-white"
                        >
                            <ArrowUp className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-1" />
                            Haut de page
                        </Button>
                    </div>
                </div>
            </div>

            {/* Copyright et liens légaux */}
            <div className="border-t border-gray-800 bg-gray-950">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-sm text-gray-500">
                            © {new Date().getFullYear()} <span className="text-primary">Afroza Marketplace</span>. Tous droits réservés. Produit
                            propriétaire de{' '}
                            <a href="https://afroza-editor.tech">
                                <span className="text-primary">Afroza Editor. </span>
                            </a>
                            {/*Développé avec ❤️ au Cameroun.*/}
                        </p>

                        <div className="flex flex-wrap items-center gap-4">
                            {legalLinks.map((link, index) => (
                                <React.Fragment key={link.title}>
                                    <Link href={link.href} className="hover:text-primary text-sm text-gray-500 transition-colors">
                                        {link.title}
                                    </Link>
                                    {index < legalLinks.length - 1 && <span className="text-gray-700">|</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default AppFooter;
