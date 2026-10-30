/**
 * components/KeyValue.tsx — `Key: ........ value` rows, the neofetch-style
 * lines in the winfetch card.
 *
 * Semantically each row is a term and its description, so rows render as
 * <dt>/<dd> pairs inside a <dl> (`KeyValueList`). The dot leader between
 * them is generated CSS, not text, so screen readers read "Host, 14 Acres
 * Vineyard & Winery" rather than a string of periods.
 */
import type { ReactNode } from "react";
import styles from "./KeyValue.module.css";

/** Props for {@link KeyValueList}. */
export interface KeyValueListProps {
  /** {@link KeyValue} rows. */
  children: ReactNode;
  /** Accessible name for the list when there's no visible heading, e.g. "Impact". */
  label?: string;
  /** Optional class for spacing set by the parent. */
  className?: string;
}

/**
 * The <dl> that holds {@link KeyValue} rows. It is also a CSS size
 * container: when the list itself is narrower than about 30 characters
 * wide (the winfetch card on a phone), rows stack the key above the value
 * and drop the dots, matching the phone mockup.
 */
export function KeyValueList({ children, label, className }: KeyValueListProps) {
  return (
    <dl className={className ? `${styles.list} ${className}` : styles.list} aria-label={label}>
      {children}
    </dl>
  );
}

/** Props for {@link KeyValue}. */
export interface KeyValueProps {
  /** The key, shown in the --key color with a trailing colon, e.g. "Host". */
  label: string;
  /** The value, shown in the --value color, e.g. "14 Acres Vineyard & Winery". */
  value: ReactNode;
}

/** One `Key: ........ value` row. Must be placed inside a {@link KeyValueList}. */
export function KeyValue({ label, value }: KeyValueProps) {
  return (
    <div className={styles.row}>
      <dt className={styles.key}>{label}:</dt>
      <dd className={styles.value}>{value}</dd>
    </div>
  );
}
