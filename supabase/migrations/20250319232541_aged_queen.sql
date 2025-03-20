/*
  # Create order history table and policies

  1. New Tables
    - `order_history`
      - `id` (uuid, primary key)
      - `order_id` (uuid, references orders)
      - `status` (text)
      - `comment` (text)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Policies for admins and employees
*/

CREATE TABLE IF NOT EXISTS order_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) NOT NULL,
  status text NOT NULL,
  comment text,
  created_by uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_history ENABLE ROW LEVEL SECURITY;

-- Admin full access policy
CREATE POLICY "Enable full access for admins"
  ON order_history
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Employee read access policy
CREATE POLICY "Enable read access for employees"
  ON order_history
  FOR SELECT
  TO authenticated
  USING (true);

-- Employee insert policy
CREATE POLICY "Enable insert for employees"
  ON order_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by
  );