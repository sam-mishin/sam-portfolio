/**
 * components/SiteFooter.tsx — the contact footer on every page:
 * `PS C:\sam> contact --sam`, "Let’s talk.", the copy-to-clipboard email
 * button, LinkedIn / GitHub / freelance links, and the credit line saying
 * how the site was made. Text comes from content/profile.ts.
 */
import { sections } from "@/content/home";
import { profile } from "@/content/profile";
import { ButtonLink } from "./ButtonLink";
import { CopyEmail } from "./CopyEmail";
import { Prompt } from "./Prompt";
import styles from "./SiteFooter.module.css";

/** Contact section and credits at the bottom of every page. */
export function SiteFooter() {
  const { contact, footer } = profile;
  return (
    <footer id={sections.contact.id} className={styles.footer} aria-labelledby="contact-heading">
      <div className={styles.inner}>
        <Prompt>{contact.command}</Prompt>
        <h2 id="contact-heading" className={styles.heading}>
          {contact.heading}
        </h2>
        <p className={styles.intro}>{contact.intro}</p>
        <CopyEmail
          email={contact.email}
          copiedMessage={contact.copied}
          actionHint={contact.copyHint}
          mailLinkLabel={contact.mailLink}
        />
        <ul className={styles.links}>
          {contact.links.map((link) => (
            <li key={link.href}>
              <ButtonLink href={link.href} variant="secondary" mono className={styles.link}>
                {link.label}
              </ButtonLink>
            </li>
          ))}
        </ul>
        <div className={styles.bottom}>
          <span>{footer.copyright}</span>
          <span>{footer.credit}</span>
        </div>
      </div>
    </footer>
  );
}
