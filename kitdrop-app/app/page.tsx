import HeroSection from "@/components/home/HeroSection";
import ScrollingTicker from "@/components/home/ScrollingTicker";
import LeagueSelector from "@/components/home/LeagueSelector";
import FeaturedDrops from "@/components/home/FeaturedDrops";
import EquipmentSpotlight from "@/components/home/EquipmentSpotlight";
import ClubSpotlight from "@/components/home/ClubSpotlight";
import BrowseByNation from "@/components/home/BrowseByNation";
import StatsTrustBar from "@/components/home/StatsTrustBar";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ScrollingTicker />
      <LeagueSelector />
      <FeaturedDrops />
      <EquipmentSpotlight />
      <ClubSpotlight />
      <BrowseByNation />
      <StatsTrustBar />
    </>
  );
}
