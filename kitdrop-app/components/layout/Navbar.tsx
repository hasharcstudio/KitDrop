"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, X, Heart } from "lucide-react";
import { useState, useEffect, useSyncExternalStore } from "react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useSession } from "next-auth/react";

// Hydration-safe: returns false on server, true on client after mount
const emptySubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export default function Navbar({
  onSearchOpen,
}: {
  onSearchOpen?: () => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toggleCart, totalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { data: session } = useSession();
  
  const hydrated = useHydrated();
  const count = hydrated ? totalItems() : 0;
  const wishlistCount = hydrated ? wishlistItems.length : 0;
  const pathname = usePathname();

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "SHOP", href: "/shop" },
    { name: "LEAGUES", href: "/nations" },
    { name: session ? "MY ACCOUNT" : "LOGIN", href: session ? "/account" : "/login" },
  ];

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-border">
        <div className="w-full max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16 flex justify-between items-center h-14 sm:h-16 relative">
        {/* Left: Search + Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-on-surface-variant hover:text-accent transition-colors active:scale-95"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <button
            onClick={onSearchOpen}
            className="text-on-surface-variant hover:text-accent transition-colors active:scale-95"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 ml-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-headline font-bold tracking-tight uppercase text-sm pb-1 transition-colors ${
                    isActive
                      ? "text-accent border-b-2 border-accent"
                      : "text-on-surface hover:text-accent border-b-2 border-transparent"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Center: Logo */}
        <Link
          href="/"
          className="text-xl sm:text-2xl font-black italic tracking-tighter text-accent font-headline uppercase absolute left-1/2 -translate-x-1/2"
        >
          KITDROP
        </Link>

        {/* Right: Cart & Wishlist */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/wishlist"
            className="text-on-surface-variant hover:text-accent transition-colors active:scale-95 relative"
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-on-accent text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>
          <button
            onClick={toggleCart}
            className="text-on-surface hover:text-accent transition-colors active:scale-95 relative"
            aria-label="Shopping bag"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-on-accent text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                {count}
              </span>
            )}
          </button>
        </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-14 left-0 w-full bg-surface z-40 border-b border-border animate-fade-in-up">
          <div className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-3 font-headline font-bold uppercase tracking-tight text-lg transition-colors ${
                    isActive
                      ? "text-accent bg-surface-high"
                      : "text-on-surface hover:text-accent hover:bg-surface-high"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
