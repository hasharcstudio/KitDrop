"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Heart, Star } from "lucide-react";
import { Kit } from "@/data/kits";
import { useWishlistStore } from "@/store/wishlist";
import { useUIStore } from "@/store/ui";
import { formatPrice } from "@/lib/currency";

const emptySubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export default function KitCard({ kit }: { kit: Kit }) {
  const { items: wishlistItems, toggleItem } = useWishlistStore();
  const { openQuickView } = useUIStore();
  const hydrated = useHydrated();
  
  const inWishlist = hydrated && wishlistItems.includes(kit.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <div className="group bg-surface border border-border hover:border-border-hover transition-all overflow-hidden relative">
        {/* Image */}
        <Link href={`/product/${kit.id}`} className="block">
          <div className="relative aspect-[3/4] kit-gradient overflow-hidden">
            <Image
              src={kit.image}
              alt={kit.name}
              fill
              className="object-contain p-4 sm:p-6 group-hover:scale-105 transition-transform duration-500 rounded-[20px]"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
            />

            {/* Club Badge */}
            {kit.badgeImage && (
              <div className="absolute top-3 left-3 w-7 h-7 sm:w-8 sm:h-8 bg-surface-high/60 backdrop-blur-sm flex items-center justify-center">
                <Image
                  src={kit.badgeImage}
                  alt={kit.clubName}
                  width={24}
                  height={24}
                  className="w-5 h-5 object-contain"
                />
              </div>
            )}

            {/* Wishlist */}
            <button
              className="absolute top-3 right-3 p-2 text-on-surface-variant/40 hover:text-accent transition-colors z-20"
              aria-label={`Add ${kit.name} to wishlist`}
              onClick={(e) => {
                e.preventDefault();
                toggleItem(kit.id);
              }}
            >
              <Heart size={18} className={inWishlist ? "fill-accent text-accent" : ""} />
            </button>

            {/* Type Tag */}
            <div className="absolute bottom-3 left-3">
              <span
                className={`text-[10px] font-headline font-bold uppercase px-2 py-0.5 tracking-tight ${
                  kit.type === "Home"
                    ? "bg-accent text-on-accent"
                    : kit.type === "Away"
                    ? "bg-surface-high text-on-surface"
                    : "bg-surface-highest text-on-surface"
                }`}
              >
                {kit.type}
              </span>
            </div>
          </div>
        </Link>

        {/* Info */}
        <div className="p-3 sm:p-4">
          <Link href={`/product/${kit.id}`}>
            <h3 className="font-headline font-bold uppercase text-xs sm:text-sm tracking-tight truncate hover:text-accent transition-colors">
              {kit.name}
            </h3>
          </Link>

          <div className="flex items-center justify-between mt-1.5 sm:mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-accent font-bold text-sm sm:text-base">
                {formatPrice(kit.price)}
              </span>
              {kit.originalPrice && (
                <span className="text-on-surface-variant/50 text-xs line-through">
                  {formatPrice(kit.originalPrice)}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="hidden sm:flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={10}
                    className={i < kit.rating ? "text-accent fill-accent" : "text-on-surface-variant/20"}
                  />
                ))}
              </div>
              <span className="text-on-surface-variant text-[10px]">
                ({kit.reviewCount})
              </span>
            </div>
          </div>
        </div>

        {/* Hover Add to Cart — desktop only */}
        <div className="hidden sm:block absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={() => openQuickView(kit)}
            className="w-full bg-accent text-on-accent py-2.5 font-headline font-bold uppercase text-xs tracking-tight hover:bg-accent-dim transition-colors"
          >
            Quick Shop
          </button>
        </div>

        {/* Mobile Add to Cart */}
        <div className="sm:hidden px-3 pb-3">
          <button
            onClick={() => openQuickView(kit)}
            className="w-full bg-accent text-on-accent py-2.5 font-headline font-bold uppercase text-xs tracking-tight active:scale-[0.98]"
          >
            Quick Shop
          </button>
        </div>
      </div>
    </motion.div>
  );
}
