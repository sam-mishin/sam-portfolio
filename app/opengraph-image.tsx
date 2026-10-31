/**
 * app/opengraph-image.tsx — the home page's share image: the terminal card
 * with Sam's name, title, the hero headline and the three impact rows
 * from the winfetch card. Built once at build time; Next.js adds the
 * og:image and twitter:image tags to every page that doesn't have its own.
 * The drawing itself is in lib/og.tsx.
 */
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { OgRow, ogColors as c, ogSize, renderOg } from "@/lib/og";

/** The impact rows of the winfetch card (content/profile.ts). */
const impact = profile.winfetch.groups.find((g) => "heading" in g && g.heading === "Impact")?.rows ?? [];
const stats = impact.map((row) => `${row.label}: ${row.value}`).join(", ");

export const alt = site.shareImageAlt.replace("{stats}", stats);
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  const [name, role] = site.title.split(" — ");
  return renderOg({
    tab: site.terminalTitle,
    command: profile.hero.command,
    children: (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
          <span style={{ fontSize: 64, fontWeight: 700, color: c.text }}>{name}</span>
          <span style={{ fontSize: 30, color: c.accent }}>{role}</span>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: c["text-body"], marginTop: 14, marginBottom: 26 }}>
          {profile.hero.headline}
        </div>
        {impact.map((row) => (
          <OgRow key={row.label} label={row.label} value={typeof row.value === "string" ? row.value : row.value.dark} />
        ))}
      </div>
    ),
  });
}
