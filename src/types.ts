export interface Customer {
  id: string;
  name: string;
  email: string;
  contact: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  type: "Bluetooth" | "Non-Bluetooth";
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  productVariantId: string;
  quantity: number;
  totalPrice: number;
  paidAmount: number;
  status: "pending" | "partial" | "paid";
  createdAt: string;
  deliveryDate?: string;
}
