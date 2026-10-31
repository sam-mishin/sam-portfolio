/**
 * lib/literal-colors.test.ts — keeps the hard-coded color copies in
 * lib/literal-colors.ts identical to the tokens in app/globals.css.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { darkColors, lightColors } from "./literal-colors";

const css = readFileSync(fileURLToPath(new URL("../app/globals.css", import.meta.url)), "utf8");

/** The custom properties declared in the first block that starts with `selector {`. */
function tokens(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`globals.css has no "${selector} {" block`);
  const block = css.slice(start, css.indexOf("\n}", start));
  const found: Record<string, string> = {};
  for (const match of block.matchAll(/--([\w-]+):\s*([^;]+);/g)) found[match[1]] = match[2].trim();
  return found;
}

describe("literal colors", () => {
  it("match the dark tokens in globals.css", () => {
    const dark = tokens(":root");
    for (const [name, value] of Object.entries(darkColors)) {
      expect(dark[name], `--${name}`).toBe(value);
    }
  });

  it("match the light tokens in globals.css", () => {
    const light = tokens('[data-theme="light"]');
    for (const [name, value] of Object.entries(lightColors)) {
      expect(light[name], `--${name}`).toBe(value);
    }
  });
});
