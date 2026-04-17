import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// GET /api/products — List all visible products with variants
export async function GET(request: NextRequest) {
  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true"; // admin flag to see hidden products

  let query = supabase
    .from("products")
    .select("*, product_variants(*), leagues_nations(*)")
    .order("created_at", { ascending: false });

  if (!all) {
    query = query.eq("is_visible", true);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// POST /api/products — Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const {
      name, brand, category, league_id, is_national,
      description, base_price, original_price,
      image_url, images, badge_image, season, type,
      is_new, is_authentic, is_visible, featured,
      rating, review_count, variants,
    } = body;

    // Insert product
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        name, brand, category,
        league_id: league_id || null,
        is_national: is_national || false,
        description: description || "",
        base_price: base_price || 0,
        original_price: original_price || null,
        image_url: image_url || "",
        images: images || [],
        badge_image: badge_image || "",
        season: season || "",
        type: type || "Home",
        is_new: is_new || false,
        is_authentic: is_authentic || false,
        is_visible: is_visible !== false,
        featured: featured || false,
        rating: rating || 0,
        review_count: review_count || 0,
      })
      .select()
      .single();

    if (productError) {
      return NextResponse.json({ error: productError.message }, { status: 500 });
    }

    // Insert variants
    if (variants && variants.length > 0) {
      const variantRows = variants.map((v: { size: string; type: string; stock_quantity: number; price_override: number | null }) => ({
        product_id: product.id,
        size: v.size,
        type: v.type || "Replica",
        stock_quantity: v.stock_quantity || 0,
        price_override: v.price_override || null,
      }));

      const { error: variantError } = await supabase
        .from("product_variants")
        .insert(variantRows);

      if (variantError) {
        console.error("Variant insert error:", variantError);
      }
    }

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("Product create error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
