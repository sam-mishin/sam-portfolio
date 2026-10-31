# sam-portfolio

The developer portfolio of **Sam Mishin**: full-stack web developer and Marketing & Technology Lead at 14 Acres Vineyard & Winery. The site is styled like Windows Terminal (tab-bar navigation, a `winfetch` profile card, a `/` command palette) on top of plain, scannable sections a recruiter can read in 30 seconds.

> **Live:** <https://sammishin.dev>
>
> **Status:** all seven milestones are built (see [Milestones](#milestones)). What's left is content Sam needs to supply, listed under [Placeholder TODO](#placeholder-todo), and the launch steps under [Deploying to Vercel](#deploying-to-vercel). How the pieces fit together: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Tech stack

| Piece | Choice |
|---|---|
| Framework | Next.js 16 (App Router), TypeScript, React 19 |
| Styling | Plain CSS: design tokens as custom properties in `app/globals.css`, CSS Modules per component. No Tailwind, no UI library. |
| Content | TypeScript data files in `content/`, MDX for case studies (milestone 5) |
| Fonts | Cascadia Code self-hosted with `next/font/local`; IBM Plex Sans via `next/font/google` (fallback after Segoe UI) |
| Code highlighting | Shiki, at build time, colored by the Ayu tokens (`lib/highlight.ts`) |
| Share images | `next/og` (`ImageResponse`), drawn at build time (`lib/og.tsx`) |
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
app/            routes, root layout, 404, sitemap/robots, share images, global CSS (tokens live only in globals.css)
components/     reusable UI pieces, each with its own .module.css
content/        all site text and data — edit these to change copy
lib/            small helpers (and their *.test.ts files)
proxy.ts        sends mistyped /work/<slug> URLs to a real 404 (see docs/ARCHITECTURE.md)
assets/og/      subset Cascadia Code .ttf files used only to draw the share images
public/fonts/   Cascadia Code .woff2 files + OFL license
scripts/        make_ascii.py (photo → ASCII portrait)
docs/           ARCHITECTURE.md, design spec, mockups, résumé, build notes, photo for the ASCII portrait
```

## Editing content

All text and data live in `content/`. Each file starts with a "HOW TO EDIT" comment.

| File | What it holds |
|---|---|
| `content/site.ts` | Page title and description (search results and link previews), share-image alt text, prompt text (`PS C:\sam>`), terminal tab title, view-source links |
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
| `content/not-found.ts` | The 404 page's PowerShell error and links |
| `content/plain-text.ts` | Labels for the terminal résumé (`curl`), `/resume.txt` and `/llms.txt` |
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
- **View source.** Each home section, the winfetch card, the footer and every case study has a small `</> File.tsx` link (top right of its prompt line) that opens that file on GitHub, pinned to the deployed commit on Vercel. Configure or switch them off in `site.source` in `content/site.ts`. **The repository must be public for these links to work.** Component: `components/SourceLink.tsx`; add one to a new section with `<Section source="components/MySection.tsx">`.
- **Live terminal.** The prompt at the bottom of the winfetch card is a real input: visitors type the same commands as the palette (`help`, `ls`, `whoami`, `cd ~/work`, `sudo hire sam`…) and the output prints in the card. Tab completes, ↑/↓ recall, Ctrl+C cancels, unknown commands get a PowerShell-style error, and common habits work (`cls`, `cd work`, `neofetch`; add more in `commandAliases` in `content/commands.ts`). Component: `components/TerminalPrompt.tsx`; matching and completion: `lib/shell.ts` (tested). Both surfaces run commands through `components/useCommandRunner.ts`.
- **Intro.** On the first home-page visit of a browser session, `whoami` and the headline type themselves out, the end of the headline is "selected" like text in the editor, and the intro and buttons fade in. Each character has its own CSS delay, with a slightly uneven, human rhythm. The clock starts once the page has hydrated and painted (and the boot screen is done), so a slow load delays the typing rather than making it skip ahead; if JavaScript never starts it, the text appears after 4 seconds. Afterwards the caret blinks five times and then holds still (anything that blinks on its own has to stop within five seconds). It's skipped for repeat views and for visitors who turn on reduced motion. Timings: `lib/typing.ts`; on/off logic: `lib/intro.ts`; component: `components/TypeIn.tsx`. The highlighted words are `headlineHighlight` in `content/profile.ts`.
- **Motion.** Scroll-driven (pure CSS, no scroll listeners): a reading-progress line across the top, cards and section headings that fade up as they enter, section prompts that type themselves out, and the career `git log` graph that draws itself. Pointer-driven: a soft glow and rim light that follow the cursor on cards (`components/PointerSpotlight.tsx` plus `[data-spotlight]` in `globals.css`), editor-style line highlights on the winfetch and `skills.json` rows, and arrows that nudge on hover. Everything is skipped with reduced motion, and browsers without scroll-driven animations (Firefox) simply show the content. Add `className="reveal"` or `data-spotlight` to opt a new element in.
- **Theme.** The site follows the visitor's system setting until they press the sun/moon button; then their choice is saved in `localStorage` under `theme`. A tiny inline script in `app/layout.tsx` sets `data-theme` on `<html>` before the first paint, so there's no flash of the wrong theme. Switching plays a circular reveal from the button (View Transitions; instant in browsers without them or with reduced motion). Colors for both themes are only in `app/globals.css`. Logic: `lib/theme.ts`.
- **Boot screen.** A visitor's very first visit opens with a 1.5-second PowerShell-style boot (`components/BootScreen.tsx`, lines in `content/boot.ts`) showing the real page-load time, then the hero intro plays. It's shown once per browser, skipped with any key or click, never shown with reduced motion or without JavaScript, and removed after 2.6 s no matter what. Logic: `lib/boot.ts`. Type `reboot` in the palette to see it again.

## SEO, sharing and the 404 page

- **Metadata** is set in `app/layout.tsx` (site-wide) and `app/work/[slug]/page.tsx` (per case study): title, description, canonical URL, Open Graph and Twitter/X card tags. The wording comes from `content/site.ts` and `content/case-studies.ts`.
- **Share images** (the picture LinkedIn, Slack or iMessage shows for a link) are terminal windows drawn at build time: the home one shows the name, title, headline and the three Impact rows from the winfetch card (`app/opengraph-image.tsx`); each case study gets its own with title, summary, status and stack (`app/work/[slug]/opengraph-image.tsx`; `[placeholder]` facts are left off). Drawing code: `lib/og.tsx`. Preview them at `/opengraph-image` and `/work/trellis/opengraph-image/card` while `npm run dev` is running.
- **`/sitemap.xml`** lists the home page and every case study; **`/robots.txt`** allows everything and points at the sitemap. Both use the site address from `lib/site-url.ts`.
- **Plain text for machines:** `/llms.txt` and `/resume.txt` (see below).
- **404:** any unknown address shows `app/not-found.tsx`, styled as PowerShell's `Cannot find path … because it does not exist.` error with the path the visitor typed, two links out and a live prompt (`cd ~` works). Mistyped case studies (`/work/nope`) get a true 404 status too, thanks to `proxy.ts`. Wording: `content/not-found.ts`.

## Plain-text versions: `curl`, `/resume.txt`, `/llms.txt`

- **`curl <site>`** prints a colored résumé in the terminal instead of the HTML page: the same sections as the site, as prompt lines (`whoami`, `ls .\work --deployed`, `git log --career`…), in the Ayu Dark colors. It also works with PowerShell (`irm <site>`), `wget -qO- <site>` and HTTPie. `proxy.ts` spots those tools by their User-Agent (`lib/terminal-client.ts`, tested) and serves `app/resume.ansi`; browsers and link-preview bots always get the web page. Colors use the 256-color palette so they look right in Windows Terminal, macOS Terminal and iTerm alike. Try it locally: `npm run dev`, then `curl localhost:3000`.
  - **On the live site, use `https://` or `-L`:** `curl https://sammishin.dev` or `curl -L sammishin.dev`. Plain `curl sammishin.dev` asks for `http://`, and Vercel answers every http request with a "Redirecting..." to https before the site's code runs, so there's no way to serve the résumé there. PowerShell's `irm sammishin.dev` follows the redirect on its own.
- **`/resume.txt`** is the same résumé without colors, for pasting into application forms.
- **`/llms.txt`** is a short Markdown summary with links to every case study, in the [llms.txt](https://llmstxt.org) format that AI assistants and screening tools read.

All three are built at build time from the content files (`lib/plain-resume.ts`, tested), so they can't drift from the site. Anything still marked `[like this]` is left out, and the PDF link appears only once `public/resume/Sam_Mishin_Resume.pdf` exists. Labels live in `content/plain-text.ts`.

## Printing

Case studies (and the home page) print as clean documents: black text on white, whatever theme is on screen; cards outlined instead of shaded; no tab bar, buttons, live terminal, view-source links, table of contents or placeholder screenshot boxes; headings kept with their text; code wrapped instead of cut off; and the address of every outside link printed after it. A line at the top of each printed page names the site, and case studies print their own URL under the summary. Trellis comes out at four Letter pages.

The rules are at the bottom of `app/globals.css` (the print palette and type scale) plus small `@media print` blocks in the components they affect. To keep something new off paper, give it a `data-no-print` attribute.

## Deploying to Vercel

**Live at <https://sammishin.dev>.** How it's set up:

- **Vercel:** project `sam-portfolio` in Sam's personal Vercel account (team "Sam Mishin's projects", Hobby plan), linked to `sam-mishin/sam-portfolio` on GitHub.
- **Domains:** `sammishin.dev` serves production; `www.sammishin.dev` 308-redirects to it. `sam-portfolio-lilac.vercel.app` also points at production.
- **DNS (Cloudflare, where the domain is registered):** two CNAME records, `@` and `www`, both pointing at the target Vercel shows under **Project → Settings → Domains**, with the proxy **off** ("DNS only", grey cloud). Turning the orange-cloud proxy on would put Cloudflare between visitors and Vercel and break Vercel's HTTPS certificate renewal, so leave it off.

To rebuild the setup from scratch:

1. Push the repo to GitHub.
2. In Vercel: **Add New → Project**, import the repo, keep the detected Next.js settings, add `NEXT_PUBLIC_SITE_URL` (below), **Deploy**.
3. **Settings → Domains:** add the domain, then add the `www` version as a 308 redirect to it, and copy the DNS records it shows into Cloudflare as "DNS only".
3. Every push to `main` deploys to production; every other branch gets a preview URL. (Vercel tells search engines not to index preview URLs.)

| Environment variable | Needed? | What it does |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Set (Production): `https://sammishin.dev` | The site's public address. Used for canonical links, share-image URLs, the sitemap and robots.txt. Set it in **Project → Settings → Environment Variables** (Production), then redeploy. |
| `VERCEL_PROJECT_PRODUCTION_URL` | Automatic | Set by Vercel to the project's `*.vercel.app` production domain; used until `NEXT_PUBLIC_SITE_URL` exists. |
| `VERCEL_GIT_COMMIT_SHA` | Automatic | Pins the `</> File.tsx` view-source links to the deployed commit. |

Locally, links fall back to `http://localhost:3000`.

## Accessibility

The site targets **WCAG 2.2 level AA**. What that means in practice:

- **Keyboard:** everything works without a mouse. A "Skip to content" link comes first; every link, button and input shows a 2px accent focus ring; the palette (`/` or `Ctrl+K`) and phone menu are native `<dialog>`s that trap focus, close on Esc and hand focus back.
- **Screen readers:** landmarks (`header`/`nav`, `main`, `footer`), one `h1` per page with no skipped levels, labelled inputs and dialogs, `aria-current` on the active tab, terminal decoration and ASCII art hidden, and command output announced through `role="log"` / `role="status"` regions.
- **Color and contrast:** every text pair is at least 4.5:1 in both themes (a few Ayu Light colors are darkened for this). Nothing relies on color alone, and Windows high-contrast mode keeps focus, the active tab, the selected palette row and button shapes visible.
- **Motion:** reduced motion turns off the boot screen, typing intro, scroll effects, page slides, theme reveal, cursor glow and particle portrait. Nothing blinks for more than about five seconds.
- **Zoom and reflow:** no horizontal scrolling down to 320px wide (400% zoom), and text survives the WCAG text-spacing override without being cut off.
- **Touch targets:** at least 24×24px everywhere, 44px for buttons and tabs.

### How it was checked (Milestone 7)

Against a production build, with Playwright + axe-core 4.14 and Lighthouse 12.8 (both run from a scratch folder, not project dependencies):

| Check | Result |
|---|---|
| axe (WCAG 2.0/2.1/2.2 A + AA + best practices) on `/`, all three case studies and the 404, at 390px and 1440px, dark and light | **0 violations** (also 0 with the command palette open) |
| Reflow at 320px on every page | No horizontal scroll |
| Text spacing override (1.4.12) at 320px and 1280px | No clipped text (the decorative ASCII art loses a few pixels at 320px; it's hidden from assistive tech) |
| Tab through every page at 390px and 1440px | Every stop has a visible focus ring, none hidden behind other content, none smaller than 24px |
| Headings and landmarks | One `h1` per page, no skipped levels, one `main` |
| Running animations after 9s; with reduced motion | Only scroll-linked effects (they move only when you scroll); none with reduced motion |
| Forced colors (high contrast) | Palette selection, focused terminal and buttons all visible |

| Lighthouse, mobile (simulated slow 4G, 4× CPU slowdown) | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| `/` (first visit: boot screen + typing intro) | 81–89 | 100 | 96 | 100 |
| `/work/trellis` | 89–97 | 100 | 100 | 100 |

Three runs each against a local production build; performance moves a few points between runs (the ranges above), the other scores don't. Expect slightly better numbers on Vercel's CDN.

Notes on the home page numbers:

- **Performance 81–89** is mostly the cost of the first-visit boot screen and typing intro, which keep the main thread animating for a few seconds (Total Blocking Time 330–560 ms, LCP 2.4–2.9 s on the simulated phone). Lighthouse always measures a first visit. A repeat visit without the boot screen scored 87–90, once with LCP under 1 s. Options if this matters: shorten or drop the boot screen on phones, or start the typing sooner.
- **Best practices 96** is Lighthouse's "legible font sizes" audit flagging the ASCII portrait, whose characters shrink to about 9px on a phone so the picture fits. It's decorative and hidden from screen readers; there's no real text that small.

Automated tools catch roughly a third to half of accessibility problems. Still worth doing by hand before launch: a pass with a real screen reader (NVDA on Windows, VoiceOver on iPhone) through the home page, the palette, the live terminal and one case study.

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

## Trademarks

The site is styled after Windows Terminal and PowerShell, but every visual is drawn from scratch: the `>_` tab icon (`components/PromptIcon.tsx`) is a generic terminal symbol, not Microsoft's PowerShell logo, and no Microsoft image files are used. Microsoft's [Trademark and Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks) say its logos and product icons can't be used without a license, while product *names* may be used in plain text to describe things truthfully (“the theme I use in VS Code”). Keep it that way: don't add official Microsoft logos or icons. PowerShell, Windows, Windows Terminal and VS Code are trademarks of the Microsoft group of companies; this site isn't affiliated with or endorsed by Microsoft.

## Fonts

- **Cascadia Code** (Microsoft, SIL Open Font License; license in `public/fonts/OFL.txt`). `public/fonts/CascadiaCode-Regular.woff2` and `-Bold.woff2` are the official Cascadia Code 2407.024 regular and bold, **subset** to Latin, punctuation, arrows, box drawing and geometric shapes, which brings each file down to about 40 KB. They were made with [fontTools](https://github.com/fonttools/fonttools):

  ```bash
  pyftsubset CascadiaCode-Regular.ttf --flavor=woff2 --layout-features='*' \
    --unicodes="U+0000-024F,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2190-21FF,U+2212,U+2215,U+2500-25FF,U+2713,U+FFFD" \
    --output-file=CascadiaCode-Regular.woff2
  ```

  To use the full, unsubset font instead, download the release zip from <https://github.com/microsoft/cascadia-code/releases>, copy `woff2/static/CascadiaCode-Regular.woff2` and `CascadiaCode-Bold.woff2` over these two files, and rebuild.
- **IBM Plex Sans** is fetched from Google Fonts by `next/font/google` **at build time** and served from this site. The build machine needs internet access (Vercel and a normal PC both do).
- **Share images** use `assets/og/CascadiaCode-Regular.ttf` and `-Bold.ttf` (same OFL license, copy in `assets/og/OFL.txt`): Cascadia Code subset to Latin, punctuation, arrows and box drawing as TTF, because the image renderer can't read woff2:

  ```bash
  pyftsubset CascadiaCode-Regular.ttf --layout-features='' --no-hinting \
    --unicodes="U+0020-007E,U+00A0-00FF,U+2013-2014,U+2018-201D,U+2022,U+2026,U+2190-2193,U+2248,U+2500-257F,U+2713" \
    --output-file=assets/og/CascadiaCode-Regular.ttf
  ```

## Milestones

1. ✅ Scaffold, design tokens and fonts
2. ✅ Terminal building blocks (`Prompt`, `KeyValue`, `TerminalWindow`; the original `Cursor` was replaced by the live prompt's own cursor in M7)
3. ✅ Content files, uptime math, ASCII portrait and the `winfetch` card
4. ✅ Home page: tab-bar navigation, hero, winfetch, impact strip, Deployments, timeline, skills/education, How I work, field notes, contact footer with copy-to-clipboard email
5. ✅ Case studies (MDX) and View Transitions
6. ✅ Command palette and light/dark theme
7. ✅ PowerShell-style 404 (with real 404 status), metadata, share images, sitemap and robots, WCAG 2.2 AA pass, architecture doc, Lighthouse and axe audits

## Placeholder TODO

Everything Sam still needs to supply. Each item shows up on the site as visible `[bracketed]` text until it's filled in.

Find them all with `Select-String -Path content\* -Pattern '\['` (PowerShell).

**Launch**

- [x] **Domain:** sammishin.dev is live on Vercel (see [Deploying to Vercel](#deploying-to-vercel)).
- [ ] **Share the link:** put sammishin.dev on the résumé, LinkedIn and the GitHub profile README.
- [ ] **Analytics (optional):** the build guide suggests Vercel Web Analytics (cookie-free). It needs the `@vercel/analytics` package, which hasn't been added; say the word and it's a two-line change.
- [ ] **Screen-reader pass** with NVDA and VoiceOver (see [Accessibility](#accessibility)).
- [ ] **Public repo check:** the repo is public, so everything in `docs/` (résumé, career notes, design files, photo) and its git history is visible. Move anything private out, and know that removing a file now doesn't remove it from history.

**Content**

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
