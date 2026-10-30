/**
 * components/Hero.tsx — the top of the home page: `PS C:\sam> whoami`, the
 * headline, a one-paragraph intro, the two calls to action and the
 * "open to roles" line. All text comes from content/profile.ts.
 */
import { profile } from "@/content/profile";
import { ButtonLink } from "./ButtonLink";
import { Prompt } from "./Prompt";
import styles from "./Hero.module.css";

/** The home-page hero. */
export function Hero() {
  const { hero } = profile;
  return (
    <section aria-labelledby="hero-heading" className={styles.hero}>
      <Prompt className={styles.prompt}>{hero.command}</Prompt>
      <h1 id="hero-heading" className={styles.headline}>
        {hero.headline}
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
