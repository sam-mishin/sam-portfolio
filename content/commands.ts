/**
 * content/commands.ts — everything in the command palette (press / or
 * Ctrl+K): the commands, their hints, and the palette's labels and
 * messages.
 *
 * HOW TO EDIT
 * - Each command has a `label` (what you'd type), a `hint`, a `group`
 *   heading and an `action`. Typing filters on label and hint.
 * - Actions: "link" (a page or #section), "external" (opens a new tab),
 *   "copy-email", "download", "toggle-theme", "winfetch" (jump to the
 *   profile card), "hire" (the easter egg) and "help" (show everything).
 * - Project commands are added automatically for every case study in
 *   content/projects.ts; add extra ones below.
 */
import type { Command } from "@/lib/palette";
import { profile } from "./profile";
import { deployments, handWritten } from "./projects";

export const paletteText = {
  /** Accessible name of the dialog. */
  label: "Command palette",
  /** The search button in the header. */
  openButton: "Search",
  openButtonLabel: "Open the command palette",
  placeholder: "Type a command or search…",
  inputLabel: "Type a command",
  /** Accessible name of the results list. */
  listLabel: "Commands",
  /** The "esc" key cap that closes the palette (tappable on phones). */
  closeKey: "esc",
  closeLabel: "Close (esc)",
  /** Shown next to the highlighted row. */
  enterHint: "↵",
  /** Shown when nothing matches; {query} is replaced with what was typed. */
  notFound: "command not found: {query} — try",
  notFoundHelp: "help",
  /** Keyboard hints along the bottom. */
  hints: ["↑↓ navigate", "↵ open", "esc close"],
  tryLine: "try: winfetch · sudo hire sam",
  /** Messages printed after an action. */
  copied: profile.contact.copied,
  copyFailed: "clipboard blocked — opening your mail app instead",
  /** {theme} is replaced with "light" or "dark". */
  themeSet: "✓ theme set to {theme}",
  hire: "[sudo] password for recruiter: ******** ✓ permission granted — opening your mail app…",
  /** Subject line for the "sudo hire sam" email. */
  hireSubject: "Let’s talk about a role",
} as const;

const caseStudyCommands: Command[] = deployments
  .filter((d) => d.caseStudy)
  .map((d) => ({
    label: `open ${d.slug}`,
    hint: d.title,
    group: "Projects",
    icon: "◆",
    action: { kind: "link", href: `/work/${d.slug}` },
  }));

const handWrittenCommands: Command[] = handWritten.map((p) => ({
  label: `open ${p.title.toLowerCase().replace(/\s+/g, "-")}`,
  hint: "Hand-written · GitHub",
  group: "Projects",
  icon: "◆",
  action: { kind: "external", href: p.href },
}));

export const commands: Command[] = [
  { label: "cd ~", hint: "Home", group: "Pages", icon: "▸", action: { kind: "link", href: "/" } },
  { label: "cd ~/work", hint: "Deployments", group: "Pages", icon: "▸", action: { kind: "link", href: "/#work" } },
  {
    label: "cd ~/how-i-work",
    hint: "Listen → Prototype → Ship → Train → Measure → Improve",
    group: "Pages",
    icon: "▸",
    action: { kind: "link", href: "/#how-i-work" },
  },
  {
    label: "cd ~/experience",
    hint: "git log --career",
    group: "Pages",
    icon: "▸",
    action: { kind: "link", href: "/#experience" },
  },
  {
    label: "cd ~/contact",
    hint: "Email, LinkedIn, GitHub",
    group: "Pages",
    icon: "▸",
    action: { kind: "link", href: "/#contact" },
  },
  ...caseStudyCommands,
  ...handWrittenCommands,
  { label: "cp email", hint: profile.contact.email, group: "Actions", icon: "▣", action: { kind: "copy-email" } },
  {
    label: "wget resume.pdf",
    hint: "Download résumé",
    group: "Actions",
    icon: "↓",
    action: { kind: "download", href: profile.hero.secondaryCta.href },
  },
  { label: "theme --toggle", hint: "Light / dark", group: "Actions", icon: "◐", action: { kind: "toggle-theme" } },
  { label: "winfetch", hint: "Show the profile card", group: "Actions", icon: "$", action: { kind: "winfetch" } },
  { label: "sudo hire sam", hint: "Permission granted", group: "Actions", icon: "$", action: { kind: "hire" } },
  { label: "help", hint: "List every command", group: "Actions", icon: "?", action: { kind: "help" } },
];
