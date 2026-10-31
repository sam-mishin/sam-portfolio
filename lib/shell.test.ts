/**
 * lib/shell.test.ts — tests for typed-command matching and Tab completion.
 */
import { describe, expect, it } from "vitest";
import type { Command } from "./palette";
import { complete, normalize, resolveInput } from "./shell";

const cmd = (label: string): Command => ({ label, hint: "", group: "Shell", icon: ">", action: { kind: "help" } });
const commands = [cmd("ls"), cmd("clear"), cmd("cd ~/work"), cmd("cd ~/contact"), cmd("cat resume.txt"), cmd("cp email")];
const aliases = { cls: "clear", dir: "ls" };

describe("normalize", () => {
  it("trims, lowercases and collapses spaces", () => {
    expect(normalize("  CD   ~/Work ")).toBe("cd ~/work");
  });
});

describe("resolveInput", () => {
  it("matches labels ignoring case and spacing", () => {
    expect(resolveInput("  LS ", commands, aliases)?.label).toBe("ls");
    expect(resolveInput("cat   resume.txt", commands, aliases)?.label).toBe("cat resume.txt");
  });

  it("follows aliases", () => {
    expect(resolveInput("cls", commands, aliases)?.label).toBe("clear");
  });

  it("accepts cd without the ~/", () => {
    expect(resolveInput("cd work", commands, aliases)?.label).toBe("cd ~/work");
    expect(resolveInput("cd ./contact/", commands, aliases)?.label).toBe("cd ~/contact");
  });

  it("returns null for unknown or empty input", () => {
    expect(resolveInput("rm -rf /home", commands, aliases)).toBeNull();
    expect(resolveInput("   ", commands, aliases)).toBeNull();
    expect(resolveInput("cd nowhere", commands, aliases)).toBeNull();
  });
});

describe("complete", () => {
  const labels = commands.map((c) => c.label);

  it("completes a unique match fully", () => {
    expect(complete("cl", labels)).toBe("clear");
    expect(complete("cat", labels)).toBe("cat resume.txt");
  });

  it("extends to the longest shared prefix when several match", () => {
    expect(complete("cd", labels)).toBe("cd ~/");
  });

  it("returns null when there's nothing to add", () => {
    expect(complete("c", labels)).toBeNull(); // clear, cd, cat, cp: no common next letter
    expect(complete("zzz", labels)).toBeNull();
    expect(complete("", labels)).toBeNull();
    expect(complete("ls", labels)).toBeNull();
  });
});
