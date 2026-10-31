/**
 * lib/intro.ts — decides whether the hero's typing animation plays.
 *
 * `introScript` runs inline in <head> (app/layout.tsx) before the page
 * paints. It adds `data-intro` to <html> only when:
 * - this is the home page,
 * - it's the visitor's first home-page view this browser session, and
 * - they haven't asked their system for reduced motion.
 * The CSS in TypeIn.module.css and Hero.module.css animates only under
 * that attribute, so everyone else (repeat views, reduced motion, no
 * JavaScript) sees the finished text immediately, with no flash.
 *
 * Typing starts when TypeIn adds `data-intro-run`, once the page has
 * hydrated and painted (and the boot screen, if any, is done), so a slow
 * load delays the typing instead of making it skip ahead.
 *
 * Safety net: if typing hasn't started within a few seconds (JavaScript
 * failed or is very slow), the attribute is removed and the text simply
 * appears. It can never stay hidden. TypeIn removes both attributes when
 * the intro finishes, so returning to the home page doesn't replay it.
 */

import { BOOT_MS } from "./typing";

/** sessionStorage key marking that the intro already played. */
export const INTRO_STORAGE_KEY = "intro-played";

/** How long to wait for typing to start before giving up and showing the text. */
const INTRO_START_TIMEOUT_MS = 4000;

export const introScript = `(function(){try{if(location.pathname!=="/"||matchMedia("(prefers-reduced-motion: reduce)").matches||sessionStorage.getItem("${INTRO_STORAGE_KEY}"))return;sessionStorage.setItem("${INTRO_STORAGE_KEY}","1");var d=document.documentElement;d.setAttribute("data-intro","");setTimeout(function(){if(!d.hasAttribute("data-intro-run"))d.removeAttribute("data-intro")},d.hasAttribute("data-boot")?${INTRO_START_TIMEOUT_MS + BOOT_MS}:${INTRO_START_TIMEOUT_MS})}catch(e){}})()`;

/** True while the intro is waiting or playing. Browser only. */
export function introPlaying(): boolean {
  return document.documentElement.hasAttribute("data-intro");
}

/** True once typing has started (TypeIn set data-intro-run). Browser only. */
export function introRunning(): boolean {
  return document.documentElement.hasAttribute("data-intro-run");
}

/** Start the typing: everything timed from now. Browser only. */
export function startIntro(): void {
  document.documentElement.setAttribute("data-intro-run", "");
}

/** The intro is over: drop both attributes so it never replays this session. */
export function endIntro(): void {
  document.documentElement.removeAttribute("data-intro");
  document.documentElement.removeAttribute("data-intro-run");
}
