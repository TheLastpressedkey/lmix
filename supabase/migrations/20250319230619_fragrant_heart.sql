/*
  # Fix profiles policies to avoid infinite recursion

  1. Changes
    - Supprime les anciennes politiques
    - Crée de nouvelles politiques sans récursion
    - Ajoute une politique pour permettre l'insertion initiale
*/

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Les administrateurs peuvent tout voir" ON profiles;
DROP POLICY IF EXISTS "Les employés peuvent voir leur propre profil" ON profiles;

-- Nouvelle politique pour les administrateurs (sans récursion)
CREATE POLICY "Enable full access for admins"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    role = 'admin'
  )
  WITH CHECK (
    role = 'admin'
  );

-- Politique pour les employés
CREATE POLICY "Enable read access for users to their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
  );

-- Politique pour permettre l'insertion initiale
CREATE POLICY "Enable insert for authenticated users"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id
  );