"""
bundle_pitch_pdf.py
TrustCV Pitch PDF Auto-Merge & Bundler Utility.
Part of the `pitch_pdf_presenter` skill.
"""

import os
import sys

# Configure UTF-8 output for Windows console
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

def merge_pitch_pdfs(src_dir: str, out_path: str):
    """Merges all chapter PDFs in src_dir into a single publication-grade full PDF."""
    try:
        import fitz
    except ImportError:
        print("[Error] PyMuPDF (fitz) is not installed. Run: pip install pymupdf")
        return False

    if not os.path.exists(src_dir):
        print(f"[Error] Source directory not found: {src_dir}")
        return False

    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    # Standard TrustCV chapter presentation order
    ordered_files = [
        "FRAMEWORK_AND_STRATEGY.pdf",
        "00_EXECUTIVE_SUMMARY.pdf",
        "01_MARKET_PAIN_TRUST_CRISIS.pdf",
        "02_SOLUTION_TRUSTCV_CORE.pdf",
        "03_BUSINESS_MODEL_UNIT_ECONOMICS.pdf",
        "04_FOUR_WAY_WIN_CAPITAL_STRUCTURE.pdf",
        "05_GLOBAL_EXPANSION_ROADMAP.pdf",
        "06_INVESTMENT_ASK_AND_GOVERNANCE.pdf",
        "07_DISTILLED_DECK_COPY.pdf"
    ]

    combined = fitz.open()
    merged_count = 0

    # 1. First add ordered chapters
    for fname in ordered_files:
        fpath = os.path.join(src_dir, fname)
        if os.path.exists(fpath):
            sub_doc = fitz.open(fpath)
            combined.insert_pdf(sub_doc)
            merged_count += 1
            print(f"  [+] Merged: {fname} ({len(sub_doc)} pages)")

    # 2. Add any other extra PDF chapters not in the fixed list
    for fname in sorted(os.listdir(src_dir)):
        if fname.endswith(".pdf") and fname not in ordered_files and not fname.endswith("_Full.pdf"):
            fpath = os.path.join(src_dir, fname)
            sub_doc = fitz.open(fpath)
            combined.insert_pdf(sub_doc)
            merged_count += 1
            print(f"  [+] Merged extra: {fname} ({len(sub_doc)} pages)")

    if merged_count == 0:
        print("[Warning] No PDFs found to merge.")
        return False

    combined.save(out_path)
    print(f"\n[Success] Successfully bundled {merged_count} files into:\n  => '{out_path}'\n  => Total pages: {len(combined)}")
    return True

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="TrustCV Pitch PDF Merger & Bundler")
    parser.add_argument("-s", "--src", default="E:/Projects/TrustCV/proposals/2026_taiwan_india_compute_pitch", help="Source pitch directory")
    parser.add_argument("-o", "--out", default="E:/Projects/TrustCV/assets/pdf/TrustCV_Taiwan_India_Compute_Pitch_Full.pdf", help="Output merged PDF path")
    args = parser.parse_args()

    merge_pitch_pdfs(args.src, args.out)
