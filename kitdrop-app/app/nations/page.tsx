import BrowseByNation from "@/components/home/BrowseByNation";

export default function NationsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-surface py-8 sm:py-10 lg:py-14">
        <div className="w-full max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-10 sm:h-14 bg-accent" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase font-headline tracking-tight">
              Browse by Nation
            </h1>
          </div>
          <p className="text-on-surface-variant text-xs sm:text-sm tracking-[0.15em] uppercase font-headline mt-2 ml-[18px]">
            The Global Archive · 40+ Countries
          </p>
        </div>
      </div>

      <BrowseByNation />
    </div>
  );
}
