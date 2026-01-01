import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Bell,
    Check,
    CheckCheck,
    Trash2,
    Package,
    MessageSquare,
    Truck,
    ShoppingBag,
    Star,
    Mail,
    BellOff,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { BreadcrumbItem } from '@/types';

interface Notification {
    id: string;
    type: string;
    data: {
        title?: string;
        message?: string;
        action_url?: string;
        [key: string]: any;
    };
    read_at: string | null;
    created_at: string;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    notifications: PaginatedData<Notification>;
    unreadCount: number;
    filter: string;
}

const getNotificationIcon = (type: string) => {
    const icons: { [key: string]: React.ReactNode } = {
        'App\\Notifications\\NewMessage': <MessageSquare className="h-5 w-5 text-blue-500" />,
        'App\\Notifications\\OrderStatusChanged': <Package className="h-5 w-5 text-purple-500" />,
        'App\\Notifications\\DeliveryProfileApproved': <Truck className="h-5 w-5 text-green-500" />,
        'App\\Notifications\\DeliveryProfileRejected': <Truck className="h-5 w-5 text-red-500" />,
        'App\\Notifications\\NewOrder': <ShoppingBag className="h-5 w-5 text-orange-500" />,
        'App\\Notifications\\NewReview': <Star className="h-5 w-5 text-yellow-500" />,
        'App\\Notifications\\NewsletterNotification': <Mail className="h-5 w-5 text-pink-500" />,
    };
    return icons[type] || <Bell className="h-5 w-5 text-gray-500" />;
};

export default function NotificationsIndex({ notifications, unreadCount, filter }: Props) {
    const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Notifications', href: '/notifications' },
    ];

    const handleTabChange = (value: string) => {
        router.get('/notifications', { filter: value }, { preserveState: true });
    };

    const handleMarkAsRead = (notificationId: string) => {
        router.post(`/notifications/${notificationId}/read`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Notification marquée comme lue');
            },
        });
    };

    const handleMarkAllAsRead = () => {
        router.post('/notifications/read-all', {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Toutes les notifications marquées comme lues');
            },
        });
    };

    const handleDelete = (notificationId: string) => {
        router.delete(`/notifications/${notificationId}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Notification supprimée');
            },
        });
    };

    const handleDeleteAll = () => {
        router.delete('/notifications', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Toutes les notifications supprimées');
                setDeleteAllDialogOpen(false);
            },
        });
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read_at) {
            handleMarkAsRead(notification.id);
        }
        
        if (notification.data.action_url) {
            router.visit(notification.data.action_url);
        }
    };

    return (
        <AppLayout>
            <Head title="Notifications" />
            
            <div className="p-4 container mx-auto space-y-6">
                <div className="flex justify-between items-start">
                    <Heading 
                        title="Notifications" 
                        description={`${unreadCount > 0 ? `${unreadCount} non lue(s)` : 'Toutes les notifications sont lues'}`}
                    />
                    <div className="flex gap-2">
                        {unreadCount > 0 && (
                            <Button variant="outline" onClick={handleMarkAllAsRead}>
                                <CheckCheck className="h-4 w-4 mr-2" />
                                Tout marquer lu
                            </Button>
                        )}
                        {notifications.total > 0 && (
                            <Button 
                                variant="outline" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => setDeleteAllDialogOpen(true)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Tout supprimer
                            </Button>
                        )}
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <Tabs value={filter} onValueChange={handleTabChange}>
                            <TabsList>
                                <TabsTrigger value="all">Toutes</TabsTrigger>
                                <TabsTrigger value="unread">
                                    Non lues
                                    {unreadCount > 0 && (
                                        <Badge variant="destructive" className="ml-2">
                                            {unreadCount}
                                        </Badge>
                                    )}
                                </TabsTrigger>
                                <TabsTrigger value="read">Lues</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent>
                        {notifications.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <BellOff className="h-16 w-16 mb-4 opacity-50" />
                                <h3 className="text-lg font-medium">Aucune notification</h3>
                                <p className="text-sm">
                                    {filter === 'unread' 
                                        ? 'Vous avez lu toutes vos notifications' 
                                        : 'Vous n\'avez pas encore de notifications'
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {notifications.data.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={cn(
                                            "flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all hover:shadow-md border",
                                            !notification.read_at 
                                                ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800" 
                                                : "bg-background border-border hover:bg-muted/50"
                                        )}
                                    >
                                        <div className="flex-shrink-0 p-2 rounded-full bg-muted">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    {notification.data.title && (
                                                        <h4 className={cn(
                                                            "text-sm",
                                                            !notification.read_at && "font-semibold"
                                                        )}>
                                                            {notification.data.title}
                                                        </h4>
                                                    )}
                                                    <p className={cn(
                                                        "text-sm",
                                                        !notification.read_at ? "text-foreground" : "text-muted-foreground"
                                                    )}>
                                                        {notification.data.message || 'Nouvelle notification'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {formatDate(notification.created_at)}
                                                    </p>
                                                </div>
                                                
                                                <div className="flex items-center gap-1">
                                                    {!notification.read_at && (
                                                        <div className="h-2 w-2 rounded-full bg-blue-500" title="Non lu" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-shrink-0 flex flex-col gap-1">
                                            {!notification.read_at && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMarkAsRead(notification.id);
                                                    }}
                                                    title="Marquer comme lu"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(notification.id);
                                                }}
                                                title="Supprimer"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {/* Pagination */}
                                {notifications.last_page > 1 && (
                                    <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                        <div className="text-sm text-muted-foreground">
                                            Page {notifications.current_page} sur {notifications.last_page}
                                        </div>
                                        <div className="flex gap-2">
                                            {notifications.links.map((link, index) => (
                                                <Button
                                                    key={index}
                                                    variant={link.active ? 'default' : 'outline'}
                                                    size="sm"
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete All Dialog */}
            <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer toutes les notifications</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer toutes vos notifications ?
                            Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAll} className="bg-red-600 hover:bg-red-700">
                            Supprimer tout
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
