import { create } from 'zustand';
import type { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  signIn: async (email: string, password: string) => {
    try {
      // Tentative de connexion
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      if (!authData.user) throw new Error('Aucune donnée utilisateur reçue');

      // Récupération du profil utilisateur
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, role, created_at')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;
      if (!profileData) throw new Error('Profil utilisateur non trouvé');

      // Mise à jour du state avec les données du profil
      set({
        user: {
          id: profileData.id,
          email: profileData.email,
          role: profileData.role,
          created_at: profileData.created_at,
        },
      });

      return { error: null };
    } catch (error) {
      console.error('Error during sign in:', error);
      return { error: error as Error };
    }
  },
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  },
}));