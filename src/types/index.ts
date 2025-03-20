export type User = {
  id: string;
  email: string;
  role: 'admin' | 'employee';
  created_at: string;
};

export type Customer = {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type OrderStatus = 
  | 'pending_price'
  | 'pending_advance'
  | 'advance_paid'
  | 'in_production'
  | 'ready'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type Order = {
  id: string;
  tracking_number: string;
  customer_id: string;
  customer?: Customer;
  creator?: User;
  profiles?: User;
  status: OrderStatus;
  product_name: string;
  quantity: number;
  technical_details?: string;
  comments?: string;
  total_price?: number;
  advance_percentage?: number;
  advance_paid: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type OrderHistory = {
  id: string;
  order_id: string;
  status: OrderStatus;
  comment?: string;
  created_by: string;
  created_at: string;
};