"use client";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Truck, RotateCcw, Loader2 } from "lucide-react";
import StatusBadge from "@/components/admin/ui/StatusBadge";
import type { Order } from "@/lib/database.types";
import { formatPrice } from "@/lib/currency";

const STATUS_TABS = ["All", "Pending", "Processing", "Shipped", "Delivered", "Refunded"];
const COURIERS = ["DHL", "FedEx", "UPS", "USPS", "Royal Mail", "Other"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchOrders = async () => {
    const res = await fetch(`/api/orders?status=${activeTab}`);
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [activeTab, fetchOrders]);

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    setSaving(id);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...updated } : o)));
      }
    } finally {
      setSaving(null);
    }
  };

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
          Orders
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">
          {orders.length} orders total
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setLoading(true); }}
            className={`px-4 py-2 text-xs font-headline font-bold uppercase tracking-tight transition-colors rounded-md ${
              activeTab === tab
                ? "bg-accent text-on-accent"
                : "bg-surface border border-border text-on-surface-variant hover:text-on-surface hover:border-border-hover"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Order Cards */}
      {orders.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-12 text-center">
          <p className="font-headline font-bold uppercase tracking-tight text-on-surface-variant">
            No {activeTab !== "All" ? activeTab.toLowerCase() : ""} orders
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;
            return (
              <div
                key={order.id}
                className="bg-surface border border-border rounded-lg overflow-hidden"
              >
                {/* Order Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-high/30 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm font-headline font-bold tracking-tight">
                        {order.order_number}
                      </p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">
                        {order.customer_name} · {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-headline font-bold hidden sm:block">
                      {formatPrice(order.total || 0)}
                    </span>
                    <StatusBadge status={order.status} size="md" />
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-border px-5 py-5 space-y-5 bg-background/50">
                    {/* Line Items */}
                    <div>
                      <h3 className="text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                        Items
                      </h3>
                      <div className="space-y-2">
                        {(order.items || []).map((item, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                            <div>
                              <p className="text-sm font-headline font-bold tracking-tight">{item.name}</p>
                              <p className="text-[10px] text-on-surface-variant">
                                Size: {item.size} · Type: {item.type} · Qty: {item.quantity}
                              </p>
                            </div>
                            <span className="text-sm font-headline font-bold">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer & Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">Customer</h3>
                        <p className="text-sm">{order.customer_name}</p>
                        <p className="text-xs text-on-surface-variant">{order.customer_email}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">Shipping Address</h3>
                        {order.shipping_address && (
                          <p className="text-sm text-on-surface-variant">
                            {order.shipping_address.street}, {order.shipping_address.city} {order.shipping_address.postal_code}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Financial Breakdown */}
                    <div className="bg-surface rounded-md p-4 border border-border">
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between text-on-surface-variant"><span>Subtotal</span><span>{formatPrice(order.subtotal || 0)}</span></div>
                        <div className="flex justify-between text-on-surface-variant"><span>Shipping</span><span>{formatPrice(order.shipping || 0)}</span></div>
                        <div className="flex justify-between text-on-surface-variant"><span>VAT</span><span>{formatPrice(order.vat || 0)}</span></div>
                        {order.discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
                        <div className="flex justify-between font-bold text-accent pt-2 border-t border-border text-base"><span>Total</span><span>{formatPrice(order.total || 0)}</span></div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Status Update */}
                      <div className="flex items-center gap-2 flex-1">
                        <Truck size={16} className="text-on-surface-variant flex-shrink-0" />
                        <select
                          value={order.status}
                          onChange={(e) => updateOrder(order.id, { status: e.target.value as Order["status"] })}
                          className="bg-surface-high border border-border px-3 py-2 text-sm rounded-md outline-none focus:border-accent flex-1"
                          aria-label="Update order status"
                        >
                          {["Pending", "Processing", "Shipped", "Delivered", "Refunded"].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* Tracking */}
                      <div className="flex items-center gap-2 flex-1">
                        <select
                          value={order.courier || ""}
                          onChange={(e) => updateOrder(order.id, { courier: e.target.value })}
                          className="bg-surface-high border border-border px-3 py-2 text-sm rounded-md outline-none focus:border-accent"
                          aria-label="Select courier"
                        >
                          <option value="">Courier</option>
                          {COURIERS.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input
                          type="text"
                          value={order.tracking_number || ""}
                          onChange={(e) => updateOrder(order.id, { tracking_number: e.target.value })}
                          placeholder="Tracking #"
                          className="bg-surface-high border border-border px-3 py-2 text-sm rounded-md outline-none focus:border-accent flex-1"
                        />
                      </div>

                      {/* Refund */}
                      {order.status !== "Refunded" && (
                        <button
                          onClick={() => {
                            if (confirm("Issue a refund for this order?")) {
                              updateOrder(order.id, { status: "Refunded" });
                            }
                          }}
                          className="px-4 py-2 bg-error/10 text-error text-xs font-headline font-bold uppercase tracking-tight rounded-md hover:bg-error/20 transition-colors flex items-center gap-1"
                        >
                          <RotateCcw size={12} /> Refund
                        </button>
                      )}
                    </div>

                    {saving === order.id && (
                      <div className="flex items-center gap-2 text-xs text-accent">
                        <Loader2 size={12} className="animate-spin" /> Saving...
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
