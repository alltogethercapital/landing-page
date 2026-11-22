/** Compact, whole-dollar formatters for the LP portal. Safe for client components. */

function trimDecimals(value: number, decimals: number) {
  const rounded = Number(value.toFixed(decimals));
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(decimals).replace(/0+$/, "");
}

export function formatCompactUsd(value: number) {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs < 1_000) return `${sign}$${Math.round(abs)}`;
  if (abs < 1_000_000) return `${sign}$${trimDecimals(abs / 1_000, 1)}K`;
  if (abs < 1_000_000_000) return `${sign}$${trimDecimals(abs / 1_000_000, 1)}M`;
  if (abs < 1_000_000_000_000) return `${sign}$${trimDecimals(abs / 1_000_000_000, 1)}B`;
  return `${sign}$${trimDecimals(abs / 1_000_000_000_000, 2)}T`;
}

export function formatWholeUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatSignedWholeUsd(value: number) {
  if (value > 0) return `+${formatWholeUsd(value)}`;
  if (value < 0) return `-${formatWholeUsd(Math.abs(value))}`;
  return formatWholeUsd(0);
}

export function abbreviateLpValuation(value: string) {
  const detail = value.trim();
  if (/^uncapped\b/i.test(detail)) return { label: "Uncapped", detail };
  if (/^(N\/A|Not evidenced)$/i.test(detail)) return { label: "—", detail };
  if (/^No (co\. )?val/i.test(detail)) return { label: "No val", detail };

  const match = detail.match(/^~?\$[\d.]+[KMBT]?\b/i);
  if (match) {
    const amount = match[0].replace(/k$/i, "K");
    const rest = detail.slice(match[0].length);
    return { label: /\bcap\b/i.test(rest) ? `${amount} cap` : amount, detail };
  }

  return { label: detail, detail };
}
