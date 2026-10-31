"use client";

/**
 * components/TypeIn.tsx — text that types itself out, one character at a
 * time, with a caret riding along the end.
 *
 * How it works:
 * - Every character is rendered as its own span with a CSS animation
 *   delay (lib/typing.ts gives each one a slightly different gap, with
 *   small pauses between words, so it reads like real typing), so the
 *   typing runs from the server-rendered HTML without waiting for
 *   JavaScript. Characters keep their space while hidden, so
 *   nothing reflows as the text appears.
 * - The animation only runs while <html> has `data-intro` (see
 *   lib/intro.ts): first home-page view of the session, no reduced-motion
 *   preference. Otherwise the text is simply there.
 * - It doesn't start counting until this component has hydrated and the
 *   browser has painted a frame (then it sets `data-intro-run`). Timing
 *   from page load instead made the typing skip ahead whenever the page
 *   was busy loading: nothing, then half the headline at once.
 * - Once the typing is done (or straight away if it isn't playing), the
 *   component swaps the per-character spans for plain text, so screen
 *   readers, copy/paste and find-in-page see ordinary words.
 */
import { useEffect, useState } from "react";
import { bootPlaying, BOOT_MS } from "@/lib/boot";
import { endIntro, introPlaying, introRunning, startIntro } from "@/lib/intro";
import { characters, charTimings, type TypingTiming, typingEnd } from "@/lib/typing";
import styles from "./TypeIn.module.css";

/** One run of text, optionally wrapped in its own class (e.g. a highlight). */
export interface TypeInSegment {
  /** The text to type. */
  text: string;
  /** Class for the span around this run, e.g. the headline highlight. */
  className?: string;
}

/** Props for {@link TypeIn}. */
export interface TypeInProps {
  /** The text, split into runs that can be styled differently. */
  segments: TypeInSegment[];
  /** When typing starts and the gap between characters, in ms (lib/typing.ts). */
  timing: TypingTiming;
  /**
   * Set on the last piece of the intro (the headline): this many ms after
   * its typing ends, the intro is marked finished so it never replays.
   * Long enough for whatever animates after the typing (highlight, fade-in).
   */
  endIntroAfter?: number;
}

/** Types out `segments` on the first visit; plain text otherwise. */
export function TypeIn({ segments, timing, endIntroAfter }: TypeInProps) {
  const [plain, setPlain] = useState(false);
  const fullText = segments.map((s) => s.text).join("");

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let frame = 0;

    if (!introPlaying() || introRunning()) {
      // No intro, or it already started on an earlier visit to this page in
      // this session (e.g. you navigated away mid-typing and came back):
      // just show the text.
      if (introRunning()) endIntro();
      timers.push(setTimeout(() => setPlain(true), 0));
    } else {
      // Wait out the boot screen if it's showing (its end is fixed relative
      // to page load), then two frames so the hidden state has been
      // painted, then start. Every TypeIn on the page starts together
      // because they share the one attribute.
      const bootLeft = bootPlaying() ? Math.max(0, BOOT_MS - performance.now()) : 0;
      timers.push(
        setTimeout(() => {
          frame = requestAnimationFrame(() => {
            frame = requestAnimationFrame(() => {
              startIntro();
              const end = typingEnd(fullText, timing);
              // Small margin so the last character's caret finishes first.
              timers.push(setTimeout(() => setPlain(true), end + 100));
              if (endIntroAfter !== undefined) timers.push(setTimeout(endIntro, end + endIntroAfter));
            });
          });
        }, bootLeft),
      );
    }

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(frame);
    };
  }, [fullText, timing, endIntroAfter]);

  // The same wrapper spans are rendered in both modes, so swapping the
  // characters for plain text doesn't remount them (which would restart
  // animations on them, like the headline highlight).
  const timings = charTimings(fullText, timing);
  let index = 0;
  return (
    <span>
      {segments.map((segment, i) => (
        <span key={i} className={segment.className}>
          {plain
            ? segment.text
            : characters(segment.text).map((char) => {
                const n = index++;
                return (
                  <span
                    key={n}
                    className={styles.char}
                    style={{ "--at": `${timings[n].at}ms`, "--gap": `${timings[n].gap}ms` } as React.CSSProperties}
                  >
                    {char}
                  </span>
                );
              })}
        </span>
      ))}
    </span>
  );
}
