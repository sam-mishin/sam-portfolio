/**
 * app/layout.tsx — the root layout wrapped around every page.
 *
 * It loads the two fonts, sets page metadata, runs the no-flash theme,
 * boot-screen and intro scripts, and renders the frame every page shares:
 * boot overlay (first visit only) → skip link → tab-bar header (with the
 * command palette and theme toggle) → <main> → contact footer.
 */
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Sans } from "next/font/google";
import { BootScreen } from "@/components/BootScreen";
import { PointerSpotlight } from "@/components/PointerSpotlight";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SiteFooter } from "@/components/SiteFooter";
import { TabNav } from "@/components/TabNav";
import { site } from "@/content/site";
import { bootScript } from "@/lib/boot";
import { introScript } from "@/lib/intro";
import { darkColors, lightColors } from "@/lib/literal-colors";
import { siteUrl } from "@/lib/site-url";
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

/**
 * Page metadata shared by every page. Case studies override the title,
 * description and canonical URL (app/work/[slug]/page.tsx). The share
 * image comes from app/opengraph-image.tsx, which Next.js links
 * automatically. metadataBase turns relative URLs into absolute ones
 * using the address from lib/site-url.ts.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: site.title, template: site.titleTemplate },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

/**
 * Viewport settings. The browser UI color (Android address bar, Safari tab
 * bar) follows the visitor's system theme. Metadata can't read CSS
 * variables, so the --bg values come from lib/literal-colors.ts (checked
 * against globals.css by its test).
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: darkColors.bg },
    { media: "(prefers-color-scheme: light)", color: lightColors.bg },
  ],
  colorScheme: "dark light",
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
        {/* First visit ever: shows the boot screen (lib/boot.ts). Runs before
            the intro script, which checks whether it should wait for it. */}
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        {/* Turns on the hero's typing animation for the first home-page
            view of the session (see lib/intro.ts). Inline for the same
            reason: it must decide before the headline paints. */}
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body suppressHydrationWarning>
        <BootScreen />
        <ScrollProgress />
        <PointerSpotlight />
        <a className="skip-link" href="#main">
          {site.skipLink}
        </a>
        <TabNav />
        {/* On paper the tab bar is hidden; this line says whose site it is
            and where to find it instead (see the print styles in globals.css). */}
        <p className="print-only print-header">
          {site.title} · {siteUrl().replace(/^https?:\/\//, "")}
        </p>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
