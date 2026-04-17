"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ui/ImageUploader";
import type { LeagueNation } from "@/lib/database.types";

interface VariantRow {
  size: string;
  type: string;
  stock_quantity: number;
  price_override: number | null;
}

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [leagues, setLeagues] = useState<LeagueNation[]>([]);

  // Product fields
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("Kit");
  const [leagueId, setLeagueId] = useState("");
  const [isNational, setIsNational] = useState(false);
  const [season, setSeason] = useState("2025/26");
  const [type, setType] = useState("Home");
  const [basePrice, setBasePrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [badgeImage, setBadgeImage] = useState("");
  const [description, setDescription] = useState("");
  const [isNew, setIsNew] = useState(true);
  const [isAuthentic, setIsAuthentic] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [featured, setFeatured] = useState(false);

  // Variants
  const [variants, setVariants] = useState<VariantRow[]>([
    { size: "M", type: "Replica", stock_quantity: 50, price_override: null },
  ]);

  useEffect(() => {
    fetch("/api/leagues")
      .then((r) => r.json())
      .then((data) => setLeagues(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const addVariant = () => {
    setVariants([
      ...variants,
      { size: "", type: "Replica", stock_quantity: 0, price_override: null },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof VariantRow, value: string | number | null) => {
    setVariants(
      variants.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !basePrice) {
      alert("Product name and base price are required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          brand,
          category,
          league_id: leagueId || null,
          is_national: isNational,
          season,
          type,
          base_price: parseFloat(basePrice),
          original_price: originalPrice ? parseFloat(originalPrice) : null,
          image_url: imageUrl,
          images: galleryImages,
          badge_image: badgeImage,
          description,
          is_new: isNew,
          is_authentic: isAuthentic,
          is_visible: isVisible,
          featured,
          rating: 0,
          review_count: 0,
          variants,
        }),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create product");
      }
    } catch {
      alert("Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full bg-background border border-border px-4 py-3 text-sm text-on-surface outline-none focus:border-accent transition-colors rounded-md";
  const labelClass =
    "block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="w-8 h-8 rounded-md bg-surface border border-border flex items-center justify-center text-on-surface-variant hover:text-accent hover:border-accent transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black uppercase font-headline tracking-tight">
            Add New Product
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-headline font-bold uppercase text-sm tracking-tight text-accent mb-2">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. France 2026 Away Kit"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Nike, Adidas, Puma..."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                <option value="Kit">Kit</option>
                <option value="Boot">Boot</option>
                <option value="Turf">Turf</option>
                <option value="Accessory">Accessory</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>League / Tournament</label>
              <select
                value={leagueId}
                onChange={(e) => setLeagueId(e.target.value)}
                className={inputClass}
              >
                <option value="">— Select —</option>
                {leagues.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Season</label>
              <input
                type="text"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                placeholder="2025/26"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={inputClass}
              >
                {["Home", "Away", "Third", "Goalkeeper", "Boots", "Turf Shoes", "Accessories"].map(
                  (t) => (
                    <option key={t} value={t}>{t}</option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className={labelClass}>
                <input
                  type="checkbox"
                  checked={isNational}
                  onChange={(e) => setIsNational(e.target.checked)}
                  className="mr-2 accent-accent"
                />
                National Team Kit
              </label>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-headline font-bold uppercase text-sm tracking-tight text-accent mb-2">
            Pricing
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Base Price ($) *</label>
              <input
                type="number"
                step="0.01"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="89.99"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Original Price ($ — for sale display)</label>
              <input
                type="number"
                step="0.01"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="110.00"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-headline font-bold uppercase text-sm tracking-tight text-accent mb-2">
            Images
          </h2>
          <ImageUploader
            value={imageUrl}
            onChange={(url) => setImageUrl(url as string)}
            label="Main Product Image *"
          />
          <ImageUploader
            value={galleryImages}
            onChange={(urls) => setGalleryImages(urls as string[])}
            multiple
            label="Gallery Images"
          />
          <div>
            <label className={labelClass}>Badge Image URL</label>
            <input
              type="text"
              value={badgeImage}
              onChange={(e) => setBadgeImage(e.target.value)}
              placeholder="Club/nation crest URL"
              className={inputClass}
            />
          </div>
        </div>

        {/* Description */}
        <div className="bg-surface border border-border rounded-lg p-5">
          <h2 className="font-headline font-bold uppercase text-sm tracking-tight text-accent mb-4">
            Description
          </h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Full product description..."
            className={`${inputClass} resize-y`}
          />
        </div>

        {/* Variants */}
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline font-bold uppercase text-sm tracking-tight text-accent">
              Variants (Sizes & Stock)
            </h2>
            <button
              type="button"
              onClick={addVariant}
              className="text-accent text-xs font-headline font-bold uppercase tracking-tight flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <Plus size={14} />
              Add Variant
            </button>
          </div>

          {/* Variant Header */}
          <div className="hidden sm:grid grid-cols-[1fr_1fr_80px_120px_40px] gap-3 mb-2 text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface-variant px-1">
            <span>Size</span>
            <span>Type</span>
            <span>Stock</span>
            <span>Price Override</span>
            <span></span>
          </div>

          {/* Variant Rows */}
          <div className="space-y-2">
            {variants.map((v, i) => (
              <div
                key={i}
                className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_80px_120px_40px] gap-2 sm:gap-3 bg-background rounded-md p-3 sm:p-2 border border-border/50"
              >
                <input
                  type="text"
                  value={v.size}
                  onChange={(e) => updateVariant(i, "size", e.target.value)}
                  placeholder="M, L, US 9..."
                  className="bg-surface-high border border-border px-3 py-2 text-sm rounded outline-none focus:border-accent"
                />
                <select
                  value={v.type}
                  onChange={(e) => updateVariant(i, "type", e.target.value)}
                  className="bg-surface-high border border-border px-3 py-2 text-sm rounded outline-none focus:border-accent"
                >
                  {["Authentic", "Replica", "FG", "SG", "AG", "TF"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={v.stock_quantity}
                  onChange={(e) =>
                    updateVariant(i, "stock_quantity", parseInt(e.target.value) || 0)
                  }
                  placeholder="50"
                  className="bg-surface-high border border-border px-3 py-2 text-sm rounded outline-none focus:border-accent"
                />
                <input
                  type="number"
                  step="0.01"
                  value={v.price_override ?? ""}
                  onChange={(e) =>
                    updateVariant(
                      i,
                      "price_override",
                      e.target.value ? parseFloat(e.target.value) : null
                    )
                  }
                  placeholder="Optional"
                  className="bg-surface-high border border-border px-3 py-2 text-sm rounded outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="w-8 h-8 rounded flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors self-center"
                  aria-label="Remove variant"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="bg-surface border border-border rounded-lg p-5">
          <h2 className="font-headline font-bold uppercase text-sm tracking-tight text-accent mb-4">
            Visibility & Tags
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Visible in Shop", checked: isVisible, onChange: setIsVisible },
              { label: "Mark as New", checked: isNew, onChange: setIsNew },
              { label: "Authentic", checked: isAuthentic, onChange: setIsAuthentic },
              { label: "Featured", checked: featured, onChange: setFeatured },
            ].map((toggle) => (
              <label
                key={toggle.label}
                className="flex items-center gap-2 cursor-pointer text-sm font-headline font-bold uppercase tracking-tight"
              >
                <input
                  type="checkbox"
                  checked={toggle.checked}
                  onChange={(e) => toggle.onChange(e.target.checked)}
                  className="w-4 h-4 accent-accent"
                />
                {toggle.label}
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/products"
            className="px-6 py-3 bg-surface border border-border text-on-surface font-headline font-bold uppercase tracking-tight text-sm hover:border-border-hover transition-colors rounded-md"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-accent text-on-accent font-headline font-bold uppercase tracking-tight text-sm hover:bg-accent-dim transition-colors flex items-center gap-2 disabled:opacity-50 rounded-md"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Create Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
