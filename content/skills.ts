/**
 * content/skills.ts — the `cat skills.json` card and the education card.
 *
 * HOW TO EDIT
 * - Skills: each line is a JSON-style key and a list. Keep keys short and
 *   lowercase so it still reads like JSON.
 * - Education: newest first. `detail` is the small gray line underneath.
 * - Names and dates must match the résumé.
 */

export const skills: { key: string; items: string[] }[] = [
  { key: "languages", items: ["JavaScript", "TypeScript", "Python", "SQL", "HTML", "CSS"] },
  { key: "frameworks", items: ["React", "Next.js", "Vitest"] },
  { key: "data", items: ["PostgreSQL", "Supabase (RLS)", "SQLite"] },
  { key: "apis", items: ["Clover", "OwnerRez", "Twilio", "Telegram"] },
  { key: "tools", items: ["Git", "GitHub Actions", "Vercel", "Render", "Webflow", "Make.com"] },
  {
    key: "practices",
    items: ["requirements gathering", "multi-tenant data design", "AI-assisted development with review and tests", "UI/UX"],
  },
];

export const education: { title: string; detail: string }[] = [
  { title: "B.S. Computer Science", detail: "Western Governors University · expected Dec 2027" },
  { title: "Clark College", detail: "Fall 2024 – Spring 2025 · Calculus, Digital Logic Design" },
  { title: "Webflow Visual Developer Certification", detail: "Apr 2026" },
];

/** The note under the education list. */
export const certsInProgress =
  "In progress: AWS Developer – Associate, Linux Essentials, Java, Back-End and AI Optimization Developer certs.";
