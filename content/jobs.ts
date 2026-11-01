/**
 * content/jobs.ts — the career timeline, shown as `git log --career`.
 *
 * HOW TO EDIT
 * - Newest first. Titles and dates must match the résumé.
 * - `hash` is a made-up short commit hash for the git-log look; any 7
 *   hex characters work.
 * - `dot` picks the timeline dot color: "current" (green, the job you're
 *   in now), "side" (yellow, work running alongside), or "past" (gray).
 */

export interface Job {
  hash: string;
  dates: string;
  role: string;
  org: string;
  desc: string;
  dot: "current" | "side" | "past";
}

export const jobs: Job[] = [
  {
    hash: "a7f3e21",
    dates: "Jul 2026 – now",
    role: "Marketing & Technology Lead",
    org: "14 Acres Vineyard & Winery",
    desc: "Build and maintain the winery’s software, POS integrations and website (about two-thirds of the role); also run marketing.",
    dot: "current",
  },
  {
    hash: "5c0d9b4",
    dates: "May 2026",
    role: "Freelance developer",
    org: "14 Acres Vineyard & Winery",
    desc: "Came back as a contractor before being hired full time.",
    dot: "past",
  },
  {
    hash: "e19a6f0",
    dates: "Aug 2024 – Aug 2025",
    role: "Assistant Winemaker & Vineyard Manager",
    org: "14 Acres",
    desc: "Learned the business from the vineyard up, which is why I know what the software needs to do.",
    dot: "past",
  },
  {
    hash: "2b84c3d",
    dates: "Feb 2024 – Aug 2024",
    role: "Dishwasher",
    org: "14 Acres",
    desc: "Where it started.",
    dot: "past",
  },
  {
    hash: "0f1e7aa",
    dates: "Oct 2023 – now",
    role: "Freelance Web Developer",
    org: "Self-employed",
    desc: "About 12 client sites in Webflow and Next.js, from design through launch, plus Python image tooling and Make.com automations. I handle accessibility on client sites: ARIA labels, visible focus states, alt text and color contrast.",
    dot: "side",
  },
];
