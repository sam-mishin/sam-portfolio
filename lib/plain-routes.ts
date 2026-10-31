/**
 * lib/plain-routes.ts — shared bits of the three text routes
 * (app/resume.txt, app/resume.ansi, app/llms.txt).
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { RESUME_PDF } from "./plain-resume";

/** True once public/resume/Sam_Mishin_Resume.pdf exists, so the PDF is only linked when it's real. */
export function hasResumePdf(): boolean {
  return existsSync(join(process.cwd(), "public", RESUME_PDF));
}

/** A UTF-8 text response that browsers display rather than download. */
export function textResponse(body: string, type = "text/plain"): Response {
  return new Response(body, {
    headers: {
      "Content-Type": `${type}; charset=utf-8`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
