"""Turns a photo into the ASCII portrait used on the card.

    python make_ascii.py photo.jpg [--cols 40] [--rows 26] [--no-rembg]

Writes ascii/dark.txt (bright = dense, for light text on dark) and
ascii/light.txt (dark = dense, for dark text on light). If `rembg` is
installed the background is removed first, which makes a big difference.
"""

import argparse
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent
# light -> dense. Index 0 is blank.
RAMP = " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"
CHAR_ASPECT = 9.6 / 20  # char width / line height on the card


def load(path, use_rembg):
    img = ImageOps.exif_transpose(Image.open(path)).convert("RGBA")
    if use_rembg:
        try:
            from rembg import remove
            img = remove(img)
        except ImportError:
            print("rembg not installed; keeping background")
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
    a = ap.parse_args()

    img = load(a.photo, not a.no_rembg)
    (ROOT / "ascii").mkdir(exist_ok=True)
    for theme, invert in (("dark", False), ("light", True)):
        art = convert(img, a.cols, a.rows, invert)
        (ROOT / "ascii" / f"{theme}.txt").write_text("\n".join(art) + "\n", encoding="utf-8")
    print("\n".join(convert(img, a.cols, a.rows, False)))


if __name__ == "__main__":
    main()
