/**
 * content/how-i-work.ts — the "How I work" section: six steps from first
 * conversation to the next improvement.
 *
 * HOW TO EDIT
 * - One sentence per step.
 * - `artifact` is the link to a real piece of evidence for that step (a
 *   discovery note, a rollout plan, training notes…). While `href` is
 *   empty the label shows as a [placeholder] instead of a link.
 */

export interface WorkStep {
  title: string;
  body: string;
  artifact: { label: string; href: string };
}

export const howIWork: WorkStep[] = [
  {
    title: "Listen",
    body: "I start with the people who will use it — the owner, the GM and the staff — and gather what they actually need.",
    artifact: { label: "[Link: a discovery note]", href: "" },
  },
  {
    title: "Prototype in days",
    body: "I get a working version in front of them early, so we react to a real screen instead of a spec.",
    artifact: { label: "[Link: an early prototype]", href: "" },
  },
  {
    title: "Ship",
    body: "It goes live on the systems they already run, like Clover, Twilio, OwnerRez and Webflow.",
    artifact: { label: "[Link: a rollout plan]", href: "" },
  },
  {
    title: "Train",
    body: "I train the staff on each system myself.",
    artifact: { label: "[Link: training notes]", href: "" },
  },
  {
    title: "Measure",
    body: "I check that it’s used and that it works — every mismatch the cash drawer app has flagged has been under $1.",
    artifact: { label: "[Link: a results write-up]", href: "" },
  },
  {
    title: "Improve",
    body: "Then I fix what broke, like redesigning the spend tracker’s Clover sync around duplicate customer records.",
    artifact: { label: "[Link: a field note]", href: "" },
  },
];
