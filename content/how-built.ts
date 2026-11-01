/**
 * content/how-built.ts — the "How this site is built" section on the home
 * page: how the design system, theming, accessibility and motion work.
 *
 * HOW TO EDIT
 * - One or two short sentences per item. Every claim here is checked
 *   against the code and the README's audit results: if the code changes,
 *   change this too.
 * - The code excerpt is read from app/globals.css at build time
 *   (lib/token-excerpt.ts). `blocks` picks which selectors and tokens it
 *   shows; the lines themselves always come from the real file.
 */
import type { ExcerptBlock } from "@/lib/token-excerpt";
import { site } from "./site";

export const howBuilt = {
  id: "how-built",
  command: "cat .\\docs\\ARCHITECTURE.md",
  heading: "How this site is built",
  intro:
    "This site is AI-assisted: I designed it and directed the build, and I review and test every change. Here’s the system underneath it.",
  items: [
    {
      title: "Design tokens",
      body: "Every color, font size, radius and layout size is a CSS custom property in app/globals.css. Components use only those tokens, so no other stylesheet holds a raw color.",
    },
    {
      title: "Two themes, one token set",
      body: "Dark and light use the same token names with two sets of values: Ayu Dark Unbordered and Ayu Light. A few Ayu Light colors are darkened so every text pair stays above 4.5:1 contrast.",
    },
    {
      title: "CSS Modules, no UI library",
      body: "Each component has its own .module.css file. There’s no Tailwind and no component library.",
    },
    {
      title: "Audited for accessibility",
      body: "axe-core reports 0 violations on the home page, every case study and the 404, at 390px and 1440px, in both themes. Lighthouse accessibility scores 100.",
    },
    {
      title: "Keyboard-first command palette",
      body: "Press / or Ctrl+K to search the site and run commands without a mouse. The matching and arrow-key logic is in lib/palette.ts, tested with Vitest.",
    },
    {
      title: "Motion that respects settings",
      body: "Reduced motion turns off the boot screen, typing intro, scroll effects and page slides. Anything that blinks on its own stops within five seconds.",
    },
  ],
  excerpt: {
    title: "app/globals.css — excerpt",
    blocks: [
      { selector: ":root", tokens: ["bg", "surface", "text", "muted", "accent"] },
      { selector: '[data-theme="light"]', tokens: ["bg", "surface", "text", "muted", "accent"] },
      { selector: ":root", occurrence: 2, tokens: ["fs-h1", "fs-body", "gutter", "touch"] },
    ] satisfies ExcerptBlock[],
  },
  link: {
    label: "Read the architecture notes on GitHub",
    href: `${site.source.repo}/blob/${site.source.branch}/docs/ARCHITECTURE.md`,
  },
} as const;
