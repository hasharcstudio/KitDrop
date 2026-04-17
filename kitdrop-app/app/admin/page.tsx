"use client";
import { useEffect, useState } from "react";
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import AdminCard from "@/components/admin/ui/AdminCard";
import StatusBadge from "@/components/admin/ui/StatusBadge";
import type { Product, Order, ProductVariant } from "@/lib/database.types";
import { formatPrice } from "@/lib/currency";

export default function AdminDashboard() {
  const [products, setProducts] = useState<(Product & { product_variants: ProductVariant[] })[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch("/api/products?all=true"),
          fetch("/api/orders"),
        ]);
        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();
        setProducts(Array.isArray(productsData) ? productsData : []);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;

  // Top sellers (from order items)
  const itemCounts: Record<string, { name: string; image: string; count: number }> = {};
  orders.forEach((order) => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item) => {
        const key = item.product_id || item.name;
        if (!itemCounts[key]) {
          itemCounts[key] = { name: item.name, image: item.image, count: 0 };
        }
        itemCounts[key].count += item.quantity;
      });
    }
  });
  const topSellers = Object.values(itemCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 7 Days Revenue chart (real data)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  
  const revenueData = last7Days.map(date => {
    // Format date specifically as YYYY-MM-DD local time just for string matching start
    const offset = date.getTimezoneOffset()
    const localDate = new Date(date.getTime() - (offset*60*1000))
    const dayStr = localDate.toISOString().split('T')[0]
    
    const dayTotal = orders
      .filter(o => o.created_at.startsWith(dayStr))
      .reduce((sum, o) => sum + (o.total || 0), 0);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      total: dayTotal
    };
  });
  
  const maxRevenue = Math.max(...revenueData.map(d => d.total), 1000); // provide a baseline flat height if empty

  // Low stock alerts
  const lowStockProducts = products.filter((p) =>
    p.product_variants?.some((v) => v.stock_quantity > 0 && v.stock_quantity < 5)
  );

  // Recent orders
  const recentOrders = orders.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase font-headline tracking-tight">
          Command Center
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Real-time overview of your store performance
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminCard
          title="Total Revenue"
          value={formatPrice(totalRevenue)}
          icon={DollarSign}
          accent
          trend={{ value: "12.5%", positive: true }}
        />
        <AdminCard
          title="Total Orders"
          value={totalOrders}
          icon={ShoppingCart}
          trend={{ value: "8.2%", positive: true }}
        />
        <AdminCard
          title="Avg Order Value"
          value={formatPrice(avgOrderValue)}
          icon={TrendingUp}
          trend={{ value: "3.1%", positive: true }}
        />
        <AdminCard
          title="Products Listed"
          value={products.length}
          icon={Package}
          subtitle={`${pendingOrders} pending orders`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline font-bold uppercase text-sm tracking-tight">
              Revenue Overview
            </h2>
            <span className="text-[10px] text-on-surface-variant tracking-widest uppercase font-headline">
              Last 7 Days
            </span>
          </div>
          <div className="flex items-end gap-2 h-40">
            {revenueData.map(
              (data, i) => {
                const heightPercentage = Math.max((data.total / maxRevenue) * 100, 5); // 5% minimum height for visibility
                return (
                  <div
                    key={`${data.day}-${i}`}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div
                      className="w-full bg-accent/20 hover:bg-accent/40 transition-colors rounded-t-sm relative group cursor-pointer"
                      style={{ height: `${heightPercentage}%` }}
                      title={formatPrice(data.total)}
                    >
                      <div
                        className="absolute bottom-0 w-full bg-accent rounded-t-sm transition-all"
                        style={{ height: "100%" }}
                      />
                    </div>
                    <span className="text-[10px] text-on-surface-variant font-headline">
                      {data.day}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-orange-400" />
            <h2 className="font-headline font-bold uppercase text-sm tracking-tight">
              Low Stock Alerts
            </h2>
          </div>
          {lowStockProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-on-surface-variant text-xs font-headline uppercase tracking-widest">
                All stock levels healthy
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.slice(0, 5).map((p) => {
                const lowVariant = p.product_variants?.find(
                  (v) => v.stock_quantity < 5 && v.stock_quantity > 0
                );
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="text-sm font-headline font-bold tracking-tight line-clamp-1">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-on-surface-variant">
                        {lowVariant?.size} · {lowVariant?.type}
                      </p>
                    </div>
                    <StatusBadge status="Low Stock" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline font-bold uppercase text-sm tracking-tight">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-accent text-xs font-headline font-bold uppercase tracking-tight flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-center py-6 text-on-surface-variant text-xs font-headline uppercase tracking-widest">
              No orders yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-headline font-bold tracking-tight">
                      {order.order_number}
                    </p>
                    <p className="text-[10px] text-on-surface-variant">
                      {order.customer_name} · {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-headline font-bold">
                      {formatPrice(order.total || 0)}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Sellers */}
        <div className="bg-surface border border-border rounded-lg p-5">
          <h2 className="font-headline font-bold uppercase text-sm tracking-tight mb-4">
            Top Sellers
          </h2>
          {topSellers.length === 0 ? (
            <p className="text-center py-6 text-on-surface-variant text-xs font-headline uppercase tracking-widest">
              No sales data yet
            </p>
          ) : (
            <div className="space-y-3">
              {topSellers.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-accent text-xs font-black font-headline w-5">
                      #{i + 1}
                    </span>
                    <p className="text-sm font-headline font-bold tracking-tight line-clamp-1">
                      {item.name}
                    </p>
                  </div>
                  <span className="text-xs text-on-surface-variant font-headline font-bold">
                    {item.count} sold
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
