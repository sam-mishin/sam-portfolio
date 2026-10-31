/**
 * app/resume.ansi/route.ts — the colored terminal résumé.
 *
 * Visitors never type this address: proxy.ts sends `curl <site>` (and
 * PowerShell's `irm`, wget and HTTPie) here instead of the HTML home page.
 * The text has ANSI color codes in the Ayu Dark palette, so it looks like
 * the site in a terminal. Built at build time (lib/plain-resume.ts).
 */
import { plainResume } from "@/lib/plain-resume";
import { hasResumePdf, textResponse } from "@/lib/plain-routes";
import { siteUrl } from "@/lib/site-url";

export function GET() {
  return textResponse(plainResume(siteUrl(), { colors: true, hasPdf: hasResumePdf() }));
}
