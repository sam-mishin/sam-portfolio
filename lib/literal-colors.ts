/**
 * lib/literal-colors.ts — the few places that can't use the CSS color
 * tokens, and the copies of those tokens they use instead.
 *
 * app/globals.css is the source of truth for every color. Two things can't
 * read CSS variables, though:
 * - the share images (app/opengraph-image.tsx), drawn by Satori into a
 *   PNG on the server, and
 * - the browser UI color in the viewport metadata (app/layout.tsx).
 * So they read the dark-theme values from here. lib/literal-colors.test.ts
 * checks every entry against globals.css, so if a token changes there and
 * not here, the tests fail instead of the share image quietly drifting.
 *
 * Keys are token names without the leading "--".
 */

/** Dark theme (the default), copied from :root in app/globals.css. */
export const darkColors = {
  bg: "#0d1017",
  band: "#0b0e14",
  surface: "#0f131a",
  chrome: "#0b0e14",
  "border-subtle": "#151a22",
  dots: "#2d333d",
  text: "#e6e1cf",
  "text-body": "#bfbdb6",
  muted: "#8a9199",
  accent: "#e6b450",
  "on-accent": "#0b0e14",
  key: "#39bae6",
  value: "#aad94c",
  "icon-tile": "#e6b450",
  "icon-glyph": "#0b0e14",
  "syn-tag": "#39bae6",
  "syn-func": "#ffb454",
  "syn-const": "#d2a6ff",
  "syn-keyword": "#ff8f40",
} as const;

/** The light-theme page background, for the light browser UI color. */
export const lightColors = {
  bg: "#fcfcfc",
} as const;
