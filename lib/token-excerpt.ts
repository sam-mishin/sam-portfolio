/**
 * lib/token-excerpt.ts — picks a few real lines out of app/globals.css for
 * the code excerpt in "How this site is built".
 *
 * The excerpt is read from the stylesheet at build time instead of being
 * copied into the content, so what the page shows is always the code that
 * actually styles it. Lines are kept exactly as written (comments too);
 * only the tokens not asked for are left out.
 */

/** One block of the excerpt: a selector in globals.css and the tokens to show from it. */
export interface ExcerptBlock {
  /** The selector, exactly as it opens a block, e.g. `:root` or `[data-theme="light"]`. */
  selector: string;
  /** Which occurrence of that selector to read (globals.css has more than one `:root`). Defaults to 0. */
  occurrence?: number;
  /** Custom property names without the `--`, in the order to show them. */
  tokens: readonly string[];
}

/** The lines inside the nth `selector {` block (one level deep), or null if it isn't there. */
function blockLines(css: string, selector: string, occurrence = 0): string[] | null {
  let from = 0;
  let start = -1;
  for (let i = 0; i <= occurrence; i++) {
    start = css.indexOf(`\n${selector} {`, from);
    if (start === -1) return null;
    from = start + 1;
  }
  const end = css.indexOf("\n}", start + 1);
  if (end === -1) return null;
  return css.slice(start + 1, end).split("\n").slice(1);
}

/**
 * Builds the excerpt: each block's selector, the requested token lines as
 * they appear in the file, and a closing brace. Throws if a selector or
 * token is missing, so a rename in globals.css fails the build instead of
 * quietly shrinking the excerpt.
 */
export function tokenExcerpt(css: string, blocks: readonly ExcerptBlock[]): string {
  return blocks
    .map(({ selector, occurrence, tokens }) => {
      const lines = blockLines(css, selector, occurrence);
      if (!lines) throw new Error(`globals.css has no "${selector} {" block`);
      const picked = tokens.map((name) => {
        const line = lines.find((l) => l.trimStart().startsWith(`--${name}:`));
        if (!line) throw new Error(`"${selector}" in globals.css has no --${name}`);
        return line;
      });
      return [`${selector} {`, ...picked, "}"].join("\n");
    })
    .join("\n\n");
}
