import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Edit, Trash2, RefreshCw, Filter, X, Printer } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { orderService } from '../services/orderService';
import type { Order, OrderStatus } from '../types';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatPrice } from '../utils/orderUtils';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';

type DateFilter = 'all' | 'today' | 'week' | 'month' | '3months' | 'year';

interface Filters {
  status: OrderStatus | 'all';
  date: DateFilter;
  minPrice: string;
  maxPrice: string;
  advancePaid: 'all' | 'yes' | 'no';
}

export function Orders() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    date: 'all',
    minPrice: '',
    maxPrice: '',
    advancePaid: 'all'
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      let data = await orderService.getOrders();

      // Filtrer les commandes pour les employés
      if (!isAdmin && user) {
        data = data.filter(order => order.created_by === user.id);
      }

      setOrders(data);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      return;
    }

    try {
      setLoading(true);
      await orderService.deleteOrder(orderId);
      await loadOrders();
    } catch (err) {
      console.error('Error deleting order:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      date: 'all',
      minPrice: '',
      maxPrice: '',
      advancePaid: 'all'
    });
  };

  const filterOrders = (orders: Order[]) => {
    return orders.filter(order => {
      // Filtre de recherche textuelle
      const searchMatch = 
        order.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (isAdmin && order.creator?.email.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!searchMatch) return false;

      // Filtre par statut
      if (filters.status !== 'all' && order.status !== filters.status) {
        return false;
      }

      // Filtre par date
      const orderDate = new Date(order.created_at);
      const now = new Date();
      let dateMatch = true;

      switch (filters.date) {
        case 'today':
          dateMatch = orderDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          dateMatch = orderDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          dateMatch = orderDate >= monthAgo;
          break;
        case '3months':
          const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
          dateMatch = orderDate >= threeMonthsAgo;
          break;
        case 'year':
          const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
          dateMatch = orderDate >= yearAgo;
          break;
      }

      if (!dateMatch) return false;

      // Filtre par prix
      if (filters.minPrice && order.total_price && order.total_price < parseFloat(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && order.total_price && order.total_price > parseFloat(filters.maxPrice)) {
        return false;
      }

      // Filtre par statut de l'acompte
      if (filters.advancePaid !== 'all') {
        const isPaid = filters.advancePaid === 'yes';
        if (order.advance_paid !== isPaid) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredOrders = filterOrders(orders);

  return (
    <div className="space-y-6">
      <PageHeader
        title={isAdmin ? 'Gestion des Commandes' : 'Mes Commandes'}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={handlePrint}
            >
              <Printer className="w-5 h-5 mr-2" />
              Imprimer
            </Button>
            <Button
              variant="secondary"
              onClick={loadOrders}
              isLoading={loading}
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Actualiser
            </Button>
            <Button
              onClick={() => navigate('/orders/new')}
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle Commande
            </Button>
          </>
        }
      />

      <Card>
        <Card.Body>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher une commande..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>
            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-5 h-5 mr-2" />
              Filtres
              {showFilters && <X className="w-4 h-4 ml-2" />}
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Select
                label="Statut"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as OrderStatus | 'all' })}
                options={[
                  { value: 'all', label: 'Tous les statuts' },
                  { value: 'pending_price', label: 'En attente de prix' },
                  { value: 'pending_advance', label: "En attente d'acompte" },
                  { value: 'advance_paid', label: 'Acompte payé' },
                  { value: 'in_production', label: 'En production' },
                  { value: 'ready', label: 'Prêt' },
                  { value: 'shipped', label: 'Expédié' },
                  { value: 'delivered', label: 'Livré' },
                  { value: 'cancelled', label: 'Annulé' }
                ]}
              />

              <Select
                label="Période"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value as DateFilter })}
                options={[
                  { value: 'all', label: 'Toutes les périodes' },
                  { value: 'today', label: "Aujourd'hui" },
                  { value: 'week', label: '7 derniers jours' },
                  { value: 'month', label: '30 derniers jours' },
                  { value: '3months', label: '3 derniers mois' },
                  { value: 'year', label: '12 derniers mois' }
                ]}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix
                </label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  />
                </div>
              </div>

              <Select
                label="Acompte"
                value={filters.advancePaid}
                onChange={(e) => setFilters({ ...filters, advancePaid: e.target.value as 'all' | 'yes' | 'no' })}
                options={[
                  { value: 'all', label: 'Tous' },
                  { value: 'yes', label: 'Payé' },
                  { value: 'no', label: 'Non payé' }
                ]}
              />

              <div className="md:col-span-2 lg:col-span-4 flex justify-end">
                <Button
                  variant="ghost"
                  onClick={resetFilters}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            </div>
          )}

          <Table>
            <Table.Header>
              <tr>
                <Table.HeaderCell>N° de Suivi</Table.HeaderCell>
                <Table.HeaderCell>Client</Table.HeaderCell>
                <Table.HeaderCell>Produit</Table.HeaderCell>
                <Table.HeaderCell>Statut</Table.HeaderCell>
                <Table.HeaderCell>Prix Total</Table.HeaderCell>
                {isAdmin && (
                  <Table.HeaderCell>Créateur</Table.HeaderCell>
                )}
                <Table.HeaderCell className="print:hidden">Actions</Table.HeaderCell>
              </tr>
            </Table.Header>
            <tbody>
              {loading && !orders.length ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Chargement des commandes...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucune commande trouvée
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <Table.Row key={order.id}>
                    <Table.Cell className="font-medium text-gray-900">
                      {order.tracking_number}
                    </Table.Cell>
                    <Table.Cell>
                      {order.customer ? (
                        <>
                          <div className="font-medium text-gray-900">
                            {order.customer.first_name} {order.customer.last_name}
                          </div>
                          <div className="text-gray-500">{order.customer.email}</div>
                        </>
                      ) : (
                        'Client inconnu'
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <div>{order.product_name}</div>
                      <div className="text-gray-500 text-xs">Quantité: {order.quantity}</div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        variant={
                          order.status === 'delivered' ? 'success' :
                          order.status === 'cancelled' ? 'danger' :
                          order.status === 'pending_price' ? 'warning' :
                          'primary'
                        }
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="font-medium">{formatPrice(order.total_price)}</div>
                      {order.advance_percentage && (
                        <div className="text-gray-500 text-xs">
                          Acompte: {order.advance_percentage}%
                          {order.advance_paid && ' (Payé)'}
                        </div>
                      )}
                    </Table.Cell>
                    {isAdmin && (
                      <Table.Cell>
                        {order.creator?.email || 'Inconnu'}
                      </Table.Cell>
                    )}
                    <Table.Cell className="print:hidden">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/orders/${order.id}/edit`)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="w-5 h-5" />
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}