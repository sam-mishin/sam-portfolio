/**
 * components/Placeholder.tsx — helpers for content Sam still has to supply.
 *
 * Any string in content/ that starts with "[" (e.g. "[Add: a result]") is a
 * placeholder. `Text` shows it in a dashed, muted style so it's obvious on
 * the page and impossible to mistake for a real claim. `Shot` is the
 * dashed screenshot box used until a real image exists.
 */
import styles from "./Placeholder.module.css";

/** True when a content string is a [bracketed] placeholder. */
export function isPlaceholder(value: string): boolean {
  return value.trim().startsWith("[");
}

/** Props for {@link Text}. */
export interface TextProps {
  /** The content string; rendered as-is, styled as a placeholder if bracketed. */
  value: string;
}

/** Renders a content string, flagging [placeholders] visually. */
export function Text({ value }: TextProps) {
  return isPlaceholder(value) ? <span className={styles.text}>{value}</span> : <>{value}</>;
}

/** Props for {@link Shot}. */
export interface ShotProps {
  /** Description of the screenshot that belongs here, e.g. "[Screenshot: …]". */
  label: string;
  /** "card" (168px tall) or "feature" (fills its column). Defaults to card. */
  size?: "card" | "feature";
}

/**
 * Dashed box standing in for a screenshot. Left out of print: an empty
 * box is just wasted paper. (Real screenshots will print normally.)
 */
export function Shot({ label, size = "card" }: ShotProps) {
  return (
    <div className={`${styles.shot} ${styles[size]}`} data-no-print>
      {label}
    </div>
  );
}
