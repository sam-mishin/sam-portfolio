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
lib/            small pure helpers (and their *.test.ts files)
public/fonts/   Cascadia Code .woff2 files + OFL license
docs/           design spec, mockups, résumé, build notes, photo for the ASCII portrait
```

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
2. ✅ Terminal building blocks (`Prompt`, `KeyValue`, `TerminalWindow`, `Cursor`) — preview them at <http://localhost:3000/lab> (temporary page, removed in milestone 4)
3. Content files, uptime math, ASCII portrait and the `winfetch` card
4. Home page
5. Case studies (MDX) and View Transitions
6. Command palette and light/dark theme
7. 404, metadata, Open Graph image, sitemap, final docs and audits

## Placeholder TODO

Everything Sam still needs to supply. Each item shows up on the site as visible `[bracketed]` text until it's filled in.

- _(filled in from milestone 3 onward)_
