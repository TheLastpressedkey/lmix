import { supabase } from '../lib/supabase';
import type { Customer } from '../types';

export const customerService = {
  async getAllCustomers(): Promise<Customer[]> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error in getAllCustomers:', error);
      throw error;
    }
  },

  async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Client non créé');

      return data;
    } catch (error) {
      console.error('Error in createCustomer:', error);
      throw error;
    }
  },

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Client non trouvé');

      return data;
    } catch (error) {
      console.error('Error in updateCustomer:', error);
      throw error;
    }
  },

  async deleteCustomer(id: string): Promise<void> {
    try {
      // Récupérer toutes les commandes du client
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id')
        .eq('customer_id', id);

      if (ordersError) throw ordersError;

      // Pour chaque commande, supprimer d'abord l'historique
      for (const order of orders || []) {
        const { error: historyError } = await supabase
          .from('order_history')
          .delete()
          .eq('order_id', order.id);

        if (historyError) throw historyError;
      }

      // Supprimer toutes les commandes du client
      if (orders && orders.length > 0) {
        const { error: ordersDeleteError } = await supabase
          .from('orders')
          .delete()
          .eq('customer_id', id);

        if (ordersDeleteError) throw ordersDeleteError;
      }

      // Enfin, supprimer le client
      const { error: customerError } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (customerError) throw customerError;
    } catch (error) {
      console.error('Error in deleteCustomer:', error);
      throw error;
    }
  }
};
