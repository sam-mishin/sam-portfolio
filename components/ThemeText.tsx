/**
 * components/ThemeText.tsx — text that differs between dark and light mode,
 * e.g. the winfetch "Theme" row (Ayu Dark Unbordered vs Ayu Light).
 *
 * Both versions are in the HTML and CSS shows the one matching
 * `data-theme` on <html>, so it's right on the first paint (the theme is
 * set before anything renders) and flips instantly with the toggle. The
 * hidden one uses display: none, so screen readers only hear the visible
 * text.
 */
import styles from "./ThemeText.module.css";

/** Props for {@link ThemeText}. */
export interface ThemeTextProps {
  /** Shown in dark mode (the default). */
  dark: string;
  /** Shown in light mode. */
  light: string;
}

/** Shows `dark` or `light` depending on the active theme. */
export function ThemeText({ dark, light }: ThemeTextProps) {
  return (
    <>
      <span className={styles.dark}>{dark}</span>
      <span className={styles.light}>{light}</span>
    </>
  );
}
