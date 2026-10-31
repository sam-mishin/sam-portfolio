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
  | { kind: "help" };

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
 * Commands whose label or hint contains the query (case-insensitive,
 * surrounding spaces ignored), grouped by `group` in the order the groups
 * first appear. Every result also gets a running `index` across all
 * groups, which is what the arrow keys move through. An empty query
 * returns everything.
 */
export function filterCommands(commands: Command[], query: string): CommandGroup[] {
  const q = query.trim().toLowerCase();
  const matches = q
    ? commands.filter((c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q))
    : commands;

  const groups: CommandGroup[] = [];
  matches.forEach((command, index) => {
    let group = groups.find((g) => g.name === command.group);
    if (!group) {
      group = { name: command.group, items: [] };
      groups.push(group);
    }
    group.items.push({ ...command, index });
  });
  return groups;
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
