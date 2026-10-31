/**
 * lib/shell.ts — the logic behind typing commands (the interactive prompt
 * at the bottom of the winfetch card), kept free of React so it can be
 * unit-tested (lib/shell.test.ts):
 * - turning what was typed into a command, forgiving case, extra spaces
 *   and common habits (`cls`, `cd work`, `neofetch`…)
 * - Tab completion
 * - a command history shared by the terminal and the palette
 */
import type { Command } from "./palette";

/** Lowercase, trimmed, single-spaced: how typed input is compared. */
export function normalize(input: string): string {
  return input.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * The command a typed line means, or null if there isn't one.
 *
 * Matches a command's label exactly (ignoring case and spacing), then an
 * alias (`cls` → `clear`), then `cd <section>` without the `~/`.
 */
export function resolveInput(input: string, commands: Command[], aliases: Record<string, string>): Command | null {
  const typed = normalize(input);
  if (!typed) return null;
  const byLabel = (label: string) => commands.find((c) => normalize(c.label) === normalize(label)) ?? null;
  const direct = byLabel(typed) ?? (aliases[typed] ? byLabel(aliases[typed]) : null);
  if (direct) return direct;
  // "cd work" or "cd ./work" means "cd ~/work".
  const cd = typed.match(/^cd (?:\.\/)?([\w-]+)\/?$/);
  return cd ? byLabel(`cd ~/${cd[1]}`) : null;
}

/**
 * Tab completion: the typed text extended as far as all matching command
 * labels agree, or null if nothing new can be added (no match, or the
 * matches disagree right away). One match completes it fully.
 */
export function complete(input: string, labels: string[]): string | null {
  const typed = input.replace(/^\s+/, "").toLowerCase();
  if (!typed) return null;
  const matches = labels.filter((label) => label.toLowerCase().startsWith(typed));
  if (matches.length === 0) return null;
  let prefix = matches[0];
  for (const label of matches.slice(1)) {
    let i = 0;
    while (i < prefix.length && i < label.length && prefix[i].toLowerCase() === label[i].toLowerCase()) i++;
    prefix = prefix.slice(0, i);
  }
  return prefix.length > typed.length ? prefix : null;
}

/** Commands run this visit, oldest first, from either the terminal or the palette. */
const history: string[] = [];

/** Record a command for `history`. */
export function remember(label: string): void {
  history.push(label);
}

/** Everything run so far this visit. */
export function getHistory(): readonly string[] {
  return history;
}
