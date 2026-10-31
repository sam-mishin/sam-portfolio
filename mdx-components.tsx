/**
 * mdx-components.tsx — required by @next/mdx. Lists the custom components
 * the case-study .mdx files may use without importing them, and swaps
 * markdown links to internal pages for next/link (client-side navigation).
 * Plain markdown (paragraphs, lists, bold) is styled by the case-study
 * page's CSS.
 */
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { Aside, CodeExcerpt, Decision, Decisions, Todo } from "@/components/case-study/Blocks";
import { CaseSection } from "@/components/case-study/CaseSection";
import { Diagram } from "@/components/case-study/Diagram";

/** Markdown links: internal paths use next/link, everything else a plain <a>. */
function MdxLink({ href = "", ...rest }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/")) return <Link href={href} {...rest} />;
  return <a href={href} {...rest} />;
}

const components: MDXComponents = {
  a: MdxLink,
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
