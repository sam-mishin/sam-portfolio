# Prompt: build the portfolio site

## For Sam: how to use this

1. **Best option:** a coding agent that can create files and run commands on your computer, such as Claude Code, Cowork linked to your computer, or Cursor's agent.
2. Create an empty folder `C:\Users\mishi\Desktop\Code\sam-portfolio`, and inside it a `docs` folder.
3. Copy these files from the External project into `docs`, keeping the same folder names:
   - `portfolio/design-spec.md`
   - `portfolio/build-guide.md`
   - `portfolio/design/` (all files)
   - `career/what-to-work-on.md`
   - `resume/Sam_Mishin_Resume.md`
   - `github-profile-card/make_ascii.py`

   If the agent can read this project directly (e.g. a session attached to the External project), skip this step and tell it the files are in the project.
4. Optional: put your headshot at `docs/photo.jpg` so it can make the ASCII portrait.
5. Paste everything under the line below as your first message.

---

You're building my developer portfolio website from a finished design. I'm Sam Mishin: a full-stack web developer and the Marketing & Technology Lead at 14 Acres Vineyard & Winery, finishing a B.S. in Computer Science (WGU, Dec 2027). My target role is **Forward Deployed Engineer**, so the site needs to show that I embed with businesses, understand their real problems, integrate with their existing systems, ship, and get people using what I build.

## Read these first (in `docs/`, or in the attached project)

1. `portfolio/design-spec.md`: decisions, design tokens (colors, type, spacing), components, page structure, placeholder list. **Source of truth for the look.**
2. `portfolio/design/README.md`, then the mockups in `portfolio/design/`. Explains the mockup format; `Main.dc.html` is the main visual reference. The `<script>` block at the bottom of each mockup holds the real content. **Do not build `MainMac.dc.html`**; it was only for comparison.
3. `portfolio/build-guide.md`: stack, folder structure, milestones and code patterns. Follow it, with the overrides below.
4. `career/what-to-work-on.md`, sections "Portfolio structure for FDE" and "Portfolio polish". **These override the mockups' wording and structure** (see "FDE framing" below).
5. `resume/Sam_Mishin_Resume.md`: the source for every fact, number and date. Don't invent anything that isn't there.
6. `github-profile-card/make_ascii.py`: turns my photo into the ASCII portrait.

When you've read them, give me a short plan (milestones and what you'll build in each) and any questions. **Wait for my OK before writing code.**

## Stack (from the build guide)

- Next.js (App Router) + TypeScript, plain CSS with custom properties + CSS Modules. **No Tailwind, no UI component libraries.**
- MDX for case studies (`@next/mdx`), Vitest for tests, deployed on Vercel.
- Fonts: Cascadia Code self-hosted with `next/font/local` (download the `.woff2` from Microsoft's `microsoft/cascadia-code` GitHub releases, OFL license); IBM Plex Sans via `next/font/google` as the fallback after Segoe UI.
- **Ask me before adding any dependency** not listed here.

## What to build

- **Home page:** tab-bar navigation (Windows Terminal style); hero; the winfetch terminal-window card with the ASCII portrait and key/value rows; impact strip; "Deployments" grid; career timeline styled as `git log`; skills and education; "How I work"; contact footer.
- **Case-study pages** at `/work/[slug]`, statically generated from MDX. Write Trellis fully from the mockup and résumé. Create spend tracker and cash drawer pages using the template with clearly marked placeholders where I need to add details.
- **Command palette:** opens on `/` and Ctrl+K / ⌘K (not while typing in an input), native `<dialog>`, combobox/listbox ARIA pattern, keyboard navigation, the commands from `CommandBar.dc.html` including the `winfetch` and `sudo hire sam` easter eggs, the "command not found" empty state.
- **Light/dark theme:** defaults to the system setting, has a toggle, remembers the choice, and has no flash of the wrong theme on load (inline script in `<head>`). Both palettes are in the design spec.
- **404 page** in PowerShell style ("Cannot find path … because it does not exist"), plus metadata, an Open Graph image of the terminal card, `sitemap.ts` and `robots.ts`.
- **Responsive:** must match `Mobile.dc.html` at 390px with no horizontal scrolling anywhere (the ASCII art scales down; tabs collapse to the active tab plus a menu).

## FDE framing (overrides the mockups)

- Hero headline: "I embed with businesses and ship the software they run on." Keep the rest of the hero.
- Rename "Selected work" to **"Deployments"**. Each card shows: customer · problem · what shipped · result · how it was built (hand-written / AI-assisted) · stack.
- Add a **"How I work"** section: Listen → Prototype in days → Ship → Train → Measure → Improve. Each step gets one sentence; add a placeholder link where an artifact will go.
- Case-study template, in this order: Customer and context · Discovery (what they asked for vs. the real problem) · Constraints · What I shipped (diagram + key decisions) · Rollout and training · Results · What broke and what I changed · What's next.
- Add a "Field notes" section with placeholder entries (duplicate-Clover-customer / webhook redesign, Trellis migration, receptionist evals).

## Polish to include

- View Transitions between a project card and its case study (progressive enhancement; works without it).
- `font-variant-numeric: tabular-nums` on numbers, `text-wrap: balance` on headings, curly quotes and real dashes.
- Terminal-style focus outline using the accent color, visible on every interactive element.
- Clicking the email copies it and shows a terminal-style "✓ copied to clipboard" message.
- `prefers-reduced-motion` turns off the blinking cursor and transitions.

## Code quality and documentation

This code will be read by hiring managers, so documentation matters as much as the features.

- **Every file** starts with a short comment: what it is and how it fits in.
- **Every component** has a JSDoc comment on the component and on each prop.
- **Comment the "why"** on anything non-obvious: the theme script, the palette's keyboard and ARIA logic, the ASCII scaling, the View Transitions, the uptime date math. Don't comment obvious lines.
- **All copy and data live in `content/`** (TypeScript data files + MDX), never hard-coded in components, so I can update text without touching code. Add a comment at the top of each content file explaining how to edit it.
- **CSS:** tokens only in `app/globals.css`; components use the variables, never raw hex values.
- **Tests (Vitest):** the palette filter and keyboard index logic, and the uptime calculation (including month-end and leap-year cases).
- **`README.md`** with: what the site is, tech stack, how to run it locally on Windows, project structure, how to edit content, how to regenerate the ASCII portrait, how to add a case study, how to deploy to Vercel, and a **TODO list of every placeholder** I still need to fill.
- **`docs/ARCHITECTURE.md`**: one page on how the pieces fit (layout, theme, palette, content pipeline) with a simple diagram.
- Lint and type-check must pass with no errors.

## Rules

- **Don't invent facts.** Every number, date, title and claim comes from the résumé or the design files. Anything missing becomes a visible placeholder like `[Screenshot: cash drawer count screen]` and is listed in the README TODO.
- **Keep real job titles.** Use the email `mishinsam2@gmail.com`, LinkedIn `linkedin.com/in/samuel-mishin`, GitHub `github.com/sam-mishin`.
- **Footer credit:** this site is AI-assisted, so the footer must say something like "Designed by Sam Mishin · built with AI assistance, reviewed by me · Next.js on Vercel." Never call it hand-written. (The build guide and notes say "hand-written"; ignore that part.)
- **ASCII portrait:** if `docs/photo.jpg` exists, run `make_ascii.py` (`--cols 40 --rows 26`) and use its dark and light output. Otherwise keep the grape art from the mockup as a placeholder and add a TODO.
- **Accessibility:** real `<button>`/`<a>` elements, ASCII art and decorative glyphs `aria-hidden`, skip link, 4.5:1 contrast in both themes, 44px touch targets.
- **Work milestone by milestone** (build guide order). After each one: run lint, type-check, tests and `next build`; tell me what changed and how to preview it; make one git commit with a clear message. Don't move on until I say so.
- **Don't deploy, push, or buy anything** without asking me.

## When you're done

Give me:

1. How to run it locally.
2. A checklist of what matches the design and anything that doesn't (and why).
3. The README placeholder TODO list.
4. Lighthouse and axe results for the home page and the Trellis page on mobile.
