import { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { MapPin, Package, Clock, Truck, CheckCircle, AlertCircle, Phone, Navigation, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MapZone from '@/components/MapZone';
import { User } from '@/types';
import axios from 'axios';
import { toast } from 'sonner';

interface DeliveryZone {
  latitude: number;
  longitude: number;
  radius_km: number;
}

interface OrderLocation {
  id: number;
  order_number?: string;
  status: string;
  payment_status?: string;
  total: number;
  shipping_cost?: number;
  delivery_address: string;
  delivery_city?: string;
  latitude: number;
  longitude: number;
  customer_name?: string;
  customer_phone?: string;
  user: User;
  items_count: number;
  notes?: string;
  created_at?: string;
  shipped_at?: string;
  delivered_at?: string;
}

interface AssignedOrder extends OrderLocation {}

interface OrderStats {
  total: number;
  pending: number;
  in_transit: number;
  delivered: number;
  cancelled: number;
}

// Mapping des statuts de commande
const ORDER_STATUSES = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  confirmed: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  processing: { label: 'En préparation', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' },
  shipped: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  out_for_delivery: { label: 'En livraison', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  refunded: { label: 'Remboursée', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
} as const;

export default function DeliveryDashboard() {
  const page = usePage();
  const [activeTab, setActiveTab] = useState<'available' | 'assigned' | 'history'>('available');
  const [availableOrders, setAvailableOrders] = useState<OrderLocation[]>([]);
  const [assignedOrders, setAssignedOrders] = useState<AssignedOrder[]>([]);
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderLocation | null>(null);
  const [stats, setStats] = useState<OrderStats>({ total: 0, pending: 0, in_transit: 0, delivered: 0, cancelled: 0 });

  useEffect(() => {
    fetchOrders();
    // Auto-refresh toutes les 30 secondes
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setRefreshing(true);
    try {
      // Get available orders
      const availableRes = await fetch('/delivery/available-orders');
      const availableData = await availableRes.json();
      setAvailableOrders(availableData.orders || []);
      setDeliveryZone(availableData.delivery_zone);

      // Get assigned orders
      const assignedRes = await axios.get('/delivery/assigned-orders');
      const assignedData = await assignedRes.data;
      setAssignedOrders(assignedData.orders || []);
        console.log(assignedData.stats)
      if (assignedData.stats) {
        setStats(assignedData.stats);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const ordersArray = Object.values(availableOrders);

  // Filtrer les commandes actives (en cours de livraison)
  const activeOrders = assignedOrders.filter(o => 
    ['shipped', 'out_for_delivery'].includes(o.status)
  );

  // Filtrer les commandes terminées (historique)
  const completedOrders = assignedOrders.filter(o => 
    ['delivered', 'cancelled', 'refunded'].includes(o.status)
  );

  const acceptOrder = async (orderId: number) => {
    try {
      const res = await axios.post(`/delivery/accept-order/${orderId}`);

      if (res.data) {
        // Move order from available to assigned
        const order = ordersArray.find((o) => o.id === orderId);
        if (order) {
          setAvailableOrders(ordersArray.filter((o) => o.id !== orderId));
          setAssignedOrders([...assignedOrders, { ...order, status: 'shipped' } as AssignedOrder]);
        }
        toast.success('Commande acceptée avec succès !');
      }
    } catch (error: any) {
      console.error('Failed to accept order:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de l\'acceptation');
    }
  };

  const updateOrderStatus = async (orderId: number, status: string, cancellationReason?: string) => {
    try {
      const res = await axios.patch(`/delivery/update-order-status/${orderId}`, {
        status: status,
        cancellation_reason: cancellationReason,
      });

      if (res.data) {
        // Update order in assigned list
        setAssignedOrders(
          assignedOrders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          )
        );
        toast.success(`Commande ${getStatusLabel(status).toLowerCase()}`);
        // Rafraîchir pour mettre à jour les stats
        fetchOrders(false);
      }
    } catch (error: any) {
      console.error('Failed to update order status:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la mise à jour');
    }
  };

  const getStatusLabel = (status: string): string => {
    return ORDER_STATUSES[status as keyof typeof ORDER_STATUSES]?.label || status;
  };

  const getStatusColor = (status: string): string => {
    return ORDER_STATUSES[status as keyof typeof ORDER_STATUSES]?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'out_for_delivery':
        return <Navigation className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
      case 'refunded':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Ouvrir Google Maps ou autre application de navigation
  const openNavigation = (order: OrderLocation) => {
    if (order.latitude && order.longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${order.latitude},${order.longitude}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.delivery_address)}`, '_blank');
    }
  };

  // Appeler le client
  const callCustomer = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <>
      <Head title="Tableau de bord livreur" />
      <AppLayout>
        <div className="container mx-auto py-10 px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tableau de bord livreur</h1>
              <p className="text-gray-600 dark:text-gray-400">Gérez vos commandes de livraison</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => fetchOrders(false)}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>

          {/* Delivery Zone Map */}
          {deliveryZone && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Votre zone de livraison</CardTitle>
                <CardDescription>
                  Rayon: {deliveryZone.radius_km} km | 
                  Centre: {Number(deliveryZone.latitude).toFixed(4)}, {Number(deliveryZone.longitude).toFixed(4)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MapZone
                  initialData={deliveryZone}
                  isReadOnly={true}
                  onZoneChange={() => {}}
                />
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{ordersArray.length}</div>
                <p className="text-xs text-gray-500 mt-1">Dans votre zone</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">En préparation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600">{stats.pending}</div>
                <p className="text-xs text-gray-500 mt-1">À traiter</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">En transit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.in_transit}</div>
                <p className="text-xs text-gray-500 mt-1">En livraison</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Livrées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
                <p className="text-xs text-gray-500 mt-1">Complétées</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Annulées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
                <p className="text-xs text-gray-500 mt-1">Non livrées</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('available')}
              className={`px-4 py-2 font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'available'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Disponibles ({ordersArray.length})
            </button>
            <button
              onClick={() => setActiveTab('assigned')}
              className={`px-4 py-2 font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'assigned'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              En cours ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'history'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Historique ({completedOrders.length})
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block">
                <Loader2 className="animate-spin h-12 w-12 text-primary" />
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
            </div>
          ) : activeTab === 'available' ? (
            <div className="space-y-4">
              {availableOrders.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Package className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">Aucune commande disponible dans votre zone</p>
                    <p className="text-sm text-gray-500 mt-2">Les nouvelles commandes apparaîtront automatiquement</p>
                  </CardContent>
                </Card>
              ) : (
                ordersArray.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Order Info */}
                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            Commande #{order.order_number || order.id}
                          </h3>
                          <Badge className={`${getStatusColor(order.status)} mb-2`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{getStatusLabel(order.status)}</span>
                          </Badge>
                          <div className="space-y-2 text-sm mt-2">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300">{order.delivery_address}</span>
                            </div>
                            {order.delivery_city && (
                              <p className="text-gray-500 ml-6">{order.delivery_city}</p>
                            )}
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700 dark:text-gray-300">{order.items_count} article(s)</span>
                            </div>
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div>
                          <h4 className="font-semibold mb-2">Client</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-gray-600 dark:text-gray-400">Nom:</span> {order.customer_name || order.user?.name}</p>
                            <p><span className="text-gray-600 dark:text-gray-400">Email:</span> {order.user?.email}</p>
                            {order.customer_phone && (
                              <p className="flex items-center gap-1">
                                <span className="text-gray-600 dark:text-gray-400">Tél:</span> 
                                <a href={`tel:${order.customer_phone}`} className="text-primary hover:underline">
                                  {order.customer_phone}
                                </a>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Amount */}
                        <div>
                          <h4 className="font-semibold mb-2">Montant</h4>
                          <div className="space-y-1">
                            <p className="text-2xl font-bold text-primary">{order.total?.toLocaleString()} FCFA</p>
                            {order.shipping_cost && (
                              <p className="text-sm text-gray-500">
                                dont {order.shipping_cost?.toLocaleString()} FCFA de livraison
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action */}
                        <div className="flex items-end justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openNavigation(order)}
                          >
                            <Navigation className="w-4 h-4 mr-1" />
                            Itinéraire
                          </Button>
                          <Button
                            onClick={() => acceptOrder(order.id)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            Accepter
                          </Button>
                        </div>
                      </div>
                      {order.notes && (
                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <p className="text-sm text-yellow-800 dark:text-yellow-400">
                            <strong>Notes:</strong> {order.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : activeTab === 'assigned' ? (
            /* Commandes en cours */
            <div className="space-y-4">
              {activeOrders.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Truck className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">Aucune commande en cours de livraison</p>
                    <p className="text-sm text-gray-500 mt-2">Acceptez des commandes disponibles pour commencer</p>
                  </CardContent>
                </Card>
              ) : (
                activeOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Order Info */}
                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            Commande #{order.order_number || order.id}
                          </h3>
                          <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(order.status)}
                            <span>{getStatusLabel(order.status)}</span>
                          </Badge>
                          <div className="space-y-2 text-sm mt-3">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300">{order.delivery_address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700 dark:text-gray-300">{order.items_count} article(s)</span>
                            </div>
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div>
                          <h4 className="font-semibold mb-2">Client</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-gray-600 dark:text-gray-400">Nom:</span> {order.customer_name || order.user?.name}</p>
                            {order.customer_phone && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-2 gap-2"
                                onClick={() => callCustomer(order.customer_phone!)}
                              >
                                <Phone className="w-4 h-4" />
                                Appeler
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Amount */}
                        <div>
                          <h4 className="font-semibold mb-2">Montant à collecter</h4>
                          <p className="text-2xl font-bold text-primary">{order.total?.toLocaleString()} FCFA</p>
                          {order.payment_status === 'paid' && (
                            <Badge className="bg-green-100 text-green-800 mt-2">Déjà payée</Badge>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col items-end justify-between gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openNavigation(order)}
                            className="w-full md:w-auto"
                          >
                            <Navigation className="w-4 h-4 mr-1" />
                            Itinéraire
                          </Button>
                          
                          <div className="flex gap-2 w-full md:w-auto">
                            {order.status === 'shipped' && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                                className="flex-1 md:flex-none bg-orange-500 hover:bg-orange-600"
                              >
                                En route
                              </Button>
                            )}
                            {order.status === 'out_for_delivery' && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                                className="flex-1 md:flex-none bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Livrée
                              </Button>
                            )}
                            {['shipped', 'out_for_delivery'].includes(order.status) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'cancelled', 'Livraison impossible')}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Impossible
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      {order.notes && (
                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <p className="text-sm text-yellow-800 dark:text-yellow-400">
                            <strong>Notes:</strong> {order.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            /* Historique */
            <div className="space-y-4">
              {completedOrders.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Clock className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">Aucune livraison terminée</p>
                  </CardContent>
                </Card>
              ) : (
                completedOrders.map((order) => (
                  <Card key={order.id} className={`hover:shadow-md transition-shadow border-l-4 ${
                    order.status === 'delivered' ? 'border-l-green-500' : 'border-l-red-500'
                  }`}>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Order Info */}
                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            Commande #{order.order_number || order.id}
                          </h3>
                          <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(order.status)}
                            <span>{getStatusLabel(order.status)}</span>
                          </Badge>
                        </div>

                        {/* Customer Info */}
                        <div>
                          <h4 className="font-semibold mb-2">Client</h4>
                          <div className="space-y-1 text-sm">
                            <p>{order.customer_name || order.user?.name}</p>
                            <p className="text-gray-500">{order.delivery_address}</p>
                          </div>
                        </div>

                        {/* Amount */}
                        <div>
                          <h4 className="font-semibold mb-2">Montant</h4>
                          <p className="text-xl font-bold">{order.total?.toLocaleString()} FCFA</p>
                        </div>

                        {/* Date */}
                        <div className="text-right">
                          <h4 className="font-semibold mb-2">Date</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.delivered_at 
                              ? new Date(order.delivered_at).toLocaleDateString('fr-FR', { 
                                  day: 'numeric', 
                                  month: 'short', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : order.created_at 
                                ? new Date(order.created_at).toLocaleDateString('fr-FR')
                                : '-'
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </AppLayout>
    </>
  );
}
