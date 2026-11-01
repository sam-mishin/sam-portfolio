/**
 * app/work/[slug]/page.tsx — a case-study page, e.g. /work/trellis.
 *
 * Every case study listed in content/projects.ts with `caseStudy: true` is
 * built as a static page at build time (generateStaticParams). The page
 * shows the breadcrumb, title, summary, facts grid and hero screenshot
 * from content/case-studies.ts, a table of contents from the shared
 * section template, the prose from content/case-studies/<slug>.mdx, and
 * links to the previous and next case studies. Each part is a full-width
 * band with side rails on wide screens (components/case-study/Band.tsx).
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Band } from "@/components/case-study/Band";
import { PageTransition } from "@/components/PageTransition";
import { CaseSection, type CaseSectionProps } from "@/components/case-study/CaseSection";
import { hasImage, isPlaceholder, Shot, Text } from "@/components/Placeholder";
import { Prompt } from "@/components/Prompt";
import { SourceRow } from "@/components/SourceLink";
import { caseStudyLabels as labels } from "@/content/case-studies";
import { site } from "@/content/site";
import { caseStudySlugs, getCaseStudy, visibleSections } from "@/lib/case-studies";
import { absoluteUrl } from "@/lib/site-url";
import { NAV_BACK, NAV_FORWARD } from "@/lib/transitions";
import styles from "./page.module.css";

/**
 * Every real case study is prerendered at build time, so reading `params`
 * here never makes a visitor wait. The only slugs not built ahead are
 * mistyped URLs, which go straight to the 404 page. `instant = false`
 * tells Next.js's dev-time navigation check that this is intended, instead
 * of asking for a loading fallback that would only ever flash on screen.
 */
export const instant = false;

export function generateStaticParams() {
  return caseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) return {};
  // The root layout's title template adds " · Sam Mishin".
  const title = `${study.card.title} — case study`;
  const path = `/work/${study.slug}`;
  return {
    title,
    description: study.summary,
    alternates: { canonical: path },
    openGraph: { type: "article", title, description: study.summary, url: path, siteName: site.name },
    twitter: { card: "summary_large_image", title, description: study.summary },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  // With Cache Components, unknown slugs aren't rejected automatically,
  // so anything not in the list gets the 404 page here.
  if (!study) notFound();

  const { default: Body } = await import(`@/content/case-studies/${slug}.mdx`);
  // Sections not written yet are left out of both the contents and the page.
  const sections = visibleSections(study);
  const mdxComponents = {
    CaseSection: (props: CaseSectionProps) => <CaseSection {...props} sections={sections} />,
  };
  // Facts still holding [placeholder] text aren't shown.
  const facts = study.facts.filter((fact) => !isPlaceholder(fact.value));

  return (
    <PageTransition>
      <article className={styles.page}>
        <Band as="header" noRule number={labels.headerRail.number} command={labels.headerRail.command}>
          <div className={styles.header}>
            {/* The view-source link opens this case study's .mdx on GitHub. */}
            <SourceRow file={`content/case-studies/${slug}.mdx`}>
              <p className={styles.breadcrumb}>
                <Link href={labels.breadcrumbHref} transitionTypes={[NAV_BACK]}>
                  {labels.breadcrumbRoot}
                </Link>
                <span aria-hidden="true" className={styles.slash}>
                  {" "}
                  /{" "}
                </span>
                <span aria-current="page">{slug}</span>
              </p>
            </SourceRow>
            <h1 className={styles.title}>{study.card.title}</h1>
            <p className={styles.summary}>{study.summary}</p>
            {/* Printed copies say where the live page is. */}
            <p className="print-only print-url">{absoluteUrl(`/work/${slug}`)}</p>
            <dl className={styles.facts}>
              {facts.map((fact) => (
                <div key={fact.label} className={styles.fact}>
                  <dt className={styles.factLabel}>{fact.label}</dt>
                  <dd className={styles.factValue}>
                    <Text value={fact.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          {/* No hero until there's a real image. */}
          {hasImage(study.heroShot) && (
            <div className={styles.hero}>
              <Shot shot={study.heroShot} size="feature" preload />
            </div>
          )}
        </Band>

        <Band as="div" command={labels.tocCommand} printHidden>
          <nav aria-label={labels.tocLabel} className={styles.toc}>
            {/* The right rail shows the command on wide screens. */}
            <Prompt className={styles.tocPrompt}>{labels.tocCommand}</Prompt>
            <ol className={styles.tocList}>
              {sections.map((section, i) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className={styles.tocLink}>
                    <span className="num">{String(i + 1).padStart(2, "0")}</span> {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </Band>

        <div className={styles.sections}>
          <Body components={mdxComponents} />
        </div>

        <nav aria-label={labels.moreLabel} className={styles.pager} data-no-print>
          <Link href={labels.allWork.href} className={styles.pagerLink} transitionTypes={[NAV_BACK]}>
            <span className={styles.pagerHint}>{labels.allWork.hint}</span>
            <span className={styles.pagerTitle}>{labels.allWork.label}</span>
          </Link>
          {study.previous && (
            <Link href={`/work/${study.previous.slug}`} className={styles.pagerLink} transitionTypes={[NAV_BACK]}>
              <span className={styles.pagerHint}>{labels.previous}</span>
              <span className={styles.pagerTitle}>{study.previous.title}</span>
            </Link>
          )}
          {study.next && (
            <Link
              href={`/work/${study.next.slug}`}
              className={`${styles.pagerLink} ${styles.pagerNext}`}
              transitionTypes={[NAV_FORWARD]}
            >
              <span className={styles.pagerHint}>{labels.next}</span>
              <span className={styles.pagerTitle}>{study.next.title}</span>
            </Link>
          )}
        </nav>
      </article>
    </PageTransition>
  );
}
