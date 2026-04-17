"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { kits } from "@/data/kits";

const carouselKits = kits.slice(0, 4);

export default function AuthCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselKits.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselKits.length);
    }, 4000); // 4 seconds per slide
    return () => clearInterval(interval);
  }, []);

  if (carouselKits.length === 0) return null;

  return (
    <div className="relative w-full h-[45vh] lg:h-[50vh] flex items-center justify-center mt-8">
      {/* Glow Layer */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface to-transparent z-0 blur-3xl opacity-50 pointer-events-none" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none pb-8 -translate-y-2"
        >
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[380px] aspect-square flex items-center justify-center drop-shadow-2xl">
            <Image
              src={carouselKits[currentIndex].image}
              alt={carouselKits[currentIndex].name}
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="mt-4 text-center">
             <span className="bg-accent text-on-accent text-[10px] font-black font-headline tracking-widest uppercase px-2 py-0.5 mb-2 inline-block">
               {carouselKits[currentIndex].type} Kit
             </span>
             <h3 className="font-headline font-black uppercase tracking-tight text-lg text-on-surface">
               {carouselKits[currentIndex].clubName || carouselKits[currentIndex].name}
             </h3>
             <p className="text-on-surface-variant font-body text-xs mt-1">
               {carouselKits[currentIndex].season}
             </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      <div className="absolute bottom-0 flex justify-center gap-2 z-20">
        {carouselKits.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 transition-all duration-300 ${
              i === currentIndex ? "w-6 bg-accent" : "w-1.5 bg-surface-high hover:bg-on-surface-variant"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
