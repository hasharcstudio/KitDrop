"use client";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { ChevronRight, ChevronDown } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import type { Order } from "@/lib/database.types";

interface CustomerData {
  email: string;
  full_name?: string;
  phone?: string;
  address?: string;
  city_village?: string;
  zilla?: string;
  postal_code?: string;
  fav_club?: string;
  payment_method?: string;
  age?: number;
}

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  type?: string;
}

const PAYMENT_OPTIONS = [
  "Cash on Delivery",
  "bKash",
  "Nagad",
  "Card",
];

export function EditableProfile({ customer, hasProfile }: { customer: CustomerData | null; hasProfile: boolean }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [fullName, setFullName] = useState(customer?.full_name || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [address, setAddress] = useState(customer?.address || "");
  const [cityVillage, setCityVillage] = useState(customer?.city_village || "");
  const [zilla, setZilla] = useState(customer?.zilla || "");
  const [postalCode, setPostalCode] = useState(customer?.postal_code || "");
  const [favClub] = useState(customer?.fav_club || "");

  const handleSave = async () => {
    if (!customer?.email) return;
    setSaving(true);
    try {
      const res = await fetch("/api/customers/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customer.email,
          full_name: fullName,
          phone,
          address,
          city: cityVillage,
          zilla,
          postal_code: postalCode,
        }),
      });
      if (res.ok) {
        toast.success("Profile updated successfully!");
        setEditing(false);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update profile");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!hasProfile) {
    return (
      <p className="text-on-surface-variant text-sm">
        No extended profile setup yet. Register from the signup page to populate these fields!
      </p>
    );
  }

  const fieldClass = "w-full bg-background border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors text-on-surface";
  const labelClass = "text-[10px] uppercase font-bold tracking-widest text-on-surface-variant block mb-1";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div />
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 text-xs font-headline font-bold uppercase tracking-tight border border-accent text-accent hover:bg-accent hover:text-on-accent transition-colors"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 text-xs font-headline font-bold uppercase tracking-tight border border-border text-on-surface-variant hover:text-on-surface hover:border-border-hover transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-xs font-headline font-bold uppercase tracking-tight bg-accent text-on-accent hover:bg-accent-dim transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
        <div>
          <span className={labelClass}>Full Name</span>
          {editing ? (
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className={fieldClass} aria-label="Full Name" />
          ) : (
            <div className="font-body text-on-surface">{customer?.full_name || "N/A"}</div>
          )}
        </div>
        <div>
          <span className={labelClass}>Email (Authenticated)</span>
          <div className="font-body text-on-surface">{customer?.email}</div>
        </div>
        <div>
          <span className={labelClass}>Primary Address</span>
          {editing ? (
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="House, Road, Area" className={fieldClass} aria-label="Address" />
          ) : (
            <div className="font-body text-on-surface">{customer?.address || "N/A"}</div>
          )}
        </div>
        <div>
          <span className={labelClass}>Area / Zilla</span>
          {editing ? (
            <div className="flex gap-2">
              <input type="text" value={cityVillage} onChange={e => setCityVillage(e.target.value)} placeholder="Area" className={fieldClass} aria-label="Area" />
              <input type="text" value={zilla} onChange={e => setZilla(e.target.value)} placeholder="Zilla" className={fieldClass} aria-label="Zilla" />
            </div>
          ) : (
            <div className="font-body text-on-surface">{customer?.city_village || "N/A"}, {customer?.zilla || "N/A"}</div>
          )}
        </div>
        <div>
          <span className={labelClass}>Mobile Phone</span>
          {editing ? (
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+880 1XXX-XXXXXX" className={fieldClass} aria-label="Phone" />
          ) : (
            <div className="font-body text-accent font-medium">{customer?.phone || "N/A"}</div>
          )}
        </div>
        <div>
          <span className={labelClass}>Postal Code</span>
          {editing ? (
            <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="1205" className={fieldClass} aria-label="Postal Code" />
          ) : (
            <div className="font-body text-on-surface">{customer?.postal_code || "N/A"}</div>
          )}
        </div>
        <div>
          <span className={labelClass}>Linked Club</span>
          <div className="font-body text-on-surface">{favClub || customer?.fav_club || "N/A"}</div>
        </div>
      </div>
    </div>
  );
}

export function AccountSettings({ customer }: { customer: CustomerData | null }) {
  const [paymentMethod, setPaymentMethod] = useState(customer?.payment_method || "Cash on Delivery");
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSavePayment = async (method: string) => {
    if (!customer?.email) return;
    setPaymentMethod(method);
    setSaving(true);
    try {
      const res = await fetch("/api/customers/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: customer.email, payment_method: method }),
      });
      if (res.ok) {
        toast.success(`Payment method updated to ${method}`);
      }
    } catch {
      toast.error("Failed to update payment method");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Payment Method */}
      <div className="bg-surface border border-border p-6 rounded-lg">
        <h4 className="font-headline font-bold uppercase tracking-tight text-sm mb-4">Default Payment Method</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PAYMENT_OPTIONS.map(method => (
            <button
              key={method}
              onClick={() => handleSavePayment(method)}
              disabled={saving}
              className={`text-center py-3 border text-xs font-headline font-bold uppercase tracking-tight transition-all ${
                paymentMethod === method
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-on-surface-variant hover:border-border-hover hover:text-on-surface"
              }`}
            >
              {method}
            </button>
          ))}
        </div>
        <p className="text-xs text-on-surface-variant mt-3">
          This will be pre-selected during checkout.
        </p>
      </div>

      {/* Order Alerts */}
      <div className="bg-surface border border-border p-6 rounded-lg flex items-center justify-between">
        <div>
          <h4 className="font-headline font-bold uppercase tracking-tight text-sm">Order Alerts</h4>
          <p className="text-sm text-on-surface-variant mt-1">Receive transactional emails and shipping notices.</p>
        </div>
        <button
          onClick={() => setNotifications(!notifications)}
          className={`w-12 h-6 rounded-full relative transition-colors ${notifications ? "bg-accent" : "bg-border"}`}
          aria-label="Toggle order alerts"
        >
          <div className={`w-5 h-5 bg-black absolute top-0.5 rounded-full transition-all ${notifications ? "right-0.5" : "left-0.5"}`} />
        </button>
      </div>
    </div>
  );
}

export function OrderHistoryList({ orders }: { orders: Order[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!orders || orders.length === 0) return null;

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-surface border border-border rounded-lg hover:border-accent transition-colors overflow-hidden">
          <div 
            onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
            className="p-5 sm:p-6 group cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-headline font-black text-lg tracking-tight uppercase">
                  #{order.order_number || order.id.slice(0, 8)}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-surface-high text-accent">
                  {order.status}
                </span>
              </div>
              <p className="text-sm font-body text-on-surface-variant">
                Placed on {new Date(order.created_at).toLocaleDateString()} • {Array.isArray(order.items) ? order.items.length : 1} item(s) • via {order.courier || "Standard"}
              </p>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
              <span className="font-headline font-black text-lg sm:text-xl">
                {formatPrice(parseFloat(String(order.total)) || 0)}
              </span>
              <button aria-label="View details" className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center text-on-surface-variant group-hover:bg-accent group-hover:text-on-accent transition-colors duration-300">
                {expandedId === order.id ? <ChevronDown size={20} /> : <ChevronRight size={20} className="translate-x-0.5" />}
              </button>
            </div>
          </div>
          
          {expandedId === order.id && Array.isArray(order.items) && (
            <div className="px-5 pb-5 sm:px-6 sm:pb-6 border-t border-border bg-background/50 pt-5">
              <h4 className="text-xs font-headline font-bold tracking-widest text-on-surface-variant uppercase mb-4">Order Items</h4>
              <div className="space-y-4">
                {order.items.map((item: unknown, i: number) => {
                  const orderItem = item as OrderItem;
                  return (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-16 h-16 shrink-0 bg-surface-high border border-border flex items-center justify-center p-2 rounded relative">
                      {orderItem.image ? (
                        <Image src={orderItem.image} alt={orderItem.name} fill className="object-contain p-1" />
                      ) : (
                        <span className="text-xs text-on-surface-variant">No Img</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-headline font-bold uppercase text-sm">{orderItem.name}</p>
                      <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-wider">
                        Size: {orderItem.size} {orderItem.type ? `| ${orderItem.type}` : ""} | Qty: {orderItem.quantity}
                      </p>
                    </div>
                    <div className="font-headline font-bold text-sm">
                      {formatPrice(orderItem.price * orderItem.quantity)}
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
