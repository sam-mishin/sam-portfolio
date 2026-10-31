/**
 * lib/typing.test.ts — tests for the hero typing-animation timings.
 */
import { describe, expect, it } from "vitest";
import { characters, charTimings, heroTimings, typingEnd } from "./typing";

describe("charTimings", () => {
  const timing = { start: 100, step: 40 };

  it("starts at the start time and only moves forward", () => {
    const t = charTimings("hello world.", timing);
    expect(t[0].at).toBe(100);
    for (let i = 1; i < t.length; i++) expect(t[i].at).toBeGreaterThan(t[i - 1].at);
  });

  it("varies each gap between 70% and 130% of the step, before pauses", () => {
    for (const { gap } of charTimings("abcdefghij", timing)) {
      expect(gap).toBeGreaterThanOrEqual(28);
      expect(gap).toBeLessThanOrEqual(52);
    }
  });

  it("pauses longer after spaces and punctuation", () => {
    const [a, space] = charTimings("a b", timing);
    const [, comma] = charTimings("a,b", timing);
    expect(space.gap).toBeGreaterThan(a.gap - 1);
    expect(comma.gap).toBeGreaterThanOrEqual(120);
  });

  it("is the same every time (no randomness between server and browser)", () => {
    expect(charTimings("same text", timing)).toEqual(charTimings("same text", timing));
  });
});

describe("typingEnd", () => {
  it("is when the last character's gap ends", () => {
    const t = charTimings("whoami", { start: 150, step: 55 });
    expect(typingEnd("whoami", { start: 150, step: 55 })).toBe(t[5].at + t[5].gap);
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

  it("types the real headline at a readable pace: done in roughly 3–4.5 seconds", () => {
    const headline = "I embed with businesses and ship the software they run on.";
    const end = heroTimings("whoami", headline).end;
    expect(end).toBeGreaterThan(3000);
    expect(end).toBeLessThan(4500);
  });
});
