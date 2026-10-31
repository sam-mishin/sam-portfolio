/**
 * lib/palette.test.ts — tests for the command palette's filtering, keyboard
 * index logic and shortcut detection.
 */
import { describe, expect, it } from "vitest";
import { type Command, filterCommands, flatten, isPaletteShortcut, moveIndex } from "./palette";

const cmd = (label: string, hint: string, group: string): Command => ({
  label,
  hint,
  group,
  icon: "▸",
  action: { kind: "help" },
});

const commands: Command[] = [
  cmd("cd ~/work", "Deployments", "Pages"),
  cmd("cd ~/contact", "Email, LinkedIn, GitHub", "Pages"),
  cmd("open trellis", "Wine club billing", "Projects"),
  cmd("cp email", "Copy the address", "Actions"),
  cmd("winfetch", "Show the profile card", "Actions"),
];

describe("filterCommands", () => {
  it("returns every command, grouped in order, for an empty query", () => {
    const groups = filterCommands(commands, "");
    expect(groups.map((g) => g.name)).toEqual(["Pages", "Projects", "Actions"]);
    expect(flatten(groups)).toHaveLength(commands.length);
  });

  it("matches the label or the hint, ignoring case and outer spaces", () => {
    expect(flatten(filterCommands(commands, "  TRELLIS ")).map((c) => c.label)).toEqual(["open trellis"]);
    expect(flatten(filterCommands(commands, "linkedin")).map((c) => c.label)).toEqual(["cd ~/contact"]);
  });

  it("drops groups with no matches", () => {
    // "cp email" matches by label, "cd ~/contact" only by hint, so Actions leads.
    expect(filterCommands(commands, "email").map((g) => g.name)).toEqual(["Actions", "Pages"]);
  });

  it("numbers results continuously across groups", () => {
    const indexes = flatten(filterCommands(commands, "e")).map((c) => c.index);
    expect(indexes).toEqual(indexes.map((_, i) => i));
  });

  it("puts exact and prefix label matches above hint-only matches", () => {
    const list = [cmd("git log", "Career history", "Shell"), cmd("history", "Commands you ran", "Shell")];
    expect(flatten(filterCommands(list, "history")).map((c) => c.label)).toEqual(["history", "git log"]);
  });

  it("orders groups by their best match", () => {
    const list = [cmd("cd ~/work", "Deployments", "Pages"), cmd("winfetch", "Profile card", "Actions")];
    expect(filterCommands(list, "win").map((g) => g.name)).toEqual(["Actions"]);
    expect(filterCommands([...list, cmd("open winery", "x", "Projects")], "w").map((g) => g.name)).toEqual(["Actions", "Pages", "Projects"]);
  });

  it("returns no groups when nothing matches", () => {
    expect(filterCommands(commands, "rm -rf /")).toEqual([]);
  });
});

describe("moveIndex", () => {
  it("moves down and up", () => {
    expect(moveIndex(0, 1, 5)).toBe(1);
    expect(moveIndex(3, -1, 5)).toBe(2);
  });

  it("wraps from the last row to the first and back", () => {
    expect(moveIndex(4, 1, 5)).toBe(0);
    expect(moveIndex(0, -1, 5)).toBe(4);
  });

  it("starts at the first row going down, or the last going up, when nothing is highlighted", () => {
    expect(moveIndex(-1, 1, 5)).toBe(0);
    expect(moveIndex(-1, -1, 5)).toBe(4);
  });

  it("has nothing to highlight when there are no results", () => {
    expect(moveIndex(0, 1, 0)).toBe(-1);
  });

  it("stays put with a single result", () => {
    expect(moveIndex(0, 1, 1)).toBe(0);
    expect(moveIndex(0, -1, 1)).toBe(0);
  });
});

describe("isPaletteShortcut", () => {
  const press = (key: string, mods: Partial<{ ctrlKey: boolean; metaKey: boolean; altKey: boolean }> = {}, tagName = "BODY") => ({
    key,
    ctrlKey: false,
    metaKey: false,
    altKey: false,
    ...mods,
    target: { tagName, isContentEditable: false },
  });

  it("opens on / and on Ctrl+K or ⌘K", () => {
    expect(isPaletteShortcut(press("/"))).toBe(true);
    expect(isPaletteShortcut(press("k", { ctrlKey: true }))).toBe(true);
    expect(isPaletteShortcut(press("K", { metaKey: true }))).toBe(true);
  });

  it("ignores plain letters and other modifier combos", () => {
    expect(isPaletteShortcut(press("k"))).toBe(false);
    expect(isPaletteShortcut(press("/", { ctrlKey: true }))).toBe(false);
    expect(isPaletteShortcut(press("k", { ctrlKey: true, altKey: true }))).toBe(false);
  });

  it("ignores the shortcut while typing in a field", () => {
    expect(isPaletteShortcut(press("/", {}, "INPUT"))).toBe(false);
    expect(isPaletteShortcut(press("k", { ctrlKey: true }, "TEXTAREA"))).toBe(false);
    expect(isPaletteShortcut({ ...press("/"), target: { tagName: "DIV", isContentEditable: true } })).toBe(false);
  });
});
