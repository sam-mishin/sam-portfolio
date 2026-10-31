/**
 * components/case-study/CaseSection.tsx — one numbered section of a case
 * study ("01 Customer and context", "02 Discovery"…), used inside the
 * .mdx files. The number and heading come from the shared template in
 * content/case-studies.ts, so every case study has the same structure and
 * the table of contents always matches.
 */
import type { ReactNode } from "react";
import { template, type SectionId } from "@/content/case-studies";
import styles from "./CaseSection.module.css";

/** Props for {@link CaseSection}. */
export interface CaseSectionProps {
  /** Which template section this is, e.g. "discovery". Also the #anchor. */
  id: SectionId;
  /** The section's prose and components. */
  children: ReactNode;
}

/** A numbered case-study section with its heading. */
export function CaseSection({ id, children }: CaseSectionProps) {
  const index = template.findIndex((s) => s.id === id);
  if (index === -1) throw new Error(`Unknown case-study section "${id}"`);
  const number = String(index + 1).padStart(2, "0");
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={styles.section}>
      <p className={`${styles.number} num`} aria-hidden="true">
        {number}
      </p>
      <h2 id={`${id}-heading`} className={styles.heading}>
        {template[index].title}
      </h2>
      {children}
    </section>
  );
}
