/**
 * content/plain-text.ts — wording for the plain-text versions of the site:
 *
 * - `curl <site>` (or `irm <site>` in PowerShell, `wget -qO- <site>`):
 *   a colored résumé printed in the terminal instead of the web page
 * - /resume.txt: the same résumé without colors
 * - /llms.txt: a short Markdown summary for AI tools (llmstxt.org)
 *
 * Everything else in them (name, roles, numbers, projects, links) is read
 * from the other content files, so they never drift from the web page.
 * Anything still marked [like this] in those files is left out.
 *
 * HOW TO EDIT: change the strings below. {url} is replaced with the site's
 * address (lib/site-url.ts). Preview with `npm run dev`, then
 * `curl localhost:3000`, or open /resume.txt and /llms.txt.
 */

export const plainText = {
  /** The command "typed" at the top of the terminal résumé. */
  command: "whoami",
  /** Section headings that aren't on the web page as commands. */
  impactCommand: "Get-Content .\\impact.txt",
  contactCommand: "contact --sam",
  /** Labels in the left column. */
  result: "Result",
  built: "Built",
  stack: "Stack",
  caseStudy: "Case study",
  email: "Email",
  /** The lines at the very bottom. */
  footer: {
    site: "Full site: {url}",
    plain: "No colors: curl {url}/resume.txt",
    /** {pdf} is the résumé link from content/profile.ts. Shown only once the PDF exists. */
    pdf: "PDF: {url}{pdf}",
    credit: "Generated from the same content files as the site.",
  },

  /** /llms.txt — Markdown in the llmstxt.org format. */
  llms: {
    /** One paragraph after the summary line: who this is and what to read first. */
    about:
      "Sam is a full-stack web developer who embeds with businesses and ships the software they run on. Most of that work is at 14 Acres Vineyard & Winery, where he started as a dishwasher in 2024 and now builds and maintains the winery’s software. He is looking for frontend, design systems, full-stack and forward-deployed engineering roles.",
    caseStudiesHeading: "Case studies",
    projectsHeading: "Other projects",
    resumeHeading: "Résumé and contact",
    resumeText: "Plain-text résumé (the same facts as the site, no markup)",
    resumePdf: "Résumé PDF",
    homepage: "Home page",
  },
} as const;
