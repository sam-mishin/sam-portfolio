/**
 * content/not-found.ts — the 404 page (app/not-found.tsx), styled as the
 * error PowerShell prints when you `cd` somewhere that doesn't exist.
 *
 * HOW TO EDIT
 * - `{path}` is replaced with the address the visitor tried, written as a
 *   Windows path (e.g. /work/nope → C:\sam\work\nope).
 * - The error lines copy PowerShell's real output format; change the
 *   wording freely, but keep {path} where the path should appear.
 */

export const notFound = {
  /** Browser tab title. */
  title: "404 — page not found",
  /** The visible heading (screen readers hear this first). */
  heading: "404: that page doesn’t exist.",
  /** Shown under the heading. */
  intro: "The link may be old or mistyped. Here’s the error PowerShell would give you:",
  /** Where the site "lives" on the pretend C: drive. */
  root: "C:\\sam",
  /** Used before the page knows the visitor's address (first render, no JavaScript). */
  fallbackPath: "C:\\sam\\that-page",
  /** The PowerShell error, line by line. The ~~~ underline is drawn automatically. */
  error: [
    "cd : Cannot find path '{path}' because it does not exist.",
    "At line:1 char:1",
  ],
  details: [
    "    + CategoryInfo          : ObjectNotFound: ({path}:String) [Set-Location], ItemNotFoundException",
    "    + FullyQualifiedErrorId : PathNotFound,Microsoft.PowerShell.Commands.SetLocationCommand",
  ],
  /** Ways out. */
  links: [
    { label: "cd ~", hint: "Go to the home page", href: "/" },
    { label: "cd ~/work", hint: "See the deployments", href: "/#work" },
  ],
  /** Above the live prompt at the bottom. */
  tryPrompt: "Or type a command, like help or cd ~:",
} as const;
