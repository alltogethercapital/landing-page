import "server-only";

import type {
  InvestmentInstrument,
  InvestmentPlatform,
} from "@/lib/lp-investment-language";

export type InvestmentReviewStatus = "verified" | "pending" | "review";

export type VehicleAllocation = {
  asOf: string;
  deployedCompany: string;
  deployedShare: number;
  awaitingShare: number;
};

export type InvestmentRecord = {
  id: string;
  chronology: number;
  company: string;
  investedCost: number;
  investmentDate: string;
  round: string;
  entryValuation: string;
  instrument: InvestmentInstrument;
  platform: InvestmentPlatform;
  driveFolderId: string;
  logo: string;
  logoTreatment?: "inverse";
  description?: string;
  reviewStatus: InvestmentReviewStatus;
  reviewNote?: string;
  vehicleAllocation?: VehicleAllocation;
  performance?: {
    currentValue: number;
    distributions: number;
    asOf: string;
    method: string;
    source: string;
    approvedBy: string;
    approvedAt: string;
  };
};

export const H256_VEHICLE_ALLOCATION: VehicleAllocation = {
  asOf: "2026-08-17",
  deployedCompany: "Anduril",
  deployedShare: 0.44,
  awaitingShare: 0.56,
};

export type ProjectedValuationMark = {
  entryValuationAmount: number;
  latestValuationAmount: number;
  latestValuation: string;
  asOf: string;
  source: string;
  sourceUrl?: string;
};

// Approved cost-basis snapshot of the All Together Drive Schedule of Investments.
// Reconciled 2026-08-14. Values are preserved exactly from the source sheet;
// Performance fields remain absent until a sourced, dated mark is approved.
export const LP_INVESTMENTS: InvestmentRecord[] = [
  { id: "01-budbreak-innovations", chronology: 1, company: "Budbreak Innovations", investedCost: 10000, investmentDate: "2026-04-19", round: "Seed", entryValuation: "$25M post-money cap", instrument: "SAFE", platform: "AngelList", driveFolderId: "1iS2O7ATyv0UgTfRDReE5Uv8MD7Lo8n-N", logo: "/logos/cards/budbreak.png", description: "The robotics platform for agriculture.", reviewStatus: "verified" },
  { id: "02-exowatt", chronology: 2, company: "Exowatt", investedCost: 20000, investmentDate: "2026-04-20", round: "Series B", entryValuation: "$695M public valuation", instrument: "Equity", platform: "AngelList", driveFolderId: "1WFOOg5tHSYWhUE1XZzJGKTE413MVv_Hr", logo: "/logos/cards/exowatt.png", description: "Modular solar-thermal energy for the AI compute era.", reviewStatus: "verified" },
  { id: "03-unspun", chronology: 3, company: "Unspun", investedCost: 10000, investmentDate: "2026-04-27", round: "Series B+", entryValuation: "~$27M pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1vqJVRXyKlHDEI16kntIlkCzCzb22AwVk", logo: "/logos/cards/unspun.png", description: "Robotic, on-demand apparel manufacturing.", reviewStatus: "verified" },
  { id: "04-replit", chronology: 4, company: "Replit", investedCost: 10000, investmentDate: "2026-04-25", round: "Series D", entryValuation: "$8.6B post-money", instrument: "Equity", platform: "AngelList", driveFolderId: "12WZef4WsGPgcmuJVpxVwsvV0hcLxq5SR", logo: "/logos/cards/replit.png", description: "The AI-native platform for building and shipping software.", reviewStatus: "verified" },
  { id: "05-lance-ai", chronology: 5, company: "Lance AI", investedCost: 2000, investmentDate: "2026-04-25", round: "Seed", entryValuation: "Uncapped SAFE", instrument: "SAFE", platform: "AngelList", driveFolderId: "1gHerT8MYbPRwYQJYTG1rt1Nn4dGX9jor", logo: "/logos/cards/lance.png", description: "Building the future of hospitality.", reviewStatus: "verified" },
  { id: "06-quaise-energy", chronology: 6, company: "Quaise Energy", investedCost: 10000, investmentDate: "2026-05-03", round: "Series B", entryValuation: "$312.5M pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "10EI2AksDVmz6SLnGaAdgJ50KuuPk9Fmx", logo: "/logos/cards/quaise.png", description: "Ultra-deep geothermal to unlock clean baseload energy.", reviewStatus: "verified" },
  { id: "07-shield-ai", chronology: 7, company: "Shield AI", investedCost: 20000, investmentDate: "2026-05-04", round: "Series G", entryValuation: "$10.5B valuation", instrument: "Equity", platform: "Sydecar", driveFolderId: "1azcwyu3tpDuI3Q9J2_obryec9G67fT-K", logo: "/logos/cards/shield-ai.png", description: "AI pilots for aircraft and autonomous defense systems.", reviewStatus: "verified" },
  { id: "08-samply", chronology: 8, company: "Samply", investedCost: 2000, investmentDate: "2026-05-04", round: "Seed", entryValuation: "$10M post-money cap", instrument: "SAFE", platform: "AngelList", driveFolderId: "19mk9zCueHMx8jVBE6KSEtU9Hk4yKjwE1", logo: "/logos/cards/samply.png", description: "Sample management for modern music producers.", reviewStatus: "verified" },
  { id: "09-h256-series-3", chronology: 9, company: "H256 LLC Series 3", investedCost: 200000, investmentDate: "2026-05-06", round: "N/A", entryValuation: "No co. val; $50M fund / $1M SPV", instrument: "SPV", platform: "Direct", driveFolderId: "1c4ssc43ICTMjZO-BS_yYBBMLMHj4PUim", logo: "/logos/cards/h256-series-3.svg", description: "Dedicated investment company with exposure to frontier technology companies.", reviewStatus: "verified", vehicleAllocation: H256_VEHICLE_ALLOCATION },
  { id: "10-starcloud", chronology: 10, company: "Starcloud", investedCost: 37097.38, investmentDate: "2026-05-08", round: "Series A+", entryValuation: "$2B pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1W17VCUKpqxFQrlKhbLRwf0Iy5SyIXzw4", logo: "/logos/cards/starcloud.png", description: "Data centers in orbit, powered by the sun.", reviewStatus: "verified" },
  { id: "11-openai", chronology: 11, company: "OpenAI", investedCost: 50000, investmentDate: "2026-05-12", round: "Series G", entryValuation: "$852B post-money", instrument: "Equity", platform: "Sydecar", driveFolderId: "1yuyYyZjOiTDP5FWD1lY0VHI6qb_c6ipG", logo: "/logos/cards/openai.png", description: "Frontier AI research and products.", reviewStatus: "verified" },
  { id: "12-apptronik", chronology: 12, company: "Apptronik", investedCost: 30000, investmentDate: "2026-05-13", round: "Series A", entryValuation: "~$4.9B post-money", instrument: "Secondary", platform: "AngelList", driveFolderId: "1xr2MFkdyzodS6PgKsiaWG3e3lrdu4Wy-", logo: "/logos/cards/apptronik.png", description: "General-purpose humanoid robots for industry.", reviewStatus: "verified" },
  { id: "13-volantis", chronology: 13, company: "Volantis", investedCost: 5449.82, investmentDate: "2026-05-13", round: "Series A", entryValuation: "$250M post-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1_uqXkBvLZbPlVtbtyRlNV3oVPg-DokB5", logo: "/logos/cards/volantis.png", description: "AI-driven semiconductor design.", reviewStatus: "verified" },
  { id: "14-aurelius-systems", chronology: 14, company: "Aurelius Systems", investedCost: 5000, investmentDate: "2026-05-14", round: "Series A", entryValuation: "$160M pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "19c3chRV1oo9BOuDa2Wj-SH33xgFzp3jU", logo: "/logos/cards/aurelius.png", description: "Autonomous directed-energy defense systems.", reviewStatus: "verified" },
  { id: "15-aalo-atomics", chronology: 15, company: "Aalo Atomics", investedCost: 20000, investmentDate: "2026-05-15", round: "Series B+", entryValuation: "$3B pre-money", instrument: "SAFE", platform: "AngelList", driveFolderId: "1Dbw-4qey8TSjWrB0pmfVKjj-VDwJQTaT", logo: "/logos/cards/aalo.png", description: "Factory-built modular nuclear reactors for clean power.", reviewStatus: "verified" },
  { id: "16-salient-motion", chronology: 16, company: "Salient Motion", investedCost: 4585.65, investmentDate: "2026-05-15", round: "Series A", entryValuation: "$70M post-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1yR3pzxCRLviyb2EJVpqVn1T1V0PezA2h", logo: "/logos/cards/salient.png", description: "Critical actuation systems for aviation and defense.", reviewStatus: "verified" },
  { id: "17-hark", chronology: 17, company: "Hark", investedCost: 10000, investmentDate: "2026-05-15", round: "Series A", entryValuation: "$5.775B pre-money", instrument: "SPV", platform: "Sydecar", driveFolderId: "1QlPSw6g8aDSgc3i6ynyMkBRwFi8O6x9N", logo: "/logos/cards/hark.png", description: "AI-powered tools for the way people work.", reviewStatus: "verified" },
  { id: "18-eccentric-machines", chronology: 18, company: "Eccentric Machines", investedCost: 9763, investmentDate: "2026-05-20", round: "Seed", entryValuation: "$15M pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1sWjrKX4F0TGp-cfDEPdnOBTVMWU23P72", logo: "/logos/cards/eccentric.png", description: "Intelligent robotic motion systems.", reviewStatus: "verified" },
  { id: "19-maven-robotics", chronology: 19, company: "Maven Robotics", investedCost: 9733.38, investmentDate: "2026-05-20", round: "Series A", entryValuation: "No val; $50M model financing", instrument: "Equity", platform: "AngelList", driveFolderId: "17xTbyu31b01wbAHIeg6bUMMOkuHTP4ha", logo: "/logos/cards/maven.png", description: "General-purpose AI robots for industry.", reviewStatus: "verified" },
  { id: "20-array-labs", chronology: 20, company: "Array Labs", investedCost: 10000, investmentDate: "2026-05-23", round: "Series A+", entryValuation: "$90M public valuation", instrument: "Equity", platform: "AngelList", driveFolderId: "1rctopc9sizaPH0jZYsW0kBW96cZqHOlG", logo: "/logos/cards/array-labs.png", description: "Satellite swarms mapping Earth in real time.", reviewStatus: "verified" },
  { id: "21-corgi", chronology: 21, company: "Corgi", investedCost: 10000, investmentDate: "2026-05-25", round: "Series B+", entryValuation: "$2.5B valuation cap", instrument: "SAFE", platform: "AngelList", driveFolderId: "1MIfGNQQEAMqb0vXDUeJ-n5B_GWDBaSIt", logo: "/logos/cards/corgi.png", reviewStatus: "verified" },
  { id: "22-aformic", chronology: 22, company: "Aformic", investedCost: 4910, investmentDate: "2026-05-27", round: "Pre-seed", entryValuation: "$35M pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1lWVnqP_P6ZYSYpZAVD7mwQevfxR4rXRE", logo: "/logos/cards/aformic.png", reviewStatus: "verified" },
  { id: "23-1x-series-c", chronology: 23, company: "1X", investedCost: 20609, investmentDate: "2025-10-29", round: "Series C", entryValuation: "$10B post-money", instrument: "Equity", platform: "Echo", driveFolderId: "1eiNpQEV0QGZG0u_2Vgd_lsjeZmT8Ggas", logo: "/logos/cards/1x.png", description: "Humanoid robots engineered for the home.", reviewStatus: "verified" },
  { id: "24-1x-series-b", chronology: 24, company: "1X", investedCost: 3511, investmentDate: "2026-04-30", round: "Series B", entryValuation: "$4.59B post-money", instrument: "Equity", platform: "Echo", driveFolderId: "1oZJ8W19XxhBZkzvp2DV7DM9zPC1-XC-p", logo: "/logos/cards/1x.png", description: "Humanoid robots engineered for the home.", reviewStatus: "verified" },
  { id: "25-figure-ai", chronology: 25, company: "Figure AI", investedCost: 13068, investmentDate: "2025-12-17", round: "Series C", entryValuation: "$30B post-money", instrument: "Secondary", platform: "Echo", driveFolderId: "16n-o8ge-FbpgN7ucZ9qE2G0xwy96OzCq", logo: "/logos/cards/figure.png", description: "General-purpose humanoid robots for the workforce.", reviewStatus: "verified" },
  { id: "26-campus", chronology: 26, company: "Campus", investedCost: 10000, investmentDate: "2026-06-02", round: "Series B+", entryValuation: "$500M pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1ZgkaUf9s2i0PIUoduaH_KBy74MecgLjU", logo: "/logos/cards/campus.png", description: "An accredited online college expanding access to education.", reviewStatus: "verified" },
  { id: "27-compresr", chronology: 27, company: "Compresr", investedCost: 4953, investmentDate: "2026-06-11", round: "Seed", entryValuation: "$30M post-money", instrument: "SAFE", platform: "AngelList", driveFolderId: "1bdmsrORNNGUruOUYklpOOK_J-hjrkdWj", logo: "/logos/cards/compresr.svg", description: "Context compression infrastructure for LLM applications and agents.", reviewStatus: "verified" },
  { id: "28-rendezvous-robotics", chronology: 28, company: "Rendezvous Robotics", investedCost: 5000, investmentDate: "2026-06-11", round: "Seed", entryValuation: "$35M pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1qa3idkYDk50l0ek1goo_gUq6J1buGfbc", logo: "/logos/cards/rendezvous-robotics.svg", logoTreatment: "inverse", description: "Spacecraft that autonomously assemble into large structures in orbit.", reviewStatus: "verified" },
  { id: "29-raspire", chronology: 29, company: "Raspire", investedCost: 3000, investmentDate: "2026-06-14", round: "Seed", entryValuation: "$35M post-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1LyvwbBiIP_JWaOhZiJYSRNqg1wXqfXe5", logo: "/logos/cards/raspire.svg", logoTreatment: "inverse", description: "No-code runtime security for mobile applications.", reviewStatus: "verified" },
  { id: "30-matforge", chronology: 30, company: "Matforge", investedCost: 4934.26, investmentDate: "2026-06-17", round: "Seed", entryValuation: "$60M post-money", instrument: "SAFE", platform: "AngelList", driveFolderId: "1XfTB-qQWDyf2Nkjcevqzo5Z1p7J0fOoZ", logo: "/logos/cards/matforge.svg", description: "AI scientists for semiconductor materials discovery.", reviewStatus: "verified" },
  { id: "31-plena-health", chronology: 31, company: "Plena Health", investedCost: 4966.32, investmentDate: "2026-06-23", round: "Seed", entryValuation: "$50M post-money", instrument: "SAFE", platform: "AngelList", driveFolderId: "1JBSBUXA7Wdg32HmSF3Rm53WkbSJFesRY", logo: "/logos/cards/plena-health.png", reviewStatus: "verified" },
  { id: "32-core-automation", chronology: 32, company: "Core Automation", investedCost: 4090.62, investmentDate: "2026-06-27", round: "Series A", entryValuation: "$3.4B post-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1BqbLQuK-XJCwzeWMt-oobXJij6S6qDf0", logo: "/logos/cards/core-automation.png", description: "Building highly automated AI research infrastructure.", reviewStatus: "verified", reviewNote: "Final allocation reflects an oversubscription adjustment." },
  { id: "33-reflect-orbital", chronology: 33, company: "Reflect Orbital", investedCost: 9992.82, investmentDate: "2026-06-30", round: "Series A+", entryValuation: "$600M post-money", instrument: "SAFE", platform: "AngelList", driveFolderId: "1HqFP0rMX7ODBijh_F6Pxqe0lO7uxrRwx", logo: "/logos/cards/reflect-orbital.png", description: "Space-enabled infrastructure for sunlight after dark.", reviewStatus: "verified" },
  { id: "34-apollo-atomics", chronology: 34, company: "Apollo Atomics", investedCost: 5000, investmentDate: "2026-07-07", round: "Seed", entryValuation: "$120M post-money", instrument: "SAFE", platform: "AngelList", driveFolderId: "1x91emjmDa4KZwztBWkfLl_SoL6HH4VWh", logo: "/logos/cards/apollo-atomics.png", description: "Compact nuclear reactors designed for factory deployment.", reviewStatus: "verified" },
  { id: "35-decart-ai", chronology: 35, company: "Decart.ai", investedCost: 10000, investmentDate: "2026-07-08", round: "Series B", entryValuation: "$3.8B post-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1q70Kn_gxnE1am2WZHrjOurVGHitv_hlH", logo: "/logos/cards/decart.png", description: "Real-time world models and inference infrastructure.", reviewStatus: "verified" },
  { id: "36-sourcerer", chronology: 36, company: "Sourcerer", investedCost: 5000, investmentDate: "2026-07-08", round: "Seed", entryValuation: "$60M post-money", instrument: "SAFE", platform: "AngelList", driveFolderId: "1k3G2hviSHzMJeAAEHA3DtVaLgOeqviXV", logo: "/logos/cards/sourcerer.png", description: "AI-native sourcing, freight, and trade-finance infrastructure.", reviewStatus: "verified" },
  { id: "37-mav-unlimited", chronology: 37, company: "MAV Unlimited", investedCost: 2000, investmentDate: "2026-07-08", round: "Pre-seed", entryValuation: "$6M", instrument: "Convertible Notes", platform: "AngelList", driveFolderId: "1nr8m6EfuOMGrFAdSwsAtCsPeOCXVPtJF", logo: "/logos/cards/mav-unlimited.png", description: "Volumetric 3D printing for engineering-grade parts.", reviewStatus: "verified" },
  { id: "38-supabase", chronology: 38, company: "Supabase", investedCost: 10000, investmentDate: "2026-07-28", round: "Series F", entryValuation: "$10.5B post-money", instrument: "Secondary", platform: "AngelList", driveFolderId: "1XZwsYE7L9E13S0wTlfKON2rlR4BP7_B0", logo: "/logos/cards/supabase.png", description: "Open-source Postgres infrastructure for developers.", reviewStatus: "verified" },
  { id: "39-valstad", chronology: 39, company: "Valstad", investedCost: 10000, investmentDate: "2026-07-28", round: "Seed", entryValuation: "$30M post-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1QcRI0AnOr2l8N29ZZ7o88B4TiRppeQzt", logo: "/logos/cards/valstad.png", description: "Robotic fabrication systems for ship production and repair.", reviewStatus: "verified" },
  { id: "40-sunflower-labs", chronology: 40, company: "Sunflower Labs", investedCost: 10000, investmentDate: "2026-08-01", round: "Series C", entryValuation: "$50M pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "17kBI7OoZQMt37UaBeJEZZRR7K8UYcHWa", logo: "/logos/cards/sunflower-labs.png", description: "Autonomous drone security systems.", reviewStatus: "verified" },
  { id: "41-atoms", chronology: 41, company: "Atoms", investedCost: 9350, investmentDate: "2026-08-01", round: "Class A Preferred Units", entryValuation: "$15.9B pre-money", instrument: "Equity", platform: "Capital Company", driveFolderId: "1Cvnw6w8gMEnf8zwfceKq9WhKaeBuVO2l", logo: "/logos/cards/atoms.png", description: "Physical automation for food, mining, and transport.", reviewStatus: "verified" },
  { id: "42-weave-robotics", chronology: 42, company: "Weave Robotics", investedCost: 5000, investmentDate: "2026-08-11", round: "Seed+", entryValuation: "$180M post-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1f2LWuGRnoxsws4tCC5-JY-mmJdopMC1-", logo: "/logos/cards/weave-robotics.png", description: "Practical home robots for everyday household work.", reviewStatus: "verified", reviewNote: "Final amount reflects the owner's August 14 correction; the original outbound wire remains recorded separately." },
  { id: "43-blue-origin", chronology: 43, company: "Blue Origin", investedCost: 15000, investmentDate: "2026-08-12", round: "N/A", entryValuation: "$130B pre-money", instrument: "SPV", platform: "Capital Company", driveFolderId: "13wS3KegZWqt9lzc6Vomib40bjMQJ1Ya9", logo: "/logos/cards/blue-origin.png", description: "Reusable rockets, engines, lunar systems, and space infrastructure.", reviewStatus: "pending", reviewNote: "Wire confirmed; final fund acceptance and countersignature remain pending." },
  { id: "44-positron", chronology: 44, company: "Positron", investedCost: 5000, investmentDate: "2026-08-13", round: "Series C", entryValuation: "$4.5B pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "17qCf0zOiYhtSZxFOCChlHLK1qViEJsId", logo: "/logos/cards/positron.svg", logoTreatment: "inverse", description: "Purpose-built AI inference hardware and systems.", reviewStatus: "verified" },
];

// Sourced comparable financing marks used for the LP-facing gross projection.
// Positions without a comparable mark remain at invested cost.
//
// These three are the marks carried in the August 2026 investor letter as
// mailed. Each is a secondary bought below, or an entry struck below, a primary
// round that had already closed — none is a company re-rating after we invested.
// Replit, 1X (Series B) and Decart were carried in an earlier draft and are held
// at cost here, matching the letter of record.
export const LP_PROJECTED_VALUATION_MARKS: Record<string, ProjectedValuationMark> = {
  "07-shield-ai": { entryValuationAmount: 10_500_000_000, latestValuationAmount: 12_700_000_000, latestValuation: "$12.7B post-money", asOf: "2026-03-26", source: "Shield AI Series G", sourceUrl: "https://techcrunch.com/2026/03/26/defense-startup-shield-ai-lands-12-7b-valuation-up-140-after-u-s-air-force-deal/" },
  // No sourceUrl: the only link on file reports $5B, which contradicts the
  // ~$5.3B this position is marked to. Restore a link once one reporting the
  // extension at ~$5.3B is available — a citation that disagrees with the mark
  // is worse than none.
  "12-apptronik": { entryValuationAmount: 4_900_000_000, latestValuationAmount: 5_300_000_000, latestValuation: "~$5.3B post-money", asOf: "2026-02-11", source: "Apptronik Series A extension" },
  "25-figure-ai": { entryValuationAmount: 30_000_000_000, latestValuationAmount: 39_000_000_000, latestValuation: "$39B post-money", asOf: "2025-09-16", source: "Figure Series C announcement", sourceUrl: "https://www.figure.ai/news/series-c" },
};

export const LP_PROJECTION_AS_OF = "2026-08-14";

export const LP_SNAPSHOT = {
  source: "All Together Drive · Schedule of Investments",
  sourceId: "18GiV-rADZRhI7nJpCiUv5_RUCC3iiYFfpxaE6pLJ8yo",
  sourceRange: "Sheet1!A2:J45",
  sourceModifiedAt: "2026-08-14T22:20:54.020Z",
  publishedAt: "2026-08-14T22:22:27.000Z",
  recordCount: 44,
  investedCostTotal: 661014.25,
  status: "Reconciled with projected gross return model",
} as const;
