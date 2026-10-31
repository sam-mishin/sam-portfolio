/**
 * app/layout.tsx — the root layout wrapped around every page.
 *
 * It loads the two fonts, sets page metadata, runs the no-flash theme
 * and intro scripts, and renders the frame every page shares: skip link →
 * tab-bar header (with the command palette and theme toggle) → <main> →
 * contact footer.
 */
import type { Metadata } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Sans } from "next/font/google";
import { PointerSpotlight } from "@/components/PointerSpotlight";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SiteFooter } from "@/components/SiteFooter";
import { TabNav } from "@/components/TabNav";
import { site } from "@/content/site";
import { introScript } from "@/lib/intro";
import { themeScript } from "@/lib/theme";
import "./globals.css";

/**
 * Cascadia Code, the Windows Terminal font, self-hosted from public/fonts.
 * The files are subset to Latin, punctuation, arrows and box-drawing
 * characters to keep them small (see README "Fonts").
 */
const cascadia = localFont({
  src: [
    { path: "../public/fonts/CascadiaCode-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/CascadiaCode-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-cascadia",
  display: "swap",
  fallback: ["Consolas", "ui-monospace", "monospace"],
});

/**
 * IBM Plex Sans is the body font for visitors without Segoe UI (Mac,
 * Linux, Android). next/font downloads it at build time and serves it from
 * this site, so there is no request to Google from the visitor's browser.
 */
const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning on <html> and <body> only: browser extensions
    // (ad blockers, antivirus, analytics opt-out) add attributes to these two
    // elements before React hydrates, and the theme script below sets
    // data-theme on <html>. It ignores attribute differences on these
    // elements alone, not on anything inside them.
    //
    // data-scroll-behavior="smooth": in-page #anchor jumps scroll smoothly,
    // but Next.js switches smoothing off while changing pages so a new
    // page starts at the top instantly instead of scrolling up through it.
    <html
      lang="en"
      className={`${cascadia.variable} ${plex.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Sets data-theme on <html> before the first paint, from the saved
            choice or the system setting, so light-mode visitors never see
            a flash of the dark palette. It has to be an inline, blocking
            script: anything loaded later would run after the page shows.
            Without JavaScript the site stays in the default dark theme. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Turns on the hero's typing animation for the first home-page
            view of the session (see lib/intro.ts). Inline for the same
            reason: it must decide before the headline paints. */}
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body suppressHydrationWarning>
        <ScrollProgress />
        <PointerSpotlight />
        <a className="skip-link" href="#main">
          {site.skipLink}
        </a>
        <TabNav />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
