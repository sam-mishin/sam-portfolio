/**
 * components/ButtonLink.tsx — a link styled as a button (primary = filled
 * accent, secondary = outlined). Used for the hero calls to action, the
 * résumé button and the contact links. Internal paths go through
 * next/link for client-side navigation; everything else is a plain <a>.
 */
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./ButtonLink.module.css";

/** Props for {@link ButtonLink}. */
export interface ButtonLinkProps {
  /** Destination. Paths starting with "/" or "#" are internal. */
  href: string;
  /** Button text. */
  children: ReactNode;
  /** Filled accent (primary) or outlined (secondary). Defaults to primary. */
  variant?: "primary" | "secondary";
  /** "sm" is the 44px header size; "md" (default) is 48px. */
  size?: "sm" | "md";
  /** Use the monospace font (contact links). */
  mono?: boolean;
  /** Ask the browser to download the file instead of opening it. */
  download?: boolean;
  /** Optional class for layout set by the parent. */
  className?: string;
}

/** An anchor that looks like a button. */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  mono = false,
  download = false,
  className,
}: ButtonLinkProps) {
  const classes = [styles.button, styles[variant], styles[size], mono && styles.mono, className]
    .filter(Boolean)
    .join(" ");
  const internal = href.startsWith("/") || href.startsWith("#");
  if (internal && !download) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={classes} download={download || undefined}>
      {children}
    </a>
  );
}
