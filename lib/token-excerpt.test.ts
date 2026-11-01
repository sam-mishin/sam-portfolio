/**
 * lib/token-excerpt.test.ts — the "How this site is built" excerpt is made
 * of real lines from app/globals.css, and the build fails loudly if a token
 * it shows is renamed.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { howBuilt } from "@/content/how-built";
import { tokenExcerpt } from "./token-excerpt";

const css = readFileSync(fileURLToPath(new URL("../app/globals.css", import.meta.url)), "utf8");

const sample = `
:root {
  --bg: #000; /* black */
  --text: #fff;
}

[data-theme="light"] {
  --bg: #fff;
  --text: #000;
}

:root {
  --gutter: 32px;
}
`;

describe("tokenExcerpt", () => {
  it("keeps the chosen lines exactly as written, in the order asked", () => {
    const out = tokenExcerpt(sample, [
      { selector: ":root", tokens: ["text", "bg"] },
      { selector: ":root", occurrence: 1, tokens: ["gutter"] },
    ]);
    expect(out).toBe(":root {\n  --text: #fff;\n  --bg: #000; /* black */\n}\n\n:root {\n  --gutter: 32px;\n}");
  });

  it("throws on a missing selector or token", () => {
    expect(() => tokenExcerpt(sample, [{ selector: ".nope", tokens: ["bg"] }])).toThrow(/no "\.nope \{" block/);
    expect(() => tokenExcerpt(sample, [{ selector: ":root", tokens: ["accent"] }])).toThrow(/no --accent/);
  });

  it("finds every token the site's excerpt asks for in globals.css", () => {
    const out = tokenExcerpt(css, howBuilt.excerpt.blocks);
    for (const line of out.split("\n").filter((l) => l.trimStart().startsWith("--"))) {
      expect(css).toContain(line);
    }
  });
});
