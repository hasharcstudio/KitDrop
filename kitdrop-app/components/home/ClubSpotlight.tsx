"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { kits as staticKits, Kit } from "@/data/kits";
import { fetchSettings, fetchKits } from "@/lib/store-api";
import { formatPrice } from "@/lib/currency";

const DEFAULT_SPOTLIGHT_IDS = [
  "real-madrid-away-2526",
  "fc-barcelona-home-2526",
  "man-utd-home-2526",
  "man-city-home-2526"
];

const editions = ["Home", "Away", "Third"] as const;
const sizes = ["S", "M", "L", "XL", "2XL"];

export default function ClubSpotlight() {
  const [spotlightKits, setSpotlightKits] = useState<Kit[]>(() => {
    return DEFAULT_SPOTLIGHT_IDS
      .map(id => staticKits.find(k => k.id === id))
      .filter(Boolean) as Kit[];
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeEdition, setActiveEdition] = useState<string>("Home");
  const [activeSize, setActiveSize] = useState<string>("L");

  useEffect(() => {
    Promise.all([fetchSettings(), fetchKits()]).then(([settings, allKits]) => {
      const ids = settings.spotlight_kit_ids?.length > 0
        ? settings.spotlight_kit_ids
        : DEFAULT_SPOTLIGHT_IDS;
      const resolved = ids
        .map((id) => allKits.find((k) => k.id === id))
        .filter(Boolean) as Kit[];
      if (resolved.length > 0) {
        setSpotlightKits(resolved);
      }
    });
  }, []);

  const spotlightKit = spotlightKits[activeIndex] || spotlightKits[0];

  const nextKit = () => setActiveIndex((prev) => (prev + 1) % spotlightKits.length);
  const prevKit = () => setActiveIndex((prev) => (prev - 1 + spotlightKits.length) % spotlightKits.length);

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a5c] via-[#0a0a0f] to-[#1a3a5c]" />
      <div className="absolute inset-0 diagonal-halftone" />

      <div className="relative z-10 w-full max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16 py-24 sm:py-32">
        {/* Section Label */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 lg:mb-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-0.5 bg-accent" />
            <span className="text-accent text-xs tracking-[0.2em] uppercase font-headline font-bold">
              Global Giants Spotlight
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prevKit}
              className="p-1 sm:p-2 border border-border text-on-surface hover:text-accent hover:border-accent transition-colors active:scale-95"
              aria-label="Previous club"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextKit}
              className="p-1 sm:p-2 border border-border text-on-surface hover:text-accent hover:border-accent transition-colors active:scale-95"
              aria-label="Next club"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Content Grid — stacked on mobile, 3-col on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
          {/* LEFT — Club Identity */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-surface-high border border-border overflow-hidden mb-4 sm:mb-6 flex items-center justify-center">
              <Image
                src={spotlightKit.badgeImage}
                alt={spotlightKit.clubName}
                width={80}
                height={80}
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
              />
            </div>
            <h2 className="text-4xl sm:text-5xl font-black uppercase italic font-headline tracking-tight leading-none mb-3">
              {spotlightKit.clubName.split(" ").map((word, i) => (
                <span key={i} className="block">
                  {word}
                </span>
              ))}
            </h2>
            <p className="text-on-surface-variant text-base sm:text-lg mb-6 max-w-sm mt-4">
              Explore the pinnacle of top-flight football performance. Authentic match-grade jerseys built to withstand elite competition.
            </p>
            <span className="text-on-surface-variant text-xs sm:text-sm tracking-widest uppercase font-headline border border-border px-3 py-1.5 inline-block">
              Official 2025/26 Kit
            </span>
          </div>

          {/* CENTER — Kit Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center justify-center order-first lg:order-none"
          >
            <div className="relative w-52 h-52 sm:w-64 sm:h-64 lg:w-80 lg:h-80">
              <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full" />
              <Image
                src={spotlightKit.image}
                alt={spotlightKit.name}
                fill
                className="object-contain drop-shadow-2xl rounded-2xl sm:rounded-[32px] p-2"
              />
            </div>
          </motion.div>

          {/* RIGHT — Config Panel */}
          <div className="bg-surface/60 backdrop-blur-sm border border-border p-5 sm:p-6 space-y-5 sm:space-y-6">
            {/* Edition Selector */}
            <div>
              <p className="text-on-surface-variant text-xs tracking-widest uppercase font-headline font-semibold mb-3">
                Select Edition
              </p>
              <div className="grid grid-cols-3 gap-2">
                {editions.map((ed) => (
                  <button
                    key={ed}
                    onClick={() => setActiveEdition(ed)}
                    className={`text-center py-2.5 border text-xs sm:text-sm font-headline font-bold uppercase tracking-tight transition-all active:scale-95 ${
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

            {/* Size Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-on-surface-variant text-xs tracking-widest uppercase font-headline font-semibold">
                  Size Guide
                </p>
                <button className="text-accent text-xs font-headline font-bold uppercase tracking-tight">
                  Chart
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveSize(s)}
                    className={`text-center py-2 border text-xs sm:text-sm font-headline font-bold transition-all active:scale-95 ${
                      activeSize === s
                        ? "bg-accent text-on-accent border-accent"
                        : "border-border text-on-surface hover:border-border-hover"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price + CTA */}
            <div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl sm:text-4xl font-black font-headline">
                  {formatPrice(spotlightKit.price)}
                </span>
                <span className="text-on-surface-variant text-xs uppercase tracking-widest">
                  Authentic Player Edition
                </span>
              </div>
              <Link
                href={`/product/${spotlightKit.id}`}
                className="bg-accent text-on-accent w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 font-headline font-bold uppercase tracking-tight text-sm sm:text-base hover:bg-accent-dim transition-colors group"
              >
                Shop {spotlightKit.clubName} Kits
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Tech Specs Bento — 1 col mobile, 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-12">
          {[
            {
              title: "Aeroready Technology",
              desc: "Engineered for the highest level of play. Moisture-wicking fabric maintains peak performance.",
              tag: "Lab Tested",
            },
            {
              title: "Recycled Polyester",
              desc: "100% Sustainable materials used in the 25/26 collection.",
              tag: "Eco",
            },
            {
              title: "Heat-Applied Crest",
              desc: "Reduced weight and zero friction for elite athletes.",
              tag: "Pro Grade",
            },
          ].map((spec) => (
            <div
              key={spec.title}
              className="bg-surface/40 backdrop-blur-sm border border-border p-4 sm:p-5"
            >
              <h4 className="font-headline font-bold uppercase text-sm sm:text-base tracking-tight mb-2">
                {spec.title}
              </h4>
              <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-3">
                {spec.desc}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-accent" />
                <span className="text-on-surface-variant text-[10px] uppercase tracking-widest font-headline font-semibold">
                  {spec.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
