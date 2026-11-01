/**
 * app/page.tsx — the home page. Order: hero → winfetch card → impact strip
 * → Deployments → career timeline → skills & education → How I work →
 * field notes. (The contact footer comes from the layout.) Each section is
 * its own component; all text lives in content/.
 */
import { FieldNotes } from "@/components/FieldNotes";
import { Hero } from "@/components/Hero";
import { PageTransition } from "@/components/PageTransition";
import { HowBuilt } from "@/components/HowBuilt";
import { HowIWork } from "@/components/HowIWork";
import { ImpactStrip } from "@/components/ImpactStrip";
import { SkillsEducation } from "@/components/SkillsEducation";
import { Timeline } from "@/components/Timeline";
import { Winfetch } from "@/components/Winfetch";
import { Work } from "@/components/Work";
import { sections } from "@/content/home";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <PageTransition>
      <Hero />
      <section id={sections.profileCard.id} aria-label={sections.profileCard.label} className={styles.profile}>
        <Winfetch />
      </section>
      <ImpactStrip />
      <Work />
      <Timeline />
      <SkillsEducation />
      <HowIWork />
      <HowBuilt />
      <FieldNotes />
    </PageTransition>
  );
}
