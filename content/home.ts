/**
 * content/home.ts — section labels on the home page: the PowerShell
 * command above each section, its heading and any intro line.
 *
 * HOW TO EDIT: change the strings. `id` is the #anchor the tab bar and
 * command palette jump to, so if you change one, change those links too.
 */

export const sections = {
  work: {
    id: "work",
    command: "ls .\\work --deployed",
    heading: "Deployments",
    intro:
      "Who it was for, what they needed, what I shipped and how it was built: hand-written, or AI-assisted with me reviewing and testing every change.",
    handWrittenCommand: "ls .\\work --hand-written",
    handWrittenHeading: "Hand-written projects",
    moreCommand: "ls .\\work --more",
    caseStudyCta: "Read the case study",
  },
  howIWork: {
    id: "how-i-work",
    command: "Get-Help .\\how-i-work",
    heading: "How I work",
  },
  experience: {
    id: "experience",
    command: "git log --career",
    heading: "From the dish pit to the tech lead",
  },
  skills: {
    id: "skills",
    command: "cat skills.json",
    heading: "Skills",
    educationCommand: "cat education.md",
    educationHeading: "Education",
  },
  fieldNotes: {
    id: "field-notes",
    command: "ls .\\field-notes",
    heading: "Field notes",
    intro: "Short write-ups of real problems from these deployments, with private details removed.",
  },
  contact: { id: "contact" },
  /** Accessible names for sections that have no visible heading. */
  profileCard: { id: "winfetch", label: "Profile summary" },
  impact: { label: "Impact" },
} as const;

/** Labels for the deployment card fields. */
export const deploymentLabels = {
  customer: "Customer",
  problem: "Problem",
  shipped: "Shipped",
  result: "Result",
  build: "Built",
  stack: "Stack",
  featured: "Featured",
} as const;
