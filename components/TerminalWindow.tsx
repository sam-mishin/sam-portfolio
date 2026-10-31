/**
 * components/TerminalWindow.tsx — a Windows Terminal window frame: the tab
 * strip (prompt icon, tab title, close ✕, new-tab +, dropdown ⌄), the
 * minimize / maximize / close controls on the right, and a body for
 * whatever runs "inside" the terminal (the winfetch card, the OG image…).
 *
 * The whole title bar is decoration that repeats nothing a visitor needs,
 * so it is hidden from screen readers; only the body content is read.
 * Glyphs are drawn as small SVGs (10×10, like Windows 11) instead of
 * Unicode characters so they look the same in every font.
 */
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { PromptIcon } from "./PromptIcon";
import styles from "./TerminalWindow.module.css";

/** Props for {@link TerminalWindow}. */
export interface TerminalWindowProps {
  /** What runs inside the window. */
  children: ReactNode;
  /** Text on the active tab. Defaults to `sam@mishin: ~` from content/site.ts. */
  title?: string;
  /** Optional class for sizing or spacing set by the parent. */
  className?: string;
}

/** A Windows Terminal–style window with tab strip and window controls. */
export function TerminalWindow({ children, title = site.terminalTitle, className }: TerminalWindowProps) {
  return (
    <div className={className ? `${styles.window} ${className}` : styles.window}>
      <div className={styles.titlebar} aria-hidden="true">
        <span className={styles.tab}>
          <PromptIcon />
          <span className={styles.tabTitle}>{title}</span>
          <svg className={styles.tabClose} viewBox="0 0 10 10" width="8" height="8">
            <path d="M1 1l8 8M9 1L1 9" />
          </svg>
        </span>
        <span className={styles.chromeButton}>
          <svg viewBox="0 0 10 10" width="10" height="10">
            <path d="M5 0v10M0 5h10" />
          </svg>
        </span>
        <span className={`${styles.chromeButton} ${styles.dropdown}`}>
          <svg viewBox="0 0 10 10" width="10" height="10">
            <path d="M1.5 3.5L5 7l3.5-3.5" />
          </svg>
        </span>
        <span className={styles.spacer} />
        <span className={styles.controls}>
          <span className={styles.control}>
            <svg viewBox="0 0 10 10" width="10" height="10">
              <path d="M0 5.5h10" />
            </svg>
          </span>
          <span className={styles.control}>
            <svg viewBox="0 0 10 10" width="10" height="10">
              <rect x="0.5" y="0.5" width="9" height="9" />
            </svg>
          </span>
          <span className={styles.control}>
            <svg viewBox="0 0 10 10" width="10" height="10">
              <path d="M0 0l10 10M10 0L0 10" />
            </svg>
          </span>
        </span>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
