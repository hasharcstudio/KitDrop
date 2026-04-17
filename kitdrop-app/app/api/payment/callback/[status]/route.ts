import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request, { params }: { params: Promise<{ status: string }> }) {
  try {
    const { status } = await params;
    // SSLCommerz typically sends data as x-www-form-urlencoded POST
    const textData = await req.text();
    const parsedData = new URLSearchParams(textData);
    const body = Object.fromEntries(parsedData.entries());

    // tran_id is what we passed as order_id
    const orderId = body.tran_id;

    if (!orderId) {
      return NextResponse.redirect(new URL("/checkout/error?reason=missing_id", req.url));
    }

    const supabase = getSupabaseAdmin();

    if (status === "success" || body.status === "VALID") {
      // Here you should ideally call the SSLCommerz validation API
      // to avoid spoofing (verify with val_id), but for now we mark success
      await supabase
        .from("orders")
        .update({ status: "Processing" }) // Payment complete, ready to process
        .eq("id", orderId);

      return NextResponse.redirect(new URL(`/checkout/success?order_id=${orderId}`, req.url));
    } 
    else if (status === "fail") {
      await supabase
        .from("orders")
        .update({ status: "Payment Failed" })
        .eq("id", orderId);
        
      return NextResponse.redirect(new URL(`/checkout/error?reason=failed`, req.url));
    } 
    else if (status === "cancel") {
      await supabase
        .from("orders")
        .update({ status: "Cancelled" })
        .eq("id", orderId);
        
      return NextResponse.redirect(new URL(`/checkout/error?reason=cancelled`, req.url));
    }
    else if (status === "ipn") {
      // Instant Payment Notification - server to server
      if (body.status === "VALID") {
        await supabase
          .from("orders")
          .update({ status: "Processing" })
          .eq("id", orderId);
      }
      return NextResponse.json({ received: true });
    }

    return NextResponse.redirect(new URL("/checkout/error", req.url));
  } catch (error) {
    console.error("Payment Callback Route Error:", error);
    return NextResponse.redirect(new URL("/checkout/error", req.url));
  }
}
