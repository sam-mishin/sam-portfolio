/**
 * components/case-study/CodeBlock.tsx — a highlighted code block with a
 * file-name header and a copy button. Used by <CodeExcerpt lang="…"> and
 * by plain ```fenced``` code in the case-study MDX.
 *
 * Highlighting happens on the server at build time (lib/highlight.ts), so
 * the browser only receives colored HTML. Colors come from the Ayu tokens
 * and follow the theme toggle.
 */
import { highlight } from "@/lib/highlight";
import styles from "./Blocks.module.css";
import { CopyCode } from "./CopyCode";

/** Props for {@link CodeBlock}. */
export interface CodeBlockProps {
  /** The code itself. */
  code: string;
  /** Language for highlighting, e.g. "ts", "sql", "powershell". */
  lang: string;
  /** Header text, e.g. "charge.ts — excerpt". Defaults to the language. */
  title?: string;
}

/** A titled, syntax-highlighted code block. */
export async function CodeBlock({ code, lang, title }: CodeBlockProps) {
  const html = await highlight(code, lang);
  return (
    <figure className={styles.code}>
      <figcaption className={styles.codeTitle}>
        <span>{title ?? lang}</span>
        <CopyCode code={code} />
      </figcaption>
      {/* Shiki's output is a <pre tabindex="0"> built from our own source
          files at build time, never from visitor input. */}
      <div className={styles.codeBody} dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}
