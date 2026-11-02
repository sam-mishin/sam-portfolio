/**
 * components/NumberedCards.tsx — a grid of numbered cards (01, 02, …),
 * shared by "How I work" and "How this site is built" so both sections
 * use the same card: number, title, body and an optional footer line.
 *
 * `sequence` adds a → after each number except the last, for steps that
 * happen in order. Cards fade in on scroll and get the cursor spotlight.
 */
import type { ReactNode } from "react";
import styles from "./NumberedCards.module.css";

/** One card's content. */
export interface NumberedCardItem {
  title: string;
  body: ReactNode;
  /** Optional last line, e.g. a link to an example. */
  footer?: ReactNode;
}

/** Props for {@link NumberedCards}. */
export interface NumberedCardsProps {
  items: NumberedCardItem[];
  /** Show → after each number, for steps in order. */
  sequence?: boolean;
}

/** Numbered card grid: three across on wide screens, one column on phones. */
export function NumberedCards({ items, sequence = false }: NumberedCardsProps) {
  return (
    <ol className={styles.grid}>
      {items.map((item, i) => (
        <li key={item.title} className={`${styles.card} reveal`} data-spotlight>
          <p className={`${styles.number} num`} aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
            {sequence && i < items.length - 1 && <span className={styles.arrow}> →</span>}
          </p>
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.body}>{item.body}</p>
          {item.footer && <p className={styles.footer}>{item.footer}</p>}
        </li>
      ))}
    </ol>
  );
}
