/**
 * lib/transitions.ts — names for the page-change animations.
 *
 * Links tag a navigation as "forward" (deeper: home → case study, or on to
 * the next case study) or "back" (up to the home page, or to the previous
 * case study). components/PageTransition.tsx turns those tags into the
 * matching slide; the CSS lives at the bottom of app/globals.css.
 */

/** Going deeper: content slides in from the right. */
export const NAV_FORWARD = "nav-forward";
/** Going back up: content slides in from the left. */
export const NAV_BACK = "nav-back";

/**
 * Picks the direction for a link based on where you are and where it goes:
 * leaving a case study for the home page is "back", entering one from the
 * home page is "forward". Same-page links (#anchors) get no animation.
 */
export function directionFor(currentPath: string, href: string): string[] | undefined {
  const target = href.split("#")[0] || "/";
  if (target === currentPath) return undefined;
  const depth = (path: string) => path.split("/").filter(Boolean).length;
  return [depth(target) > depth(currentPath) ? NAV_FORWARD : NAV_BACK];
}
