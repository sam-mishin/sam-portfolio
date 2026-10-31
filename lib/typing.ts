/**
 * lib/typing.ts — timing for the hero's typing animation (TypeIn).
 *
 * The hero types `whoami`, then the headline, then fades in the rest.
 * The animation itself is pure CSS (each character gets a delay), so the
 * timings are computed here, once, and shared by the server-rendered
 * hero and the client component that tidies up afterwards.
 */

/**
 * How long the first-visit boot screen holds the page, in ms after page
 * load (lib/boot.ts). When it plays, the hero intro waits until then.
 * Keep in sync with the boot-out animation delay + duration in
 * components/BootScreen.module.css (1240ms + 260ms).
 */
export const BOOT_MS = 1500;

/** When a typed run starts and how far apart its characters appear, in ms. */
export interface TypingTiming {
  start: number;
  step: number;
}

/** Characters as the visitor sees them. Array.from keeps emoji and accents whole. */
export function characters(text: string): string[] {
  return Array.from(text);
}

/**
 * A repeatable "random" number in [0, 1) for character `i`. Integer
 * hashing, so the server and the browser always agree (no hydration
 * mismatch) and the rhythm is the same on every visit.
 */
function jitter(i: number): number {
  return ((Math.imul(i + 1, 2654435761) >>> 0) % 1000) / 1000;
}

/** When one character appears and how long until the next one does, in ms. */
export interface CharTiming {
  /** Delay from page load until this character appears. */
  at: number;
  /** Gap until the next character (how long this one carries the caret). */
  gap: number;
}

/**
 * Per-character timings that feel like a person typing rather than a
 * metronome: each gap varies around `step` (70%–130%), and there's a short
 * pause after each word and a longer one after punctuation.
 */
export function charTimings(text: string, { start, step }: TypingTiming): CharTiming[] {
  const chars = characters(text);
  let at = start;
  return chars.map((char, i) => {
    let gap = step * (0.7 + 0.6 * jitter(i));
    if (char === " ") gap += step * 0.6;
    if (/[.,;:!?—]/.test(char)) gap += step * 3;
    const timing = { at: Math.round(at), gap: Math.round(gap) };
    at += gap;
    return timing;
  });
}

/** When the last character of `text` has appeared and finished, in ms from page load. */
export function typingEnd(text: string, timing: TypingTiming): number {
  const all = charTimings(text, timing);
  const last = all[all.length - 1];
  return last ? last.at + last.gap : timing.start;
}

/**
 * Timings for the hero: the command types at a relaxed pace, a beat, then
 * the headline at a comfortable reading speed (about 2.5 seconds).
 */
export function heroTimings(command: string, headline: string) {
  const commandTiming: TypingTiming = { start: 250, step: 85 };
  const headlineTiming: TypingTiming = { start: typingEnd(command, commandTiming) + 350, step: 38 };
  return {
    command: commandTiming,
    headline: headlineTiming,
    /** When the headline is done; the highlight, caret and fade-in follow. */
    end: typingEnd(headline, headlineTiming),
  };
}
