/**
 * components/case-study/Diagram.tsx — the architecture diagram in a case
 * study: boxes joined by arrows, drawn in HTML and CSS rather than as an
 * image, so it reflows on phones (the row turns into a column and the
 * arrows turn to point down) and its text stays selectable and readable.
 *
 * The boxes are decoration for sighted readers; the figure's `label` is
 * the full description that screen readers get instead.
 */
import styles from "./Diagram.module.css";

/** One box in the diagram. */
export interface DiagramNode {
  /** Box title, e.g. "PostgreSQL". */
  title: string;
  /** Small line under the title, e.g. "tenant_id on every table · RLS". */
  note: string;
  /** Highlight this box (the center of the system). */
  accent?: boolean;
}

/** Props for {@link Diagram}. */
export interface DiagramProps {
  /** A sentence describing the whole flow; read by screen readers. */
  label: string;
  /** The boxes, left to right. */
  nodes: DiagramNode[];
  /** Arrow glyph between each pair of boxes ("→" or "⇄"); one fewer than nodes. */
  links: string[];
}

/** Boxes-and-arrows architecture diagram that reflows on small screens. */
export function Diagram({ label, nodes, links }: DiagramProps) {
  return (
    <figure className={styles.figure} role="img" aria-label={label}>
      {nodes.map((node, i) => (
        <div key={node.title} className={styles.cell} aria-hidden="true">
          <div className={node.accent ? `${styles.node} ${styles.accent}` : styles.node}>
            <strong className={styles.title}>{node.title}</strong>
            <span className={styles.note}>{node.note}</span>
          </div>
          {i < links.length && <span className={styles.link}>{links[i]}</span>}
        </div>
      ))}
    </figure>
  );
}
