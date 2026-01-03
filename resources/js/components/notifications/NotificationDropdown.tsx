import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
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
    User,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

declare global {
    interface Window {
        Echo: any;
    }
}

export interface Notification {
    id: string;
    type: string;
    data: {
        title?: string;
        message?: string;
        action_url?: string;
        sender_name?: string;
        sender_avatar?: string;
        [key: string]: any;
    };
    read_at: string | null;
    created_at: string;
}

interface NotificationDropdownProps {
    notifications?: Notification[];
    unreadCount?: number;
    className?: string;
}

const getNotificationIcon = (type: string) => {
    const icons: { [key: string]: React.ReactNode } = {
        'App\\Notifications\\NewMessage': <MessageSquare className="h-4 w-4 text-blue-500" />,
        'App\\Notifications\\OrderStatusChanged': <Package className="h-4 w-4 text-purple-500" />,
        'App\\Notifications\\DeliveryProfileApproved': <Truck className="h-4 w-4 text-green-500" />,
        'App\\Notifications\\DeliveryProfileRejected': <Truck className="h-4 w-4 text-red-500" />,
        'App\\Notifications\\DeliveryProfileSuspended': <Truck className="h-4 w-4 text-orange-500" />,
        'App\\Notifications\\NewOrder': <ShoppingBag className="h-4 w-4 text-orange-500" />,
        'App\\Notifications\\NewReview': <Star className="h-4 w-4 text-yellow-500" />,
        'App\\Notifications\\NewsletterNotification': <Mail className="h-4 w-4 text-pink-500" />,
        'App\\Notifications\\NewUserRegistered': <User className="h-4 w-4 text-emerald-500" />,
    };
    return icons[type] || <Bell className="h-4 w-4 text-gray-500" />;
};

export default function NotificationDropdown({ 
    notifications: initialNotifications = [],
    unreadCount: initialUnreadCount = 0,
    className,
}: NotificationDropdownProps) {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialLoaded, setInitialLoaded] = useState(false);
    const page = usePage();
    const userId = (page.props.auth as any)?.user?.id;

    // Charger le compteur de notifications au montage
    useEffect(() => {
        if (!userId || initialLoaded) return;
        
        const fetchUnreadCount = async () => {
            try {
                const response = await fetch('/api/notifications/unread-count');
                const data = await response.json();
                setUnreadCount(data.unread_count || 0);
                setInitialLoaded(true);
            } catch (error) {
                console.error('Failed to fetch unread count', error);
            }
        };
        
        fetchUnreadCount();
    }, [userId, initialLoaded]);

    // Écouter les nouvelles notifications en temps réel
    useEffect(() => {
        if (!window.Echo || !userId) return;

        // Canal par défaut de Laravel pour les notifications broadcast
        const channel = window.Echo.private(`App.Models.User.${userId}`);

        // Écouter les notifications Laravel standard
        channel.notification((notification: any) => {
            console.log('Notification reçue:', notification);
            
            // Construire l'objet notification
            const newNotification: Notification = {
                id: notification.id || String(Date.now()),
                type: notification.type || 'App\\Notifications\\NewMessage',
                data: {
                    title: notification.title,
                    message: notification.message,
                    action_url: notification.action_url,
                    sender_name: notification.sender_name,
                    sender_avatar: notification.sender_avatar,
                    ...notification
                },
                read_at: null,
                created_at: notification.created_at || new Date().toISOString(),
            };

            // Ajouter la nouvelle notification en haut de la liste
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Afficher un toast pour la notification avec son et style amélioré
            const message = notification.message || notification.title || 'Nouvelle notification';
            const senderName = notification.sender_name;
            
            // Jouer un son de notification
            try {
                const audio = new Audio('/sounds/notification.mp3');
                audio.volume = 0.5;
                audio.play().catch(() => {});
            } catch (e) {}
            
            if (notification.type === 'new.message' || notification.sender_name) {
                toast.info(`💬 Nouveau message de ${senderName || 'Quelqu\'un'}`, {
                    description: message,
                    duration: 5000,
                    action: notification.action_url ? {
                        label: 'Voir',
                        onClick: () => router.visit(notification.action_url)
                    } : undefined
                });
            } else {
                toast.info('🔔 ' + message, {
                    duration: 5000,
                });
            }
        });

        return () => {
            window.Echo.leave(`App.Models.User.${userId}`);
        };
    }, [userId]);

    // Fetch notifications when dropdown opens
    const fetchNotifications = async () => {
        if (loading) return;
        
        setLoading(true);
        try {
            const response = await fetch('/api/notifications');
            const data = await response.json();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unread_count || 0);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            
            setNotifications(prev => 
                prev.map(n => n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await fetch('/api/notifications/read-all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            
            setNotifications(prev => 
                prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
            );
            setUnreadCount(0);
            toast.success('Toutes les notifications marquées comme lues');
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const handleDelete = async (notificationId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            await fetch(`/api/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            
            const notification = notifications.find(n => n.id === notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            if (notification && !notification.read_at) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read_at) {
            handleMarkAsRead(notification.id);
        }
        
        if (notification.data.action_url) {
            router.visit(notification.data.action_url);
            setIsOpen(false);
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("relative", className)}
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge 
                            variant="destructive" 
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-auto p-1 text-xs"
                            onClick={handleMarkAllAsRead}
                        >
                            <CheckCheck className="h-3 w-3 mr-1" />
                            Tout marquer lu
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <div className="max-h-[300px] overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                            <Bell className="h-8 w-8 mb-2 opacity-50" />
                            <p className="text-sm">Aucune notification</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={cn(
                                        "flex items-start gap-3 p-3 cursor-pointer hover:bg-muted transition-colors group",
                                        !notification.read_at && "bg-blue-50 dark:bg-blue-950/20"
                                    )}
                                >
                                    <div className="flex-shrink-0 mt-0.5">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={cn(
                                            "text-sm line-clamp-2",
                                            !notification.read_at && "font-medium"
                                        )}>
                                            {notification.data.message || notification.data.title || 'Nouvelle notification'}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatDate(notification.created_at)}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!notification.read_at && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMarkAsRead(notification.id);
                                                }}
                                                title="Marquer comme lu"
                                            >
                                                <Check className="h-3 w-3" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-red-500 hover:text-red-600"
                                            onClick={(e) => handleDelete(notification.id, e)}
                                            title="Supprimer"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <DropdownMenuSeparator />
                <div className="p-2">
                    <Button variant="ghost" className="w-full justify-center text-sm" asChild>
                        <Link href="/notifications">
                            Voir toutes les notifications
                        </Link>
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
