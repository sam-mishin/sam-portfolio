/**
 * content/boot.ts — the lines on the first-visit boot screen
 * (components/BootScreen.tsx), styled like PowerShell starting up and
 * running a profile script.
 *
 * HOW TO EDIT
 * - `lines` print top to bottom, one every ~110ms.
 * - "{ms}" in a line is replaced with the real time the page took to load.
 * - `checks` are the "✓ name  value" rows. A value can be one string, or
 *   { dark, light } to follow the theme toggle.
 * - Facts here come from the other content files, so they stay in sync.
 */
import { deployments, handWritten } from "./projects";
import { site } from "./site";

export const boot = {
  /** Shown before the profile line, like PowerShell's banner. */
  banner: "PowerShell 7",
  /** "{ms}" becomes the measured load time. */
  loaded: "Loading personal and system profiles took {ms}ms.",
  command: `${site.promptPath} .\\portfolio.ps1`,
  checks: [
    { name: "fonts", value: "Cascadia Code, IBM Plex Sans" },
    { name: "theme", value: { dark: "Ayu Dark Unbordered", light: "Ayu Light" } },
    { name: "work", value: `${deployments.length} deployments, ${handWritten.length} hand-written projects` },
    { name: "palette", value: "press / anytime" },
  ] as { name: string; value: string | { dark: string; light: string } }[],
  /** Text after the progress bar. */
  done: "ready",
  /** For screen readers nothing is announced; this is the skip hint. */
  skip: "press any key to skip",
};
