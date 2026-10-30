# Portfolio design files

Exported from the design canvas: https://claude.ai/artifact/CLmQvCX1FSL9gWcMc93CSm (Oct 30, 2026).

These are **mockups, not production code**. Use them as the visual reference and content source when building the real site (see `portfolio/build-prompt.md`).

| File | Screen | Use it for |
|---|---|---|
| `Main.dc.html` | Home page, desktop, Windows Terminal style | The main reference: layout, spacing, colors, all home-page copy |
| `Project.dc.html` | Trellis case study | Template for every project page |
| `Mobile.dc.html` | Home page at 390px | Phone layout |
| `CommandBar.dc.html` | `/` command palette, open | Palette look, commands, empty state |
| `StyleGuide.dc.html` | Colors, type, components, light mode | Design tokens and the light theme |
| `MainMac.dc.html` | Mac Terminal version of the home page top | **Comparison only — do not build** |

## How to read the format

- All styling is **inline `style="…"`**. Turn the repeated values into CSS custom properties (the token list is in `portfolio/design-spec.md`).
- `{{name}}` is a placeholder filled from the `renderVals()` function in the `<script type="text/x-dc">` block at the bottom of each file. **That block holds the real content** (winfetch rows, impact numbers, projects, jobs, skills).
- `<sc-for list="{{items}}" as="item">` repeats its contents once per item. `<sc-if value="{{x}}">` shows its contents only when `x` is true.
- `<x-dc>`, `<helmet>`, `support.js` and `data-props` belong to the design tool. Ignore them.
- Text in `[square brackets]` is a placeholder for content Sam still needs to supply (screenshots, code excerpt, ASCII portrait from his photo).
- The ASCII grapes are a stand-in for the portrait generated from Sam's photo with `github-profile-card/make_ascii.py`.
