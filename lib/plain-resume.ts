/**
 * lib/plain-resume.ts — the site as text: a terminal résumé (with or
 * without colors) and /llms.txt.
 *
 * The résumé is built as a list of lines made of styled segments, then
 * rendered either as plain text (/resume.txt) or with ANSI color codes
 * (what `curl <site>` prints; see proxy.ts). Every fact comes from the
 * content files; values still marked [like this] are skipped so a
 * placeholder never reaches someone's terminal.
 *
 * Colors are the Ayu Dark tokens (lib/literal-colors.ts) mapped to the
 * nearest of the 256 xterm colors, which every common terminal supports
 * (macOS Terminal.app doesn't do 24-bit color).
 */
import { jobs } from "@/content/jobs";
import { plainText as text } from "@/content/plain-text";
import { profile } from "@/content/profile";
import { deployments, handWritten } from "@/content/projects";
import { sections } from "@/content/home";
import { site } from "@/content/site";
import { certsInProgress, education, skills } from "@/content/skills";
import { caseStudySlugs, getCaseStudy } from "./case-studies";
import { darkColors } from "./literal-colors";

/** The résumé PDF's path (content/profile.ts), linked only once the file exists. */
export const RESUME_PDF = profile.hero.secondaryCta.href;

/** Lines are wrapped to fit an 80-column terminal. */
export const WIDTH = 78;

/** What a piece of text is, which decides its color. */
export type Tone = "plain" | "prompt" | "command" | "name" | "accent" | "key" | "value" | "muted" | "hash" | "link" | "number";

/** A run of text in one tone. */
export interface Segment {
  text: string;
  tone?: Tone;
  bold?: boolean;
}

export type Line = Segment[];

/** True when a content value is filled in (no [placeholder] in it). */
export function isFilled(value: string | undefined): value is string {
  return Boolean(value && value.trim() && !/\[[^\]]*\]/.test(value));
}

/**
 * Word-wraps `value` to `width` columns. Lines after the first get
 * `indent` spaces. Counts characters, not bytes, so ’ and — count as one.
 */
export function wrap(value: string, width = WIDTH, indent = 0): string[] {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const limit = lines.length === 0 ? width : width - indent;
    if (line && Array.from(`${line} ${word}`).length > limit) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines.map((l, i) => (i === 0 ? l : " ".repeat(indent) + l));
}

/** A prompt line, like the eyebrow above each section on the site. */
function prompt(command: string): Line {
  return [{ text: site.promptPath, tone: "prompt" }, { text: " " }, { text: command, tone: "command" }];
}

/** Wrapped prose in one tone, indented by two spaces. */
function para(value: string, tone: Tone = "plain", indent = 2): Line[] {
  return wrap(value, WIDTH - indent, 0).map((l) => [{ text: " ".repeat(indent) + l, tone }]);
}

/** `  Label   value`, with the value wrapped under itself. */
function field(label: string, value: string, labelWidth = 12): Line[] {
  const pad = 2 + labelWidth;
  return wrap(value, WIDTH - pad, 0).map((l, i) => [
    { text: i === 0 ? `  ${label.padEnd(labelWidth)}` : " ".repeat(pad), tone: "key" },
    { text: l, tone: "plain" },
  ]);
}

const blank: Line = [];

/** The résumé as styled lines. `url` is the site's address, for links. */
export function resumeLines(url: string): Line[] {
  const fill = (s: string) => s.replaceAll("{url}", url);
  const [name, role] = site.title.split(" — ");
  const hero = profile.hero;
  const out: Line[] = [];

  // whoami
  out.push(prompt(text.command), blank);
  out.push([
    { text: `  ${name}`, tone: "name", bold: true },
    { text: role ? ` — ${role}` : "", tone: "accent" },
  ]);
  out.push(...para(hero.headline, "plain"));
  out.push(blank, ...para(hero.intro, "muted"));
  out.push(blank, [{ text: `  ${hero.availability}`, tone: "value" }]);
  out.push([{ text: `  ${hero.location}`, tone: "muted" }]);

  // Impact
  out.push(blank, prompt(text.impactCommand), blank);
  const numberWidth = Math.max(...profile.impact.map((i) => Array.from(i.value).length)) + 3;
  for (const item of profile.impact) {
    out.push([
      { text: `  ${item.value.padEnd(numberWidth)}`, tone: "number", bold: true },
      { text: item.label, tone: "plain" },
    ]);
  }

  // Deployments
  out.push(blank, prompt(sections.work.command), blank);
  for (const d of deployments) {
    const studyUrl = d.caseStudy && caseStudySlugs().includes(d.slug) ? `${url}/work/${d.slug}` : null;
    out.push([{ text: `  ${d.title}`, tone: "name", bold: true }]);
    if (isFilled(d.customer)) out.push(...para(d.customer, "muted"));
    if (isFilled(d.shipped)) out.push(...para(d.shipped, "plain"));
    if (isFilled(d.result)) out.push(...field(text.result, d.result));
    if (isFilled(d.build)) out.push(...field(text.built, d.build));
    out.push(...field(text.stack, d.stack.join(", ")));
    if (studyUrl) {
      out.push([
        { text: `  ${text.caseStudy.padEnd(12)}`, tone: "key" },
        { text: studyUrl, tone: "link" },
      ]);
    }
    out.push(blank);
  }

  // Hand-written projects
  out.push(prompt(sections.work.handWrittenCommand), blank);
  for (const p of handWritten) {
    out.push([
      { text: `  ${p.title}`, tone: "name", bold: true },
      { text: `  ${p.meta}`, tone: "muted" },
    ]);
    if (isFilled(p.body)) out.push(...para(p.body, "plain"));
    out.push([{ text: `  ${p.href}`, tone: "link" }], blank);
  }

  // Career, as git log
  out.push(prompt(sections.experience.command), blank);
  for (const job of jobs) {
    out.push([
      { text: `  ${job.hash} `, tone: "hash" },
      { text: job.role, tone: "name", bold: true },
      { text: ` — ${job.org}`, tone: "plain" },
    ]);
    out.push([{ text: `          ${job.dates}`, tone: "muted" }]);
    if (isFilled(job.desc)) out.push(...para(job.desc, "plain", 10));
  }

  // Skills and education
  out.push(blank, prompt(sections.skills.command), blank);
  for (const group of skills) out.push(...field(group.key, group.items.join(", ")));
  out.push(blank, prompt(sections.skills.educationCommand), blank);
  for (const e of education) {
    out.push([{ text: `  ${e.title}`, tone: "name", bold: true }]);
    out.push(...para(e.detail, "muted", 4));
  }
  if (isFilled(certsInProgress)) out.push(blank, ...para(certsInProgress, "muted"));

  // Contact
  out.push(blank, prompt(text.contactCommand), blank);
  const contacts = [
    { label: text.email, href: profile.contact.email },
    ...profile.contact.links.map((link) => ({ label: link.label, href: link.href })),
  ];
  const contactWidth = Math.max(...contacts.map((c) => Array.from(c.label).length)) + 2;
  for (const c of contacts) {
    out.push([
      { text: `  ${c.label.padEnd(contactWidth)}`, tone: "key" },
      { text: c.href, tone: "link" },
    ]);
  }

  out.push(blank, [{ text: `  ${fill(text.footer.site)}`, tone: "muted" }]);
  return out;
}

/** The footer lines that depend on how the résumé was asked for. */
function footer(url: string, { colors, hasPdf }: { colors: boolean; hasPdf: boolean }): Line[] {
  const fill = (s: string) => s.replaceAll("{url}", url);
  const lines: Line[] = [];
  if (colors) lines.push([{ text: `  ${fill(text.footer.plain)}`, tone: "muted" }]);
  if (hasPdf) lines.push([{ text: `  ${fill(text.footer.pdf).replace("{pdf}", RESUME_PDF)}`, tone: "muted" }]);
  lines.push([{ text: `  ${text.footer.credit}`, tone: "muted" }]);
  return lines;
}

/* ---- Rendering ---------------------------------------------------------- */

/** Ayu Dark colors for each tone. */
const toneColor: Record<Tone, string | null> = {
  plain: darkColors["text-body"],
  prompt: darkColors["syn-tag"],
  command: darkColors["syn-func"],
  name: darkColors.text,
  accent: darkColors.accent,
  key: darkColors.key,
  value: darkColors.value,
  muted: darkColors.muted,
  hash: darkColors["syn-func"],
  link: darkColors["syn-tag"],
  number: darkColors["syn-const"],
};

/** The nearest xterm-256 color index to a #rrggbb color (6×6×6 cube or grey ramp). */
export function xterm256(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const levels = [0, 95, 135, 175, 215, 255];
  const nearest = (v: number) => levels.reduce((best, l, i) => (Math.abs(l - v) < Math.abs(levels[best] - v) ? i : best), 0);
  const [cr, cg, cb] = [r, g, b].map(nearest);
  const cube = 16 + 36 * cr + 6 * cg + cb;
  const cubeDist = (levels[cr] - r) ** 2 + (levels[cg] - g) ** 2 + (levels[cb] - b) ** 2;
  const grey = Math.min(23, Math.max(0, Math.round(((r + g + b) / 3 - 8) / 10)));
  const greyValue = 8 + grey * 10;
  const greyDist = (greyValue - r) ** 2 + (greyValue - g) ** 2 + (greyValue - b) ** 2;
  return greyDist < cubeDist ? 232 + grey : cube;
}

const ESC = "\u001b[";

/** Lines → text. With `colors`, each segment gets its ANSI color (and bold). */
export function render(lines: Line[], colors: boolean): string {
  return (
    lines
      .map((line) =>
        line
          .map((seg) => {
            if (!colors || !seg.text) return seg.text;
            const hex = toneColor[seg.tone ?? "plain"];
            const codes = [seg.bold ? "1" : "", hex ? `38;5;${xterm256(hex)}` : ""].filter(Boolean).join(";");
            return codes ? `${ESC}${codes}m${seg.text}${ESC}0m` : seg.text;
          })
          .join("")
          .replace(/\s+$/, ""),
      )
      .join("\n") + "\n"
  );
}

/** The résumé as text. `hasPdf` adds the PDF link once the file exists. */
export function plainResume(url: string, { colors, hasPdf }: { colors: boolean; hasPdf: boolean }): string {
  return render([...resumeLines(url), ...footer(url, { colors, hasPdf })], colors);
}

/* ---- /llms.txt ---------------------------------------------------------- */

/** /llms.txt: a Markdown summary with links, in the llmstxt.org format. */
export function llmsTxt(url: string, { hasPdf }: { hasPdf: boolean }): string {
  const l = text.llms;
  const out: string[] = [];
  out.push(`# ${site.name}`, "", `> ${site.description}`, "", l.about, "");

  out.push(`## ${l.caseStudiesHeading}`, "");
  for (const slug of caseStudySlugs()) {
    const study = getCaseStudy(slug);
    if (study) out.push(`- [${study.card.title}](${url}/work/${slug}): ${study.summary}`);
  }

  out.push("", `## ${l.projectsHeading}`, "");
  for (const d of deployments.filter((d) => !d.caseStudy)) {
    const parts = [d.shipped, d.result].filter(isFilled).join(" ");
    if (parts) out.push(`- ${d.title} (${d.customer.replace(/\s*\(.*\)$/, "")}): ${parts}`);
  }
  for (const p of handWritten) out.push(`- [${p.title}](${p.href}): ${p.body}`);

  out.push("", `## ${l.resumeHeading}`, "");
  out.push(`- [${l.homepage}](${url}/)`);
  out.push(`- [${l.resumeText}](${url}/resume.txt)`);
  if (hasPdf) out.push(`- [${l.resumePdf}](${url}${RESUME_PDF})`);
  out.push(`- Email: ${profile.contact.email}`);
  for (const link of profile.contact.links) out.push(`- [${link.label}](${link.href})`);
  out.push("");
  return out.join("\n");
}
