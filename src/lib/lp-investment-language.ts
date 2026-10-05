export type InvestmentPlatform =
  | "AngelList"
  | "Capital Company"
  | "Direct"
  | "Echo"
  | "Sydecar";

export type InvestmentInstrument =
  | "Convertible Notes"
  | "Equity"
  | "SAFE"
  | "Secondary"
  | "SPV";

const INVESTMENT_ACCESS_LABELS: Record<InvestmentPlatform, string> = {
  AngelList: "Invested with a group",
  "Capital Company": "Invested with a group",
  Direct: "Invested directly",
  Echo: "Invested with a group",
  Sydecar: "Invested with a group",
};

const OWNERSHIP_LABELS: Record<InvestmentInstrument, string> = {
  "Convertible Notes": "Loan that may become shares",
  Equity: "Shares in the company",
  SAFE: "Right to future shares",
  Secondary: "Existing company shares",
  SPV: "Investment held through a dedicated company",
};

export function getLpInvestmentLanguage(
  platform: InvestmentPlatform,
  instrument: InvestmentInstrument,
) {
  return {
    investmentAccess: INVESTMENT_ACCESS_LABELS[platform],
    ownershipType: OWNERSHIP_LABELS[instrument],
  };
}

export function formatLpValuation(value: string) {
  return value
    .replace(/^~/, "About ")
    .replace(/^Uncapped SAFE$/i, "No valuation cap")
    .replace(/\bpost-money cap\b/gi, "valuation cap")
    .replace(/\bpost-money\b/gi, "after the round")
    .replace(/\bpre-money\b/gi, "before the round")
    .replace(/\bNo co\. val\b/gi, "No company valuation")
    .replace(/\bNo val\b/gi, "No company valuation")
    .replace(/\bSPV\b/g, "investment entity");
}

export function formatLpRound(value: string) {
  if (value === "N/A") return "Not applicable";
  if (value === "Class A Preferred Units") return "Class A preferred ownership units";
  return value;
}
