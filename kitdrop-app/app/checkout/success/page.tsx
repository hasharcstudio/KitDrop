"use client";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || "N/A";

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-accent/20 text-accent flex items-center justify-center rounded-full mb-8">
        <CheckCircle2 size={48} />
      </div>
      <h1 className="text-4xl sm:text-5xl font-black uppercase font-headline tracking-tight mb-4 text-gradient">
        Order Confirmed
      </h1>
      <p className="text-on-surface-variant font-body mb-2 text-lg">
        Thank you for your business. Your tactical gear is being prepared.
      </p>
      <p className="text-sm uppercase font-headline tracking-widest font-bold text-accent mb-12">
        Order ID: {orderId}
      </p>
      <Link 
        href="/account"
        className="bg-surface border border-border text-on-surface px-8 py-3.5 font-headline font-bold uppercase tracking-tight hover:border-accent hover:text-accent transition-colors"
      >
        View in Archive
      </Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background pt-24 sm:pt-32 pb-16 px-6 flex items-center justify-center">
      <Suspense fallback={<div className="h-40 w-40 flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent animate-spin rounded-full" /></div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
