import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) {
    return NextResponse.json(null, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { email, ...updates } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Only allow updating safe fields
  const allowedFields = [
    "full_name", "phone", "address", "city", "zilla", "postal_code",
    "payment_method", "notifications_enabled"
  ];
  
  const safeUpdates: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in updates) {
      safeUpdates[key] = updates[key];
    }
  }

  if (Object.keys(safeUpdates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("customers")
    .update(safeUpdates)
    .eq("email", email)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
