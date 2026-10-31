/**
 * components/Hero.tsx — the top of the home page: `PS C:\sam> whoami`, the
 * headline, a one-paragraph intro, the two calls to action and the
 * "open to roles" line. All text comes from content/profile.ts.
 *
 * On the first home-page view of a session, `whoami` and the headline type
 * themselves out (TypeIn), the end of the headline gets selected like text
 * in an editor, and the intro and buttons fade in. Timings live in
 * lib/typing.ts; whether it plays at all is decided in lib/intro.ts.
 */
import { profile } from "@/content/profile";
import { heroTimings } from "@/lib/typing";
import { ButtonLink } from "./ButtonLink";
import { Prompt } from "./Prompt";
import { SourceRow } from "./SourceLink";
import { TypeIn, type TypeInSegment } from "./TypeIn";
import styles from "./Hero.module.css";

/** Splits the headline so the highlighted part can get its own class. */
function headlineSegments(headline: string, highlight: string): TypeInSegment[] {
  const at = headline.indexOf(highlight);
  if (!highlight || at < 0) return [{ text: headline }];
  return [
    { text: headline.slice(0, at) },
    { text: highlight, className: styles.highlight },
    { text: headline.slice(at + highlight.length) },
  ].filter((segment) => segment.text);
}

/** The home-page hero. */
export function Hero() {
  const { hero } = profile;
  const timing = heroTimings(hero.command, hero.headline);
  return (
    <section
      aria-labelledby="hero-heading"
      className={styles.hero}
      // When the typing finishes; the highlight, caret and fade-in wait for it.
      style={{ "--type-end": `${timing.end}ms` } as React.CSSProperties}
    >
      <SourceRow file="components/Hero.tsx">
        <Prompt className={styles.prompt}>
          <TypeIn segments={[{ text: hero.command }]} timing={timing.command} />
        </Prompt>
      </SourceRow>
      <h1 id="hero-heading" className={styles.headline}>
        <TypeIn
          segments={headlineSegments(hero.headline, hero.headlineHighlight)}
          timing={timing.headline}
          // After the highlight sweep and the fade-in (Hero.module.css).
          endIntroAfter={1500}
        />
        {/* The zero-width space gives the inline caret a line box to fill. */}
        <span className={styles.caret} aria-hidden="true">
          {"\u200B"}
        </span>
      </h1>
      <p className={styles.intro}>{hero.intro}</p>
      <div className={styles.actions}>
        <ButtonLink href={hero.primaryCta.href} className={styles.cta}>
          {hero.primaryCta.label}
        </ButtonLink>
        <ButtonLink href={hero.secondaryCta.href} variant="secondary" download className={styles.cta}>
          {hero.secondaryCta.label}
        </ButtonLink>
        <p className={styles.status}>
          <span className={styles.dot} aria-hidden="true" />
          <span>
            {hero.availability}
            <span className={styles.location}> · {hero.location}</span>
          </span>
        </p>
      </div>
    </section>
  );
}
