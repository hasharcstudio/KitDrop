"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, Save, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ui/ImageUploader";
import type { ProductVariant, LeagueNation } from "@/lib/database.types";

interface VariantRow {
  size: string;
  type: string;
  stock_quantity: number;
  price_override: number | null;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leagues, setLeagues] = useState<LeagueNation[]>([]);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("Kit");
  const [leagueId, setLeagueId] = useState("");
  const [isNational, setIsNational] = useState(false);
  const [season, setSeason] = useState("");
  const [type, setType] = useState("Home");
  const [basePrice, setBasePrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [badgeImage, setBadgeImage] = useState("");
  const [description, setDescription] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [isAuthentic, setIsAuthentic] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [variants, setVariants] = useState<VariantRow[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${id}`).then((r) => r.json()),
      fetch("/api/leagues").then((r) => r.json()).catch(() => []),
    ]).then(([product, leaguesData]) => {
      if (product && !product.error) {
        setName(product.name || "");
        setBrand(product.brand || "");
        setCategory(product.category || "Kit");
        setLeagueId(product.league_id || "");
        setIsNational(product.is_national || false);
        setSeason(product.season || "");
        setType(product.type || "Home");
        setBasePrice(String(product.base_price || ""));
        setOriginalPrice(product.original_price ? String(product.original_price) : "");
        setImageUrl(product.image_url || "");
        setGalleryImages(product.images || []);
        setBadgeImage(product.badge_image || "");
        setDescription(product.description || "");
        setIsNew(product.is_new || false);
        setIsAuthentic(product.is_authentic || false);
        setIsVisible(product.is_visible !== false);
        setFeatured(product.featured || false);
        setVariants(
          (product.product_variants || []).map((v: ProductVariant) => ({
            size: v.size,
            type: v.type,
            stock_quantity: v.stock_quantity,
            price_override: v.price_override,
          }))
        );
      }
      setLeagues(Array.isArray(leaguesData) ? leaguesData : []);
      setLoading(false);
    });
  }, [id]);

  const addVariant = () => {
    setVariants([...variants, { size: "", type: "Replica", stock_quantity: 0, price_override: null }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof VariantRow, value: string | number | null) => {
    setVariants(variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, brand, category,
          league_id: leagueId || null,
          is_national: isNational, season, type,
          base_price: parseFloat(basePrice),
          original_price: originalPrice ? parseFloat(originalPrice) : null,
          image_url: imageUrl, images: galleryImages, badge_image: badgeImage,
          description, is_new: isNew, is_authentic: isAuthentic,
          is_visible: isVisible, featured, variants,
        }),
      });
      if (res.ok) router.push("/admin/products");
      else alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this product permanently? This cannot be undone.")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.push("/admin/products");
  };

  const inputClass = "w-full bg-background border border-border px-4 py-3 text-sm text-on-surface outline-none focus:border-accent transition-colors rounded-md";
  const labelClass = "block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="w-8 h-8 rounded-md bg-surface border border-border flex items-center justify-center text-on-surface-variant hover:text-accent hover:border-accent transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black uppercase font-headline tracking-tight">Edit Product</h1>
        </div>
        <button onClick={handleDelete} className="px-4 py-2 bg-error/10 text-error font-headline font-bold uppercase tracking-tight text-xs flex items-center gap-2 hover:bg-error/20 transition-colors rounded-md">
          <Trash2 size={14} /> Delete
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-headline font-bold uppercase text-sm tracking-tight text-accent mb-2">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Product Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
            </div>
            <div><label className={labelClass}>Brand</label><input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                {["Kit", "Boot", "Turf", "Accessory"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className={labelClass}>League</label>
              <select value={leagueId} onChange={(e) => setLeagueId(e.target.value)} className={inputClass}>
                <option value="">— None —</option>
                {leagues.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div><label className={labelClass}>Season</label><input type="text" value={season} onChange={(e) => setSeason(e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
                {["Home", "Away", "Third", "Goalkeeper", "Boots", "Turf Shoes", "Accessories"].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div><label className={labelClass}><input type="checkbox" checked={isNational} onChange={(e) => setIsNational(e.target.checked)} className="mr-2 accent-accent" />National Team</label></div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-headline font-bold uppercase text-sm tracking-tight text-accent mb-2">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelClass}>Base Price ($)</label><input type="number" step="0.01" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className={inputClass} required /></div>
            <div><label className={labelClass}>Original Price ($)</label><input type="number" step="0.01" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className={inputClass} /></div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-headline font-bold uppercase text-sm tracking-tight text-accent mb-2">Images</h2>
          <ImageUploader value={imageUrl} onChange={(url) => setImageUrl(url as string)} label="Main Image" />
          <ImageUploader value={galleryImages} onChange={(urls) => setGalleryImages(urls as string[])} multiple label="Gallery" />
          <div><label className={labelClass}>Badge Image URL</label><input type="text" value={badgeImage} onChange={(e) => setBadgeImage(e.target.value)} className={inputClass} /></div>
        </div>

        {/* Description */}
        <div className="bg-surface border border-border rounded-lg p-5">
          <h2 className="font-headline font-bold uppercase text-sm tracking-tight text-accent mb-4">Description</h2>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={`${inputClass} resize-y`} />
        </div>

        {/* Variants */}
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline font-bold uppercase text-sm tracking-tight text-accent">Variants</h2>
            <button type="button" onClick={addVariant} className="text-accent text-xs font-headline font-bold uppercase tracking-tight flex items-center gap-1"><Plus size={14} /> Add</button>
          </div>
          <div className="space-y-2">
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_80px_120px_40px] gap-2 sm:gap-3 bg-background rounded-md p-3 sm:p-2 border border-border/50">
                <input type="text" value={v.size} onChange={(e) => updateVariant(i, "size", e.target.value)} placeholder="Size" className="bg-surface-high border border-border px-3 py-2 text-sm rounded outline-none focus:border-accent" />
                <select value={v.type} onChange={(e) => updateVariant(i, "type", e.target.value)} className="bg-surface-high border border-border px-3 py-2 text-sm rounded outline-none focus:border-accent">
                  {["Authentic", "Replica", "FG", "SG", "AG", "TF"].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <input type="number" value={v.stock_quantity} onChange={(e) => updateVariant(i, "stock_quantity", parseInt(e.target.value) || 0)} className="bg-surface-high border border-border px-3 py-2 text-sm rounded outline-none focus:border-accent" />
                <input type="number" step="0.01" value={v.price_override ?? ""} onChange={(e) => updateVariant(i, "price_override", e.target.value ? parseFloat(e.target.value) : null)} placeholder="Override" className="bg-surface-high border border-border px-3 py-2 text-sm rounded outline-none focus:border-accent" />
                <button type="button" onClick={() => removeVariant(i)} className="w-8 h-8 rounded flex items-center justify-center text-on-surface-variant hover:text-error transition-colors self-center" aria-label="Remove"><X size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="bg-surface border border-border rounded-lg p-5">
          <h2 className="font-headline font-bold uppercase text-sm tracking-tight text-accent mb-4">Visibility & Tags</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Visible", checked: isVisible, onChange: setIsVisible },
              { label: "New", checked: isNew, onChange: setIsNew },
              { label: "Authentic", checked: isAuthentic, onChange: setIsAuthentic },
              { label: "Featured", checked: featured, onChange: setFeatured },
            ].map((t) => (
              <label key={t.label} className="flex items-center gap-2 cursor-pointer text-sm font-headline font-bold uppercase tracking-tight">
                <input type="checkbox" checked={t.checked} onChange={(e) => t.onChange(e.target.checked)} className="w-4 h-4 accent-accent" />{t.label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/admin/products" className="px-6 py-3 bg-surface border border-border text-on-surface font-headline font-bold uppercase tracking-tight text-sm hover:border-border-hover transition-colors rounded-md">Cancel</Link>
          <button type="submit" disabled={saving} className="px-8 py-3 bg-accent text-on-accent font-headline font-bold uppercase tracking-tight text-sm hover:bg-accent-dim transition-colors flex items-center gap-2 disabled:opacity-50 rounded-md">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
}
