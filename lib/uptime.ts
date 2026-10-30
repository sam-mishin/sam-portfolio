/**
 * lib/uptime.ts — the "Uptime" row on the winfetch card: how long Sam has
 * been building software for clients, as "3 years, 0 months, 28 days".
 *
 * Pure date math with no clock access, so it can be unit-tested
 * (lib/uptime.test.ts). The caller passes "today".
 */

/** A difference between two dates in calendar years, months and days. */
export interface Uptime {
  years: number;
  months: number;
  days: number;
}

/** Parses "YYYY-MM-DD" as a UTC calendar date (no time-zone drift). */
function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** Number of days in a month (month is 0-based, like Date). */
function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

/**
 * `start` moved forward by a whole number of months, with the day clamped
 * to the end of the target month (Jan 31 + 1 month = Feb 28, or 29).
 */
function addMonths(start: Date, months: number): Date {
  const total = start.getUTCMonth() + months;
  const year = start.getUTCFullYear() + Math.floor(total / 12);
  const month = ((total % 12) + 12) % 12;
  const day = Math.min(start.getUTCDate(), daysInMonth(year, month));
  return new Date(Date.UTC(year, month, day));
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Whole calendar years, months and days from `since` to `today`.
 *
 * Why not just subtract year, month and day fields? That breaks when the
 * start day doesn't exist in a later month: Jan 31 → Mar 1 would come out
 * as "1 month, −2 days". Instead this counts the most whole months that
 * fit (clamping to month ends, so Feb 29 → Feb 28 in non-leap years
 * counts as a full year), then counts the leftover days.
 *
 * @param since Start date as "YYYY-MM-DD".
 * @param today The date to measure to. Only its UTC calendar date is used.
 * @returns Zeros if `today` is before `since`.
 */
export function uptimeBetween(since: string, today: Date): Uptime {
  const start = parseDate(since);
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  if (end < start) return { years: 0, months: 0, days: 0 };

  // Rough guess from the fields, then step back while it overshoots.
  let months =
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + (end.getUTCMonth() - start.getUTCMonth());
  while (months > 0 && addMonths(start, months) > end) months -= 1;

  const anchor = addMonths(start, months);
  const days = Math.round((end.getTime() - anchor.getTime()) / MS_PER_DAY);
  return { years: Math.floor(months / 12), months: months % 12, days };
}

/** "1 year", "2 months", "0 days" — plural unless the count is exactly 1. */
function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/** Formats an {@link Uptime} as "3 years, 0 months, 28 days". */
export function formatUptime({ years, months, days }: Uptime): string {
  return `${plural(years, "year")}, ${plural(months, "month")}, ${plural(days, "day")}`;
}
