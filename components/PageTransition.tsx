/**
 * components/PageTransition.tsx — wraps a page's content so changing pages
 * animates like switching tabs in Windows Terminal: the tab bar stays put
 * while the content glides sideways and fades.
 *
 * How it works: Next.js runs every navigation as a React transition, and
 * React's <ViewTransition> turns that into a browser View Transition.
 * Links add a type ("nav-forward" or "nav-back", see lib/transitions.ts);
 * this wrapper maps each type to a CSS class, and app/globals.css animates
 * those classes. Navigations without a type (the browser's back button)
 * get a quick crossfade instead.
 *
 * Progressive enhancement: browsers without View Transitions simply switch
 * pages, and visitors who prefer reduced motion get an instant swap.
 * Each page wraps itself (not the layout): layouts stay mounted between
 * pages, so they never "enter" or "exit".
 */
import { ViewTransition, type ReactNode } from "react";
import { NAV_BACK, NAV_FORWARD } from "@/lib/transitions";

/** Props for {@link PageTransition}. */
export interface PageTransitionProps {
  /** The page content that should slide in and out. */
  children: ReactNode;
}

const classes = { [NAV_FORWARD]: NAV_FORWARD, [NAV_BACK]: NAV_BACK, default: "nav-fade" };

/** Animated wrapper for a page's content. */
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <ViewTransition enter={classes} exit={classes} default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
