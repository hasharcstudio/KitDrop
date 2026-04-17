"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { kits as staticKits, Kit } from "@/data/kits";
import { fetchKits } from "@/lib/store-api";
import { formatPrice } from "@/lib/currency";

export default function FeaturedDrops() {
  const [featuredKits, setFeaturedKits] = useState<Kit[]>(staticKits.slice(0, 3));

  useEffect(() => {
    fetchKits().then((allKits) => {
      setFeaturedKits(allKits.filter(k => k.isNew).slice(0, 3));
    });
  }, []);
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="w-full max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase font-headline tracking-tight">
              Latest Drops
            </h2>
            <p className="text-on-surface-variant text-sm sm:text-base mt-1 sm:mt-2">
              New 2025/26 Season home and away kits arriving daily from Europe&apos;s
              biggest clubs.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-accent font-headline font-bold uppercase text-sm tracking-tight flex items-center gap-1.5 border-b-2 border-accent pb-0.5 hover:opacity-80 transition-opacity self-start sm:self-auto whitespace-nowrap group"
          >
            View All New Arrivals
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Kit Carousel — Horizontal Scrollable Row */}
        <div className="flex gap-4 sm:gap-5 lg:gap-6 overflow-x-auto hide-scrollbar pb-6 snap-x snap-mandatory">
          {featuredKits.map((kit, i) => (
            <motion.div
              key={kit.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              viewport={{ once: true }}
              className="w-[85vw] sm:w-[45vw] lg:w-[400px] flex-shrink-0 snap-center sm:snap-start"
            >
              <Link
                href={`/product/${kit.id}`}
                className="group block bg-surface border border-border hover:border-border-hover transition-all overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] kit-gradient overflow-hidden">
                  <Image
                    src={kit.image}
                    alt={kit.name}
                    fill
                    className="object-contain p-6 sm:p-8 group-hover:scale-105 transition-transform duration-500 rounded-[24px]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Tags */}
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    {kit.isAuthentic && (
                      <span className="bg-accent/10 border border-accent/30 text-accent text-[10px] font-headline font-bold uppercase px-2 py-0.5 tracking-tight">
                        Authentic
                      </span>
                    )}
                    {kit.isNew && (
                      <span className="bg-surface-high text-on-surface text-[10px] font-headline font-bold uppercase px-2 py-0.5 tracking-tight">
                        New Drop
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 sm:p-5 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-on-surface-variant text-[10px] sm:text-xs tracking-widest uppercase font-headline font-semibold mb-1">
                      {kit.leagueName}
                    </p>
                    <h3 className="text-sm sm:text-base font-headline font-bold uppercase tracking-tight truncate">
                      {kit.name}
                    </h3>
                    <p className="text-accent font-bold text-base sm:text-lg mt-1">
                      {formatPrice(kit.price)}
                    </p>
                  </div>
                  <button
                    className="text-on-surface-variant hover:text-accent transition-colors p-2 -m-2 flex-shrink-0"
                    aria-label={`Add ${kit.name} to bag`}
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
