/**
 * components/PromptIcon.tsx — the small tab icon: a generic `>_` prompt
 * glyph on a rounded tile, in the site's accent color. Used on the nav
 * tabs and terminal windows. Purely decorative, so it is hidden from
 * screen readers.
 *
 * Drawn from scratch on purpose. It's a common "terminal" symbol, not
 * Microsoft's PowerShell logo or any Windows Terminal icon: Microsoft's
 * Trademark and Brand Guidelines say their logos and product icons can't
 * be used without a license.
 */
import styles from "./PromptIcon.module.css";

/** Props for {@link PromptIcon}. */
export interface PromptIconProps {
  /** Width and height in pixels. Defaults to 16, Windows Terminal's tab icon size. */
  size?: number;
}

/** Decorative tab icon (rounded tile with a `>_` glyph). */
export function PromptIcon({ size = 16 }: PromptIconProps) {
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
