# Portfolio site — design spec

**Design canvas:** https://claude.ai/artifact/CLmQvCX1FSL9gWcMc93CSm (private; share it from its Share menu if someone else needs to see it)

**Status:** designed Oct 2026, not built yet. Build steps are in `portfolio/build-guide.md`.

## Decisions

- **Look:** Windows 11 **Windows Terminal**, not the Mac terminal. It's what Sam actually uses (Windows + VS Code) and it stands out from the many Mac-styled developer portfolios. A Mac version of the home page top sits on the canvas for comparison only.
- **Terminal style on top, normal page underneath.** The terminal card sets the tone; the projects, experience and contact sections are plain, scannable sections a recruiter can read in 30 seconds. Nothing is hidden behind typed commands.
- **Impact numbers, not GitHub stats.** Most of the real work is in private repos, so live repo/star counts would undersell it. The site leads with résumé numbers instead.
- **Honest build labels.** Every project says "hand-written" or "AI-assisted (reviewed and tested by me)".
- **Audience:** employers. Separate from mishinwebsites.com, which is for freelance clients.

## Screens on the canvas

| Artboard | What it shows |
|---|---|
| Home — desktop (Windows Terminal) | The full home page |
| Home — Mac Terminal version | Top of the home page in a Mac style, for comparison |
| Case study — Trellis | Template for every project page |
| Home — phone | 390px wide layout |
| Command bar | `/` or Ctrl+K palette, working filter (press Play) |
| Style guide + light mode | Colors, type, components, light theme sample |

## Design tokens

### Colors

| Token | Dark | Light | Used for |
|---|---|---|---|
| `--bg` | `#0c0c0c` | `#ffffff` | Page and terminal background |
| `--band` | `#141414` | `#f6f8fa` | Impact strip, footer |
| `--surface` | `#1c1c1c` | `#f6f8fa` | Cards |
| `--chrome` | `#202020` | `#ebebeb` | Tab bar / title bar |
| `--border-subtle` | `#2b2b2b` | `#d1d9e0` | Dividers |
| `--border` | `#3a3a3a` | `#d1d9e0` | Card borders, outline buttons |
| `--dots` | `#4a4a4a` | `#c2cfde` | Dot leaders (decorative) |
| `--text` | `#f2f2f2` | `#1f2328` | Headings |
| `--text-body` | `#cccccc` | `#3d444d` | Body copy, prompt path |
| `--muted` | `#9d9d9d` | `#59636e` | Labels, captions |
| `--accent` | `#60cdff` | `#005fb8` | Primary buttons, links (Windows 11 accent) |
| `--key` | `#f9f1a5` | `#953800` | Keys and typed commands |
| `--value` | `#61d6d6` | `#0a3069` | Values, tech tags |
| `--ok` | `#16c60c` | `#1a7f37` | "Open to roles" dot, current-job dot |
| `--hash` | `#c19c00` | `#9a6700` | Commit hashes in the timeline |
| `--ps-icon` | `#2671be` | `#2671be` | PowerShell tab icon |

Primary buttons use `--bg` text on `--accent` in dark mode and white text on `--accent` in light mode. All text pairs pass 4.5:1.

### Type

- **Body and headings:** `'Segoe UI Variable Text', 'Segoe UI', 'IBM Plex Sans', system-ui, sans-serif`. Windows visitors get Segoe; everyone else gets IBM Plex Sans.
- **Terminal text, labels, tags, code:** `'Cascadia Code', Consolas, 'JetBrains Mono', ui-monospace, monospace`.
- Scale: H1 56/1.08 bold (36 on phones) · H2 36 bold · H3 21–30 semibold · body 17/1.6 · small 14–15 · mono labels 12–14.

### Shape and spacing

- Window and card radius 8–14px; buttons 8px; tags 6px or pill.
- Content max width 1200px, 32px side padding (16px on phones).
- Touch targets at least 44px tall.

## Signature components

- **Tab bar navigation:** the site header is a Windows Terminal tab strip. Tabs: `sam@mishin: ~` (home), work, experience, skills, contact, then a "+". The active tab shares the page background so it looks attached.
- **Terminal window card:** tab bar + minimize/maximize/close glyphs, then `PS C:\sam> winfetch`, the ASCII portrait on the left, key/value rows with dot leaders on the right, and a final prompt with a blinking block cursor.
- **Prompt line:** `PS C:\sam>` in `--text-body`, the command in `--key` (PowerShell colors typed commands yellow). Used as the eyebrow above every section: `whoami`, `ls .\work`, `git log --career`, `cat skills.json`, `contact --sam`.
- **Key/value row:** `Key: ........ value` — key in `--key`, dots in `--dots` (aria-hidden), value in `--value`.
- **Project card:** screenshot slot, meta line (where · how it was built), title, one-sentence result, stack line, link.
- **Career timeline:** styled as `git log`: fake short hash, dates, role — org, one line.
- **Command palette:** Windows Terminal style (`>` prompt), grouped results (Pages, Projects, Actions), first match highlighted, ↑↓/↵/esc hints. Easter eggs: `winfetch`, `sudo hire sam`.

## Page structure

### Home

1. Tab bar nav + Search (`/`) + theme toggle + Résumé button
2. Hero: `PS C:\sam> whoami`, H1 "I build software that real businesses run on.", one-paragraph intro, See my work / Download résumé, "Open to junior full-stack roles · Vancouver WA / Portland / remote"
3. Terminal window card (winfetch)
4. Impact strip: 50,000+ orders synced · ~800 club members on Trellis · ~50 calls/day · ~12 client sites · every cash mismatch under $1
5. Selected work: Trellis featured wide, then spend tracker, cash drawer, AI receptionist, Chess Variant, Telegram bot; then `ls .\work --more` list (wine inventory, TV events display, Webflow rebuild, identity matcher)
6. Experience timeline: Marketing & Technology Lead → freelance return → Assistant Winemaker → Dishwasher, plus Freelance Web Developer
7. Skills (as JSON) + Education
8. Contact footer: email, LinkedIn, GitHub, freelance site

### Project page (template from Trellis)

Breadcrumb → title + one-line summary → facts grid (Role, Status, Stack, How it's built) → hero screenshot → table of contents + sections: 01 The problem · 02 How it works (diagram) · 03 Key decisions (+ code excerpt) · 04 Working with AI · 05 What's next → prev/next project.

### Phone

Same order, single column. Terminal card stacks the ASCII art above the rows; impact numbers in a 2×2 grid; full-width buttons.

## Placeholders to fill before launch

- ASCII portrait from Sam's photo (grapes are a stand-in)
- Screenshots or GIFs for every project
- A real code excerpt for the Trellis page (e.g. the idempotency-key charge call)
- What happened with the old billing vendor and what staff did in the meantime
- Case-study text for the other projects
- Résumé PDF
