/**
 * components/Work.tsx — the "Deployments" section: the featured deployment,
 * the grid of the rest, the hand-written projects and the one-line
 * `ls .\work --more` list. Data comes from content/projects.ts.
 */
import { sections } from "@/content/home";
import { deployments, handWritten, moreWork } from "@/content/projects";
import { DeploymentCard } from "./DeploymentCard";
import { ProjectCard } from "./ProjectCard";
import { Prompt } from "./Prompt";
import { Section } from "./Section";
import styles from "./Work.module.css";

/** Deployments, hand-written projects and the "more" list. */
export function Work() {
  const s = sections.work;
  const featured = deployments.filter((d) => d.featured);
  const rest = deployments.filter((d) => !d.featured);

  return (
    <Section id={s.id} command={s.command} heading={s.heading} intro={s.intro}>
      {featured.map((d) => (
        <DeploymentCard key={d.slug} deployment={d} />
      ))}
      <div className={styles.grid}>
        {rest.map((d) => (
          <DeploymentCard key={d.slug} deployment={d} />
        ))}
      </div>

      <div className={styles.subhead}>
        <Prompt>{s.handWrittenCommand}</Prompt>
        <h3 className={styles.subheading}>{s.handWrittenHeading}</h3>
      </div>
      <div className={styles.grid}>
        {handWritten.map((p) => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </div>

      <div className={styles.more}>
        <Prompt>{s.moreCommand}</Prompt>
        <ul className={styles.moreList}>
          {moreWork.map((m) => (
            <li key={m.name} className={styles.moreItem}>
              <span className={styles.moreName}>{m.name}</span>
              <span className={styles.moreDesc}>{m.desc}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
