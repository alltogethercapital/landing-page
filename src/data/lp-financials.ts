import "server-only";

import {
  LP_CAPITAL_CONTRIBUTED,
  LP_INVESTMENTS,
  LP_PROJECTED_VALUATION_MARKS,
  LP_SNAPSHOT,
} from "@/data/lp-investments";
import { projectedPositionValue } from "@/lib/lp-projection";

// Financial statements for Outer Rim Ventures LLC, inception (April 3, 2026)
// to November 20, 2026. Figures come only from the reconciled SOI
// (LP_INVESTMENTS), the Chase ••2128 ledger and the AngelList funding ledger
// (Reconciliation 2026-11-20). Items with no evidenced cash charge, such as
// management fees, are omitted rather than estimated. Gifted positions (1X,
// Figure AI) are held outside the fund and excluded, as they are from AUM.

export const LP_FIN_AS_OF = "2026-11-20";
export const LP_FIN_INCEPTION = "2026-04-03";

// Cash on hand at November 20, 2026.
const CASH = {
  chase: 626.32, // Chase ••2128 balance (Plaid)
  angellist: 696.94, // AngelList Investor Account (Atomarine cutback credit 11/16)
  fidelity: 11, // $11 test wire held at Fidelity ••1524
};

// Funds deposited for accounting & expenses (Rob Neir, Nov 20, 2026). Not LP
// capital: excluded from contributions and AUM, and carried as a liability
// (an expense-funding deposit held for fund expenses) until applied.
const EXPENSE_DEPOSITS = [
  { date: "2026-08-03", source: "Hisham CHK ••6712", amount: 50 },
  { date: "2026-09-11", source: "Galactic Imperium CHK ••9956", amount: 85 },
  { date: "2026-09-16", source: "Hisham SAV ••0665", amount: 4_010 },
];

// Chase bank fees: 14 outgoing wire fees, one $35 wire fee, two incoming wire
// fees, three monthly service fees and one card fee, less a $15 reversal.
const BANK_FEES_GROSS = 475;
const BANK_FEE_REVERSALS = 15;

// Commitments returned in cash after funding: AngelList refunds (oversubscription,
// failed-ACH unwinds, Corgi, Sourcerer, Allia Health, Pocket), Sydecar Stripe
// and Capital Company Nous Research. Purchases below are shown net of these.
const RETURNED_COMMITMENTS = 194_590.01 + 30_000 + 10_000;

// Deployed cost by route, per the platform records; must equal the SOI.
const DEPLOYED_BY_ROUTE: { route: string; platforms: string[]; ledger: number }[] = [
  { route: "AngelList", platforms: ["AngelList"], ledger: 498_000.74 },
  { route: "H256 (direct)", platforms: ["Direct"], ledger: 200_000 },
  { route: "Fidelity", platforms: ["Fidelity"], ledger: 100_000 },
  { route: "Sydecar", platforms: ["Sydecar"], ledger: 80_000 },
  { route: "YC", platforms: ["YC"], ledger: 25_000 },
  { route: "Capital Co.", platforms: ["Capital Company"], ledger: 24_350 },
];

const cents = (value: number) => Math.round(value * 100);
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

const fundPositions = LP_INVESTMENTS.filter((investment) => !investment.gift);

const investmentsByRoute = DEPLOYED_BY_ROUTE.map(({ route, platforms, ledger }) => {
  const positions = fundPositions.filter((investment) => platforms.includes(investment.platform));
  const cost = sum(positions.map((investment) => investment.investedCost));
  const fairValue = sum(positions.map((investment) =>
    projectedPositionValue(
      investment.investedCost,
      LP_PROJECTED_VALUATION_MARKS[investment.id],
      investment.performance,
    ),
  ));
  if (cents(cost) !== cents(ledger)) {
    throw new Error(`Financials: ${route} SOI cost ${cost} does not match ledger ${ledger}`);
  }
  return { route, count: positions.length, cost, fairValue };
});

const investmentsCost = sum(investmentsByRoute.map((item) => item.cost));
const investmentsFairValue = sum(investmentsByRoute.map((item) => item.fairValue));
const routedCount = sum(investmentsByRoute.map((item) => item.count));
const cashTotal = CASH.chase + CASH.angellist + CASH.fidelity;
const expenseDeposits = sum(EXPENSE_DEPOSITS.map((item) => item.amount));
const bankFees = BANK_FEES_GROSS - BANK_FEE_REVERSALS;
const unrealized = investmentsFairValue - investmentsCost;
const netInvestmentLoss = -bankFees;
const netIncrease = netInvestmentLoss + unrealized;
const contributions = LP_CAPITAL_CONTRIBUTED;
const totalAssets = investmentsFairValue + cashTotal;
const totalLiabilities = expenseDeposits;
const netAssets = contributions + netInvestmentLoss + unrealized;
const financing = contributions + expenseDeposits;
const netChangeInCash = financing - bankFees - investmentsCost;

export type LpStatementRow = {
  label: string;
  amount?: number;
  title?: string;
  kind?: "heading" | "item" | "subtotal" | "total";
  indent?: boolean;
};

export type LpStatement = {
  key: "balance-sheet" | "operations" | "cash-flow";
  tab: string;
  title: string;
  period: string;
  rows: LpStatementRow[];
};

const exact = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const balanceSheet: LpStatement = {
  key: "balance-sheet",
  tab: "Balance Sheet",
  title: "Statement of assets and liabilities",
  period: "Nov 20, 2026",
  rows: [
    { label: "Assets", kind: "heading" },
    ...investmentsByRoute.map((item) => ({
      label: item.route,
      amount: item.fairValue,
      indent: true,
      title: `${item.count} position${item.count === 1 ? "" : "s"} · cost ${exact(item.cost)} · value ${exact(item.fairValue)}`,
    })),
    {
      label: "Investments, at value",
      amount: investmentsFairValue,
      kind: "subtotal",
      title: `Cost ${exact(investmentsCost)}. Latest comparable valuations; positions without one at cost. Gross, not NAV. Excludes $37,188 of gifted positions held outside the fund.`,
    },
    { label: "Cash, Chase ••2128", amount: CASH.chase, indent: true, title: exact(CASH.chase) },
    { label: "Cash, AngelList", amount: CASH.angellist, indent: true, title: `${exact(CASH.angellist)} · Atomarine allocation credit, Nov 16` },
    { label: "Cash, Fidelity", amount: CASH.fidelity, indent: true, title: `${exact(CASH.fidelity)} · test wire, Nov 17` },
    { label: "Cash", amount: cashTotal, kind: "subtotal", title: exact(cashTotal) },
    { label: "Total assets", amount: totalAssets, kind: "total", title: exact(totalAssets) },
    { label: "Liabilities", kind: "heading" },
    {
      label: "Expense deposits",
      amount: expenseDeposits,
      indent: true,
      title: `Funds deposited for accounting & expenses, not LP capital: ${EXPENSE_DEPOSITS.map((item) => `${item.source} ${exact(item.amount)}`).join(" · ")}`,
    },
    { label: "Total liabilities", amount: totalLiabilities, kind: "subtotal", title: exact(totalLiabilities) },
    { label: "Net assets", kind: "heading" },
    {
      label: "Contributed capital",
      amount: LP_CAPITAL_CONTRIBUTED,
      indent: true,
      title: "Galactic Imperium $400,000 · Hisham $425,000 · Paul R Neir $100,000",
    },
    { label: "Net investment loss", amount: netInvestmentLoss, indent: true, title: exact(netInvestmentLoss) },
    { label: "Net unrealized appreciation", amount: unrealized, indent: true, title: exact(unrealized) },
    { label: "Total net assets", amount: netAssets, kind: "subtotal", title: exact(netAssets) },
    { label: "Total liabilities and net assets", amount: totalLiabilities + netAssets, kind: "total", title: exact(totalLiabilities + netAssets) },
  ],
};

const operations: LpStatement = {
  key: "operations",
  tab: "P&L",
  title: "Statement of operations",
  period: "Inception to date",
  rows: [
    { label: "Expenses", kind: "heading" },
    {
      label: "Bank fees, net",
      amount: -bankFees,
      indent: true,
      title: `Chase wire and service fees ${exact(BANK_FEES_GROSS)} less ${exact(BANK_FEE_REVERSALS)} reversal. No investment income or management fee recorded.`,
    },
    { label: "Total expenses", amount: -bankFees, kind: "subtotal", title: exact(bankFees) },
    { label: "Net investment loss", amount: netInvestmentLoss, kind: "subtotal", title: exact(netInvestmentLoss) },
    { label: "Unrealized gain on investments", kind: "heading" },
    {
      label: "Net change in unrealized appreciation",
      amount: unrealized,
      indent: true,
      title: `Value ${exact(investmentsFairValue)} less cost ${exact(investmentsCost)}`,
    },
    { label: "Net increase in net assets", amount: netIncrease, kind: "total", title: exact(netIncrease) },
  ],
};

const cashFlow: LpStatement = {
  key: "cash-flow",
  tab: "Cash Flow",
  title: "Statement of cash flows",
  period: "Inception to date",
  rows: [
    { label: "Operating activities", kind: "heading" },
    { label: "Bank fees paid, net", amount: -bankFees, indent: true, title: exact(-bankFees) },
    { label: "Net cash, operating", amount: -bankFees, kind: "subtotal", title: exact(-bankFees) },
    { label: "Investing activities", kind: "heading" },
    {
      label: "Investments purchased, net",
      amount: -investmentsCost,
      indent: true,
      title: `${exact(investmentsCost)} deployed, net of ${exact(RETURNED_COMMITMENTS)} returned (AngelList refunds, Stripe $30,000, Nous $10,000)`,
    },
    { label: "Net cash, investing", amount: -investmentsCost, kind: "subtotal", title: exact(-investmentsCost) },
    { label: "Financing activities", kind: "heading" },
    { label: "LP contributions", amount: LP_CAPITAL_CONTRIBUTED, indent: true, title: exact(LP_CAPITAL_CONTRIBUTED) },
    { label: "Expense deposits", amount: expenseDeposits, indent: true, title: "Funds deposited for accounting & expenses, not LP capital" },
    { label: "Net cash, financing", amount: financing, kind: "subtotal", title: exact(financing) },
    { label: "Net change in cash", amount: netChangeInCash, kind: "subtotal", title: exact(netChangeInCash) },
    { label: "Cash, beginning", amount: 0, indent: true, title: "Fund opened April 2026" },
    { label: "Cash, end", amount: netChangeInCash, kind: "total", title: "Chase $626.32 · AngelList $696.94 · Fidelity $11.00" },
  ],
};

// Build-time ties. A failure here stops the build rather than publishing
// statements that disagree with each other or with the SOI.
function assertFinancials() {
  if (routedCount !== fundPositions.length) {
    throw new Error(`Financials: ${fundPositions.length - routedCount} positions have no route`);
  }
  if (cents(investmentsCost) !== cents(LP_SNAPSHOT.fundCostTotal)) {
    throw new Error(`Financials: investments cost ${investmentsCost} ≠ SOI ${LP_SNAPSHOT.fundCostTotal}`);
  }
  if (cents(totalAssets) !== cents(totalLiabilities + netAssets)) {
    throw new Error(`Financials: balance sheet does not balance (${totalAssets} vs ${netAssets})`);
  }
  if (cents(netChangeInCash) !== cents(cashTotal)) {
    throw new Error(`Financials: ending cash ${netChangeInCash} ≠ balance sheet cash ${cashTotal}`);
  }
  if (cents(contributions) !== cents(925_000)) {
    throw new Error(`Financials: LP contributions ${contributions} ≠ $925,000`);
  }
  if (cents(expenseDeposits) !== cents(4_145)) {
    throw new Error(`Financials: expense deposits ${expenseDeposits} ≠ $4,145`);
  }
  if (cents(netIncrease) !== cents(netAssets - contributions)) {
    throw new Error("Financials: P&L net increase does not tie to the change in net assets");
  }
  for (const statement of [balanceSheet, operations, cashFlow]) {
    for (const row of statement.rows) {
      if (row.kind !== "heading" && (row.amount === undefined || !Number.isFinite(row.amount))) {
        throw new Error(`Financials: missing amount for ${statement.key} · ${row.label}`);
      }
    }
  }
}

assertFinancials();

export const LP_FINANCIAL_STATEMENTS: LpStatement[] = [balanceSheet, operations, cashFlow];

export const LP_FINANCIAL_TOTALS = {
  investmentsCost,
  investmentsFairValue,
  cash: cashTotal,
  totalAssets,
  totalLiabilities,
  netAssets,
  contributions,
  expenseDeposits,
  bankFees,
  unrealized,
  netIncrease,
  netChangeInCash,
} as const;
