/**
 * app/lab/page.tsx — a temporary workbench page (/lab) that renders the
 * terminal building blocks and the winfetch card without the rest of the
 * site, in the dark and light palettes and in a phone-width column.
 * Hidden from search engines; deleted in milestone 4 once the home page
 * uses these components.
 */
import type { Metadata } from "next";
import { Prompt } from "@/components/Prompt";
import { Winfetch } from "@/components/Winfetch";
import { lab } from "@/content/lab";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: lab.heading,
  robots: { index: false, follow: false },
};

export default function LabPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>{lab.heading}</h1>
      <p className={styles.intro}>{lab.intro}</p>

      {lab.themes.map(({ theme, label }) => (
        <section key={theme} data-theme={theme} className={styles.panel} aria-label={label}>
          <h2 className={styles.panelHeading}>{label}</h2>
          <div className={styles.eyebrows}>
            {lab.eyebrows.map((command) => (
              <Prompt key={command}>{command}</Prompt>
            ))}
          </div>
          <Winfetch />
          <figure className={styles.phone}>
            <Winfetch />
            <figcaption className={styles.caption}>{lab.phoneLabel}</figcaption>
          </figure>
        </section>
      ))}
    </div>
  );
}
