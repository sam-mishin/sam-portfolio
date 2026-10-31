/**
 * lib/mdx-code.ts — finds the code inside a ```fenced``` block as MDX
 * renders it: <pre><code className="language-ts">…text…</code></pre>.
 *
 * Fenced blocks are how case studies include code: unlike a JavaScript
 * template string inside JSX, MDX keeps their indentation intact.
 */
import { isValidElement, type ReactNode } from "react";

/** The language and text of the first fenced code block in `node`, if any. */
export function findFencedCode(node: ReactNode): { lang: string; code: string } | null {
  if (!isValidElement(node)) return null;
  const props = node.props as { className?: unknown; children?: ReactNode };
  if (typeof props.className === "string" && props.className.startsWith("language-") && typeof props.children === "string") {
    return { lang: props.className.slice("language-".length), code: props.children };
  }
  const children = Array.isArray(props.children) ? props.children : [props.children];
  for (const child of children) {
    const found = findFencedCode(child);
    if (found) return found;
  }
  return null;
}
