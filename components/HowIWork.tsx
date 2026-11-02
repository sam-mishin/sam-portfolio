/**
 * components/HowIWork.tsx — the "How I work" section: six numbered steps,
 * Listen → Prototype in days → Ship → Train → Measure → Improve, each with
 * one sentence and a link to a real artifact (shown as a [placeholder]
 * until the link exists). Data comes from content/how-i-work.ts.
 */
import { sections } from "@/content/home";
import { howIWork } from "@/content/how-i-work";
import { NumberedCards } from "./NumberedCards";
import { Text } from "./Placeholder";
import { Section } from "./Section";

/** The six-step working process. */
export function HowIWork() {
  const s = sections.howIWork;
  return (
    <Section id={s.id} command={s.command} heading={s.heading} source="components/HowIWork.tsx">
      <NumberedCards
        sequence
        items={howIWork.map((step) => ({
          title: step.title,
          body: step.body,
          footer: step.artifact.href ? (
            <a href={step.artifact.href}>{step.artifact.label}</a>
          ) : (
            <Text value={step.artifact.label} />
          ),
        }))}
      />
    </Section>
  );
}
