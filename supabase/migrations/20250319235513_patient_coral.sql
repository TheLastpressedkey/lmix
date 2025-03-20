/*
  # Fix infinite recursion in profiles policies

  1. Changes
    - Drop all existing policies
    - Create new non-recursive policies
    - Simplify admin access check

  2. Security
    - Enable RLS on profiles table
    - Add policy for admin full access without recursion
    - Add policy for users to read their own profile
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable admin access" ON profiles;
DROP POLICY IF EXISTS "Enable user read own profile" ON profiles;
DROP POLICY IF EXISTS "Enable admin full access" ON profiles;
DROP POLICY IF EXISTS "Enable read access for admins to all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for users to their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable full access for admins" ON profiles;

-- Create new non-recursive policies
CREATE POLICY "Enable admin full access"
ON profiles
FOR ALL
TO authenticated
USING (
  role = 'admin'
);

CREATE POLICY "Enable user read own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);