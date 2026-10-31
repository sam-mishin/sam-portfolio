/**
 * components/case-study/Band.tsx — one full-width band of a case-study
 * page, framed like a technical drawing: a dashed rule across the page
 * above it, and on wide screens a dotted rail down each side carrying a
 * label (the section number on the left, its command on the right).
 *
 * The rails are decoration: hidden from screen readers (the heading says
 * the same thing), dropped below 1024px and left off printed copies.
 */
import type { ReactNode } from "react";
import styles from "./Band.module.css";

/** Props for {@link Band}. */
export interface BandProps {
  /** Left-rail label, e.g. "01". */
  number?: string;
  /** Right-rail command, shown after a `>`, e.g. "cat discovery". */
  command?: string;
  /** Leave off the dashed rule above (the first band on the page). */
  noRule?: boolean;
  /** Leave the whole band off printed copies. */
  printHidden?: boolean;
  /** Element to render. Defaults to `section`. */
  as?: "section" | "div" | "header";
  id?: string;
  "aria-labelledby"?: string;
  children: ReactNode;
}

/** A full-width band with side rails and a dashed rule above it. */
export function Band({ number, command, noRule, printHidden, as: Tag = "section", children, ...rest }: BandProps) {
  return (
    <Tag className={`${styles.band} ${noRule ? styles.noRule : ""}`} data-no-print={printHidden || undefined} {...rest}>
      <div className={styles.frame}>
        <div className={styles.rail} aria-hidden="true" data-no-print>
          {number && <span className={styles.label}>{number}</span>}
        </div>
        <div className={styles.content}>{children}</div>
        <div className={`${styles.rail} ${styles.railRight}`} aria-hidden="true" data-no-print>
          {command && (
            <span className={styles.label}>
              <span className={styles.caret}>&gt;</span> {command}
            </span>
          )}
        </div>
      </div>
    </Tag>
  );
}
