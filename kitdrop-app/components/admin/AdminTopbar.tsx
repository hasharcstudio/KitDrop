"use client";
import { Menu, Bell } from "lucide-react";
import { usePathname } from "next/navigation";

interface AdminTopbarProps {
  onSidebarToggle: () => void;
}

const breadcrumbMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/products/new": "New Product",
  "/admin/orders": "Orders",
  "/admin/customers": "Customers",
  "/admin/settings": "Settings",
};

export default function AdminTopbar({ onSidebarToggle }: AdminTopbarProps) {
  const pathname = usePathname();

  // Build breadcrumb
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((_, i) => {
    const path = "/" + segments.slice(0, i + 1).join("/");
    return { label: breadcrumbMap[path] || segments[i], path };
  });

  return (
    <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-border px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
      {/* Left: hamburger + breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onSidebarToggle}
          className="lg:hidden text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        <nav className="hidden sm:flex items-center gap-1.5 text-xs font-headline uppercase tracking-widest">
          {crumbs.map((crumb, i) => (
            <span key={crumb.path} className="flex items-center gap-1.5">
              {i > 0 && (
                <span className="text-on-surface-variant/30">/</span>
              )}
              <span
                className={
                  i === crumbs.length - 1
                    ? "text-accent font-bold"
                    : "text-on-surface-variant"
                }
              >
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Right: notifications + admin badge */}
      <div className="flex items-center gap-3">
        <button
          className="relative p-2 text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-accent text-xs font-black font-headline">
              A
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-headline font-bold uppercase tracking-tight leading-none">
              Admin
            </p>
            <p className="text-[10px] text-on-surface-variant tracking-wider mt-0.5">
              admin@kitdrop.com
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
