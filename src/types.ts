export interface Customer {
  id: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  created_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  type: "Bluetooth" | "Non-Bluetooth";
  price: number;
  created_at?: string;
}

export interface Order {
  id: string;
  customer_id: string;
  product_variant_id: string;
  quantity: number;
  total_price: number;
  paid_amount: number;
  status: "pending" | "partial" | "paid";
  created_at: string;
  delivery_date?: string;
}