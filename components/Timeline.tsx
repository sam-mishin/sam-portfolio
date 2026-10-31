/**
 * components/Timeline.tsx — the career history drawn like `git log`: a
 * short (made-up) commit hash, dates, role — organization, and one line.
 * Jobs come from content/jobs.ts, newest first.
 */
import { sections } from "@/content/home";
import { jobs } from "@/content/jobs";
import { Section } from "./Section";
import styles from "./Timeline.module.css";

/** The `git log --career` section. */
export function Timeline() {
  const s = sections.experience;
  return (
    <Section id={s.id} command={s.command} heading={s.heading}>
      <ol className={styles.list}>
        {jobs.map((job) => (
          <li key={job.hash} className={`${styles.item} reveal`}>
            <span className={`${styles.rail} ${styles[job.dot]}`} aria-hidden="true" />
            <div className={styles.entry}>
              <p className={styles.meta}>
                <span className={styles.hash}>{job.hash}</span> · <span className="num">{job.dates}</span>
              </p>
              <h3 className={styles.role}>
                {job.role} <span className={styles.org}>— {job.org}</span>
              </h3>
              <p className={styles.desc}>{job.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
