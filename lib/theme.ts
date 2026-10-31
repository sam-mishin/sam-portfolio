/**
 * lib/theme.ts — light/dark theme state.
 *
 * The theme lives in one place: the `data-theme` attribute on <html>,
 * which globals.css reads to pick the palette. This module reads and
 * changes that attribute, remembers an explicit choice in localStorage,
 * and lets components subscribe to changes (ThemeToggle uses it with
 * useSyncExternalStore).
 *
 * The first value is set before the page paints by `themeScript`, inlined
 * in <head> by app/layout.tsx, so there's never a flash of the wrong
 * theme. Until the visitor picks one, the site follows the system setting
 * and keeps following it if it changes (e.g. macOS switching at sunset).
 */

export type Theme = "light" | "dark";

/** localStorage key for an explicit choice. No key = follow the system. */
export const THEME_STORAGE_KEY = "theme";

/** Fired on window whenever the theme changes, so subscribers re-render. */
const CHANGE_EVENT = "themechange";

const SYSTEM_LIGHT = "(prefers-color-scheme: light)";

/**
 * Runs inline in <head> before anything paints. Kept tiny, with no
 * imports, because it's injected as a string. localStorage can throw
 * (Safari private mode, blocked site data), hence the try/catch; if it
 * does, the system setting decides.
 */
export const themeScript = `(function(){var t;try{t=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("${SYSTEM_LIGHT}").matches?"light":"dark";document.documentElement.dataset.theme=t})()`;

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

/** The visitor's saved choice, or null if they haven't picked one. */
function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return window.matchMedia(SYSTEM_LIGHT).matches ? "light" : "dark";
}

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** The theme currently on the page. Browser only. */
export function getTheme(): Theme {
  const value = document.documentElement.dataset.theme;
  return isTheme(value) ? value : systemTheme();
}

/** Switch to the other theme and remember the choice. */
export function toggleTheme(): Theme {
  const next: Theme = getTheme() === "dark" ? "light" : "dark";
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Can't save it (private mode, blocked storage): the switch still
    // works for this page view.
  }
  apply(next);
  return next;
}

/**
 * Switch theme with a circular reveal: the new theme grows out from
 * `origin` (the button that was pressed) until it covers the page.
 *
 * Uses the View Transitions API: the browser snapshots the page, we flip
 * the theme, and CSS animates a clip-path circle on the new snapshot
 * (see "Theme switch" in app/globals.css). The `theme-transition` class
 * scopes that CSS to this transition, so page-change transitions are
 * unaffected. Falls back to an instant switch when the API is missing or
 * the visitor prefers reduced motion.
 */
export function toggleThemeAnimated(origin?: { x: number; y: number }): Theme {
  const next: Theme = getTheme() === "dark" ? "light" : "dark";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || typeof document.startViewTransition !== "function") return toggleTheme();

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight / 2;
  // Distance to the farthest corner, so the circle ends up covering everything.
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const root = document.documentElement;
  root.style.setProperty("--theme-x", `${x}px`);
  root.style.setProperty("--theme-y", `${y}px`);
  root.style.setProperty("--theme-r", `${r}px`);
  root.classList.add("theme-transition");

  const transition = document.startViewTransition(() => {
    toggleTheme();
  });
  transition.finished.finally(() => root.classList.remove("theme-transition"));
  return next;
}

/**
 * Call `onChange` whenever the theme changes: from the toggle, from a
 * choice made in another tab, or from the system setting when the visitor
 * hasn't picked one. Returns an unsubscribe function.
 */
export function subscribeTheme(onChange: () => void): () => void {
  const media = window.matchMedia(SYSTEM_LIGHT);
  const onSystem = () => {
    if (!storedTheme()) apply(systemTheme());
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    apply(storedTheme() ?? systemTheme());
  };

  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  media.addEventListener("change", onSystem);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
    media.removeEventListener("change", onSystem);
  };
}
