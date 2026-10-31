/**
 * components/FieldNotes.tsx — "Field notes": short write-ups of real
 * problems from the deployments. Each card shows its status until the
 * note is written and linked. Data comes from content/field-notes.ts.
 */
import { sections } from "@/content/home";
import { fieldNotes } from "@/content/field-notes";
import { Text } from "./Placeholder";
import { Section } from "./Section";
import styles from "./FieldNotes.module.css";

/** Grid of field-note cards. */
export function FieldNotes() {
  const s = sections.fieldNotes;
  return (
    <Section id={s.id} command={s.command} heading={s.heading} intro={s.intro} source="components/FieldNotes.tsx">
      <ul className={styles.grid}>
        {fieldNotes.map((note) => (
          <li key={note.title} className={`${styles.card} reveal`} data-spotlight>
            <p className={styles.status}>{note.status}</p>
            <h3 className={styles.title}>
              {note.href ? <a href={note.href}>{note.title}</a> : note.title}
            </h3>
            <p className={styles.summary}>
              <Text value={note.summary} />
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
