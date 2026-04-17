import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const {
      order_id,
      total_amount,
      customer_name,
      customer_email,
      customer_phone,
      address,
      city,
    } = await req.json();

    const storeId = process.env.SSLCOMMERZ_STORE_ID;
    const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
    const isLive = process.env.SSLCOMMERZ_IS_LIVE === "true";

    if (!storeId || !storePassword) {
      // Graceful fallback for development if credentials aren't provided yet
      console.warn("Missing SSLCommerz credentials. Bypassing gateway directly to success.");
      // Just mark it as Processing automatically to allow development testing!
      const supabase = getSupabaseAdmin();
      await supabase
        .from("orders")
        .update({ status: "Processing" })
        .eq("id", order_id);

      return NextResponse.json({
        GatewayPageURL: `/checkout/success?order_id=${order_id}`,
      });
    }

    const apiUrl = isLive
      ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
      : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

    const host = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const payload = new URLSearchParams({
      store_id: storeId,
      store_passwd: storePassword,
      total_amount: String(total_amount),
      currency: "BDT",
      tran_id: order_id, // unique per order
      success_url: `${host}/api/payment/callback/success`,
      fail_url: `${host}/api/payment/callback/fail`,
      cancel_url: `${host}/api/payment/callback/cancel`,
      ipn_url: `${host}/api/payment/callback/ipn`,
      shipping_method: "NO",
      product_name: "KitDrop Order",
      product_category: "Sportswear",
      product_profile: "physical-goods",
      cus_name: customer_name || "Customer",
      cus_email: customer_email || "test@kitdrop.com",
      cus_add1: address || "Dhaka",
      cus_city: city || "Dhaka",
      cus_country: "Bangladesh",
      cus_phone: customer_phone || "01700000000",
    });

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload.toString(),
    });

    const data = await response.json();

    if (data.status === "SUCCESS" && data.GatewayPageURL) {
      return NextResponse.json({ GatewayPageURL: data.GatewayPageURL });
    } else {
      console.error("SSLCommerz Init Error:", data);
      return NextResponse.json(
        { error: "Payment initiation failed", details: data.failedreason },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Payment Init Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
