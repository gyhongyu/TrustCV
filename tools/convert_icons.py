import fitz  # PyMuPDF
import os
from PIL import Image

from playwright.sync_api import sync_playwright

def render_svg_to_png_browser(browser_page, svg_path, out_png_path, width, height):
    with open(svg_path, "r", encoding="utf-8") as f:
        svg_content = f.read()
    
    # HTML wrapper ensuring SVG fits the viewport perfectly with no scrollbars or margins
    html = f"""<!DOCTYPE html>
<html>
<head>
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  html, body {{ width: 100%; height: 100%; overflow: hidden; background: transparent; }}
  svg {{ width: 100vw; height: 100vh; display: block; }}
</style>
</head>
<body>
{svg_content}
</body>
</html>"""
    browser_page.set_viewport_size({"width": width, "height": height})
    browser_page.set_content(html)
    os.makedirs(os.path.dirname(out_png_path), exist_ok=True)
    browser_page.screenshot(path=out_png_path, omit_background=True)
    print(f"Generated via Chromium: {out_png_path} ({width}x{height})")


def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    svg_icon_path = os.path.join(base_dir, "assets", "svg", "手機安裝後icon.svg")
    svg_favicon_path = os.path.join(base_dir, "assets", "svg", "PC 瀏覽器標籤頁專用圖標代碼.svg")
    
    icons_dir = os.path.join(base_dir, "assets", "icons")
    os.makedirs(icons_dir, exist_ok=True)
    
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # 1. assets/icons/icon-512x512.png
        p512 = os.path.join(icons_dir, "icon-512x512.png")
        render_svg_to_png_browser(page, svg_icon_path, p512, 512, 512)
        
        # 2. assets/icons/icon-192x192.png
        p192 = os.path.join(icons_dir, "icon-192x192.png")
        render_svg_to_png_browser(page, svg_icon_path, p192, 192, 192)
        
        # 3. assets/icons/apple-touch-icon.png (180x180)
        p180 = os.path.join(icons_dir, "apple-touch-icon.png")
        render_svg_to_png_browser(page, svg_icon_path, p180, 180, 180)
        
        # 4. Generate favicon.ico at root and inside assets/
        fav_png_64 = os.path.join(icons_dir, "favicon-64x64.png")
        render_svg_to_png_browser(page, svg_favicon_path, fav_png_64, 64, 64)

        fav_png_32 = os.path.join(icons_dir, "favicon-32x32.png")
        render_svg_to_png_browser(page, svg_favicon_path, fav_png_32, 32, 32)
        
        fav_png_16 = os.path.join(icons_dir, "favicon-16x16.png")
        render_svg_to_png_browser(page, svg_favicon_path, fav_png_16, 16, 16)

        browser.close()
        
    # Use Pillow to pack into .ico (including 16, 32, 48/64)
    img64 = Image.open(fav_png_64)
    img32 = Image.open(fav_png_32)
    img16 = Image.open(fav_png_16)
    
    root_ico = os.path.join(base_dir, "favicon.ico")
    assets_ico = os.path.join(icons_dir, "favicon.ico")
    
    img64.save(root_ico, format="ICO", sizes=[(16, 16), (32, 32), (64, 64)], append_images=[img32, img16])
    img64.save(assets_ico, format="ICO", sizes=[(16, 16), (32, 32), (64, 64)], append_images=[img32, img16])
    print(f"Generated: {root_ico}")
    print(f"Generated: {assets_ico}")

if __name__ == "__main__":
    main()
