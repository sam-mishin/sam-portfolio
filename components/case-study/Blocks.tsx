/**
 * components/case-study/Blocks.tsx — small building blocks the case-study
 * .mdx files use alongside plain markdown:
 * - <Decisions> / <Decision>: the grid of key-decision cards
 * - <CodeExcerpt>: a titled code block. Put a ```fenced``` block inside it
 *   and it's syntax-highlighted with a copy button.
 * - <Todo>: a paragraph Sam still has to write, shown as a [placeholder]
 * - <Aside>: a muted note (e.g. "Working with AI")
 */
import type { ReactNode } from "react";
import styles from "./Blocks.module.css";
import { findFencedCode } from "@/lib/mdx-code";
import { isPlaceholder } from "../Placeholder";
import { CodeBlock } from "./CodeBlock";

/** Props for {@link Decisions}. */
export interface DecisionsProps {
  /** {@link Decision} cards. */
  children: ReactNode;
}

/** Grid of key-decision cards. */
export function Decisions({ children }: DecisionsProps) {
  return <div className={styles.decisions}>{children}</div>;
}

/** Props for {@link Decision}. */
export interface DecisionProps {
  /** Short decision name, e.g. "No double charges". */
  title: string;
  /** One or two sentences on what was decided and why. */
  children: ReactNode;
}

/** One key-decision card. */
export function Decision({ title, children }: DecisionProps) {
  return (
    <div className={styles.decision}>
      <h3 className={styles.decisionTitle}>{title}</h3>
      <div className={styles.decisionBody}>{children}</div>
    </div>
  );
}

/** Props for {@link CodeExcerpt}. */
export interface CodeExcerptProps {
  /** File name shown in the header, e.g. "charge.ts — excerpt". */
  title: string;
  /** A ```fenced``` code block, or a [placeholder] until a real excerpt is pasted in. */
  children: ReactNode;
}

/** A code block with a file-name header. Scrolls sideways inside itself if a line is long. */
export function CodeExcerpt({ title, children }: CodeExcerptProps) {
  const fenced = findFencedCode(children);
  if (fenced) return <CodeBlock code={fenced.code} lang={fenced.lang} title={title} />;
  // Still a [placeholder]: leave the excerpt off the page.
  if (typeof children === "string" && isPlaceholder(children)) return null;
  return (
    <figure className={styles.code}>
      <figcaption className={styles.codeTitle}>{title}</figcaption>
      {/* tabIndex lets keyboard users scroll a long line sideways. */}
      <pre className={styles.codeBody} tabIndex={0}>
        {children}
      </pre>
    </figure>
  );
}

/** Props for {@link Todo}. */
export interface TodoProps {
  /** What Sam needs to add, in [brackets]. */
  children: ReactNode;
}

/**
 * Content still to be written. It stays in the .mdx file as a reminder
 * but renders nothing, so a placeholder never reaches the live site.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Todo({ children }: TodoProps) {
  return null;
}

/** Props for {@link Aside}. */
export interface AsideProps {
  /** Small heading, e.g. "Working with AI". */
  title: string;
  /** The note. */
  children: ReactNode;
}

/** A bordered side note within a section. */
export function Aside({ title, children }: AsideProps) {
  return (
    <aside className={styles.aside}>
      <p className={styles.asideTitle}>{title}</p>
      <div>{children}</div>
    </aside>
  );
}
