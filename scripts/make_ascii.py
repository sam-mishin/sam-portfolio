"""Turns a photo into the ASCII portrait used on the site's winfetch card.

    python scripts/make_ascii.py docs/photo.jpg --flat-bg --crop 0.22,0.07,0.79,0.88 \
        --cols 56 --rows 40 --out content

Writes <out>/ascii-dark.txt (bright = dense, for light text on dark) and
<out>/ascii-light.txt (dark = dense, for dark text on light). With no --out
it writes ascii/dark.txt and ascii/light.txt next to this script, like the
GitHub profile card version (docs/github-profile-card/make_ascii.py).

What makes a portrait recognizable, in order of impact:
1. Background removed. `rembg` (pip install rembg) cuts the person out; it
   downloads a model from GitHub the first time. For a plain, light studio
   backdrop, --flat-bg does it with a flood fill instead.
2. A tight crop, so the face gets most of the characters (--crop).
3. Enough resolution: 56 columns shows the glasses and mouth; 40 mostly
   shows a head shape.
4. A ramp of characters whose ink coverage in Cascadia Code goes up in
   even steps (RAMP below), so tones come out as tones instead of noise.
"""

import argparse
from collections import deque
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent

# Light -> dense. Each character was picked by rendering every printable
# ASCII character in Cascadia Code, measuring how much of its cell is ink
# (from 0% for a space to ~29% for "@"), and taking the closest match to 15
# evenly spaced coverage steps, symbols only. Letters were left out: they
# add texture that reads as noise in a face. Scored against the photo
# (blurred render vs. blurred photo, face pixels only), this ramp beat the
# 70-character "classic" ramp clearly.
RAMP = " .`-^\"<?([]%&$@"
# The ramp the GitHub card uses, kept for comparison (--ramp classic).
CLASSIC_RAMP = " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"
CHAR_ASPECT = 0.586 / 1.25  # Cascadia char width / CSS line-height 1.25


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


def load(path, use_rembg, flat_bg, crop):
    img = ImageOps.exif_transpose(Image.open(path)).convert("RGBA")
    if flat_bg:
        img = remove_flat_background(img)
    elif use_rembg:
        try:
            from rembg import remove
            img = remove(img)
        except ImportError:
            print("rembg not installed; keeping background (try --flat-bg)")
    if crop:
        w, h = img.size
        left, top, right, bottom = crop
        img = img.crop((round(left * w), round(top * h), round(right * w), round(bottom * h)))
    else:
        bbox = img.getchannel("A").point(lambda a: 255 if a > 40 else 0).getbbox()
        if bbox:
            img = img.crop(bbox)
    return img


def tones(img, cols, rows_max):
    """Downsample to one gray value per character cell, stretched to 0..255."""
    w, h = img.size
    rows = round(cols * h / w * CHAR_ASPECT)
    if rows > rows_max:
        rows = rows_max
        cols = round(rows * w / h / CHAR_ASPECT)
    # A slight blur first, so skin texture and stray hairs don't turn into
    # speckle once each cell becomes one character.
    gray = img.convert("L").filter(ImageFilter.GaussianBlur(1.5)).resize((cols, rows), Image.LANCZOS)
    alpha = img.getchannel("A").resize((cols, rows), Image.LANCZOS)
    # Stretch contrast using the person's pixels only (2nd–98th percentile),
    # so the removed background doesn't skew it.
    inside = sorted(g for g, a in zip(gray.get_flattened_data(), alpha.get_flattened_data()) if a >= 100)
    if inside:
        lo, hi = inside[int(len(inside) * 0.02)], inside[int(len(inside) * 0.98)]
        gray = gray.point(lambda v: max(0, min(255, round((v - lo) * 255 / max(1, hi - lo)))))
    return gray, alpha


def convert(gray, alpha, invert, ramp):
    cols, rows = gray.size
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
            # Index 0 is a space: kept for the background only.
            line += ramp[1 + int(v * (len(ramp) - 2))]
        out.append(line.rstrip())
    # Drop empty rows above and below the person (same in both themes).
    while out and not out[0]:
        out.pop(0)
    while out and not out[-1]:
        out.pop()
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("photo")
    ap.add_argument("--cols", type=int, default=56)
    ap.add_argument("--rows", type=int, default=40)
    ap.add_argument("--no-rembg", action="store_true")
    ap.add_argument("--flat-bg", action="store_true", help="remove a plain light backdrop without rembg")
    ap.add_argument("--crop", help="left,top,right,bottom as fractions of the photo, e.g. 0.22,0.07,0.79,0.88")
    ap.add_argument("--ramp", choices=("measured", "classic"), default="measured")
    ap.add_argument("--out", help="folder for ascii-dark.txt / ascii-light.txt (e.g. content)")
    a = ap.parse_args()

    crop = tuple(float(v) for v in a.crop.split(",")) if a.crop else None
    ramp = RAMP if a.ramp == "measured" else CLASSIC_RAMP
    img = load(a.photo, not a.no_rembg, a.flat_bg, crop)
    gray, alpha = tones(img, a.cols, a.rows)
    for theme, invert in (("dark", False), ("light", True)):
        art = convert(gray, alpha, invert, ramp)
        if a.out:
            target = Path(a.out) / f"ascii-{theme}.txt"
        else:
            (ROOT / "ascii").mkdir(exist_ok=True)
            target = ROOT / "ascii" / f"{theme}.txt"
        target.write_text("\n".join(art) + "\n", encoding="utf-8")
        print(f"wrote {target}")
    print("\n".join(convert(gray, alpha, True, ramp)))


if __name__ == "__main__":
    main()
