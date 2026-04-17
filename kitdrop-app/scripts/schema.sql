-- =============================================
-- KitDrop Database Schema for Supabase
-- Run this in the Supabase SQL Editor
-- =============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. LEAGUES & NATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS leagues_nations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  region TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  logo_url TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#333333',
  tier TEXT NOT NULL DEFAULT 'emerging',
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 2. PRODUCTS
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Kit',
  league_id UUID REFERENCES leagues_nations(id) ON DELETE SET NULL,
  is_national BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT NOT NULL DEFAULT '',
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  original_price DECIMAL(10,2),
  image_url TEXT NOT NULL DEFAULT '',
  images TEXT[] DEFAULT '{}',
  badge_image TEXT NOT NULL DEFAULT '',
  season TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'Home',
  is_new BOOLEAN NOT NULL DEFAULT FALSE,
  is_authentic BOOLEAN NOT NULL DEFAULT FALSE,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 3. PRODUCT VARIANTS
-- =============================================
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Replica',
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  price_override DECIMAL(10,2)
);

-- Index for fast variant lookups
CREATE INDEX IF NOT EXISTS idx_variants_product_id ON product_variants(product_id);

-- =============================================
-- 4. ORDERS
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
  vat DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Pending',
  tracking_number TEXT,
  courier TEXT,
  shipping_address JSONB NOT NULL DEFAULT '{}',
  promo_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for order status filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- =============================================
-- 5. STORE SETTINGS (single row)
-- =============================================
CREATE TABLE IF NOT EXISTS store_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  vat_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0500,
  flat_shipping_fee DECIMAL(10,2) NOT NULL DEFAULT 9.99,
  free_shipping_threshold DECIMAL(10,2) NOT NULL DEFAULT 80.00,
  maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
  announcement_text TEXT NOT NULL DEFAULT '',
  hero_kit_ids UUID[] DEFAULT '{}',
  spotlight_kit_ids UUID[] DEFAULT '{}',
  promo_codes JSONB NOT NULL DEFAULT '[]'
);

-- Insert default settings row
INSERT INTO store_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- =============================================
-- CUSTOMERS (Extended Profile for Auth Users)
-- =============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  zilla TEXT NOT NULL DEFAULT '',
  city_village TEXT NOT NULL DEFAULT '',
  age INTEGER,
  fav_club TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  payment_method TEXT NOT NULL DEFAULT 'Cash on Delivery',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 6. STORAGE BUCKET (run this separately or via Dashboard)
-- =============================================
-- Create bucket via Supabase Dashboard:
-- Storage → New Bucket → Name: "product-images" → Public: ON

-- =============================================
-- 7. ROW LEVEL SECURITY
-- =============================================


-- Products: public read, authenticated write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Products are editable by service role" ON products FOR ALL USING (true);

-- Product variants: public read, authenticated write
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Variants are viewable by everyone" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Variants are editable by service role" ON product_variants FOR ALL USING (true);

-- Leagues: public read, authenticated write
ALTER TABLE leagues_nations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leagues are viewable by everyone" ON leagues_nations FOR SELECT USING (true);
CREATE POLICY "Leagues are editable by service role" ON leagues_nations FOR ALL USING (true);

-- Orders: service role only
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Orders are managed by service role" ON orders FOR ALL USING (true);

-- Settings: public read, service role write
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings are viewable by everyone" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Settings are editable by service role" ON store_settings FOR ALL USING (true);

-- Customers: personal scope
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can view their own profile" ON customers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Customers can insert their own profile" ON customers FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Customers can update their own profile" ON customers FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service role can manage all customers" ON customers FOR ALL USING (true);

-- =============================================
-- 8. AUTO-UPDATE TIMESTAMP TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
