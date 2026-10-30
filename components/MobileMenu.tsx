"use client";

/**
 * components/MobileMenu.tsx — the ☰ button that replaces the tab strip on
 * phones and tablets, and the menu it opens.
 *
 * The menu is a native <dialog> opened with showModal(): the browser
 * traps focus inside it, closes it on Esc, makes the rest of the page
 * inert, and returns focus to the button when it closes. Clicking the
 * dimmed backdrop or a link also closes it.
 *
 * Links close the dialog first and navigate on the next frame. Closing
 * puts focus back on the menu button at the top of the page; if the jump
 * to #experience started first, that focus change would scroll it away.
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { nav } from "@/content/nav";
import styles from "./MobileMenu.module.css";

/** Menu button plus the dialog listing every tab. Hidden on wide screens. */
export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        className={styles.button}
        aria-label={nav.menu.open}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          dialogRef.current?.showModal();
          setOpen(true);
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={nav.menu.title}
        onClose={() => setOpen(false)}
        // A click whose target is the <dialog> itself landed on the
        // backdrop (the content fills the box), so treat it as "close".
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className={styles.panel}>
          <div className={styles.top}>
            <p className={styles.title}>{nav.menu.title}</p>
            <button type="button" className={styles.button} aria-label={nav.menu.close} onClick={close}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <ul className={styles.list}>
            {[nav.home, ...nav.tabs].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles.link}
                  onClick={(event) => {
                    event.preventDefault();
                    close();
                    requestAnimationFrame(() => router.push(item.href));
                  }}
                >
                  <span aria-hidden="true" className={styles.chevron}>
                    ›
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  );
}
