/*
  # Add cancelled status to orders

  1. Changes
    - Add 'cancelled' as a valid status for orders
    - Update the status check constraint to include the new status

  2. Notes
    - This is a non-destructive change that adds a new status option
    - Existing orders are not affected
*/

DO $$ 
BEGIN
  -- Modify the status check constraint to include 'cancelled'
  ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
  
  ALTER TABLE orders ADD CONSTRAINT orders_status_check 
    CHECK (status = ANY (ARRAY[
      'pending_price'::text,
      'pending_advance'::text,
      'advance_paid'::text,
      'in_production'::text,
      'ready'::text,
      'shipped'::text,
      'delivered'::text,
      'cancelled'::text
    ]));
END $$;