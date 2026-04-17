/**
 * Storefront API helpers — tries Supabase API first, falls back to static data.
 * Used by shop page, product page, hero, and spotlight sections.
 */
import { Kit, kits as staticKits, getKitById as getStaticKitById } from "@/data/kits";
import type { Product, StoreSettings } from "@/lib/database.types";

// ---------- Settings ----------

const DEFAULT_SETTINGS: StoreSettings = {
  id: 1,
  vat_rate: 0.05,
  flat_shipping_fee: 9.99,
  free_shipping_threshold: 80,
  maintenance_mode: false,
  announcement_text: "",
  hero_kit_ids: [],
  spotlight_kit_ids: [],
  promo_codes: [],
};

export async function fetchSettings(): Promise<StoreSettings> {
  try {
    const res = await fetch("/api/settings", { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// ---------- Product mapper ----------

/** Map a Supabase Product row to the existing Kit interface used everywhere */
function productToKit(p: Product): Kit {
  return {
    id: p.id,
    name: p.name,
    clubId: p.brand.toLowerCase().replace(/\s+/g, "-"),
    clubName: p.brand,
    leagueId: p.league_id || "custom",
    leagueName: p.league?.name || "",
    season: p.season,
    type: p.type as Kit["type"],
    price: p.base_price,
    originalPrice: p.original_price ?? undefined,
    rating: p.rating,
    reviewCount: p.review_count,
    image: p.image_url,
    images: p.images?.length ? p.images : undefined,
    badgeImage: p.badge_image,
    sizes: p.variants?.map((v) => v.size) || ["S", "M", "L", "XL"],
    outOfStockSizes: p.variants
      ?.filter((v) => v.stock_quantity <= 0)
      .map((v) => v.size),
    isNew: p.is_new,
    isAuthentic: p.is_authentic,
    description: p.description,
  };
}

// ---------- Products ----------

export async function fetchKits(): Promise<Kit[]> {
  try {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("API error");
    const products: Product[] = await res.json();
    if (products.length > 0) {
      return products.map(productToKit);
    }
    // API returned empty — fall back to static
    return staticKits;
  } catch {
    return staticKits;
  }
}

export async function fetchKitById(id: string): Promise<Kit | undefined> {
  try {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error("API error");
    const product: Product = await res.json();
    return productToKit(product);
  } catch {
    return getStaticKitById(id);
  }
}

// ---------- Promo codes ----------

export interface PromoResult {
  valid: boolean;
  discount_percent: number;
  message: string;
}

export function validatePromoCode(
  code: string,
  settings: StoreSettings
): PromoResult {
  if (!code.trim()) {
    return { valid: false, discount_percent: 0, message: "" };
  }
  const promo = settings.promo_codes.find(
    (p) =>
      p.code.toUpperCase() === code.toUpperCase() &&
      p.is_active &&
      new Date(p.expires_at) > new Date() &&
      p.current_uses < p.max_uses
  );
  if (!promo) {
    return { valid: false, discount_percent: 0, message: "Invalid or expired promo code" };
  }
  return {
    valid: true,
    discount_percent: promo.discount_percent,
    message: `${promo.discount_percent}% off applied!`,
  };
}
