/**
 * app/resume.txt/route.ts — /resume.txt: the résumé as plain text, built
 * at build time from the content files (lib/plain-resume.ts). Handy for
 * pasting into application forms and for tools that read text, not HTML.
 */
import { plainResume } from "@/lib/plain-resume";
import { hasResumePdf, textResponse } from "@/lib/plain-routes";
import { siteUrl } from "@/lib/site-url";

export function GET() {
  return textResponse(plainResume(siteUrl(), { colors: false, hasPdf: hasResumePdf() }));
}
