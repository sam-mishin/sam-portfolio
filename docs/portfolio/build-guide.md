# Portfolio site — build guide

How to build the Windows Terminal–style portfolio in `portfolio/design-spec.md` (canvas: https://claude.ai/artifact/CLmQvCX1FSL9gWcMc93CSm).

**Goal:** a fast, accessible Next.js site on Vercel that recruiters can skim in 30 seconds, written mostly by hand so it can sit on the résumé as a hand-written project.

**Time budget:** about 5 hours a week → 7 milestones, roughly one per week. Each milestone ends with something deployable.

---

## Stack

| Piece | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router), TypeScript | Already Sam's default; static pages are fast |
| Styling | Plain CSS with custom properties + CSS Modules | Tokens map 1:1 from the design spec; good hand-writing practice |
| Content | TypeScript data files + MDX for case studies | One place to edit text; case studies read like documents |
| Fonts | `next/font/local` for Cascadia Code, `next/font/google` for IBM Plex Sans | Self-hosted, no layout shift |
| Hosting | Vercel | Already used for 14 Acres projects |
| Tests | Vitest (palette filtering, uptime math) + Lighthouse/axe checks | Vitest is already on the résumé |

No database, no CMS, no UI library.

---

## Folder structure

```
sam-portfolio/
├─ app/
│  ├─ layout.tsx            # fonts, theme script, <TabNav/>, footer
│  ├─ page.tsx              # home
│  ├─ work/[slug]/page.tsx  # case studies
│  ├─ not-found.tsx         # "command not found" 404
│  ├─ opengraph-image.tsx   # share image of the terminal card
│  ├─ sitemap.ts, robots.ts
│  └─ globals.css           # tokens + base styles
├─ components/
│  ├─ TabNav.tsx
│  ├─ TerminalWindow.tsx    # tab bar + window controls + body
│  ├─ Prompt.tsx            # PS C:\sam> command
│  ├─ KeyValue.tsx          # Key: ...... value
│  ├─ Winfetch.tsx          # ASCII art + rows
│  ├─ ImpactStrip.tsx
│  ├─ ProjectCard.tsx
│  ├─ Timeline.tsx
│  ├─ CommandPalette.tsx
│  └─ ThemeToggle.tsx
├─ content/
│  ├─ profile.ts            # winfetch rows, contact, impact numbers
│  ├─ projects.ts           # cards + metadata
│  ├─ jobs.ts
│  ├─ ascii-dark.txt, ascii-light.txt
│  └─ case-studies/trellis.mdx …
├─ public/
│  ├─ fonts/CascadiaCode.woff2
│  ├─ resume/Sam_Mishin_Resume.pdf
│  └─ shots/…               # WebP screenshots, ≤1920px, <400KB
└─ scripts/make_ascii.py    # same script as the GitHub card
```

---

## Milestone 1 — Scaffold, tokens and fonts

1. `npx create-next-app@latest sam-portfolio` → TypeScript yes, ESLint yes, Tailwind **no**, App Router yes, `src/` no.
2. Push to a new GitHub repo, import it in Vercel, so every push deploys a preview.
3. Download Cascadia Code from Microsoft's GitHub releases (`microsoft/cascadia-code`, OFL license); copy the `.woff2` to `public/fonts/`.
4. In `app/layout.tsx`:

```tsx
import localFont from "next/font/local";
import { IBM_Plex_Sans } from "next/font/google";

const mono = localFont({ src: "../public/fonts/CascadiaCode.woff2", variable: "--font-mono-file" });
const plex = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-plex" });
```

5. Put every token from the design spec in `globals.css`:

```css
:root {
  --bg:#0c0c0c; --band:#141414; --surface:#1c1c1c; --chrome:#202020;
  --border-subtle:#2b2b2b; --border:#3a3a3a; --dots:#4a4a4a;
  --text:#f2f2f2; --text-body:#cccccc; --muted:#9d9d9d;
  --accent:#60cdff; --on-accent:#0c0c0c; --key:#f9f1a5; --value:#61d6d6;
  --ok:#16c60c; --hash:#c19c00; --ps-icon:#2671be;
  --font-sans:'Segoe UI Variable Text','Segoe UI',var(--font-plex),system-ui,sans-serif;
  --font-mono:var(--font-mono-file),Consolas,ui-monospace,monospace;
  color-scheme: dark;
}
[data-theme="light"] {
  --bg:#ffffff; --band:#f6f8fa; --surface:#f6f8fa; --chrome:#ebebeb;
  --border-subtle:#d1d9e0; --border:#d1d9e0; --dots:#c2cfde;
  --text:#1f2328; --text-body:#3d444d; --muted:#59636e;
  --accent:#005fb8; --on-accent:#ffffff; --key:#953800; --value:#0a3069;
  --ok:#1a7f37; --hash:#9a6700;
  color-scheme: light;
}
body { margin:0; background:var(--bg); color:var(--text); font-family:var(--font-sans); }
```

**Done when:** a blank page deploys with the right background and both fonts load.

## Milestone 2 — Terminal building blocks

Build these with no page around them first (a `/lab` route you delete later is handy).

**`Prompt`** — `PS C:\sam>` plus the command in `--key`:

```tsx
export function Prompt({ children }: { children: React.ReactNode }) {
  return (
    <p className={styles.prompt}>
      <span className={styles.path}>PS C:\sam&gt;</span> {children}
    </p>
  );
}
```

**`KeyValue`** — the dot leader is a flex filler, hidden from screen readers:

```tsx
<div className={styles.row}>
  <span className={styles.key}>{k}:</span>
  <span aria-hidden="true" className={styles.dots} />
  <span className={styles.value}>{v}</span>
</div>
```
```css
.row { display:flex; gap:8px; white-space:nowrap; font-family:var(--font-mono); }
.dots { flex:1; overflow:hidden; color:var(--dots); }
.dots::before { content:"................................................................................"; }
```

**`TerminalWindow`** — tab bar (PowerShell icon, title, ✕, +, ⌄), then window controls on the right, then `children`. The controls and icons are decorative, so `aria-hidden="true"`. Use 46px-wide control boxes and 10×10 line SVGs, like Windows 11.

**Blinking cursor** — respect reduced motion:

```css
.cursor { display:inline-block; width:.6em; height:1.1em; background:var(--text-body); animation:blink 1.1s steps(1) infinite; }
@keyframes blink { 50% { opacity:0; } }
@media (prefers-reduced-motion: reduce) { .cursor { animation:none; } }
```

**Done when:** a sample terminal card in `/lab` matches the canvas.

## Milestone 3 — Content files and the winfetch card

1. `content/profile.ts` holds the winfetch rows, contact links and impact numbers. Keep the text identical to the résumé.
2. **Uptime:** compute it from `2023-10-01` (freelancing start). Use the same date math as `generate.py` in the GitHub card and cover it with a Vitest test (month-end and leap-year cases). With static generation it updates on each deploy; that's fine.
3. **ASCII portrait:** run the GitHub card's script on Sam's photo:
   `python scripts/make_ascii.py photo.jpg --cols 40 --rows 26` → copy `ascii/dark.txt` and `ascii/light.txt` into `content/`. Read them at build time with `fs.readFileSync` in a server component and render inside `<pre aria-hidden="true">`.
4. **Phones:** the ASCII must not cause sideways scrolling. Use `font-size: clamp(6px, 1.9vw, 12.5px)` on the `<pre>` and stack the art above the rows under 720px.

**Done when:** the card works at 390px and 1440px, in dark and light.

## Milestone 4 — Home page

Build top to bottom in this order: `TabNav` → hero → winfetch card → `ImpactStrip` → work (`ProjectCard` grid + "more" list) → `Timeline` → skills/education → contact footer.

- **TabNav:** real `<nav>` with `<a>` tabs; the active one gets `aria-current="page"` and the page background. On phones show only the active tab plus a menu button that opens a `<dialog>` with the other links.
- **Projects grid:** `grid-template-columns: repeat(auto-fit, minmax(340px, 1fr))`.
- **Screenshots:** WebP, max 1920px on the long edge, under 400KB, `next/image` with `sizes` set. Until real shots exist, keep the dashed placeholder boxes.
- **Résumé:** link `/resume/Sam_Mishin_Resume.pdf` with the `download` attribute.

**Done when:** the full home page matches the canvas at desktop and phone widths.

## Milestone 5 — Case studies

1. Add MDX: `npm i @next/mdx @mdx-js/loader @mdx-js/react` and enable `pageExtensions` for `.mdx` in `next.config`.
2. `work/[slug]/page.tsx` loads `content/case-studies/<slug>.mdx` plus the facts (role, status, stack, how it was built) from `projects.ts`. Use `generateStaticParams` so every page is static.
3. The architecture diagram is flex boxes and arrows in HTML (no image), so it reflows on phones.
4. Write Trellis first (the canvas has its full outline), then the spend tracker and cash drawer. Personal projects can link straight to GitHub until they get a page.
5. Add prev/next links at the bottom of every case study.

**Done when:** `/work/trellis` matches the canvas and two more case studies are live.

## Milestone 6 — Command palette and theme toggle (the fun part)

### Command palette (hand-written, no library)

- Open on `/` or Ctrl+K / ⌘K, but **ignore the shortcut while focus is in an input or textarea**. Close on Esc or a backdrop click.
- Use a native `<dialog>` with `showModal()`. That gives you focus trapping and Esc for free.
- Accessibility pattern: the input has `role="combobox"`, `aria-expanded`, `aria-controls` and `aria-activedescendant`; the results are a `role="listbox"` with `role="option"` items.
- Data: one array of commands `{ label, hint, group, href | action }`. Filter with a case-insensitive `includes` on label + hint; ↑/↓ move the active index; Enter runs it.
- Commands: `cd ~/work`, `cd ~/experience`, `cd ~/contact`, `open trellis` …, `cp email` (copy to clipboard and show "copied"), `wget resume.pdf`, `theme --toggle`, `winfetch` (scroll to the card), `sudo hire sam` (opens the email link).
- Empty state: `command not found: <query> — try help`.
- Unit-test the filter and keyboard index logic with Vitest.

### Theme toggle

- Default to the visitor's system setting, let them override it, and remember the choice in `localStorage` (wrapped in try/catch).
- Prevent the flash of the wrong theme with a tiny inline script in `<head>` that sets `data-theme` before paint:

```html
<script>
try { const t = localStorage.getItem("theme") ?? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
      document.documentElement.dataset.theme = t; } catch {}
</script>
```

- Add `suppressHydrationWarning` on `<html>`.

**Done when:** the palette works with keyboard only, and theme switching has no flash on reload.

## Milestone 7 — Polish, SEO and launch

- **404 page:** `PS C:\sam> cd <path>` → "Cannot find path because it does not exist." plus links home.
- **Metadata:** title "Sam Mishin — Full-Stack Web Developer", a description, canonical URL.
- **Share image:** `app/opengraph-image.tsx` with `ImageResponse` that draws the terminal card (name, title, three impact numbers).
- **sitemap.ts / robots.ts.**
- **Analytics:** Vercel Web Analytics (cookie-free) to see whether recruiters open case studies.
- **Domain:** buy a short personal domain and add it in Vercel. Put the link on the résumé, LinkedIn and the GitHub profile README.
- **Checks before launch:**
  - Lighthouse 95+ in all four categories on mobile
  - axe DevTools: zero violations in both themes
  - Keyboard-only pass: tabs, cards, palette, theme toggle, skip link
  - 390px width: no horizontal scroll anywhere
  - Real résumé PDF and screenshots in place; no `[placeholder]` text left

---

## Hand-written vs AI-assisted

The site is a good hand-written portfolio piece, which helps balance the AI-assisted Trellis work. Suggested rule: write the components, palette logic and CSS by hand; use AI only to review code and explain errors. Note how it was built in the footer and on the résumé.

---

## GitHub profile card (companion)

The GitHub profile README card was built the same week. Its source is saved in this project under `github-profile-card/`.

- **What it is:** a neofetch-style SVG card (dark and light) on `github.com/sam-mishin`. A daily GitHub Action refreshes repo, commit, star and lines-of-code counts, and turns `photo.jpg` into the ASCII portrait.
- **Files:** `profile.json` (all card text), `generate.py` (builds `dark_mode.svg` / `light_mode.svg`), `make_ascii.py` (photo → ASCII), `.github/workflows/update.yml`, `README.md`.
- **Setup:** create a public repo named `sam-mishin` → upload the files (including `.github/`) → add `photo.jpg` → Actions → "Update profile card" → Run workflow.
- **Private repos:** to count them, add a classic personal access token with `repo` and `read:user` as the Actions secret `PROFILE_TOKEN`.
- **Match the site:** change the `THEMES` colors in `generate.py` to the Windows Terminal tokens above, and the font stack to Cascadia Code / Consolas, so the card and site look like one brand. `make_ascii.py` also produces the site's ASCII art.
