import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { 
    ChevronRight, 
    Cloud, 
    Lock, 
    Server, 
    Shield, 
    Smartphone, 
    Zap,
    Camera,
    Search,
    Star,
    Sparkles,
    TrendingUp,
    Users,
    Package,
    CreditCard,
    MessageCircle,
    Truck,
    Heart,
    CheckCircle,
    ArrowRight,
    Play,
    MapPin,
    Bike
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import NewsLetter from '@/components/home/news-letter';

function Feature() {
    const mainFeatures = [
        {
            icon: Shield,
            title: 'Sécurité garantie',
            description: 'Protection des paiements et authentification des produits de luxe pour une expérience d\'achat sécurisée.',
            badge: 'Premium',
            color: 'bg-green-500/10 text-green-600 dark:text-green-400'
        },
        {
            icon: Smartphone,
            title: 'Application mobile',
            description: 'Achetez et vendez où que vous soyez avec notre application disponible sur iOS et Android.',
            badge: 'Bientôt',
            color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
        },
        {
            icon: Lock,
            title: 'Protection des données',
            description: 'Vos informations personnelles sont protégées conformément aux normes de sécurité les plus strictes.',
            badge: null,
            color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
        },
        {
            icon: Zap,
            title: 'Ventes rapides',
            description: 'Algorithme intelligent qui met en relation acheteurs et vendeurs pour des transactions plus rapides.',
            badge: 'Nouveau',
            color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
        },
        {
            icon: Server,
            title: 'Inventaire intelligent',
            description: 'Gestion automatisée de votre inventaire avec notifications de stock faible et suggestions de prix.',
            badge: 'Pro',
            color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400'
        },
        {
            icon: Cloud,
            title: 'Sauvegarde dans le cloud',
            description: 'Accédez à votre historique de vente et d\'achat depuis n\'importe quel appareil.',
            badge: null,
            color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
        },
    ];

    const buyerFeatures = [
        {
            icon: Search,
            title: 'Recherche avancée',
            description: 'Trouvez exactement ce que vous cherchez avec nos filtres intelligents.'
        },
        {
            icon: Heart,
            title: 'Liste de favoris',
            description: 'Sauvegardez vos articles préférés et recevez des alertes de prix.'
        },
        {
            icon: CreditCard,
            title: 'Paiement sécurisé',
            description: 'Multiple moyens de paiement : Mobile Money, carte bancaire.'
        },
        {
            icon: Truck,
            title: 'Livraison fiable',
            description: 'Suivi en temps réel et plusieurs options de livraison.'
        }
    ];

    const sellerFeatures = [
        {
            icon: Camera,
            title: 'Publication facile',
            description: 'Créez des annonces attractives en quelques minutes.'
        },
        {
            icon: TrendingUp,
            title: 'Statistiques détaillées',
            description: 'Analysez vos performances et optimisez vos ventes.'
        },
        {
            icon: MessageCircle,
            title: 'Chat intégré',
            description: 'Communiquez directement avec vos clients.'
        },
        {
            icon: Package,
            title: 'Gestion des commandes',
            description: 'Suivez et gérez facilement toutes vos ventes.'
        }
    ];

    const deliveryFeatures = [
        {
            icon: Truck,
            title: 'Livraisons disponibles',
            description: 'Accédez aux commandes disponibles dans votre zone en temps réel.'
        },
        {
            icon: MapPin,
            title: 'Navigation optimisée',
            description: 'Itinéraires optimisés pour des livraisons plus rapides et efficaces.'
        },
        {
            icon: CreditCard,
            title: 'Paiements rapides',
            description: 'Recevez vos gains directement sur votre compte Mobile Money.'
        },
        {
            icon: Star,
            title: 'Système de notation',
            description: 'Construisez votre réputation et accédez à plus de livraisons.'
        }
    ];

    const steps = [
        {
            number: 1,
            title: 'Prenez une photo',
            description: 'Utilisez notre application pour prendre des photos de qualité de vos vêtements.',
            image: 'https://images.unsplash.com/photo-1526178613658-79c92207c91c?w=400'
        },
        {
            number: 2,
            title: 'Décrivez l\'article',
            description: 'Ajoutez une description, précisez l\'état et définissez un prix compétitif.',
            image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400'
        },
        {
            number: 3,
            title: 'Publiez et vendez',
            description: 'Votre annonce est publiée immédiatement et visible par des milliers d\'acheteurs.',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'
        }
    ];

    const stats = [
        { value: '10K+', label: 'Utilisateurs actifs', icon: Users },
        { value: '50K+', label: 'Articles vendus', icon: Package },
        { value: '4.8', label: 'Note moyenne', icon: Star },
        { value: '24h', label: 'Support réactif', icon: MessageCircle }
    ];

    return (
        <AppLayout>
            <Head title="Fonctionnalités - Afroza Marketplace"/>
            
            {/* Hero Section Modernisé */}
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
                {/* Éléments décoratifs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                
                <div className="relative container mx-auto px-4 py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <Badge className="mb-4 bg-primary/20 text-primary border border-primary/30">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Plateforme tout-en-un
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Des outils <span className="text-primary">puissants</span> pour vendre
                        </h1>
                        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                            Découvrez comment notre plateforme rend la vente et l'achat de vêtements 
                            simples, sécurisés et amusants.
                        </p>
                        
                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="h-12 px-8" asChild>
                                <Link href="/products">
                                    Commencer maintenant
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="lg" variant="outline" className="h-12 px-8 bg-white/10 border-white/20 text-white hover:bg-white/20">
                                        <Play className="mr-2 h-4 w-4" />
                                        Voir la démo
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
                                    <div className="grid md:grid-cols-2">
                                        <div className="p-6 sm:p-8">
                                            <DialogHeader className="text-left">
                                                <DialogTitle className="text-2xl font-bold">
                                                    Démo rapide Afroza
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Découvrez le parcours complet de publication et de vente en moins d'une minute.
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="mt-6 space-y-4">
                                                {steps.map((step) => (
                                                    <div key={step.number} className="flex items-start gap-3">
                                                        <div className="w-7 h-7 rounded-full bg-primary text-white text-sm font-semibold flex items-center justify-center shrink-0">
                                                            {step.number}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm text-gray-900 dark:text-white">
                                                                {step.title}
                                                            </p>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                {step.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-6 flex gap-3">
                                                <Button asChild>
                                                    <Link href="/products/create">
                                                        Commencer à vendre
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="outline" asChild>
                                                    <Link href="/products">
                                                        Voir les articles
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="bg-gray-100 dark:bg-gray-800 p-4 sm:p-6">
                                            <div className="h-full rounded-xl overflow-hidden">
                                                <img
                                                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900"
                                                    alt="Aperçu démo Afroza"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        
                        {/* Stats rapides */}
                        <div className="flex flex-wrap justify-center gap-8 mt-10 pt-8 border-t border-white/10">
                            {stats.map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="flex items-center justify-center gap-2 text-2xl font-bold text-white">
                                        <stat.icon className="h-5 w-5 text-primary" />
                                        {stat.value}
                                    </div>
                                    <p className="text-sm text-gray-400">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Fonctionnalités principales */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-primary/10 text-primary border-0">
                            Fonctionnalités
                        </Badge>
                        <h2 className="text-3xl font-bold mb-4 dark:text-white">
                            Tout ce dont vous avez besoin
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Une plateforme complète avec des outils puissants pour faciliter vos achats et ventes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mainFeatures.map((feature, index) => (
                            <Card 
                                key={index} 
                                className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-800"
                            >
                                <CardHeader className="pb-2">
                                    <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="h-7 w-7" />
                                    </div>
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-xl font-bold dark:text-white">
                                            {feature.title}
                                        </CardTitle>
                                        {feature.badge && (
                                            <Badge className="bg-primary/10 text-primary border-0 text-xs">
                                                {feature.badge}
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-gray-600 dark:text-gray-400">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comment ça marche */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <Badge className="mb-4 bg-primary/10 text-primary border-0">
                                Comment ça marche
                            </Badge>
                            <h2 className="text-3xl font-bold mb-6 dark:text-white">
                                De la photo à la vente en quelques minutes
                            </h2>
                            
                            <div className="space-y-6">
                                {steps.map((step, index) => (
                                    <div key={index} className="flex gap-4 group">
                                        <div className="shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                                                {step.number}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2 dark:text-white">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button className="mt-8" size="lg" asChild>
                                <Link href="/products/create">
                                    Commencer à vendre
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="rounded-2xl overflow-hidden shadow-lg">
                                        <img 
                                            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400" 
                                            alt="Vente" 
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-lg">
                                        <img 
                                            src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400" 
                                            alt="Paiement" 
                                            className="w-full h-64 object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-8">
                                    <div className="rounded-2xl overflow-hidden shadow-lg">
                                        <img 
                                            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400" 
                                            alt="Shopping" 
                                            className="w-full h-64 object-cover"
                                        />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-lg">
                                        <img 
                                            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400" 
                                            alt="Mode" 
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Overlay décoratif */}
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Pour les acheteurs, vendeurs et livreurs */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-primary/10 text-primary border-0">
                            Pour tous les acteurs
                        </Badge>
                        <h2 className="text-3xl font-bold mb-4 dark:text-white">
                            Des outils adaptés à chaque utilisateur
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Que vous soyez acheteur, vendeur ou livreur, nous avons les fonctionnalités qu'il vous faut.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Pour les acheteurs */}
                        <div>
                            <div className="mb-6">
                                <Badge className="mb-3 bg-blue-500/10 text-blue-600 border-0">
                                    Pour les acheteurs
                                </Badge>
                                <h3 className="text-xl font-bold mb-2 dark:text-white">
                                    Expérience d'achat optimale
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Trouvez les meilleures affaires facilement.
                                </p>
                            </div>
                            
                            <div className="space-y-3">
                                {buyerFeatures.map((feature, index) => (
                                    <Card key={index} className="border-0 shadow-sm dark:bg-gray-800">
                                        <CardContent className="flex items-start gap-3 p-3">
                                            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                                <feature.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm mb-0.5 dark:text-white">{feature.title}</h4>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">{feature.description}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Pour les vendeurs */}
                        <div>
                            <div className="mb-6">
                                <Badge className="mb-3 bg-green-500/10 text-green-600 border-0">
                                    Pour les vendeurs
                                </Badge>
                                <h3 className="text-xl font-bold mb-2 dark:text-white">
                                    Maximisez vos ventes
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Gérez et développez votre boutique.
                                </p>
                            </div>
                            
                            <div className="space-y-3">
                                {sellerFeatures.map((feature, index) => (
                                    <Card key={index} className="border-0 shadow-sm dark:bg-gray-800">
                                        <CardContent className="flex items-start gap-3 p-3">
                                            <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                                                <feature.icon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm mb-0.5 dark:text-white">{feature.title}</h4>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">{feature.description}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Pour les livreurs */}
                        <div>
                            <div className="mb-6">
                                <Badge className="mb-3 bg-orange-500/10 text-orange-600 border-0">
                                    Pour les livreurs
                                </Badge>
                                <h3 className="text-xl font-bold mb-2 dark:text-white">
                                    Gagnez en livrant
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Devenez partenaire livreur et gagnez de l'argent.
                                </p>
                            </div>
                            
                            <div className="space-y-3">
                                {deliveryFeatures.map((feature, index) => (
                                    <Card key={index} className="border-0 shadow-sm dark:bg-gray-800">
                                        <CardContent className="flex items-start gap-3 p-3">
                                            <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                                                <feature.icon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm mb-0.5 dark:text-white">{feature.title}</h4>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">{feature.description}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Prêt à commencer ?
                        </h2>
                        <p className="text-lg text-white/90 mb-8">
                            Rejoignez des milliers d'utilisateurs qui achètent et vendent déjà sur Afroza Marketplace.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild>
                                <Link href="/register">
                                    Créer mon compte
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                                <Link href="/products">
                                    Parcourir les articles
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <NewsLetter />
        </AppLayout>
    );
}

export default Feature;
