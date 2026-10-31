/**
 * proxy.ts — runs before /work/<slug> pages render, and sends mistyped
 * case-study URLs to a real 404.
 *
 * Why this exists: with Cache Components, a case-study page starts
 * streaming before it knows whether the slug is real, so calling
 * notFound() in the page shows the 404 page but the response status has
 * already gone out as 200 (a "soft 404"). Search engines and link checkers
 * read the status, not the page. Checking the slug here, before anything
 * renders, lets the response say 404 properly.
 *
 * Unknown slugs are rewritten (the address bar doesn't change) to a path
 * no route matches, which renders app/not-found.tsx with status 404.
 */
import { NextResponse, type NextRequest } from "next/server";
import { caseStudySlugs } from "@/lib/case-studies";

/** Built once: the slugs only change when the site is rebuilt. */
const known = new Set(caseStudySlugs());

/** A path no page or file matches, so Next.js answers it with the 404 page. */
const NOT_FOUND_PATH = "/_missing";

export function proxy(request: NextRequest) {
  if (known.has(slugOf(request.nextUrl.pathname))) return NextResponse.next();
  return NextResponse.rewrite(new URL(NOT_FOUND_PATH, request.url), { status: 404 });
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
  // Only case-study pages; their Open Graph images live one level deeper
  // (/work/<slug>/opengraph-image) and don't match.
  matcher: "/work/:slug",
};
