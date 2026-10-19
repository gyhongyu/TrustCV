#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TrustCV UI Audit Gatekeeper (.agents/scripts/ui_audit_gatekeeper.py)
Automated Quality Gate for:
1. Pure Language Invariant: Detect mixed zh/en, bracketed translations, unlocalized UI strings.
2. Icon-only Button Standard: Detect verbose / redundant text or unnecessary hidden text in utility & navigation buttons.
"""

import sys
import os
import re
from pathlib import Path

# Set root directory
ROOT_DIR = Path(__file__).resolve().parent.parent.parent

# Forbidden mixed-language bracket patterns, e.g. "認證 (Verified)" or "信任階梯 · Trust Ladder"
# Except standard HTML comments, scripts, or specific acceptable tech terms (e.g. PLC, AICTE, MCA)
MIXED_BRACKET_REGEX = re.compile(r'([\u4e00-\u9fa5]{2,}\s*[\(（][A-Za-z\s]+[\)）])|([A-Za-z]{3,}\s*[\(（][\u4e00-\u9fa5]+[\)）])')

# Navigation buttons that MUST remain pure icon-only (no verbose text like "◀ Prev", "Next ▶", "上一頁")
ICON_ONLY_BTN_IDS = {'prevBtn', 'nextBtn', 'toggleFullscreenBtn', 'themeToggleBtn', 'downloadPitchBtn', 'closeModalBtn'}

def audit_file_content(filepath: Path):
    rel_path = filepath.relative_to(ROOT_DIR)
    content = filepath.read_text(encoding='utf-8', errors='ignore')
    violations = []

    # 1. Check for Mixed Language Anti-Patterns in UI text (excluding code/comments/meta)
    lines = content.splitlines()
    for idx, line in enumerate(lines, 1):
        # Ignore comments and scripts
        stripped = line.strip()
        if stripped.startswith('<!--') or stripped.startswith('//') or stripped.startswith('*'):
            continue
        if '<script' in line or '</script>' in line or '<style' in line or '</style>' in line:
            continue
        
        # Check bracketed mixed translations
        match = MIXED_BRACKET_REGEX.search(line)
        if match:
            # Check if this line is an intentional dual title attribute or markdown
            if 'title=' not in line and 'placeholder=' not in line:
                violations.append({
                    'type': 'MIXED_LANGUAGE',
                    'line': idx,
                    'text': match.group(0),
                    'detail': f'Found mixed zh/en bracket pair: "{match.group(0)}". Strictly use pure zh or pure en containers.'
                })

    # 2. Check for Verbose Button Text in Icon-Only Buttons
    for btn_id in ICON_ONLY_BTN_IDS:
        # Check in HTML button definitions
        btn_pattern = re.compile(rf'<button[^>]*id=["\']{btn_id}["\'][^>]*>(.*?)</button>', re.DOTALL)
        for m in btn_pattern.finditer(content):
            inner = m.group(1).strip()
            # Remove svg tags and comments
            text_without_svg = re.sub(r'<svg[^>]*>.*?</svg>', '', inner, flags=re.DOTALL)
            text_without_tags = re.sub(r'<[^>]+>', '', text_without_svg).strip()
            # If there is lingering visible or hidden text
            if text_without_tags:
                violations.append({
                    'type': 'VERBOSE_BUTTON_TEXT',
                    'line': content[:m.start()].count('\n') + 1,
                    'text': text_without_tags,
                    'detail': f'Button #{btn_id} contains verbose text "{text_without_tags}". Must be pure icon-only with native title attribute.'
                })

        # Check in JS dynamic text injection (e.g. prevBtn.textContent = '...')
        js_text_injection = re.compile(rf'{btn_id}\.(textContent|innerText|innerHTML)\s*=\s*[\'"`](.*?)[\'"`]')
        for m in js_text_injection.finditer(content):
            injected_val = m.group(2).strip()
            # If injecting text instead of pure SVG/empty
            if injected_val and not injected_val.startswith('<svg') and not injected_val == '':
                violations.append({
                    'type': 'VERBOSE_BUTTON_JS_INJECTION',
                    'line': content[:m.start()].count('\n') + 1,
                    'text': injected_val,
                    'detail': f'JS dynamically injects text "{injected_val}" into #{btn_id}. Must remain pure icon-only without text manipulation.'
                })

    return rel_path, violations

def run_audit():
    print("=" * 60)
    print("🛡️  TrustCV UI & Language Gatekeeper Audit")
    print("=" * 60)

    target_files = [
        ROOT_DIR / 'proposal.html',
        ROOT_DIR / 'index.html',
        ROOT_DIR / 'privacy.html'
    ]

    total_violations = 0

    for tf in target_files:
        if not tf.exists():
            continue
        rel, issues = audit_file_content(tf)
        if issues:
            print(f"\n❌ [FAIL] {rel} ({len(issues)} violations found):")
            for iss in issues:
                print(f"   - L{iss['line']} [{iss['type']}]: {iss['detail']}")
                total_violations += len(issues)
        else:
            print(f"✅ [PASS] {rel}: 100% compliant with i18n & button icon-only standards.")

    print("\n" + "=" * 60)
    if total_violations > 0:
        print(f"🚨 Audit Finished with {total_violations} VIOLATION(S). Please resolve immediately!")
        return 1
    else:
        print("🎉 All UI & Language Invariants Verified Clean. Ready for delivery.")
        return 0

if __name__ == '__main__':
    sys.exit(run_audit())
