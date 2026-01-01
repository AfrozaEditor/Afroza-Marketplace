import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Activity, BarChart3, ShoppingBag, Users, Truck } from 'lucide-react';
import Heading from '@/components/heading';
import { User } from '@/types';

interface Props {
    users: User[];
}

function Dashboard({users}: Props) {

    const adminStats = [
        { title: "Utilisateurs Inscrits", value: users.length, icon: <Users className="h-5 w-5 text-muted-foreground" />, change: "+5% ce mois" },
        { title: "Vendeurs Actifs", value: "56", icon: <ShoppingBag className="h-5 w-5 text-muted-foreground" />, change: "+2 nouveaux" },
        { title: "Transactions Globales", value: "789", icon: <BarChart3 className="h-5 w-5 text-muted-foreground" />, change: "+12% cette semaine" },
        { title: "Tickets Support Ouverts", value: "3", icon: <Activity className="h-5 w-5 text-muted-foreground" />, change: "Haute priorité" },
    ];


    const adminOptions = [
        { title: "Gestion des Utilisateurs", description: "Visualiser, modifier ou suspendre des comptes utilisateurs.", action: <Link href="/admin/users">Gérer les utilisateurs</Link> },
        { title: "Gestion des Livreurs", description: "Approuver, rejeter ou suspendre les profils des livreurs.", action: <Link href="/admin/deliveries">Gérer les livreurs</Link> },
        { title: "Gestion des Blogs", description: "Créer, modifier et publier des articles de blog.", action: <Link href="/admin/blogs">Gérer les blogs</Link> },
        { title: "Gestion des Newsletters", description: "Créer, modifier et publier des articles de newsletter.", action: <Link href="/admin/newsletters">Gérer les newsletters</Link> },
        { title: "Paramètres de la Plateforme", description: "Configurer les options globales de l'application.", action: <Link href="">Accéder aux paramètres</Link>},
        { title: "Rapports et Analyses", description: "Consulter les statistiques détaillées de la plateforme.", action: <Link href="">Voir les rapports</Link>},
        { title: "Modération de Contenu", description: "Gérer les signalements et le contenu publié.", action: <Link href="/admin/moderation">Modérer le contenu</Link>},
    ];

    return (
        <AppLayout>
            <div className="p-4 container mx-auto">
            <div className="mb-8">
                {/*<h1 className="text-3xl font-bold text-gray-900">Tableau de bord Administrateur</h1>*/}
                {/*<p className="text-gray-600">Vue d'ensemble et gestion globale de la plateforme.</p>*/}
                <Heading title="Tableau de bord Administrateur" description="Vue d'ensemble et gestion globale de la plateforme."/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {adminStats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            {stat.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.change}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {adminOptions.map((option, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{option.title}</CardTitle>
                            <CardDescription>{option.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                {option.action}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                {/* <Card>
                    <CardHeader>
                        <CardTitle>Gestion des Utilisateurs</CardTitle>
                        <CardDescription>Visualiser, modifier ou suspendre des comptes utilisateurs.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/admin/users">Gérer les utilisateurs</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Paramètres de la Plateforme</CardTitle>
                        <CardDescription>Configurer les options globales de l'application.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline">
                            <Link href="">Accéder aux paramètres</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Modération de Contenu</CardTitle>
                        <CardDescription>Gérer les signalements et le contenu publié.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="">Modérer le contenu</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Rapports et Analyses</CardTitle>
                        <CardDescription>Consulter les statistiques détaillées de la plateforme.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline">
                            <Link href="">Voir les rapports</Link>
                        </Button>
                    </CardContent>
                </Card> */}
            </div>
            </div>
        </AppLayout>
    );
}

export default Dashboard;
