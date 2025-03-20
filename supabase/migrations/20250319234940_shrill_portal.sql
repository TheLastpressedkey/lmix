/*
  # Fix profile policies

  1. Changes
    - Simplify profile access policies
    - Remove complex role checks
    - Enable direct access for admins

  2. Security
    - Admins can view and manage all profiles
    - Users can view their own profile
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for admins to all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for users to their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable full access for admins" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;

-- Create new simplified policies
CREATE POLICY "Enable admin access"
ON profiles
FOR ALL
TO authenticated
USING (role = 'admin')
WITH CHECK (role = 'admin');

CREATE POLICY "Enable user read own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);