/**
 * components/Placeholder.tsx — helpers for content Sam still has to supply,
 * and the screenshot slots that hold real images once they exist.
 *
 * Any string in content/ that starts with "[" (e.g. "[Add: a result]") is a
 * placeholder. `Text` shows it in a dashed, muted style so it's obvious on
 * the page and impossible to mistake for a real claim. `Shot` is a
 * screenshot slot: a dashed box with a description until there's an image,
 * then the image itself.
 */
import Image from "next/image";
import styles from "./Placeholder.module.css";

/** True when a content string is a [bracketed] placeholder. */
export function isPlaceholder(value: string): boolean {
  return value.trim().startsWith("[");
}

/** Props for {@link Text}. */
export interface TextProps {
  /** The content string; rendered as-is, styled as a placeholder if bracketed. */
  value: string;
}

/** Renders a content string, flagging [placeholders] visually. */
export function Text({ value }: TextProps) {
  return isPlaceholder(value) ? <span className={styles.text}>{value}</span> : <>{value}</>;
}

/**
 * A real image for a screenshot slot. `src` is a path under public/, e.g.
 * "/shots/trellis-logo.webp"; width and height are the file's pixel size
 * (they set the aspect ratio, so the page doesn't jump while it loads).
 */
export interface ShotImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** What a content file puts in a screenshot slot: placeholder text, or an image. */
export type ShotValue = string | ShotImage;

/** Props for {@link Shot}. */
export interface ShotProps {
  /** "[Screenshot: …]" placeholder text, or the image once there is one. */
  shot: ShotValue;
  /**
   * "card" (a fixed-height strip, image cropped to fill it) or "feature"
   * (fills its column; an image keeps its own proportions). Defaults to card.
   */
  size?: "card" | "feature";
  /** Load the image straight away: set for the largest image at the top of a page. */
  preload?: boolean;
}

/** A screenshot slot: dashed placeholder box, or the real image. */
export function Shot({ shot, size = "card", preload = false }: ShotProps) {
  if (typeof shot === "string") {
    // An empty box is just wasted paper, so placeholders are left out of print.
    return (
      <div className={`${styles.shot} ${styles[size]}`} data-no-print>
        {shot}
      </div>
    );
  }
  const sizes = size === "feature" ? "(max-width: 720px) 100vw, 1136px" : "(max-width: 720px) 100vw, 400px";
  return (
    <figure className={`${styles.image} ${size === "card" ? styles.imageCard : styles.imageFeature}`}>
      {size === "card" ? (
        <Image src={shot.src} alt={shot.alt} fill sizes={sizes} preload={preload} className={styles.cover} />
      ) : (
        <Image
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          sizes={sizes}
          preload={preload}
          className={styles.natural}
        />
      )}
    </figure>
  );
}
