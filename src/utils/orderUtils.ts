import type { OrderStatus } from '../types';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_price: 'En attente de prix',
  pending_advance: 'En attente d\'acompte',
  advance_paid: 'Acompte payé',
  in_production: 'En production',
  ready: 'Prêt',
  shipped: 'Expédié',
  delivered: 'Livré',
  cancelled: 'Annulé'
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending_price: 'bg-gray-100 text-gray-800',
  pending_advance: 'bg-yellow-100 text-yellow-800',
  advance_paid: 'bg-blue-100 text-blue-800',
  in_production: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800'
};

export function generateTrackingNumber(): string {
  const prefix = 'LMI';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export function formatPrice(price?: number): string {
  if (price === undefined || price === null) return '---';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

export function calculateAdvanceAmount(totalPrice?: number, advancePercentage?: number): number | undefined {
  if (!totalPrice || !advancePercentage) return undefined;
  return (totalPrice * advancePercentage) / 100;
}