/**
 * content/case-studies.ts — the parts of each case study that aren't
 * prose: the one-line summary, the facts grid (role, status, stack, how
 * it's built), the hero screenshot, and the section template every case
 * study follows.
 *
 * HOW TO EDIT
 * - The prose lives in content/case-studies/<slug>.mdx. Each section there
 *   is wrapped in <CaseSection id="…">, using an id from `template` below;
 *   the number and heading come from here, so all case studies stay in
 *   the same order with the same headings.
 * - To add a case study: add an entry to `caseStudies`, create the .mdx
 *   file, and set `caseStudy: true` on the card in content/projects.ts.
 * - [Bracketed] values are placeholders and show on the page as-is.
 */

/** The eight sections, in order, used by every case study. */
export const template = [
  { id: "customer", title: "Customer and context" },
  { id: "discovery", title: "Discovery" },
  { id: "constraints", title: "Constraints" },
  { id: "shipped", title: "What I shipped" },
  { id: "rollout", title: "Rollout and training" },
  { id: "results", title: "Results" },
  { id: "broke", title: "What broke and what I changed" },
  { id: "next", title: "What’s next" },
] as const;

export type SectionId = (typeof template)[number]["id"];

/** Facts and framing for one case study. */
export interface CaseStudy {
  /** Must match a card's slug in content/projects.ts (the title comes from there). */
  slug: string;
  /** One sentence under the title. */
  summary: string;
  facts: { label: string; value: string }[];
  /** Screenshot text until a real image exists. */
  heroShot: string;
}

/** Labels used on every case-study page. */
export const caseStudyLabels = {
  breadcrumbRoot: "~/work",
  breadcrumbHref: "/#work",
  tocCommand: "cat toc",
  tocLabel: "On this page",
  allWork: { hint: "← cd ..", label: "All work", href: "/#work" },
  next: "next →",
  previous: "← prev",
  moreLabel: "More case studies",
} as const;

export const caseStudies: CaseStudy[] = [
  {
    slug: "trellis",
    summary:
      "A multi-tenant wine club billing platform, built to replace a discontinued vendor for about 800 club members at 14 Acres, and designed to sell to other wineries.",
    facts: [
      { label: "Role", value: "Design, architecture, review & testing" },
      { label: "Status", value: "In development · first live charges Jan 2027" },
      { label: "Stack", value: "Next.js, TypeScript, PostgreSQL, Render" },
      { label: "How it’s built", value: "AI-assisted; I review and test every change" },
    ],
    heroShot: "[Screenshot: Trellis admin — member list with next charge dates]",
  },
  {
    slug: "spend-tracker",
    summary:
      "One view of revenue and the top food and wine for the owner and general manager, built on a nightly sync of Clover POS orders that now holds 50,000+ orders.",
    facts: [
      { label: "Role", value: "[Add: your role]" },
      { label: "Status", value: "Live · syncing nightly" },
      { label: "Stack", value: "Supabase functions, Vercel Cron, Postgres, Clover API" },
      { label: "How it’s built", value: "AI-assisted; I review and test every change" },
    ],
    heroShot: "[Screenshot: spend dashboard — revenue and top food and wine]",
  },
  {
    slug: "cash-drawer",
    summary:
      "A rebuild of a buggy prototype that ends inaccurate paper cash counts: 8–10 staff count the drawer in the app, and every count is checked against Clover cash sales.",
    facts: [
      { label: "Role", value: "[Add: your role]" },
      { label: "Status", value: "Live · used by 8–10 staff" },
      { label: "Stack", value: "Next.js, Supabase, Clover API" },
      { label: "How it’s built", value: "AI-assisted; I review and test every change" },
    ],
    heroShot: "[Screenshot: cash drawer count screen]",
  },
];
