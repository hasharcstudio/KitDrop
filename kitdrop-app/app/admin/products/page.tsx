"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Eye, EyeOff, Pencil, Trash2, Package } from "lucide-react";
import StatusBadge from "@/components/admin/ui/StatusBadge";
import type { Product, ProductVariant } from "@/lib/database.types";

type ProductWithVariants = Product & { product_variants: ProductVariant[] };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?all=true");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const toggleVisibility = async (id: string, current: boolean) => {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_visible: !current }),
    });
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_visible: !current } : p))
    );
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const getTotalStock = (p: ProductWithVariants) =>
    (p.product_variants || []).reduce((sum, v) => sum + v.stock_quantity, 0);

  const getStockStatus = (p: ProductWithVariants) => {
    const total = getTotalStock(p);
    if (total === 0) return "Out of Stock";
    if (total < 10) return "Low Stock";
    return "In Stock";
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase font-headline tracking-tight">
            Products
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {products.length} products in catalog
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-accent text-on-accent px-5 py-2.5 font-headline font-bold uppercase tracking-tight text-sm flex items-center gap-2 hover:bg-accent-dim transition-colors active:scale-95"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-border pl-10 pr-4 py-2.5 text-sm font-body text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-accent transition-colors rounded-md"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
          className="bg-surface border border-border px-4 py-2.5 text-sm font-headline font-bold uppercase tracking-tight text-on-surface outline-none focus:border-accent rounded-md"
        >
          {["All", "Kit", "Boot", "Turf", "Accessory"].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      {filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-12 text-center">
          <Package size={40} className="mx-auto text-on-surface-variant/30 mb-4" />
          <p className="font-headline font-bold uppercase tracking-tight text-on-surface-variant">
            No products found
          </p>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          {/* Desktop Table Header */}
          <div className="hidden lg:grid grid-cols-[80px_1fr_100px_120px_100px_100px_80px_80px] gap-4 px-5 py-3 border-b border-border text-[10px] font-headline font-bold uppercase tracking-widest text-on-surface-variant">
            <span>Image</span>
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Status</span>
            <span>Visible</span>
            <span>Actions</span>
          </div>

          {/* Rows */}
          {filtered.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-1 lg:grid-cols-[80px_1fr_100px_120px_100px_100px_80px_80px] gap-3 lg:gap-4 px-5 py-4 border-b border-border last:border-0 hover:bg-surface-high/30 transition-colors items-center"
            >
              {/* Image */}
              <div className="w-16 h-16 lg:w-14 lg:h-14 bg-surface-high border border-border rounded overflow-hidden relative flex-shrink-0">
                {product.image_url ? (
                  <Image src={product.image_url} alt={product.name} fill className="object-contain p-1" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={18} className="text-on-surface-variant/30" />
                  </div>
                )}
              </div>

              {/* Product Name */}
              <div className="min-w-0">
                <p className="text-sm font-headline font-bold tracking-tight truncate">{product.name}</p>
                <p className="text-[10px] text-on-surface-variant truncate">{product.brand} · {product.season}</p>
              </div>

              {/* Category */}
              <span className="text-xs font-headline font-bold uppercase tracking-tight text-on-surface-variant">
                {product.category}
              </span>

              {/* Price */}
              <div>
                <span className="text-sm font-headline font-bold">${product.base_price}</span>
                {product.original_price && (
                  <span className="text-[10px] text-on-surface-variant line-through ml-1">
                    ${product.original_price}
                  </span>
                )}
              </div>

              {/* Stock */}
              <span className="text-sm font-headline font-bold">
                {getTotalStock(product)}
              </span>

              {/* Stock Status */}
              <StatusBadge status={getStockStatus(product)} />

              {/* Visibility Toggle */}
              <button
                onClick={() => toggleVisibility(product.id, product.is_visible)}
                className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                  product.is_visible
                    ? "bg-success/15 text-success hover:bg-success/25"
                    : "bg-surface-high text-on-surface-variant hover:bg-surface-highest"
                }`}
                aria-label={product.is_visible ? "Hide product" : "Show product"}
              >
                {product.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="w-8 h-8 rounded-md bg-surface-high flex items-center justify-center text-on-surface-variant hover:text-accent hover:bg-accent/10 transition-colors"
                  aria-label="Edit product"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="w-8 h-8 rounded-md bg-surface-high flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                  aria-label="Delete product"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
