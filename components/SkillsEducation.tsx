/**
 * components/SkillsEducation.tsx — two cards side by side: skills printed
 * like `cat skills.json`, and education printed like `cat education.md`.
 * Data comes from content/skills.ts.
 */
import { sections } from "@/content/home";
import { certsInProgress, education, skills } from "@/content/skills";
import { Prompt } from "./Prompt";
import { SourceRow } from "./SourceLink";
import styles from "./SkillsEducation.module.css";

/** The skills (JSON-style) and education cards. */
export function SkillsEducation() {
  const s = sections.skills;
  return (
    <section id={s.id} aria-labelledby={`${s.id}-heading`} className={styles.section}>
      <div className={`${styles.card} ${styles.skills} reveal`}>
        <SourceRow file="components/SkillsEducation.tsx">
          <Prompt>{s.command}</Prompt>
        </SourceRow>
        <h2 id={`${s.id}-heading`} className={styles.heading}>
          {s.heading}
        </h2>
        {/* Reads like a JSON object (straight quotes on purpose: it is code). */}
        <ul className={styles.json}>
          {skills.map((line) => (
            <li key={line.key}>
              <span className={styles.key}>&quot;{line.key}&quot;</span>
              <span className={styles.punct}>: [</span>
              <span className={styles.value}>{line.items.join(", ")}</span>
              <span className={styles.punct}>]</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={`${styles.card} ${styles.education} reveal`}>
        <Prompt>{s.educationCommand}</Prompt>
        <h2 className={styles.heading}>{s.educationHeading}</h2>
        <ul className={styles.schools}>
          {education.map((e) => (
            <li key={e.title}>
              <p className={styles.school}>{e.title}</p>
              <p className={styles.detail}>{e.detail}</p>
            </li>
          ))}
        </ul>
        <p className={styles.detail}>{certsInProgress}</p>
      </div>
    </section>
  );
}
