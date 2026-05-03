import { Customer, Product, ProductVariant, Order } from "../types";
import { supabase, db } from "./supabase";

export const api = {
  getCustomers: async (): Promise<Customer[]> => {
    const { data, error } = await db.customers.getAll();
    if (error) throw error;
    return data || [];
  },

  createCustomer: async (customer: Partial<Customer>): Promise<Customer> => {
    const id = crypto.randomUUID();
    const { data, error } = await db.customers.create({ id, ...customer } as Customer);
    if (error) throw error;
    return data!;
  },

  updateCustomer: async (id: string, updates: Partial<Customer>): Promise<Customer> => {
    const { data, error } = await db.customers.update(id, updates);
    if (error) throw error;
    return data!;
  },

  deleteCustomer: async (id: string): Promise<void> => {
    const { error } = await db.customers.delete(id);
    if (error) throw error;
  },

  subscribeToCustomers: (callback: (payload: any) => void) => {
    return db.customers.subscribe(callback);
  },

  getProducts: async (): Promise<Product[]> => {
    const { data, error } = await db.products.getAll();
    if (error) throw error;
    return data || [];
  },

  getVariants: async (): Promise<ProductVariant[]> => {
    const { data, error } = await db.variants.getAll();
    if (error) throw error;
    return data || [];
  },

  getOrders: async (): Promise<Order[]> => {
    const { data, error } = await db.orders.getAll();
    if (error) throw error;
    return data || [];
  },

  createOrder: async (order: Partial<Order>): Promise<Order> => {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const total_price = order.total_price || 0;
    const paid_amount = order.paid_amount || 0;
    const status = order.status || (paid_amount >= total_price ? "paid" : paid_amount > 0 ? "partial" : "pending");
    
    const { data, error } = await db.orders.create({
      id,
      created_at: createdAt,
      customer_id: order.customer_id,
      product_variant_id: order.product_variant_id,
      quantity: order.quantity || 1,
      total_price,
      paid_amount,
      status,
      delivery_date: order.delivery_date,
    } as Order);
    if (error) throw error;
    return data!;
  },

  updateOrder: async (id: string, updates: Partial<Order>): Promise<Order> => {
    const { data, error } = await db.orders.update(id, updates);
    if (error) throw error;
    return data!;
  },

  subscribeToOrders: (callback: (payload: any) => void) => {
    return db.orders.subscribe(callback);
  },
};