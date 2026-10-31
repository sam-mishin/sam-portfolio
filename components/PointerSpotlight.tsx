"use client";

/**
 * components/PointerSpotlight.tsx — feeds the pointer position to cards
 * marked `data-spotlight`, so the glow and rim light defined in
 * app/globals.css can follow the cursor.
 *
 * One listener on the document (event delegation) serves every card on
 * every page, and updates are batched to one per animation frame. It only
 * writes two CSS variables; the effect itself is pure CSS, and nothing
 * happens for touch input.
 */
import { useEffect } from "react";

/** Renders nothing; sets --mx/--my on the hovered spotlight card. */
export function PointerSpotlight() {
  useEffect(() => {
    let frame = 0;
    let last: PointerEvent | null = null;

    const update = () => {
      frame = 0;
      if (!last) return;
      const target = last.target instanceof Element ? last.target.closest<HTMLElement>("[data-spotlight]") : null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${last.clientX - rect.left}px`);
      target.style.setProperty("--my", `${last.clientY - rect.top}px`);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      last = event;
      if (!frame) frame = requestAnimationFrame(update);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
