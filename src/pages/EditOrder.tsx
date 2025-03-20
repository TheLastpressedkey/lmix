import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, LockIcon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { orderService } from '../services/orderService';
import type { Order } from '../types';
import { formatPrice } from '../utils/orderUtils';

export function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    product_name: '',
    quantity: 1,
    technical_details: '',
    comments: '',
    total_price: '',
    advance_percentage: '',
    advance_paid: false
  });

  useEffect(() => {
    if (!id) return;
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const orderData = await orderService.getOrderById(id);
      setOrder(orderData);
      setFormData({
        product_name: orderData.product_name,
        quantity: orderData.quantity,
        technical_details: orderData.technical_details || '',
        comments: orderData.comments || '',
        total_price: orderData.total_price?.toString() || '',
        advance_percentage: orderData.advance_percentage?.toString() || '',
        advance_paid: orderData.advance_paid
      });
    } catch (err) {
      console.error('Error loading order:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !user) return;

    try {
      setSaving(true);
      setError(null);

      // Prepare update data based on user role
      const updateData: Partial<Order> = {
        product_name: formData.product_name,
        quantity: parseInt(formData.quantity.toString(), 10),
        technical_details: formData.technical_details || null,
        comments: formData.comments || null,
      };

      // Only admins can update price-related fields
      if (isAdmin) {
        updateData.total_price = formData.total_price ? parseFloat(formData.total_price) : null;
        updateData.advance_percentage = formData.advance_percentage ? parseInt(formData.advance_percentage, 10) : null;
        updateData.advance_paid = formData.advance_paid;
      }

      const updatedOrder = await orderService.updateOrder(order.id, updateData);

      // Add history entry for price update if changed (admin only)
      if (isAdmin && formData.total_price && (!order.total_price || order.total_price.toString() !== formData.total_price)) {
        await orderService.addOrderHistory({
          order_id: order.id,
          status: order.status,
          comment: `Prix mis à jour : ${formatPrice(parseFloat(formData.total_price))}`,
          created_by: user.id
        });
      }

      navigate(`/orders/${updatedOrder.id}`);
    } catch (err) {
      console.error('Error updating order:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setSaving(false);
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
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(`/orders/${order.id}`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour aux détails
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Modifier la Commande #{order.tracking_number}
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <label htmlFor="product_name" className="block text-sm font-medium text-gray-700">
                Nom du Produit
              </label>
              <input
                type="text"
                id="product_name"
                value={formData.product_name}
                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantité
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="technical_details" className="block text-sm font-medium text-gray-700">
                Détails Techniques
              </label>
              <textarea
                id="technical_details"
                rows={3}
                value={formData.technical_details}
                onChange={(e) => setFormData({ ...formData, technical_details: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                Commentaires
              </label>
              <textarea
                id="comments"
                rows={3}
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Section prix - accessible uniquement aux administrateurs */}
            <div className={`lg:col-span-2 ${!isAdmin ? 'opacity-50' : ''}`}>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Informations de Paiement</h3>
                  {!isAdmin && (
                    <div className="ml-2 flex items-center text-sm text-gray-500">
                      <LockIcon className="w-4 h-4 mr-1" />
                      Réservé aux administrateurs
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <label htmlFor="total_price" className="block text-sm font-medium text-gray-700">
                      Prix Total (€)
                    </label>
                    <input
                      type="number"
                      id="total_price"
                      min="0"
                      step="0.01"
                      value={formData.total_price}
                      onChange={(e) => setFormData({ ...formData, total_price: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={!isAdmin}
                    />
                  </div>

                  <div>
                    <label htmlFor="advance_percentage" className="block text-sm font-medium text-gray-700">
                      Pourcentage d'Acompte
                    </label>
                    <input
                      type="number"
                      id="advance_percentage"
                      min="0"
                      max="100"
                      value={formData.advance_percentage}
                      onChange={(e) => setFormData({ ...formData, advance_percentage: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={!isAdmin}
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="advance_paid"
                        checked={formData.advance_paid}
                        onChange={(e) => setFormData({ ...formData, advance_paid: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={!isAdmin}
                      />
                      <label htmlFor="advance_paid" className="ml-2 block text-sm text-gray-900">
                        Acompte payé
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/orders/${order.id}`)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              disabled={saving}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}