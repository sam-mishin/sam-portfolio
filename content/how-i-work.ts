/**
 * content/how-i-work.ts — the "How I work" section: six steps from first
 * conversation to the next improvement.
 *
 * HOW TO EDIT
 * - One sentence per step.
 * - `artifact` is a real example of that step. With an `href` it's a link
 *   (e.g. to a case-study section); with an empty `href` the label shows
 *   as plain text, or as a [placeholder] while it's still in brackets.
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
    artifact: {
      label: "Example: rebuilding the cash drawer app around each staff member’s biggest pain point",
      href: "/work/cash-drawer#discovery",
    },
  },
  {
    title: "Prototype in days",
    body: "I get a working version in front of them early, so we react to a real screen instead of a spec.",
    artifact: {
      label:
        "Example: the winery’s wine club software was buggy, full of duplicates and couldn’t show net member gain or loss, so I built a member-tracking prototype in a day, then kept improving it.",
      href: "",
    },
  },
  {
    title: "Ship",
    body: "It goes live on the systems they already run, like Clover, Twilio, OwnerRez and Webflow.",
    artifact: {
      label:
        "Example: the Trellis build plan, which maps every feature, the MVP, the date each feature will be done, and the overall time and cost.",
      href: "",
    },
  },
  {
    title: "Train",
    body: "I train the staff on each system myself.",
    artifact: {
      label:
        "Example: I record training videos for staff to watch, then check in with each person to answer questions and hear their feedback.",
      href: "",
    },
  },
  {
    title: "Measure",
    body: "I check that it’s used and that it works — every mismatch the cash drawer app has flagged has been under $1.",
    artifact: {
      label: "Example: the cash drawer app’s results — staff close out several minutes faster than on paper, with more accurate counts",
      href: "/work/cash-drawer#results",
    },
  },
  {
    title: "Improve",
    body: "Then I fix what broke, like redesigning the spend tracker’s Clover sync around duplicate customer records.",
    artifact: {
      label: "Example: fixing the cash drawer app’s out-of-date Clover total after launch",
      href: "/work/cash-drawer#broke",
    },
  },
];
