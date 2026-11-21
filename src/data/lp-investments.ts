import "server-only";

import type {
  InvestmentInstrument,
  InvestmentPlatform,
  InvestmentSecurityType,
} from "@/lib/lp-investment-language";

export type InvestmentReviewStatus = "verified" | "pending" | "review";

export type VehicleAllocation = {
  asOf: string;
  deployedCompany: string;
  deployedRound: string;
  deployedEntryValuationAmount: number;
  deployedShare: number;
  awaitingShare: number;
};

export type SecurityAllocation = {
  securityType: InvestmentSecurityType;
  share: number;
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
  // Positions bought personally and gifted to the fund. Listed, but excluded
  // from cost basis, Projected, Multiple, shares and allocations.
  gift?: true;
  securityAllocation?: SecurityAllocation[];
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
  deployedRound: "Series H at a $60B entry valuation",
  deployedEntryValuationAmount: 60_000_000_000,
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
  costBasisAmount?: number;
  entryValuation?: string;
  positionLabel?: string;
  scope?: string;
  basis?: "comparable" | "assumption";
};

// Approved cost-basis snapshot of the Machine Spirit Drive Schedule of Investments.
// Reconciled 2026-11-20 to Chase ••2128 and the platform ledgers. Corgi (21),
// Sourcerer (36) and Allia Health (57) were refunded before closing and are not held. Values are preserved exactly from the source sheet;
// Performance fields remain absent until a sourced, dated mark is approved.
export const LP_INVESTMENTS: InvestmentRecord[] = [
  { id: "01-budbreak-innovations", chronology: 1, company: "Budbreak Innovations", investedCost: 10000, investmentDate: "2026-04-19", round: "Seed", entryValuation: "$25M post-money cap", instrument: "SAFE", platform: "AngelList", driveFolderId: "1iS2O7ATyv0UgTfRDReE5Uv8MD7Lo8n-N", logo: "/logos/cards/budbreak.png", description: "The robotics platform for agriculture.", reviewStatus: "verified" },
  { id: "02-exowatt", chronology: 2, company: "Exowatt", investedCost: 20000, investmentDate: "2026-04-20", round: "Series B", entryValuation: "$1.3B pre-money cap (SAFE · $150M Series B)", instrument: "Equity", platform: "AngelList", driveFolderId: "1WFOOg5tHSYWhUE1XZzJGKTE413MVv_Hr", logo: "/logos/cards/exowatt.png", description: "Modular solar-thermal energy for the AI compute era.", reviewStatus: "verified" },
  { id: "03-unspun", chronology: 3, company: "Unspun", investedCost: 10000, investmentDate: "2026-04-27", round: "Series B+", entryValuation: "$122.379M pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1vqJVRXyKlHDEI16kntIlkCzCzb22AwVk", logo: "/logos/cards/unspun.png", description: "Robotic, on-demand apparel manufacturing.", reviewStatus: "verified" },
  { id: "04-replit", chronology: 4, company: "Replit", investedCost: 10000, investmentDate: "2026-04-25", round: "Series D", entryValuation: "$9B post-money ($8.6B pre · $248.26/sh secondary at Series D price)", instrument: "Equity", platform: "AngelList", driveFolderId: "12WZef4WsGPgcmuJVpxVwsvV0hcLxq5SR", logo: "/logos/cards/replit.png", description: "The AI-native platform for building and shipping software.", reviewStatus: "verified" },
  { id: "05-lance-ai", chronology: 5, company: "Lance AI", investedCost: 2000, investmentDate: "2026-04-25", round: "Seed", entryValuation: "Uncapped SAFE", instrument: "SAFE", platform: "AngelList", driveFolderId: "1gHerT8MYbPRwYQJYTG1rt1Nn4dGX9jor", logo: "/logos/cards/lance.png", description: "Building the future of hospitality.", reviewStatus: "verified" },
  { id: "06-quaise-energy", chronology: 6, company: "Quaise Energy", investedCost: 10000, investmentDate: "2026-05-03", round: "Series B", entryValuation: "$312.5M pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "10EI2AksDVmz6SLnGaAdgJ50KuuPk9Fmx", logo: "/logos/cards/quaise.png", description: "Ultra-deep geothermal to unlock clean baseload energy.", reviewStatus: "verified" },
  { id: "07-shield-ai", chronology: 7, company: "Shield AI", investedCost: 20000, investmentDate: "2026-05-04", round: "Series G", entryValuation: "$10.5B valuation", instrument: "Equity", platform: "Sydecar", driveFolderId: "1azcwyu3tpDuI3Q9J2_obryec9G67fT-K", logo: "/logos/cards/shield-ai.png", description: "AI pilots for aircraft and autonomous defense systems.", reviewStatus: "verified" },
  { id: "08-samply", chronology: 8, company: "Samply", investedCost: 2000, investmentDate: "2026-05-04", round: "Seed", entryValuation: "$10M post-money cap", instrument: "SAFE", platform: "AngelList", driveFolderId: "19mk9zCueHMx8jVBE6KSEtU9Hk4yKjwE1", logo: "/logos/cards/samply.png", description: "Sample management for modern music producers.", reviewStatus: "verified" },
  { id: "09-h256-series-3", chronology: 9, company: "H256 LLC Series 3", investedCost: 200000, investmentDate: "2026-05-06", round: "N/A", entryValuation: "No co. val; $50M fund / $1M SPV", instrument: "SPV", platform: "Direct", driveFolderId: "1c4ssc43ICTMjZO-BS_yYBBMLMHj4PUim", logo: "/logos/cards/h256-series-3.svg", description: "Dedicated investment company with exposure to frontier technology companies.", reviewStatus: "verified", securityAllocation: [{ securityType: "Equity", share: H256_VEHICLE_ALLOCATION.deployedShare }], vehicleAllocation: H256_VEHICLE_ALLOCATION },
  { id: "10-starcloud", chronology: 10, company: "Starcloud", investedCost: 32097.38, investmentDate: "2026-05-08", round: "Series A+", entryValuation: "$2B pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1W17VCUKpqxFQrlKhbLRwf0Iy5SyIXzw4", logo: "/logos/cards/starcloud.png", description: "Data centers in orbit, powered by the sun.", reviewStatus: "verified" },
  { id: "11-openai", chronology: 11, company: "OpenAI", investedCost: 50000, investmentDate: "2026-05-12", round: "Series G", entryValuation: "$852B post-money", instrument: "Equity", platform: "Sydecar", driveFolderId: "1yuyYyZjOiTDP5FWD1lY0VHI6qb_c6ipG", logo: "/logos/cards/openai.png", description: "Frontier AI research and products.", reviewStatus: "verified" },
  { id: "12-apptronik", chronology: 12, company: "Apptronik", investedCost: 20766.24, investmentDate: "2026-05-13", round: "Series A", entryValuation: "~$4.9B post-money ($34.50/sh secondary)", instrument: "Secondary", platform: "AngelList", driveFolderId: "1xr2MFkdyzodS6PgKsiaWG3e3lrdu4Wy-", logo: "/logos/cards/apptronik.png", description: "General-purpose humanoid robots for industry.", reviewStatus: "verified", reviewNote: "Owner confirmed the final allocation is $20,766.24 as of October 13, 2026, reduced from the prior $29,222.00 allocation. The original $30,000.00 outbound investment remains in the bank ledger. The previously evidenced $778.00 AngelList Investor Account credit remains recorded; the additional $8,455.76 reduction is not recorded as a refund or platform credit without transaction evidence." },
  { id: "13-volantis", chronology: 13, company: "Volantis", investedCost: 5449.82, investmentDate: "2026-05-13", round: "Series A", entryValuation: "$250M post-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1_uqXkBvLZbPlVtbtyRlNV3oVPg-DokB5", logo: "/logos/cards/volantis.png", description: "AI-driven semiconductor design.", reviewStatus: "verified" },
  { id: "14-aurelius-systems", chronology: 14, company: "Aurelius Systems", investedCost: 5000, investmentDate: "2026-05-14", round: "Series A", entryValuation: "$160M pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "19c3chRV1oo9BOuDa2Wj-SH33xgFzp3jU", logo: "/logos/cards/aurelius.png", description: "Autonomous directed-energy defense systems.", reviewStatus: "verified" },
  { id: "15-aalo-atomics", chronology: 15, company: "Aalo Atomics", investedCost: 20000, investmentDate: "2026-05-15", round: "Series B+", entryValuation: "$3B pre-money", instrument: "SAFE", platform: "AngelList", driveFolderId: "1Dbw-4qey8TSjWrB0pmfVKjj-VDwJQTaT", logo: "/logos/cards/aalo.png", description: "Factory-built modular nuclear reactors for clean power.", reviewStatus: "verified" },
  { id: "16-salient-motion", chronology: 16, company: "Salient Motion", investedCost: 4585.65, investmentDate: "2026-05-15", round: "Series A", entryValuation: "$70M post-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1yR3pzxCRLviyb2EJVpqVn1T1V0PezA2h", logo: "/logos/cards/salient.png", description: "Critical actuation systems for aviation and defense.", reviewStatus: "verified" },
  { id: "17-hark", chronology: 17, company: "Hark", investedCost: 10000, investmentDate: "2026-05-15", round: "Series A", entryValuation: "$6B post-money (Series A pref $39.7491/sh; memo: $5.775B pre)", instrument: "SPV", platform: "Sydecar", driveFolderId: "1QlPSw6g8aDSgc3i6ynyMkBRwFi8O6x9N", logo: "/logos/cards/hark.png", description: "AI-powered tools for the way people work.", reviewStatus: "verified", securityAllocation: [{ securityType: "Equity", share: 1 }] },
  { id: "18-eccentric-machines", chronology: 18, company: "Eccentric Machines", investedCost: 9762.96, investmentDate: "2026-05-20", round: "Seed", entryValuation: "$15M pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1sWjrKX4F0TGp-cfDEPdnOBTVMWU23P72", logo: "/logos/cards/eccentric.png", description: "Intelligent robotic motion systems.", reviewStatus: "verified" },
  { id: "19-maven-robotics", chronology: 19, company: "Maven Robotics", investedCost: 9733.38, investmentDate: "2026-05-20", round: "Series A", entryValuation: "No val; $50M model financing", instrument: "Equity", platform: "AngelList", driveFolderId: "17xTbyu31b01wbAHIeg6bUMMOkuHTP4ha", logo: "/logos/cards/maven.png", description: "General-purpose AI robots for industry.", reviewStatus: "verified" },
  { id: "20-array-labs", chronology: 20, company: "Array Labs", investedCost: 10000, investmentDate: "2026-05-23", round: "Series A+", entryValuation: "$90M public valuation", instrument: "Equity", platform: "AngelList", driveFolderId: "1rctopc9sizaPH0jZYsW0kBW96cZqHOlG", logo: "/logos/cards/array-labs.png", description: "Satellite swarms mapping Earth in real time.", reviewStatus: "verified" },
  { id: "22-aformic", chronology: 22, company: "Aformic", investedCost: 4909.91, investmentDate: "2026-05-27", round: "Pre-seed", entryValuation: "$35M pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1lWVnqP_P6ZYSYpZAVD7mwQevfxR4rXRE", logo: "/logos/cards/aformic.png", reviewStatus: "verified" },
  { id: "23-1x-series-c", gift: true, chronology: 23, company: "1X", investedCost: 20609, investmentDate: "2025-10-29", round: "Series C", entryValuation: "$10B post-money", instrument: "Equity", platform: "Echo", driveFolderId: "1eiNpQEV0QGZG0u_2Vgd_lsjeZmT8Ggas", logo: "/logos/cards/1x.png", description: "Humanoid robots engineered for the home.", reviewStatus: "verified" },
  { id: "24-1x-series-b", gift: true, chronology: 24, company: "1X", investedCost: 3511, investmentDate: "2026-04-30", round: "Series B", entryValuation: "$4.59B post-money", instrument: "Equity", platform: "Echo", driveFolderId: "1oZJ8W19XxhBZkzvp2DV7DM9zPC1-XC-p", logo: "/logos/cards/1x.png", description: "Humanoid robots engineered for the home.", reviewStatus: "verified" },
  { id: "25-figure-ai", gift: true, chronology: 25, company: "Figure AI", investedCost: 13068, investmentDate: "2025-12-17", round: "Series C", entryValuation: "$30B post-money", instrument: "Secondary", platform: "Echo", driveFolderId: "16n-o8ge-FbpgN7ucZ9qE2G0xwy96OzCq", logo: "/logos/cards/figure.png", description: "General-purpose humanoid robots for the workforce.", reviewStatus: "verified" },
  { id: "26-campus", chronology: 26, company: "Campus", investedCost: 10000, investmentDate: "2026-06-02", round: "Series B+", entryValuation: "$500M pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1ZgkaUf9s2i0PIUoduaH_KBy74MecgLjU", logo: "/logos/cards/campus.png", description: "An accredited online college expanding access to education.", reviewStatus: "verified" },
  { id: "27-compresr", chronology: 27, company: "Compresr", investedCost: 4952.56, investmentDate: "2026-06-11", round: "Seed", entryValuation: "$30M post-money", instrument: "SAFE", platform: "AngelList", driveFolderId: "1bdmsrORNNGUruOUYklpOOK_J-hjrkdWj", logo: "/logos/cards/compresr.svg", description: "Context compression infrastructure for LLM applications and agents.", reviewStatus: "verified" },
  { id: "28-rendezvous-robotics", chronology: 28, company: "Rendezvous Robotics", investedCost: 5000, investmentDate: "2026-06-11", round: "Seed", entryValuation: "$35M pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1qa3idkYDk50l0ek1goo_gUq6J1buGfbc", logo: "/logos/cards/rendezvous-robotics.svg", logoTreatment: "inverse", description: "Spacecraft that autonomously assemble into large structures in orbit.", reviewStatus: "verified" },
  { id: "29-raspire", chronology: 29, company: "Raspire", investedCost: 3000, investmentDate: "2026-06-14", round: "Seed", entryValuation: "$35M post-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1LyvwbBiIP_JWaOhZiJYSRNqg1wXqfXe5", logo: "/logos/cards/raspire.svg", logoTreatment: "inverse", description: "No-code runtime security for mobile applications.", reviewStatus: "verified" },
  { id: "30-matforge", chronology: 30, company: "Matforge", investedCost: 4934.26, investmentDate: "2026-06-17", round: "Seed", entryValuation: "$60M post-money", instrument: "SAFE", platform: "AngelList", driveFolderId: "1XfTB-qQWDyf2Nkjcevqzo5Z1p7J0fOoZ", logo: "/logos/cards/matforge.svg", description: "AI scientists for semiconductor materials discovery.", reviewStatus: "verified" },
  { id: "31-plena-health", chronology: 31, company: "Plena Health", investedCost: 4966.32, investmentDate: "2026-06-23", round: "Seed", entryValuation: "$50M post-money", instrument: "SAFE", platform: "AngelList", driveFolderId: "1JBSBUXA7Wdg32HmSF3Rm53WkbSJFesRY", logo: "/logos/cards/plena-health.png", reviewStatus: "verified" },
  { id: "32-core-automation", chronology: 32, company: "Core Automation", investedCost: 4090.62, investmentDate: "2026-06-27", round: "Series A", entryValuation: "$3.4B post-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1BqbLQuK-XJCwzeWMt-oobXJij6S6qDf0", logo: "/logos/cards/core-automation.png", description: "Building highly automated AI research infrastructure.", reviewStatus: "verified", reviewNote: "Final allocation reflects an oversubscription adjustment." },
  { id: "33-reflect-orbital", chronology: 33, company: "Reflect Orbital", investedCost: 9992.82, investmentDate: "2026-06-30", round: "Series A+", entryValuation: "$600M post-money", instrument: "SAFE", platform: "AngelList", driveFolderId: "1HqFP0rMX7ODBijh_F6Pxqe0lO7uxrRwx", logo: "/logos/cards/reflect-orbital.png", description: "Space-enabled infrastructure for sunlight after dark.", reviewStatus: "verified" },
  { id: "34-apollo-atomics", chronology: 34, company: "Apollo Atomics", investedCost: 5000, investmentDate: "2026-07-07", round: "Seed", entryValuation: "$120M post-money", instrument: "SAFE", platform: "AngelList", driveFolderId: "1x91emjmDa4KZwztBWkfLl_SoL6HH4VWh", logo: "/logos/cards/apollo-atomics.png", description: "Compact nuclear reactors designed for factory deployment.", reviewStatus: "verified" },
  { id: "35-decart-ai", chronology: 35, company: "Decart.ai", investedCost: 10000, investmentDate: "2026-07-08", round: "Series B", entryValuation: "$3.8B post-money (Series B primary)", instrument: "Equity", platform: "AngelList", driveFolderId: "1q70Kn_gxnE1am2WZHrjOurVGHitv_hlH", logo: "/logos/cards/decart.png", description: "Real-time world models and inference infrastructure.", reviewStatus: "verified" },
  { id: "37-mav-unlimited", chronology: 37, company: "MAV Unlimited", investedCost: 2000, investmentDate: "2026-07-08", round: "Pre-seed", entryValuation: "$6M", instrument: "Convertible Notes", platform: "AngelList", driveFolderId: "1nr8m6EfuOMGrFAdSwsAtCsPeOCXVPtJF", logo: "/logos/cards/mav-unlimited.png", description: "Volumetric 3D printing for engineering-grade parts.", reviewStatus: "verified" },
  { id: "38-supabase", chronology: 38, company: "Supabase", investedCost: 9981.52, investmentDate: "2026-07-28", round: "Series F", entryValuation: "$10.5B post-money", instrument: "Secondary", platform: "AngelList", driveFolderId: "1XZwsYE7L9E13S0wTlfKON2rlR4BP7_B0", logo: "/logos/cards/supabase.png", description: "Open-source Postgres infrastructure for developers.", reviewStatus: "verified", reviewNote: "Owner confirmed the final allocation was reduced from $10,000.00 to $9,981.52 on September 28, 2026. The $18.48 difference is an allocation reduction; no separate refund or cash movement is recorded without transaction evidence." },
  { id: "39-valstad", chronology: 39, company: "Valstad", investedCost: 10000, investmentDate: "2026-07-28", round: "Seed", entryValuation: "$30M post-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1QcRI0AnOr2l8N29ZZ7o88B4TiRppeQzt", logo: "/logos/cards/valstad.png", description: "Robotic fabrication systems for ship production and repair.", reviewStatus: "verified" },
  { id: "40-sunflower-labs", chronology: 40, company: "Sunflower Labs", investedCost: 10000, investmentDate: "2026-08-01", round: "Series C", entryValuation: "$50M pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "17kBI7OoZQMt37UaBeJEZZRR7K8UYcHWa", logo: "/logos/cards/sunflower-labs.png", description: "Autonomous drone security systems.", reviewStatus: "verified" },
  { id: "41-atoms", chronology: 41, company: "Atoms", investedCost: 9350, investmentDate: "2026-08-01", round: "Class A Preferred Units", entryValuation: "$15.9B pre-money", instrument: "Equity", platform: "Capital Company", driveFolderId: "1Cvnw6w8gMEnf8zwfceKq9WhKaeBuVO2l", logo: "/logos/cards/atoms.png", description: "Physical automation for food, mining, and transport.", reviewStatus: "verified" },
  { id: "42-weave-robotics", chronology: 42, company: "Weave Robotics", investedCost: 5000, investmentDate: "2026-08-11", round: "Seed+", entryValuation: "$180M post-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1f2LWuGRnoxsws4tCC5-JY-mmJdopMC1-", logo: "/logos/cards/weave-robotics.png", description: "Practical home robots for everyday household work.", reviewStatus: "verified", reviewNote: "Final amount reflects the owner's August 14 correction; the original outbound wire remains recorded separately." },
  { id: "43-blue-origin", chronology: 43, company: "Blue Origin", investedCost: 15000, investmentDate: "2026-08-12", round: "N/A", entryValuation: "$130B pre-money", instrument: "SPV", platform: "Capital Company", driveFolderId: "13wS3KegZWqt9lzc6Vomib40bjMQJ1Ya9", logo: "/logos/cards/blue-origin.png", description: "Reusable rockets, engines, lunar systems, and space infrastructure.", reviewStatus: "verified", reviewNote: "Reconciled November 20, 2026: cash movement confirmed by the $15,000 Chase ••2128 wire to Capital Company on August 12, 2026. Earlier note: Wire confirmed; final fund acceptance and countersignature remain pending.", securityAllocation: [{ securityType: "Not specified", share: 1 }] },
  { id: "44-positron", chronology: 44, company: "Positron", investedCost: 20000, investmentDate: "2026-08-13", round: "Series C", entryValuation: "$4.5B pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "17qCf0zOiYhtSZxFOCChlHLK1qViEJsId", logo: "/logos/cards/positron.svg", logoTreatment: "inverse", description: "Purpose-built AI inference hardware and systems.", reviewStatus: "verified" },
  { id: "45-longshot-space", chronology: 45, company: "Longshot Space", investedCost: 5000, investmentDate: "2026-11-10", round: "Series A", entryValuation: "$180M post-money", instrument: "SPV", platform: "AngelList", driveFolderId: "1I13bw8dZh0S5vDFb5B-euAPo9sFYBeS8", logo: "/logos/cards/longshot-space.png", description: "Reusable ground accelerators for hypersonic testing and future cargo launch.", reviewStatus: "verified", reviewNote: "Reconciled November 20, 2026: cash movement confirmed by the AngelList funding ledger, whose net deposits tie to Chase ••2128. Earlier note: Owner confirmed a $5,000 position at a $180M post-money valuation on November 10, 2026. Supplied platform evidence identifies a Series A opportunity on AngelList. The legal package identifies LO-0720 Fund II, a series of JMWTX Investments, LP, but the supplied Subscription Agreement points to a separate electronic-signature package and does not evidence Outer Rim Ventures LLC's execution, commitment, GP acceptance, or acceptance date. Cash route, transfer date, and completed movement remain unevidenced; no bank-ledger movement is recorded without transaction evidence. The $1,000 platform minimum and lead commitment are not Outer Rim Ventures LLC's amount.", securityAllocation: [{ securityType: "Not specified", share: 1 }] },
  { id: "46-higgsfield", chronology: 46, company: "Higgsfield", investedCost: 10000, investmentDate: "2026-08-21", round: "Series B", entryValuation: "$5B pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1GLPKzbsjW3P5-H6Pa4D8WtDFq0E5_QAL", logo: "/logos/cards/higgsfield.png", description: "AI video and image creation workflows for creators, marketers, and enterprise teams.", reviewStatus: "verified", reviewNote: "Reconciled November 20, 2026: cash movement confirmed by the AngelList funding ledger, whose net deposits tie to Chase ••2128. Earlier note: Position amount confirmed by the owner; bank transfer route/date and executed closing evidence remain pending." },
  { id: "47-autostep", chronology: 47, company: "Autostep", investedCost: 5000, investmentDate: "2026-09-02", round: "Seed", entryValuation: "$25M post-money cap", instrument: "SAFE", platform: "AngelList", driveFolderId: "1hFluYp4ma4dg2c9SO2sf7tCWU3O2hAlX", logo: "/logos/cards/autostep.png", description: "The measurement and ROI layer for human and agent work.", reviewStatus: "verified", reviewNote: "Reconciled November 20, 2026: cash movement confirmed by the AngelList funding ledger, whose net deposits tie to Chase ••2128. Earlier note: Owner-confirmed position; supplied legal package is mismatched and does not evidence Autostep execution.", securityAllocation: [{ securityType: "SAFE", share: 1 }] },
  { id: "48-blue-origin-series-a", chronology: 48, company: "Blue Origin", investedCost: 24974.93, investmentDate: "2026-09-06", round: "Series A", entryValuation: "$130B pre-money", instrument: "SPV", platform: "AngelList", driveFolderId: "1i9MBMOc653LDMENmHpLvTzStv1eaM1J1", logo: "/logos/cards/blue-origin.png", description: "A second Blue Origin position through a distinct layered SPV.", reviewStatus: "verified", reviewNote: "Reconciled November 20, 2026: cash movement confirmed by the AngelList funding ledger, whose net deposits tie to Chase ••2128. Earlier note: Owner confirmed the final allocation is $24,975.00 as of October 19, 2026, revised from the original $25,000.00 allocation. The actual $25,000.00 outbound transfer to AngelList dated September 6, 2026 remains in the bank ledger. The $25.00 difference is an allocation reduction; no separate refund or AngelList account credit is recorded without transaction evidence. Investor-specific execution and GP acceptance remain unevidenced.", securityAllocation: [{ securityType: "Not specified", share: 1 }] },
  { id: "49-molagri", chronology: 49, company: "Molagri", investedCost: 5000, investmentDate: "2026-09-07", round: "N/A", entryValuation: "N/A", instrument: "SPV", platform: "AngelList", driveFolderId: "1g-tuYJOwgQZ6mIg5mzgzpRKjJi_GBENy", logo: "/logos/cards/molagri.svg", description: "Precision biological crop protection.", reviewStatus: "verified", reviewNote: "Reconciled November 20, 2026: cash movement confirmed by the AngelList funding ledger, whose net deposits tie to Chase ••2128. Earlier note: Owner-confirmed amount, date, and AngelList funding movement; executed acceptance remains unevidenced.", securityAllocation: [{ securityType: "Not specified", share: 1 }] },
  { id: "50-trynearby", chronology: 50, company: "TryNearby", investedCost: 10000, investmentDate: "2026-09-07", round: "N/A", entryValuation: "N/A", instrument: "SPV", platform: "AngelList", driveFolderId: "1TtxI66VvKWw-MB1qpXTqNhGOdeCJG9dV", logo: "/logos/cards/trynearby.svg", description: "Local creators for local businesses.", reviewStatus: "verified", reviewNote: "Reconciled November 20, 2026: cash movement confirmed by the AngelList funding ledger, whose net deposits tie to Chase ••2128. Earlier note: Owner-confirmed amount, date, and AngelList funding movement; executed acceptance remains unevidenced.", securityAllocation: [{ securityType: "Not specified", share: 1 }] },
  { id: "51-familiar-labs", chronology: 51, company: "Familiar Labs", investedCost: 10000, investmentDate: "2026-09-07", round: "N/A", entryValuation: "N/A", instrument: "SPV", platform: "AngelList", driveFolderId: "1r6iaf0utunzr8KjTF9cb4qW-0HM-281e", logo: "/logos/cards/familiar-labs.svg", description: "AI dubbing that preserves the performance.", reviewStatus: "verified", reviewNote: "Reconciled November 20, 2026: cash movement confirmed by the AngelList funding ledger, whose net deposits tie to Chase ••2128. Earlier note: Owner-confirmed amount, date, and AngelList funding movement; executed acceptance remains unevidenced.", securityAllocation: [{ securityType: "Not specified", share: 1 }] },
  { id: "52-carsignal", chronology: 52, company: "CarSignal", investedCost: 5000, investmentDate: "2026-09-07", round: "N/A", entryValuation: "N/A", instrument: "SPV", platform: "AngelList", driveFolderId: "1S7uSIfCQZgsFIV4if9WKC4GQPUscvDbn", logo: "/logos/cards/carsignal.svg", description: "The AI operating system for independent auto shops.", reviewStatus: "verified", reviewNote: "Reconciled November 20, 2026: cash movement confirmed by the AngelList funding ledger, whose net deposits tie to Chase ••2128. Earlier note: Owner-confirmed amount, date, and AngelList funding movement; executed acceptance remains unevidenced.", securityAllocation: [{ securityType: "Not specified", share: 1 }] },
  { id: "53-datoric", chronology: 53, company: "Datoric", investedCost: 10000, investmentDate: "2026-09-07", round: "N/A", entryValuation: "N/A", instrument: "SPV", platform: "AngelList", driveFolderId: "1UhxNn2e916iNFyqAcsSAzdkzMhke-4Es", logo: "/logos/cards/datoric.svg", description: "Licensed multimodal data for frontier AI systems.", reviewStatus: "verified", reviewNote: "Reconciled November 20, 2026: cash movement confirmed by the AngelList funding ledger, whose net deposits tie to Chase ••2128. Earlier note: Owner-confirmed amount, date, and AngelList funding movement; executed acceptance remains unevidenced.", securityAllocation: [{ securityType: "Not specified", share: 1 }] },
  { id: "54-rasyn", chronology: 54, company: "Rasyn", investedCost: 9993.59, investmentDate: "2026-09-07", round: "N/A", entryValuation: "N/A", instrument: "SPV", platform: "AngelList", driveFolderId: "1T9DGWnbs1zjy7QU17iugBiFIA117i5Ue", logo: "/logos/cards/rasyn.svg", description: "AI models and experimentation for chemical discovery.", reviewStatus: "verified", reviewNote: "Reconciled November 20, 2026: cash movement confirmed by the AngelList funding ledger, whose net deposits tie to Chase ••2128. Earlier note: Owner confirmed the final allocation is $9,994.00 as of October 14, 2026, revised from $9,993.59 and reduced from the original $10,000.00 allocation. The original $10,000.00 outbound investment from Outer Rim Ventures LLC to AngelList dated September 7, 2026 remains in the bank ledger. The $6.00 difference is an allocation reduction; no separate refund or AngelList account-balance credit is recorded without transaction evidence. Executed acceptance remains unevidenced.", securityAllocation: [{ securityType: "Not specified", share: 1 }] },
  { id: "55-path-robotics", chronology: 55, company: "Path Robotics", investedCost: 10000, investmentDate: "2026-09-08", round: "Series E", entryValuation: "$2.15B pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1LaXIvy7BtKrX-Sl9x_KCutcLq5CkiLQV", logo: "/logos/cards/path-robotics.svg", logoTreatment: "inverse", description: "Physical AI for adaptive autonomous manufacturing.", reviewStatus: "verified", reviewNote: "Reconciled November 20, 2026: cash movement confirmed by the AngelList funding ledger, whose net deposits tie to Chase ••2128. Earlier note: Owner-confirmed amount, date, and AngelList funding movement; supplied subscription document points to a separate electronic signature package and does not itself evidence GP acceptance.", securityAllocation: [{ securityType: "Equity", share: 1 }] },
  { id: "56-ultrasonium", chronology: 56, company: "Ultrasonium", investedCost: 9914.97, investmentDate: "2026-09-09", round: "Seed", entryValuation: "$50M post-money", instrument: "SAFE", platform: "AngelList", driveFolderId: "1RmBLZl7z0adZHBlkRW3ms7UjgpbXaNej", logo: "/logos/cards/ultrasonium.png", description: "Next-generation metals manufacturing.", reviewStatus: "verified", reviewNote: "Reconciled November 20, 2026: cash movement confirmed by the AngelList funding ledger, whose net deposits tie to Chase ••2128. Earlier note: Owner confirmed the final allocation was reduced from $10,000.00 to $9,914.97 on October 6, 2026. The $85.03 difference is an allocation reduction; no separate refund or cash movement is recorded without transaction evidence. Executed acceptance and cash-movement evidence remain pending.", securityAllocation: [{ securityType: "SAFE", share: 1 }] },
  { id: "58-astro-mechanica", chronology: 58, company: "Astro Mechanica", investedCost: 25000, investmentDate: "2026-09-14", round: "Series B", entryValuation: "$500M pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1U9X7aBMqYbNur4ZymkjfhX5o22S49wVb", logo: "/logos/cards/astro-mechanica.png", description: "Turboelectric propulsion and integrated aerospace systems.", reviewStatus: "verified", reviewNote: "Reconciled November 20, 2026: cash movement confirmed by the AngelList funding ledger, whose net deposits tie to Chase ••2128. Earlier note: Owner-confirmed position; supplied offering documents are generic and unsigned, and cash-movement evidence remains pending.", securityAllocation: [{ securityType: "Equity", share: 1 }] },
  { id: "59-atomarine", chronology: 59, company: "Atomarine", investedCost: 9303.06, investmentDate: "2026-09-16", round: "Seed", entryValuation: "$125M post-money cap", instrument: "SAFE", platform: "AngelList", driveFolderId: "1nZD5UYXSxlF2E3rn9jO1wDly8sG9zRI2", logo: "/logos/cards/atomarine.png", description: "Floating data center campuses with standalone power and seawater cooling.", reviewStatus: "verified", reviewNote: "Reconciled November 20, 2026: cash movement confirmed by the AngelList funding ledger, whose net deposits tie to Chase ••2128. Earlier note: Owner confirmed via the AngelList email dated November 16, 2026 that the Atomarine SPV was oversubscribed and the syndicate lead reduced Outer Rim Ventures LLC's $10,000.00 commitment to a final allocation of $9,303.06. The $696.94 difference was returned to the AngelList cash balance (Investor Account). Supplied offering documents remain generic and unsigned; cash-movement evidence for the original wire remains pending.", securityAllocation: [{ securityType: "SAFE", share: 1 }] },
  { id: "60-chef-robotics", chronology: 60, company: "Chef Robotics", investedCost: 18590.75, investmentDate: "2026-10-16", round: "Series A+", entryValuation: "$115M valuation cap", instrument: "Convertible Notes", platform: "AngelList", driveFolderId: "1VEsHa4Vp_hMfcaQPVkrW1VKEcMuSBSvY", logo: "/logos/cards/chef-robotics.png", description: "Physical AI and robotic systems for food production.", reviewStatus: "verified", reviewNote: "AngelList convertible note, $115M valuation cap and 10% discount. Funded October 19, 2026 from the AngelList cash balance (oversubscription refunds), per the AngelList funding ledger; status Closing.", securityAllocation: [{ securityType: "Convertible Notes", share: 1 }] },
  { id: "61-standard-bots", chronology: 61, company: "Standard Bots", investedCost: 15000, investmentDate: "2026-10-29", round: "Series C", entryValuation: "$1B post-money", instrument: "Equity", platform: "AngelList", driveFolderId: "1c_tX4tgVZesvBxzeKpgJPgFfVIUDQ6KJ", logo: "/logos/cards/standard-bots.png", description: "AI-native industrial robots for American manufacturing.", reviewStatus: "verified", reviewNote: "AngelList Series C preferred equity at a $1B post-money valuation. Funded October 30, 2026 from the AngelList cash balance, per the AngelList funding ledger; status Closing.", securityAllocation: [{ securityType: "Equity", share: 1 }] },
  { id: "62-summer-engine", chronology: 62, company: "Summer Engine", investedCost: 25000, investmentDate: "2026-11-13", round: "N/A", entryValuation: "Uncapped", instrument: "SAFE", platform: "YC", driveFolderId: "1VlSG2viDL9xFN6tTNaTIz5JyDOmvhJgO", logo: "/logos/cards/summer-engine.svg", logoTreatment: "inverse", description: "The AI game engine for people and agents.", reviewStatus: "verified", reviewNote: "Uncapped MFN SAFE signed through the YC Investors portal; $25,000 wired to Summer Labs Inc on November 19, 2026 from Chase.", securityAllocation: [{ securityType: "SAFE", share: 1 }] },
  { id: "63-anthropic", chronology: 63, company: "Anthropic", investedCost: 100000, investmentDate: "2026-11-19", round: "Public (Nasdaq: ANT)", entryValuation: "~$2.01T fully diluted at open", instrument: "Public Equity", platform: "Fidelity", driveFolderId: "1x9fZRQlxyiuizI5oMC_vGtGG9I0yyn6u", logo: "/logos/cards/anthropic.svg", description: "Frontier AI research and safety, and the creators of Claude.", reviewStatus: "verified", reviewNote: "Bought on the public market on Anthropic's first trading day: Nasdaq: ANT Class A common stock at $111.50 per share, against the $83.00 IPO price. Cost basis $100,000; 896.86 shares derived from $100,000 / $111.50. Funded by the $51,000 and $49,000 Chase ••2128 wires to Fidelity on November 17, 2026. Unlike the private positions, this position has a daily market price.", securityAllocation: [{ securityType: "Public Equity", share: 1 }] },
  { id: "64-commons-clinic", chronology: 64, company: "Commons Clinic", investedCost: 10000, investmentDate: "2026-05-26", round: "Series B+", entryValuation: "$40M pre-money", instrument: "Equity", platform: "AngelList", driveFolderId: "11v0VsdRI3_ycFmr8aXM00MhqByHrGL9k", logo: "/logos/cards/commons-clinic.png", description: "Transparent-price spine, joint and orthopedic care in Los Angeles.", reviewStatus: "verified", reviewNote: "AngelList Series B+ preferred equity at a $40M pre-money valuation; $10,000 invested May 26, 2026 per the AngelList funding ledger and the Chase ••2128 ACH pulls that day. Added in the November 20, 2026 reconciliation.", securityAllocation: [{ securityType: "Equity", share: 1 }] },
];

// Valuation inputs used for the LP-facing gross projection. Most inputs are
// sourced comparable financings; scenario assumptions are labeled explicitly.
// Positions without a valuation input remain at invested cost.
//
// The August 2026 investor update preserves its mailed three-mark snapshot
// separately. This live portfolio set reflects the portfolio-wide valuation
// review refreshed on October 24, 2026. Prior inputs are retained, not newly approved
// administrator marks. Anduril remains the sole owner-directed assumption.
export const LP_PROJECTED_VALUATION_MARKS: Record<string, ProjectedValuationMark> = {
  "04-replit": {
    entryValuationAmount: 9_000_000_000,
    latestValuationAmount: 9_000_000_000,
    latestValuation: "$9B post-money (held at cost)",
    asOf: "2026-03-11",
    source: "Same round as entry: AngelList memo — secondary at parity with Series D, $8.6B pre-money, $248.26/sh; Series D $400M at $9B post. No later priced round",
    sourceUrl: "https://replit.com/blog/replit-raises-400-million-dollars",
  },
  "09-h256-series-3": {
    entryValuationAmount: 60_000_000_000,
    latestValuationAmount: 100_000_000_000,
    latestValuation: "$100B assumed valuation",
    asOf: "2026-08-18",
    source: "Owner-directed $100B Anduril scenario informed by reported financing talks",
    sourceUrl: "https://www.investing.com/news/economy-news/exclusivedefense-tech-company-anduril-in-talks-to-raise-funding-at-about-100-billion-valuation-4810948",
    costBasisAmount: 88_000,
    entryValuation: "$60B entry valuation",
    positionLabel: "H256 → Anduril",
    scope: "scenario applies only to H256's $88,000 Anduril allocation; $112,000 remains at cost; not a completed financing or fund-administrator mark",
    basis: "assumption",
  },
  "07-shield-ai": {
    entryValuationAmount: 10_500_000_000,
    latestValuationAmount: 28_800_000_000,
    latestValuation: "$28.8B post-money",
    asOf: "2026-11-05",
    source: "Shield Series H announcement",
    sourceUrl: "https://shield.ai/shield-to-acquire-echodyne-in-a-transaction-valued-at-5-3-billion-and-raise-2-5-billion-at-a-28-8-billion-valuation/",
    scope: "gross company-valuation comparison; the announced Series H supports Shield's pending Echodyne acquisition and is not a fund-administrator mark of the fund's position",
  },
  "11-openai": {
    entryValuationAmount: 852_000_000_000,
    latestValuationAmount: 1_250_000_000_000,
    latestValuation: "$1.25T valuation",
    asOf: "2026-11-06",
    source: "OpenAI priced primary round, first close of ~$11B (Bloomberg); treated as post-money",
    sourceUrl: "https://www.bloomberg.com/news/articles/2026-11-06/openai-completes-11-billion-portion-of-funding-at-1-25-trillion-value",
  },
  "12-apptronik": {
    entryValuationAmount: 4_900_000_000,
    latestValuationAmount: 4_900_000_000,
    latestValuation: "~$4.9B post-money (held at cost)",
    asOf: "2026-05-13",
    source: "ASC 820 calibration: our $34.50/sh secondary (AngelList memo, ~$4.9B post) is the latest orderly transaction; the Feb 2026 Series A-X (~$5.3B post) predates it, so no gain",
    sourceUrl: "https://apptronik.com/news-collection/apptronik-closes-over-935-million-series-a",
  },
  "38-supabase": {
    entryValuationAmount: 10_500_000_000,
    latestValuationAmount: 10_650_000_000,
    latestValuation: "$10.65B valuation",
    asOf: "2026-10-02",
    source: "Supabase Series F extension, $150M (NBR; Clarity/StockAnalysis)",
    sourceUrl: "https://www.nbr.co.nz/tech/supabase-raises-another-us150m/",
  },
  "63-anthropic": {
    entryValuationAmount: 111.5,
    latestValuationAmount: 88.91,
    latestValuation: "$88.91/share (Nasdaq: ANT close)",
    entryValuation: "$111.50/share cost",
    asOf: "2026-11-20",
    source: "Nasdaq closing price, November 20, 2026; cost $111.50/share",
    sourceUrl: "https://finance.yahoo.com/quote/ANT/history/",
    scope: "public market price per share, not a company valuation; 896.86 shares",
  },
  "17-hark": {
    entryValuationAmount: 6_000_000_000,
    latestValuationAmount: 6_000_000_000,
    latestValuation: "$6B post-money (held at cost)",
    asOf: "2026-05-21",
    source: "Same round as entry: Series A preferred at $39.7491/sh (SPV memo); Series A $700M+ at $6B post. Price per share is the same pre and post; no later round",
    sourceUrl: "https://hark.com/articles/hark-announces-usd700-million-fundraising-round",
  },
  "24-1x-series-b": {
    entryValuationAmount: 4_590_000_000,
    latestValuationAmount: 10_000_000_000,
    latestValuation: "$10B post-money",
    asOf: "2025-10-29",
    source: "SOI chronology 23 · 1X Series C",
  },
  "25-figure-ai": { entryValuationAmount: 30_000_000_000, latestValuationAmount: 39_000_000_000, latestValuation: "$39B post-money", asOf: "2025-09-16", source: "Figure Series C announcement", sourceUrl: "https://www.figure.ai/news/series-c" },
  "35-decart-ai": {
    entryValuationAmount: 3_800_000_000,
    latestValuationAmount: 3_800_000_000,
    latestValuation: "$3.8B post-money (held at cost)",
    asOf: "2026-05-18",
    source: "Same round as entry: AngelList terms — Series B primary, $300M round, $3.8B post-money; press \"~$4B\" is the same round, rounded. No later round",
    sourceUrl: "https://decart.ai/publications/decart-raises-300m-tech-leaders-back-the-company-as-both-customers-and-investors",
  },
};

// Capital contributed to Outer Rim Ventures LLC, from the Capital Contribution
// rows of the bank Transactions ledger (rebuilt from Chase ••2128 on 2026-11-20;
// Galactic Imperium's first $300,000 arrived as $299,985 + $15, rows 3 and 7). AUM is shown as this total; gifted
// positions add nothing to it.
export const LP_CAPITAL_CONTRIBUTIONS: { ledgerRow: number; date: string; amount: number }[] = [
  { ledgerRow: 3, date: "2026-04-10", amount: 300_000 },
  { ledgerRow: 6, date: "2026-04-13", amount: 300_000 },
  { ledgerRow: 63, date: "2026-08-11", amount: 20_000 },
  { ledgerRow: 67, date: "2026-08-13", amount: 5_000 },
  { ledgerRow: 68, date: "2026-08-17", amount: 5_000 },
  { ledgerRow: 72, date: "2026-09-02", amount: 20_000 },
  { ledgerRow: 75, date: "2026-09-11", amount: 100_000 },
  { ledgerRow: 78, date: "2026-09-14", amount: 50_000 },
  { ledgerRow: 91, date: "2026-11-17", amount: 100_000 },
  { ledgerRow: 94, date: "2026-11-19", amount: 25_000 },
];

export const LP_CAPITAL_CONTRIBUTED = LP_CAPITAL_CONTRIBUTIONS.reduce(
  (sum, contribution) => sum + contribution.amount,
  0,
);

// SOI chronologies kept as $0 audit rows: commitments AngelList refunded before
// closing (Corgi 2026-06-16, Sourcerer 2026-07-24, Allia Health 2026-09-24).
export const LP_REFUNDED_CHRONOLOGIES: readonly number[] = [21, 36, 57];

export const LP_PROJECTION_AS_OF = "2026-11-20";

export const LP_SNAPSHOT = {
  source: "Machine Spirit Drive · Schedule of Investments",
  sourceId: "18GiV-rADZRhI7nJpCiUv5_RUCC3iiYFfpxaE6pLJ8yo",
  sourceRange: "Sheet1!A2:L65",
  sourceModifiedAt: "2026-11-20",
  publishedAt: "2026-11-20",
  recordCount: 61,
  investedCostTotal: 964538.74,
  giftedCostTotal: 37188,
  fundCostTotal: 927350.74,
  capitalContributed: 925000,
  status: "Reconciled November 20, 2026 to Chase ••2128 (95 transactions, $626.32 balance) and the AngelList, Sydecar, YC, Capital Company and Fidelity records: fund cost $927,350.74 against $925,000 of LP capital plus $4,145 of funds deposited for accounting & expenses (not LP capital); Corgi, Sourcerer and Allia Health were refunded and are excluded; Commons Clinic added; valuation evidence refreshed November 20 (OpenAI $1.25T, Supabase $10.65B, Anthropic $88.91 Nasdaq close)",
} as const;
