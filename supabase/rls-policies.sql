-- RLS Policies for development
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)

-- Customers
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access" ON public.customers;
CREATE POLICY "Allow all access" ON public.customers FOR ALL USING (true) WITH CHECK (true);

-- Products  
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access" ON public.products;
CREATE POLICY "Allow all access" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Variants
ALTER TABLE public.variants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access" ON public.variants;
CREATE POLICY "Allow all access" ON public.variants FOR ALL USING (true) WITH CHECK (true);

-- Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access" ON public.orders;
CREATE POLICY "Allow all access" ON public.orders FOR ALL USING (true) WITH CHECK (true);