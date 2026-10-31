/**
 * app/sitemap.ts — /sitemap.xml, the list of pages search engines should
 * index: the home page and every case study.
 *
 * No lastModified dates: the site doesn't track when each page last
 * changed, and a made-up date (like the build time on every page) is worse
 * than none, because crawlers learn to ignore it.
 */
import type { MetadataRoute } from "next";
import { caseStudySlugs } from "@/lib/case-studies";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    ...caseStudySlugs().map((slug) => ({
      url: absoluteUrl(`/work/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
