"use client";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { leagues } from "@/data/leagues";

import { useRouter } from "next/navigation";

export default function LeagueSelector({
  active,
  onChange,
}: {
  active?: string;
  onChange?: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSelect = (id: string) => {
    if (onChange) onChange(id);
    else router.push(`/shop?league=${id}`);
  };

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-surface py-4 sm:py-5 relative">
      <div className="w-full max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-on-surface-variant text-xs sm:text-sm tracking-[0.2em] uppercase font-headline font-semibold">
            Explore Leagues
          </h3>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="text-on-surface-variant hover:text-accent transition-colors p-1"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="text-on-surface-variant hover:text-accent transition-colors p-1"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-2 sm:gap-3 overflow-x-auto hide-scrollbar pb-1"
        >
          {leagues.map((league) => (
            <button
              key={league.id}
              onClick={() => handleSelect(league.id)}
              className={`flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 border whitespace-nowrap transition-all flex-shrink-0 group active:scale-95 ${
                active === league.id
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border hover:border-border-hover text-on-surface"
              }`}
            >
              <Image
                src={league.logo}
                alt={league.name}
                width={24}
                height={24}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
              />
              <span className="font-headline font-bold uppercase text-xs sm:text-sm tracking-tight">
                {league.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
