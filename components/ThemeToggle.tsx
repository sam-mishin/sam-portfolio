"use client";

/**
 * components/ThemeToggle.tsx — the sun/moon button that switches between
 * the light and dark palettes (see lib/theme.ts).
 *
 * Both icons are always rendered and CSS shows the right one from
 * `data-theme` on <html>. That way the server-rendered HTML is already
 * correct before React knows the theme, so the icon never flickers on
 * load. Only the accessible name has to wait for hydration.
 *
 * Switching plays a circular reveal from where it was clicked
 * (toggleThemeAnimated in lib/theme.ts).
 */
import { useSyncExternalStore } from "react";
import { nav } from "@/content/nav";
import { getTheme, subscribeTheme, toggleThemeAnimated, type Theme } from "@/lib/theme";
import styles from "./ThemeToggle.module.css";

/** Props for {@link ThemeToggle}. */
export interface ThemeToggleProps {
  /**
   * "icon" (default): a square icon button for the header.
   * "row": icon plus the theme's name, full width, for the phone menu.
   */
  variant?: "icon" | "row";
  /** Extra class names, e.g. to hide the button at some widths. */
  className?: string;
}

/** On the server there's no theme to read yet. */
const serverTheme = (): Theme | null => null;

/** Button that flips between light and dark mode and remembers the choice. */
export function ThemeToggle({ variant = "icon", className }: ThemeToggleProps) {
  const theme = useSyncExternalStore<Theme | null>(subscribeTheme, getTheme, serverTheme);
  const label = theme === null ? nav.theme.unknown : theme === "dark" ? nav.theme.toLight : nav.theme.toDark;
  const classes = [styles.button, variant === "row" ? styles.row : styles.icon, className].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      className={classes}
      // The row variant shows the current theme's name as visible text,
      // so its accessible name starts with that text (WCAG "label in name").
      aria-label={variant === "row" && theme ? `${theme === "dark" ? nav.theme.darkName : nav.theme.lightName} — ${label}` : label}
      onClick={(event) => {
        // Grow the new theme out from the pointer, or from the button's
        // center when it was pressed with the keyboard (detail is 0).
        const box = event.currentTarget.getBoundingClientRect();
        const fromPointer = event.detail > 0;
        toggleThemeAnimated({
          x: fromPointer ? event.clientX : box.left + box.width / 2,
          y: fromPointer ? event.clientY : box.top + box.height / 2,
        });
      }}
    >
      {/* Sun: shown in dark mode, since pressing it brings the light. */}
      <svg className={styles.sun} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg className={styles.moon} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
      </svg>
      {variant === "row" && (
        <span className={styles.name} aria-hidden="true">
          <span className={styles.darkName}>{nav.theme.darkName}</span>
          <span className={styles.lightName}>{nav.theme.lightName}</span>
        </span>
      )}
    </button>
  );
}
