"use client";

/**
 * components/TabNav.tsx — the site header, drawn as a Windows Terminal tab
 * strip: `sam@mishin: ~` (home), then one tab per home-page section, then
 * a decorative "+". On a case study (/work/<slug>) an extra tab named
 * after the project appears and is the active one.
 *
 * The active tab shares the page background and overlaps the strip's
 * bottom edge, so it looks attached to the page, like a real terminal tab.
 * On phones only the active tab shows, plus a menu button
 * (see MobileMenu) that lists the rest.
 *
 * A client component only because it reads the current URL to decide
 * which tab is active (and which way the page should slide).
 *
 * On the right: the search button that opens the command palette, the
 * light/dark toggle (moved into the phone menu on small screens) and the
 * résumé download.
 *
 * The header has its own view-transition name ("site-header"), which
 * pins it in place while page content slides underneath during a page
 * change, the way the tab strip stays put when you switch terminal tabs.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/content/nav";
import { deployments } from "@/content/projects";
import { directionFor } from "@/lib/transitions";
import { ButtonLink } from "./ButtonLink";
import { CommandPalette } from "./CommandPalette";
import { MobileMenu } from "./MobileMenu";
import { PsIcon } from "./PsIcon";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./TabNav.module.css";

/** The Windows Terminal–style tab bar used as the site's main navigation. */
export function TabNav() {
  const pathname = usePathname();
  const slug = pathname.startsWith("/work/") ? pathname.split("/")[2] : null;
  const project = slug ? deployments.find((d) => d.slug === slug) : undefined;
  // The tab for the page you're on: the home tab, or the project's tab.
  const active = project
    ? { label: project.slug, href: `/work/${project.slug}` }
    : pathname === "/"
      ? nav.home
      : null;

  return (
    // The view-transition name is set inline because CSS Modules would
    // rename it, and globals.css targets "site-header" by name.
    <header className={styles.header} style={{ viewTransitionName: "site-header" }}>
      <nav aria-label={nav.label} className={styles.nav}>
        <ul className={styles.tabs}>
          {/* On phones the home tab is the one tab shown, except on a case
              study, where the project's tab takes its place. */}
          <li className={project ? `${styles.tabItem} ${styles.secondary}` : styles.tabItem}>
            <Tab href={nav.home.href} label={nav.home.label} current={active === nav.home} from={pathname} />
          </li>
          {nav.tabs.map((tab) => (
            <li key={tab.href} className={`${styles.tabItem} ${styles.secondary}`}>
              <Tab href={tab.href} label={tab.label} current={false} from={pathname} />
            </li>
          ))}
          {project && active && (
            <li className={styles.tabItem}>
              <Tab href={active.href} label={active.label} current from={pathname} />
            </li>
          )}
          <li className={styles.newTab} aria-hidden="true">
            <svg viewBox="0 0 10 10" width="11" height="11">
              <path d="M5 0v10M0 5h10" />
            </svg>
          </li>
        </ul>
        <div className={styles.actions}>
          <CommandPalette />
          <ThemeToggle className={styles.theme} />
          <ButtonLink href={nav.resume.href} size="sm" download className={styles.resume}>
            {nav.resume.label}
          </ButtonLink>
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}

/** Props for {@link Tab}. */
interface TabProps {
  /** Where the tab goes. */
  href: string;
  /** Tab text, e.g. "work". */
  label: string;
  /** True for the page you're on: styled as the attached tab and marked aria-current. */
  current: boolean;
  /** The current path, used to pick the slide direction for the page change. */
  from: string;
}

/** One tab: PowerShell icon, label and, when active, a decorative ✕. */
function Tab({ href, label, current, from }: TabProps) {
  return (
    <Link
      href={href}
      transitionTypes={directionFor(from, href)}
      className={current ? `${styles.tab} ${styles.current}` : styles.tab}
      aria-current={current ? "page" : undefined}
    >
      <PsIcon />
      <span className={styles.label}>{label}</span>
      {current && (
        <svg className={styles.close} viewBox="0 0 10 10" width="8" height="8" aria-hidden="true">
          <path d="M1 1l8 8M9 1L1 9" />
        </svg>
      )}
    </Link>
  );
}
