/**
 * components/DeploymentCard.tsx — one card in the "Deployments" grid:
 * screenshot, customer, title, then problem → shipped → result → how it
 * was built, the stack, and a link to the case study when there is one.
 *
 * The `featured` card (Trellis) is the wide version with the screenshot on
 * the right and status pills on top. Fields are a <dl> so screen readers
 * announce "Problem", "Shipped"… before each value.
 *
 * View Transitions: for cards with a case study, the title and screenshot
 * carry the same view-transition names as the heading and hero on
 * /work/<slug>. In browsers that support it (Chromium, recent Safari and
 * Firefox), clicking through animates them from the card into the page;
 * elsewhere it's a normal page change. Reduced-motion users get no
 * animation (app/globals.css).
 */
import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { deploymentLabels, sections } from "@/content/home";
import type { Deployment } from "@/content/projects";
import { Shot, Text } from "./Placeholder";
import styles from "./DeploymentCard.module.css";

/** Props for {@link DeploymentCard}. */
export interface DeploymentCardProps {
  /** The deployment to show, from content/projects.ts. */
  deployment: Deployment;
}

/** A customer deployment: who, problem, what shipped, result, how built. */
export function DeploymentCard({ deployment: d }: DeploymentCardProps) {
  // Only cards that link to a case study join a transition; the rest have
  // no matching element on another page.
  const shared = (kind: "title" | "shot", node: ReactNode) =>
    d.caseStudy ? (
      <ViewTransition name={`project-${kind}-${d.slug}`} share="morph" default="none">
        {node}
      </ViewTransition>
    ) : (
      node
    );

  const fields = [
    { label: deploymentLabels.problem, value: d.problem },
    { label: deploymentLabels.shipped, value: d.shipped },
    { label: deploymentLabels.result, value: d.result },
    { label: deploymentLabels.build, value: d.build },
  ];

  return (
    <article
      className={d.featured ? `${styles.card} ${styles.featured}` : styles.card}
      aria-labelledby={`deploy-${d.slug}`}
    >
      {!d.featured && shared("shot", <Shot label={d.shot} />)}

      <div className={styles.body}>
        {(d.featured || d.status) && (
          <p className={styles.pills}>
            {d.featured && <span className={styles.pillAccent}>{deploymentLabels.featured}</span>}
            {d.status && <span className={styles.pill}>{d.status}</span>}
          </p>
        )}
        <p className={styles.customer}>{d.customer}</p>
        {shared(
          "title",
          <h3 id={`deploy-${d.slug}`} className={styles.title}>
            {d.title}
          </h3>,
        )}
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
          <Link href={`/work/${d.slug}`} className={styles.cta}>
            {sections.work.caseStudyCta}
            <span aria-hidden="true">→</span>
            <span className="sr-only">: {d.title}</span>
          </Link>
        )}
      </div>

      {d.featured && (
        <div className={styles.featureShot}>
          {shared("shot", <Shot label={d.shot} size="feature" />)}
        </div>
      )}
    </article>
  );
}
