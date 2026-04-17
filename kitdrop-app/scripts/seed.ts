/**
 * Seed Script — Migrate static data from /data to Supabase
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Prerequisites:
 *   - Supabase tables must be created (run scripts/schema.sql first)
 *   - .env.local must have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

// ─── Static data inline (copied from /data so this script is self-contained) ───

const leaguesData = [
  { id: "premier-league", name: "Premier League", region: "Europe", country: "England", color: "#3d195b", tier: "big-five", description: "The most-watched football league in the world." },
  { id: "la-liga", name: "La Liga", region: "Europe", country: "Spain", color: "#ee8707", tier: "big-five", description: "Spain's elite division." },
  { id: "bundesliga", name: "Bundesliga", region: "Europe", country: "Germany", color: "#d20515", tier: "big-five", description: "Germany's top flight." },
  { id: "serie-a", name: "Serie A", region: "Europe", country: "Italy", color: "#024494", tier: "big-five", description: "Italian football's finest." },
  { id: "ligue-1", name: "Ligue 1", region: "Europe", country: "France", color: "#091c3e", tier: "big-five", description: "France's premier league." },
  { id: "equipment", name: "Equipment", region: "Global", country: "Global", color: "#333333", tier: "emerging", description: "Boots, turfs, and accessories." },
];

const productsData = [
  {
    name: "Manchester United · 2025/26",
    brand: "Manchester United",
    category: "Kit",
    league_slug: "premier-league",
    description: "The 2025/26 Manchester United Away Kit features a striking black, blue, and yellow design inspired by the iconic 1993/95 era.",
    base_price: 89.99,
    original_price: 110.0,
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDd1M_W4qdXoLdOLgfEFBElS00MyexYg2q-iEHLtaxYwjTWQmnaY_IjY-vGUQWzPge8XK77bRd6Oq-_jvA41tuzSyH6KE9eElOzwlw-JPkctsobxd8l30AtikCjRJNnMMjxbu3Om41WMg-QIlfq10pNSum-w7hSh0pnPKEVcG2w5HFlnmS094tnX1pKEWYpD8QWiBM91ObR3hekpZfRBiejb8sg5JTrDmRDiM8fQvvctYmkYjasTpHbUDIfMAVakpDPXb2QKG0topg",
    badge_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3Uuiu4UT_AjiRaJ0AsafyP2AeLW-uDJNnEKPdoRe0ft2CywRDcERaqBuUCYiB3ADCeVl-mCTa6BMwirR2lAoBWtXVmXeNjglmEBNYKbuK5OK9ewlqxqb1l7zRMGPSNxxYjgz6q5b9NHLPmM4bTj06cpDsLxpJ1sUxxnb1JNm8Wyc-slosvb6MSEmshlZGVfLMiNtte-dr4Zt-a1udlGm6I4kLbEYi66evnz2yb9JBDIiqblhUK13-Hx_7gKOVcjpVT9O4eviyot4",
    season: "2025/26", type: "Home", is_new: true, is_authentic: true, rating: 4, review_count: 421,
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    name: "Real Madrid · 2025/26",
    brand: "Real Madrid",
    category: "Kit",
    league_slug: "la-liga",
    description: "The Real Madrid 2025/26 Away Kit features Bernabéu-inspired orange authentic detailing.",
    base_price: 89.99,
    original_price: 110.0,
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRyFXVHQSejpQWIz70J76BAXkC0t5nhU21kwoch0GnXkE4SZk7iUnU6YTLlwvJviDdhjnF7Am2apdLgzQhCGcOZZeFLiGZPwwt3egAqSaZVp5ZoZ0eYScvcISHLlTIOOb5iiGqP0GadpPJ4WFit5W-n6m308DXxA_LWt2chNZxstji9XMP8WoiHsw0b8P9Ko_A6-9D9LrZiqH1fTy_wKINIaQ6Nnx186RzKphxXHM1PmLhS_AKTsWuZAsLX7SAPQ5noZvO6cIUg68",
    badge_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZ1B10wvQNjkhFbABaJ76X9Bq5dn38wcyKRHp9cgXRmKgrBAi-xvvwoiKlBI2uRktLiitrC_3AjDFPba8q_GnSiMX5sXFHrpr-pmF0GUxDzTQDY0zHZ-DBulntnrZzo2AuGA2Alcnzu_DKp90n_86FiiWOGQqVRsV7QQziTHDTp75uLqtz1a63AoZWX0zyFejYnFbbE_DbHQ-r7fw_UzCmZR6km5RUw4753QX6qsAlvkd9ywQ-1k6PLQTaO5y44FhjXN-GrCWMAoc",
    season: "2025/26", type: "Away", is_new: true, is_authentic: true, rating: 5, review_count: 522,
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    name: "Inter Milan · 2025/26",
    brand: "Inter Milan",
    category: "Kit",
    league_slug: "serie-a",
    description: "The iconic nerazzurri stripes return with a snowflake-patterned away concept.",
    base_price: 89.99,
    original_price: 110.0,
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYELEjFyWzkFXcLmhTEDvsYJ2fypD63cpQYS-pe4LzqFA_XBdORrGxaVJ8BXlSAiQcdQQQCyLLfCKH1seO4fU9E7O7_HgNCXjLsLBMsFVMSHuandRk3MjOfj-OkP6qrsaq1KV8alHXj7SBsh6wdI28czeQm5FbKPQX4IOWsgJpgoJe7dURh--TtcuJ_5QBsvOelD9hAo1p2zDtkilwKtSLo_0PctBGRGwBGBph4zYBJhaiVK42VgmuYYkTWx1E-HajwKfkygIf6Dc",
    badge_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2LMUAUE_ByWulJ1GdJ4vUVbURTBpIkDR69c7xp4AceP9fC3uiqSRf5JcpkP4aT0m-bzRiZHEeLLZgVkklXxl1Wy7WQxmpeFoSA5zZPwA1bqZeVyGmp5ytXzOzeAV34ecDhBLh7CAZll9QMUZEge2ntclZ7CIPJu1bJlWUdLYH5Hv8zfCNZfDA5DoNV0aSU4Yz8hae96yMH-M2rasSa_iKSuJ2AJyzQI8bmlzW_KGTRb6ipShM6mJ3riNGaqkDLEV4oWrvuky_WcY",
    season: "2025/26", type: "Home", is_new: true, is_authentic: false, rating: 4, review_count: 189,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    name: "B. Dortmund · 2025/26",
    brand: "Borussia Dortmund",
    category: "Kit",
    league_slug: "bundesliga",
    description: "The bright yellow PUMA Dortmund Home Kit with technical black patterns.",
    base_price: 89.99,
    original_price: 110.0,
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAb8sfxJhP1V0BAXVQZq53mk9jETuanyyEbDFwyvOJfOpwlb4duI7DLzl5PzQaE_Yq7Bwg9seP-ehsRuS0buaBC8-0xB4MYdE_z9rrElBb0nRYP3QoTHCsisq4H3HTGQPsf-_A6vLrGK9m8W_2d517SoG8tA0jJSjTH0Q5yNOQhck2nwDAVA5UKQjRbJidVkcEG-K1e4zgCsWQDANVq2v5V2eRqTzZyNYKGesTg3XVehZLTrh74fjmvr0cKB_5QgqyY0xrdU4OgYYk",
    badge_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuABuvqX0uVN29HCmYukCA8M766HwHxOwd96RSUjhh4_K1wmhrbKt_K4R2oAiY0TvNH6dOucXXeH4xROrNrYA6wE1jkA7t_GhWjqjb96_z4XovIe3B0HhDwcSgvqn2nfm1JBU-9TtEnURM3YBvL4P29gDXYzBB5FOBh80mhnW1e2JNDgVbsYnrLiPg-A3TS8q2AfH00j3AV0ShvQicfEVFFGM8kEb925iTnSCoUPj8uMCMeTks6rVSvKCjD9MS48P7g-lcf8efwkGng",
    season: "2025/26", type: "Home", is_new: true, is_authentic: false, rating: 5, review_count: 312,
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    name: "Manchester City · 2025/26",
    brand: "Manchester City",
    category: "Kit",
    league_slug: "premier-league",
    description: "Engineered for high-intensity play, the 2025/26 PUMA Home Kit features advanced dry-fit technology.",
    base_price: 120.0,
    original_price: 145.0,
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcahcDmLxJdKUm0txEFZykuLU3SwCxH-yDZBgr-tJATN4sSn3_3ufPQf6h9LkNifJfxf3CkdJlv5ROEaWvOk8jG9KpdKjpLmIRpl8eHn_4Xdkpf_cT8I6FS3tfXeok7xBCBfGBGpQxNScHIIPJpMHtOyFBdIIEAtClpZk4FO6bcdM2KLMEPUQXQFVQOPbS54TZMIkgRT_jRv9rQ0WTiudw_HDBH_6MaNscDCSV-cBIHW604sXfv4FhvkXPkADkuz3zjk_DA-_D27o",
    badge_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgwuV13PVNurG9sxasmcpvE29e5VMtIVuMp8LLhRWLw8I_95mfhxpvKCJeA_CujJ9dkGGGg6WoO3DlNEyoE0KR-9aMhbrapcco5xtk6c0cD9ZiYmoWvjKnWgAU8-0mtFACrmlTG4iWhTXnLJ0WEbpSSNZn2dtF2xYAzm4awhCmFPmMaphP_yN_D4tua2k9-Nb-UQ5_HAz7bticfyTgzFC8Ya4ken4X6GGOC-GtzfA2Uwn3iV5xamXaCSmmCY7dI_xxkID0nLkYN9Y",
    season: "2025/26", type: "Home", is_new: true, is_authentic: true, rating: 4, review_count: 412,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    outOfStockSizes: ["XS"],
  },
  {
    name: "Elite FG Cleat · 2025",
    brand: "Nike",
    category: "Boot",
    league_slug: "equipment",
    description: "Premium Firm Ground (FG) football boots designed for natural, dry grass pitches.",
    base_price: 250.0,
    original_price: 280.0,
    image_url: "/equipment/fg_boots.png",
    badge_image: "",
    season: "2025", type: "Boots", is_new: true, is_authentic: true, rating: 5, review_count: 154,
    sizes: ["US 8", "US 9", "US 9.5", "US 10", "US 11", "US 12"],
  },
  {
    name: "Pro Turf Shoe · 2025",
    brand: "Adidas",
    category: "Turf",
    league_slug: "equipment",
    description: "Built for Astroturf and hard dirt courts.",
    base_price: 120.0,
    original_price: null,
    image_url: "/equipment/tf_turfs.png",
    badge_image: "",
    season: "2025/26", type: "Turf Shoes", is_new: true, is_authentic: true, rating: 4, review_count: 302,
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"],
  },
  {
    name: "Carbon Fiber Shin Guards",
    brand: "Puma",
    category: "Accessory",
    league_slug: "equipment",
    description: "Ultra-lightweight carbon fiber shin guards.",
    base_price: 55.0,
    original_price: null,
    image_url: "/equipment/shin_guards.png",
    badge_image: "",
    season: "2025/26", type: "Accessories", is_new: false, is_authentic: true, rating: 5, review_count: 89,
    sizes: ["S", "M", "L"],
  },
  {
    name: "Elite Pro Grip Socks",
    brand: "TruSox",
    category: "Accessory",
    league_slug: "equipment",
    description: "The secret weapon of modern pros.",
    base_price: 35.0,
    original_price: null,
    image_url: "/equipment/grip_socks.png",
    badge_image: "",
    season: "2025/26", type: "Accessories", is_new: true, is_authentic: true, rating: 5, review_count: 1204,
    sizes: ["One Size"],
  },
];

// ─── Configuration ───

// Load env manually (no dotenv needed for tsx with Next.js .env.local)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Missing env vars. Make sure .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── Seed functions ───

async function seedLeagues() {
  console.log("🏟️  Seeding leagues...");
  const rows = leaguesData.map((l) => ({
    name: l.name,
    region: l.region,
    country: l.country,
    logo_url: "",
    color: l.color,
    tier: l.tier,
    description: l.description,
  }));

  const { data, error } = await supabase
    .from("leagues_nations")
    .upsert(rows, { onConflict: "name" })
    .select();

  if (error) {
    console.error("  ❌ League error:", error.message);
    return {};
  }
  console.log(`  ✅ ${data.length} leagues seeded`);

  // Build a lookup: slug → id
  const lookup: Record<string, string> = {};
  for (const league of data) {
    const slug = league.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    lookup[slug] = league.id;
    // Also add special mappings
    if (league.name === "Premier League") lookup["premier-league"] = league.id;
    if (league.name === "La Liga") lookup["la-liga"] = league.id;
    if (league.name === "Serie A") lookup["serie-a"] = league.id;
    if (league.name === "Ligue 1") lookup["ligue-1"] = league.id;
  }
  return lookup;
}

async function seedProducts(leagueLookup: Record<string, string>) {
  console.log("👕  Seeding products...");

  for (const p of productsData) {
    const leagueId = leagueLookup[p.league_slug] || null;

    // Insert product
    const { data: product, error } = await supabase
      .from("products")
      .insert({
        name: p.name,
        brand: p.brand,
        category: p.category,
        league_id: leagueId,
        is_national: false,
        description: p.description,
        base_price: p.base_price,
        original_price: p.original_price,
        image_url: p.image_url,
        images: [],
        badge_image: p.badge_image,
        season: p.season,
        type: p.type,
        is_new: p.is_new,
        is_authentic: p.is_authentic,
        is_visible: true,
        featured: false,
        rating: p.rating,
        review_count: p.review_count,
      })
      .select()
      .single();

    if (error) {
      console.error(`  ❌ ${p.name}:`, error.message);
      continue;
    }

    // Insert variants (one per size)
    const variants = p.sizes.map((size) => ({
      product_id: product.id,
      size,
      type: "Replica",
      stock_quantity: p.outOfStockSizes?.includes(size) ? 0 : 50,
      price_override: null,
    }));

    const { error: variantErr } = await supabase
      .from("product_variants")
      .insert(variants);

    if (variantErr) {
      console.error(`  ⚠️  Variants for ${p.name}:`, variantErr.message);
    }

    console.log(`  ✅ ${p.name} (${variants.length} variants)`);
  }
}

async function seedSettings() {
  console.log("⚙️  Seeding default store settings...");
  const { error } = await supabase.from("store_settings").upsert({
    id: 1,
    vat_rate: 0.05,
    flat_shipping_fee: 9.99,
    free_shipping_threshold: 80.0,
    maintenance_mode: false,
    announcement_text: "",
    hero_kit_ids: [],
    spotlight_kit_ids: [],
    promo_codes: [
      {
        code: "KITDROP10",
        discount_percent: 10,
        expires_at: "2027-12-31T23:59:59Z",
        max_uses: 1000,
        current_uses: 0,
        is_active: true,
      },
    ],
  });

  if (error) {
    console.error("  ❌ Settings error:", error.message);
  } else {
    console.log("  ✅ Store settings seeded (promo code KITDROP10)");
  }
}

// ─── Main ───

async function main() {
  console.log("\n🚀 KitDrop Seed Script Starting...\n");
  console.log(`   URL: ${SUPABASE_URL}`);
  console.log("");

  const leagueLookup = await seedLeagues();
  await seedProducts(leagueLookup);
  await seedSettings();

  console.log("\n✅ Seed complete!\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
