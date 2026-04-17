// ===== Database Types for KitDrop =====

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'Kit' | 'Boot' | 'Turf' | 'Accessory';
  league_id: string | null;
  is_national: boolean;
  description: string;
  base_price: number;
  original_price: number | null;
  image_url: string;
  images: string[];
  badge_image: string;
  season: string;
  type: 'Home' | 'Away' | 'Third' | 'Goalkeeper' | 'Boots' | 'Turf Shoes' | 'Accessories';
  is_new: boolean;
  is_authentic: boolean;
  is_visible: boolean;
  featured: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  // Joined data
  variants?: ProductVariant[];
  league?: LeagueNation;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  type: string; // Authentic, Replica, FG, SG, TF
  stock_quantity: number;
  price_override: number | null;
}

export interface LeagueNation {
  id: string;
  name: string;
  region: string;
  country: string;
  logo_url: string;
  color: string;
  tier: 'big-five' | 'emerging' | 'south-america';
  description: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  vat: number;
  discount: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Refunded';
  tracking_number: string | null;
  courier: string | null;
  shipping_address: ShippingAddress;
  promo_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  image: string;
  size: string;
  type: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface StoreSettings {
  id: number;
  vat_rate: number;
  flat_shipping_fee: number;
  free_shipping_threshold: number;
  maintenance_mode: boolean;
  announcement_text: string;
  hero_kit_ids: string[];
  spotlight_kit_ids: string[];
  promo_codes: PromoCode[];
}

export interface PromoCode {
  code: string;
  discount_percent: number;
  expires_at: string;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
}
