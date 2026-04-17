import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Package, Settings, LogOut, ChevronRight } from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase";
import { EditableProfile, AccountSettings, OrderHistoryList } from "@/components/account/AccountClientSections";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const activeTab = resolvedParams.tab || "orders";
  const supabase = getSupabaseAdmin();

  // Fetch true user profile from Supabase
  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("email", session.user.email)
    .single();

  // Fetch actual orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_email", session.user.email)
    .order("created_at", { ascending: false });

  // Map settings
  const hasProfile = !!customer;

  return (
    <div className="min-h-screen bg-background pt-8 sm:pt-12 pb-24">
      <div className="w-full max-w-5xl mx-auto px-6 sm:px-12">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-surface border border-border p-6 rounded-lg relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-surface-high flex items-center justify-center overflow-hidden border-2 border-accent">
                  {session.user?.image ? (
                    <Image src={session.user.image} alt="Avatar" width={64} height={64} className="object-cover" />
                  ) : (
                    <span className="text-xl font-black font-headline text-accent">
                      {(customer?.full_name || session.user?.name || "U").charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="font-headline font-black uppercase tracking-tight text-lg leading-tight truncate">
                    {customer?.full_name || session.user?.name || "Player"}
                  </h2>
                  <p className="text-on-surface-variant text-xs mt-1 saturate-0 opacity-80 truncate max-w-[150px]">
                    {session.user?.email}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                {[
                  { id: "orders", icon: Package, label: "Order History" },
                  { id: "addresses", icon: MapPin, label: "Address & Profile" },
                  { id: "settings", icon: Settings, label: "Settings" },
                ].map((item) => (
                  <Link
                    key={item.id}
                    href={`/account?tab=${item.id}`}
                    className={`flex items-center justify-between w-full p-3 rounded transition-colors text-sm font-headline font-bold uppercase tracking-tight ${
                      activeTab === item.id ? "bg-surface-high text-accent" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-high/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={16} />
                      {item.label}
                    </div>
                    <ChevronRight size={14} className={activeTab === item.id ? "min-w-3" : "hidden"} />
                  </Link>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <Link
                  href="/api/auth/signout"
                  className="flex items-center gap-3 w-full p-3 rounded transition-colors text-sm font-headline font-bold uppercase tracking-tight text-error hover:bg-error/10"
                >
                  <LogOut size={16} />
                  Sign Out
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {activeTab === "orders" && (
              <>
                <h1 className="text-3xl sm:text-4xl font-black uppercase font-headline tracking-tight mb-8">
                  Order History
                </h1>

                {(!orders || orders.length === 0) ? (
                  <div className="mt-12 p-8 border border-dashed border-border flex flex-col items-center justify-center text-center rounded-lg bg-surface/50">
                     <div className="w-12 h-12 bg-surface-high text-accent flex items-center justify-center rounded-full mb-4">
                       <Package size={24} />
                     </div>
                     <h3 className="font-headline font-black text-xl uppercase tracking-tight mb-2">Build Your Arsenal</h3>
                     <p className="text-sm text-on-surface-variant max-w-sm mx-auto mb-6">You do not have any past or pending deliveries yet. Discover the newest 25/26 season drops and build your archive.</p>
                     <Link href="/shop" className="bg-accent text-on-accent px-8 py-3 font-headline font-bold uppercase tracking-tight hover:bg-accent-dim transition-colors active:scale-95">
                       Explore Kits
                     </Link>
                  </div>
                ) : (
                  <OrderHistoryList orders={orders} />
                )}
              </>
            )}

            {activeTab === "addresses" && (
              <>
                <div className="flex justify-between items-end mb-8">
                  <h1 className="text-2xl sm:text-3xl font-black uppercase font-headline tracking-tight">
                    Profile Details
                  </h1>
                </div>

                <div className="bg-surface border border-border rounded-lg p-6 space-y-6">
                  <EditableProfile customer={customer} hasProfile={hasProfile} />
                </div>
              </>
            )}

            {activeTab === "settings" && (
              <>
                <h1 className="text-2xl sm:text-3xl font-black uppercase font-headline tracking-tight mb-8">
                  Account Preferences
                </h1>
                <AccountSettings customer={customer} />
              </>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
