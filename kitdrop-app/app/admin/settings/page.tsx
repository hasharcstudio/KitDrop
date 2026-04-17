"use client";
import { useEffect, useState } from "react";
import { Save, Loader2, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import type { StoreSettings, PromoCode } from "@/lib/database.types";

const TABS = ["Financial", "Spotlight", "Promo Codes", "Global"];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("Financial");
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);

  // Promo code form
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [newExpiry, setNewExpiry] = useState("");
  const [newMaxUses, setNewMaxUses] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/settings").then((r) => r.json()),
      fetch("/api/products?all=true").then((r) => r.json()),
    ]).then(([settingsData, productsData]) => {
      setSettings(settingsData);
      setProducts(
        (Array.isArray(productsData) ? productsData : []).map((p: { id: string; name: string }) => ({
          id: p.id,
          name: p.name,
        }))
      );
      setLoading(false);
    });
  }, []);

  const save = async (updates: Partial<StoreSettings>) => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, ...updates }),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } finally {
      setSaving(false);
    }
  };

  const addPromoCode = () => {
    if (!newCode || !newDiscount) return;
    const code: PromoCode = {
      code: newCode.toUpperCase(),
      discount_percent: parseFloat(newDiscount),
      expires_at: newExpiry || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      max_uses: parseInt(newMaxUses) || 100,
      current_uses: 0,
      is_active: true,
    };
    const updated = [...(settings?.promo_codes || []), code];
    save({ promo_codes: updated });
    setNewCode("");
    setNewDiscount("");
    setNewExpiry("");
    setNewMaxUses("");
  };

  const removePromoCode = (index: number) => {
    const updated = (settings?.promo_codes || []).filter((_, i) => i !== index);
    save({ promo_codes: updated });
  };

  const togglePromoCode = (index: number) => {
    const updated = (settings?.promo_codes || []).map((c, i) =>
      i === index ? { ...c, is_active: !c.is_active } : c
    );
    save({ promo_codes: updated });
  };

  const inputClass = "w-full bg-background border border-border px-4 py-3 text-sm text-on-surface outline-none focus:border-accent transition-colors rounded-md";
  const labelClass = "block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2";

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase font-headline tracking-tight">
          Settings
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Store configuration & marketing tools
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-headline font-bold uppercase tracking-tight rounded-md transition-colors ${
              activeTab === tab
                ? "bg-accent text-on-accent"
                : "bg-surface border border-border text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Financial */}
      {activeTab === "Financial" && (
        <div className="bg-surface border border-border rounded-lg p-5 space-y-5">
          <h2 className="font-headline font-bold uppercase text-sm tracking-tight text-accent">
            Financial Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="vat-rate" className={labelClass}>VAT Rate (%)</label>
              <input
                id="vat-rate"
                type="number"
                step="0.01"
                value={(settings.vat_rate * 100).toFixed(2)}
                onChange={(e) =>
                  setSettings({ ...settings, vat_rate: parseFloat(e.target.value) / 100 || 0 })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="flat-shipping-fee" className={labelClass}>Flat Shipping Fee ($)</label>
              <input
                id="flat-shipping-fee"
                type="number"
                step="0.01"
                value={settings.flat_shipping_fee}
                onChange={(e) =>
                  setSettings({ ...settings, flat_shipping_fee: parseFloat(e.target.value) || 0 })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="free-shipping-threshold" className={labelClass}>Free Shipping Threshold ($)</label>
              <input
                id="free-shipping-threshold"
                type="number"
                step="0.01"
                value={settings.free_shipping_threshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    free_shipping_threshold: parseFloat(e.target.value) || 0,
                  })
                }
                className={inputClass}
              />
            </div>
          </div>
          <button
            onClick={() => save(settings)}
            disabled={saving}
            className="bg-accent text-on-accent px-6 py-2.5 font-headline font-bold uppercase tracking-tight text-sm flex items-center gap-2 hover:bg-accent-dim transition-colors disabled:opacity-50 rounded-md"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Financial Settings
          </button>
        </div>
      )}

      {/* Spotlight */}
      {activeTab === "Spotlight" && (
        <div className="bg-surface border border-border rounded-lg p-5 space-y-5">
          <h2 className="font-headline font-bold uppercase text-sm tracking-tight text-accent">
            Spotlight Manager
          </h2>
          <div>
            <label className={labelClass}>Hero Carousel Kit IDs</label>
            <p className="text-[10px] text-on-surface-variant mb-2">
              Select products to feature in the homepage hero section
            </p>
            <select
              multiple
              value={settings.hero_kit_ids || []}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (o) => o.value);
                setSettings({ ...settings, hero_kit_ids: selected });
              }}
              className={`${inputClass} h-40`}
              aria-label="Select hero carousel products"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Global Giants Spotlight IDs</label>
            <p className="text-[10px] text-on-surface-variant mb-2">
              Select products for the &quot;Global Giants&quot; section
            </p>
            <select
              multiple
              value={settings.spotlight_kit_ids || []}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (o) => o.value);
                setSettings({ ...settings, spotlight_kit_ids: selected });
              }}
              className={`${inputClass} h-40`}
              aria-label="Select spotlight products"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => save(settings)}
            disabled={saving}
            className="bg-accent text-on-accent px-6 py-2.5 font-headline font-bold uppercase tracking-tight text-sm flex items-center gap-2 hover:bg-accent-dim transition-colors disabled:opacity-50 rounded-md"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Spotlight Config
          </button>
        </div>
      )}

      {/* Promo Codes */}
      {activeTab === "Promo Codes" && (
        <div className="bg-surface border border-border rounded-lg p-5 space-y-5">
          <h2 className="font-headline font-bold uppercase text-sm tracking-tight text-accent">
            Promo Code Engine
          </h2>

          {/* Create */}
          <div className="bg-background rounded-lg p-4 border border-border space-y-3">
            <p className="text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant">
              Create New Code
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="WORLDCUP26"
                className="bg-surface-high border border-border px-3 py-2 text-sm rounded-md outline-none focus:border-accent uppercase"
              />
              <input
                type="number"
                value={newDiscount}
                onChange={(e) => setNewDiscount(e.target.value)}
                placeholder="Discount %"
                className="bg-surface-high border border-border px-3 py-2 text-sm rounded-md outline-none focus:border-accent"
              />
              <input
                type="date"
                value={newExpiry}
                onChange={(e) => setNewExpiry(e.target.value)}
                aria-label="Expiry date"
                className="bg-surface-high border border-border px-3 py-2 text-sm rounded-md outline-none focus:border-accent"
              />
              <input
                type="number"
                value={newMaxUses}
                onChange={(e) => setNewMaxUses(e.target.value)}
                placeholder="Max uses"
                className="bg-surface-high border border-border px-3 py-2 text-sm rounded-md outline-none focus:border-accent"
              />
            </div>
            <button
              onClick={addPromoCode}
              className="bg-accent text-on-accent px-4 py-2 font-headline font-bold uppercase tracking-tight text-xs flex items-center gap-1 hover:bg-accent-dim rounded-md"
            >
              <Plus size={14} /> Create Code
            </button>
          </div>

          {/* List */}
          {(settings.promo_codes || []).length === 0 ? (
            <p className="text-center text-on-surface-variant text-xs py-4 font-headline uppercase tracking-widest">
              No promo codes yet
            </p>
          ) : (
            <div className="space-y-2">
              {(settings.promo_codes || []).map((code, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-background rounded-lg p-4 border border-border"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm font-bold text-accent tracking-wider">
                      {code.code}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {code.discount_percent}% off
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      {code.current_uses}/{code.max_uses} used
                    </span>
                    <span className="text-[10px] text-on-surface-variant hidden sm:inline">
                      Expires: {new Date(code.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePromoCode(i)}
                      className={`p-1 rounded transition-colors ${
                        code.is_active ? "text-success" : "text-on-surface-variant"
                      }`}
                      aria-label={code.is_active ? "Deactivate" : "Activate"}
                    >
                      {code.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    </button>
                    <button
                      onClick={() => removePromoCode(i)}
                      className="p-1 text-on-surface-variant hover:text-error transition-colors"
                      aria-label="Delete promo code"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Global Controls */}
      {activeTab === "Global" && (
        <div className="bg-surface border border-border rounded-lg p-5 space-y-5">
          <h2 className="font-headline font-bold uppercase text-sm tracking-tight text-accent">
            Global Controls
          </h2>

          {/* Maintenance Mode */}
          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <p className="text-sm font-headline font-bold uppercase tracking-tight">
                Maintenance Mode
              </p>
              <p className="text-[10px] text-on-surface-variant mt-1">
                Temporarily disable the storefront for visitors
              </p>
            </div>
            <button
              onClick={() => save({ maintenance_mode: !settings.maintenance_mode })}
              className={`p-1 rounded transition-colors ${
                settings.maintenance_mode ? "text-error" : "text-on-surface-variant"
              }`}
              aria-label="Toggle maintenance mode"
            >
              {settings.maintenance_mode ? (
                <ToggleRight size={28} className="text-error" />
              ) : (
                <ToggleLeft size={28} />
              )}
            </button>
          </div>

          {/* Announcement */}
          <div>
            <label className={labelClass}>Store Announcement Banner</label>
            <input
              type="text"
              value={settings.announcement_text || ""}
              onChange={(e) =>
                setSettings({ ...settings, announcement_text: e.target.value })
              }
              placeholder="e.g. Free shipping on orders over ৳80!"
              className={inputClass}
            />
            {settings.announcement_text && (
              <div className="mt-3 bg-accent text-on-accent text-center py-2 text-xs font-headline font-bold uppercase tracking-widest rounded-md">
                {settings.announcement_text}
              </div>
            )}
          </div>

          <button
            onClick={() => save(settings)}
            disabled={saving}
            className="bg-accent text-on-accent px-6 py-2.5 font-headline font-bold uppercase tracking-tight text-sm flex items-center gap-2 hover:bg-accent-dim transition-colors disabled:opacity-50 rounded-md"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Global Settings
          </button>
        </div>
      )}
    </div>
  );
}
