"use client";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { toast } from "sonner";

const footerLinks = {
  Shop: [
    { label: "All Kits", href: "/shop" },
    { label: "New Arrivals", href: "/shop" },
    { label: "Premier League", href: "/shop" },
    { label: "La Liga", href: "/shop" },
    { label: "Bundesliga", href: "/shop" },
    { label: "Serie A", href: "/shop" },
  ],
  Support: [
    { label: "Size Guide", href: "#" },
    { label: "Shipping Info", href: "#" },
    { label: "Returns & Exchanges", href: "#" },
    { label: "Order Tracking", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
  Company: [
    { label: "About KitDrop", href: "#" },
    { label: "Authenticity Guarantee", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Press", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border hidden md:block">
      {/* Newsletter Bar */}
      <div className="border-b border-border">
        <div className="w-full max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-headline font-bold uppercase text-lg tracking-tight">
              Join the Squad
            </h3>
            <p className="text-on-surface-variant text-sm mt-1">
              New drops, exclusive deals, and early access delivered to your
              inbox.
            </p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Subscribed to KitDrop updates!"); }} className="flex w-full md:w-auto max-w-md">
            <div className="flex-1 relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40"
              />
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full bg-background border border-border border-r-0 pl-10 pr-3 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-accent transition-colors"
                aria-label="Email address"
              />
            </div>
            <button type="submit" className="bg-accent text-on-accent px-6 py-3 font-headline font-bold uppercase text-sm tracking-tight hover:bg-accent-dim transition-colors flex items-center gap-2 group flex-shrink-0">
              Subscribe
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </form>
        </div>
      </div>

      {/* Links Grid */}
      <div className="w-full max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16 py-10">
        <div className="grid grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <Link
              href="/"
              className="text-accent font-headline font-black italic text-2xl tracking-tighter uppercase"
            >
              KITDROP
            </Link>
            <p className="text-on-surface-variant text-sm mt-3 leading-relaxed">
              The Kinetic Archive. Authentic football kits from 200+ clubs
              across 40+ countries.
            </p>
            <div className="flex gap-3 mt-5">
              {/* X (Twitter) */}
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="Follow us on X (Twitter)" className="w-9 h-9 bg-surface-high border border-border flex items-center justify-center text-on-surface-variant hover:text-accent hover:border-accent transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="w-9 h-9 bg-surface-high border border-border flex items-center justify-center text-on-surface-variant hover:text-accent hover:border-accent transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" className="w-9 h-9 bg-surface-high border border-border flex items-center justify-center text-on-surface-variant hover:text-accent hover:border-accent transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Watch us on YouTube" className="w-9 h-9 bg-surface-high border border-border flex items-center justify-center text-on-surface-variant hover:text-accent hover:border-accent transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-headline font-bold uppercase text-sm tracking-tight text-accent mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href === "#" ? (
                      <button
                        onClick={() => toast.info("Coming soon!")}
                        className="text-on-surface-variant text-sm hover:text-on-surface transition-colors cursor-pointer text-left"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-on-surface-variant text-sm hover:text-on-surface transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="w-full max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-on-surface-variant text-xs tracking-wider uppercase font-headline">
            © 2025 KitDrop Global Archive. All Rights Reserved.
          </p>
          <div className="flex gap-4 text-on-surface-variant text-xs">
            <button onClick={() => toast.info("Coming soon!")} className="hover:text-on-surface transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => toast.info("Coming soon!")} className="hover:text-on-surface transition-colors">
              Terms of Service
            </button>
            <button onClick={() => toast.info("Coming soon!")} className="hover:text-on-surface transition-colors">
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
