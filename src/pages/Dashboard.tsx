import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Package, DollarSign, Clock, Calendar, ChevronDown, Eye } from 'lucide-react';
import { orderService } from '../services/orderService';
import type { Order } from '../types';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatPrice } from '../utils/orderUtils';
import { useNavigate } from 'react-router-dom';

type Period = 'today' | 'week' | 'month' | 'year' | 'all';

interface DashboardStats {
  totalOrders: number;
  totalProcessingTime: number;
  completedOrders: number;
  ordersByStatus: Record<Order['status'], number>;
}

export function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const [period, setPeriod] = useState<Period>('month');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalProcessingTime: 0,
    completedOrders: 0,
    ordersByStatus: {
      pending_price: 0,
      pending_advance: 0,
      advance_paid: 0,
      in_production: 0,
      ready: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    }
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [period]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les commandes
      const orders = await orderService.getOrders();

      // Filtrer les commandes selon la période
      let filteredOrders = filterOrdersByPeriod(orders, period);

      // Pour les employés, filtrer uniquement leurs commandes
      if (!isAdmin && user) {
        filteredOrders = filteredOrders.filter(order => order.created_by === user.id);
      }

      // Calculer les statistiques
      const completedOrders = filteredOrders.filter(order => order.status === 'delivered');
      const averageTime = calculateAverageProcessingTime(completedOrders);

      const stats: DashboardStats = {
        totalOrders: filteredOrders.length,
        totalProcessingTime: averageTime,
        completedOrders: completedOrders.length,
        ordersByStatus: {
          pending_price: 0,
          pending_advance: 0,
          advance_paid: 0,
          in_production: 0,
          ready: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0
        }
      };

      // Calculer le nombre de commandes par statut
      filteredOrders.forEach(order => {
        stats.ordersByStatus[order.status]++;
      });

      setStats(stats);
      setRecentOrders(filteredOrders.slice(0, 5)); // Garder les 5 commandes les plus récentes

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageProcessingTime = (orders: Order[]): number => {
    if (orders.length === 0) return 0;

    const processingTimes = orders.map(order => {
      const startDate = new Date(order.created_at);
      const endDate = new Date(order.updated_at);
      return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24); // Convertir en jours
    });

    return processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length;
  };

  const filterOrdersByPeriod = (orders: Order[], period: Period): Order[] => {
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        return orders;
    }

    return orders.filter(order => new Date(order.created_at) >= startDate);
  };

  const periodLabels: Record<Period, string> = {
    today: "Aujourd'hui",
    week: '7 derniers jours',
    month: '30 derniers jours',
    year: '12 derniers mois',
    all: 'Toutes les périodes'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdmin ? 'Tableau de Bord Administrateur' : 'Mes Commandes'}
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {periodLabels[period]}
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {showPeriodDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {Object.entries(periodLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setPeriod(key as Period);
                      setShowPeriodDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      period === key ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Commandes Totales"
          value={stats.totalOrders.toString()}
          icon={<Package className="w-6 h-6" />}
          color="blue"
          loading={loading}
        />
        <DashboardCard
          title="Commandes Terminées"
          value={stats.completedOrders.toString()}
          icon={<Package className="w-6 h-6" />}
          color="green"
          loading={loading}
        />
        <DashboardCard
          title="Délai Moyen de Traitement"
          value={`${Math.round(stats.totalProcessingTime)} jours`}
          icon={<Clock className="w-6 h-6" />}
          color="purple"
          loading={loading}
        />
      </div>

      {/* Répartition des commandes par statut */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Répartition des Commandes par Statut
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Object.entries(stats.ordersByStatus).map(([status, count]) => (
            <div
              key={status}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-3 ${ORDER_STATUS_COLORS[status as Order['status']]}`} />
                <span className="text-sm font-medium text-gray-900">
                  {ORDER_STATUS_LABELS[status as Order['status']]}
                </span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Commandes Récentes */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Commandes Récentes
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° de Suivi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Chargement...
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucune commande trouvée
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.tracking_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.product_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Voir détails
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  loading?: boolean;
}

function DashboardCard({ title, value, icon, color, loading = false }: DashboardCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">
            {loading ? (
              <span className="inline-block w-16 h-6 bg-gray-200 rounded animate-pulse" />
            ) : (
              value
            )}
          </p>
        </div>
      </div>
    </div>
  );
}