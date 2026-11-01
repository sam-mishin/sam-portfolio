/**
 * lib/case-studies.ts — joins a case study's facts (content/case-studies.ts)
 * with its card (content/projects.ts) and works out the previous and next
 * case studies for the links at the bottom of each page.
 */
import { caseStudies, template, type CaseStudy } from "@/content/case-studies";
import { deployments, type Deployment } from "@/content/projects";

/** Everything a case-study page needs about one project. */
export interface CaseStudyPage extends CaseStudy {
  card: Deployment;
  previous?: { slug: string; title: string };
  next?: { slug: string; title: string };
}

/**
 * Case studies in the same order as their cards on the home page, so
 * "next" on a case study goes to the next card in the Deployments grid.
 */
function ordered(): CaseStudyPage[] {
  const pages = deployments
    .filter((card) => card.caseStudy)
    .map((card) => {
      const study = caseStudies.find((s) => s.slug === card.slug);
      if (!study) throw new Error(`content/case-studies.ts has no entry for "${card.slug}"`);
      return { ...study, card };
    });
  return pages.map((page, i) => ({
    ...page,
    previous: i > 0 ? { slug: pages[i - 1].slug, title: pages[i - 1].card.title } : undefined,
    next: i < pages.length - 1 ? { slug: pages[i + 1].slug, title: pages[i + 1].card.title } : undefined,
  }));
}

/** All case-study slugs, for generateStaticParams. */
/** The template sections a case study shows, in order (its hidden ones left out). */
export function visibleSections(study: Pick<CaseStudy, "hiddenSections">) {
  return template.filter((section) => !study.hiddenSections?.includes(section.id));
}

export function caseStudySlugs(): string[] {
  return ordered().map((page) => page.slug);
}

/** One case study by slug, or undefined if there isn't one. */
export function getCaseStudy(slug: string): CaseStudyPage | undefined {
  return ordered().find((page) => page.slug === slug);
}
