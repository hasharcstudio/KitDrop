"use client";
import Link from "next/link";
import { Home, ShoppingBag, Trophy, Heart } from "lucide-react";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/nations", label: "Leagues", icon: Trophy },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-border">
      <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 transition-colors active:scale-95 ${
                isActive ? "text-accent" : "text-on-surface-variant"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span
                className={`text-[10px] font-headline uppercase tracking-wider font-bold ${
                  isActive ? "text-accent" : ""
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
