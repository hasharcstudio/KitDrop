"use client";
import { useState, useEffect } from "react";
import { SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight, Users, ShoppingCart, ShieldCheck } from "lucide-react";
import { kits as staticKits, Kit } from "@/data/kits";
import { fetchKits } from "@/lib/store-api";
import LeagueSelector from "@/components/home/LeagueSelector";
import { CURRENCY_SYMBOL } from "@/lib/currency";
import KitCard from "@/components/ui/KitCard";

const kitTypes = ["All Types", "Home", "Away", "Third", "Goalkeeper", "Boots", "Turf Shoes", "Accessories"];
const subCategories = ["All Sub-categories", "FG", "SG", "AG", "TF", "Shin Guards", "Grip Socks"];
const sizeOptions = ["S", "M", "L", "XL", "US 8", "US 9", "US 10", "US 11", "One Size"];

export default function ShopPage() {
  const [kits, setKits] = useState<Kit[]>(staticKits);
  const [activeLeague, setActiveLeague] = useState("");
  const [activeType, setActiveType] = useState(kitTypes[0]);
  const [activeSubCategory, setActiveSubCategory] = useState(subCategories[0]);
  const [activeSize, setActiveSize] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("Newest First");
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  // Fetch products from Supabase (falls back to static data)
  useEffect(() => {
    fetchKits().then(setKits);
  }, []);
  
  const maxDbPrice = Math.max(...kits.map(k => k.price));
  const [maxPriceFilter, setMaxPriceFilter] = useState(maxDbPrice);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Filter kits
  const filtered = kits.filter((kit) => {
    const matchLeague = activeLeague ? kit.leagueId === activeLeague : true;
    const matchSize = activeSize ? (kit.sizes.includes(activeSize) && !kit.outOfStockSizes?.includes(activeSize)) : true;
    
    // 3) Filter by Kit Type
    let matchType = true;
    if (activeType !== "All Types") {
      matchType = kit.type === activeType;
    }

    // 4) Filter by Sub Category
    let matchSub = true;
    if (activeSubCategory !== "All Sub-categories") {
      matchSub = kit.subCategory === activeSubCategory;
    }

    // 5) Filter by Price
    const matchPrice = kit.price <= maxPriceFilter;

    return matchLeague && matchSize && matchType && matchSub && matchPrice;
  });

  // Sort kits
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    return 0; // "Newest First" relies on default array order for now
  });

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  
  // Safe bounds check to automatically reset pagination if filters shrink the results
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const paginatedKits = sorted.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="bg-surface py-8 sm:py-10 lg:py-14">
        <div className="w-full max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-10 sm:h-14 bg-accent" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase font-headline tracking-tight">
              Shop All Kits
            </h1>
          </div>
          <p className="text-on-surface-variant text-xs sm:text-sm tracking-[0.15em] uppercase font-headline mt-2 ml-[18px]">
            The Kinetic Archive · Season 2025/26
          </p>
        </div>
      </div>

      {/* League Pills */}
      <LeagueSelector active={activeLeague} onChange={(id) => setActiveLeague(activeLeague === id ? "" : id)} />

      <div className="w-full max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16 py-12 sm:py-16">
        {/* Mobile Filter Toggle + Sort */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 text-accent font-headline font-bold uppercase text-sm tracking-tight active:scale-95"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>

          <p className="hidden lg:block text-on-surface-variant text-xs sm:text-sm tracking-widest uppercase font-headline">
            Displaying {filtered.length} Results
          </p>

          <div className="flex items-center gap-2 relative">
            <span className="text-on-surface-variant text-xs tracking-widest uppercase font-headline hidden sm:block">
              Sort By:
            </span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-1 bg-transparent text-on-surface font-headline font-bold uppercase text-xs sm:text-sm tracking-tight outline-none"
                aria-label="Sort By"
                aria-expanded={isSortOpen ? "true" : "false"}
              >
                {sortBy}
                <ChevronDown size={14} className={`transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Custom Dropdown Menu */}
              {isSortOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface-high border border-border z-50 flex flex-col shadow-xl origin-top-right animate-in fade-in zoom-in-95 duration-100">
                  {["Newest First", "Price: Low to High", "Price: High to Low"].map((option) => (
                    <button
                      key={option}
                      className={`text-left text-sm font-headline font-semibold uppercase tracking-tight py-3 px-4 transition-colors hover:bg-surface-highest ${
                        sortBy === option ? "text-accent" : "text-on-surface"
                      }`}
                      onClick={() => {
                        setSortBy(option);
                        setCurrentPage(1);
                        setIsSortOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Layout — Sidebar + Grid */}
        <div className="flex gap-6 lg:gap-8">
          {/* Sidebar Filters — slide-in on mobile, fixed on desktop */}
          <div className={`
            ${showFilters ? "fixed inset-0 z-50 bg-background p-4 overflow-y-auto" : "hidden"}
            lg:block lg:static lg:w-56 lg:flex-shrink-0
          `}>
            {/* Mobile close */}
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <h2 className="font-headline font-bold uppercase text-lg tracking-tight text-accent">
                Filters
              </h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 active:scale-95"
                aria-label="Close Filters"
              >
                <X size={22} />
              </button>
            </div>

            <h3 className="hidden lg:block text-accent font-headline font-bold uppercase text-sm tracking-tight mb-4">
              Filters
            </h3>

            {/* 1. Kit Types */}
            <div className="mb-6">
              <h3 className="text-sm font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                Kit Type
              </h3>
              <div className="flex flex-col gap-2">
                {kitTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setActiveType(t);
                      setCurrentPage(1);
                    }}
                    className={`text-left text-sm font-headline font-semibold uppercase tracking-tight py-2 transition-colors ${
                      activeType === t
                        ? "text-accent"
                        : "text-on-surface hover:text-accent"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Sub Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                Sub Categories
              </h3>
              <div className="flex flex-col gap-2 relative pl-3 border-l-[1px] border-border ml-1">
                {subCategories.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setActiveSubCategory(t);
                      setCurrentPage(1);
                    }}
                    className={`text-left text-sm font-headline font-semibold uppercase tracking-tight py-1 transition-colors ${
                      activeSubCategory === t
                        ? "text-accent"
                        : "text-on-surface-variant hover:text-accent"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Sizes */}
            <div className="mb-5 sm:mb-6">
              <p className="text-on-surface text-xs sm:text-sm tracking-widest uppercase font-headline font-bold mb-2 sm:mb-3">
                Size
              </p>
              <div className="grid grid-cols-4 gap-2">
                {sizeOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setActiveSize(s);
                      setCurrentPage(1);
                    }}
                    className={`text-center py-2 border text-xs font-headline font-bold transition-all active:scale-95 ${
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

            {/* Price Range */}
            <div className="mb-5 sm:mb-6">
              <p className="text-on-surface text-xs sm:text-sm tracking-widest uppercase font-headline font-bold mb-2 sm:mb-3">
                Price Range
              </p>
              <input
                type="range"
                min={0}
                max={maxDbPrice}
                value={maxPriceFilter}
                onChange={(e) => {
                  setMaxPriceFilter(Number(e.target.value));
                  setCurrentPage(1);
                }}
                aria-label="Price Range"
                className="w-full accent-accent"
              />
              <div className="flex justify-between text-on-surface-variant text-xs mt-1">
                <span>{CURRENCY_SYMBOL}0</span>
                <span>{CURRENCY_SYMBOL}{maxPriceFilter}</span>
              </div>
            </div>

            {/* Trust Stats */}
            <div className="bg-surface border border-border p-3 sm:p-4 space-y-3 mt-6">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-accent flex-shrink-0" />
                <div>
                  <p className="text-base sm:text-lg font-black font-headline text-accent">200+</p>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant uppercase tracking-wider font-headline">Global Clubs</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShoppingCart size={18} className="text-accent flex-shrink-0" />
                <div>
                  <p className="text-base sm:text-lg font-black font-headline text-accent">50,000+</p>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant uppercase tracking-wider font-headline">Orders Done</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-accent flex-shrink-0" />
                <div>
                  <p className="text-base sm:text-lg font-black font-headline text-accent">99.9%</p>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant uppercase tracking-wider font-headline">Trust Rating</p>
                </div>
              </div>
            </div>

            {/* Mobile Apply */}
            <button
              onClick={() => setShowFilters(false)}
              className="lg:hidden w-full bg-accent text-on-accent py-3 font-headline font-bold uppercase text-sm tracking-tight mt-6 active:scale-[0.98]"
            >
              Apply Filters
            </button>
          </div>

          {/* Product Grid — 2 col mobile, 3 tablet, 4 desktop */}
          <div className="flex-1">
            <p className="lg:hidden text-on-surface-variant text-xs tracking-widest uppercase font-headline mb-3">
              {filtered.length} Results
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {paginatedKits.map((kit) => (
                <KitCard key={kit.id} kit={kit} />
              ))}
            </div>

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-center gap-4 mt-8 sm:mt-12">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={safeCurrentPage === 1}
                  aria-label="Previous page"
                  className="w-10 h-10 sm:w-12 sm:h-12 border border-border flex items-center justify-center text-on-surface-variant hover:text-accent hover:border-accent transition-colors active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-accent text-lg sm:text-xl font-black font-headline">
                    {safeCurrentPage.toString().padStart(2, '0')}
                  </span>
                  <span className="text-on-surface-variant text-sm">/</span>
                  <span className="text-on-surface-variant text-sm">
                    {totalPages.toString().padStart(2, '0')}
                  </span>
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={safeCurrentPage === totalPages}
                  aria-label="Next page"
                  className="w-10 h-10 sm:w-12 sm:h-12 border border-border flex items-center justify-center text-on-surface-variant hover:text-accent hover:border-accent transition-colors active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
