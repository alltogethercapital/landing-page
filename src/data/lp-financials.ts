import "server-only";

import {
  LP_CAPITAL_CONTRIBUTED,
  LP_CAPITAL_CONTRIBUTIONS,
  LP_INVESTMENTS,
  LP_PROJECTED_VALUATION_MARKS,
  LP_SNAPSHOT,
} from "@/data/lp-investments";
import { projectedPositionValue } from "@/lib/lp-projection";

// Financial statements for Outer Rim Ventures LLC, inception (April 3, 2026)
// to November 20, 2026. Figures come only from the reconciled SOI
// (LP_INVESTMENTS), the Chase ••2128 ledger and the AngelList funding ledger
// (Reconciliation 2026-11-20), plus two accruals owed to the Manager (Joint
// Chancellery LLC) under the Outer Rim Ventures LLC Agreement: the §4.6
// management fee and the §3.8 fund expenses its principals paid on the fund's
// behalf. Gifted positions (1X, Figure AI) are held outside the fund and
// excluded, as they are from AUM.

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

// §3.8 fund expenses paid personally by the Manager's principals (Rob Neir,
// Hisham El-Husseini) and reimbursable by the fund ("The Fund will pay (or
// reimburse the Manager or its affiliates for) ..."), from the Joint Chancellery
// Expenses sheet (Drive 1k2BskCWSYVhj2ChnTe3HXTSS8g20M2hj). Organizational costs
// are expensed as incurred. The Manager's own costs on that sheet (domain $4,436.08,
// design $680, hosting $99) are covered by the management fee and stay off the
// fund; the 9/16 $4,000 row is the expense deposit already on the books.
const MANAGER_PAID_EXPENSES = [
  { date: "2026-01-29", payer: "Rob", item: "tkntyson formation deposit, JC + Outer Rim (1/2)", clause: "§3.8(v)", amount: 2_500 },
  { date: "2026-01-29", payer: "Hisham", item: "tkntyson formation deposit, JC + Outer Rim (2/2)", clause: "§3.8(v)", amount: 2_500 },
  { date: "2026-01-29", payer: "Rob", item: "Outer Rim Delaware registered agent", clause: "§3.8(iv)", amount: 49 },
  { date: "2026-04-09", payer: "Rob", item: "tkntyson final bill, JC + Outer Rim (1/2)", clause: "§3.8(v)", amount: 5_978.34 },
  { date: "2026-04-09", payer: "Hisham", item: "tkntyson final bill, JC + Outer Rim (2/2)", clause: "§3.8(v)", amount: 5_978.34 },
  { date: "2026-05-01", payer: "Hisham", item: "CSC Delaware formation, Joint Chancellery", clause: "§3.8(v)", amount: 555.97 },
  { date: "2026-05-24", payer: "Rob", item: "CSC Delaware formation, Outer Rim", clause: "§3.8", amount: 555.97 },
];

// §4.6 management fee: 2.0% per annum of Assets Under Management (aggregate
// gross asset value, no reduction for indebtedness or reserves), billed
// quarterly in advance on AUM at the prior fiscal quarter end. Not yet paid
// (no bank line), so accrued as due to the Manager. Expense is recognised
// ratably over the service period; the unearned rest of Q4 is not booked.
// AUM at each quarter end = deposits received to date (LP capital + expense
// deposits) less bank fees paid to date, plus unrealized appreciation on
// positions held, using only marks dated on or before that quarter end.
const MANAGEMENT_FEE_RATE = 0.02;
const FEE_QUARTERS = [
  // Initial Closing 4/10/2026; AUM at 3/31/2026 was $0, so no Q2 fee.
  { quarter: "Q2 2026", baseDate: "2026-03-31", depositsToDate: 0, feesPaidToDate: 0, accruedDays: 82, quarterDays: 82 },
  { quarter: "Q3 2026", baseDate: "2026-06-30", depositsToDate: 600_000, feesPaidToDate: 235, accruedDays: 92, quarterDays: 92 },
  { quarter: "Q4 2026", baseDate: "2026-09-30", depositsToDate: 804_145, feesPaidToDate: 330, accruedDays: 51, quarterDays: 92 },
];

const exact = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
const whole = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
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

const unrealizedAt = (date: string) => sum(fundPositions
  .filter((investment) => investment.investmentDate <= date)
  .map((investment) => {
    const mark = LP_PROJECTED_VALUATION_MARKS[investment.id];
    const performance = investment.performance && investment.performance.asOf <= date ? investment.performance : undefined;
    return projectedPositionValue(investment.investedCost, mark && mark.asOf <= date ? mark : undefined, performance) - investment.investedCost;
  }));

const round2 = (value: number) => Math.round(value * 100) / 100;
const feeQuarters = FEE_QUARTERS.map((quarter) => {
  const aum = round2(quarter.depositsToDate - quarter.feesPaidToDate + (quarter.depositsToDate ? unrealizedAt(quarter.baseDate) : 0));
  const quarterFee = round2(aum * MANAGEMENT_FEE_RATE / 4);
  const accrued = round2(quarterFee * quarter.accruedDays / quarter.quarterDays);
  return { ...quarter, aum, quarterFee, accrued };
});
const managementFee = sum(feeQuarters.map((quarter) => quarter.accrued));
const managerPaidExpenses = sum(MANAGER_PAID_EXPENSES.map((item) => item.amount));
const dueToManager = managementFee + managerPaidExpenses;
const feeDetail = feeQuarters
  .filter((quarter) => quarter.aum > 0)
  .map((quarter) => `${quarter.quarter}: 0.5% × AUM ${exact(quarter.aum)} at ${quarter.baseDate} = ${exact(quarter.quarterFee)}${quarter.accruedDays < quarter.quarterDays ? ` × ${quarter.accruedDays}/${quarter.quarterDays} days = ${exact(quarter.accrued)}` : ""}`)
  .join(" · ");

const investmentsCost = sum(investmentsByRoute.map((item) => item.cost));
const investmentsFairValue = sum(investmentsByRoute.map((item) => item.fairValue));
const routedCount = sum(investmentsByRoute.map((item) => item.count));
const cashTotal = CASH.chase + CASH.angellist + CASH.fidelity;
const expenseDeposits = sum(EXPENSE_DEPOSITS.map((item) => item.amount));
const bankFees = BANK_FEES_GROSS - BANK_FEE_REVERSALS;
const unrealized = investmentsFairValue - investmentsCost;
const totalExpenses = bankFees + managementFee + managerPaidExpenses;
const netInvestmentLoss = -totalExpenses;
const netIncrease = netInvestmentLoss + unrealized;
const contributions = LP_CAPITAL_CONTRIBUTED;
const totalAssets = investmentsFairValue + cashTotal;
const totalLiabilities = expenseDeposits + dueToManager;
const netAssets = contributions + netInvestmentLoss + unrealized;
const financing = contributions + expenseDeposits;
// Indirect method, investment-company presentation: purchases of investments
// are operating activities; capital and expense deposits are financing.
// Accrued fee and manager-paid expenses are non-cash: added back as the
// increase in due to manager.
const operatingCash = netIncrease - unrealized + dueToManager - investmentsCost;
const netChangeInCash = operatingCash + financing;

export type LpStatementRow = {
  label: string;
  // Phone-width label, so rows stay on one line without truncation.
  shortLabel?: string;
  amount?: number;
  title?: string;
  // heading: section caption · label: sub-caption without an amount ·
  // item: line item · subtotal: single rule above · total: grand total,
  // single rule above and double rule below.
  kind?: "heading" | "label" | "item" | "subtotal" | "total";
  indent?: 0 | 1 | 2;
};

export type LpStatement = {
  key: "balance-sheet" | "operations" | "cash-flow";
  tab: string;
  title: string;
  shortTitle: string;
  dateLine: string;
  rows: LpStatementRow[];
};

export const LP_FIN_ENTITY = "Outer Rim Ventures LLC";
export const LP_FIN_MANAGER = "Machine Spirit Capital";
const PERIOD_LINE = "For the period ended November 20, 2026";
export const LP_FIN_PERIOD_DETAIL = "From April 3, 2026 (inception) to November 20, 2026";


const balanceSheet: LpStatement = {
  key: "balance-sheet",
  tab: "Balance Sheet",
  title: "Statement of Assets, Liabilities and Partners' Capital",
  shortTitle: "Assets, Liabilities & Partners' Capital",
  dateLine: "As of November 20, 2026",
  rows: [
    { label: "Assets", kind: "heading" },
    { shortLabel: `Investments (cost ${whole(investmentsCost)})`, label: `Investments, at value (cost ${whole(investmentsCost)})`, kind: "label", indent: 1, title: `Cost ${exact(investmentsCost)}. Latest comparable valuations; positions without one at cost. Gross, not NAV. Excludes $37,188 of gifted positions held outside the fund.` },
    ...investmentsByRoute.map((item) => ({
      label: item.route,
      amount: item.fairValue,
      indent: 2 as const,
      title: `${item.count} position${item.count === 1 ? "" : "s"} · cost ${exact(item.cost)} · value ${exact(item.fairValue)}`,
    })),
    { shortLabel: "Total investments", label: "Total investments, at value", amount: investmentsFairValue, kind: "subtotal", indent: 1, title: exact(investmentsFairValue) },
    { label: "Cash", amount: cashTotal, indent: 1, title: `Chase ••2128 ${exact(CASH.chase)} · AngelList ${exact(CASH.angellist)} · Fidelity ${exact(CASH.fidelity)}` },
    { label: "Total assets", amount: totalAssets, kind: "total", title: exact(totalAssets) },
    { label: "Liabilities", kind: "heading" },
    {
      label: "Expense deposits",
      amount: expenseDeposits,
      indent: 1,
      title: `Funds deposited for accounting & expenses, not LP capital: ${EXPENSE_DEPOSITS.map((item) => `${item.source} ${exact(item.amount)}`).join(" · ")}`,
    },
    {
      shortLabel: "Due to manager", label: "Due to manager (Joint Chancellery)",
      amount: dueToManager,
      indent: 1,
      title: `Accrued management fee ${exact(managementFee)} (§4.6) + fund expenses paid by the Manager ${exact(managerPaidExpenses)} (§3.8, reimbursable). Unpaid.`,
    },
    { label: "Total liabilities", amount: totalLiabilities, kind: "subtotal", title: exact(totalLiabilities) },
    { label: "Partners' capital", kind: "heading" },
    { label: "Contributed capital", amount: contributions, indent: 1, title: "Galactic Imperium $400,000 · Hisham $425,000 · Paul R Neir $100,000" },
    { shortLabel: "Net investment loss", label: "Accumulated net investment loss", amount: netInvestmentLoss, indent: 1, title: exact(netInvestmentLoss) },
    { shortLabel: "Unrealized appreciation", label: "Net unrealized appreciation", amount: unrealized, indent: 1, title: exact(unrealized) },
    { label: "Total partners' capital", amount: netAssets, kind: "subtotal", title: exact(netAssets) },
    { shortLabel: "Total liabilities & capital", label: "Total liabilities and partners' capital", amount: totalLiabilities + netAssets, kind: "total", title: exact(totalLiabilities + netAssets) },
  ],
};

const operations: LpStatement = {
  key: "operations",
  tab: "P&L",
  title: "Statement of Operations",
  shortTitle: "Statement of Operations",
  dateLine: PERIOD_LINE,
  rows: [
    { label: "Expenses", kind: "heading" },
    {
      label: "Bank and wire fees, net",
      amount: bankFees,
      indent: 1,
      title: `Chase wire and service fees ${exact(BANK_FEES_GROSS)} less ${exact(BANK_FEE_REVERSALS)} reversal. No investment income recorded.`,
    },
    {
      label: "Management fee",
      amount: managementFee,
      indent: 1,
      title: `§4.6, 2% a year of gross assets, billed quarterly in advance on prior quarter-end AUM; accrued, unpaid. Q2 2026: $0 (AUM $0 at 3/31) · ${feeDetail}`,
    },
    {
      shortLabel: "Fund expenses paid by JC", label: "Fund expenses paid by manager (Joint Chancellery)",
      amount: managerPaidExpenses,
      indent: 1,
      title: `§3.8 organizational and legal costs paid by Rob and Hisham, reimbursable: tkntyson legal ${exact(16_956.68)} · CSC formation ${exact(1_111.94)} · registered agent ${exact(49)}`,
    },
    { label: "Total expenses", amount: totalExpenses, kind: "subtotal", title: exact(totalExpenses) },
    { label: "Net investment loss", amount: netInvestmentLoss, kind: "subtotal", title: exact(netInvestmentLoss) },
    { label: "Realized and unrealized gain", kind: "heading" },
    {
      shortLabel: "Unrealized appreciation", label: "Net change in unrealized appreciation",
      amount: unrealized,
      indent: 1,
      title: `Value ${exact(investmentsFairValue)} less cost ${exact(investmentsCost)}. No realizations to date.`,
    },
    { shortLabel: "Net gain on investments", label: "Net realized and unrealized gain", amount: unrealized, kind: "subtotal", title: exact(unrealized) },
    { shortLabel: "Net increase from operations", label: "Net increase in partners' capital from operations", amount: netIncrease, kind: "total", title: exact(netIncrease) },
  ],
};

const cashFlow: LpStatement = {
  key: "cash-flow",
  tab: "Cash Flow",
  title: "Statement of Cash Flows",
  shortTitle: "Statement of Cash Flows",
  dateLine: PERIOD_LINE,
  rows: [
    { label: "Operating activities", kind: "heading" },
    { shortLabel: "Net increase from operations", label: "Net increase in partners' capital from operations", amount: netIncrease, indent: 1, title: exact(netIncrease) },
    { shortLabel: "Adjustments:", label: "Adjustments to reconcile to net cash:", kind: "label", indent: 1 },
    { shortLabel: "Unrealized appreciation", label: "Net change in unrealized appreciation", amount: -unrealized, indent: 2, title: exact(-unrealized) },
    {
      shortLabel: "Due to manager", label: "Increase in due to manager",
      amount: dueToManager,
      indent: 2,
      title: `Accrued management fee ${exact(managementFee)} + fund expenses paid by the Manager ${exact(managerPaidExpenses)}; no cash paid`,
    },
    {
      shortLabel: "Purchases, net", label: "Purchases of investments, net",
      amount: -investmentsCost,
      indent: 2,
      title: `${exact(investmentsCost)} deployed, net of ${exact(RETURNED_COMMITMENTS)} returned (AngelList refunds, Stripe $30,000, Nous $10,000)`,
    },
    { shortLabel: "Net cash, operating", label: "Net cash used in operating activities", amount: operatingCash, kind: "subtotal", title: exact(operatingCash) },
    { label: "Financing activities", kind: "heading" },
    { label: "Capital contributions", amount: contributions, indent: 1, title: "Galactic Imperium $400,000 · Hisham $425,000 · Paul R Neir $100,000" },
    { label: "Expense deposits received", amount: expenseDeposits, indent: 1, title: "Funds deposited for accounting & expenses, not LP capital" },
    { shortLabel: "Net cash, financing", label: "Net cash provided by financing activities", amount: financing, kind: "subtotal", title: exact(financing) },
    { label: "Net increase in cash", amount: netChangeInCash, kind: "subtotal", title: exact(netChangeInCash) },
    { label: "Cash, beginning of period", amount: 0, indent: 1, title: "Fund opened April 2026" },
    { label: "Cash, end of period", amount: netChangeInCash, kind: "total", title: `Chase ${exact(CASH.chase)} · AngelList ${exact(CASH.angellist)} · Fidelity ${exact(CASH.fidelity)}` },
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
  // The fee accrual is fixed at the quarter-end bases already billed; later
  // marks must not move it.
  if (cents(managementFee) !== cents(5_410.67)) {
    throw new Error(`Financials: management fee ${managementFee} ≠ $5,410.67`);
  }
  if (cents(managerPaidExpenses) !== cents(18_117.62)) {
    throw new Error(`Financials: manager-paid fund expenses ${managerPaidExpenses} ≠ $18,117.62`);
  }
  if (cents(totalExpenses) !== cents(bankFees + managementFee + managerPaidExpenses)) {
    throw new Error("Financials: total expenses do not foot");
  }
  if (cents(dueToManager) !== cents(totalLiabilities - expenseDeposits)) {
    throw new Error("Financials: due to manager does not tie to liabilities");
  }
  if (cents(feeQuarters[0].accrued) !== 0 || cents(feeQuarters[1].depositsToDate) !== cents(600_000)
    || cents(feeQuarters[2].depositsToDate) !== cents(sum(LP_CAPITAL_CONTRIBUTIONS.filter((item) => item.date <= "2026-09-30").map((item) => item.amount)) + expenseDeposits)) {
    throw new Error("Financials: management-fee AUM bases do not tie to deposits");
  }
  if (cents(operatingCash) !== cents(-bankFees - investmentsCost)) {
    throw new Error("Financials: operating cash does not equal fees paid plus net purchases");
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
      if (row.kind !== "heading" && row.kind !== "label" && (row.amount === undefined || !Number.isFinite(row.amount))) {
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
  managementFee,
  managerPaidExpenses,
  dueToManager,
  totalExpenses,
  netInvestmentLoss,
  unrealized,
  netIncrease,
  netChangeInCash,
} as const;
