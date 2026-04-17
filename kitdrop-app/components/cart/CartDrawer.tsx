"use client";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatPrice, CURRENCY_SYMBOL } from "@/lib/currency";

export default function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } =
    useCartStore();
  const shipping = subtotal() > 80 ? 0 : 9.99;
  const total = subtotal() + shipping;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-surface z-[61] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-accent" />
                <h2 className="font-headline font-bold uppercase text-lg sm:text-xl tracking-tight">
                  Your Bag
                </h2>
                <span className="text-on-surface-variant text-xs">
                  ({items.length} {items.length === 1 ? "item" : "items"})
                </span>
              </div>
              <button
                onClick={closeCart}
                className="text-on-surface-variant hover:text-on-surface transition-colors p-1 active:scale-95"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <ShoppingBag
                    size={48}
                    className="text-on-surface-variant/30"
                  />
                  <p className="text-on-surface-variant text-sm">
                    Your bag is empty
                  </p>
                  <button
                    onClick={closeCart}
                    className="text-accent font-headline font-bold uppercase text-sm tracking-tight border-b border-accent"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.kitId}-${item.size}`}
                    className="flex gap-3 sm:gap-4 p-3 bg-surface-high border border-border"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-20 sm:w-20 sm:h-24 bg-background flex-shrink-0 relative overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1 rounded-xl"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="font-headline font-bold uppercase text-xs sm:text-sm tracking-tight truncate">
                          {item.name}
                        </h3>
                        <div className="flex gap-2 mt-0.5 text-on-surface-variant text-[10px] sm:text-xs">
                          <span>Size: {item.size}</span>
                          <span>·</span>
                          <span>{item.type}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Qty Stepper */}
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.kitId,
                                item.size,
                                item.quantity - 1
                              )
                            }
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-on-surface-variant hover:text-accent transition-colors active:scale-95"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-headline font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.kitId,
                                item.size,
                                item.quantity + 1
                              )
                            }
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-on-surface-variant hover:text-accent transition-colors active:scale-95"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-accent font-bold text-sm sm:text-base">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(item.kitId, item.size)}
                            className="text-on-surface-variant hover:text-error transition-colors p-1 active:scale-95"
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer — Totals + CTA */}
            {items.length > 0 && (
              <div className="border-t border-border p-4 sm:p-5 space-y-3 bg-surface-high">
                {/* Promo hint */}
                <p className="text-center text-on-surface-variant text-[10px] sm:text-xs font-headline uppercase tracking-widest">
                  Have a promo code? Apply it at checkout
                </p>

                {/* Totals */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal())}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-success">FREE</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-headline font-bold text-base sm:text-lg pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-accent">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Checkout */}
                <button 
                  onClick={() => {
                    closeCart();
                    router.push("/checkout");
                  }}
                  className="w-full bg-accent text-on-accent py-3.5 sm:py-4 font-headline font-bold uppercase tracking-tight text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-accent-dim transition-colors group active:scale-[0.98]"
                >
                  Proceed to Checkout
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>

                <p className="text-center text-on-surface-variant text-[10px] sm:text-xs">
                  Free shipping on orders over {CURRENCY_SYMBOL}80
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
