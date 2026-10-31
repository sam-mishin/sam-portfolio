/**
 * lib/site-url.ts — the site's public address, used for absolute URLs in
 * metadata (canonical links, Open Graph images), the sitemap and robots.txt.
 *
 * Checked in order:
 * 1. NEXT_PUBLIC_SITE_URL — set this in Vercel once there's a custom
 *    domain, e.g. https://sammishin.dev (no trailing slash needed).
 * 2. VERCEL_PROJECT_PRODUCTION_URL — set automatically by Vercel to the
 *    project's production domain (e.g. sam-portfolio.vercel.app), so links
 *    work before a custom domain exists.
 * 3. http://localhost:3000 — local development.
 */

/** The site's origin with no trailing slash, e.g. "https://example.com". */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;
  return "http://localhost:3000";
}

/** An absolute URL for a path on this site, e.g. absoluteUrl("/work/trellis"). */
export function absoluteUrl(path: string): string {
  return new URL(path, `${siteUrl()}/`).toString();
}
