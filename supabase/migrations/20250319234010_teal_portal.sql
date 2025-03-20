/*
  # Add function to get all profiles

  Cette fonction permet aux administrateurs de récupérer tous les profils
  sans être limités par les politiques RLS.
*/

-- Créer une nouvelle politique pour permettre aux administrateurs de voir tous les profils
CREATE POLICY "Enable read access for admins to all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);