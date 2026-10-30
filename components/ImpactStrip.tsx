/**
 * components/ImpactStrip.tsx — the band of big résumé numbers under the
 * winfetch card (orders synced, members, calls a day…). Numbers come from
 * content/profile.ts and use tabular figures so they line up.
 */
import { sections } from "@/content/home";
import { profile } from "@/content/profile";
import styles from "./ImpactStrip.module.css";

/** Full-width band of impact numbers. */
export function ImpactStrip() {
  return (
    <section aria-label={sections.impact.label} className={styles.band}>
      <ul className={styles.list}>
        {profile.impact.map((item) => (
          <li key={item.label} className={styles.item}>
            <span className={`${styles.value} num`}>{item.value}</span>
            <span className={styles.label}>{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
