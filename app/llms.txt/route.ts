/**
 * app/llms.txt/route.ts — /llms.txt: a short Markdown summary of who Sam
 * is, with links to the case studies and the plain-text résumé, in the
 * llmstxt.org format that AI assistants and screening tools look for.
 * Built at build time from the content files (lib/plain-resume.ts).
 */
import { llmsTxt } from "@/lib/plain-resume";
import { hasResumePdf, textResponse } from "@/lib/plain-routes";
import { siteUrl } from "@/lib/site-url";

export function GET() {
  // text/plain rather than text/markdown so browsers show it instead of downloading it.
  return textResponse(llmsTxt(siteUrl(), { hasPdf: hasResumePdf() }));
}
