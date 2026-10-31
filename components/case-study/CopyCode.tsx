"use client";

/**
 * components/case-study/CopyCode.tsx — the "copy" button in a code
 * block's header. Copies the raw code and says "✓ copied" for a moment,
 * announced politely to screen readers.
 */
import { useEffect, useRef, useState } from "react";
import { caseStudyLabels as labels } from "@/content/case-studies";
import styles from "./Blocks.module.css";

/** Props for {@link CopyCode}. */
export interface CopyCodeProps {
  /** The exact code to put on the clipboard. */
  code: string;
}

/** Copy-to-clipboard button for a code block. */
export function CopyCode({ code }: CopyCodeProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the code is still selectable by hand.
    }
  }

  return (
    <>
      <button type="button" className={styles.copy} data-no-print onClick={copy} aria-label={copied ? undefined : labels.copyCode}>
        {copied ? labels.copied : labels.copy}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? labels.copied : ""}
      </span>
    </>
  );
}
