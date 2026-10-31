/**
 * mdx-components.tsx — required by @next/mdx. Lists the custom components
 * the case-study .mdx files may use without importing them, and swaps
 * markdown links to internal pages for next/link (client-side navigation)
 * and ```fenced``` code for a highlighted CodeBlock.
 * Plain markdown (paragraphs, lists, bold) is styled by the case-study
 * page's CSS.
 */
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { Aside, CodeExcerpt, Decision, Decisions, Todo } from "@/components/case-study/Blocks";
import { CaseSection } from "@/components/case-study/CaseSection";
import { CodeBlock } from "@/components/case-study/CodeBlock";
import { Diagram } from "@/components/case-study/Diagram";
import { findFencedCode } from "@/lib/mdx-code";

/** Markdown links: internal paths use next/link, everything else a plain <a>. */
function MdxLink({ href = "", ...rest }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/")) return <Link href={href} {...rest} />;
  return <a href={href} {...rest} />;
}

/** ```fenced``` code becomes a highlighted CodeBlock (header shows the language). */
function MdxPre({ children, ...rest }: ComponentPropsWithoutRef<"pre">) {
  const fenced = findFencedCode(children);
  if (fenced) return <CodeBlock code={fenced.code} lang={fenced.lang} />;
  return <pre {...rest}>{children}</pre>;
}

const components: MDXComponents = {
  a: MdxLink,
  pre: MdxPre,
  Aside,
  CaseSection,
  CodeExcerpt,
  Decision,
  Decisions,
  Diagram,
  Todo,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
