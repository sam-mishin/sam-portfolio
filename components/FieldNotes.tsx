/**
 * components/FieldNotes.tsx — "Field notes": short write-ups of real
 * problems from the deployments. Data comes from content/field-notes.ts.
 * Drafts are left out, and with no finished notes the section isn't shown.
 */
import { sections } from "@/content/home";
import { fieldNotes } from "@/content/field-notes";
import { Text } from "./Placeholder";
import { Section } from "./Section";
import styles from "./FieldNotes.module.css";

/** Grid of field-note cards. */
export function FieldNotes() {
  const s = sections.fieldNotes;
  const notes = fieldNotes.filter((note) => !note.draft);
  if (notes.length === 0) return null;
  return (
    <Section id={s.id} command={s.command} heading={s.heading} intro={s.intro} source="components/FieldNotes.tsx">
      <ul className={styles.grid}>
        {notes.map((note) => (
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
