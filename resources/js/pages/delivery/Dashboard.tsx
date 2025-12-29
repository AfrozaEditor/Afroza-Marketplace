import { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { MapPin, Package, Clock, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MapZone from '@/components/MapZone';
import { User } from '@/types';
import axios from 'axios';

interface DeliveryZone {
  latitude: number;
  longitude: number;
  radius_km: number;
}

interface OrderLocation {
  id: number;
  status: string;
  total: number;
  delivery_address: string;
  latitude: number;
  longitude: number;
  user: User;
  items_count: number;
}

interface AssignedOrder extends OrderLocation {
  items: Array<{ id: number; quantity: number; price: number }>;
}

export default function DeliveryDashboard() {
  const page = usePage();
  const [activeTab, setActiveTab] = useState<'available' | 'assigned'>('available');
  const [availableOrders, setAvailableOrders] = useState<OrderLocation[]>([]);
  const [assignedOrders, setAssignedOrders] = useState<AssignedOrder[]>([]);
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderLocation | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Get available orders
      const availableRes = await fetch('/delivery/available-orders');
      const availableData = await availableRes.json();
      setAvailableOrders(availableData.orders || []);
      setDeliveryZone(availableData.delivery_zone);

      // Get assigned orders
      const assignedRes = await fetch('/delivery/assigned-orders');
      const assignedData = await assignedRes.json();
      setAssignedOrders(assignedData.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const ordersArray = Object.values(availableOrders);

  const acceptOrder = async (orderId: number) => {
    try {
      const res = await axios.post(`/delivery/accept-order/${orderId}`);

      if (res.data) {
        // Move order from available to assigned
        const order = ordersArray.find((o) => o.id === orderId);
        if (order) {
          setAvailableOrders(ordersArray.filter((o) => o.id !== orderId));
          setAssignedOrders([...assignedOrders, order as AssignedOrder]);
        }
      }
    } catch (error) {
      console.error('Failed to accept order:', error);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const res = await axios.patch(`/delivery/update-order-status/${orderId}`,{
        status: status,
    });

      if (res.data) {
        // Update order in assigned list
        setAssignedOrders(
          assignedOrders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          )
        );
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  console.log((availableOrders))

  console.log(ordersArray)

  console.log(Number(deliveryZone?.longitude).toFixed(4))

  return (
    <>
      <Head title="Tableau de bord livreur" />
      <AppLayout>
        <div className="container mx-auto py-10 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord livreur</h1>
            <p className="text-gray-600">Gérez vos commandes de livraison</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Commandes disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ordersArray.length}</div>
                <p className="text-xs text-gray-500 mt-1">Dans votre zone</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">En cours de livraison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {assignedOrders.filter((o) => o.status === 'pending').length}
                </div>
                <p className="text-xs text-gray-500 mt-1">À traiter</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Livrées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {ordersArray.filter((o) => o.status === 'delivered').length}
                </div>
                <p className="text-xs text-gray-500 mt-1">Complétées</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab('available')}
              className={`px-4 py-2 font-medium border-b-2 ${
                activeTab === 'available'
                  ? 'border-chart-3 text-chart-3'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Commandes disponibles ({ordersArray.length})
            </button>
            <button
              onClick={() => setActiveTab('assigned')}
              className={`px-4 py-2 font-medium border-b-2 ${
                activeTab === 'assigned'
                  ? 'border-chart-3 text-chart-3'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Mes commandes ({assignedOrders.length})
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chart-3"></div>
              </div>
              <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
          ) : activeTab === 'available' ? (
            <div className="space-y-4">
              {availableOrders.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Package className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600">Aucune commande disponible dans votre zone</p>
                  </CardContent>
                </Card>
              ) : (
                ordersArray.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Order Info */}
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Commande #{order.id}</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{order.delivery_address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{order.items_count} article(s)</span>
                            </div>
                            <div className="flex items-center gap-2 font-semibold">
                              <span className="text-lg text-chart-3">{order.total} FCFA</span>
                            </div>
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div>
                          <h4 className="font-semibold mb-2">Client</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-gray-600">Nom:</span> {order.user.name}</p>
                            <p><span className="text-gray-600">Email:</span> {order.user.email}</p>
                            {/* <p><span className="text-gray-600">Tél:</span> {order.user.phone}</p> */}
                          </div>
                        </div>

                        {/* Action */}
                        <div className="flex items-end justify-end">
                          <Button
                            onClick={() => acceptOrder(order.id)}
                            className="bg-primary hover:bg-primary/70"
                          >
                            Accepter
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {assignedOrders.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Truck className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600">Vous n'avez aucune commande assignée</p>
                  </CardContent>
                </Card>
              ) : (
                assignedOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Order Info */}
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Commande #{order.id}</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{order.delivery_address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{order.items_count} article(s)</span>
                            </div>
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div>
                          <h4 className="font-semibold mb-2">Client</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-gray-600">Nom:</span> {order.user.name}</p>
                            <p><span className="text-gray-600">Email:</span> {order.user.email}</p>
                          </div>
                        </div>

                        {/* Status */}
                        <div>
                          <h4 className="font-semibold mb-2">Statut</h4>
                          <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(order.status)}
                            {order.status === 'pending'
                              ? 'En cours'
                              : order.status === 'delivered'
                              ? 'Livrée'
                              : 'Impossible'}
                          </Badge>
                        </div>

                        {/* Actions */}
                        <div className="flex items-end justify-end gap-2">
                          {order.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateOrderStatus(order.id, 'delivered')
                                }
                              >
                                Marquer livrée
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateOrderStatus(order.id, 'cancelled')
                                }
                              >
                                Impossible
                              </Button>
                            </>
                          )}
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
