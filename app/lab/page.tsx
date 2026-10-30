/**
 * app/lab/page.tsx — a temporary workbench page (/lab) that renders the
 * terminal building blocks without the rest of the site, in the dark and
 * light palettes and at a phone-sized width. Hidden from search engines;
 * deleted in milestone 4 once the home page uses these components.
 */
import type { Metadata } from "next";
import { Cursor } from "@/components/Cursor";
import { KeyValue, KeyValueList } from "@/components/KeyValue";
import { Prompt } from "@/components/Prompt";
import { TerminalWindow } from "@/components/TerminalWindow";
import { lab } from "@/content/lab";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: lab.heading,
  robots: { index: false, follow: false },
};

/** The sample winfetch window used in every panel. */
function SampleWindow() {
  return (
    <TerminalWindow>
      <Prompt className={styles.command}>{lab.command}</Prompt>
      <div className={styles.rows}>
        <p className={styles.user}>{lab.user}</p>
        <KeyValueList>
          {lab.rows.map((row) => (
            <KeyValue key={row.label} label={row.label} value={row.value} />
          ))}
        </KeyValueList>
      </div>
      <Prompt className={styles.command} after={<Cursor />} />
    </TerminalWindow>
  );
}

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
          <div className={styles.sizes}>
            <SampleWindow />
            <figure className={styles.phone}>
              <SampleWindow />
              <figcaption className={styles.caption}>{lab.phoneLabel}</figcaption>
            </figure>
          </div>
        </section>
      ))}
    </div>
  );
}
