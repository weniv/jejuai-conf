"""Rebuild the conference's social card and icons: python scripts/generate-brand-assets.py.

Requires Pillow and fonttools. Uses the site's own terrain and Pretendard fonts.
"""

from io import BytesIO
from functools import lru_cache
from pathlib import Path
import math
import random
import re

from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
SCALE = 2
INK = "#10110f"
PAPER = "#f2efe6"
ORANGE = "#ff7a1a"
PALETTE = [ORANGE, "#ffc16e", "#ff9b50", PAPER]
RNG = random.Random(2026)


@lru_cache(maxsize=32)
def font(size, weight="Bold"):
    source = TTFont(ROOT / f"src/app/font/Pretendard-{weight}.woff")
    source.flavor = None
    buffer = BytesIO()
    source.save(buffer)
    buffer.seek(0)
    return ImageFont.truetype(buffer, round(size * SCALE))


def xy(values):
    return tuple(round(value * SCALE) for value in values)


def render_social_card():
    image = Image.new("RGB", (1200 * SCALE, 630 * SCALE), INK)
    glow = Image.new("RGBA", image.size)
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse(xy((690, 130, 1070, 440)), fill=(255, 100, 12, 36))
    glow = glow.filter(ImageFilter.GaussianBlur(70 * SCALE))
    image = Image.alpha_composite(image.convert("RGBA"), glow)
    draw = ImageDraw.Draw(image)

    # Read the same coastline as the live point cloud rather than drawing a generic island.
    terrain = (ROOT / "src/components/stage/terrain.ts").read_text(encoding="utf-8")
    coast_source = terrain.split("const COAST:", 1)[1].split("= [", 1)[1].split("];", 1)[0]
    coast = [(float(a), float(b)) for a, b in re.findall(r"\[([\d.]+),\s*([\d.]+)\]", coast_source)]
    lon_scale = math.cos(math.radians(33.4))
    coast = [((lon - 126.533) * lon_scale / 0.36, -(lat - 33.361) / 0.36) for lon, lat in coast]

    def inside(x, z):
        result = False
        for i, a in enumerate(coast):
            b = coast[i - 1]
            if (a[1] > z) != (b[1] > z):
                if x < (b[0] - a[0]) * (z - a[1]) / (b[1] - a[1]) + a[0]:
                    result = not result
        return result

    def altitude(distance):
        return 0.42 * math.exp(-(max(distance, 0.03) / 0.2) ** 0.8) - 0.024 * math.exp(-(distance / 0.02) ** 2)

    def project(x, y, z):
        yaw, pitch = -0.16, 0.86
        x1 = x * math.cos(yaw) - z * math.sin(yaw)
        z1 = x * math.sin(yaw) + z * math.cos(yaw)
        y2 = y * math.cos(pitch) - z1 * math.sin(pitch)
        z2 = -z1 * math.cos(pitch) - y * math.sin(pitch)
        perspective = 4.2 / (4.2 + z2)
        return 882 + x1 * perspective * 355, 392 - y2 * perspective * 355

    step = 0.014
    for row in range(108):
        z = -0.56 + row * step * 0.86
        for col in range(151):
            x = -1.02 + col * step + (step / 2 if row % 2 else 0)
            if not inside(x, z):
                continue
            distance = math.hypot(x, z)
            y = altitude(distance)
            px, py = project(x, y, z)
            if px < 590 or px > 1165 or py > 526:
                continue
            shade = round(65 + min(y / 0.32, 1) ** 0.9 * 175)
            color = (shade, shade, round(shade * 0.95))
            if distance < 0.16 or abs(distance - 0.42) < 0.024:
                color = (255, round(118 + RNG.random() * 48), 36)
            size = 0.9 + y * 3.5
            draw.rectangle(xy((px, py, px + size, py + size)), fill=color)

    cx, cy = project(0, altitude(0.03), 0)
    for radius, alpha in [(31, 100), (66, 55), (108, 28)]:
        draw.ellipse(xy((cx - radius, cy - radius * 0.27, cx + radius, cy + radius * 0.27)), outline=(255, 122, 26, alpha), width=2)

    arrow = [(0, 0), (0, 15.5), (4.4, 11.8), (7.3, 18), (10, 16.8), (7.2, 10.8), (13, 10.4)]
    destinations = [(699, 202), (761, 144), (855, 130), (951, 160), (1056, 208), (1111, 288),
                    (1071, 365), (975, 429), (871, 450), (741, 402), (663, 321), (805, 240)]
    for i, (tx, ty) in enumerate(destinations):
        color = PALETTE[i % len(PALETTE)]
        path = []
        for j in range(31):
            p = j / 30
            mx, my = (cx + tx) / 2, min(cy, ty) - 70
            path.append(((1 - p) ** 2 * cx + 2 * (1 - p) * p * mx + p * p * tx,
                         (1 - p) ** 2 * cy + 2 * (1 - p) * p * my + p * p * ty))
        draw.line([xy(point) for point in path], fill=(*tuple(bytes.fromhex(color[1:])), 65), width=2)
        angle = (i % 5 - 2) * 0.17
        size = 1.05 if i % 3 else 1.35
        points = [(tx + (x * math.cos(angle) - y * math.sin(angle)) * size,
                   ty + (x * math.sin(angle) + y * math.cos(angle)) * size) for x, y in arrow]
        draw.polygon([xy((x + 2, y + 3)) for x, y in points], fill="#6b3519")
        draw.polygon([xy(point) for point in points], fill=color)
        if i in (0, 3, 6, 9):
            label = f"Agent {i + 1:02d}"
            draw.text(xy((tx + 18, ty + 19)), label, font=font(11, "SemiBold"), fill=color)

    # Keep all share-preview information in a generous safe area.
    draw.text(xy((72, 36)), "JEJU AI CONFERENCE 2026", font=font(16, "SemiBold"), fill=PAPER)
    draw.rounded_rectangle(xy((1038, 30, 1128, 63)), radius=16 * SCALE, outline="#77401f", width=2)
    draw.ellipse(xy((1053, 44, 1058, 49)), fill=ORANGE)
    draw.text(xy((1067, 36)), "준비중", font=font(14, "SemiBold"), fill=ORANGE)
    draw.text(xy((68, 155)), "JEJU AI", font=font(94), fill=PAPER)
    draw.text(xy((72, 270)), "CONFERENCE", font=font(31, "SemiBold"), fill=PAPER)
    draw.text(xy((304, 270)), "2026", font=font(31, "SemiBold"), fill=ORANGE)
    draw.text(xy((74, 345)), "AI에 관심 있는 누구에게나.", font=font(21, "Regular"), fill="#a5a49c")
    draw.text(xy((72, 421)), "12.08 — 12.09", font=font(42), fill=ORANGE)
    draw.line([xy((72, 548)), xy((1128, 548))], fill="#35362f", width=2)
    draw.text(xy((72, 572)), "2026.12.08 — 12.09  ·  제주창조경제혁신센터", font=font(17, "SemiBold"), fill=PAPER)
    draw.text(xy((1031, 572)), "jejuai.kr", font=font(18, "SemiBold"), fill=ORANGE)
    image.convert("RGB").resize((1200, 630), Image.Resampling.LANCZOS).save(PUBLIC / "images/og-2026-wordmark.png", optimize=True)


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
  <path d="{pen.getCommands()}" fill="{ORANGE}"/>
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
    draw.text(((size-right+left)/2-left, (size-bottom+top)/2-top), "AI", font=face, fill=ORANGE)
    for filename, dimensions in [("apple-touch-icon.png", 180), ("icon-192.png", 192), ("icon-512.png", 512)]:
        output = icon.resize((dimensions, dimensions), Image.Resampling.LANCZOS)
        if filename == "apple-touch-icon.png":
            background = Image.new("RGBA", output.size, INK)
            output = Image.alpha_composite(background, output).convert("RGB")
        output.save(PUBLIC / filename, optimize=True)
    icon.save(PUBLIC / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])


if __name__ == "__main__":
    render_social_card()
    render_icons()
    print("Generated social card, SVG favicon, ICO, Apple icon, and app icons.")
