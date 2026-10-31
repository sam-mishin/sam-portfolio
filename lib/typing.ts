/**
 * lib/typing.ts — timing for the hero's typing animation (TypeIn).
 *
 * The hero types `whoami`, then the headline, then fades in the rest.
 * The animation itself is pure CSS (each character gets a delay), so the
 * timings are computed here, once, and shared by the server-rendered
 * hero and the client component that tidies up afterwards.
 */

/** When a typed run starts and how far apart its characters appear, in ms. */
export interface TypingTiming {
  start: number;
  step: number;
}

/** Characters as the visitor sees them. Array.from keeps emoji and accents whole. */
export function characters(text: string): string[] {
  return Array.from(text);
}

/** When the last character of `text` appears, in ms from page load. */
export function typingEnd(text: string, { start, step }: TypingTiming): number {
  return start + characters(text).length * step;
}

/**
 * Timings for the hero: the command types slowly, like a person, then the
 * headline types quickly so the page is fully readable in under two seconds.
 */
export function heroTimings(command: string, headline: string) {
  const commandTiming: TypingTiming = { start: 150, step: 55 };
  const headlineTiming: TypingTiming = { start: typingEnd(command, commandTiming) + 150, step: 18 };
  return {
    command: commandTiming,
    headline: headlineTiming,
    /** When the intro and buttons fade in. */
    end: typingEnd(headline, headlineTiming),
  };
}
