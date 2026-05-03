import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import { Customer, Product, ProductVariant, Order } from "../types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const db = {
  customers: {
    getAll: () => supabase.from("customers").select("*").order("id"),
    create: (customer: Omit<Customer, "id">) =>
      supabase.from("customers").insert(customer).select().single(),
    update: (id: string, updates: Partial<Customer>) =>
      supabase.from("customers").update(updates).eq("id", id).select().single(),
    delete: (id: string) => supabase.from("customers").delete().eq("id", id),
    subscribe: (callback: (payload: any) => void) =>
      supabase.channel("customers").on("postgres_changes", { event: "*", schema: "public", table: "customers" }, callback).subscribe(),
  },
  products: {
    getAll: () => supabase.from("products").select("*").order("id"),
  },
  variants: {
    getAll: () => supabase.from("variants").select("*").order("id"),
  },
  orders: {
    getAll: () => supabase.from("orders").select("*").order("created_at", { ascending: false }),
    create: (order: Omit<Order, "id">) =>
      supabase.from("orders").insert(order).select().single(),
    update: (id: string, updates: Partial<Order>) =>
      supabase.from("orders").update(updates).eq("id", id).select().single(),
    subscribe: (callback: (payload: any) => void) =>
      supabase.channel("orders").on("postgres_changes", { event: "*", schema: "public", table: "orders" }, callback).subscribe(),
  },
};