"use client";
import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const getMessage = () => {
    switch (reason) {
      case "cancelled":
        return "You cancelled the payment process.";
      case "failed":
        return "The payment failed or was declined by the bank.";
      case "missing_id":
        return "We couldn't verify the order session.";
      default:
        return "An unexpected error occurred during the transaction.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-error/10 text-error flex items-center justify-center rounded-full mb-8">
        <XCircle size={48} />
      </div>
      <h1 className="text-4xl sm:text-5xl font-black uppercase font-headline tracking-tight mb-4 text-error">
        Payment Failed
      </h1>
      <p className="text-on-surface-variant font-body mb-8 text-lg">
        {getMessage()} Your order has not been confirmed.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/checkout"
          className="bg-accent text-on-accent px-8 py-3.5 font-headline font-bold uppercase tracking-tight flex items-center gap-2 hover:bg-accent-dim transition-colors"
        >
          <RefreshCw size={18} />
          Try Again
        </Link>
        <Link 
          href="/account"
          className="bg-surface border border-border text-on-surface px-8 py-3.5 font-headline font-bold uppercase tracking-tight hover:border-accent hover:text-accent transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Return to Account
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutErrorPage() {
  return (
    <div className="min-h-screen bg-background pt-24 sm:pt-32 pb-16 px-6 flex items-center justify-center">
      <Suspense fallback={<div className="h-40 w-40 flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent animate-spin rounded-full" /></div>}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}
