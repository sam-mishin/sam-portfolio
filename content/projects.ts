/**
 * content/projects.ts — the "Deployments" grid, the hand-written projects
 * row and the `ls .\work --more` list on the home page.
 *
 * HOW TO EDIT
 * - Each deployment card reads: customer · problem · what shipped ·
 *   result · how it was built · stack.
 * - `build` must say honestly how it was made: "Hand-written",
 *   "AI-assisted · reviewed and tested by me", or the no-code tools used.
 * - Anything in [square brackets] is a placeholder that shows on the site
 *   as-is until you replace it. They're all listed in README.md → TODO.
 * - `slug` is the URL of the case study (/work/<slug>) when `caseStudy`
 *   is true; the matching text lives in content/case-studies/<slug>.mdx.
 * - Order here is the order on the page. The `featured` one gets the wide
 *   card at the top.
 * - Screenshots: save the image in public/shots/ (WebP, 1920px max on the
 *   long edge, under 400 KB), then replace the "[Screenshot: …]" text with
 *   { src: "/shots/name.webp", alt: "what it shows", width, height } — see
 *   `trellisLogo` below for an example.
 */

/** One customer deployment card. */
import type { ShotValue } from "@/components/Placeholder";

/**
 * The Trellis logo, used in its screenshot slots until there's a product
 * screenshot. Lives in public/shots/; width and height are the file's size.
 */
export const trellisLogo = {
  src: "/shots/trellis-logo.webp",
  alt: "Trellis logo: a trellis post with a vine and a leaf, and the tagline “Built by wineries, for wineries.”",
  width: 1183,
  height: 465,
};

export interface Deployment {
  slug: string;
  title: string;
  /** Who it was for. */
  customer: string;
  /** What they were dealing with. */
  problem: string;
  /** What Sam shipped. */
  shipped: string;
  /** The measurable outcome (or status, if it isn't live yet). */
  result: string;
  /** How it was built — see the note at the top of this file. */
  build: string;
  stack: string[];
  /** Screenshot text until a real image exists, e.g. "[Screenshot: …]", then the image ({ src, alt, width, height }). */
  shot: ShotValue;
  /** Has a case-study page at /work/<slug>. */
  caseStudy: boolean;
  /** Short status pill, e.g. "In development · first live charges Jan 2027". */
  status?: string;
  featured?: boolean;
}

export const deployments: Deployment[] = [
  {
    slug: "trellis",
    title: "Trellis",
    customer: "14 Acres Vineyard & Winery · about 800 wine club members",
    problem: "The winery’s wine club billing vendor was discontinued, and every charge has to go through the Clover POS the tasting room already uses.",
    shipped:
      "A multi-tenant billing platform. Idempotency keys prevent double charges through the Clover API, and Postgres row-level security keeps each winery’s data separate.",
    result: "First live member charges planned for January 2027.",
    build: "AI-assisted · reviewed and tested by me",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Render workers", "Clover API", "GitHub Actions"],
    shot: trellisLogo,
    caseStudy: true,
    status: "In development · first live charges Jan 2027",
    featured: true,
  },
  {
    slug: "spend-tracker",
    title: "Customer spend tracker",
    customer: "14 Acres owner and general manager",
    problem: "The GM needed accurate data on which members use their comped tastings, and which don’t.",
    shipped: "A nightly sync of Clover POS orders into Postgres (Supabase function on a Vercel Cron) behind a search page and dashboards.",
    result: "50,000+ orders synced so far.",
    build: "AI-assisted · reviewed and tested by me",
    stack: ["Supabase functions", "Vercel Cron", "Postgres", "Clover API"],
    shot: "[Screenshot: spend dashboard]",
    caseStudy: true,
  },
  {
    slug: "cash-drawer",
    title: "Cash drawer counts",
    customer: "14 Acres tasting room staff",
    problem: "Inaccurate paper cash counts, and a buggy prototype meant to replace them.",
    shipped: "A rebuild in Next.js and Supabase that checks every drawer count against Clover cash sales.",
    result: "Used by 8–10 staff; every flagged mismatch has been under $1.",
    build: "AI-assisted · reviewed and tested by me",
    stack: ["Next.js", "Supabase", "Clover API"],
    shot: "[Screenshot: cash drawer count screen]",
    caseStudy: true,
  },
  {
    slug: "ai-receptionist",
    title: "AI phone receptionist",
    customer: "14 Acres callers and staff",
    problem: "Callers need event details and a way to reach the right person.",
    shipped: "An AI receptionist I maintain, with event info kept current from the website’s events, plus call routing.",
    result: "Answers about 50 calls a day.",
    build: "No-code + API (Synthflow, Make.com, Twilio)",
    stack: ["Synthflow", "Make.com", "Twilio"],
    shot: "[Screenshot: receptionist call flow]",
    caseStudy: false,
  },
  {
    slug: "new-adventure-homes",
    title: "Rental booking sites",
    customer: "New Adventure Homes (freelance client)",
    problem: "[Add: what New Adventure Homes needed from the booking sites]",
    shipped: "Two Next.js rental booking sites on the OwnerRez API and Supabase.",
    result: "Launching November 2026.",
    build: "[Add: hand-written or AI-assisted]",
    stack: ["Next.js", "OwnerRez API", "Supabase"],
    shot: "[Screenshot: booking site]",
    caseStudy: false,
    status: "Launching Nov 2026",
  },
  {
    slug: "rsc-lead-follow-up",
    title: "Lead follow-up automation",
    customer: "Royal Service Cleaning (freelance client)",
    problem: "Website inquiries need to reach the client every time.",
    shipped: "An automation that routes every website inquiry to the client.",
    result: "[Add: a result, e.g. inquiries delivered or response time]",
    build: "No-code (Make.com)",
    stack: ["Make.com"],
    shot: "[Screenshot: inquiry automation]",
    caseStudy: false,
  },
];

/** A personal project written entirely by hand. */
export interface HandWrittenProject {
  title: string;
  meta: string;
  body: string;
  stack: string[];
  /** Screenshot text, or the image once there is one (same as a deployment's `shot`). */
  shot: ShotValue;
  href: string;
  cta: string;
}

export const handWritten: HandWrittenProject[] = [
  {
    title: "Chess Variant",
    meta: "Personal · hand-written · in progress",
    body: "A browser chess variant where the squares move as well as the pieces. Live WebSocket matches coming by January 2027.",
    stack: ["JavaScript", "HTML", "CSS", "WebSockets"],
    shot: "[GIF: a square sliding mid-game]",
    href: "https://github.com/sam-mishin/Chess-Variant",
    cta: "View on GitHub",
  },
  {
    title: "Crypto Telegram bot",
    meta: "Personal · hand-written · 2022",
    body: "Replaced hours of scanning crypto Telegram chats. Sends DexScreener data when a coin is called repeatedly.",
    stack: ["Python", "SQLite", "Telegram API", "DexScreener API"],
    shot: "[Screenshot: alert message]",
    href: "https://github.com/sam-mishin/Crypto-Telegram-Bot",
    cta: "View on GitHub",
  },
];

/** The `ls .\work --more` list: smaller things, one line each. */
export const moreWork: { name: string; desc: string }[] = [
  { name: "wine-inventory/", desc: "Tracks about 40 wines in one place for the winemaker" },
  { name: "tv-events-display/", desc: "Turns the website’s events CMS into tasting room TV slides" },
  { name: "14acres-webflow/", desc: "WordPress → Webflow rebuild, 100–300 daily users" },
  { name: "client-image-scripts/", desc: "Python scripts that cut image sizes 70–80% on 3 client sites" },
  { name: "identity-matcher/", desc: "Hand-written name matcher for duplicate Clover customers (Vitest)" },
];
