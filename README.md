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
| `content/nav.ts` | Tab bar tabs, résumé button, phone menu labels |
| `content/ascii-*.txt` | The ASCII portrait (generated — see below) |

Use curly quotes (’ “ ”) and real dashes (– —). Every number should match the résumé.

The **Uptime** row on the winfetch card is counted from `codingSince` in `content/profile.ts` (`lib/uptime.ts`, tested in `lib/uptime.test.ts`). It's cached for a day at a time, so the live site updates itself roughly daily without a redeploy.

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
5. Case studies (MDX) and View Transitions
6. Command palette and light/dark theme
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
