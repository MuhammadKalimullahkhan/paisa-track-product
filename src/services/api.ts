import { Customer, Product, ProductVariant, Order } from "../types";

const API_BASE = "/api";

export const api = {
  getCustomers: (): Promise<Customer[]> => 
    fetch(`${API_BASE}/customers`).then(r => r.json()),
  
  createCustomer: (customer: Partial<Customer>): Promise<Customer> => 
    fetch(`${API_BASE}/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    }).then(r => r.json()),

  updateCustomer: (id: string, updates: Partial<Customer>): Promise<Customer> => 
    fetch(`${API_BASE}/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }).then(r => r.json()),

  deleteCustomer: (id: string): Promise<void> => 
    fetch(`${API_BASE}/customers/${id}`, { method: "DELETE" }).then(() => {}),
  
  getProducts: (): Promise<Product[]> => 
    fetch(`${API_BASE}/products`).then(r => r.json()),
  
  getVariants: (): Promise<ProductVariant[]> => 
    fetch(`${API_BASE}/variants`).then(r => r.json()),
  
  getOrders: (): Promise<Order[]> => 
    fetch(`${API_BASE}/orders`).then(r => r.json()),
  
  createOrder: (order: Partial<Order>): Promise<Order> => 
    fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    }).then(r => r.json()),
  
  updateOrder: (id: string, updates: Partial<Order>): Promise<Order> => 
    fetch(`${API_BASE}/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }).then(r => r.json()),
};
