/**
 * lib/winfetch-data.ts — server-only data for the winfetch card: the ASCII
 * portrait (read from content/ at build time) and today's uptime.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { cacheLife } from "next/cache";
import { profile } from "@/content/profile";
import { formatUptime, uptimeBetween } from "./uptime";

/** The portrait in both palettes, plus its width in characters. */
export interface AsciiArt {
  dark: string;
  light: string;
  /** Longest line, so CSS can size the font to fit the box exactly. */
  cols: number;
}

/**
 * Reads content/ascii-dark.txt and ascii-light.txt (made by
 * scripts/make_ascii.py). Runs on the server during the build, so the
 * files never ship to the browser as separate requests.
 */
export function readAsciiArt(): AsciiArt {
  const read = (name: string) =>
    readFileSync(path.join(process.cwd(), "content", name), "utf8").replace(/\s+$/, "");
  const dark = read("ascii-dark.txt");
  const light = read("ascii-light.txt");
  const cols = Math.max(...`${dark}\n${light}`.split("\n").map((line) => line.length));
  return { dark, light, cols };
}

/**
 * The Uptime row, e.g. "3 years, 0 months, 28 days".
 *
 * Why "use cache" + cacheLife("days"): reading the clock during a static
 * build is an error under Cache Components, because the page would freeze
 * at whatever moment it was built. Caching this one value with a daily
 * lifetime keeps the page static and fast while Vercel quietly refreshes
 * it about once a day, so the number stays current without redeploys.
 * The date is taken in UTC (the server's clock), so it can roll over a
 * few hours before or after midnight in Washington.
 */
export async function getUptime(): Promise<string> {
  "use cache";
  cacheLife("days");
  return formatUptime(uptimeBetween(profile.winfetch.codingSince, new Date()));
}
