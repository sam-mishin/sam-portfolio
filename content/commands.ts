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
 * - Shell commands print into the palette's output pane: "print" (fixed
 *   lines, built from the other content files so they never drift),
 *   "date", "uptime", "history", "clear", "exit" and "reboot".
 * - Project commands are added automatically for every case study in
 *   content/projects.ts; add extra ones below.
 */
import type { Command } from "@/lib/palette";
import { jobs } from "./jobs";
import { nav } from "./nav";
import { profile } from "./profile";
import { deployments, handWritten } from "./projects";
import { site } from "./site";
import { education } from "./skills";

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
  tryLine: "try: ls · git log · sudo hire sam",
  /** Messages printed after an action. */
  copied: profile.contact.copied,
  copyFailed: "clipboard blocked — opening your mail app instead",
  /** {theme} is replaced with "light" or "dark". */
  themeSet: "✓ theme set to {theme}",
  hire: "[sudo] password for recruiter: ******** ✓ permission granted — opening your mail app…",
  /** Subject line for the "sudo hire sam" email. */
  hireSubject: "Let’s talk about a role",
  /** Accessible name of the output pane. */
  outputLabel: "Command output",
  /** {uptime} is replaced with e.g. "3 years, 0 months, 30 days". */
  uptime: "coding for {uptime} (since Oct 2023)",
  historyEmpty: "no commands yet",
} as const;

/** The interactive prompt at the bottom of the winfetch card. */
export const terminalText = {
  /** Accessible name of the input (different from the palette's, so the two are easy to tell apart). */
  inputLabel: "Terminal command",
  /** Shown faintly in the empty prompt. */
  placeholder: "type help and press Enter",
  /** Screen-reader hint describing the input. */
  hint: "Run commands like ls, whoami or cd ~/work. Tab completes, up and down arrows recall earlier commands.",
  outputLabel: "Terminal output",
  /** {input} is replaced with what was typed. Styled like PowerShell's error. */
  notFound: "{input} : The term '{input}' is not recognized as a command. Try 'help'.",
  helpIntro: "Commands (Tab completes, ↑ ↓ recall):",
  winfetchHere: "You’re looking at it ↑",
  downloading: "downloading resume.pdf…",
  exit: "logout — but the site’s still here.",
} as const;

/**
 * Other things people type out of habit, mapped to a command label. Used
 * by the terminal prompt (lib/shell.ts).
 */
export const commandAliases: Record<string, string> = {
  neofetch: "winfetch",
  cls: "clear",
  dir: "ls",
  "ls -la": "ls",
  "ls -l": "ls",
  "cat resume": "cat resume.txt",
  "git log": "git log --oneline",
  cd: "cd ~",
  "cd ..": "cd ~",
  "cd /": "cd ~",
  man: "help",
  "?": "help",
  theme: "theme --toggle",
  "hire sam": "sudo hire sam",
  "sudo hire": "sudo hire sam",
  email: "cp email",
  resume: "wget resume.pdf",
  logout: "exit",
  "sudo rm -rf /": "rm -rf /",
  "rm -rf": "rm -rf /",
  quit: "exit",
};

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
  { label: "winfetch", hint: "Show the profile card (neofetch)", group: "Actions", icon: "$", action: { kind: "winfetch" } },
  { label: "sudo hire sam", hint: "Permission granted", group: "Actions", icon: "$", action: { kind: "hire" } },
  { label: "help", hint: "List every command", group: "Actions", icon: "?", action: { kind: "help" } },
  ...shellCommands(),
];

/** The just-for-fun shell commands. Output is built from the other content files. */
function shellCommands(): Command[] {
  const shell = (label: string, hint: string, action: Command["action"]): Command => ({
    label,
    hint,
    group: "Shell",
    icon: ">",
    action,
  });
  const current = jobs[0];
  return [
    shell("ls", "List what’s here", {
      kind: "print",
      lines: [[...nav.tabs.map((t) => `${t.label}/`), "resume.pdf"].join("   ")],
    }),
    shell("pwd", "Where am I?", { kind: "print", lines: [site.promptPath.replace(/^PS\s+/, "").replace(/>$/, "")] }),
    shell("whoami", "Who is this?", {
      kind: "print",
      lines: [`${profile.winfetch.user} — ${site.title.split(" — ")[1] ?? ""}`.trim(), profile.hero.availability],
    }),
    shell("cat resume.txt", "The short version", {
      kind: "print",
      lines: [
        site.title,
        `${current.role} · ${current.org} · ${current.dates}`,
        ...education.slice(0, 1).map((e) => `${e.title} · ${e.detail}`),
        "full version: wget resume.pdf",
      ],
    }),
    shell("git log --oneline", "Career history", {
      kind: "print",
      lines: jobs.map((j) => `${j.hash} ${j.role} — ${j.org}`),
    }),
    shell("uptime", "How long I’ve been coding", { kind: "uptime" }),
    shell("date", "Today’s date", { kind: "date" }),
    shell("history", "Commands you’ve run", { kind: "history" }),
    shell("clear", "Clear the output", { kind: "clear" }),
    shell("reboot", "Replay the boot screen", { kind: "reboot" }),
    shell("rm -rf /", "Please don’t", {
      kind: "print",
      lines: ["rm: cannot remove '/': this portfolio is load-bearing", "(nice try)"],
    }),
    shell("exit", "Close this", { kind: "exit" }),
  ];
}
