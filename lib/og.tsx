/**
 * lib/og.tsx — draws the share images (the picture a link preview shows
 * on LinkedIn, Slack, iMessage…), 1200×630 PNGs made at build time with
 * next/og's ImageResponse.
 *
 * Both images are a terminal window like the winfetch card on the home
 * page: the home image shows the name, title and the three impact rows;
 * a case study's image shows its title, summary, status and stack.
 *
 * ImageResponse renders with Satori, which understands a subset of CSS:
 * every element with more than one child needs display:flex, and there
 * are no CSS variables, so colors come from lib/literal-colors.ts (kept
 * in step with globals.css by a test). The font is Cascadia Code, subset
 * to Latin, punctuation and box-drawing characters (assets/og/, OFL).
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactNode } from "react";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { darkColors as c } from "./literal-colors";

/** Share image size: the 1.91:1 Open Graph standard. */
export const ogSize = { width: 1200, height: 630 };

/**
 * Cascadia Code regular and bold. "use cache" makes the file reads part of
 * the build, so the images are prerendered as static files instead of
 * being drawn again on every request.
 */
async function fontFiles() {
  "use cache";
  cacheLife("max");
  const dir = join(process.cwd(), "assets/og");
  const [regular, bold] = await Promise.all([
    readFile(join(dir, "CascadiaCode-Regular.ttf")),
    readFile(join(dir, "CascadiaCode-Bold.ttf")),
  ]);
  return { regular: new Uint8Array(regular), bold: new Uint8Array(bold) };
}

/** The fonts in the shape ImageResponse wants. */
async function fonts() {
  const { regular, bold } = await fontFiles();
  return [
    { name: "Cascadia Code", data: Buffer.from(regular), weight: 400 as const, style: "normal" as const },
    { name: "Cascadia Code", data: Buffer.from(bold), weight: 700 as const, style: "normal" as const },
  ];
}

/** Props for {@link renderOg}. */
interface OgProps {
  /** Text on the window's tab. */
  tab: string;
  /** The command after the prompt, e.g. "whoami". */
  command: string;
  /** What the command "printed". */
  children: ReactNode;
}

/** A terminal window on the page background, as a PNG response. */
export async function renderOg({ tab, command, children }: OgProps): Promise<ImageResponse> {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: c.bg,
          fontFamily: "Cascadia Code",
        }}
      >
        <div
          style={{
            width: 1080,
            height: 520,
            display: "flex",
            flexDirection: "column",
            background: c.surface,
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
          }}
        >
          {/* Tab strip: prompt icon, tab title, window controls. */}
          <div
            style={{
              height: 56,
              display: "flex",
              alignItems: "center",
              background: c.chrome,
              padding: "0 0 0 16px",
            }}
          >
            <div
              style={{
                height: 44,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "0 20px",
                marginTop: 12,
                background: c.surface,
                borderRadius: "10px 10px 0 0",
                color: c.text,
                fontSize: 20,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 16 16">
                <rect width="16" height="16" rx="3" fill={c["icon-tile"]} />
                <path
                  d="M4.5 5l3 3-3 3M8.5 11h3.5"
                  stroke={c["icon-glyph"]}
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {tab}
            </div>
            <div style={{ flex: 1 }} />
            {/* Minimize, maximize, close: drawn, since the subset font has no such glyphs. */}
            <div style={{ display: "flex", alignItems: "center", gap: 40, padding: "0 32px" }}>
              <svg width="14" height="14" viewBox="0 0 10 10">
                <path d="M0 5.5h10" stroke={c.muted} strokeWidth="1" />
              </svg>
              <svg width="14" height="14" viewBox="0 0 10 10">
                <rect x="0.5" y="0.5" width="9" height="9" stroke={c.muted} strokeWidth="1" fill="none" />
              </svg>
              <svg width="14" height="14" viewBox="0 0 10 10">
                <path d="M1 1l8 8M9 1L1 9" stroke={c.muted} strokeWidth="1" />
              </svg>
            </div>
          </div>

          {/* Body: the prompt line and its output. */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "36px 56px" }}>
            <div style={{ display: "flex", fontSize: 26, marginBottom: 24 }}>
              <span style={{ color: c["syn-tag"] }}>{site.promptPath}</span>
              <span style={{ color: c["syn-func"], marginLeft: 14 }}>{command}</span>
            </div>
            {children}
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: await fonts() },
  );
}

/** A `Label ........ value` row, like the winfetch card's. */
export function OgRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", fontSize: 26, marginTop: 10 }}>
      <span style={{ color: c.key }}>{label}</span>
      {/* Dot leaders as text: Satori can't draw dotted borders. */}
      <span style={{ flex: 1, margin: "0 14px", overflow: "hidden", whiteSpace: "nowrap", color: c.dots }}>
        {".".repeat(80)}
      </span>
      <span style={{ color: c.value }}>{value}</span>
    </div>
  );
}

/** Literal colors re-exported for the image files' own text styles. */
export { c as ogColors };
