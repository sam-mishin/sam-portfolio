"""Turns a photo into the ASCII portrait used on the site's winfetch card.

    python scripts/make_ascii.py docs/photo.jpg --cols 40 --rows 26 --out content

Writes <out>/ascii-dark.txt (bright = dense, for light text on dark) and
<out>/ascii-light.txt (dark = dense, for dark text on light). With no --out
it writes ascii/dark.txt and ascii/light.txt next to this script, exactly
like the GitHub profile card version (docs/github-profile-card/make_ascii.py).

The portrait only reads well with the background removed:
- If `rembg` is installed (pip install rembg), it cuts the person out.
  It downloads its model from GitHub the first time it runs.
- Otherwise, for a photo on a plain light backdrop (a studio headshot),
  --flat-bg flood-fills the backdrop from the image edges and makes it
  transparent. That's how the current portrait was made.
"""

import argparse
from collections import deque
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent
# light -> dense. Index 0 is blank.
RAMP = " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"
CHAR_ASPECT = 9.6 / 20  # char width / line height on the card


def remove_flat_background(img, min_light=200, max_chroma=24):
    """Make a plain, light, gray-ish backdrop transparent.

    Starts from every edge pixel and spreads through neighbors that are
    light (all channels >= min_light) and nearly colorless (max - min
    channel <= max_chroma). Light hair and skin have more color than a
    studio backdrop, so the fill stops at the person's outline.
    """
    rgba = img.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()

    def is_backdrop(x, y):
        r, g, b, _ = px[x, y]
        return min(r, g, b) >= min_light and max(r, g, b) - min(r, g, b) <= max_chroma

    seen = bytearray(w * h)
    queue = deque()
    for x in range(w):
        queue.extend(((x, 0), (x, h - 1)))
    for y in range(h):
        queue.extend(((0, y), (w - 1, y)))
    while queue:
        x, y = queue.popleft()
        i = y * w + x
        if seen[i] or not is_backdrop(x, y):
            continue
        seen[i] = 1
        r, g, b, _ = px[x, y]
        px[x, y] = (r, g, b, 0)
        if x > 0:
            queue.append((x - 1, y))
        if x < w - 1:
            queue.append((x + 1, y))
        if y > 0:
            queue.append((x, y - 1))
        if y < h - 1:
            queue.append((x, y + 1))
    return rgba


def load(path, use_rembg, flat_bg):
    img = ImageOps.exif_transpose(Image.open(path)).convert("RGBA")
    if flat_bg:
        img = remove_flat_background(img)
    elif use_rembg:
        try:
            from rembg import remove
            img = remove(img)
        except ImportError:
            print("rembg not installed; keeping background (try --flat-bg)")
    bbox = img.getchannel("A").point(lambda a: 255 if a > 40 else 0).getbbox()
    if bbox:
        img = img.crop(bbox)
    return img


def convert(img, cols, rows_max, invert):
    w, h = img.size
    rows = round(cols * h / w * CHAR_ASPECT)
    if rows > rows_max:
        rows = rows_max
        cols = round(rows * w / h / CHAR_ASPECT)
    small = img.resize((cols, rows), Image.LANCZOS)
    alpha = small.getchannel("A")
    gray = small.convert("L")
    gray = ImageOps.autocontrast(gray, cutoff=2)
    gray = ImageEnhance.Contrast(gray).enhance(1.3)
    gray = gray.filter(ImageFilter.UnsharpMask(radius=1, percent=80))

    out = []
    for y in range(rows):
        line = ""
        for x in range(cols):
            if alpha.getpixel((x, y)) < 100:
                line += " "
                continue
            v = gray.getpixel((x, y)) / 255
            if invert:
                v = 1 - v
            idx = 1 + int(v * (len(RAMP) - 2))
            line += RAMP[idx]
        out.append(line.rstrip())
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("photo")
    ap.add_argument("--cols", type=int, default=40)
    ap.add_argument("--rows", type=int, default=26)
    ap.add_argument("--no-rembg", action="store_true")
    ap.add_argument("--flat-bg", action="store_true",
                    help="remove a plain light backdrop without rembg")
    ap.add_argument("--out", help="folder for ascii-dark.txt / ascii-light.txt (e.g. content)")
    a = ap.parse_args()

    img = load(a.photo, not a.no_rembg, a.flat_bg)
    for theme, invert in (("dark", False), ("light", True)):
        art = convert(img, a.cols, a.rows, invert)
        if a.out:
            target = Path(a.out) / f"ascii-{theme}.txt"
        else:
            (ROOT / "ascii").mkdir(exist_ok=True)
            target = ROOT / "ascii" / f"{theme}.txt"
        target.write_text("\n".join(art) + "\n", encoding="utf-8")
        print(f"wrote {target}")
    print("\n".join(convert(img, a.cols, a.rows, False)))


if __name__ == "__main__":
    main()
