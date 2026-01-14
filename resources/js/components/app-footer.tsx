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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: Truck, title: 'Livraison Rapide', desc: 'Partout au Cameroun' },
                            { icon: Shield, title: 'Paiement Sécurisé', desc: '100% sécurisé' },
                            { icon: CreditCard, title: 'Paiement Flexible', desc: 'Mobile Money & Carte' },
                            { icon: Heart, title: 'Satisfaction', desc: 'Garantie ou remboursé' },
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-3 group">
                                <div className="p-3 bg-gray-800 rounded-xl group-hover:bg-primary/20 transition-colors">
                                    <item.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                                    <p className="text-xs text-gray-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contenu principal du footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                    {/* Logo et description */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-block mb-4">
                            <AppLogo />
                        </Link>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            La marketplace camerounaise pour acheter et vendre des articles de qualité. 
                            Donnez une seconde vie à vos objets en toute confiance.
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
                                        "w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 transition-all duration-300",
                                        "hover:text-white hover:scale-110",
                                        social.color
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
                        <h3 className="text-white font-semibold mb-4 text-lg">Liens Rapides</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.title}>
                                    <Link 
                                        href={link.href}
                                        className="text-gray-400 hover:text-primary flex items-center gap-1 transition-colors group"
                                    >
                                        <ChevronRight className="w-4 h-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Catégories */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-lg">Catégories</h3>
                        <ul className="space-y-2">
                            {categoryLinks.map((link) => (
                                <li key={link.title}>
                                    <Link 
                                        href={link.href}
                                        className="text-gray-400 hover:text-primary flex items-center gap-1 transition-colors group"
                                    >
                                        <ChevronRight className="w-4 h-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Aide */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-lg">Aide</h3>
                        <ul className="space-y-2">
                            {helpLinks.map((link) => (
                                <li key={link.title}>
                                    <Link 
                                        href={link.href}
                                        className="text-gray-400 hover:text-primary flex items-center gap-1 transition-colors group"
                                    >
                                        <ChevronRight className="w-4 h-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-lg">Contact</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <span className="text-gray-400 text-sm">
                                    Douala, Cameroun<br />
                                    Akwa, Rue de la Joie
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                                <a href="tel:+237600000000" className="text-gray-400 hover:text-primary text-sm transition-colors">
                                    +237 6XX XXX XXX
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                                <a href="mailto:contact@Afroza Marketplac.cm" className="text-gray-400 hover:text-primary text-sm transition-colors">
                                    contact@Afroza Marketplac.cm
                                </a>
                            </li>
                        </ul>

                        {/* Téléchargement App */}
                        <div className="mt-6">
                            <p className="text-sm text-gray-500 mb-2">Bientôt disponible sur</p>
                            <div className="flex gap-2">
                                <div className="px-3 py-2 bg-gray-800 rounded-lg text-xs text-gray-400">
                                    📱 App Store
                                </div>
                                <div className="px-3 py-2 bg-gray-800 rounded-lg text-xs text-gray-400">
                                    🤖 Play Store
                                </div>
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
                                        className="px-3 py-1.5 bg-gray-800 rounded-md text-sm flex items-center gap-2"
                                        title={method.name}
                                    >
                                        <span>{method.icon}</span>
                                        <span className="hidden sm:inline text-gray-400">{method.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Bouton retour en haut */}
                        <Button
                            onClick={scrollToTop}
                            variant="outline"
                            size="sm"
                            className="border-gray-700 text-gray-400 hover:text-white hover:border-primary group"
                        >
                            <ArrowUp className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform" />
                            Haut de page
                        </Button>
                    </div>
                </div>
            </div>

            {/* Copyright et liens légaux */}
            <div className="border-t border-gray-800 bg-gray-950">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            © {new Date().getFullYear()} <span className="text-primary">Afroza Marketplace</span>. 
                            Tous droits réservés. Développé avec ❤️ au Cameroun.
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4">
                            {legalLinks.map((link, index) => (
                                <React.Fragment key={link.title}>
                                    <Link 
                                        href={link.href}
                                        className="text-sm text-gray-500 hover:text-primary transition-colors"
                                    >
                                        {link.title}
                                    </Link>
                                    {index < legalLinks.length - 1 && (
                                        <span className="text-gray-700">|</span>
                                    )}
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
