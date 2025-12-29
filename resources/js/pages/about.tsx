import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Heart, Mail, MapPin, Phone, Shield, Target, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroSection } from '@/components/hero-section';

function About() {

    const values = [
        {
            icon: Shield,
            title: 'Confiance',
            description: 'Nous garantissons des transactions sécurisées et authentifiées pour tous nos utilisateurs.'
        },
        {
            icon: Heart,
            title: 'Durabilité',
            description: 'Nous promouvons la mode circulaire en donnant une seconde vie aux vêtements de qualité.'
        },
        {
            icon: Users,
            title: 'Communauté',
            description: 'Nous créons un espace d\'échange convivial entre passionnés de mode au Sénégal.'
        },
        {
            icon: Award,
            title: 'Qualité',
            description: 'Nous sélectionnons rigoureusement les articles pour assurer la satisfaction de nos clients.'
        }
    ];

    const team = [
        {
            name: 'Karel Mobutu',
            role: 'Directeur Général',
            image: 'https://placehold.co/400x400/png',
            description: 'Passionné de mode et d\'entrepreneuriat, Karel a lancé Vide Dressing pour révolutionner la mode au Cameroun.'
        },
        {
            name: 'Anonym',
            role: 'Directeur Technique',
            image: 'https://placehold.co/400x400/png',
            description: 'Expert en technologie avec 8 ans d\'expérience, Anonym supervise le développement de notre plateforme.'
        },
        {
            name: 'Kerren Rennee',
            role: 'Responsable Marketing',
            image: 'https://placehold.co/400x400/png',
            description: 'Spécialiste en marketing digital, Kerren développe notre stratégie de communication et de croissance.'
        }
        ];


    return (
        <AppLayout>
            <HeroSection
                // className="bg-gradient-to-r from-primary to-white"
                className="bg-gradient-to-l from-primary to-chart-3 text-white"
                title={(`A propos de Vide Dressing`)}
                description={"Nous sommes la première plateforme camerounaise dédiée à la vente et à l'achat de vêtements de seconde main. Notre mission est de démocratiser la mode durable tout en créant une communauté de passionnés de style au Cameroun."}
            />
            <div className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                {/*<div className="mb-16 text-center">*/}
                {/*    <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">*/}
                {/*        À propos de <span className="text-primary">Vide Dressing</span>*/}
                {/*    </h1>*/}
                {/*    <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600">*/}
                {/*        Nous sommes la première plateforme sénégalaise dédiée à la vente et à l'achat de vêtements de seconde main. Notre mission est*/}
                {/*        de démocratiser la mode durable tout en créant une communauté de passionnés de style au Sénégal.*/}
                {/*    </p>*/}
                {/*</div>*/}

                {/* Notre Histoire */}
                <div className="mb-16">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                        <div>
                            <h2 className="mb-6 text-3xl font-bold text-gray-900">Notre Histoire</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Fondée en 2024 au Cameroun, Vide Dressing est née d'un constat simple : les Camerounais ont besoin d'une plateforme
                                    locale pour acheter et vendre des vêtements de qualité à prix abordables.
                                </p>
                                <p>
                                    Inspirés par le succès des plateformes internationales, nous avons adapté le concept aux réalités locales, en
                                    intégrant les modes de paiement populaires comme Orange Money et Wave, et en proposant un service de livraison
                                    adapté au territoire camerounais.
                                </p>
                                <p>
                                    Aujourd'hui, nous connectons des milliers d'utilisateurs à travers tout le Cameroun, créant un écosystème de mode
                                    circulaire unique en Afrique Central.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"
                                alt="Notre équipe"
                                className="w-full rounded-lg shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Notre Mission */}
                <div className="mb-16 text-center">
                    <div className="bg-gradient-to-l from-primary to-chart-3 text-white rounded-2xl p-8 md:p-12">
                        <Target className="text-primary mx-auto mb-6 h-16 w-16" />
                        <h2 className="mb-6 text-3xl font-bold ">Notre Mission</h2>
                        <p className="mx-auto max-w-3xl text-lg ">
                            Rendre la mode accessible à tous les Camerounais en créant la plus grande communauté de mode circulaire du pays. Nous
                            voulons que chaque vêtement trouve sa seconde chance et que chaque personne puisse exprimer son style unique sans
                            compromettre son budget.
                        </p>
                    </div>
                </div>

                {/* Nos Valeurs */}
                <div className="mb-16 ">
                    <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">Nos Valeurs</h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {values.map((value, index) => (
                            <Card key={index} className="p-6 text-center transition-shadow hover:shadow-lg">
                                <CardHeader>
                                    <value.icon className="text-primary  mx-auto mb-4 h-12 w-12" />
                                    <CardTitle className="text-xl font-semibold">{value.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Notre Équipe */}
                <div className="mb-16">
                    <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">Notre Équipe</h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {team.map((member, index) => (
                            <Card key={index} className="overflow-hidden text-center transition-shadow hover:shadow-lg">
                                <div className="p-6">
                                    <img src={member.image} alt={member.name} className="mx-auto mb-4 h-32 w-32 rounded-full object-cover" />
                                    <h3 className="mb-2 text-xl font-semibold text-gray-900">{member.name}</h3>
                                    <p className="text-primary mb-4 font-medium">{member.role}</p>
                                    <p className="text-sm text-gray-600">{member.description}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Statistiques */}
                {/*<div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-16">*/}
                {/*    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Nos Chiffres</h2>*/}
                {/*    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">*/}
                {/*        <div>*/}
                {/*            <div className="text-4xl font-bold text-primary mb-2">5,000+</div>*/}
                {/*            <p className="text-gray-600">Utilisateurs actifs</p>*/}
                {/*        </div>*/}
                {/*        <div>*/}
                {/*            <div className="text-4xl font-bold text-primary mb-2">15,000+</div>*/}
                {/*            <p className="text-gray-600">Articles vendus</p>*/}
                {/*        </div>*/}
                {/*        <div>*/}
                {/*            <div className="text-4xl font-bold text-primary mb-2">500+</div>*/}
                {/*            <p className="text-gray-600">Boutiques créées</p>*/}
                {/*        </div>*/}
                {/*        <div>*/}
                {/*            <div className="text-4xl font-bold text-primary mb-2">14</div>*/}
                {/*            <p className="text-gray-600">Régions couvertes</p>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/* Contact */}
                <div className="text-center">
                    <Card className="p-8 md:p-12">
                        <h2 className="mb-6 text-3xl font-bold text-gray-900">Contactez-nous</h2>
                        <p className="mx-auto mb-8 max-w-2xl text-gray-600">
                            Vous avez des questions ou souhaitez en savoir plus sur notre aventure ? N'hésitez pas à nous contacter !
                        </p>

                        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3 items-center">
                            <div className="flex items-center justify-center space-x-3">
                                <MapPin className="text-primary h-5 w-5" />
                                <span className="text-gray-700">Yaoundé, Cameroun</span>
                            </div>
                            <div className="flex items-center justify-center space-x-3">
                                <Mail className="text-primary h-5 w-5" />
                                <span className="text-gray-700">contact@videdressing.sn</span>
                            </div>
                            <div className="flex items-center justify-center space-x-3">
                                <Phone className="text-primary h-5 w-5" />
                                <span className="text-gray-700">+237 656 92 19 21</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <Button className="bg-primary hover:bg-secondary" asChild>
                                <a href="/contact">Nous contacter</a>
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

export default About;
