/**
 * components/Section.tsx — a home-page section: a `PS C:\sam> command`
 * eyebrow, a heading, an optional intro line, then the content. Keeps every
 * section on the same width, spacing and heading pattern.
 */
import type { ReactNode } from "react";
import { Prompt } from "./Prompt";
import styles from "./Section.module.css";

/** Props for {@link Section}. */
export interface SectionProps {
  /** Anchor id, e.g. "work" for /#work. Also used to label the section. */
  id: string;
  /** The command shown above the heading, e.g. "git log --career". */
  command: string;
  /** The section heading (an <h2>). */
  heading: string;
  /** Optional line under the heading. */
  intro?: string;
  /** Section content. */
  children: ReactNode;
  /** Optional class for extra spacing set by the page. */
  className?: string;
}

/** A titled home-page section with the PowerShell-prompt eyebrow. */
export function Section({ id, command, heading, intro, children, className }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={className ? `${styles.section} ${className}` : styles.section}>
      <div className={`${styles.head} reveal`}>
        <Prompt typeOnScroll>{command}</Prompt>
        <h2 id={`${id}-heading`} className={styles.heading}>
          {heading}
        </h2>
        {intro && <p className={styles.intro}>{intro}</p>}
      </div>
      {children}
    </section>
  );
}
