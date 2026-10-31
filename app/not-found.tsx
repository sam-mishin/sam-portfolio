/**
 * app/not-found.tsx — the 404 page, for any address that doesn't exist
 * (including mistyped case studies; see proxy.ts).
 *
 * It's styled as PowerShell's "Cannot find path" error inside a terminal
 * window, then offers two ways out and a live prompt (the same one as on
 * the winfetch card) for anyone who'd rather type `cd ~`. The wording
 * lives in content/not-found.ts.
 *
 * Next.js answers with status 404 and adds a noindex robots tag, so this
 * page never shows up in search results.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { MissingPath } from "@/components/MissingPath";
import { TerminalPrompt } from "@/components/TerminalPrompt";
import { TerminalWindow } from "@/components/TerminalWindow";
import { notFound as text } from "@/content/not-found";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: text.title,
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className={styles.page} aria-labelledby="not-found-heading">
      <h1 id="not-found-heading" className={styles.heading}>
        {text.heading}
      </h1>
      <p className={styles.intro}>{text.intro}</p>

      <TerminalWindow className={styles.window}>
        <div className={styles.body}>
          <MissingPath />
        </div>
        <p className={styles.try}>{text.tryPrompt}</p>
        <TerminalPrompt className={styles.prompt} />
      </TerminalWindow>

      <ul className={styles.links}>
        {text.links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={styles.link}>
              <span className={styles.linkLabel}>{link.label}</span>
              <span className={styles.linkHint}>{link.hint}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
