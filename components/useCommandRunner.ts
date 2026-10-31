/**
 * components/useCommandRunner.ts — what running a command actually does,
 * shared by the two places commands can be run: the command palette and
 * the interactive prompt in the winfetch card (Terminal).
 *
 * Each surface hands in how to show things (print a block of output,
 * show a one-line status, close itself), and a few commands behave a
 * little differently per surface: `help` lists everything in the palette
 * but prints a summary in the terminal, and `winfetch` scrolls to the card
 * from the palette but just points at it from inside the card.
 */
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { commands, paletteText as text, terminalText } from "@/content/commands";
import { profile } from "@/content/profile";
import { reboot } from "@/lib/boot";
import type { Command } from "@/lib/palette";
import { getHistory, remember } from "@/lib/shell";
import { toggleThemeAnimated } from "@/lib/theme";
import { directionFor } from "@/lib/transitions";
import { formatUptime, uptimeBetween } from "@/lib/uptime";

/** How long "permission granted" stays on screen before the mail app opens. */
const HIRE_DELAY_MS = 1400;

/** How a surface shows the results of a command. */
export interface CommandSurface {
  /** "palette" (the dialog) or "terminal" (the winfetch prompt). */
  kind: "palette" | "terminal";
  /** Print a command and its output lines. */
  print: (command: string, lines: string[]) => void;
  /** Empty the output. */
  clear: () => void;
  /** Show a one-line message (palette: the status line; terminal: printed). */
  status: (command: string, message: string) => void;
  /** Close the surface, if it can close (the palette). */
  close: () => void;
  /** Palette only: show the full command list again. */
  showAll?: () => void;
  /** Where a theme switch should grow from, e.g. the prompt's position. */
  themeOrigin?: () => { x: number; y: number } | undefined;
}

/** Returns `run(command)`, which carries out a command on the given surface. */
export function useCommandRunner(surface: CommandSurface) {
  const router = useRouter();
  const pathname = usePathname();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  /** Close (if a dialog), then navigate on the next frame (see MobileMenu for why). */
  function go(href: string) {
    surface.close();
    requestAnimationFrame(() => router.push(href, { transitionTypes: directionFor(pathname, href) }));
  }

  async function run(command: Command): Promise<void> {
    const { action, label } = command;
    remember(label);
    switch (action.kind) {
      case "link":
        go(action.href);
        return;
      case "external":
        window.open(action.href, "_blank", "noopener,noreferrer");
        surface.close();
        return;
      case "download": {
        const link = document.createElement("a");
        link.href = action.href;
        link.download = "";
        link.click();
        if (surface.kind === "terminal") surface.print(label, [terminalText.downloading]);
        surface.close();
        return;
      }
      case "copy-email":
        try {
          await navigator.clipboard.writeText(profile.contact.email);
          surface.status(label, text.copied);
        } catch {
          surface.status(label, text.copyFailed);
          window.location.href = `mailto:${profile.contact.email}`;
        }
        return;
      case "toggle-theme":
        // Stays open so you can see the new theme and flip back.
        surface.status(label, text.themeSet.replace("{theme}", toggleThemeAnimated(surface.themeOrigin?.())));
        return;
      case "winfetch":
        if (surface.kind === "terminal") {
          surface.print(label, [terminalText.winfetchHere]);
        } else if (pathname === "/") {
          surface.close();
          requestAnimationFrame(() => document.getElementById("winfetch")?.scrollIntoView());
        } else {
          go("/#winfetch");
        }
        return;
      case "hire":
        surface.status(label, text.hire);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          surface.close();
          window.location.href = `mailto:${profile.contact.email}?subject=${encodeURIComponent(text.hireSubject)}`;
        }, HIRE_DELAY_MS);
        return;
      case "help":
        if (surface.showAll) surface.showAll();
        else surface.print(label, helpLines());
        return;
      case "print":
        surface.print(label, action.lines);
        return;
      case "date":
        surface.print(label, [new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "medium" })]);
        return;
      case "uptime":
        surface.print(label, [
          text.uptime.replace("{uptime}", formatUptime(uptimeBetween(profile.winfetch.codingSince, new Date()))),
        ]);
        return;
      case "history": {
        const past = getHistory();
        surface.print(
          label,
          past.length > 1 ? past.map((entry, i) => `${String(i + 1).padStart(3)}  ${entry}`) : [text.historyEmpty],
        );
        return;
      }
      case "clear":
        surface.clear();
        return;
      case "exit":
        if (surface.kind === "terminal") surface.print(label, [terminalText.exit]);
        surface.close();
        return;
      case "reboot":
        surface.close();
        reboot();
        return;
    }
  }

  return run;
}

/** `help` in the terminal: every command, one line per group. */
function helpLines(): string[] {
  const groups = new Map<string, string[]>();
  for (const command of commands) {
    groups.set(command.group, [...(groups.get(command.group) ?? []), command.label]);
  }
  return [terminalText.helpIntro, ...[...groups].map(([group, labels]) => `${group.toLowerCase().padEnd(9)}${labels.join(" · ")}`)];
}
