# sam-portfolio

The developer portfolio of **Sam Mishin**: full-stack web developer and Marketing & Technology Lead at 14 Acres Vineyard & Winery. The site is styled like Windows Terminal (tab-bar navigation, a `winfetch` profile card, a `/` command palette) on top of plain, scannable sections a recruiter can read in 30 seconds.

> **Status:** in progress, built milestone by milestone (see [Milestones](#milestones)). This README grows with each one.

## Tech stack

| Piece | Choice |
|---|---|
| Framework | Next.js 16 (App Router), TypeScript, React 19 |
| Styling | Plain CSS: design tokens as custom properties in `app/globals.css`, CSS Modules per component. No Tailwind, no UI library. |
| Content | TypeScript data files in `content/`, MDX for case studies (milestone 5) |
| Fonts | Cascadia Code self-hosted with `next/font/local`; IBM Plex Sans via `next/font/google` (fallback after Segoe UI) |
| Code highlighting | Shiki, at build time, colored by the Ayu tokens (`lib/highlight.ts`) |
| Tests | Vitest |
| Hosting | Vercel |

## Run it locally (Windows)

1. Install **Node.js 22 LTS or newer** from <https://nodejs.org> (the installer adds `node` and `npm` to PATH).
2. Open PowerShell in the project folder:

   ```powershell
   cd C:\Users\mishi\Desktop\Code\sam-portfolio
   npm install
   npm run dev
   ```

3. Open <http://localhost:3000>. Edits to files reload the page automatically.

Other commands:

| Command | What it does |
|---|---|
| `npm run lint` | ESLint |
| `npm run typecheck` | Generates route types, then runs `tsc --noEmit` |
| `npm test` | Runs the Vitest unit tests once (`npm run test:watch` to keep watching) |
| `npm run build` | Production build (what Vercel runs) |
| `npm run check` | All four of the above, in order |

## Project structure

```
app/            routes, root layout, global CSS (tokens live only in globals.css)
components/     reusable UI pieces, each with its own .module.css
content/        all site text and data — edit these to change copy
lib/            small helpers (and their *.test.ts files)
public/fonts/   Cascadia Code .woff2 files + OFL license
scripts/        make_ascii.py (photo → ASCII portrait)
docs/           design spec, mockups, résumé, build notes, photo for the ASCII portrait
```

## Editing content

All text and data live in `content/`. Each file starts with a "HOW TO EDIT" comment.

| File | What it holds |
|---|---|
| `content/site.ts` | Page title, description, prompt text (`PS C:\sam>`), terminal tab title |
| `content/profile.ts` | Hero, winfetch rows, impact numbers, contact links, footer |
| `content/projects.ts` | Deployment cards, hand-written projects, the `ls .\work --more` list |
| `content/jobs.ts` | Career timeline (`git log --career`) |
| `content/skills.ts` | Skills (`skills.json`) and education |
| `content/how-i-work.ts` | The six "How I work" steps and their artifact links |
| `content/field-notes.ts` | Field notes cards |
| `content/home.ts` | Section commands, headings, intro lines and card labels |
| `content/nav.ts` | Tab bar tabs, résumé button, phone menu and theme-button labels |
| `content/commands.ts` | Command palette commands, hints and messages |
| `content/case-studies.ts` | Case-study summaries, facts grids, hero screenshots and the 8-section template |
| `content/case-studies/*.mdx` | Case-study prose |
| `content/ascii-*.txt` | The ASCII portrait (generated — see below) |

Use curly quotes (’ “ ”) and real dashes (– —). Every number should match the résumé.

The **Uptime** row on the winfetch card is counted from `codingSince` in `content/profile.ts` (`lib/uptime.ts`, tested in `lib/uptime.test.ts`). It's cached for a day at a time, so the live site updates itself roughly daily without a redeploy.

## Adding a case study

Case studies live at `/work/<slug>` and are built as static pages.

1. **The card.** In `content/projects.ts`, find (or add) the deployment and set `caseStudy: true`. Its `slug` becomes the URL and its `title` the page heading.
2. **The facts.** In `content/case-studies.ts`, add an entry with the same `slug`: a one-sentence `summary`, the four `facts` (Role, Status, Stack, How it’s built) and the `heroShot` placeholder.
3. **The prose.** Copy `content/case-studies/cash-drawer.mdx` to `content/case-studies/<slug>.mdx` and fill in each section. Every case study uses the same eight sections, in this order: Customer and context · Discovery · Constraints · What I shipped · Rollout and training · Results · What broke and what I changed · What’s next. Wrap each in `<CaseSection id="…">`; the number and heading are added for you.
4. Components you can use inside the `.mdx` without importing anything: `<Diagram>`, `<Decisions>` / `<Decision>`, `<CodeExcerpt>`, `<Aside>`, `<Todo>` (see `mdx-components.tsx`). Plain markdown works for everything else.
   - **Code:** use a fenced block, which keeps indentation. It's highlighted at build time in the Ayu colors and gets a copy button. For a file-name header, wrap it in `<CodeExcerpt>` (leave blank lines around the fence):

     ````mdx
     <CodeExcerpt title="charge.ts — excerpt">

     ```ts
     const key = `charge:${memberId}:${period}`;
     ```

     </CodeExcerpt>
     ````

     Languages: ts, tsx, js, jsx, json, sql, bash, powershell, python, css, html, yaml (others show as plain text).
5. Run `npm run build`. The page, the table of contents, the previous/next links, the project tab in the header, the `open <slug>` command in the palette and the page-slide animation are all automatic.

## Colors, command palette, theme and intro

- **Colors.** The palette is [Ayu](https://github.com/ayu-theme), the theme Sam uses in VS Code: Ayu Dark Unbordered in dark mode, Ayu Light in light mode. "Unbordered" means cards and windows are told apart by background shade, not outlines. Syntax colors are used the way the editor uses them: numbers purple, labels orange, prompt paths cyan, commands yellow-orange. All of it lives in `app/globals.css`; a few Ayu Light colors are darkened there so text stays above 4.5:1.

- **Palette.** Press `/` or `Ctrl+K` (`⌘K` on a Mac), or click **Search**. Commands come from `content/commands.ts`: a `link` goes to a page or `#section`, `external` opens a new tab, and the rest (`copy-email`, `download`, `toggle-theme`, `winfetch`, `hire`, `help`) are handled in `components/CommandPalette.tsx`. The **Shell** group prints into an output pane like a real terminal: `ls`, `pwd`, `whoami`, `cat resume.txt`, `git log --oneline`, `uptime`, `date`, `history`, `clear`, `reboot` (replays the boot screen), `rm -rf /` and `exit`. Their output is built from the other content files, so it never drifts. Best matches sort first (an exact name beats a word in a hint). Every case study gets an `open <slug>` command automatically. The filtering and arrow-key logic is in `lib/palette.ts`, tested in `lib/palette.test.ts`.
- **Intro.** On the first home-page visit of a browser session, `whoami` and the headline type themselves out, the end of the headline is "selected" like text in the editor, and the intro and buttons fade in. Each character has its own CSS delay, with a slightly uneven, human rhythm. The clock starts once the page has hydrated and painted (and the boot screen is done), so a slow load delays the typing rather than making it skip ahead; if JavaScript never starts it, the text appears after 4 seconds. It's skipped for repeat views and for visitors who turn on reduced motion. Timings: `lib/typing.ts`; on/off logic: `lib/intro.ts`; component: `components/TypeIn.tsx`. The highlighted words are `headlineHighlight` in `content/profile.ts`.
- **Motion.** Scroll-driven (pure CSS, no scroll listeners): a reading-progress line across the top, cards and section headings that fade up as they enter, section prompts that type themselves out, and the career `git log` graph that draws itself. Pointer-driven: a soft glow and rim light that follow the cursor on cards (`components/PointerSpotlight.tsx` plus `[data-spotlight]` in `globals.css`), editor-style line highlights on the winfetch and `skills.json` rows, arrows that nudge on hover, and a ✕ on hovered tabs. Everything is skipped with reduced motion, and browsers without scroll-driven animations (Firefox) simply show the content. Add `className="reveal"` or `data-spotlight` to opt a new element in.
- **Theme.** The site follows the visitor's system setting until they press the sun/moon button; then their choice is saved in `localStorage` under `theme`. A tiny inline script in `app/layout.tsx` sets `data-theme` on `<html>` before the first paint, so there's no flash of the wrong theme. Switching plays a circular reveal from the button (View Transitions; instant in browsers without them or with reduced motion). Colors for both themes are only in `app/globals.css`. Logic: `lib/theme.ts`.
- **Boot screen.** A visitor's very first visit opens with a 1.5-second PowerShell-style boot (`components/BootScreen.tsx`, lines in `content/boot.ts`) showing the real page-load time, then the hero intro plays. It's shown once per browser, skipped with any key or click, never shown with reduced motion or without JavaScript, and removed after 2.6 s no matter what. Logic: `lib/boot.ts`. Type `reboot` in the palette to see it again.

## Regenerating the ASCII portrait

`content/ascii-dark.txt` and `content/ascii-light.txt` are made from `docs/photo.jpg`:

```powershell
pip install pillow
python scripts\make_ascii.py docs\photo.jpg --flat-bg --crop 0.22,0.07,0.79,0.88 --cols 56 --rows 40 --out content
```

- `--flat-bg` removes a plain light studio backdrop. For a photo with a busy background, `pip install rembg` and drop `--flat-bg`; rembg cuts the person out (it downloads a model the first time).
- `--crop` is left, top, right, bottom as fractions of the photo. Crop to head and collar so the face gets most of the characters; adjust it for a new photo.
- 56 columns is enough to show glasses and a smile; 40 mostly shows a head shape.
- The characters come from a ramp measured against Cascadia Code's actual ink coverage (see the comment at the top of the script).

The card sizes the font to fit whatever width the art comes out at, so no code changes are needed.

## Fonts

- **Cascadia Code** (Microsoft, SIL Open Font License; license in `public/fonts/OFL.txt`). `public/fonts/CascadiaCode-Regular.woff2` and `-Bold.woff2` are the official Cascadia Code 2407.024 regular and bold, **subset** to Latin, punctuation, arrows, box drawing and geometric shapes, which brings each file down to about 40 KB. They were made with [fontTools](https://github.com/fonttools/fonttools):

  ```bash
  pyftsubset CascadiaCode-Regular.ttf --flavor=woff2 --layout-features='*' \
    --unicodes="U+0000-024F,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2190-21FF,U+2212,U+2215,U+2500-25FF,U+2713,U+FFFD" \
    --output-file=CascadiaCode-Regular.woff2
  ```

  To use the full, unsubset font instead, download the release zip from <https://github.com/microsoft/cascadia-code/releases>, copy `woff2/static/CascadiaCode-Regular.woff2` and `CascadiaCode-Bold.woff2` over these two files, and rebuild.
- **IBM Plex Sans** is fetched from Google Fonts by `next/font/google` **at build time** and served from this site. The build machine needs internet access (Vercel and a normal PC both do).

## Milestones

1. ✅ Scaffold, design tokens and fonts
2. ✅ Terminal building blocks (`Prompt`, `KeyValue`, `TerminalWindow`, `Cursor`)
3. ✅ Content files, uptime math, ASCII portrait and the `winfetch` card
4. ✅ Home page: tab-bar navigation, hero, winfetch, impact strip, Deployments, timeline, skills/education, How I work, field notes, contact footer with copy-to-clipboard email
5. ✅ Case studies (MDX) and View Transitions
6. ✅ Command palette and light/dark theme
7. 404, metadata, Open Graph image, sitemap, final docs and audits

## Placeholder TODO

Everything Sam still needs to supply. Each item shows up on the site as visible `[bracketed]` text until it's filled in.

Find them all with `Select-String -Path content\* -Pattern '\['` (PowerShell).

- [ ] **Résumé PDF** — save it as `public/resume/Sam_Mishin_Resume.pdf` (the hero and palette link there). Note: the résumé still lists mishinsam2@gmail.com; the site uses sammishin2@gmail.com.
- [ ] **Screenshots** (WebP, ≤1920px long edge, <400 KB, in `public/shots/`), then swap the `shot` text in `content/projects.ts` for the image:
  - [ ] Trellis member billing dashboard
  - [ ] Spend tracker dashboard
  - [ ] Cash drawer count screen
  - [ ] AI receptionist call flow
  - [ ] New Adventure Homes booking site
  - [ ] Royal Service Cleaning inquiry automation
  - [ ] Chess Variant GIF (a square sliding mid-game)
  - [ ] Crypto Telegram bot alert message
- [ ] **New Adventure Homes card** (`content/projects.ts`): the problem they needed solved; hand-written or AI-assisted
- [ ] **Royal Service Cleaning card**: a result (inquiries delivered, response time…)
- [ ] **How I work artifacts** (`content/how-i-work.ts`): links for discovery note, prototype, rollout plan, training notes, results write-up, field note
- [ ] **Field notes** (`content/field-notes.ts`): summaries and links for the duplicate-customer/webhook note, the Trellis migration, receptionist evals
- [ ] **Trellis case study** (`content/case-studies/trellis.mdx`):
  - [ ] Hero screenshot: Trellis admin, member list with next charge dates
  - [ ] Who on staff runs club billing day to day, and how often charges run
  - [ ] What happened with the old vendor, and what staff did by hand in the meantime
  - [ ] Budget, and how comfortable admin users are with new software
  - [ ] A real code excerpt (e.g. the idempotency-key charge call) for `charge.ts — excerpt`
  - [ ] After go-live: migration/cutover/rollback plan and staff training; results (charges run, failures caught, time saved)
  - [ ] Something that broke during the build and what you changed
- [ ] **Spend tracker case study** (`content/case-studies/spend-tracker.mdx` + `content/case-studies.ts`):
  - [ ] Your role (facts grid); hero screenshot of the dashboard
  - [ ] How the owner and GM use it; the real problem behind the request
  - [ ] Budget, timeline, Clover data quirks; 2–3 key decisions
  - [ ] How it went live; what changed for the owner/GM (before/after)
  - [ ] How the duplicates were found and how the webhook redesign changes the sync
- [ ] **Cash drawer case study** (`content/case-studies/cash-drawer.mdx` + `content/case-studies.ts`):
  - [ ] Your role (facts grid); screenshot of the count screen
  - [ ] When counts happen and who checks them; asked-for vs. real problem
  - [ ] Devices, timeline, what the prototype got wrong; 2–3 key decisions
  - [ ] How the switch from paper went; in-app vs. paper counts and before/after accuracy
  - [ ] Something that broke or confused staff and what you changed
