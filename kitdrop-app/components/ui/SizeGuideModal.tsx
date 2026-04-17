"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useUIStore } from "@/store/ui";

export default function SizeGuideModal() {
  const { isSizeGuideOpen, toggleSizeGuide } = useUIStore();

  return (
    <AnimatePresence>
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSizeGuide}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-2xl bg-surface border border-border p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <h2 className="text-2xl font-black uppercase font-headline tracking-tight text-accent">
                Size Guide
              </h2>
              <button
                onClick={toggleSizeGuide}
                className="text-on-surface-variant hover:text-accent transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <p className="text-on-surface-variant text-sm font-body">
                KitDrop authentic player edition kits run slightly tighter than standard replica versions. We recommend going one size up if you prefer a looser fit.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left font-body">
                  <thead className="text-xs uppercase bg-surface-high font-headline tracking-widest text-on-surface-variant">
                    <tr>
                      <th className="px-4 py-3 border border-border">Size</th>
                      <th className="px-4 py-3 border border-border">Chest (in)</th>
                      <th className="px-4 py-3 border border-border">Waist (in)</th>
                      <th className="px-4 py-3 border border-border">Length (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { s: "XS", c: "32-34", w: "27-29", l: "27" },
                      { s: "S", c: "35-37", w: "30-32", l: "28" },
                      { s: "M", c: "38-40", w: "33-35", l: "29" },
                      { s: "L", c: "41-43", w: "36-38", l: "30" },
                      { s: "XL", c: "44-46", w: "39-41", l: "31" },
                      { s: "XXL", c: "47-49", w: "42-44", l: "32" },
                    ].map((row) => (
                      <tr key={row.s} className="border-b border-border bg-surface hover:bg-surface-high/50 transition-colors">
                        <td className="px-4 py-3 border border-border font-headline font-bold text-accent">{row.s}</td>
                        <td className="px-4 py-3 border border-border">{row.c}</td>
                        <td className="px-4 py-3 border border-border">{row.w}</td>
                        <td className="px-4 py-3 border border-border">{row.l}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-surface-high p-4 border border-border text-xs sm:text-sm text-on-surface-variant italic border-l-2 border-l-accent">
                Note: Measurements are general guidelines. Fit may vary depending on the specific kit manufacturer (e.g., Nike, Adidas, Puma).
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
