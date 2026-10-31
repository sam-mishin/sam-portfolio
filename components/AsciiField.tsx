"use client";

/**
 * components/AsciiField.tsx — makes the ASCII portrait react to the mouse:
 * characters near the pointer are pushed away, light up in the accent
 * color, then spring back into place, like iron filings around a magnet.
 *
 * How it works:
 * - The portrait is still plain <pre> text from the server, so it renders
 *   instantly, stays crisp and costs nothing until someone points at it.
 * - On the first hover, the visible <pre> is redrawn onto a <canvas> laid
 *   exactly over it (same font, size, line height and color), one
 *   particle per character. The <pre> is hidden while the canvas is live.
 * - Each frame, characters within RADIUS of the pointer get a push away
 *   from it, a spring pulls every character back home, and damping lets
 *   them settle. The loop only runs while something is moving.
 * - When everything has settled and the pointer has left, the canvas is
 *   removed and the real text comes back.
 * - Mouse and trackpad only, and off for reduced motion. It's decoration:
 *   the portrait is hidden from screen readers either way.
 */
import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";

/** How far the push reaches, in CSS pixels. */
const RADIUS = 56;
/** How hard characters are pushed at the pointer's center. */
const STRENGTH = 1.8;
/** Spring pulling characters home (higher = snappier). */
const SPRING = 0.07;
/** Velocity kept each frame (lower = settles faster, less wobble). */
const DAMPING = 0.82;
/** Displacement (px) past which a character is drawn in the accent color. */
const GLOW_AT = 2;

/** One character of the portrait. */
interface Particle {
  ch: string;
  /** Home position (where the character sits in the text). */
  hx: number;
  hy: number;
  /** Offset from home, and velocity. */
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/** A live canvas copy of the portrait. */
interface Field {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  particles: Particle[];
  width: number;
  height: number;
  color: string;
  accent: string;
}

/** Props for {@link AsciiField}. */
export interface AsciiFieldProps {
  /** The <pre> versions of the portrait (one per theme; CSS shows one). */
  children: ReactNode;
  /** Layout class from the card. */
  className?: string;
  /** Inline style from the card (e.g. --cols for font sizing). */
  style?: CSSProperties;
}

/** Wraps the ASCII portrait and animates it on hover. */
export function AsciiField({ children, className, style }: AsciiFieldProps) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let field: Field | null = null;
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;

    /** Copy the visible <pre> onto a canvas laid over it. */
    function build(): Field | null {
      const pre = Array.from(box!.querySelectorAll("pre")).find((p) => getComputedStyle(p).display !== "none");
      if (!pre) return null;
      const css = getComputedStyle(pre);
      const preBox = pre.getBoundingClientRect();
      const outer = box!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      const canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      canvas.width = Math.ceil(preBox.width * dpr);
      canvas.height = Math.ceil(preBox.height * dpr);
      Object.assign(canvas.style, {
        position: "absolute",
        left: `${preBox.left - outer.left}px`,
        top: `${preBox.top - outer.top}px`,
        width: `${preBox.width}px`,
        height: `${preBox.height}px`,
        pointerEvents: "none",
      });
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.scale(dpr, dpr);
      ctx.font = `${css.fontWeight} ${css.fontSize} ${css.fontFamily}`;
      // If the browser rejected that font string, fall back to a generic
      // monospace at the same size rather than canvas's tiny default.
      if (!ctx.font.includes(css.fontSize)) ctx.font = `${css.fontSize} monospace`;
      ctx.textBaseline = "alphabetic";

      const fontSize = parseFloat(css.fontSize);
      const lineHeight = parseFloat(css.lineHeight) || fontSize * 1.25;
      const metrics = ctx.measureText("M");
      const charWidth = metrics.width;
      const ascent = metrics.fontBoundingBoxAscent ?? fontSize * 0.8;
      const descent = metrics.fontBoundingBoxDescent ?? fontSize * 0.2;
      // Where CSS puts the baseline in each line box (half the leading above).
      const baseline = (lineHeight - (ascent + descent)) / 2 + ascent;

      const particles: Particle[] = [];
      (pre.textContent ?? "").split("\n").forEach((line, row) => {
        Array.from(line).forEach((ch, col) => {
          if (ch !== " ") particles.push({ ch, hx: col * charWidth, hy: row * lineHeight + baseline, x: 0, y: 0, vx: 0, vy: 0 });
        });
      });

      box!.appendChild(canvas);
      box!.setAttribute("data-live", "");
      return {
        canvas,
        ctx,
        particles,
        width: preBox.width,
        height: preBox.height,
        color: css.color,
        accent: getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || css.color,
      };
    }

    /** Remove the canvas and show the real text again. */
    function teardown() {
      cancelAnimationFrame(frame);
      frame = 0;
      field?.canvas.remove();
      field = null;
      box!.removeAttribute("data-live");
    }

    /** One physics step and redraw. Keeps going while anything moves. */
    function tick() {
      frame = 0;
      if (!field) return;
      const { ctx, particles } = field;
      const r2 = RADIUS * RADIUS;
      let moving = false;

      for (const p of particles) {
        if (pointer) {
          const dx = p.hx + p.x - pointer.x;
          const dy = p.hy + p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2) {
            const d = Math.sqrt(d2) || 1;
            const push = (1 - d / RADIUS) * STRENGTH;
            p.vx += (dx / d) * push;
            p.vy += (dy / d) * push;
          }
        }
        p.vx = (p.vx - p.x * SPRING) * DAMPING;
        p.vy = (p.vy - p.y * SPRING) * DAMPING;
        p.x += p.vx;
        p.y += p.vy;
        if (Math.abs(p.x) + Math.abs(p.y) + Math.abs(p.vx) + Math.abs(p.vy) > 0.05) moving = true;
        else p.x = p.y = p.vx = p.vy = 0;
      }

      // Two passes so the fill color only changes twice per frame.
      ctx.clearRect(0, 0, field.width, field.height);
      ctx.fillStyle = field.color;
      for (const p of particles) {
        if (Math.abs(p.x) + Math.abs(p.y) <= GLOW_AT) ctx.fillText(p.ch, p.hx + p.x, p.hy + p.y);
      }
      ctx.fillStyle = field.accent;
      for (const p of particles) {
        if (Math.abs(p.x) + Math.abs(p.y) > GLOW_AT) ctx.fillText(p.ch, p.hx + p.x, p.hy + p.y);
      }

      if (moving || pointer) frame = requestAnimationFrame(tick);
      else teardown();
    }

    function start() {
      if (!frame) frame = requestAnimationFrame(tick);
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType === "touch" || reduceMotion.matches) return;
      if (!field) field = build();
      if (!field) return;
      const rect = field.canvas.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      start();
    }

    function onLeave() {
      pointer = null;
      if (field) start();
    }

    // The theme switch swaps which <pre> shows and its colors, and a resize
    // changes the font size: rebuild from scratch on the next hover.
    function reset() {
      pointer = null;
      teardown();
    }

    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerleave", onLeave);
    window.addEventListener("themechange", reset);
    window.addEventListener("resize", reset);
    return () => {
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("themechange", reset);
      window.removeEventListener("resize", reset);
      teardown();
    };
  }, []);

  return (
    <div ref={boxRef} className={className} style={style} aria-hidden="true">
      {children}
    </div>
  );
}
