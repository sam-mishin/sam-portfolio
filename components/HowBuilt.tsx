/**
 * components/HowBuilt.tsx — the "How this site is built" section: six
 * short cards on the design system, theming, accessibility and motion,
 * then a real excerpt of the design tokens from app/globals.css.
 *
 * Copy comes from content/how-built.ts. The excerpt is read from the
 * stylesheet at build time (lib/token-excerpt.ts), so it always matches
 * the code that styles the page. The cards and code block are the same
 * components the case studies use.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { howBuilt as s } from "@/content/how-built";
import { tokenExcerpt } from "@/lib/token-excerpt";
import { Decision, Decisions } from "./case-study/Blocks";
import { CodeBlock } from "./case-study/CodeBlock";
import { Section } from "./Section";
import styles from "./HowBuilt.module.css";

/** Design-system notes plus the token excerpt. */
export function HowBuilt() {
  const css = readFileSync(path.join(process.cwd(), "app/globals.css"), "utf8");
  const code = tokenExcerpt(css, s.excerpt.blocks);
  return (
    <Section id={s.id} command={s.command} heading={s.heading} intro={s.intro} source="components/HowBuilt.tsx">
      <div className={styles.body}>
        <div className={styles.cards}>
          <Decisions>
            {s.items.map((item) => (
              <Decision key={item.title} title={item.title}>
                {item.body}
              </Decision>
            ))}
          </Decisions>
        </div>
        <CodeBlock code={code} lang="css" title={s.excerpt.title} />
        <p className={styles.more}>
          <a href={s.link.href} target="_blank" rel="noopener noreferrer">
            {s.link.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      </div>
    </Section>
  );
}
