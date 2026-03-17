"""
Extract images from the S&OP PDF into public/projects/saop-inventory/

Requirements:
    pip install pymupdf

Usage (from repo root):
    python scripts/extract-pdf-images.py
"""

import fitz  # pymupdf
import os
from pathlib import Path

PDF_PATH = r"K:\My Drive\Profissional\Portfolio\Strattner\Apresentaçöes\Strattner - 2023_02 - Entregas 2022 e PE 2023.pdf"
OUT_DIR  = Path(__file__).parent.parent / "public" / "projects" / "saop-inventory"

OUT_DIR.mkdir(parents=True, exist_ok=True)

doc = fitz.open(PDF_PATH)
counter = 1

for page_num, page in enumerate(doc, start=1):
    images = page.get_images(full=True)
    for img in images:
        xref = img[0]
        base = doc.extract_image(xref)
        ext  = base["ext"]
        data = base["image"]

        # Skip very small images (icons, decorative elements < 10 KB)
        if len(data) < 10_000:
            continue

        dest = OUT_DIR / f"img{counter}.{ext}"
        dest.write_bytes(data)
        print(f"  Page {page_num} → {dest.name}  ({len(data)//1024} KB)")
        counter += 1

print(f"\nExtracted {counter - 1} image(s) to {OUT_DIR}")
