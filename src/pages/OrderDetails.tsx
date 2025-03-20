import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Clock, Package } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { orderService } from '../services/orderService';
import type { Order, OrderHistory } from '../types';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatPrice } from '../utils/orderUtils';

export function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const [order, setOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<Order['status']>('pending_price');
  const [statusComment, setStatusComment] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const [orderData, historyData] = await Promise.all([
        orderService.getOrderById(id),
        orderService.getOrderHistory(id)
      ]);
      setOrder(orderData);
      setOrderHistory(historyData);
      setNewStatus(orderData.status);
    } catch (err) {
      console.error('Error loading order details:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !user) return;

    try {
      setUpdating(true);
      setError(null);

      // Update order status
      const updatedOrder = await orderService.updateOrder(order.id, {
        status: newStatus
      });

      // Add history entry
      await orderService.addOrderHistory({
        order_id: order.id,
        status: newStatus,
        comment: statusComment,
        created_by: user.id
      });

      setOrder(updatedOrder);
      await loadOrderDetails();
      setShowStatusModal(false);
      setStatusComment('');
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">
          {error || 'Commande non trouvée'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux commandes
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Commande #{order.tracking_number}
          </h1>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowStatusModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Clock className="w-5 h-5 mr-2" />
            Mettre à jour le statut
          </button>
          <button
            onClick={() => navigate(`/orders/${order.id}/edit`)}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <Edit className="w-5 h-5 mr-2" />
            Modifier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Informations de la commande */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Détails de la Commande
          </h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Statut</div>
              <div className="mt-1">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Produit</div>
              <div className="mt-1 text-sm text-gray-900">{order.product_name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Quantité</div>
              <div className="mt-1 text-sm text-gray-900">{order.quantity}</div>
            </div>
            {order.technical_details && (
              <div>
                <div className="text-sm font-medium text-gray-500">Détails Techniques</div>
                <div className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {order.technical_details}
                </div>
              </div>
            )}
            {order.comments && (
              <div>
                <div className="text-sm font-medium text-gray-500">Commentaires</div>
                <div className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {order.comments}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informations de paiement */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Informations de Paiement
          </h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Prix Total</div>
              <div className="mt-1 text-lg font-semibold text-gray-900">
                {formatPrice(order.total_price)}
              </div>
            </div>
            {order.advance_percentage && (
              <div>
                <div className="text-sm font-medium text-gray-500">
                  Acompte ({order.advance_percentage}%)
                </div>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  {formatPrice((order.total_price || 0) * (order.advance_percentage / 100))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informations client */}
        {order.customer && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Informations Client
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Nom</div>
                <div className="mt-1 text-sm text-gray-900">
                  {order.customer.first_name} {order.customer.last_name}
                </div>
              </div>
              {order.customer.email && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Email</div>
                  <div className="mt-1 text-sm text-gray-900">
                    {order.customer.email}
                  </div>
                </div>
              )}
              {order.customer.phone && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Téléphone</div>
                  <div className="mt-1 text-sm text-gray-900">
                    {order.customer.phone}
                  </div>
                </div>
              )}
              {order.customer.address && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Adresse</div>
                  <div className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                    {order.customer.address}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Historique des statuts */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Historique des Statuts
          </h2>
          <div className="space-y-4">
            {orderHistory.map((history) => (
              <div
                key={history.id}
                className="flex items-start space-x-3 border-l-2 border-gray-200 pl-4 pb-4"
              >
                <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ORDER_STATUS_COLORS[history.status]}`}>
                      {ORDER_STATUS_LABELS[history.status]}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(history.created_at).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  {history.comment && (
                    <p className="mt-1 text-sm text-gray-600">
                      {history.comment}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de mise à jour du statut */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium mb-4">Mettre à jour le Statut</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Nouveau Statut
                </label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as Order['status'])}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="pending_price">En attente de prix</option>
                  <option value="pending_advance">En attente d'acompte</option>
                  <option value="advance_paid">Acompte payé</option>
                  <option value="in_production">En production</option>
                  <option value="ready">Prêt</option>
                  <option value="shipped">Expédié</option>
                  <option value="delivered">Livré</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                  Commentaire (optionnel)
                </label>
                <textarea
                  id="comment"
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowStatusModal(false);
                    setStatusComment('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  disabled={updating}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={updating}
                >
                  {updating ? 'Mise à jour...' : 'Mettre à jour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}