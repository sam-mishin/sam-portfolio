/**
 * components/ScrollProgress.tsx — a thin accent line across the top of the
 * window that fills as you scroll down the page, like a reading-progress
 * bar or the editor's scrollbar thumb.
 *
 * Pure CSS (a scroll-driven animation on the page's own scroll position),
 * so there's no scroll listener. In browsers without scroll-driven
 * animations, or with reduced motion on, it simply isn't drawn.
 */
import styles from "./ScrollProgress.module.css";

/** Decorative reading-progress bar; hidden from screen readers. */
export function ScrollProgress() {
  return <div className={styles.bar} aria-hidden="true" />;
}
