"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { nations } from "@/data/nations";

export default function BrowseByNation() {
  return (
    <section className="py-24 lg:py-32 bg-surface-low">
      <div className="w-full max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-0.5 bg-accent" />
          <span className="text-accent text-xs tracking-[0.2em] uppercase font-headline font-bold">
            Global Archive
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase font-headline tracking-tight mb-2 sm:mb-3">
          Browse By Nation
        </h2>
        <p className="text-on-surface-variant text-sm sm:text-base mb-8 sm:mb-10 max-w-lg">
          Explore football culture across 40+ countries. Every nation, every
          league, every club.
        </p>

        {/* Nation Grid — 1 col mobile, 2 tablet, 3 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {nations.map((nation, i) => (
            <motion.div
              key={nation.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="group relative aspect-[16/10] overflow-hidden bg-surface border border-border hover:border-border-hover transition-all cursor-pointer rounded-[24px] shadow-lg">
                {/* BG Image */}
                <Image
                  src={nation.bgImage}
                  alt={nation.name}
                  fill
                  className="object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />

                {/* Flag Badge */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-6 sm:w-10 sm:h-7 overflow-hidden border border-border">
                  <Image
                    src={nation.flagImage}
                    alt={`${nation.name} flag`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Live Badge */}
                {nation.isLive && (
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex items-center gap-1.5 bg-accent/10 border border-accent/30 px-2 py-1">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-glow" />
                    <span className="text-accent text-[9px] sm:text-[10px] font-headline font-bold uppercase tracking-tight">
                      Live Drops
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <h3 className="text-xl sm:text-2xl font-black uppercase font-headline tracking-tight mb-1">
                    {nation.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-on-surface-variant">
                    <MapPin size={12} />
                    <span className="text-[10px] sm:text-xs tracking-widest uppercase font-headline font-semibold">
                      {nation.kitCount} Kits Available
                    </span>
                  </div>

                  {/* Kit Highlight — visible on hover (desktop) / always visible (mobile) */}
                  {nation.kitHighlight && (
                    <p className="text-[10px] sm:text-xs text-on-surface-variant/80 font-body mt-2 sm:mt-0 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300 line-clamp-2">
                      {nation.kitHighlight}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
