import "server-only";

import { cache } from "react";
import {
  LP_COMPANY_HISTORY,
  LP_COMPANY_HISTORY_REVIEWED,
  type LpCompanyNews,
  type LpCompanyRound,
} from "@/data/lp-company-history";
import { LP_INVESTMENTS, LP_PROJECTED_VALUATION_MARKS } from "@/data/lp-investments";
import { performanceRows, type ValuationCell } from "@/components/lp-letter-figures";
import { lpCompanyKey, lpCompanySlug } from "@/lib/lp-company-key";
import { requireLpSession } from "@/lib/lp-auth";
import { getCompanyContext } from "@/lib/lp-data";
import { formatCompactUsd } from "@/lib/lp-format";

export type LpCompanyDetailPosition = {
  id: string;
  /** "Series D · Equity · Apr 25, 2026" */
  label: string;
  entry: ValuationCell;
  mark: ValuationCell;
  markUrl?: string;
  cost: number;
  value: number;
  multiple: number;
  gift?: true;
};

export type LpCompanyDetailRound = {
  date: string;
  round: string;
  raised: string;
  valuation: string;
  lead: string;
  ours: boolean;
  /** Fund entry row built from portal entry terms (no public round matched). */
  entryRow: boolean;
  sourceUrl?: string;
};

export type LpCompanyChartPoint = { date: string; time: number; value: number; label: string };

export type LpCompanyDetail = {
  key: string;
  slug: string;
  name: string;
  descriptor: string;
  sector: string;
  website?: string;
  positions: LpCompanyDetailPosition[];
  rounds: LpCompanyDetailRound[];
  news: LpCompanyNews[];
  chart: { rounds: LpCompanyChartPoint[]; entries: LpCompanyChartPoint[] } | null;
  lastReviewed: string;
};

const INSTRUMENT_SHORT: Record<string, string> = {
  "Convertible Notes": "Notes",
  Equity: "Equity",
  "Public Equity": "Public",
  SAFE: "SAFE",
  Secondary: "Secondary",
  SPV: "SPV",
};

const COMPANY_OVERRIDES: Record<string, { descriptor: string; website: string }> = {
  Anduril: { descriptor: "Defense tech · via H256 LLC Series 3", website: "https://www.anduril.com/" },
};

// Month-only dates sit mid-month and year-only dates mid-year on the chart.
function isoTime(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return Date.UTC(year, month ? month - 1 : 6, day || (month ? 15 : 1));
}

export function formatLpDetailDate(date: string, style: "day" | "month" = "day") {
  const parts = date.split("-");
  if (parts.length === 1) return date;
  const time = new Date(isoTime(date));
  if (parts.length === 2 || style === "month") {
    return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(time);
  }
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(time);
}

function entryAmount(position: (typeof LP_INVESTMENTS)[number]) {
  if (position.vehicleAllocation) return position.vehicleAllocation.deployedEntryValuationAmount;
  const match = position.entryValuation.match(/^~?\$([\d.]+)([KMBT])\b/i);
  if (match) {
    const scale = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 }[match[2].toUpperCase() as "K" | "M" | "B" | "T"];
    return Number(match[1]) * scale;
  }
  const mark = LP_PROJECTED_VALUATION_MARKS[position.id];
  return mark && mark.entryValuationAmount >= 1e6 ? mark.entryValuationAmount : undefined;
}

function cellText(cell: ValuationCell) {
  return `${cell.label}${cell.suffix ?? ""}`;
}

function roundRow(round: LpCompanyRound): LpCompanyDetailRound {
  return {
    date: round.date,
    round: round.round,
    raised: round.raised ? formatCompactUsd(round.raised) : "undisclosed",
    valuation: round.postLabel ?? (round.postMoney ? formatCompactUsd(round.postMoney) : "undisclosed"),
    lead: round.lead ?? "",
    ours: Boolean(round.ours),
    entryRow: false,
    sourceUrl: round.sourceUrl,
  };
}

function buildDetails() {
  const rows = performanceRows();
  const keys = [...new Set(LP_INVESTMENTS.map((position) => lpCompanyKey(position)))];
  const details = new Map<string, LpCompanyDetail>();

  for (const key of keys) {
    const history = LP_COMPANY_HISTORY[key];
    if (!history) throw new Error(`Missing LP company history: ${key}`);
    const records = LP_INVESTMENTS.filter((position) => lpCompanyKey(position) === key);
    const first = records[0];
    const context = getCompanyContext(first.company);
    const override = COMPANY_OVERRIDES[key];

    const positions: LpCompanyDetailPosition[] = [];
    for (const record of records) {
      const row = rows.find((candidate) => candidate.positionId === record.id && candidate.companyKey === key);
      if (!row) throw new Error(`Missing performance row: ${record.id}`);
      const round = record.round === "N/A" ? null : record.round.replace(/^Public \(.*\)$/, "Public");
      const instrument = INSTRUMENT_SHORT[record.instrument] ?? record.instrument;
      const label = [round, round === instrument ? null : instrument, formatLpDetailDate(record.investmentDate)]
        .filter(Boolean)
        .join(" · ");
      positions.push({
        id: record.id,
        label,
        entry: row.entry,
        mark: row.mark,
        markUrl: row.markUrl,
        cost: row.cost,
        value: row.value,
        multiple: row.multiple,
        gift: row.gift,
      });
    }

    const publicRounds = history.rounds.map(roundRow);
    const hasOurs = history.rounds.some((round) => round.ours);
    const entryRows: LpCompanyDetailRound[] = hasOurs
      ? []
      : records.map((record) => {
          const row = rows.find((candidate) => candidate.positionId === record.id && candidate.companyKey === key)!;
          return {
            date: record.investmentDate,
            round: record.round === "N/A" ? (record.instrument === "SPV" ? "SPV" : "Entry") : record.round.replace(/^Public \(.*\)$/, "Public"),
            raised: "—",
            valuation: cellText(row.entry),
            lead: record.gift ? "Our entry · gift" : "Our entry",
            ours: true,
            entryRow: true,
          };
        });
    const rounds = [...publicRounds, ...entryRows].sort((left, right) => isoTime(right.date) - isoTime(left.date));

    const chartRounds = history.rounds
      .filter((round) => round.postMoney)
      .map((round) => ({
        date: round.date,
        time: isoTime(round.date),
        value: round.postMoney!,
        label: round.postLabel ?? formatCompactUsd(round.postMoney!),
      }))
      .sort((left, right) => left.time - right.time);
    const chartEntries = records
      .map((record) => ({ record, amount: entryAmount(record) }))
      .filter((item): item is { record: (typeof records)[number]; amount: number } => Boolean(item.amount))
      .map(({ record, amount }) => ({
        date: record.investmentDate,
        time: isoTime(record.investmentDate),
        value: amount,
        label: formatCompactUsd(amount),
      }));
    const chart = chartRounds.length >= 1 && chartRounds.length + chartEntries.length >= 2
      ? { rounds: chartRounds, entries: chartEntries }
      : null;

    const news = [...history.news].sort((left, right) => right.date.localeCompare(left.date)).slice(0, 5);

    details.set(lpCompanySlug(key), {
      key,
      slug: lpCompanySlug(key),
      name: key,
      descriptor: override?.descriptor ?? context?.description ?? first.description ?? "",
      sector: history.sector,
      website: override?.website ?? context?.website,
      positions,
      rounds,
      news,
      chart,
      lastReviewed: history.lastReviewed || LP_COMPANY_HISTORY_REVIEWED,
    });
  }
  return details;
}

let detailCache: Map<string, LpCompanyDetail> | null = null;

function allDetails() {
  detailCache ??= buildDetails();
  return detailCache;
}

/** Validates the history file against the SOI at build time (called from tests and pages). */
export function assertLpCompanyHistory() {
  allDetails();
  for (const [key, history] of Object.entries(LP_COMPANY_HISTORY)) {
    for (const item of [...history.rounds.map((round) => ({ date: round.date, url: round.sourceUrl })), ...history.news]) {
      if (!/^\d{4}(-\d{2}(-\d{2})?)?$/.test(item.date)) throw new Error(`Invalid history date: ${key} ${item.date}`);
      if (!item.url.startsWith("https://")) throw new Error(`Invalid history source: ${key} ${item.url}`);
    }
  }
}

export const getLpCompanyDetail = cache(async (slug: string) => {
  await requireLpSession();
  return allDetails().get(slug) ?? null;
});
