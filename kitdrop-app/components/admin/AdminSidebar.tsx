"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ChevronLeft,
  LogOut,
  Shield,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-50 bg-surface border-r border-border
          flex flex-col transition-transform duration-300
          w-[260px]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-accent font-headline font-black italic text-xl tracking-tighter uppercase">
              KITDROP
            </span>
            <span className="bg-accent text-on-accent text-[9px] font-headline font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm">
              Admin
            </span>
          </Link>
          <button
            onClick={onToggle}
            className="lg:hidden text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Close sidebar"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-headline font-bold uppercase tracking-tight transition-all
                  ${
                    active
                      ? "bg-accent/10 text-accent border-l-2 border-accent"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-high"
                  }
                `}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-headline font-bold uppercase tracking-tight text-on-surface-variant hover:text-on-surface hover:bg-surface-high transition-all"
          >
            <Shield size={18} />
            View Store
          </Link>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-headline font-bold uppercase tracking-tight text-error hover:bg-error/10 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </Link>
        </div>
      </aside>
    </>
  );
}
