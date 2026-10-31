/**
 * components/ProjectCard.tsx — a card for a personal, hand-written project
 * (Chess Variant, the Telegram bot): screenshot, meta line, title, one
 * sentence, stack, and a link to the code on GitHub.
 */
import type { HandWrittenProject } from "@/content/projects";
import { Shot } from "./Placeholder";
import styles from "./ProjectCard.module.css";

/** Props for {@link ProjectCard}. */
export interface ProjectCardProps {
  /** The project to show, from content/projects.ts. */
  project: HandWrittenProject;
}

/** A hand-written personal project with a GitHub link. */
export function ProjectCard({ project: p }: ProjectCardProps) {
  return (
    <article className={`${styles.card} reveal`} data-spotlight>
      <Shot shot={p.shot} />
      <p className={styles.meta}>{p.meta}</p>
      <h3 className={styles.title}>{p.title}</h3>
      <p className={styles.body}>{p.body}</p>
      <p className={styles.stack}>{p.stack.join(" · ")}</p>
      <a href={p.href} className={styles.cta}>
        {p.cta}
        <span aria-hidden="true" className={styles.arrow}>
          →
        </span>
        <span className="sr-only">: {p.title}</span>
      </a>
    </article>
  );
}
