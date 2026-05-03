-- Paisa Supabase Schema Migration
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  contact TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Variants table
CREATE TABLE IF NOT EXISTS public.variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('Bluetooth', 'Non-Bluetooth')),
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  product_variant_id UUID REFERENCES public.variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price NUMERIC(10, 2) NOT NULL,
  paid_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  delivery_date TEXT
);

-- Enable Realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;