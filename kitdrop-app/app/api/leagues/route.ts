import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// GET /api/leagues — List all leagues/nations
export async function GET() {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("leagues_nations")
    .select("*")
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}
