/**
 * components/BootScreen.tsx — a quick, one-time "boot" overlay on a
 * visitor's very first visit: PowerShell starting up, running
 * `.\portfolio.ps1`, a progress bar, then it fades away to reveal the
 * site (and the hero starts typing).
 *
 * It's always in the HTML but hidden unless <html> has `data-boot`, which
 * the inline script in lib/boot.ts sets before the first paint, only for
 * first-time visitors without a reduced-motion preference. All timing is
 * CSS. It's decorative, so it's hidden from screen readers, and any key or
 * click skips it. Lines come from content/boot.ts.
 */
import { boot } from "@/content/boot";
import { BOOT_MS_ID } from "@/lib/boot";
import styles from "./BootScreen.module.css";
import { ThemeText } from "./ThemeText";

/** The first-visit boot overlay. Renders nothing visible on later visits. */
export function BootScreen() {
  const [beforeMs, afterMs] = boot.loaded.split("{ms}");
  const lines = [
    <span key="banner">{boot.banner}</span>,
    <span key="loaded">
      {beforeMs}
      {/* Filled in by the boot script with the real load time, before
          React hydrates, hence suppressHydrationWarning. */}
      <span id={BOOT_MS_ID} suppressHydrationWarning>
        …
      </span>
      {afterMs}
    </span>,
    <span key="command" className={styles.command}>
      {boot.command}
    </span>,
    ...boot.checks.map((check) => (
      <span key={check.name}>
        <span className={styles.ok}>✓</span> <span className={styles.name}>{check.name.padEnd(8)}</span>
        <span className={styles.value}>
          {typeof check.value === "string" ? check.value : <ThemeText {...check.value} />}
        </span>
      </span>
    )),
  ];

  return (
    <div className={styles.boot} aria-hidden="true">
      <div className={styles.screen}>
        {lines.map((line, i) => (
          <p key={i} className={styles.line} style={{ "--n": i } as React.CSSProperties}>
            {line}
          </p>
        ))}
        <p className={styles.line} style={{ "--n": lines.length } as React.CSSProperties}>
          <span className={styles.track}>
            <span className={styles.fill} />
          </span>{" "}
          <span className={styles.done}>{boot.done}</span>
        </p>
        <p className={styles.skip}>{boot.skip}</p>
      </div>
    </div>
  );
}
