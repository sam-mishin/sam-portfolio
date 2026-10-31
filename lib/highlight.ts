/**
 * lib/highlight.ts — syntax highlighting for code on case-study pages,
 * done at build time with Shiki, so pages ship plain HTML with no
 * highlighting JavaScript.
 *
 * It uses Shiki's "CSS variables" theme: each token gets a color like
 * var(--shiki-token-keyword), and app/globals.css points those variables
 * at the Ayu syntax tokens. So code follows the light/dark toggle for free
 * and always matches the rest of the site.
 */
import { cacheLife } from "next/cache";
import { createCssVariablesTheme, createHighlighter, createJavaScriptRegexEngine, type Highlighter } from "shiki";

const THEME_NAME = "ayu-vars";
const theme = createCssVariablesTheme({ name: THEME_NAME, variablePrefix: "--shiki-", fontStyle: true });

/** Languages case studies are likely to use. Anything else renders as plain text. */
const LANGUAGES = ["ts", "tsx", "js", "jsx", "json", "sql", "bash", "powershell", "python", "css", "html", "yaml"];

let highlighter: Promise<Highlighter> | null = null;

/** One shared highlighter for the whole build (creating one is slow). */
function getHighlighter(): Promise<Highlighter> {
  // The JavaScript regex engine avoids loading WebAssembly on the server.
  highlighter ??= createHighlighter({ themes: [theme], langs: LANGUAGES, engine: createJavaScriptRegexEngine() });
  return highlighter;
}

/**
 * `code` as highlighted HTML: a <pre class="shiki"> with one span per
 * token. Unknown languages fall back to plain text instead of failing the
 * build.
 */
export async function highlight(code: string, lang: string): Promise<string> {
  // Cached: the same code always gives the same HTML. This also lets Shiki
  // read the clock internally while prerendering, which Cache Components
  // otherwise forbids outside a cache scope.
  "use cache";
  cacheLife("max");
  const shiki = await getHighlighter();
  const known = shiki.getLoadedLanguages().includes(lang);
  return shiki.codeToHtml(code.replace(/\n$/, ""), { lang: known ? lang : "text", theme: THEME_NAME });
}
