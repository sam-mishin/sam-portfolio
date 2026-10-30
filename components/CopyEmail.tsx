"use client";

/**
 * components/CopyEmail.tsx — the big email button in the contact footer.
 * Clicking it copies the address and prints a terminal-style
 * "✓ copied to clipboard" line under it. The line sits in a polite live
 * region, so screen readers announce it without moving focus.
 *
 * If the browser blocks clipboard access (older browsers, insecure
 * contexts), it falls back to opening the visitor's mail app instead.
 */
import { useEffect, useRef, useState } from "react";
import styles from "./CopyEmail.module.css";

/** Props for {@link CopyEmail}. */
export interface CopyEmailProps {
  /** The address to show and copy. */
  email: string;
  /** Message shown after a successful copy, e.g. "✓ copied to clipboard". */
  copiedMessage: string;
  /** Screen-reader hint appended to the button name, e.g. "copy to clipboard". */
  actionHint: string;
  /** Text of the small mailto link next to the button. */
  mailLinkLabel: string;
}

/** Email button that copies to the clipboard, plus a mailto fallback link. */
export function CopyEmail({ email, copiedMessage, actionHint, mailLinkLabel }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 3000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <button type="button" className={styles.button} onClick={copy}>
          {email}
          <span className="sr-only"> — {actionHint}</span>
        </button>
        <a href={`mailto:${email}`} className={styles.mailLink}>
          {mailLinkLabel}
        </a>
      </div>
      <p role="status" aria-live="polite" className={styles.status}>
        {copied ? copiedMessage : ""}
      </p>
    </div>
  );
}
