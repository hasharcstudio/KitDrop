export default function ScrollingTicker() {
  const items = [
    "FREE SHIPPING OVER ৳80",
    "⚡ AUTHENTIC KITS",
    "200+ GLOBAL CLUBS",
    "WORLDWIDE DELIVERY",
    "NEW SEASON DROPS",
    "⚡ PLAYER EDITIONS",
    "24/7 SUPPORT",
    "SECURE CHECKOUT",
  ];

  return (
    <div className="bg-accent text-on-accent overflow-hidden py-2.5 sm:py-3 relative">
      <div className="animate-ticker">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="font-headline font-bold uppercase text-xs sm:text-sm tracking-wider whitespace-nowrap mx-6 sm:mx-8 flex-shrink-0"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
