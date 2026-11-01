/**
 * content/field-notes.ts — "Field notes": short write-ups of real problems
 * from deployments, with private details removed.
 *
 * HOW TO EDIT
 * - Each entry is a card. While `href` is empty the card shows the
 *   `status` label instead of a link.
 * - When a note is written, set `status` to its date (e.g. "Jan 2027"),
 *   replace the [placeholder] summary, set `href` and remove `draft`.
 * - `draft: true` keeps a note off the live site. If every note is a
 *   draft, the whole Field notes section is hidden.
 */

export interface FieldNote {
  title: string;
  summary: string;
  status: string;
  href: string;
  /** Not written yet: left off the site. */
  draft?: boolean;
}

export const fieldNotes: FieldNote[] = [
  {
    title: "Duplicate Clover customers and the deduper",
    summary: "[Add: how duplicate customer records skewed the spend tracker, and how the deduper matches them]",
    status: "Draft — coming soon",
    href: "",
    draft: true,
  },
  {
    title: "Moving about 800 club members to Trellis",
    summary: "[Add: the migration plan, validation, cutover and rollback, written up after the January 2027 go-live]",
    status: "Draft — coming soon",
    href: "",
    draft: true,
  },
  {
    title: "Receptionist evals: what the AI got wrong",
    summary: "[Add: how call transcripts were sorted by outcome, the top failure fixed, and the before/after rate]",
    status: "Draft — coming soon",
    href: "",
    draft: true,
  },
];
