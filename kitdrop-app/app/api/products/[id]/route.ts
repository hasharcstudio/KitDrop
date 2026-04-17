import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// GET /api/products/[id] — Single product with variants
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*), leagues_nations(*)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PUT /api/products/[id] — Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const supabase = getSupabaseAdmin();

  const { variants, ...productData } = body;

  // Update product
  const { data: product, error: productError } = await supabase
    .from("products")
    .update(productData)
    .eq("id", id)
    .select()
    .single();

  if (productError) {
    return NextResponse.json({ error: productError.message }, { status: 500 });
  }

  // Replace variants if provided
  if (variants) {
    // Delete old variants
    await supabase
      .from("product_variants")
      .delete()
      .eq("product_id", id);

    // Insert new variants
    if (variants.length > 0) {
      const variantRows = variants.map((v: { size: string; type: string; stock_quantity: number; price_override: number | null }) => ({
        product_id: id,
        size: v.size,
        type: v.type || "Replica",
        stock_quantity: v.stock_quantity || 0,
        price_override: v.price_override || null,
      }));

      await supabase
        .from("product_variants")
        .insert(variantRows);
    }
  }

  return NextResponse.json(product);
}

// DELETE /api/products/[id] — Delete product (cascades to variants)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
