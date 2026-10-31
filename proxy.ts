/**
 * proxy.ts — runs before two kinds of request, and nothing else:
 *
 * 1. `/` from a terminal. `curl <site>` (or PowerShell's `irm <site>`,
 *    wget, HTTPie) gets the colored terminal résumé (app/resume.ansi)
 *    instead of the HTML page. Browsers and link-preview bots are never
 *    matched (lib/terminal-client.ts) and get the normal home page. The
 *    response says `Vary: User-Agent` so caches keep the two apart.
 *
 * 2. `/work/<slug>`: mistyped case-study URLs get a real 404. With Cache
 *    Components, a case-study page starts streaming before it knows
 *    whether the slug is real, so calling notFound() in the page shows the
 *    404 page but the status has already gone out as 200 (a "soft 404").
 *    Search engines and link checkers read the status, not the page.
 *    Checking the slug here, before anything renders, lets the response
 *    say 404 properly. Unknown slugs are rewritten (the address bar
 *    doesn't change) to a path no route matches, which renders
 *    app/not-found.tsx with status 404.
 */
import { NextResponse, type NextRequest } from "next/server";
import { caseStudySlugs } from "@/lib/case-studies";
import { isTerminalClient } from "@/lib/terminal-client";

/** Built once: the slugs only change when the site is rebuilt. */
const known = new Set(caseStudySlugs());

/** A path no page or file matches, so Next.js answers it with the 404 page. */
const NOT_FOUND_PATH = "/_missing";

/** Where terminal clients asking for `/` are sent. */
const TERMINAL_RESUME_PATH = "/resume.ansi";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    if (!isTerminalClient(request.headers.get("user-agent"))) {
      return withVary(NextResponse.next());
    }
    return withVary(NextResponse.rewrite(new URL(TERMINAL_RESUME_PATH, request.url)));
  }

  if (known.has(slugOf(pathname))) return NextResponse.next();
  return NextResponse.rewrite(new URL(NOT_FOUND_PATH, request.url), { status: 404 });
}

/** The home page's content depends on the User-Agent; tell caches so. */
function withVary(response: NextResponse): NextResponse {
  response.headers.set("Vary", "User-Agent");
  return response;
}

/** The <slug> in /work/<slug>, decoded; "" if it's malformed (e.g. a stray %). */
function slugOf(pathname: string): string {
  try {
    return decodeURIComponent(pathname.split("/")[2] ?? "");
  } catch {
    return "";
  }
}

export const config = {
  // The home page (for terminal clients) and case-study pages. Case-study
  // share images live one level deeper (/work/<slug>/opengraph-image/…)
  // and don't match.
  matcher: ["/", "/work/:slug"],
};
