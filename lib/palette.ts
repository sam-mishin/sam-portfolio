/**
 * lib/palette.ts — the command palette's logic, kept free of React and the
 * DOM so it can be unit-tested (lib/palette.test.ts):
 * - which commands match what's typed, grouped for display
 * - moving the highlighted row with the arrow keys
 * - deciding whether a key press should open the palette
 */

/** What running a command does. */
export type CommandAction =
  | { kind: "link"; href: string }
  | { kind: "external"; href: string }
  | { kind: "copy-email" }
  | { kind: "download"; href: string }
  | { kind: "toggle-theme" }
  | { kind: "winfetch" }
  | { kind: "hire" }
  | { kind: "help" }
  /** Print fixed lines in the palette's output pane, like a shell. */
  | { kind: "print"; lines: string[] }
  /** Print something computed when the command runs. */
  | { kind: "date" }
  | { kind: "uptime" }
  | { kind: "history" }
  /** Empty the output pane. */
  | { kind: "clear" }
  /** Close the palette. */
  | { kind: "exit" }
  /** Replay the first-visit boot screen. */
  | { kind: "reboot" };

/** One row in the palette. */
export interface Command {
  /** What you'd "type", e.g. "cd ~/work". */
  label: string;
  /** Short description on the right, e.g. "Deployments". */
  hint: string;
  /** Section heading the row appears under, e.g. "Pages". */
  group: string;
  /** Decorative glyph at the start of the row. */
  icon: string;
  action: CommandAction;
}

/** A command plus its position in the flat list (for keyboard navigation). */
export interface IndexedCommand extends Command {
  index: number;
}

/** Commands under one heading, in display order. */
export interface CommandGroup {
  name: string;
  items: IndexedCommand[];
}

/**
 * How well a command matches: 0 = label is exactly the query, 1 = label
 * starts with it, 2 = label contains it, 3 = only the hint contains it,
 * null = no match. Lower is better.
 */
export function matchRank(command: Command, q: string): number | null {
  const label = command.label.toLowerCase();
  if (label === q) return 0;
  if (label.startsWith(q)) return 1;
  if (label.includes(q)) return 2;
  if (command.hint.toLowerCase().includes(q)) return 3;
  return null;
}

/**
 * Commands whose label or hint contains the query (case-insensitive,
 * surrounding spaces ignored), grouped by `group`. Every result also gets
 * a running `index` across all groups, which is what the arrow keys move
 * through, and index 0 is highlighted, so Enter runs it.
 *
 * Best matches come first: typing "history" puts the `history` command
 * above `git log --oneline`, whose hint merely mentions "history". Ties
 * keep their original order. An empty query returns everything as listed.
 */
export function filterCommands(commands: Command[], query: string): CommandGroup[] {
  const q = query.trim().toLowerCase();
  const matches = q
    ? commands
        .map((command, order) => ({ command, order, rank: matchRank(command, q) }))
        .filter((m): m is { command: Command; order: number; rank: number } => m.rank !== null)
        // Group order follows each group's best match, so sort by the
        // group's best rank first, then by each command's own rank.
        .sort((a, b) => a.rank - b.rank || a.order - b.order)
        .map((m) => m.command)
    : commands;

  const groups: { name: string; items: Command[] }[] = [];
  for (const command of matches) {
    let group = groups.find((g) => g.name === command.group);
    if (!group) {
      group = { name: command.group, items: [] };
      groups.push(group);
    }
    group.items.push(command);
  }
  // Number the rows in display order (group by group) for the arrow keys.
  let index = 0;
  return groups.map((g) => ({ name: g.name, items: g.items.map((command) => ({ ...command, index: index++ })) }));
}

/** All rows of the grouped results, in display order. */
export function flatten(groups: CommandGroup[]): IndexedCommand[] {
  return groups.flatMap((g) => g.items);
}

/**
 * The highlighted row after pressing ↑ (delta -1) or ↓ (delta +1).
 *
 * Wraps around at both ends, like the Windows Terminal command palette:
 * ↓ on the last row goes to the first, ↑ on the first goes to the last.
 * With no results there's nothing to highlight, so it returns -1.
 */
export function moveIndex(current: number, delta: number, count: number): number {
  if (count <= 0) return -1;
  if (current < 0) return delta > 0 ? 0 : count - 1;
  return (((current + delta) % count) + count) % count;
}

/** The parts of a keyboard event the shortcut check needs. */
export interface ShortcutEvent {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  /** The element that has focus (event.target). */
  target: { tagName?: string; isContentEditable?: boolean } | null;
}

/**
 * True when a key press should open the palette: "/" on its own, or
 * Ctrl+K / ⌘K. Ignored while the visitor is typing in a text field, so
 * typing "/" in a form never steals focus.
 */
export function isPaletteShortcut(event: ShortcutEvent): boolean {
  const tag = event.target?.tagName?.toLowerCase();
  const typing = tag === "input" || tag === "textarea" || tag === "select" || Boolean(event.target?.isContentEditable);
  if (typing) return false;
  if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey) return true;
  return event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey) && !event.altKey;
}
