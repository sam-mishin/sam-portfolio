/**
 * components/SourceLink.tsx — a small "</> Hero.tsx" link that opens the
 * code behind a section on GitHub, for developers who want to see how
 * it's built. `SourceRow` puts one at the right end of a prompt line.
 *
 * On Vercel the link points at the exact commit that's deployed
 * (VERCEL_GIT_COMMIT_SHA, read at build time), so the code you open is the
 * code you're looking at; elsewhere it points at the main branch. The
 * repository and an on/off switch live in content/site.ts.
 */
import type { ReactNode } from "react";
import { site } from "@/content/site";
import styles from "./SourceLink.module.css";

/** Props for {@link SourceLink}. */
export interface SourceLinkProps {
  /** Path inside the repository, e.g. "components/Hero.tsx". */
  file: string;
}

/** Link to a file in the site's GitHub repository. Renders nothing if disabled. */
export function SourceLink({ file }: SourceLinkProps) {
  const { enabled, repo, branch, label } = site.source;
  if (!enabled) return null;
  const ref = process.env.VERCEL_GIT_COMMIT_SHA || branch;
  const name = file.split("/").pop() ?? file;
  return (
    <a
      className={styles.link}
      data-no-print
      href={`${repo}/blob/${ref}/${file}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label.replace("{file}", name)}
    >
      <span className={styles.icon} aria-hidden="true">
        {"</>"}
      </span>
      <span className={styles.name}>{name}</span>
    </a>
  );
}

/** Props for {@link SourceRow}. */
export interface SourceRowProps {
  /** The line on the left, usually a Prompt. */
  children: ReactNode;
  /** Path inside the repository for the link on the right. */
  file: string;
  /** Spacing class from the parent. */
  className?: string;
}

/** A prompt line with a {@link SourceLink} at its right end. */
export function SourceRow({ children, file, className }: SourceRowProps) {
  return (
    <div className={className ? `${styles.row} ${className}` : styles.row}>
      {children}
      <SourceLink file={file} />
    </div>
  );
}
