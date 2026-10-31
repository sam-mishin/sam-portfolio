"use client";

/**
 * components/MissingPath.tsx — the PowerShell "Cannot find path" error on
 * the 404 page, with the address the visitor actually tried.
 *
 * The 404 page is prerendered once for every missing URL, so the server
 * can't know the address. This reads it in the browser after hydration
 * (useSyncExternalStore with a server value), showing a generic path
 * until then and to visitors without JavaScript.
 *
 * Screen readers get the error message and the two detail lines; the
 * echoed command and the ~~~ underline are hidden from them because they
 * only repeat the path.
 */
import { useSyncExternalStore } from "react";
import { notFound as text } from "@/content/not-found";
import { site } from "@/content/site";
import styles from "./MissingPath.module.css";

/** The address never changes while this page is open, so nothing to subscribe to. */
const subscribe = () => () => {};

/** "/work/nope" → "C:\sam\work\nope". */
export function toWindowsPath(pathname: string): string {
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    // Malformed escapes (a stray %): show it as typed.
  }
  const parts = decoded.split("/").filter(Boolean);
  return [text.root, ...parts].join("\\");
}

/** The error block: echoed command, error, underline and details. */
export function MissingPath() {
  const path = useSyncExternalStore(
    subscribe,
    () => toWindowsPath(window.location.pathname),
    () => text.fallbackPath,
  );
  const fill = (line: string) => line.replaceAll("{path}", path);
  const command = `cd ${path}`;

  return (
    <div className={styles.output}>
      <p className={styles.echo} aria-hidden="true">
        <span className={styles.prompt}>{site.promptPath}</span> <span className={styles.command}>{command}</span>
      </p>
      {text.error.map((line) => (
        <p key={line} className={styles.error}>
          {fill(line)}
        </p>
      ))}
      <p className={styles.error} aria-hidden="true">
        + {command}
        <br />+ {"~".repeat(command.length)}
      </p>
      {text.details.map((line) => (
        <p key={line} className={`${styles.error} ${styles.detail}`}>
          {fill(line)}
        </p>
      ))}
    </div>
  );
}
