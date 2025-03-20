import { supabase } from '../lib/supabase';
import type { Order, OrderHistory } from '../types';

export const orderService = {
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select(`
          *,
          customer:customers(*),
          profiles!orders_created_by_fkey (
            id,
            email,
            role
          )
        `)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Aucune commande créée');

      return {
        ...data,
        creator: data.profiles
      };
    } catch (error) {
      console.error('Error in createOrder:', error);
      throw error;
    }
  },

  async getOrders(): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          profiles!orders_created_by_fkey (
            id,
            email,
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(order => ({
        ...order,
        creator: order.profiles
      }));
    } catch (error) {
      console.error('Error in getOrders:', error);
      throw error;
    }
  },

  async getOrderById(id: string): Promise<Order> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          profiles!orders_created_by_fkey (
            id,
            email,
            role
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Commande non trouvée');

      return {
        ...data,
        creator: data.profiles
      };
    } catch (error) {
      console.error('Error in getOrderById:', error);
      throw error;
    }
  },

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    try {
      // Effectuer la mise à jour
      const { error: updateError } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;

      // Récupérer la commande mise à jour
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          profiles!orders_created_by_fkey (
            id,
            email,
            role
          )
        `)
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error('Commande non trouvée après mise à jour');

      return {
        ...data,
        creator: data.profiles
      };
    } catch (error) {
      console.error('Error in updateOrder:', error);
      throw error;
    }
  },

  async deleteOrder(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error in deleteOrder:', error);
      throw error;
    }
  },

  async getOrderHistory(orderId: string): Promise<OrderHistory[]> {
    try {
      const { data, error } = await supabase
        .from('order_history')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error in getOrderHistory:', error);
      throw error;
    }
  },

  async addOrderHistory(historyData: Partial<OrderHistory>): Promise<OrderHistory> {
    try {
      const { data, error } = await supabase
        .from('order_history')
        .insert([historyData])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Aucun historique créé');

      return data;
    } catch (error) {
      console.error('Error in addOrderHistory:', error);
      throw error;
    }
  },

  async getOrderByTrackingNumber(trackingNumber: string): Promise<Order> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          profiles!orders_created_by_fkey (
            id,
            email,
            role
          )
        `)
        .eq('tracking_number', trackingNumber)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Commande non trouvée');

      return {
        ...data,
        creator: data.profiles
      };
    } catch (error) {
      console.error('Error in getOrderByTrackingNumber:', error);
      throw error;
    }
  }
};