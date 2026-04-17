"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useUIStore } from "@/store/ui";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { toast } from "sonner";
import { formatPrice } from "@/lib/currency";

export default function QuickViewModal() {
  const { isQuickViewOpen, activeQuickViewKit, closeQuickView } = useUIStore();
  const { addItem } = useCartStore();
  const { items: wishlistItems, toggleItem } = useWishlistStore();
  
  const [selectedSize, setSelectedSize] = useState<string>("");

  if (!isQuickViewOpen || !activeQuickViewKit) return null;

  const kit = activeQuickViewKit;
  const inWishlist = wishlistItems.includes(kit.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size first!");
      return;
    }
    addItem({ ...kit, kitId: kit.id, size: selectedSize });
    toast.success(`${kit.name} added to cart!`);
    closeQuickView();
  };

  const handleToggleWishlist = () => {
    toggleItem(kit.id);
    if (!inWishlist) {
      toast.success(`${kit.name} saved to wishlist`);
    } else {
      toast("Removed from wishlist");
    }
  };

  return (
    <AnimatePresence>
      {isQuickViewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-surface border border-border shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh] overflow-hidden"
          >
            <button
              onClick={closeQuickView}
              className="absolute top-4 right-4 z-20 text-on-surface-variant hover:text-accent bg-surface-high p-2 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Left Image Area */}
            <div className="w-full md:w-1/2 bg-surface-high p-8 flex items-center justify-center relative min-h-[300px]">
              <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full scale-75" />
              <Image
                src={kit.image}
                alt={kit.name}
                width={400}
                height={400}
                className="object-contain relative z-10 drop-shadow-2xl"
              />
            </div>

            {/* Right Details Area */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
              <div className="flex items-center gap-2 mb-3 mt-4 md:mt-0">
                <span className="text-xl font-black font-headline text-accent">
                  {formatPrice(kit.price)}
                </span>
                {kit.originalPrice && (
                  <span className="text-sm font-body text-on-surface-variant line-through">
                    {formatPrice(kit.originalPrice)}
                  </span>
                )}
              </div>

              <h2 className="text-3xl md:text-4xl font-black uppercase italic font-headline tracking-tight leading-none mb-4">
                {kit.name}
              </h2>

              <p className="text-sm text-on-surface-variant leading-relaxed mb-6 font-body">
                {kit.description || `Official ${kit.season} ${kit.type} kit. Engineered with high-performance moisture-wicking technology.`}
              </p>

              {/* Sizes */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest font-headline font-semibold text-on-surface-variant">
                    Select Size
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {kit.sizes.map((size) => {
                    const isOut = kit.outOfStockSizes?.includes(size);
                    return (
                      <button
                        key={size}
                        disabled={isOut}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[3rem] px-3 h-12 flex items-center justify-center font-headline font-bold text-sm uppercase transition-colors
                          ${
                            isOut
                              ? "opacity-30 cursor-not-allowed border border-border"
                              : selectedSize === size
                              ? "bg-accent text-on-accent border border-accent shadow-[0_0_15px_rgba(230,255,0,0.3)]"
                              : "border border-border text-on-surface hover:border-accent"
                          }
                        `}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-accent text-on-accent font-headline font-bold uppercase tracking-tight py-4 flex items-center justify-center gap-2 hover:bg-accent-dim transition-colors active:scale-95"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className="w-14 shrink-0 flex items-center justify-center border border-border hover:border-accent text-on-surface hover:text-accent transition-colors active:scale-95"
                  aria-label="Toggle Wishlist"
                >
                  <Heart
                    size={20}
                    className={inWishlist ? "fill-accent stroke-accent" : ""}
                  />
                </button>
              </div>
              
              <Link
                href={`/product/${kit.id}`}
                onClick={closeQuickView}
                className="mt-6 text-center text-xs tracking-widest uppercase font-headline font-semibold text-on-surface-variant hover:text-accent transition-colors underline underline-offset-4"
              >
                View Full Details
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
