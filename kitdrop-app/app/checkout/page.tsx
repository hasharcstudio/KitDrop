"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CreditCard, ShieldCheck, Tag, X, Wallet, Banknote, Smartphone } from "lucide-react";
import { fetchSettings, validatePromoCode } from "@/lib/store-api";
import type { StoreSettings } from "@/lib/database.types";
import { formatPrice } from "@/lib/currency";

type PaymentMethod = "cod" | "bkash" | "nagad" | "card";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, subtotal, clearCart, closeCart } = useCartStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderError, setOrderError] = useState("");
  
  // Close the mini cart just in case it was open
  useState(() => {
    closeCart();
  });

  // Store settings (VAT, shipping, promos)
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  useEffect(() => {
    fetchSettings().then(setSettings);
  }, []);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [bkashNumber, setBkashNumber] = useState("");
  const [nagadNumber, setNagadNumber] = useState("");

  // Pre-fill from session
  useEffect(() => {
    if (session?.user) {
      const nameParts = (session.user.name || "").split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  // Fetch customer profile to pre-fill address
  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/customers/profile?email=${encodeURIComponent(session.user.email)}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data) {
            if (data.address) setAddress(data.address);
            if (data.city) setCity(data.city);
            if (data.postal_code) setPostalCode(data.postal_code);
            if (data.phone) setPhone(data.phone);
            if (data.payment_method) setPaymentMethod(data.payment_method as PaymentMethod);
          }
        })
        .catch(() => {});
    }
  }, [session]);

  // Redirect to login if user is unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout&tab=register");
    }
  }, [status, router]);

  // Promo code state
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount_percent: number } | null>(null);
  const [promoError, setPromoError] = useState("");

  const vatRate = settings?.vat_rate ?? 0.05;
  const flatShippingFee = settings?.flat_shipping_fee ?? 9.99;
  const freeShippingThreshold = settings?.free_shipping_threshold ?? 80;

  const cartTotal = subtotal();
  const shipping = cartTotal > freeShippingThreshold ? 0 : flatShippingFee;

  // Promo discount applied to subtotal
  const discount = appliedPromo
    ? cartTotal * (appliedPromo.discount_percent / 100)
    : 0;

  const afterDiscount = cartTotal - discount;
  const vat = afterDiscount * vatRate;
  const total = afterDiscount + shipping + vat;

  const handleApplyPromo = () => {
    if (!settings) return;
    const result = validatePromoCode(promoInput, settings);
    if (result.valid) {
      setAppliedPromo({ code: promoInput.toUpperCase(), discount_percent: result.discount_percent });
      setPromoError("");
    } else {
      setPromoError(result.message);
      setAppliedPromo(null);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError("");
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
       <div className="min-h-screen bg-background pt-24 sm:pt-32 pb-16 px-6 flex flex-col items-center justify-center">
         <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
         <p className="text-on-surface-variant font-headline uppercase tracking-widest text-sm">Authenticating...</p>
       </div>
    );
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-background pt-24 sm:pt-32 pb-16 px-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl sm:text-4xl font-black uppercase font-headline tracking-tight mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-on-surface-variant font-body mb-8">
          You need items in your cart to proceed to checkout.
        </p>
        <button 
          onClick={() => router.push("/shop")}
          className="bg-accent text-on-accent px-8 py-3 font-headline font-bold uppercase tracking-tight hover:bg-accent-dim transition-colors"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleCompleteOrder = async () => {
    setIsProcessing(true);
    setOrderError("");

    try {
      const orderPayload = {
        customer_name: `${firstName} ${lastName}`.trim(),
        customer_email: email,
        phone,
        items: items.map(item => ({
          product_id: item.kitId,
          name: item.name,
          image: item.image,
          price: item.price,
          size: item.size,
          type: item.type,
          quantity: item.quantity,
        })),
        subtotal: cartTotal,
        shipping,
        vat,
        discount,
        total,
        payment_method: paymentMethod,
        shipping_address: {
          street: address,
          city,
          postal_code: postalCode,
        },
        promo_code: appliedPromo?.code || null,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to place order");
      }

      const data = await res.json();
      const orderIdentifier = data.id || data.order_number;

      if (paymentMethod !== "cod") {
        const initRes = await fetch("/api/payment/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: orderIdentifier,
            total_amount: total,
            customer_name: `${firstName} ${lastName}`.trim(),
            customer_email: email,
            customer_phone: phone,
            address: address,
            city: city,
          }),
        });

        if (!initRes.ok) throw new Error("Payment gateway failed to initialize.");
        const initData = await initRes.json();
        
        if (initData.GatewayPageURL) {
          clearCart(); // Clear cart before leaving
          window.location.href = initData.GatewayPageURL;
          return; // Stop execution, browser is redirecting
        }
      }

      setIsSuccess(true);
      clearCart();
      window.location.href = `/checkout/success?order_id=${orderIdentifier}`;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setOrderError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods: { id: PaymentMethod; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "cod", label: "Cash on Delivery", icon: <Banknote size={20} />, desc: "Pay when you receive" },
    { id: "bkash", label: "bKash", icon: <Smartphone size={20} />, desc: "Mobile payment" },
    { id: "nagad", label: "Nagad", icon: <Wallet size={20} />, desc: "Mobile payment" },
    { id: "card", label: "Card", icon: <CreditCard size={20} />, desc: "Visa / Mastercard" },
  ];

  return (
    <div className="min-h-screen bg-background pt-16 sm:pt-20 pb-24">
      <div className="w-full max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
          <Link href="/shop" className="flex items-center gap-2 text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant hover:text-accent transition-colors">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-accent" />
            <span className="text-xs font-headline tracking-widest uppercase text-on-surface-variant">Secure Checkout</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Main Checkout Form Area */}
          <div className="flex-1">
            {/* Steps Indicator */}
            <div className="flex items-center gap-4 mb-10">
              {[
                { num: 1, label: "Info" },
                { num: 2, label: "Shipping" },
                { num: 3, label: "Payment" }
              ].map((s, index) => (
                <div key={s.num} className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 ${step >= s.num ? "text-accent" : "text-on-surface-variant opacity-50"}`}>
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-black ${step >= s.num ? "bg-accent text-on-accent" : "bg-surface border border-border text-on-surface-variant"}`}>
                      {s.num}
                    </span>
                    <span className="font-headline font-black uppercase text-xs tracking-widest">{s.label}</span>
                  </div>
                  {index < 2 && <div className="w-4 h-[1px] bg-border" />}
                </div>
              ))}
            </div>

            {/* Step 1: Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black uppercase font-headline tracking-tight mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">First Name</label>
                    <input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-background border border-border px-4 py-3 sm:py-3.5 text-on-surface text-sm focus:outline-none focus:border-accent transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">Last Name</label>
                    <input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-background border border-border px-4 py-3 sm:py-3.5 text-on-surface text-sm focus:outline-none focus:border-accent transition-colors" />
                  </div>
                </div>
                <div>
                  <label htmlFor="emailAddress" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">Email Address</label>
                  <input id="emailAddress" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-background border border-border px-4 py-3 sm:py-3.5 text-on-surface text-sm focus:outline-none focus:border-accent transition-colors" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">Phone Number</label>
                  <input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+880 1XXX-XXXXXX" className="w-full bg-background border border-border px-4 py-3 sm:py-3.5 text-on-surface text-sm focus:outline-none focus:border-accent transition-colors" />
                </div>
                <button 
                  onClick={() => setStep(2)}
                  disabled={!firstName || !email}
                  className="w-full bg-accent text-on-accent py-4 mt-8 font-headline font-bold uppercase tracking-tight text-base hover:bg-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Shipping
                </button>
              </div>
            )}

            {/* Step 2: Shipping */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black uppercase font-headline tracking-tight mb-6">Shipping Details</h2>
                <div>
                  <label htmlFor="addressConfig" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">Address</label>
                  <input id="addressConfig" type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-background border border-border px-4 py-3 flex items-center text-sm focus:outline-none focus:border-accent transition-colors" placeholder="House no, Road, Area" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">City / Zilla</label>
                    <input id="city" type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors" placeholder="Dhaka" />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">Postal Code</label>
                    <input id="postalCode" type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors" placeholder="1205" />
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="mt-8 border border-accent p-4 bg-accent/5 flex items-center justify-between cursor-pointer">
                   <div className="flex items-center gap-3">
                     <div className="w-4 h-4 rounded-full bg-accent" />
                     <span className="font-headline font-bold uppercase tracking-widest text-sm">Express Tactical</span>
                   </div>
                   <span className="font-headline font-bold">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>

                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-surface border border-border text-on-surface py-4 font-headline font-bold uppercase tracking-tight text-sm hover:border-on-surface-variant transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    disabled={!address || !city}
                    className="w-2/3 bg-accent text-on-accent py-4 font-headline font-bold uppercase tracking-tight text-sm hover:bg-accent-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black uppercase font-headline tracking-tight mb-6 flex items-center gap-3">
                  <CreditCard size={24} className="text-accent" /> Payment Method
                </h2>
                
                {/* Payment Method Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {paymentMethods.map(pm => (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`flex flex-col items-center gap-2 p-4 border transition-all ${
                        paymentMethod === pm.id
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border text-on-surface-variant hover:border-border-hover hover:text-on-surface"
                      }`}
                    >
                      {pm.icon}
                      <span className="font-headline font-bold uppercase text-xs tracking-tight">{pm.label}</span>
                      <span className="text-[10px] opacity-60">{pm.desc}</span>
                    </button>
                  ))}
                </div>

                {/* Payment method specific fields */}
                {paymentMethod === "card" && (
                  <div className="bg-surface border border-border p-6 rounded-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
                    <div className="relative z-10 space-y-5">
                      <div>
                        <label htmlFor="cardNumber" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">Card Number</label>
                        <input id="cardNumber" type="text" maxLength={19} className="w-full bg-background border border-border px-4 py-3 tracking-widest font-mono text-sm focus:outline-none focus:border-accent transition-colors" placeholder="**** **** **** ****" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiration" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">Expiration</label>
                          <input id="expiration" type="text" maxLength={5} className="w-full bg-background border border-border px-4 py-3 text-sm font-mono focus:outline-none focus:border-accent transition-colors" placeholder="MM/YY" />
                        </div>
                        <div>
                          <label htmlFor="cvc" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">CVC</label>
                          <input id="cvc" type="text" maxLength={3} className="w-full bg-background border border-border px-4 py-3 text-sm font-mono focus:outline-none focus:border-accent transition-colors" placeholder="***" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "bkash" && (
                  <div className="bg-surface border border-border p-6 rounded-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#E2136E] flex items-center justify-center text-white font-bold text-sm">b</div>
                      <span className="font-headline font-bold uppercase tracking-tight">bKash Payment</span>
                    </div>
                    <label htmlFor="bkashNumber" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">bKash Number</label>
                    <input 
                      id="bkashNumber" type="tel" value={bkashNumber} onChange={e => setBkashNumber(e.target.value)}
                      className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors" 
                      placeholder="01XXX-XXXXXX" 
                    />
                    <p className="text-xs text-on-surface-variant mt-3">You will receive a payment confirmation request on your bKash app.</p>
                  </div>
                )}

                {paymentMethod === "nagad" && (
                  <div className="bg-surface border border-border p-6 rounded-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#F6921E] flex items-center justify-center text-white font-bold text-sm">N</div>
                      <span className="font-headline font-bold uppercase tracking-tight">Nagad Payment</span>
                    </div>
                    <label htmlFor="nagadNumber" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">Nagad Number</label>
                    <input 
                      id="nagadNumber" type="tel" value={nagadNumber} onChange={e => setNagadNumber(e.target.value)}
                      className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors" 
                      placeholder="01XXX-XXXXXX" 
                    />
                    <p className="text-xs text-on-surface-variant mt-3">You will receive a payment confirmation request on your Nagad app.</p>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="bg-surface border border-border p-6 rounded-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Banknote size={24} className="text-accent" />
                      <span className="font-headline font-bold uppercase tracking-tight">Cash on Delivery</span>
                    </div>
                    <p className="text-sm text-on-surface-variant">Pay with cash when your order is delivered to your doorstep. Please have the exact amount ready.</p>
                    <div className="mt-4 bg-accent/10 border border-accent/30 p-3 rounded-sm">
                      <p className="text-xs font-headline font-bold uppercase tracking-widest text-accent">
                        Amount Due: {formatPrice(total)}
                      </p>
                    </div>
                  </div>
                )}

                {orderError && (
                  <div className="bg-error/10 border border-error/30 text-error px-4 py-3 text-sm font-headline uppercase tracking-widest">
                    {orderError}
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => setStep(2)}
                    className="w-1/3 bg-surface border border-border text-on-surface py-4 font-headline font-bold uppercase tracking-tight text-base hover:border-on-surface-variant transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleCompleteOrder}
                    disabled={isProcessing}
                    className="w-2/3 flex items-center justify-center gap-2 bg-accent text-on-accent py-4 font-headline font-black uppercase tracking-widest text-base hover:bg-accent-dim transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? "Processing..." : `Pay ${formatPrice(total)}`}
                    {!isProcessing && <ArrowRight size={18} />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Sidebar */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-surface border border-border p-6 rounded sticky top-24">
              <h3 className="text-xl font-black uppercase font-headline tracking-tight mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 pr-2 max-h-[40vh] overflow-y-auto custom-scrollbar">
                {items.map((item) => (
                  <div key={`${item.kitId}-${item.size}`} className="flex gap-4">
                    <div className="w-16 h-20 bg-surface-high relative border border-border/50 overflow-hidden rounded shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                    </div>
                    <div className="flex-1 py-1 flex flex-col justify-between">
                      <div>
                        <p className="font-headline font-bold text-sm tracking-tight leading-tight line-clamp-1">{item.name}</p>
                        <p className="text-xs text-on-surface-variant mt-1 font-body">Size: <span className="font-headline font-bold text-on-surface">{item.size}</span></p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-on-surface-variant">Qty: {item.quantity}</p>
                        <p className="font-headline font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="pb-5 mb-1 border-b border-border">
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-accent/10 border border-accent/30 px-3 py-2.5 rounded-sm">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-accent" />
                      <span className="text-xs font-headline font-bold uppercase tracking-widest text-accent">
                        {appliedPromo.code} — {appliedPromo.discount_percent}% OFF
                      </span>
                    </div>
                    <button onClick={handleRemovePromo} className="text-accent hover:text-on-surface transition-colors" aria-label="Remove promo code">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        id="promoCode"
                        type="text"
                        placeholder="Promo code"
                        aria-label="Promo code"
                        value={promoInput}
                        onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                        className="w-full bg-background border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors uppercase tracking-widest font-headline"
                      />
                    </div>
                    <button
                      onClick={handleApplyPromo}
                      className="bg-surface-high border border-border hover:border-accent text-on-surface hover:text-accent px-4 py-2.5 font-headline font-bold uppercase text-xs tracking-tight transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="text-error text-xs mt-2 font-headline uppercase tracking-widest">{promoError}</p>
                )}
              </div>

              <div className="space-y-3 pt-4 font-headline font-bold tracking-wide">
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-accent">
                    <span>Discount ({appliedPromo?.discount_percent}%)</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>VAT ({(vatRate * 100).toFixed(0)}%)</span>
                  <span>{formatPrice(vat)}</span>
                </div>
                <div className="flex justify-between text-lg text-accent pt-3 border-t border-border">
                  <span>Total Due</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
