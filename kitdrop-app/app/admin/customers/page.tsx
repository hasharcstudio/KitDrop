"use client";
import { useEffect, useState } from "react";
import { Search, Users, Mail, ShoppingCart } from "lucide-react";
import type { Order } from "@/lib/database.types";
import { formatPrice } from "@/lib/currency";

interface CustomerData {
  email: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
  firstOrder: string;
  lastOrder: string;
  orders: Order[];
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/orders");
        const orders: Order[] = await res.json();

        // Aggregate by customer email
        const map = new Map<string, CustomerData>();
        (Array.isArray(orders) ? orders : []).forEach((order) => {
          const existing = map.get(order.customer_email);
          if (existing) {
            existing.totalOrders++;
            existing.totalSpent += order.total || 0;
            existing.orders.push(order);
            if (order.created_at < existing.firstOrder) existing.firstOrder = order.created_at;
            if (order.created_at > existing.lastOrder) existing.lastOrder = order.created_at;
          } else {
            map.set(order.customer_email, {
              email: order.customer_email,
              name: order.customer_name,
              totalOrders: 1,
              totalSpent: order.total || 0,
              firstOrder: order.created_at,
              lastOrder: order.created_at,
              orders: [order],
            });
          }
        });

        setCustomers(
          Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent)
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase font-headline tracking-tight">
          Customers
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">
          {customers.length} customers from order data
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface border border-border pl-10 pr-4 py-2.5 text-sm font-body text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-accent rounded-md"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-12 text-center">
          <Users size={40} className="mx-auto text-on-surface-variant/30 mb-4" />
          <p className="font-headline font-bold uppercase tracking-tight text-on-surface-variant">
            No customers found
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((customer) => (
            <div key={customer.email} className="bg-surface border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedEmail(expandedEmail === customer.email ? null : customer.email)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-high/30 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent text-sm font-black font-headline">
                      {customer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-headline font-bold tracking-tight">{customer.name}</p>
                    <p className="text-[10px] text-on-surface-variant flex items-center gap-1">
                      <Mail size={10} /> {customer.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div className="hidden sm:block">
                    <p className="text-sm font-headline font-bold">{customer.totalOrders}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Orders</p>
                  </div>
                  <div>
                    <p className="text-sm font-headline font-bold text-accent">{formatPrice(customer.totalSpent)}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Spent</p>
                  </div>
                </div>
              </button>

              {expandedEmail === customer.email && (
                <div className="border-t border-border px-5 py-4 bg-background/50 space-y-3">
                  <h3 className="text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant">
                    Order History
                  </h3>
                  {customer.orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-2">
                        <ShoppingCart size={12} className="text-on-surface-variant" />
                        <span className="text-sm font-headline font-bold tracking-tight">{order.order_number}</span>
                        <span className="text-[10px] text-on-surface-variant">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-headline font-bold">{formatPrice(order.total || 0)}</span>
                        <span className={`text-[10px] font-headline font-bold uppercase px-2 py-0.5 rounded ${
                          order.status === "Delivered" ? "bg-success/15 text-success" :
                          order.status === "Refunded" ? "bg-error/15 text-error" :
                          "bg-surface-high text-on-surface-variant"
                        }`}>{order.status}</span>
                      </div>
                    </div>
                  ))}
                  <p className="text-[10px] text-on-surface-variant">
                    Customer since {new Date(customer.firstOrder).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
