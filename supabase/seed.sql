-- Seed data for Paisa Supabase database
-- Run this after schema.sql in Supabase SQL Editor

-- Insert sample customers
INSERT INTO public.customers (id, name, email, contact, address) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Elena Satori', 'elena@satori.io', '123-456', 'Tokyo, JP'),
  ('22222222-2222-2222-2222-222222222222', 'Julian Hayes', 'julian@hayes.com', '234-567', 'London, UK'),
  ('33333333-3333-3333-3333-333333333333', 'Maya Brin', 'maya@brin.design', '345-678', 'Berlin, DE'),
  ('44444444-4444-4444-4444-444444444444', 'Roman Chen', 'roman@chen.dev', '456-789', 'Shanghai, CN'),
  ('55555555-5555-5555-5555-555555555555', 'Oliver West', 'oliver@west.me', '567-890', 'NYC, US'),
  ('66666666-6666-6666-6666-666666666666', 'Aria Luxe', 'aria@luxe.fm', '678-901', 'Paris, FR')
ON CONFLICT (id) DO NOTHING;

-- Insert sample products
INSERT INTO public.products (id, name) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Echo - Mouth'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Echo - Eear')
ON CONFLICT (id) DO NOTHING;

-- Insert sample variants
INSERT INTO public.variants (id, product_id, type, price) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Bluetooth', 12000),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaabb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Bluetooth', 15000),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaac', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Non-Bluetooth', 12000),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaad', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Non-Bluetooth', 15000),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaae', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Bluetooth', 12000),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaf', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Bluetooth', 15000),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaba', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Non-Bluetooth', 12000),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaabc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Non-Bluetooth', 15000)
ON CONFLICT (id) DO NOTHING;

-- Insert sample orders
INSERT INTO public.orders (id, customer_id, product_variant_id, quantity, total_price, paid_amount, status, created_at) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab', 1, 12000, 12000, 'paid', NOW() - INTERVAL '2 days'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaac', 1, 12000, 5000, 'partial', NOW() - INTERVAL '5 days'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaad', 2, 30000, 30000, 'paid', NOW() - INTERVAL '10 days')
ON CONFLICT (id) DO NOTHING;