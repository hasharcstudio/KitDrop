import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// GET /api/orders — List all orders
export async function GET(request: NextRequest) {
  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "All") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// POST /api/orders — Create a new order (from checkout)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const orderNumber = `KIT-${Math.floor(Math.random() * 900000) + 100000}`;

    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: body.customer_name,
        customer_email: body.customer_email,
        items: body.items,
        subtotal: body.subtotal,
        shipping: body.shipping,
        vat: body.vat || 0,
        discount: body.discount || 0,
        total: body.total,
        status: "Pending",
        shipping_address: body.shipping_address || {},
        promo_code: body.promo_code || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Decrement stock for each variant
    if (body.items && Array.isArray(body.items)) {
      for (const item of body.items) {
        if (item.variant_id) {
          await supabase.rpc("decrement_stock", {
            variant_id: item.variant_id,
            qty: item.quantity,
          });
        }
      }
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Order create error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/orders — Update order status/tracking
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Order update error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
