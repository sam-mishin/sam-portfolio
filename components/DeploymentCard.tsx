/**
 * components/DeploymentCard.tsx — one card in the "Deployments" grid:
 * screenshot, customer, title, then problem → shipped → result → how it
 * was built, the stack, and a link to the case study when there is one.
 *
 * The `featured` card (Trellis) is the wide version with the screenshot on
 * the right and status pills on top. Fields are a <dl> so screen readers
 * announce "Problem", "Shipped"… before each value.
 *
 * The case-study link is tagged "nav-forward", so the page change slides
 * forward (see components/PageTransition.tsx).
 */
import Link from "next/link";
import { deploymentLabels, sections } from "@/content/home";
import type { Deployment } from "@/content/projects";
import { NAV_FORWARD } from "@/lib/transitions";
import { hasImage, isPlaceholder, Shot, Text } from "./Placeholder";
import styles from "./DeploymentCard.module.css";

/** Props for {@link DeploymentCard}. */
export interface DeploymentCardProps {
  /** The deployment to show, from content/projects.ts. */
  deployment: Deployment;
}

/** A customer deployment: who, problem, what shipped, result, how built. */
export function DeploymentCard({ deployment: d }: DeploymentCardProps) {

  // Fields still holding [placeholder] text are left off the card.
  const fields = [
    { label: deploymentLabels.problem, value: d.problem },
    { label: deploymentLabels.shipped, value: d.shipped },
    { label: deploymentLabels.result, value: d.result },
    { label: deploymentLabels.build, value: d.build },
  ].filter((field) => !isPlaceholder(field.value));

  return (
    <article
      className={`${styles.card} ${d.featured ? styles.featured : ""} reveal`}
      aria-labelledby={`deploy-${d.slug}`}
      data-spotlight
    >
      {!d.featured && <Shot shot={d.shot} />}

      <div className={styles.body}>
        {(d.featured || d.status) && (
          <p className={styles.pills}>
            {d.featured && <span className={styles.pillAccent}>{deploymentLabels.featured}</span>}
            {d.status && <span className={styles.pill}>{d.status}</span>}
          </p>
        )}
        <p className={styles.customer}>{d.customer}</p>
        <h3 id={`deploy-${d.slug}`} className={styles.title}>
          {d.title}
        </h3>
        <dl className={styles.fields}>
          {fields.map((field) => (
            <div key={field.label} className={styles.field}>
              <dt className={styles.fieldLabel}>{field.label}</dt>
              <dd className={styles.fieldValue}>
                <Text value={field.value} />
              </dd>
            </div>
          ))}
        </dl>
        <ul className={styles.stack} aria-label={deploymentLabels.stack}>
          {d.stack.map((tech) => (
            <li key={tech} className={styles.tag}>
              {tech}
            </li>
          ))}
        </ul>
        {d.caseStudy && (
          <Link href={`/work/${d.slug}`} className={styles.cta} transitionTypes={[NAV_FORWARD]}>
            {sections.work.caseStudyCta}
            <span aria-hidden="true" className={styles.arrow}>
              →
            </span>
            <span className="sr-only">: {d.title}</span>
          </Link>
        )}
      </div>

      {d.featured && hasImage(d.shot) && (
        <div className={styles.featureShot}>
          <Shot shot={d.shot} size="feature" />
        </div>
      )}
    </article>
  );
}
