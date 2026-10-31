"use client";

/**
 * components/TypeIn.tsx — text that types itself out, one character at a
 * time, with a caret riding along the end.
 *
 * How it works:
 * - Every character is rendered as its own span with a CSS animation
 *   delay, so the typing runs from the server-rendered HTML without
 *   waiting for JavaScript. Characters keep their space while hidden, so
 *   nothing reflows as the text appears.
 * - The animation only runs while <html> has `data-intro` (see
 *   lib/intro.ts): first home-page view of the session, no reduced-motion
 *   preference. Otherwise the text is simply there.
 * - Once the typing is done (or straight away if it isn't playing), the
 *   component swaps the per-character spans for plain text, so screen
 *   readers, copy/paste and find-in-page see ordinary words.
 */
import { useEffect, useState } from "react";
import { bootPlaying, BOOT_MS } from "@/lib/boot";
import { introPlaying } from "@/lib/intro";
import { characters, type TypingTiming, typingEnd } from "@/lib/typing";
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
}

/** Types out `segments` on the first visit; plain text otherwise. */
export function TypeIn({ segments, timing }: TypeInProps) {
  const [plain, setPlain] = useState(false);
  const fullText = segments.map((s) => s.text).join("");

  useEffect(() => {
    // Small margin so the last character's caret finishes before the swap.
    const boot = bootPlaying() ? BOOT_MS : 0;
    const wait = introPlaying() ? boot + typingEnd(fullText, timing) + timing.step + 50 : 0;
    const timer = setTimeout(() => setPlain(true), wait);
    return () => clearTimeout(timer);
  }, [fullText, timing]);

  // The same wrapper spans are rendered in both modes, so swapping the
  // characters for plain text doesn't remount them (which would restart
  // animations on them, like the headline highlight).
  let index = 0;
  return (
    <span
      style={plain ? undefined : ({ "--start": `${timing.start}ms`, "--step": `${timing.step}ms` } as React.CSSProperties)}
    >
      {segments.map((segment, i) => (
        <span key={i} className={segment.className}>
          {plain
            ? segment.text
            : characters(segment.text).map((char) => {
                const n = index++;
                return (
                  <span key={n} className={styles.char} style={{ "--i": n } as React.CSSProperties}>
                    {char}
                  </span>
                );
              })}
        </span>
      ))}
    </span>
  );
}
