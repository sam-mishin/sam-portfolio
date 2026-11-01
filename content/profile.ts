/**
 * content/profile.ts — who Sam is: the hero, the winfetch card rows, the
 * impact numbers and the contact links.
 *
 * HOW TO EDIT
 * - Change any string and save; the page updates.
 * - Every number here comes from the résumé (kept outside this repo).
 *   If a number changes, change it in both places.
 * - Winfetch rows: `{ label, value }`. `phone: true` also shows the row on
 *   phones (the phone card shows a shorter list). The value "{uptime}" is
 *   replaced with the live uptime counted from `codingSince`.
 * - Use curly quotes (’ “ ”) and real dashes (– —) in text.
 */

/** One `Key: ..... value` line on the winfetch card. */
export interface WinfetchRow {
  label: string;
  /** The value, or one value per theme ({ dark, light }) when it should follow the theme toggle. */
  value: string | { dark: string; light: string };
  /** Show this row on phones too. */
  phone?: boolean;
}

/** A group of winfetch rows, optionally under a `- Heading ———` rule. */
export interface WinfetchGroup {
  heading?: string;
  rows: WinfetchRow[];
}

export const profile = {
  name: "Sam Mishin",

  hero: {
    command: "whoami",
    headline: "I embed with businesses and ship the software they run on.",
    /** Part of the headline shown with an editor-style selection highlight. Must appear in `headline`. */
    headlineHighlight: "ship the software they run on.",
    intro:
      "Full-stack web developer. I built a wine club billing platform, Clover POS integrations and daily-use staff tools, and I’ve shipped about 12 client websites since 2023.",
    primaryCta: { label: "See my work", href: "#work" },
    secondaryCta: { label: "Download résumé", href: "/resume/Sam_Mishin_Resume.pdf" },
    availability: "Open to frontend, design systems and full-stack roles",
    location: "Vancouver WA / Portland / remote",
  },

  winfetch: {
    command: "winfetch",
    user: "sam@mishin",
    /** Start of freelance development (résumé: Oct 2023). Drives the Uptime row. */
    codingSince: "2023-10-01",
    groups: [
      {
        rows: [
          { label: "OS", value: "Windows, Webflow, Vercel" },
          { label: "Uptime", value: "{uptime}", phone: true },
          { label: "Host", value: "14 Acres Vineyard & Winery", phone: true },
          { label: "Kernel", value: "Marketing & Technology Lead", phone: true },
          { label: "IDE", value: "VS Code" },
          { label: "Theme", value: { dark: "Ayu Dark Unbordered", light: "Ayu Light" } },
        ],
      },
      {
        rows: [
          { label: "Languages", value: "JavaScript, TypeScript, Python, SQL", phone: true },
          { label: "Stack", value: "Next.js, React, Postgres, Supabase" },
          { label: "Building", value: "Trellis — wine club billing", phone: true },
          { label: "Education", value: "B.S. Computer Science, WGU ’27", phone: true },
        ],
      },
      {
        heading: "Impact",
        rows: [
          { label: "Orders synced", value: "50,000+" },
          { label: "Calls answered / day", value: "~50" },
          { label: "Client sites shipped", value: "~12" },
        ],
      },
    ] satisfies WinfetchGroup[],
  },

  /**
   * The impact strip under the winfetch card. `value` is the big number,
   * `label` the line under it.
   */
  impact: [
    { value: "50,000+", label: "Clover POS orders synced nightly into Postgres" },
    { value: "~800", label: "wine club members Trellis will bill" },
    { value: "~50/day", label: "calls answered by the AI receptionist I maintain" },
    { value: "8–10", label: "staff checking cash counts in the drawer app" },
    { value: "~12", label: "client websites shipped since 2023" },
  ],

  contact: {
    command: "contact --sam",
    heading: "Let’s talk.",
    intro: "Looking for frontend, design systems, full-stack, forward-deployed, solutions or implementation engineering roles.",
    email: "sammishin2@gmail.com",
    /** Shown after the email is copied. */
    copied: "✓ copied to clipboard",
    /** Read by screen readers after the address on the copy button. */
    copyHint: "copy to clipboard",
    /** The small link next to the button that opens a mail app instead. */
    mailLink: "or open in your mail app",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/samuel-mishin/" },
      { label: "GitHub", href: "https://github.com/sam-mishin" },
      { label: "Freelance site", href: "https://mishinwebsites.com" },
    ],
  },

  footer: {
    copyright: "© 2026 Sam Mishin · Ridgefield, WA",
    credit: "Designed by Sam Mishin · built with AI assistance, reviewed by me · Next.js on Vercel",
    searchHint: "press / to search",
    /** Follows the theme toggle. */
    themeNote: {
      dark: "Colors: Ayu Dark Unbordered, the theme I use in VS Code",
      light: "Colors: Ayu Light, the light side of the theme I use in VS Code",
    },
  },
} as const;
