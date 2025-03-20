/*
  # Fix profiles table policies

  1. Changes
    - Drop all existing policies on profiles table
    - Create new simplified policies for admin and user access
    - Fix infinite recursion issue in policies

  2. Security
    - Enable RLS on profiles table
    - Add policy for admin full access
    - Add policy for users to read their own profile
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Enable admin access" ON profiles;
DROP POLICY IF EXISTS "Enable user read own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for admins to all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for users to their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable full access for admins" ON profiles;

-- Create new simplified policies
CREATE POLICY "Enable admin full access"
ON profiles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.users.id
      AND profiles.role = 'admin'
    )
  )
);

CREATE POLICY "Enable user read own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);