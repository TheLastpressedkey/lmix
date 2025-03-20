import { supabase } from '../lib/supabase';
import type { User } from '../types';

export const userService = {
  async getAllProfiles(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error in getAllProfiles:', error);
      throw error;
    }
  },

  async createUser(userData: { email: string; password: string; role: 'admin' | 'employee' }): Promise<User> {
    try {
      // Créer l'utilisateur dans Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Aucun utilisateur créé');

      // Créer le profil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email: userData.email,
            role: userData.role,
          }
        ])
        .select()
        .single();

      if (profileError) throw profileError;
      if (!profileData) throw new Error('Profil non créé');

      return profileData;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  },

  async updateProfile(id: string, updates: Partial<User>): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Utilisateur non trouvé');

      return data;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  },

  async deleteProfile(id: string): Promise<void> {
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (profileError) throw profileError;
    } catch (error) {
      console.error('Error in deleteProfile:', error);
      throw error;
    }
  }
};