/**
 * app/layout.tsx — the root layout wrapped around every page.
 *
 * It loads the two fonts, sets page metadata, and renders the frame every
 * page shares: skip link → tab-bar header → <main> → contact footer.
 * Milestone 6 adds the command palette, theme toggle and the no-flash
 * theme script here.
 */
import type { Metadata } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Sans } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { TabNav } from "@/components/TabNav";
import { site } from "@/content/site";
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
    // elements before React hydrates, and the theme script (milestone 6)
    // sets data-theme on <html>. It ignores attribute differences on these
    // elements alone, not on anything inside them.
    <html lang="en" className={`${cascadia.variable} ${plex.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
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
