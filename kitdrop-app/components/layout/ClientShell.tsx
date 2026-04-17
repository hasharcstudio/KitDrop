"use client";
import { useState } from "react";
import Navbar from "./Navbar";
import MobileBottomNav from "./MobileBottomNav";
import PitchGrainOverlay from "../ui/PitchGrainOverlay";
import CartDrawer from "../cart/CartDrawer";
import SearchOverlay from "../search/SearchOverlay";
import Footer from "./Footer";
import SizeGuideModal from "../ui/SizeGuideModal";
import QuickViewModal from "../ui/QuickViewModal";

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <PitchGrainOverlay />
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <main className="pt-14 sm:pt-16 pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
      <CartDrawer />
      <SizeGuideModal />
      <QuickViewModal />
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
