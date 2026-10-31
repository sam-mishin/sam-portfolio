/**
 * lib/typing.test.ts — tests for the hero typing-animation timings.
 */
import { describe, expect, it } from "vitest";
import { characters, heroTimings, typingEnd } from "./typing";

describe("typingEnd", () => {
  it("adds one step per character to the start time", () => {
    expect(typingEnd("whoami", { start: 150, step: 55 })).toBe(150 + 6 * 55);
  });

  it("counts curly quotes and accents as single characters", () => {
    expect(characters("I’ve résumé")).toHaveLength(11);
  });

  it("ends at the start for empty text", () => {
    expect(typingEnd("", { start: 200, step: 10 })).toBe(200);
  });
});

describe("heroTimings", () => {
  it("starts the headline after the command finishes and ends after the headline", () => {
    const t = heroTimings("whoami", "Hello there.");
    expect(t.headline.start).toBeGreaterThan(typingEnd("whoami", t.command));
    expect(t.end).toBe(typingEnd("Hello there.", t.headline));
  });

  it("keeps the real headline readable within two seconds", () => {
    const headline = "I embed with businesses and ship the software they run on.";
    expect(heroTimings("whoami", headline).end).toBeLessThan(2000);
  });
});
