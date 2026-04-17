"use client";
import { useState, useEffect, useRef } from "react";
import { X, Search, Clock, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { kits } from "@/data/kits";
import { formatPrice, CURRENCY_CODE, CURRENCY_SYMBOL } from "@/lib/currency";

const recentSearches = [
  "Arsenal Home 24/25",
  "Venice FC Special Edition",
  "Retro Brazil 1998",
];

const trendingSearches = [
  "Real Madrid Away",
  "Inter Miami Pink",
  "Champions League Kits",
  "Pre-Match Range",
  "Mbappé 9",
];

export default function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.length >= 2
    ? kits.filter(
        (k) =>
          k.name.toLowerCase().includes(query.toLowerCase()) ||
          k.clubName.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setQuery(""), 0);
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    // Cleanup on unmount just in case
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-background/98 z-[70] flex flex-col overflow-y-auto"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 sm:p-5">
            <span className="text-accent font-headline font-black italic text-lg tracking-tighter uppercase">
              KITDROP
            </span>
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-on-surface-variant text-xs font-headline uppercase tracking-wider">
                ESC to Close
              </span>
              <button
                onClick={onClose}
                className="text-on-surface-variant hover:text-on-surface transition-colors p-1 active:scale-95"
                aria-label="Close search"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 pt-8 sm:pt-12 lg:pt-16">
            <div className="flex items-center gap-4 border-b-2 border-accent/50 focus-within:border-accent transition-colors pb-3 sm:pb-4">
              <Search
                size={28}
                className="text-on-surface-variant flex-shrink-0"
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search clubs, leagues, kits..."
                className="bg-transparent text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-headline font-bold uppercase tracking-tight text-on-surface placeholder:text-on-surface-variant/30 outline-none w-full"
              />
            </div>
          </div>

          {/* Body */}
          <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
            {query.length < 2 ? (
              /* Suggestions Grid — 1 col mobile, 2 col desktop */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
                {/* Recent Searches */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-0.5 bg-accent/50" />
                    <span className="text-accent text-xs tracking-[0.2em] uppercase font-headline font-bold">
                      Recent Searches
                    </span>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((s) => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        className="flex items-center gap-3 w-full p-3 text-left hover:bg-surface-high transition-colors group"
                      >
                        <Clock
                          size={16}
                          className="text-on-surface-variant/40 flex-shrink-0"
                        />
                        <span className="font-headline font-bold uppercase text-sm tracking-tight text-on-surface group-hover:text-accent transition-colors">
                          {s}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Trends */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-0.5 bg-accent/50" />
                    <span className="text-accent text-xs tracking-[0.2em] uppercase font-headline font-bold">
                      Popular Trends
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((s) => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        className="border border-border hover:border-accent text-on-surface hover:text-accent px-3 sm:px-4 py-2 text-xs sm:text-sm font-headline font-bold uppercase tracking-tight transition-colors active:scale-95"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Results */
              <div>
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-6 h-0.5 bg-accent" />
                  <span className="text-accent text-xs tracking-[0.2em] uppercase font-headline font-bold">
                    Matches Found ({results.length})
                  </span>
                </div>

                {results.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-on-surface-variant text-base">
                      No kits found for &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-on-surface-variant/60 text-sm mt-2">
                      Try searching by club name, league, or country
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {results.map((kit) => (
                      <Link
                        key={kit.id}
                        href={`/product/${kit.id}`}
                        onClick={onClose}
                        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-surface-high border border-transparent hover:border-border transition-all group"
                      >
                        {/* Thumbnail */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-surface flex-shrink-0 relative overflow-hidden">
                          <Image
                            src={kit.image}
                            alt={kit.name}
                            fill
                            className="object-contain p-1 rounded-xl"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-on-surface-variant text-[10px] sm:text-xs tracking-widest uppercase font-headline">
                            {kit.leagueName}
                          </p>
                          <h3 className="font-headline font-bold uppercase text-sm sm:text-base tracking-tight truncate group-hover:text-accent transition-colors">
                            {kit.name}
                          </h3>
                        </div>

                        {/* Price + Cart */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            <p className="text-on-surface-variant text-[10px] uppercase tracking-widest font-headline">
                              {kit.isAuthentic ? "Authentic" : "Stadium"}
                            </p>
                            <p className="text-accent font-bold text-sm sm:text-base">
                              {formatPrice(kit.price)}
                            </p>
                          </div>
                          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-accent text-on-accent flex items-center justify-center hover:bg-accent-dim transition-colors active:scale-95">
                            <ShoppingCart size={16} />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer with hints (desktop only) */}
          <div className="mt-auto border-t border-border hidden md:block">
            <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
              <div className="flex gap-4 text-on-surface-variant text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse-glow" />
                  Database Synced: 24ms
                </span>
                <span>Currency: {CURRENCY_CODE} ({CURRENCY_SYMBOL})</span>
              </div>
              <div className="flex gap-3 text-on-surface-variant text-xs">
                <span className="border border-border px-2 py-0.5 font-mono">
                  TAB
                </span>
                <span>Navigate</span>
                <span className="border border-border px-2 py-0.5 font-mono bg-accent/10 text-accent">
                  ENTER
                </span>
                <span>Select</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
