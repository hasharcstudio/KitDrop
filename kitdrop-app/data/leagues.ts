export interface League {
  id: string;
  name: string;
  logo: string;
  country: string;
  color: string;
  tier: "big-five" | "emerging" | "south-america";
  famousClubs: {
    name: string;
    kitHighlight: string;
  }[];
  description: string;
}

export const leagues: League[] = [
  // ===== THE BIG FIVE =====
  {
    id: "premier-league",
    name: "Premier League",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtIzn5A16VXUD0VeFkpYoDow1fyiOAy2HYyUZCxbX7N99_XNOvaZILLHwL-elXY8HE3Z6w9BcmSlyGTz8gExzeNIH9grMhAijRucU1VDHnLBOh8FfxaQbcNlCeA8l-Uuw30lYiUy_1exlvAj_hgfn619OgA4dqkTVtAM864qPME0KJE9ho9JOIN-CnejuSflYQT2jr4Jgfdk2TqbiAhhRFcHsqSD6ivcOJdFcldnrGSt-WZJzw82799GLMi39Wphxi_gL9F00xE9U",
    country: "England",
    color: "#3d195b",
    tier: "big-five",
    description: "The most-watched football league in the world. Home to iconic clubs and legendary rivalries.",
    famousClubs: [
      { name: "Manchester City", kitHighlight: "PUMA Home kit with sky blue canvas and digital-pulse navy details" },
      { name: "Liverpool", kitHighlight: "10-year Adidas return with a sea-green third kit" },
      { name: "Manchester United", kitHighlight: "Black/blue/yellow away kit inspired by the iconic 1993/95 design" },
      { name: "Arsenal", kitHighlight: "Classic colors home with a lightning bolt away design" },
      { name: "Chelsea", kitHighlight: "'Return of the Rebel' and architecture-inspired designs" },
      { name: "Tottenham", kitHighlight: "Blue away shorts and classic white home strips" },
    ],
  },
  {
    id: "la-liga",
    name: "La Liga",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdHAH4S0b_CtqTdZgPL97Ytqwg4AQ6qUFkquG-H6Sg4QTQzKrNx-HiEVfy_Kez-dyQzij-CO-M5bzW8GJ7GPTnvwQWnbyz1kAOfCBGLtINZolrn4vNcPzsoztQpMEIt9ayQ6SEdviuH0X5TG6yPWLWUoim2Q4rL2U6-GwImM0iPa3ztUbjYIKEwQYP0fRHYbARzUJ0EAcy-xtAW42GQwlV_OzUPMk_UeIAGqsCOB0soyFf46WcZV6m_FuUZlobxPnxtx3812OR7W0",
    country: "Spain",
    color: "#ee8707",
    tier: "big-five",
    description: "Spain's elite division. The stage for El Clásico and the world's most technical football.",
    famousClubs: [
      { name: "Real Madrid", kitHighlight: "Bernabéu-inspired home white and orange authentic away kits" },
      { name: "FC Barcelona", kitHighlight: "New Nike Home, Away, and Third collections" },
      { name: "Atlético Madrid", kitHighlight: "Red-and-white home and tradition-breaking away designs" },
      { name: "Sevilla", kitHighlight: "Castore kits including the official home and away strips" },
    ],
  },
  {
    id: "bundesliga",
    name: "Bundesliga",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQ4sOKM-FtqGsj83M4exYsdXGI2flLIJcR0QO5VMnlsv74IGqUscQiKuXVIRBIOx5kvbZfe9v2MZ6adjfJh14UCkdkwDWQoDrdpPO_ioBlwhuU1dG7nQ_I8l-IjcUYD-OGxE8ElS8OfdctchSIb6iNqBGBenlysat-vTnTkGZEhc-lT2z1tn19FH_EEc-YrvgItJAbccENAso2ev2qdTE_aghyn2smp1yYwDyiR-BYQydOu80y83e9_ykmGtATudr6Tq3VXfhiCQM",
    country: "Germany",
    color: "#d20515",
    tier: "big-five",
    description: "Germany's top flight. Known for intense atmospheres, youth development, and electrifying football.",
    famousClubs: [
      { name: "Bayern Munich", kitHighlight: "White/grey away shirt with coral accents and anniversary home kits" },
      { name: "Borussia Dortmund", kitHighlight: "PUMA home and authentic away kits in iconic yellow and black" },
      { name: "Bayer Leverkusen", kitHighlight: "Castore home, away, and third collections" },
      { name: "RB Leipzig", kitHighlight: "High-intensity 'glow in the dark' away designs" },
    ],
  },
  {
    id: "serie-a",
    name: "Serie A",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZwtkaXlaRbgDOe34MfpGsk36V54jRbQqNa68xBOASqs3sS4qOJnD10e1M3ST0fzl_lqvandR01ahNlsNAb_geTFrfux_hapQPTyG1wiGx08Ftn6Ze23cIPKShQIA6uzmZZMHk9zRf9BEn6cGwzJpNncuuQlUQqjj94-CzyUkLIVkhAIX0cuPEVDT07tlOd78m41D14OtLLg9eMj5MTfSKZUIuinohmLmOfPq3iHFFiGoLOMdmxbnEe5sI6_3hRbQpqX6NyHUhhdI",
    country: "Italy",
    color: "#024494",
    tier: "big-five",
    description: "Italian football's finest. The cradle of tactical mastery and timeless jersey design.",
    famousClubs: [
      { name: "Juventus", kitHighlight: "Turquoise water-drop away pattern and iconic black-and-white home stripes" },
      { name: "AC Milan", kitHighlight: "Fiery pattern stripes and new red/white badge" },
      { name: "Inter Milan", kitHighlight: "Snowflake-patterned away kit celebrating the 2026 Winter Olympics" },
      { name: "AS Roma", kitHighlight: "Adidas red/yellow heritage strips" },
      { name: "Napoli", kitHighlight: "Scudetto-defending light blue home kits" },
    ],
  },
  {
    id: "ligue-1",
    name: "Ligue 1",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuD85MZp7rryRNtndBjY1301RTBUAY4QUVX63vSK-v15Dw5fKSiGM5Jvlab9jYOZsd9DgwdoDCMtr3djDO2fJR_YbeamkpSfV_0MENWR9Sy_LisbpqKcHcm4Gi2Mkr2y5mIKJg4qZ9t89PZ8BSVbPNC8BzK-9d80kUcm4qQyW_JFXU_R_zRbyNZo0VvWoMewKKo1jeaJU0fz9DLoVMkY3JQPzc-L9l1ZiquBwyWyHn4m0an1hV_y-BcmgNHq5fUkZ4CvmRDTlez9nxw",
    country: "France",
    color: "#091c3e",
    tier: "big-five",
    description: "France's premier league. Home to PSG's galactic roster and Ligue 1's rising stars.",
    famousClubs: [
      { name: "Paris Saint-Germain", kitHighlight: "Jordan 'Night Edition' and Nike architectural Hechter kits" },
      { name: "Marseille", kitHighlight: "New 2025/26 home and away Adidas designs" },
      { name: "Lyon", kitHighlight: "Home and away match kits" },
      { name: "AS Monaco", kitHighlight: "Official 2025/26 kit range" },
    ],
  },

  // ===== EMERGING & HIGH-DEMAND =====
  {
    id: "mls",
    name: "MLS",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtIzn5A16VXUD0VeFkpYoDow1fyiOAy2HYyUZCxbX7N99_XNOvaZILLHwL-elXY8HE3Z6w9BcmSlyGTz8gExzeNIH9grMhAijRucU1VDHnLBOh8FfxaQbcNlCeA8l-Uuw30lYiUy_1exlvAj_hgfn619OgA4dqkTVtAM864qPME0KJE9ho9JOIN-CnejuSflYQT2jr4Jgfdk2TqbiAhhRFcHsqSD6ivcOJdFcldnrGSt-WZJzw82799GLMi39Wphxi_gL9F00xE9U",
    country: "USA / Canada",
    color: "#1a1a2e",
    tier: "emerging",
    description: "North America's top league. Superstar signings and the world's fastest-growing football market.",
    famousClubs: [
      { name: "Inter Miami", kitHighlight: "Black 'Presagio' away kit and pink 'Euforia' home kit" },
      { name: "LA Galaxy", kitHighlight: "'The LA Kit' based on the city flag" },
      { name: "LAFC", kitHighlight: "Black and Gold Art Deco design" },
      { name: "New York City FC", kitHighlight: "'All Nations Kit' in blue, white, and orange" },
    ],
  },
  {
    id: "saudi-pro-league",
    name: "Saudi Pro League",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdHAH4S0b_CtqTdZgPL97Ytqwg4AQ6qUFkquG-H6Sg4QTQzKrNx-HiEVfy_Kez-dyQzij-CO-M5bzW8GJ7GPTnvwQWnbyz1kAOfCBGLtINZolrn4vNcPzsoztQpMEIt9ayQ6SEdviuH0X5TG6yPWLWUoim2Q4rL2U6-GwImM0iPa3ztUbjYIKEwQYP0fRHYbARzUJ0EAcy-xtAW42GQwlV_OzUPMk_UeIAGqsCOB0soyFf46WcZV6m_FuUZlobxPnxtx3812OR7W0",
    country: "Saudi Arabia",
    color: "#006c35",
    tier: "emerging",
    description: "The world's most ambitious league. Home to Ronaldo, Benzema, and football's new frontier.",
    famousClubs: [
      { name: "Al-Nassr", kitHighlight: "Golden 'timeless' home kit and moon-inspired away" },
      { name: "Al-Hilal", kitHighlight: "Royal blue home and crescent moon-inspired away" },
      { name: "Al-Ittihad", kitHighlight: "Jeddah-heritage architectural patterns" },
      { name: "Al-Ahli", kitHighlight: "Green palm-leaf tribute jerseys" },
    ],
  },
  {
    id: "liga-portugal",
    name: "Liga Portugal",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQ4sOKM-FtqGsj83M4exYsdXGI2flLIJcR0QO5VMnlsv74IGqUscQiKuXVIRBIOx5kvbZfe9v2MZ6adjfJh14UCkdkwDWQoDrdpPO_ioBlwhuU1dG7nQ_I8l-IjcUYD-OGxE8ElS8OfdctchSIb6iNqBGBenlysat-vTnTkGZEhc-lT2z1tn19FH_EEc-YrvgItJAbccENAso2ev2qdTE_aghyn2smp1yYwDyiR-BYQydOu80y83e9_ykmGtATudr6Tq3VXfhiCQM",
    country: "Portugal",
    color: "#003399",
    tier: "emerging",
    description: "Portugal's top flight. The talent factory that shaped Ronaldo, Bernardo Silva, and more.",
    famousClubs: [
      { name: "SL Benfica", kitHighlight: "Historical 2014-homage home kit and beige/goal-net away" },
      { name: "FC Porto", kitHighlight: "10-year New Balance pink camellia away and classic blue/white home" },
      { name: "Sporting CP", kitHighlight: "Black-and-green Nike away pattern" },
    ],
  },
  {
    id: "eredivisie",
    name: "Eredivisie",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZwtkaXlaRbgDOe34MfpGsk36V54jRbQqNa68xBOASqs3sS4qOJnD10e1M3ST0fzl_lqvandR01ahNlsNAb_geTFrfux_hapQPTyG1wiGx08Ftn6Ze23cIPKShQIA6uzmZZMHk9zRf9BEn6cGwzJpNncuuQlUQqjj94-CzyUkLIVkhAIX0cuPEVDT07tlOd78m41D14OtLLg9eMj5MTfSKZUIuinohmLmOfPq3iHFFiGoLOMdmxbnEe5sI6_3hRbQpqX6NyHUhhdI",
    country: "Netherlands",
    color: "#e60000",
    tier: "emerging",
    description: "The birthplace of Total Football. Ajax, PSV, and Feyenoord lead the Dutch revolution.",
    famousClubs: [
      { name: "Ajax", kitHighlight: "White-red-white home with Amsterdam 750-year tribute" },
      { name: "PSV Eindhoven", kitHighlight: "Brabant checkered away and red/white striped home" },
      { name: "Feyenoord", kitHighlight: "Castore home with gold accents and bold graphic away kits" },
    ],
  },
  {
    id: "super-lig",
    name: "Süper Lig",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuD85MZp7rryRNtndBjY1301RTBUAY4QUVX63vSK-v15Dw5fKSiGM5Jvlab9jYOZsd9DgwdoDCMtr3djDO2fJR_YbeamkpSfV_0MENWR9Sy_LisbpqKcHcm4Gi2Mkr2y5mIKJg4qZ9t89PZ8BSVbPNC8BzK-9d80kUcm4qQyW_JFXU_R_zRbyNZo0VvWoMewKKo1jeaJU0fz9DLoVMkY3JQPzc-L9l1ZiquBwyWyHn4m0an1hV_y-BcmgNHq5fUkZ4CvmRDTlez9nxw",
    country: "Türkiye",
    color: "#e30a17",
    tier: "emerging",
    description: "Türkiye's passionate top division. The roaring cauldrons of Istanbul await.",
    famousClubs: [
      { name: "Galatasaray", kitHighlight: "Half-and-half orange/red home and 2000 UEFA Cup tribute white away" },
      { name: "Fenerbahçe", kitHighlight: "Official 2025/26 home and away collection" },
      { name: "Beşiktaş", kitHighlight: "New season kit range" },
    ],
  },

  // ===== SOUTH AMERICAN GIANTS =====
  {
    id: "brasileirao",
    name: "Brasileirão",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQ4sOKM-FtqGsj83M4exYsdXGI2flLIJcR0QO5VMnlsv74IGqUscQiKuXVIRBIOx5kvbZfe9v2MZ6adjfJh14UCkdkwDWQoDrdpPO_ioBlwhuU1dG7nQ_I8l-IjcUYD-OGxE8ElS8OfdctchSIb6iNqBGBenlysat-vTnTkGZEhc-lT2z1tn19FH_EEc-YrvgItJAbccENAso2ev2qdTE_aghyn2smp1yYwDyiR-BYQydOu80y83e9_ykmGtATudr6Tq3VXfhiCQM",
    country: "Brazil",
    color: "#009c3b",
    tier: "south-america",
    description: "Brazilian football's top tier. Samba, skill, and the most passionate fans on Earth.",
    famousClubs: [
      { name: "Palmeiras", kitHighlight: "Italian heritage green home and white away with tricolor details" },
      { name: "Santos", kitHighlight: "Classic white home with Pelé-tribute '9:10' launch time" },
      { name: "São Paulo", kitHighlight: "Official 2025/26 Adidas range" },
      { name: "Flamengo", kitHighlight: "Off-white third kits" },
    ],
  },
  {
    id: "primera-division-arg",
    name: "Primera División",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdHAH4S0b_CtqTdZgPL97Ytqwg4AQ6qUFkquG-H6Sg4QTQzKrNx-HiEVfy_Kez-dyQzij-CO-M5bzW8GJ7GPTnvwQWnbyz1kAOfCBGLtINZolrn4vNcPzsoztQpMEIt9ayQ6SEdviuH0X5TG6yPWLWUoim2Q4rL2U6-GwImM0iPa3ztUbjYIKEwQYP0fRHYbARzUJ0EAcy-xtAW42GQwlV_OzUPMk_UeIAGqsCOB0soyFf46WcZV6m_FuUZlobxPnxtx3812OR7W0",
    country: "Argentina",
    color: "#75aadb",
    tier: "south-america",
    description: "Argentina's elite division. Home to the legendary Superclásico — Boca vs. River.",
    famousClubs: [
      { name: "Boca Juniors", kitHighlight: "Darker blue anniversary home and gold 120th-anniversary away" },
      { name: "River Plate", kitHighlight: "Black/red striped away inspired by the 1975 'balloon' incident" },
    ],
  },
];

// Helper to get leagues grouped by tier
export function getLeaguesByTier() {
  return {
    "big-five": leagues.filter((l) => l.tier === "big-five"),
    emerging: leagues.filter((l) => l.tier === "emerging"),
    "south-america": leagues.filter((l) => l.tier === "south-america"),
  };
}
