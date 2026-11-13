"""Rebuild the conference's icons: python scripts/generate-brand-assets.py.

Requires Pillow and fonttools. Uses the site's own Pretendard fonts.
The social card (public/images/og-2026.jpg) is exported from Figma instead.
"""

from io import BytesIO
from functools import lru_cache
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
SCALE = 2
INK = "#120f2a"
MINT = "#6df2cc"


@lru_cache(maxsize=32)
def font(size, weight="Bold"):
    source = TTFont(ROOT / f"src/app/font/Pretendard-{weight}.woff")
    source.flavor = None
    buffer = BytesIO()
    source.save(buffer)
    buffer.seek(0)
    return ImageFont.truetype(buffer, round(size * SCALE))


def render_icons():
    # Small icons use the wordmark's AI text instead of an illustrated symbol.
    source = TTFont(ROOT / "src/app/font/Pretendard-Bold.woff")
    glyphs = source.getGlyphSet()
    cmap = source.getBestCmap()
    factor = 42 / source["head"].unitsPerEm
    advance = sum(source["hmtx"].metrics[cmap[ord(letter)]][0] for letter in "AI")
    offset = (64 - advance * factor) / 2
    cap_height = source["OS/2"].sCapHeight * factor
    baseline = (64 + cap_height) / 2
    pen = SVGPathPen(glyphs)
    for letter in "AI":
        name = cmap[ord(letter)]
        glyphs[name].draw(TransformPen(pen, (factor, 0, 0, -factor, offset, baseline)))
        offset += source["hmtx"].metrics[name][0] * factor
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <title>JEJU AI CONFERENCE 2026</title>
  <rect width="64" height="64" rx="14" fill="{INK}"/>
  <path d="{pen.getCommands()}" fill="{MINT}"/>
</svg>
'''
    (PUBLIC / "icon.svg").write_text(svg, encoding="utf-8")
    size = 1024
    icon = Image.new("RGBA", (size, size))
    draw = ImageDraw.Draw(icon)
    scale = size / 64
    draw.rounded_rectangle((0, 0, size, size), radius=14 * scale, fill=INK)
    face = font(336)
    left, top, right, bottom = draw.textbbox((0, 0), "AI", font=face)
    draw.text(((size-right+left)/2-left, (size-bottom+top)/2-top), "AI", font=face, fill=MINT)
    for filename, dimensions in [("apple-touch-icon.png", 180), ("icon-192.png", 192), ("icon-512.png", 512)]:
        output = icon.resize((dimensions, dimensions), Image.Resampling.LANCZOS)
        if filename == "apple-touch-icon.png":
            background = Image.new("RGBA", output.size, INK)
            output = Image.alpha_composite(background, output).convert("RGB")
        output.save(PUBLIC / filename, optimize=True)
    icon.save(PUBLIC / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])


if __name__ == "__main__":
    render_icons()
    print("Generated SVG favicon, ICO, Apple icon, and app icons.")
