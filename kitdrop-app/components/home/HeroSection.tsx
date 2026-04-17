"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { kits as staticKits, Kit } from "@/data/kits";
import { fetchSettings, fetchKits } from "@/lib/store-api";

export default function HeroSection() {
  const [heroKits, setHeroKits] = useState<Kit[]>(staticKits.slice(0, 3));
  const [currentKit, setCurrentKit] = useState(0);

  useEffect(() => {
    // Try to load hero kit IDs from store settings
    Promise.all([fetchSettings(), fetchKits()]).then(([settings, allKits]) => {
      if (settings.hero_kit_ids?.length > 0) {
        const resolved = settings.hero_kit_ids
          .map((id) => allKits.find((k) => k.id === id))
          .filter(Boolean) as Kit[];
        if (resolved.length > 0) {
          setHeroKits(resolved);
          return;
        }
      }
      // Fallback: use first 3 kits from the full catalogue
      setHeroKits(allKits.slice(0, 3));
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentKit((prev) => (prev + 1) % heroKits.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroKits.length]);

  return (
    <section className="relative min-h-[90vh] sm:min-h-[85vh] md:min-h-screen stadium-gradient overflow-hidden">
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16 h-full min-h-[90vh] sm:min-h-[85vh] md:min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center pt-24 lg:pt-32 pb-16">
        {/* LEFT — Text Content */}
        <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-on-surface-variant text-xs sm:text-sm tracking-[0.25em] uppercase font-headline font-semibold mb-3 sm:mb-4"
          >
            Official Kits. Elite Footwear. Pro Accessories.
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase leading-[0.85] tracking-tight font-headline mb-4 sm:mb-6"
          >
            Wear
            <br />
            Your
            <br />
            <span className="text-accent italic">Club.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-on-surface-variant text-base sm:text-lg max-w-md leading-relaxed mb-8 sm:mb-10 lg:mx-0 mx-auto"
          >
            We don&apos;t just dress the fans. We gear up the athletes. Experience our brand new inventory of Firm Ground Boots, specialized Turfs, and performance hardware.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link
              href="/shop"
              className="bg-accent text-on-accent font-headline font-bold uppercase tracking-tight text-base sm:text-lg px-8 py-4 min-h-[48px] flex items-center justify-center gap-2 hover:bg-accent-dim transition-colors group"
            >
              Shop All Kits
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/nations"
              className="border-2 border-white/50 hover:border-white bg-transparent text-white font-headline font-bold uppercase tracking-tight text-base sm:text-lg px-8 py-4 min-h-[48px] flex items-center justify-center gap-2 transition-colors group"
            >
              Browse Leagues
              <ChevronRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        </div>

        {/* RIGHT — Kit Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex items-center justify-center relative w-full pb-20 lg:pb-0"
        >
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[500px] lg:h-[500px] flex items-center justify-center">

            {/* Kit Image */}
            {heroKits.map((kit, i) => (
              <motion.div
                key={kit.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: i === currentKit ? 1 : 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Image
                  src={kit.image}
                  alt={kit.name}
                  width={600}
                  height={600}
                  className="object-contain drop-shadow-2xl w-full h-full rounded-[40px] mix-blend-plus-lighter"
                  priority={i === 0}
                />
              </motion.div>
            ))}

            {/* Kit indicator dots */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {heroKits.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentKit(i)}
                  className={`w-2 h-2 transition-all ${
                    i === currentKit
                      ? "bg-accent w-6"
                      : "bg-on-surface-variant/30"
                  }`}
                  aria-label={`View kit ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
