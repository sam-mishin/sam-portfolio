/**
 * components/Prompt.tsx — one PowerShell prompt line: `PS C:\sam> command`.
 *
 * It's the eyebrow above every section (`whoami`, `ls .\work`,
 * `git log --career`…) and the command lines inside terminal windows.
 * PowerShell colors typed commands yellow, so the command uses the --key
 * token while the path uses --text-body.
 */
import type { ReactNode } from "react";
import { site } from "@/content/site";
import styles from "./Prompt.module.css";

/** Props for {@link Prompt}. */
export interface PromptProps {
  /** The command after the prompt. Leave empty for a bare prompt (e.g. one ending in a cursor). */
  children?: ReactNode;
  /** Extra content after the command that should not be colored as a command, such as a {@link Cursor}. */
  after?: ReactNode;
  /** Element to render. Defaults to `p`; use `div` when the line sits inside another paragraph-like element. */
  as?: "p" | "div";
  /** Optional class for spacing set by the parent (margins, padding). */
  className?: string;
}

/** A `PS C:\sam>` prompt followed by a command in the typed-command color. */
export function Prompt({ children, after, as: Tag = "p", className }: PromptProps) {
  return (
    <Tag className={className ? `${styles.prompt} ${className}` : styles.prompt}>
      <span className={styles.path}>{site.promptPath}</span>
      {children ? <span className={styles.command}> {children}</span> : " "}
      {after}
    </Tag>
  );
}
