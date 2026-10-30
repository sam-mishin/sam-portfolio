/**
 * app/page.tsx — the home page.
 *
 * Milestone 1 placeholder: it only proves that the tokens and both fonts
 * load (Cascadia Code for the mono line, Segoe UI / IBM Plex Sans for the
 * rest). Milestone 4 replaces it with the full home page.
 */
import { site } from "@/content/site";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.wrap}>
      <p className={styles.mono}>{site.name}</p>
      <h1 className={styles.title}>{site.title}</h1>
      <p className={styles.body}>{site.description}</p>
    </div>
  );
}
