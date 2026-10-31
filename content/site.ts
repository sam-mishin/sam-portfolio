/**
 * content/site.ts — site-wide text: the page title, description and the
 * skip-link label.
 *
 * HOW TO EDIT: change the strings below and save. Everything here is plain
 * text; no code changes are needed elsewhere. Keep the title under ~60
 * characters and the description under ~160 so search results don't cut
 * them off.
 */

export const site = {
  /** Shown in the browser tab and search results. */
  title: "Sam Mishin — Full-Stack Web Developer",
  /** Used for search results and link previews. */
  description:
    "Sam Mishin embeds with businesses and ships the software they run on: a wine club billing platform, Clover POS integrations, daily-use staff tools and about 12 client websites.",
  /** Alt text for the share image of the terminal card (app/opengraph-image.tsx). {stats} becomes the impact rows from content/profile.ts. */
  shareImageAlt: "Sam Mishin’s terminal card: Full-Stack Web Developer. {stats}.",
  /** Alt text for a case study's share image; {title} is replaced with the project name. */
  caseStudyImageAlt: "{title}: a case study by Sam Mishin, shown as a terminal window.",
  /** Browser tab title for case studies and other inner pages; %s is the page's own title. */
  titleTemplate: "%s · Sam Mishin",
  /** Owner's name, used in metadata and the footer. */
  name: "Sam Mishin",
  /** Text of the keyboard "skip to content" link. */
  skipLink: "Skip to content",
  /** The PowerShell prompt shown before every command, e.g. "PS C:\sam> whoami". */
  promptPath: "PS C:\\sam>",
  /** Title on the terminal tabs (home tab, winfetch window). */
  terminalTitle: "sam@mishin: ~",
  /**
   * The small "</> Hero.tsx" links that open each section's code on GitHub
   * (components/SourceLink.tsx). The repository must be public for them to
   * work; set `enabled: false` to hide them all.
   */
  source: {
    enabled: true,
    repo: "https://github.com/sam-mishin/sam-portfolio",
    /** Used when the build doesn't know its commit (local builds). On Vercel, links point at the exact deployed commit. */
    branch: "main",
    /** {file} is replaced with the file name. */
    label: "{file}: view source on GitHub (opens in a new tab)",
  },
} as const;
