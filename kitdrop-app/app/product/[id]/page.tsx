"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Star,
  Heart,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { kits, getKitById } from "@/data/kits";
import { fetchKitById } from "@/lib/store-api";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { formatPrice } from "@/lib/currency";
import { toast } from "sonner";
import type { Kit } from "@/data/kits";

const editions = ["Home", "Away", "Third"] as const;

function AccordionSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 sm:py-5 text-left active:scale-[0.99]"
      >
        <span className="font-headline font-bold uppercase text-sm sm:text-base tracking-tight">
          {title}
        </span>
        {open ? (
          <ChevronUp size={18} className="text-on-surface-variant" />
        ) : (
          <ChevronDown size={18} className="text-on-surface-variant" />
        )}
      </button>
      {open && (
        <div className="pb-4 sm:pb-5 text-on-surface-variant text-sm leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

function DropTimer() {
  const [time, setTime] = useState({ days: 2, hours: 14, mins: 35 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { days, hours, mins } = prev;
        mins -= 1;
        if (mins < 0) {
          mins = 59;
          hours -= 1;
        }
        if (hours < 0) {
          hours = 23;
          days -= 1;
        }
        if (days < 0) {
          days = 0;
          hours = 0;
          mins = 0;
        }
        return { days, hours, mins };
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-surface-high border border-border p-4 sm:p-6 relative overflow-hidden">
      {/* Large ghost text */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 text-on-surface-variant/[0.03] text-6xl sm:text-7xl font-black font-headline uppercase tracking-tight pointer-events-none select-none">
        CFC
      </div>

      <p className="text-accent text-[10px] sm:text-xs uppercase tracking-[0.2em] font-headline font-bold mb-3">
        Next Drop In:
      </p>
      <div className="flex gap-4 sm:gap-6 mb-3 sm:mb-4">
        {[
          { v: time.days.toString().padStart(2, "0"), l: "Days" },
          { v: time.hours.toString().padStart(2, "0"), l: "Hours" },
          { v: time.mins.toString().padStart(2, "0"), l: "Mins" },
        ].map((t) => (
          <div key={t.l} className="text-center">
            <p className="text-3xl sm:text-4xl md:text-5xl font-black font-headline text-accent">
              {t.v}
            </p>
            <p className="text-on-surface-variant text-[9px] sm:text-[10px] uppercase tracking-wider font-headline mt-0.5">
              {t.l}
            </p>
          </div>
        ))}
      </div>
      <p className="text-on-surface-variant text-xs sm:text-sm mb-3">
        Global release of the Limited Edition 130th Anniversary Collection.
      </p>
      <button onClick={() => toast.success("We'll back-in-stock notify you!")} className="text-accent font-headline font-bold uppercase text-sm tracking-tight flex items-center gap-2 group">
        Notify Me
        <ArrowRight
          size={16}
          className="group-hover:translate-x-1 transition-transform"
        />
      </button>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const [kit, setKit] = useState<Kit | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeEdition, setActiveEdition] = useState<string>("Home");
  const [activeSize, setActiveSize] = useState("M");
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCartStore();
  const { items: wishlistItems, toggleItem } = useWishlistStore();
  const inWishlist = kit ? wishlistItems.includes(kit.id) : false;

  // Fetch product from Supabase (fallback to static)
  useEffect(() => {
    const id = params.id as string;
    fetchKitById(id).then((result) => {
      const resolved = result || getKitById(id) || kits[6];
      setKit(resolved);
      setActiveEdition(resolved.type);
      setLoading(false);
    });
  }, [params.id]);

  if (loading || !kit) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-on-surface-variant text-sm font-headline uppercase tracking-widest">Loading Kit...</p>
        </div>
      </div>
    );
  }

  const images = kit.images?.length ? kit.images : [kit.image];
  const allSizes = kit.sizes?.length ? kit.sizes : ["XS", "S", "M", "L", "XL", "XXL"];

  const handleAddToBag = () => {
    addItem({
      kitId: kit.id,
      name: `${kit.clubName} ${activeEdition} ${kit.season}`,
      image: kit.image,
      price: kit.price,
      size: activeSize,
      type: activeEdition,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="w-full max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* LEFT — Gallery */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square bg-surface border border-border overflow-hidden mb-3 sm:mb-4">
              <Image
                src={images[activeImage]}
                alt={kit.name}
                fill
                className="object-contain p-6 sm:p-10 rounded-[32px]"
                priority
              />
              {/* Tags */}
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 flex gap-2">
                {kit.isAuthentic && (
                  <span className="bg-accent/10 border border-accent/30 text-accent text-[10px] font-headline font-bold uppercase px-2 py-0.5">
                    Authentic
                  </span>
                )}
                {kit.isNew && (
                  <span className="bg-surface-high text-on-surface text-[10px] font-headline font-bold uppercase px-2 py-0.5">
                    New Drop
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto hide-scrollbar">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    title={`View image ${i + 1}`}
                    aria-label={`View image ${i + 1}`}
                    className={`w-16 h-16 sm:w-20 sm:h-20 border flex-shrink-0 overflow-hidden transition-all ${
                      activeImage === i
                        ? "border-accent"
                        : "border-border hover:border-border-hover"
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={img}
                        alt={`${kit.name} view ${i + 1}`}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Product Info */}
          <div className="space-y-5 sm:space-y-6">
            {/* Club + Rating */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase font-headline tracking-tight leading-tight">
                {kit.clubName}
              </h1>
              <p className="text-accent text-lg sm:text-xl font-headline font-bold uppercase tracking-tight mt-1">
                {kit.season} {activeEdition} Kit
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < kit.rating
                          ? "text-accent fill-accent"
                          : "text-on-surface-variant/20"
                      }
                    />
                  ))}
                </div>
                <span className="text-on-surface-variant text-xs tracking-wider uppercase font-headline">
                  ({kit.reviewCount} Reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black font-headline">
                {formatPrice(kit.price)}
              </span>
              {kit.originalPrice && (
                <span className="text-on-surface-variant text-lg line-through">
                  {formatPrice(kit.originalPrice)}
                </span>
              )}
            </div>

            {/* Edition Tabs */}
            <div>
              <p className="text-on-surface-variant text-xs tracking-widest uppercase font-headline font-semibold mb-3">
                Select Edition
              </p>
              <div className="grid grid-cols-3 gap-2">
                {editions.map((ed) => (
                  <button
                    key={ed}
                    onClick={() => setActiveEdition(ed)}
                    className={`text-center py-2.5 sm:py-3 border text-xs sm:text-sm font-headline font-bold uppercase tracking-tight transition-all active:scale-95 ${
                      activeEdition === ed
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border text-on-surface hover:border-border-hover"
                    }`}
                  >
                    {ed}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-on-surface-variant text-xs tracking-widest uppercase font-headline font-semibold">
                  Choose Size
                </p>
                <button className="text-accent text-xs font-headline font-bold uppercase tracking-tight underline underline-offset-2">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {allSizes.map((s) => {
                  const outOfStock = kit.outOfStockSizes?.includes(s);
                  return (
                    <button
                      key={s}
                      disabled={outOfStock}
                      onClick={() => setActiveSize(s)}
                      className={`text-center py-2.5 sm:py-3 border text-xs sm:text-sm font-headline font-bold transition-all active:scale-95 ${
                        outOfStock
                          ? "border-border/30 text-on-surface-variant/30 cursor-not-allowed line-through"
                          : activeSize === s
                          ? "bg-accent text-on-accent border-accent"
                          : "border-border text-on-surface hover:border-border-hover"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToBag}
                className="w-full bg-accent text-on-accent py-4 font-headline font-bold uppercase tracking-tight text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-accent-dim transition-colors"
              >
                <ShoppingCart size={18} />
                Add to Bag
              </motion.button>
              <button
                onClick={() => {
                  toggleItem(kit.id);
                  if (!inWishlist) {
                    toast.success(`${kit.clubName} saved to wishlist`);
                  } else {
                    toast("Removed from wishlist");
                  }
                }}
                className={`w-full border hover:border-accent py-3.5 sm:py-4 font-headline font-bold uppercase tracking-tight text-sm sm:text-base flex items-center justify-center gap-2 transition-colors group ${
                  inWishlist ? "border-accent text-accent" : "border-border text-on-surface hover:text-accent"
                }`}
              >
                <Heart size={18} className={inWishlist ? "fill-accent text-accent" : ""} />
                {inWishlist ? "Wishlisted" : "Wishlist"}
              </button>
            </div>

            {/* Accordions */}
            <div>
              <AccordionSection title="Description" defaultOpen>
                <p>{kit.description || `Engineered for high-intensity play, the ${kit.season} ${activeEdition} Kit features advanced dry-fit technology. Premium technical fabric for the modern supporter.`}</p>
              </AccordionSection>
              <AccordionSection title="Material & Care">
                <ul className="space-y-1.5">
                  <li>• 100% Recycled Polyester</li>
                  <li>• Dri-FIT ADV Technology</li>
                  <li>• Heat-transferred team crest</li>
                  <li>• Machine wash cold, tumble dry low</li>
                  <li>• Authentic player-issue specification</li>
                </ul>
              </AccordionSection>
              <AccordionSection title="Shipping & Returns">
                <ul className="space-y-1.5">
                  <li>• Free shipping on orders over ৳80</li>
                  <li>• Standard delivery: 5-7 business days</li>
                  <li>• Express delivery: 1-3 business days</li>
                  <li>• 30-day return policy</li>
                  <li>• Free returns on all orders</li>
                </ul>
              </AccordionSection>
            </div>

            {/* Drop Timer */}
            <DropTimer />
          </div>
        </div>
      </div>
    </div>
  );
}
