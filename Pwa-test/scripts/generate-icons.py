#!/usr/bin/env python3
"""Generate PWA PNG icons from a simple lens mark."""

from __future__ import annotations

import math
import os
import struct
import zlib


def write_png(path: str, size: int, pixels: list[tuple[int, int, int, int]]) -> None:
    raw = bytearray()
    for y in range(size):
        raw.append(0)
        row = y * size
        for x in range(size):
            raw.extend(pixels[row + x])

    def chunk(tag: bytes, data: bytes) -> bytes:
        crc = zlib.crc32(tag + data) & 0xFFFFFFFF
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", crc)

    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + chunk(b"IEND", b"")
    )
    with open(path, "wb") as handle:
        handle.write(png)


def clamp(value: float) -> int:
    return max(0, min(255, int(round(value))))


def mix(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return (
        clamp(a[0] + (b[0] - a[0]) * t),
        clamp(a[1] + (b[1] - a[1]) * t),
        clamp(a[2] + (b[2] - a[2]) * t),
    )


def rounded_rect_sdf(px: float, py: float, size: float, radius: float) -> float:
    hx = size / 2 - radius
    hy = size / 2 - radius
    dx = abs(px - size / 2) - hx
    dy = abs(py - size / 2) - hy
    outside = math.hypot(max(dx, 0.0), max(dy, 0.0))
    inside = min(max(dx, dy), 0.0)
    return outside + inside - radius


def draw_icon(size: int, maskable: bool) -> list[tuple[int, int, int, int]]:
    inset = size * (0.18 if maskable else 0.08)
    box = size - inset * 2
    cx = size / 2
    cy = size / 2
    outer_r = box * 0.28
    ring = box * 0.045
    inner_r = outer_r - ring * 2.2
    pixels: list[tuple[int, int, int, int]] = []
    bg_top = (18, 20, 32)
    bg_bot = (8, 9, 16)
    accent = (110, 231, 183)
    accent_dark = (45, 166, 122)
    glass = (16, 18, 28)

    for y in range(size):
        for x in range(size):
            px, py = x + 0.5, y + 0.5
            sdf = rounded_rect_sdf(px, py, size, size * 0.22)
            t = py / size
            base = mix(bg_top, bg_bot, t)
            alpha = 255 if sdf < 0 else (255 if sdf < 1 else 0)
            if 0 <= sdf < 1.4:
                edge = 1 - min(sdf / 1.4, 1)
                base = mix(base, (255, 255, 255), 0.08 * edge)

            dx, dy = px - cx, py - (cy - box * 0.02)
            dist = math.hypot(dx, dy)
            if dist < outer_r:
                ring_t = abs(dist - (outer_r - ring)) / ring
                if dist > outer_r - ring * 2:
                    glow = max(0.0, 1 - ring_t)
                    base = mix(base, accent, 0.35 + 0.65 * glow)
                elif dist < inner_r:
                    shade = 0.35 + 0.65 * ((dy / inner_r + 1) / 2)
                    base = mix(glass, (30, 36, 52), shade)
                    highlight = math.hypot(dx + inner_r * 0.28, dy + inner_r * 0.32)
                    if highlight < inner_r * 0.42:
                        base = mix(base, (220, 255, 240), 0.18)
                else:
                    base = mix(accent_dark, accent, 0.55)

            # small aperture glint
            glint = math.hypot(px - (cx + outer_r * 0.55), py - (cy - outer_r * 0.7))
            if glint < box * 0.045:
                base = mix(base, (255, 255, 255), 0.7)

            if maskable and sdf > size * 0.02:
                safe = rounded_rect_sdf(px, py, size, size * 0.5)
                if safe > 0:
                    base = mix((12, 13, 20), base, 0.15)

            pixels.append((base[0], base[1], base[2], alpha if not maskable else 255))
    return pixels


def main() -> None:
    out = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
    os.makedirs(out, exist_ok=True)
    specs = [
        ("icon-192.png", 192, False),
        ("icon-512.png", 512, False),
        ("maskable-192.png", 192, True),
        ("maskable-512.png", 512, True),
        ("apple-touch-icon.png", 180, False),
    ]
    for name, size, maskable in specs:
        path = os.path.join(out, name)
        write_png(path, size, draw_icon(size, maskable))
        print(f"wrote {path}")


if __name__ == "__main__":
    main()
