"""
Extract captioned figures ("Figure 2.10 AI based agriculture") from the ICT
textbook PDFs as cropped PNGs, plus a manifest for the video pipeline.

    python scripts/extract_textbook_figures.py            # Grade 11 + 12
    python scripts/extract_textbook_figures.py --grade 11

Output:
    output/ict_figures/G11/U02/G11_F2.10_ai-based-agriculture.png
    output/ict_figures/manifest.json

The textbooks are born-digital PDFs, so figure positions are read from the PDF
itself (embedded images, or vector drawings for drawn diagrams). Figures that
cannot be located that way are listed with method "unlocated"; those are the
candidates for Unlimited-OCR layout detection.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parent.parent
TEXTBOOKS = {
    "11": ROOT / "input/Textbooks/grade-11-information-technology-new-curriculum--student-textbook.pdf",
    "12": ROOT / "input/Textbooks/grade-12-information-technology-new-curriculum--student-textbook.pdf",
}
OUT_DIR = ROOT / "output/ict_figures"

CAPTION = re.compile(r"^\s*(?:Figure|Fig\.?)\s*(\d+)\s*\.\s*(\d+)\s*[:.\-–]?\s*(.*)$", re.I)
HEADER_FOOTER_PT = 45      # running header / page number bands
MAX_GAP_PT = 320           # how far a figure may sit from its caption
MIN_SIDE_PT = 40           # ignore icons / bullets
RENDER_DPI = 200


def slug(text: str, max_len: int = 48) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s[:max_len].rstrip("-") or "figure"


def h_overlap(a: pymupdf.Rect, b: pymupdf.Rect) -> float:
    return max(0.0, min(a.x1, b.x1) - max(a.x0, b.x0))


def find_captions(page: pymupdf.Page) -> list[tuple[str, str, str, pymupdf.Rect]]:
    """(unit, number, caption text, caption rect) for caption-like short blocks."""
    found = []
    for x0, y0, x1, y1, text, *_ in page.get_text("blocks"):
        lines = [ln for ln in text.splitlines() if ln.strip()]
        if not lines:
            continue
        m = CAPTION.match(lines[0])
        # Captions are short; a long paragraph starting "Figure 1.2 shows…" is body text.
        if m and len(text) < 200:
            caption = clean_caption(" ".join([m.group(3)] + lines[1:]))
            # "Figure 4.6 below demonstrates…" is a reference in body text, not the caption.
            if REFERENCE_START.match(caption) or not caption:
                continue
            found.append((m.group(1), m.group(2), caption, pymupdf.Rect(x0, y0, x1, y1)))
    return found


REFERENCE_START = re.compile(r"^(below|above|shows?|illustrates?|demonstrates?|depicts?|is|are|and|in|of)\b", re.I)


def clean_caption(text: str) -> str:
    # The PDF encodes curly quotes/apostrophes in a way that extracts as U+FFFD.
    text = text.replace("�", "'")
    return re.sub(r"\s+", " ", text).strip(" :.-'")


def image_rects(page: pymupdf.Page) -> list[pymupdf.Rect]:
    rects = []
    for info in page.get_image_info():
        r = pymupdf.Rect(info["bbox"]) & page.rect
        if r.width >= MIN_SIDE_PT and r.height >= MIN_SIDE_PT:
            rects.append(r)
    return rects


def drawing_rects(page: pymupdf.Page) -> list[pymupdf.Rect]:
    rects = []
    for d in page.get_drawings():
        r = pymupdf.Rect(d["rect"]) & page.rect
        # Skip page-wide frames/backgrounds and hairline rules.
        if r.width > page.rect.width * 0.9 and r.height > page.rect.height * 0.5:
            continue
        if r.width < 2 and r.height < 2:
            continue
        rects.append(r)
    return rects


def union(rects: list[pymupdf.Rect]) -> pymupdf.Rect:
    u = pymupdf.Rect(rects[0])
    for r in rects[1:]:
        u |= r
    return u


def locate_figure(page: pymupdf.Page, cap: pymupdf.Rect, taken: list[pymupdf.Rect]):
    """Figure region for a caption: images above it (else below), else drawings above it."""
    content = pymupdf.Rect(0, HEADER_FOOTER_PT, page.rect.width, page.rect.height - HEADER_FOOTER_PT)

    def free(r: pymupdf.Rect) -> bool:
        return not any((r & t).get_area() > 0.5 * r.get_area() for t in taken)

    imgs = [r for r in image_rects(page) if free(r) and r.intersects(content)]
    above = [r for r in imgs if r.y1 <= cap.y0 + 8 and cap.y0 - r.y1 < MAX_GAP_PT and h_overlap(r, cap) > 0]
    if above:
        nearest = max(above, key=lambda r: r.y1)
        # Multi-image figures: siblings in the same vertical band as the nearest image.
        group = [r for r in above if r.y1 >= nearest.y0 - 10]
        return union(group), "raster"

    below = [r for r in imgs if r.y0 >= cap.y1 - 8 and r.y0 - cap.y1 < 60 and h_overlap(r, cap) > 0]
    if below:
        return union([min(below, key=lambda r: r.y0)]), "raster-below"

    draws = [
        r for r in drawing_rects(page)
        if r.y1 <= cap.y0 + 4 and cap.y0 - r.y1 < MAX_GAP_PT and r.intersects(content) and free(r)
    ]
    if len(draws) >= 3:
        # Keep the cluster connected to the caption: walk upward while gaps are small.
        draws.sort(key=lambda r: -r.y1)
        cluster, top = [], cap.y0
        for r in draws:
            if top - r.y1 > 40:
                break
            cluster.append(r)
            top = min(top, r.y0)
        if cluster:
            region = union(cluster)
            if region.width >= 80 and region.height >= 50:
                region.y1 = min(region.y1, cap.y0 - 1)  # never include the caption
                return region, "vector"

    # Text-typeset figures (code listings, tables): the run of non-prose text
    # blocks directly above the caption.
    blocks = [
        pymupdf.Rect(b[:4]) for b in page.get_text("blocks")
        if b[3] <= cap.y0 + 2 and pymupdf.Rect(b[:4]).intersects(content) and not is_prose(b[4], b[2] - b[0], page)
        and pymupdf.Rect(b[:4]) != cap
    ]
    prose_bottoms = [
        b[3] for b in page.get_text("blocks")
        if b[3] <= cap.y0 + 2 and is_prose(b[4], b[2] - b[0], page) and b[1] > HEADER_FOOTER_PT
    ]
    floor = max(prose_bottoms, default=HEADER_FOOTER_PT)
    run = [r for r in blocks if r.y0 >= floor - 2 and free(r)]
    if run:
        region = union(run)
        region.y1 = min(region.y1, cap.y0 - 1)
        if region.height >= 40 and region.width >= 80:
            return region, "text"
    return None, "unlocated"


def is_prose(text: str, width: float, page: pymupdf.Page) -> bool:
    """Body paragraph: wide, long, sentence-like text (not code or table cells)."""
    t = " ".join(text.split())
    return width > page.rect.width * 0.55 and len(t) > 140 and t.count(". ") + t.endswith(".") >= 2


# Sub-chapter heading such as "2.2 Augmented Reality and Virtual Reality"
# (level 2 only; "2.2.1 …" sub-headings stay inside their sub-chapter).
SUBCHAPTER = re.compile(r"^\s*(\d+)\.(\d+)\.?\s+([A-Z][^\n]{2,90}?)\s*$")


def subchapter_headings(page: pymupdf.Page) -> list[tuple[float, int, str]]:
    """(y, unit, 'n.m Title') for sub-chapter headings on the page, top to bottom."""
    out = []
    for x0, y0, x1, y1, text, *_ in page.get_text("blocks"):
        first = next((ln for ln in text.splitlines() if ln.strip()), "")
        m = SUBCHAPTER.match(first)
        # Skip table-of-contents lines ("2.2 Augmented Reality ....... 45") and long sentences.
        if m and "..." not in first and len(first) < 90 and len(text) < 160:
            out.append((y0, int(m.group(1)), f"{m.group(1)}.{m.group(2)} {m.group(3).strip()}"))
    return sorted(out)


def extract(grade: str) -> list[dict]:
    pdf = TEXTBOOKS[grade]
    doc = pymupdf.open(pdf)
    figures, seen = [], set()
    current_sub: dict[int, str] = {}  # unit → latest sub-chapter heading seen
    for page in doc:
        taken: list[pymupdf.Rect] = []
        headings = subchapter_headings(page)
        for unit, num, caption, cap_rect in find_captions(page):
            fig_id = f"{unit}.{num}"
            if fig_id in seen:
                continue  # first occurrence is the caption; repeats are usually references
            # Sub-chapter in effect at the caption: headings above it on this page,
            # else the last one seen on earlier pages.
            for y, h_unit, title in headings:
                if y < cap_rect.y0:
                    current_sub[h_unit] = title
            region, method = locate_figure(page, cap_rect, taken)
            entry = {
                "grade": grade,
                "unit": int(unit),
                "figure": fig_id,
                "caption": caption,
                "page": page.number + 1,
                "subchapter": current_sub.get(int(unit)),
                "method": method,
            }
            if region is not None:
                # Embedded images are cropped exactly; drawn/text figures get a small
                # side margin but never extend past the caption.
                if not method.startswith("raster"):
                    bottom = region.y1
                    region = (region + (-4, -4, 4, 0)) & page.rect
                    region.y1 = bottom
                taken.append(region)
                rel = Path(f"G{grade}") / f"U{int(unit):02d}" / f"G{grade}_F{fig_id}_{slug(caption)}.png"
                out = OUT_DIR / rel
                out.parent.mkdir(parents=True, exist_ok=True)
                pix = page.get_pixmap(clip=region, dpi=RENDER_DPI)
                pix.save(out)
                entry.update({
                    "file": rel.as_posix(),
                    "bbox": [round(v, 1) for v in region],
                    "width_px": pix.width,
                    "height_px": pix.height,
                })
            figures.append(entry)
            seen.add(fig_id)
        # Headings below the last caption still apply to the next pages.
        for _, h_unit, title in headings:
            current_sub[h_unit] = title
    return figures


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--grade", choices=sorted(TEXTBOOKS), action="append")
    args = ap.parse_args()
    grades = args.grade or sorted(TEXTBOOKS)

    manifest_path = OUT_DIR / "manifest.json"
    existing = json.loads(manifest_path.read_text("utf8")) if manifest_path.exists() else {"figures": []}
    kept = [f for f in existing["figures"] if f["grade"] not in grades]

    for grade in grades:
        figs = extract(grade)
        located = sum(1 for f in figs if f.get("file"))
        by_method: dict[str, int] = {}
        for f in figs:
            by_method[f["method"]] = by_method.get(f["method"], 0) + 1
        print(f"Grade {grade}: {len(figs)} figures, {located} cropped  {by_method}")
        kept.extend(figs)

    kept.sort(key=lambda f: (f["grade"], f["unit"], [int(x) for x in f["figure"].split(".")]))
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps({"figures": kept}, indent=2, ensure_ascii=False), "utf8")
    print(f"Manifest: {manifest_path}")


if __name__ == "__main__":
    main()
