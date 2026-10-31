/**
 * components/Prompt.tsx — one PowerShell prompt line: `PS C:\sam> command`.
 *
 * It's the eyebrow above every section (`whoami`, `ls .\work`,
 * `git log --career`…) and the command lines inside terminal windows.
 * Colors follow the Ayu editor theme: the path is a tag (--syn-tag) and
 * the command a function name (--syn-func).
 *
 * With `typeOnScroll`, the line types itself out as it scrolls into view
 * (section eyebrows use this). It's a stepped clip-path wipe, one step per
 * character, which works because the font is monospaced.
 */
import type { ReactNode } from "react";
import { site } from "@/content/site";
import styles from "./Prompt.module.css";

/** Props for {@link Prompt}. */
export interface PromptProps {
  /** The command after the prompt. Leave empty for a bare prompt (e.g. one ending in a cursor). */
  children?: ReactNode;
  /** Extra content after the command that should not be colored as a command, such as a cursor. */
  after?: ReactNode;
  /** Element to render. Defaults to `p`; use `div` when the line sits inside another paragraph-like element. */
  as?: "p" | "div";
  /** Optional class for spacing set by the parent (margins, padding). */
  className?: string;
  /** Type the line out as it scrolls into view. Needs a plain-text command. */
  typeOnScroll?: boolean;
}

/** A `PS C:\sam>` prompt followed by a command in the typed-command color. */
export function Prompt({ children, after, as: Tag = "p", className, typeOnScroll }: PromptProps) {
  const typing = typeOnScroll && typeof children === "string";
  const classes = [styles.prompt, typing && styles.typeOnScroll, className].filter(Boolean).join(" ");
  // Characters to step through: the path, the space and the command.
  const style = typing ? ({ "--chars": site.promptPath.length + 1 + children.length } as React.CSSProperties) : undefined;
  return (
    <Tag className={classes} style={style}>
      <span className={styles.path}>{site.promptPath}</span>
      {children ? <span className={styles.command}> {children}</span> : " "}
      {after}
    </Tag>
  );
}
