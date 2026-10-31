/**
 * lib/boot.ts — the one-time "boot screen" a visitor sees on their very
 * first visit (components/BootScreen.tsx).
 *
 * `bootScript` runs inline in <head> (app/layout.tsx), before the page
 * paints. It adds `data-boot` to <html> only when the visitor has never
 * seen the boot screen in this browser and hasn't asked for reduced
 * motion. The overlay and its animation are CSS that only applies under
 * that attribute, so everyone else never sees it.
 *
 * Safety nets, so it can never get in the way:
 * - any key or click skips it immediately,
 * - the attribute is removed after BOOT_MAX_MS no matter what,
 * - if JavaScript is off, the script never runs and there is no overlay.
 *
 * It also fills in the real time the page took to get going ("took
 * 312ms"), measured with performance.now().
 */
import { INTRO_STORAGE_KEY } from "./intro";
import { BOOT_MS } from "./typing";

export { BOOT_MS };

/** localStorage key set once the boot screen has played. */
export const BOOT_STORAGE_KEY = "booted";

/** Hard limit before the overlay is removed even if nothing else did it. */
const BOOT_MAX_MS = 2600;

/** id of the span that shows the measured load time. */
export const BOOT_MS_ID = "boot-ms";

export const bootScript = `(function(){try{if(matchMedia("(prefers-reduced-motion: reduce)").matches||localStorage.getItem("${BOOT_STORAGE_KEY}"))return;localStorage.setItem("${BOOT_STORAGE_KEY}","1");var d=document.documentElement;d.setAttribute("data-boot","");var end=function(){d.removeAttribute("data-boot")};setTimeout(end,${BOOT_MAX_MS});addEventListener("keydown",end,{once:true});addEventListener("pointerdown",end,{once:true});document.addEventListener("DOMContentLoaded",function(){var e=document.getElementById("${BOOT_MS_ID}");if(e)e.textContent=String(Math.round(performance.now()))})}catch(e){}})()`;

/** True while the boot screen is showing. Browser only. */
export function bootPlaying(): boolean {
  return document.documentElement.hasAttribute("data-boot");
}

/**
 * Forget that the boot screen and hero intro have played, then load the
 * home page fresh so both run again (the palette's `reboot` command).
 */
export function reboot(): void {
  try {
    localStorage.removeItem(BOOT_STORAGE_KEY);
    sessionStorage.removeItem(INTRO_STORAGE_KEY);
  } catch {
    // Storage blocked: the reload still happens, just without the replay.
  }
  if (location.pathname === "/") {
    // Drop any #section so the reload starts at the top.
    history.replaceState(null, "", "/");
    location.reload();
  } else {
    // A full page load on purpose (not router.push): the boot and intro
    // scripts only run when the document loads.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    location.assign("/");
  }
}
