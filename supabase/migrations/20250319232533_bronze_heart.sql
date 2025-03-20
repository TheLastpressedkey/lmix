/*
  # Create orders table and policies

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `tracking_number` (text, unique)
      - `customer_id` (uuid, references customers)
      - `status` (text, with check constraint)
      - `product_name` (text)
      - `quantity` (integer)
      - `technical_details` (text)
      - `comments` (text)
      - `total_price` (decimal)
      - `advance_percentage` (integer)
      - `advance_paid` (boolean)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Policies for admins and employees
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES customers(id) NOT NULL,
  status text NOT NULL CHECK (
    status IN (
      'pending_price',
      'pending_advance',
      'advance_paid',
      'in_production',
      'ready',
      'shipped',
      'delivered'
    )
  ),
  product_name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  technical_details text,
  comments text,
  total_price decimal(10,2),
  advance_percentage integer CHECK (advance_percentage BETWEEN 0 AND 100),
  advance_paid boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Trigger for updating updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Admin full access policy
CREATE POLICY "Enable full access for admins"
  ON orders
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
  ON orders
  FOR SELECT
  TO authenticated
  USING (true);

-- Employee insert policy
CREATE POLICY "Enable insert for employees"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by
  );

-- Employee update policy for their own records
CREATE POLICY "Enable update for employees on their records"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid()
  )
  WITH CHECK (
    created_by = auth.uid()
  );