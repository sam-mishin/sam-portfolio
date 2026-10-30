/**
 * components/PsIcon.tsx — the small blue PowerShell icon that Windows
 * Terminal shows on every tab. Used on the nav tabs and terminal windows.
 * Purely decorative, so it is hidden from screen readers.
 */
import styles from "./PsIcon.module.css";

/** Props for {@link PsIcon}. */
export interface PsIconProps {
  /** Width and height in pixels. Defaults to 16, Windows Terminal's tab icon size. */
  size?: number;
}

/** Decorative PowerShell tab icon (blue rounded square with a `>_` glyph). */
export function PsIcon({ size = 16 }: PsIconProps) {
  return (
    <svg
      className={styles.icon}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <rect className={styles.tile} width="16" height="16" rx="3" />
      <path className={styles.glyph} d="M4.5 5l3 3-3 3M8.5 11h3.5" />
    </svg>
  );
}
