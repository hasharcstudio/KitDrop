import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// GET /api/settings — Public store settings
export async function GET() {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    // Return defaults if no settings row exists
    return NextResponse.json({
      id: 1,
      vat_rate: 0.05,
      flat_shipping_fee: 9.99,
      free_shipping_threshold: 80,
      maintenance_mode: false,
      announcement_text: "",
      hero_kit_ids: [],
      spotlight_kit_ids: [],
      promo_codes: [],
    });
  }

  return NextResponse.json(data);
}

// PUT /api/settings — Update store settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("store_settings")
      .upsert({ id: 1, ...body })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Settings update error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
