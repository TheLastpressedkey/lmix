/*
  # Fix profiles queries and constraints

  1. Changes
    - Add missing check constraint for role
    - Update profiles table constraints
    - Fix foreign key references

  2. Security
    - Maintain existing RLS policies
    - Ensure proper role validation
*/

-- Ensure role check constraint exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_role_check'
  ) THEN
    ALTER TABLE profiles 
    ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('admin', 'employee'));
  END IF;
END $$;

-- Ensure foreign key references are correct
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_id_fkey'
  ) THEN
    ALTER TABLE profiles
    ADD CONSTRAINT profiles_id_fkey 
    FOREIGN KEY (id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;
  END IF;
END $$;

-- Add index on email for better query performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);

-- Add index on role for better query performance
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);