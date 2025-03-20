import React, { useState } from 'react';
import { Search, Package, ArrowLeft } from 'lucide-react';
import { orderService } from '../services/orderService';
import type { Order } from '../types';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatPrice } from '../utils/orderUtils';

export function TrackOrder() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const orderData = await orderService.getOrderByTrackingNumber(trackingNumber);
      setOrder(orderData);
      setSearched(true);
    } catch (err) {
      console.error('Error tracking order:', err);
      setError('Commande non trouvée. Veuillez vérifier le numéro de suivi.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTrackingNumber('');
    setOrder(null);
    setError(null);
    setSearched(false);
  };

  const renderStatusTimeline = () => {
    const statuses: Order['status'][] = [
      'pending_price',
      'pending_advance',
      'advance_paid',
      'in_production',
      'ready',
      'shipped',
      'delivered'
    ];

    const currentStatusIndex = statuses.indexOf(order?.status || 'pending_price');

    return (
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-between">
          {statuses.map((status, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;

            return (
              <div key={status} className="flex flex-col items-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    isCompleted
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}
                >
                  <Package className={`h-6 w-6 ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-xs font-medium ${isCompleted ? 'text-blue-600' : 'text-gray-400'}`}>
                    {ORDER_STATUS_LABELS[status]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {!searched ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Suivre Votre Commande
              </h1>
              <p className="text-gray-600">
                Entrez votre numéro de suivi pour connaître l'état de votre commande
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-8">
              <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Numéro de suivi (ex: LMI123ABC)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                {error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Recherche...' : 'Suivre la commande'}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleReset}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Nouvelle recherche
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Commande #{order?.tracking_number}
              </h1>
            </div>

            {error ? (
              <div className="bg-white shadow rounded-lg p-8 text-center">
                <div className="text-red-600 mb-4">{error}</div>
                <button
                  onClick={handleReset}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Essayer un autre numéro
                </button>
              </div>
            ) : order ? (
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">
                    Statut de la Commande
                  </h2>
                  {renderStatusTimeline()}
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Détails de la Commande
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Produit</div>
                      <div className="mt-1 text-sm text-gray-900">{order.product_name}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Quantité</div>
                      <div className="mt-1 text-sm text-gray-900">{order.quantity}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Date de création</div>
                      <div className="mt-1 text-sm text-gray-900">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Statut</div>
                      <div className="mt-1">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
                          {ORDER_STATUS_LABELS[order.status]}
                        </span>
                      </div>
                    </div>
                    {order.total_price && (
                      <div>
                        <div className="text-sm font-medium text-gray-500">Prix Total</div>
                        <div className="mt-1 text-sm font-semibold text-gray-900">
                          {formatPrice(order.total_price)}
                        </div>
                      </div>
                    )}
                    {order.advance_percentage && (
                      <div>
                        <div className="text-sm font-medium text-gray-500">
                          Acompte ({order.advance_percentage}%)
                        </div>
                        <div className="mt-1">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            order.advance_paid
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.advance_paid ? 'Payé' : 'En attente'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {order.customer && (
                  <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Informations Client
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                        <div className="sm:col-span-2">
                          <div className="text-sm font-medium text-gray-500">Adresse</div>
                          <div className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                            {order.customer.address}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}