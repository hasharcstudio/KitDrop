"use client";
import { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/wishlist";
import { fetchKits } from "@/lib/store-api";
import type { Kit } from "@/data/kits";
import KitCard from "@/components/ui/KitCard";
import Link from "next/link";
import { ShoppingBag, HeartCrack } from "lucide-react";
import { motion } from "framer-motion";

export default function WishlistPage() {
  const { items: wishlistItems } = useWishlistStore();
  const [mounted, setMounted] = useState(false);
  const [allKits, setAllKits] = useState<Kit[]>([]);

  useEffect(() => {
    fetchKits().then(setAllKits);
    queueMicrotask(() => setMounted(true));
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  const wishlistKits = allKits.filter((kit) => wishlistItems.includes(kit.id));

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="w-full max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16">
        <div className="mb-10 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase font-headline tracking-tight">
            Your Wishlist
          </h1>
          <p className="text-on-surface-variant mt-2 max-w-2xl text-sm sm:text-base">
            Your curated collection of premium football hardware and official kits.
          </p>
        </div>

        {wishlistKits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-12 lg:p-24 bg-surface border border-border text-center"
          >
            <HeartCrack size={48} className="text-on-surface-variant/30 mb-6" />
            <h2 className="text-2xl sm:text-3xl font-headline font-black uppercase tracking-tight mb-2">
              Your arsenal is empty
            </h2>
            <p className="text-on-surface-variant max-w-sm mx-auto mb-8">
              You haven&apos;t saved any gear to your wishlist yet.
            </p>
            <Link
              href="/shop"
              className="bg-accent text-on-accent font-headline font-bold uppercase tracking-tight px-8 py-3.5 hover:bg-accent-dim transition-colors flex items-center gap-2"
            >
              <ShoppingBag size={18} />
              Explore The Shop
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {wishlistKits.map((kit) => (
              <KitCard key={kit.id} kit={kit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
