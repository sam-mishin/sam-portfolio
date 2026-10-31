/** lib/plain-resume.test.ts — the text résumé and llms.txt. */
import { describe, expect, it } from "vitest";
import { profile } from "@/content/profile";
import { isFilled, llmsTxt, plainResume, WIDTH, wrap, xterm256 } from "./plain-resume";

const URL = "https://example.com";

describe("wrap", () => {
  it("keeps lines within the width and indents the rest", () => {
    const lines = wrap("one two three four five six seven eight nine ten", 14, 2);
    expect(lines.every((l) => l.length <= 14)).toBe(true);
    expect(lines.slice(1).every((l) => l.startsWith("  "))).toBe(true);
    expect(lines.join(" ").replace(/\s+/g, " ")).toBe("one two three four five six seven eight nine ten");
  });
});

describe("isFilled", () => {
  it("rejects placeholders", () => {
    expect(isFilled("[Add: a result]")).toBe(false);
    expect(isFilled("Used by 8–10 staff")).toBe(true);
    expect(isFilled("")).toBe(false);
  });
});

describe("xterm256", () => {
  it("maps pure colors and greys to their xterm indexes", () => {
    expect(xterm256("#000000")).toBe(16);
    expect(xterm256("#ffffff")).toBe(231);
    expect(xterm256("#ff0000")).toBe(196);
    expect(xterm256("#808080")).toBe(244);
  });
});

describe("plainResume", () => {
  const plain = plainResume(URL, { colors: false, hasPdf: false });
  const colored = plainResume(URL, { colors: true, hasPdf: false });

  it("fits an 80-column terminal", () => {
    for (const line of plain.split("\n")) expect(Array.from(line).length).toBeLessThanOrEqual(WIDTH + 2);
  });

  it("has the key facts and no placeholders", () => {
    expect(plain).toContain(profile.contact.email);
    for (const item of profile.impact) expect(plain).toContain(item.value);
    expect(plain).toContain(`${URL}/work/trellis`);
    expect(plain).not.toMatch(/\[[^\]]*\]/);
  });

  it("only colors the curl version", () => {
    expect(plain).not.toContain("\u001b[");
    expect(colored).toContain("\u001b[");
    expect(colored.replace(/\u001b\[[\d;]*m/g, "")).toContain(profile.contact.email);
  });

  it("links the PDF only when it exists", () => {
    expect(plain).not.toContain(".pdf");
    expect(plainResume(URL, { colors: false, hasPdf: true })).toContain(`${URL}/resume/Sam_Mishin_Resume.pdf`);
  });
});

describe("llmsTxt", () => {
  const md = llmsTxt(URL, { hasPdf: false });
  it("follows the llms.txt shape: H1, summary quote, sections of links", () => {
    expect(md.startsWith("# ")).toBe(true);
    expect(md).toMatch(/^> /m);
    expect(md).toContain(`(${URL}/work/trellis)`);
    expect(md).toContain(`(${URL}/resume.txt)`);
    expect(md).not.toMatch(/\[Add/);
  });
});
