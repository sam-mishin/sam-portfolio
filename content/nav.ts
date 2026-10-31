/**
 * content/nav.ts — the tab bar at the top of every page and the phone menu.
 *
 * HOW TO EDIT
 * - `tabs` are the Windows Terminal–style tabs after the home tab. Each
 *   `href` points at a section id on the home page (see content/home.ts).
 * - On a case-study page, an extra tab named after the project is added
 *   and shown as active automatically.
 */
import { profile } from "./profile";
import { site } from "./site";

export const nav = {
  /** Accessible name of the <nav> landmark. */
  label: "Main",
  home: { label: site.terminalTitle, href: "/" },
  tabs: [
    { label: "work", href: "/#work" },
    { label: "how-i-work", href: "/#how-i-work" },
    { label: "experience", href: "/#experience" },
    { label: "skills", href: "/#skills" },
    { label: "contact", href: "/#contact" },
  ],
  resume: { label: "Résumé", href: profile.hero.secondaryCta.href },
  menu: {
    open: "Open menu",
    close: "Close menu",
    title: "Go to",
    /** Heading above the theme switch inside the phone menu. */
    themeTitle: "Theme",
  },
  /** The sun/moon button. The label says what pressing it will do. */
  theme: {
    toLight: "Switch to light mode",
    toDark: "Switch to dark mode",
    /** Used before the page knows the current theme (first render). */
    unknown: "Switch theme",
    /** Visible text next to the icon inside the phone menu. */
    lightName: "Light",
    darkName: "Dark",
  },
} as const;
