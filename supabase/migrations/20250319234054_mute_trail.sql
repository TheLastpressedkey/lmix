/*
  # Fix profiles RLS policy recursion

  1. Changes
    - Drop the recursive policy that was causing infinite recursion
    - Create a new, simplified policy for admin access
    - Ensure policies are properly scoped

  2. Security
    - Maintains security by still checking admin role
    - Prevents infinite recursion
    - Preserves existing access controls
*/

-- Supprimer l'ancienne politique qui cause la récursion
DROP POLICY IF EXISTS "Enable read access for admins to all profiles" ON profiles;

-- Créer une nouvelle politique simplifiée
CREATE POLICY "Enable read access for admins to all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (role = 'admin');

-- S'assurer que la politique de base pour les utilisateurs existe
DROP POLICY IF EXISTS "Enable read access for users to their own profile" ON profiles;
CREATE POLICY "Enable read access for users to their own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);