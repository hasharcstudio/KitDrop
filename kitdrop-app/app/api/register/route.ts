import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      fullName,
      address,
      zilla,
      cityVillage,
      age,
      favClub,
      phone,
      paymentMethod,
    } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Email, password, and full name are required." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // 1. Create the user in Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto confirm for prototype
      user_metadata: { full_name: fullName },
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || "Failed to create user." },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // 2. Insert into the localized customers table
    const { error: customerError } = await supabase.from("customers").insert({
      id: userId,
      email,
      full_name: fullName,
      address: address || "",
      zilla: zilla || "",
      city_village: cityVillage || "",
      age: age ? parseInt(age) : null,
      fav_club: favClub || "",
      phone: phone || "",
      payment_method: paymentMethod || "Cash on Delivery",
    });

    if (customerError) {
      // Rollback auth user creation if inserting fails
      await supabase.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: "Failed to create customer profile: " + customerError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, userId });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: "Internal Server Error: " + err.message },
      { status: 500 }
    );
  }
}
