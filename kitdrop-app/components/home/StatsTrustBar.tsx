"use client";
import { motion } from "framer-motion";
import { Users, ShoppingCart, Star, ShieldCheck } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "200+",
    label: "Global Clubs",
    desc: "From 40+ countries",
  },
  {
    icon: ShoppingCart,
    value: "50,000+",
    label: "Orders Done",
    desc: "Worldwide shipping",
  },
  {
    icon: Star,
    value: "4.8★",
    label: "Trust Rating",
    desc: "From 12K+ reviews",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    label: "Authentic",
    desc: "Guaranteed genuine",
  },
];

export default function StatsTrustBar() {
  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-surface border-y border-border">
      <div className="w-full max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-3"
              >
                <div className="w-10 h-10 bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black font-headline tracking-tight text-accent">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm font-headline font-bold uppercase tracking-tight text-on-surface">
                    {stat.label}
                  </p>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant mt-0.5">
                    {stat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
