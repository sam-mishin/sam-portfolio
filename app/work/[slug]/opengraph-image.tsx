/**
 * app/work/[slug]/opengraph-image.tsx — a case study's share image: a
 * terminal window running `open <slug>`, with the project's title,
 * summary, status and stack (content/case-studies.ts). One image per case
 * study, built at build time, served at /work/<slug>/opengraph-image/card. The drawing itself is in lib/og.tsx.
 *
 * Only facts that are filled in are drawn; a [placeholder] value is left
 * off rather than shown on someone's LinkedIn feed.
 */
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { getCaseStudy } from "@/lib/case-studies";
import { OgRow, ogColors as c, ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";

/** Facts worth showing on the image, in this order. */
const SHOWN = ["Status", "Stack"];

/**
 * Alt text per case study. (The slugs come from the page's
 * generateStaticParams one folder up; Next.js builds one image for each.)
 */
export async function generateImageMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const study = getCaseStudy((await params).slug);
  const title = study?.card.title ?? site.name;
  return [{ id: "card", alt: site.caseStudyImageAlt.replace("{title}", title), size: ogSize, contentType }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const study = getCaseStudy((await params).slug);
  if (!study) notFound();
  const facts = SHOWN.map((label) => study.facts.find((f) => f.label === label)).filter(
    (f): f is { label: string; value: string } => Boolean(f && !f.value.startsWith("[")),
  );

  return renderOg({
    tab: study.slug,
    command: `open ${study.slug}`,
    children: (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 22, color: c.accent }}>case study · {site.name}</div>
        <div style={{ display: "flex", fontSize: 52, fontWeight: 700, color: c.text, marginTop: 4 }}>
          {study.card.title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            lineHeight: 1.45,
            color: c["text-body"],
            marginTop: 10,
            marginBottom: 16,
            maxHeight: 106,
            overflow: "hidden",
          }}
        >
          {study.summary}
        </div>
        {facts.map((fact) => (
          <OgRow key={fact.label} label={fact.label} value={fact.value} />
        ))}
      </div>
    ),
  });
}
