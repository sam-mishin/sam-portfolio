/**
 * components/Winfetch.tsx — the terminal card under the hero: `PS C:\sam>
 * winfetch`, Sam's ASCII portrait on the left and neofetch-style key/value
 * rows on the right, ending in a blinking prompt.
 *
 * A server component: the portrait is read from content/ at build time and
 * the uptime comes from a daily-cached value (lib/winfetch-data.ts). All
 * text comes from content/profile.ts.
 */
import type { CSSProperties } from "react";
import { profile } from "@/content/profile";
import { getUptime, readAsciiArt } from "@/lib/winfetch-data";
import { Cursor } from "./Cursor";
import { KeyValue, KeyValueList } from "./KeyValue";
import { Prompt } from "./Prompt";
import { TerminalWindow } from "./TerminalWindow";
import styles from "./Winfetch.module.css";

/** Props for {@link Winfetch}. */
export interface WinfetchProps {
  /** Optional class for spacing set by the parent. */
  className?: string;
}

/** The winfetch terminal card with ASCII portrait and profile rows. */
export async function Winfetch({ className }: WinfetchProps) {
  const { command, user, groups } = profile.winfetch;
  const art = readAsciiArt();
  const uptime = await getUptime();

  return (
    <TerminalWindow className={className}>
      <Prompt className={styles.command}>{command}</Prompt>

      <div className={styles.content}>
        {/* The portrait is decoration: both versions are hidden from screen
            readers, and CSS shows the one that suits the current theme.
            --cols lets the CSS shrink the font until the widest line fits. */}
        <div className={styles.art} style={{ "--cols": art.cols } as CSSProperties} aria-hidden="true">
          <pre className={`${styles.pre} ${styles.artDark}`}>{art.dark}</pre>
          <pre className={`${styles.pre} ${styles.artLight}`}>{art.light}</pre>
        </div>

        <div className={styles.info}>
          <p className={styles.rule}>
            <strong className={styles.user}>{user}</strong>
            <span className={styles.line} aria-hidden="true" />
          </p>
          {groups.map((group, i) => (
            <div key={group.heading ?? i} className={styles.group}>
              {group.heading && (
                <p className={`${styles.rule} ${styles.groupHeading}`}>
                  <span>- {group.heading}</span>
                  <span className={styles.line} aria-hidden="true" />
                </p>
              )}
              <KeyValueList label={group.heading}>
                {group.rows.map((row) => (
                  <KeyValue
                    key={row.label}
                    label={row.label}
                    value={row.value === "{uptime}" ? uptime : row.value}
                    className={"phone" in row && row.phone ? undefined : styles.desktopOnly}
                  />
                ))}
              </KeyValueList>
            </div>
          ))}
        </div>
      </div>

      <Prompt className={styles.command} after={<Cursor />} />
    </TerminalWindow>
  );
}
