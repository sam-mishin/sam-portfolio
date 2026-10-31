/**
 * components/HowIWork.tsx — the "How I work" section: six numbered steps,
 * Listen → Prototype in days → Ship → Train → Measure → Improve, each with
 * one sentence and a link to a real artifact (shown as a [placeholder]
 * until the link exists). Data comes from content/how-i-work.ts.
 */
import { sections } from "@/content/home";
import { howIWork } from "@/content/how-i-work";
import { Text } from "./Placeholder";
import { Section } from "./Section";
import styles from "./HowIWork.module.css";

/** The six-step working process. */
export function HowIWork() {
  const s = sections.howIWork;
  return (
    <Section id={s.id} command={s.command} heading={s.heading} source="components/HowIWork.tsx">
      <ol className={styles.steps}>
        {howIWork.map((step, i) => (
          <li key={step.title} className={`${styles.step} reveal`} data-spotlight>
            <p className={`${styles.number} num`} aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
              {i < howIWork.length - 1 && <span className={styles.arrow}> →</span>}
            </p>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.body}>{step.body}</p>
            <p className={styles.artifact}>
              {step.artifact.href ? (
                <a href={step.artifact.href}>{step.artifact.label}</a>
              ) : (
                <Text value={step.artifact.label} />
              )}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
