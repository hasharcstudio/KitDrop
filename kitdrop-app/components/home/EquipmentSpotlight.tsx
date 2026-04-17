"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { kits as staticKits, Kit } from "@/data/kits";
import { fetchKits } from "@/lib/store-api";
import { formatPrice } from "@/lib/currency";

export default function EquipmentSpotlight() {
  const [equipmentKits, setEquipmentKits] = useState<Kit[]>(
    staticKits.filter(k => k.type === "Boots" || k.type === "Turf Shoes" || k.type === "Accessories")
  );

  useEffect(() => {
    fetchKits().then((allKits) => {
      const equipment = allKits.filter(k => k.type === "Boots" || k.type === "Turf Shoes" || k.type === "Accessories");
      if (equipment.length > 0) setEquipmentKits(equipment);
    });
  }, []);

  if (equipmentKits.length === 0) return null;

  return (
    <section className="py-24 lg:py-32 bg-surface-high border-t border-border relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />

      <div className="relative z-10 w-full max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity size={18} className="text-accent" />
              <span className="text-accent text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest">
                Pro Hardware
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase font-headline tracking-tight">
              Elite Equipment
            </h2>
            <p className="text-on-surface-variant text-sm sm:text-base mt-1 sm:mt-2 max-w-xl">
              Elevate your game with our brand new tier of professional footwear, cleats, and protection accessories.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-accent font-headline font-bold uppercase text-sm tracking-tight flex items-center gap-1.5 border-b-2 border-accent pb-0.5 hover:opacity-80 transition-opacity self-start sm:self-auto whitespace-nowrap group hover:-translate-y-0.5"
          >
            Access All Gear
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Kit Carousel — Horizontal Scrollable Row */}
        <div className="flex gap-4 sm:gap-5 lg:gap-6 overflow-x-auto hide-scrollbar pb-6 snap-x snap-mandatory mt-8">
          {equipmentKits.map((kit, i) => (
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
                className="group block bg-surface border border-border hover:border-accent/40 transition-all overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] bg-gradient-to-b from-surface to-surface-high overflow-hidden">
                  <Image
                    src={kit.image}
                    alt={kit.name}
                    fill
                    className="object-contain p-6 sm:p-8 lg:p-10 group-hover:scale-110 transition-transform duration-700 rounded-[24px] drop-shadow-2xl"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Tags */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-accent text-on-accent text-[10px] font-headline font-black uppercase px-2 py-0.5 tracking-tighter">
                      {kit.subCategory || kit.type}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 sm:p-5 flex flex-col gap-1">
                  <p className="text-on-surface-variant text-[10px] sm:text-xs tracking-widest uppercase font-headline font-semibold">
                    {kit.clubName} {/* Repurposed as Brand */}
                  </p>
                  <div className="flex items-start justify-between gap-2 mt-1">
                    <h3 className="text-sm sm:text-base font-headline font-black uppercase tracking-tight truncate group-hover:text-accent transition-colors">
                      {kit.name}
                    </h3>
                    <p className="text-accent font-bold text-base sm:text-lg">
                      {formatPrice(kit.price)}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
