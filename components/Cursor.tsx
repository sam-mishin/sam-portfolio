/**
 * components/Cursor.tsx — the blinking block cursor at the end of a
 * terminal prompt. Decorative, so screen readers skip it. The blink stops
 * for visitors who ask for reduced motion (see Cursor.module.css).
 */
import styles from "./Cursor.module.css";

/** A blinking block cursor, like Windows Terminal's default "filled box" cursor. */
export function Cursor() {
  return <span className={styles.cursor} aria-hidden="true" />;
}
