export interface Club {
  id: string;
  name: string;
  leagueId: string;
  country: string;
  badge: string;
  colors: string[];
}

export const clubs: Club[] = [
  {
    id: "man-utd",
    name: "Manchester United",
    leagueId: "premier-league",
    country: "England",
    badge: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3Uuiu4UT_AjiRaJ0AsafyP2AeLW-uDJNnEKPdoRe0ft2CywRDcERaqBuUCYiB3ADCeVl-mCTa6BMwirR2lAoBWtXVmXeNjglmEBNYKbuK5OK9ewlqxqb1l7zRMGPSNxxYjgz6q5b9NHLPmM4bTj06cpDsLxpJ1sUxxnb1JNm8Wyc-slosvb6MSEmshlZGVfLMiNtte-dr4Zt-a1udlGm6I4kLbEYi66evnz2yb9JBDIiqblhUK13-Hx_7gKOVcjpVT9O4eviyot4",
    colors: ["#da291c", "#ffffff", "#000000"],
  },
  {
    id: "real-madrid",
    name: "Real Madrid",
    leagueId: "la-liga",
    country: "Spain",
    badge: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZ1B10wvQNjkhFbABaJ76X9Bq5dn38wcyKRHp9cgXRmKgrBAi-xvvwoiKlBI2uRktLiitrC_3AjDFPba8q_GnSiMX5sXFHrpr-pmF0GUxDzTQDY0zHZ-DBulntnrZzo2AuGA2Alcnzu_DKp90n_86FiiWOGQqVRsV7QQziTHDTp75uLqtz1a63AoZWX0zyFejYnFbbE_DbHQ-r7fw_UzCmZR6km5RUw4753QX6qsAlvkd9ywQ-1k6PLQTaO5y44FhjXN-GrCWMAoc",
    colors: ["#ffffff", "#00529f", "#febe10"],
  },
  {
    id: "inter-milan",
    name: "Inter Milan",
    leagueId: "serie-a",
    country: "Italy",
    badge: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2LMUAUE_ByWulJ1GdJ4vUVbURTBpIkDR69c7xp4AceP9fC3uiqSRf5JcpkP4aT0m-bzRiZHEeLLZgVkklXxl1Wy7WQxmpeFoSA5zZPwA1bqZeVyGmp5ytXzOzeAV34ecDhBLh7CAZll9QMUZEge2ntclZ7CIPJu1bJlWUdLYH5Hv8zfCNZfDA5DoNV0aSU4Yz8hae96yMH-M2rasSa_iKSuJ2AJyzQI8bmlzW_KGTRb6ipShM6mJ3riNGaqkDLEV4oWrvuky_WcY",
    colors: ["#005eb8", "#000000", "#ffffff"],
  },
  {
    id: "dortmund",
    name: "Borussia Dortmund",
    leagueId: "bundesliga",
    country: "Germany",
    badge: "https://lh3.googleusercontent.com/aida-public/AB6AXuABuvqX0uVN29HCmYukCA8M766HwHxOwd96RSUjhh4_K1wmhrbKt_K4R2oAiY0TvNH6dOucXXeH4xROrNrYA6wE1jkA7t_GhWjqjb96_z4XovIe3B0HhDwcSgvqn2nfm1JBU-9TtEnURM3YBvL4P29gDXYzBB5FOBh80mhnW1e2JNDgVbsYnrLiPg-A3TS8q2AfH00j3AV0ShvQicfEVFFGM8kEb925iTnSCoUPj8uMCMeTks6rVSvKCjD9MS48P7g-lcf8efwkGng",
    colors: ["#fde100", "#000000", "#ffffff"],
  },
  {
    id: "celtic",
    name: "Celtic FC",
    leagueId: "premier-league", // In Scotland, but grouped for demo
    country: "Scotland",
    badge: "https://lh3.googleusercontent.com/aida-public/AB6AXuDB5PyF3_9jv4LJOFST-KqVo5Z7gbeMjQKt_yjO91JMnYR-RiUAe21iRMUkwxBOlHFvirZXOA7zV5FiLh6cyfMgMq_duq0ihPUh7n_PnCzYaEi_cv_270nt57kJrnqDab_HD_rDPDXx_Ek_MDqmoC962L_hJargFbk5KcOnpgTi_QM1OMM72gyIvhjoQEIir_w6L2P_A8zo4bzTEq6m-6E7BCDFvQCajXOsm6OHX95DouRsW-ZIVvlUd6YiI_x3clKRoTEF4pf8LeA",
    colors: ["#005c2b", "#ffffff", "#000000"],
  },
  {
    id: "fiorentina",
    name: "ACF Fiorentina",
    leagueId: "serie-a",
    country: "Italy",
    badge: "https://lh3.googleusercontent.com/aida-public/AB6AXuCddGXutFcn_PUvvcvJCa1NtiDEJ4jYw15uTUywSvBxCSDtiCfGwf0Afz59h0ixkJAI905DKugZ-mzWXZa1Zc3nZU2B7aXZKqE5K5g7C5nAnLFNhKDTXoupF_V6WtRHLJjexIuYDRSdFfJBcyEU1xyolBwU_6LRcVUNKy1pIUF1YGtv6kCNbvErtGSeYKTpUQfpxLB1s8NUgJBKuLT1758AZ49IbUcnGJHHG0taOPDdJnDqTiywmleG6OLQ2KOYxR-TO0a1YGV6X78",
    colors: ["#482e92", "#ffffff", "#ed1c24"],
  },
  {
    id: "man-city",
    name: "Manchester City",
    leagueId: "premier-league",
    country: "England",
    badge: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgwuV13PVNurG9sxasmcpvE29e5VMtIVuMp8LLhRWLw8I_95mfhxpvKCJeA_CujJ9dkGGGg6WoO3DlNEyoE0KR-9aMhbrapcco5xtk6c0cD9ZiYmoWvjKnWgAU8-0mtFACrmlTG4iWhTXnLJ0WEbpSSNZn2dtF2xYAzm4awhCmFPmMaphP_yN_D4tua2k9-Nb-UQ5_HAz7bticfyTgzFC8Ya4ken4X6GGOC-GtzfA2Uwn3iV5xamXaCSmmCY7dI_xxkID0nLkYN9Y",
    colors: ["#6cabdd", "#1c2c5b", "#ffffff"],
  },
  {
    id: "fc-barcelona",
    name: "FC Barcelona",
    leagueId: "la-liga",
    country: "Spain",
    badge: "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/200px-FC_Barcelona_%28crest%29.svg.png",
    colors: ["#004d98", "#a50044", "#edbb00"],
  },
];
