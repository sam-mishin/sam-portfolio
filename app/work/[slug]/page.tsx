/**
 * app/work/[slug]/page.tsx — a case-study page, e.g. /work/trellis.
 *
 * Every case study listed in content/projects.ts with `caseStudy: true` is
 * built as a static page at build time (generateStaticParams). The page
 * shows the breadcrumb, title, summary, facts grid and hero screenshot
 * from content/case-studies.ts, a table of contents from the shared
 * section template, the prose from content/case-studies/<slug>.mdx, and
 * links to the previous and next case studies.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { Shot, Text } from "@/components/Placeholder";
import { Prompt } from "@/components/Prompt";
import { caseStudyLabels as labels, template } from "@/content/case-studies";
import { site } from "@/content/site";
import { caseStudySlugs, getCaseStudy } from "@/lib/case-studies";
import styles from "./page.module.css";

export function generateStaticParams() {
  return caseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) return {};
  return { title: `${study.card.title} — case study · ${site.name}`, description: study.summary };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  // With Cache Components, unknown slugs aren't rejected automatically,
  // so anything not in the list gets the 404 page here.
  if (!study) notFound();

  const { default: Body } = await import(`@/content/case-studies/${slug}.mdx`);

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <p className={styles.breadcrumb}>
          <Link href={labels.breadcrumbHref}>{labels.breadcrumbRoot}</Link>
          <span aria-hidden="true" className={styles.slash}>
            {" "}
            /{" "}
          </span>
          <span aria-current="page">{slug}</span>
        </p>
        {/* Same view-transition name as the card title on the home page, so
            the title appears to fly from the card into this heading. */}
        <ViewTransition name={`project-title-${slug}`} share="morph" default="none">
          <h1 className={styles.title}>{study.card.title}</h1>
        </ViewTransition>
        <p className={styles.summary}>{study.summary}</p>
        <dl className={styles.facts}>
          {study.facts.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <dt className={styles.factLabel}>{fact.label}</dt>
              <dd className={styles.factValue}>
                <Text value={fact.value} />
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <ViewTransition name={`project-shot-${slug}`} share="morph" default="none">
        <div className={styles.hero}>
          <Shot label={study.heroShot} size="feature" />
        </div>
      </ViewTransition>

      <div className={styles.body}>
        <nav aria-label={labels.tocLabel} className={styles.toc}>
          <Prompt>{labels.tocCommand}</Prompt>
          <ol className={styles.tocList}>
            {template.map((section, i) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className={styles.tocLink}>
                  <span className="num">{String(i + 1).padStart(2, "0")}</span> {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className={styles.prose}>
          <Body />
        </div>
      </div>

      <nav aria-label={labels.moreLabel} className={styles.pager}>
        <Link href={labels.allWork.href} className={styles.pagerLink}>
          <span className={styles.pagerHint}>{labels.allWork.hint}</span>
          <span className={styles.pagerTitle}>{labels.allWork.label}</span>
        </Link>
        {study.previous && (
          <Link href={`/work/${study.previous.slug}`} className={styles.pagerLink}>
            <span className={styles.pagerHint}>{labels.previous}</span>
            <span className={styles.pagerTitle}>{study.previous.title}</span>
          </Link>
        )}
        {study.next && (
          <Link href={`/work/${study.next.slug}`} className={`${styles.pagerLink} ${styles.pagerNext}`}>
            <span className={styles.pagerHint}>{labels.next}</span>
            <span className={styles.pagerTitle}>{study.next.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
