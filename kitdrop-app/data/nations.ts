export interface Nation {
  id: string;
  name: string;
  kitCount: number;
  flagImage: string;
  bgImage: string;
  featuredClubs: string[];
  kitHighlight?: string;
  isLive?: boolean;
  isLimited?: boolean;
}

export const nations: Nation[] = [
  // ===== USER PRIORITY: Bangladesh First =====
  {
    id: "bangladesh",
    name: "Bangladesh",
    kitCount: 8,
    flagImage: "https://flagcdn.com/w320/bd.png",
    bgImage: "https://images.unsplash.com/photo-1617817346142-a44c4d8a9d36?w=800&q=80",
    featuredClubs: ["BFF", "ABH", "MSC"],
    kitHighlight: "Official national team kits and local club collections",
    isLive: true,
  },

  // ===== South America =====
  {
    id: "brazil",
    name: "Brazil",
    kitCount: 28,
    flagImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjK4Su-_1ZcwOivqvlemdmGlL1AxxBHmH7VT-P6mAWsyUu9yQWqpg1WE6O5f4VbblDODAD6g0rRSWA_VKzruZZpXcL6qVd-5XEOWXOXMWicNlZpPiaBO3siFbiZOKSJPlAq3bPTRCtFtOtWW6ufOL7095UuqUdhKkU1Up-Y4JJ87TuYuWAT1sAE740HScGSbX6Mo9mMZtCpQX6Bq_0jIJVREI4Dk5vcc8R4oRkayNhOOsAziy_azcNoue4RgU4xrXitPVP_jv69kU",
    bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTNdk7JY-sG9E-bGCEYmysffMc2_e3yms1UJWivFiZF7Pca3Fr3cRwxC2AZNqOjU9dXJiiHjUpG814qYWfLq3B07q5xgAephuKdJVqBmtXUd8ztKIRHY1qnwa9cjLpzyWQvUnsYruUf3IEC44K47vO-0gqjdPW6h4FMLhCZC1xN6D0hRv7JF6kYHLpsVKHWsAVxroI0lBwzQwhCgjY_3vFU-f2uiWsT82_i2jVJSsg_zQ9pdj8HcPmJij1MsIRlRVuQdOGJAU1fps",
    featuredClubs: ["FLA", "PAL", "SAN"],
    kitHighlight: "Yellow 'Canary' home and Jordan Brand blue 'Poison Dart Frog' away",
    isLive: true,
  },
  {
    id: "argentina",
    name: "Argentina",
    kitCount: 18,
    flagImage: "https://flagcdn.com/w320/ar.png",
    bgImage: "https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?w=800&q=80",
    featuredClubs: ["BOC", "RIV", "RAC"],
    kitHighlight: "Three-colored blue fading home and 'Fileteado Porteño' black away",
    isLive: true,
  },

  // ===== Europe =====
  {
    id: "france",
    name: "France",
    kitCount: 22,
    flagImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOGyy2-rVJ1H44CvdfwcXtbVpKjko0UkMkWGqOgmkInxpNsaed-idSlmVzh6CiUCF9lL2FByyaFVuwLD5K_wf1YSyS3W3nF8cyjqxeLNRYlo3_3ovOGh2B-vXiJ0creD9FX0nCb3P_RQHRXmhmydgi2297zeVMbcENWbPyjIaoY-uLxZjInRxbQE8fJJH4tuRcnbgqeR-O_AdUy39PGSzinVgchQXha1HQank0M60vAytry5l7UcJ6deyOU8em8teIj6-6uboq-nQ",
    bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFF3fyZgcS417ScOGj2hPZ2cukWsK1IZJt2c0XNhWlXY-3Lt1XpQ0Aa4QE4w0emUrlx3RMmixrXIyU4Fep5WnbFC90ki-PBptgz092qt4PimBq74evhI6UHTlmHphGw2HdG0GrDGjT95qVnfFPqe8yq37BXo7XYUvUtcgwkfRgBgMRhVjYpvPzIIr3gKnZvrFzkB10UOD9VcIj4TTESwqXJcXcU8vX3ouzcKkAzKaGKMo0DSuKpG2Kcrbi6ssd3OtyFT70n760dW0",
    featuredClubs: ["PSG", "OLY", "MON"],
    kitHighlight: "Statue of Liberty mint green away for 2026 World Cup",
  },
  {
    id: "germany",
    name: "Germany",
    kitCount: 35,
    flagImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKGNEZad_TgNRmg2RDi-i1Thtu3wWmqhAGWqstyDsfdpe3onSSYvxVTAORO4CWS1oLN09hQs5JmsmojB3MS0f4tgpZJWFHSY0v6obav_P3OAfKa_w06mWmWl98OSofQg227Wi2PqgNxSwKoxpB3xF-03gQTAXPxOL_105sg6HAXrSxlU56YAn_7j__ieqjrns7Q_AXMbq1PkK6dD2jBYM-etpK_vfnI319UEMK-Yh8qurn2yDlJfIUKyH6UFnUj_Chth0ppi_Oe60",
    bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXaYl7nEyyVadb0GYf67d64N8uScizF65PTpeEdmF51K8saLIEwPk7aFd9Vr_la9YLnxnfzII2KQGzUpik5lBu7_gJuBEnGZJ0029ihubZy3_hSH037xrT6eJ_vTeI3bPClDSmet3-TfcqJciGYshM0uKUa2lwLQXdAQmo55HYj9JEl715AF0j7E_UWuHABOIyO-gIeP7my8jy_aaKYciOdoN0Cx9gUQSyT86VWr3aJLcsL4WeH02ck_g3CIUkY0lBMTdACWQ5ASA",
    featuredClubs: ["BAY", "BVB", "RBL"],
    kitHighlight: "1994-inspired chevron home and deep blue away for 2026 World Cup",
  },
  {
    id: "england",
    name: "England",
    kitCount: 42,
    flagImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCtnNtbRr_rayH9LFon9mo7KFUs1I4zXvkVkBXTYMpj-Qy52BxAZwfGPbMQzL6lEfBd-l752ieawxdlhpxkEwesp8f1LUcsQGIjbNBpI6xFX7FRC98hPojfUm1w-g_YNRqTBkBmDDusMwxl1hji9krw1eyCYcbxRdzwoWPYYDVRW-T-I8XyqQGE6P4gz6Xle5MQ9c8Zr087zadLiAVR7AtgryE8iYMVXzItMaMZvWTYOGKDMO6Ug2QUbzrqx7QSJHAcEPnWiqrkj0",
    bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAp3x5ovWyeQIt2viZ82BJok-fRI8vL5q-gPBEFq1_90ddMc2FnhmhVGDIgAo1Fd1s2FuNV-a7lqPJ3C4OqdbHg6NP8rc1XmeONrkEwL7TFuB8jrAiv3vqx-zyDhVFhJxlrKFlgJQ6tiYmh1L9oRMpiqPWYYrbYzvQGXdBkL3_7rkoeM4XKADHA_LDZcv8n2N5whucEVw-MSGLJvLaEezVo4XL87lNTFicJL7-amQpe0-YU5OOosIVa97jj_l_hKCCyeLQQPXM6WJc",
    featuredClubs: ["ARS", "LIV", "MCI"],
    kitHighlight: "Heritage red away and classic white home with gold star",
    isLive: true,
  },
  {
    id: "spain",
    name: "Spain",
    kitCount: 38,
    flagImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAE1uBEUJP0rHdiJah_y9gL57T7A60aPbHvRE2jVyM0-re4uJcSrTpUSc1Xtt15bj8DxR6i4uL7QvHaF_yK4xxwCPhEojVBV5IIcGdKMz6k7q-qUfwPm-CX0dLrPT9Koc5NxuvFY-7l1DUOsitwgCXzCLvbhm6Bz_4rSdJuesIhlHpYK1oj8Vwgug_gxcBvdxVyk_GlHOwB48Ebg8QtBBu2hza76TwS0u6DizWmRrsUakDdqYMqouYrYtCSETsuKUyF-6Ysjf6oHWQ",
    bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9mWI50vEq_mNUYZ3XQkrdRRVaoaSWY-7fs7gKD7iPP14yREP6LYF28BvyceY-o1Ksyl-HmPnEuBZAyeOn5zEKMK4gz9pM71HeXM05jBuZ0rSLDZvkyX9MLSkbpKF1yi121d03iWO_vthJlFqPZiwfb5hxApen-mH7yHp93e3J5J_RxetKlekrNK92JH_kenYNvmbTu3VjAZgXeaxpz5a82tdfZBauCy9aZkP_TW6FweZdyhWpmokDaoUgeGR2JHrOTEmEXXCRa7U",
    featuredClubs: ["RMA", "FCB", "ATM"],
    kitHighlight: "Red pinstripe home and 'literary manuscript' cream away",
  },
  {
    id: "italy",
    name: "Italy",
    kitCount: 31,
    flagImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDADKRkRdbA3mWtvYiPbsd910khvoACE12e62a8AunoiAqp9bOuEYj6mzx8WZMsI1e504z2bTK8PzsDSSG4n6Y6x9DRGygVtKKnhcEiPer2Ly1aDRFABb70KaTRrGRNTj40NwXeNDz_yRj8J3uFiYZHgLXvcZVyXqDiGzGWwNaOGnGNeobNX-w4WqlLRkqokHIMOGfgVvdonncGzmT0YvNrg7Hz-Wr3VsYA6QkaQG4StOIX8zcTjeQg7HK4f6rjqKqSWY6Ei6CVNk",
    bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuB84g1rFODNHdpbKj0HiLuxEioFrl8xqw-PJD18EM8Y4bOR0PId6Os94bbSt5yrzkjdtYQ4a2-bqqrKBRp1dyQjstzNqzwe_EgkECkGnrMggNGIBZ9b0YBBcjtlDRUiLnGgzkH1VKjfmnbBO8j0NxcS9JzsAUeb2n8PUY1DqH7ka0rHLLDQImgcrcBJ04eAkY4KpfyDZXXY1eGMDlWvh5lAPbZkrIqg9qS5dvjfZ5gE_sLwhai-I5HHAF5xpX0u-0M2L_Di91qELWI",
    featuredClubs: ["JUV", "INT", "ACM"],
    kitHighlight: "1970s heritage-inspired blue home for 2026 World Cup",
  },
  {
    id: "portugal",
    name: "Portugal",
    kitCount: 20,
    flagImage: "https://flagcdn.com/w320/pt.png",
    bgImage: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",
    featuredClubs: ["BEN", "POR", "SCP"],
    kitHighlight: "Nautical 'waves' and maritime compass themes",
  },

  // ===== Africa =====
  {
    id: "nigeria",
    name: "Nigeria",
    kitCount: 6,
    flagImage: "https://flagcdn.com/w320/ng.png",
    bgImage: "https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=800&q=80",
    featuredClubs: ["NGA"],
    kitHighlight: "Vibrant light green home and white/green 'flame pattern' away",
    isLimited: true,
  },
  {
    id: "morocco",
    name: "Morocco",
    kitCount: 5,
    flagImage: "https://flagcdn.com/w320/ma.png",
    bgImage: "https://images.unsplash.com/photo-1553314443-2ce69b6e6c4b?w=800&q=80",
    featuredClubs: ["MAR"],
    kitHighlight: "Red home with Zellij patterns and geometric tile-inspired away",
  },
  {
    id: "senegal",
    name: "Senegal",
    kitCount: 4,
    flagImage: "https://flagcdn.com/w320/sn.png",
    bgImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    featuredClubs: ["SEN"],
    kitHighlight: "White/green home and green/yellow patterned away",
  },
  {
    id: "egypt",
    name: "Egypt",
    kitCount: 4,
    flagImage: "https://flagcdn.com/w320/eg.png",
    bgImage: "https://images.unsplash.com/photo-1539768942893-daf53e736495?w=800&q=80",
    featuredClubs: ["EGY"],
    kitHighlight: "'Intense Red' patterned home and white/gray away",
  },
];
