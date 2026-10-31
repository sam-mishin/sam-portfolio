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
 * The attribute is removed after a few seconds no matter what. If the page
 * is slow or something breaks, the text simply appears; it can never stay
 * hidden.
 */

/** sessionStorage key marking that the intro already played. */
export const INTRO_STORAGE_KEY = "intro-played";

/** How long the attribute stays, in ms. Longer than the animation itself. */
const INTRO_MAX_MS = 4000;

export const introScript = `(function(){try{if(location.pathname!=="/"||matchMedia("(prefers-reduced-motion: reduce)").matches||sessionStorage.getItem("${INTRO_STORAGE_KEY}"))return;sessionStorage.setItem("${INTRO_STORAGE_KEY}","1");var d=document.documentElement;d.setAttribute("data-intro","");setTimeout(function(){d.removeAttribute("data-intro")},${INTRO_MAX_MS})}catch(e){}})()`;

/** True while the intro is playing. Browser only. */
export function introPlaying(): boolean {
  return document.documentElement.hasAttribute("data-intro");
}
