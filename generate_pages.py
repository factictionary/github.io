#!/usr/bin/env python3
"""
Generate SEO-friendly HTML pages from .dat fact files
Creates hyphenated URL slugs from headlines
"""

import json
import re
import os
import shutil
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional
import unicodedata

# ─── CONFIG ──────────────────────────────────────────────────────────
SITE_URL = "https://factictionary.in"
FACTS_DIR = Path("facts")
DATA_DIR = Path("data")
FACTS_CACHE_DIR = DATA_DIR / "facts"

# ─── EXTENSION HANDLING ─────────────────────────────────────────────
FILE_EXTENSION = ".dat"  # Change this if your files use a different extension

def is_fact_file(filename: Path) -> bool:
    """Check if a file is a fact file (ends with .dat or .json)"""
    return filename.suffix.lower() in ['.dat', '.json']

def get_fact_files(source_dir: Path) -> List[Path]:
    """Get all fact files from source directory (recursively)"""
    fact_files = []
    
    # Look for .dat and .json files
    for ext in ['.dat', '.json']:
        fact_files.extend(source_dir.glob(f'**/*{ext}'))
    
    return sorted(fact_files)

# ─── REST OF THE SCRIPT (same as before) ───────────────────────────

def slugify(text: str) -> str:
    """
    Convert headline to URL-friendly hyphenated slug
    "Unsung Inc. Unveils SmartFridge!" → "unsung-inc-unveils-smartfridge"
    """
    # Normalize unicode characters
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    # Convert to lowercase and replace spaces/special chars with hyphens
    slug = re.sub(r'[^\w\s-]', '', text).strip().lower()
    slug = re.sub(r'[-\s]+', '-', slug)
    # Remove duplicate hyphens
    slug = re.sub(r'-+', '-', slug)
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    return slug

def escape_html(text: str) -> str:
    """Escape HTML special characters"""
    if not text:
        return ''
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')

def escape_json(text: str) -> str:
    """Escape for JSON"""
    if not text:
        return ''
    return text.replace('\\', '\\\\').replace('"', '\\"')

def format_body(text: str) -> str:
    """Format full body with paragraphs"""
    if not text:
        return ''
    paragraphs = text.split('\n\n')
    return ''.join([f'<p>{escape_html(p)}</p>' for p in paragraphs if p.strip()])

def generate_html_page(fact: Dict, filename: str) -> str:
    """Generate full HTML page for a single fact"""
    
    headline = fact.get('headline', 'Untitled')
    summary = fact.get('summary', '')
    full_body = fact.get('fullBody', '')
    image_url = fact.get('imageUrl', '')
    category = fact.get('category', 'general')
    published_at = fact.get('publishedAt', '')
    read_time = fact.get('readTimeSeconds', 0)
    tags = fact.get('tags', [])
    is_breaking = fact.get('isBreaking', False)
    fact_id = fact.get('id', '')
    
    # Generate slug for URL
    slug = slugify(headline)
    
    # Build HTML
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{escape_html(headline)} | SpoofDaily</title>
    <meta name="description" content="{escape_html(summary[:160])}" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="{escape_html(headline)}" />
    <meta property="og:description" content="{escape_html(summary[:160])}" />
    <meta property="og:image" content="{escape_html(image_url)}" />
    <meta property="og:url" content="{SITE_URL}/spoof/{filename}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="SpoofDaily" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{escape_html(headline)}" />
    <meta name="twitter:description" content="{escape_html(summary[:160])}" />
    <meta name="twitter:image" content="{escape_html(image_url)}" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="{SITE_URL}/spoof/{filename}" />
    
    <style>
        /* ── Minimal styles ── */
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Georgia, serif;
            background: #0a0a12;
            color: #f0f0f5;
            line-height: 1.6;
            padding: 20px;
        }}
        .container {{ max-width: 800px; margin: 0 auto; }}
        .back-link {{
            display: inline-block;
            margin-bottom: 20px;
            color: #e94560;
            text-decoration: none;
        }}
        .back-link:hover {{ text-decoration: underline; }}
        .image {{ width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; margin-bottom: 20px; background: #1a1a2e; }}
        .badge {{
            display: inline-block;
            padding: 4px 14px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            background: #e94560;
            color: #fff;
            margin-bottom: 12px;
        }}
        .badge.breaking {{ background: #ff4444; animation: pulse 1.5s infinite; }}
        @keyframes pulse {{ 50% {{ opacity: 0.5; }} }}
        h1 {{ font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800; margin-bottom: 12px; }}
        .summary {{ color: #b0b0c8; font-style: italic; border-left: 3px solid #e94560; padding-left: 16px; margin-bottom: 20px; }}
        .body {{ color: #b0b0c8; line-height: 1.8; }}
        .body p {{ margin-bottom: 16px; }}
        .meta {{
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #2a2a4a;
            font-size: 13px;
            color: #6a6a8a;
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
        }}
        .tag {{
            display: inline-block;
            padding: 2px 10px;
            border-radius: 12px;
            background: #1a1a2e;
            color: #b0b0c8;
            font-size: 11px;
        }}
        .structured-data {{
            display: none;
        }}
        .footer {{
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #2a2a4a;
            text-align: center;
            font-size: 13px;
            color: #6a6a8a;
        }}
        .footer a {{ color: #e94560; text-decoration: none; }}
    </style>
    
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "{escape_json(headline)}",
        "description": "{escape_json(summary[:160])}",
        "image": "{escape_json(image_url)}",
        "url": "{SITE_URL}/spoof/{filename}",
        "datePublished": "{datetime.now().isoformat()}",
        "publisher": {{
            "@type": "Organization",
            "name": "SpoofDaily"
        }}
    }}
    </script>
</head>
<body>
    <div class="container">
        <a href="/" class="back-link">← Back to SpoofDaily</a>
        
        {f'<div class="badge breaking">🔴 Breaking</div>' if is_breaking else ''}
        
        {f'<img class="image" src="{escape_html(image_url)}" alt="{escape_html(headline)}" loading="lazy" />' if image_url else ''}
        
        <h1>{escape_html(headline)}</h1>
        
        {f'<div class="summary">{escape_html(summary)}</div>' if summary else ''}
        
        <div class="body">{format_body(full_body)}</div>
        
        <div class="meta">
            {f'<span>📅 {escape_html(published_at)}</span>' if published_at else ''}
            {f'<span>⏱️ {read_time}s read</span>' if read_time else ''}
            {''.join([f'<span class="tag">#{escape_html(t)}</span>' for t in tags])}
        </div>
        
        <div class="footer">
            <p>© 2024-2025 <a href="/">SpoofDaily</a> — Satirical news for the discerning reader</p>
        </div>
    </div>
</body>
</html>'''

def generate_all_pages(facts_source_dir: Path, output_dir: Path):
    """Generate all HTML pages from .dat files and update data files"""
    
    # Create output directories
    facts_output_dir = output_dir / FACTS_DIR
    facts_output_dir.mkdir(parents=True, exist_ok=True)
    
    facts_cache_dir = output_dir / FACTS_CACHE_DIR
    facts_cache_dir.mkdir(parents=True, exist_ok=True)
    
    # Get all fact files (recursively)
    fact_files = get_fact_files(facts_source_dir)
    
    if not fact_files:
        print(f"⚠️ No .dat or .json files found in {facts_source_dir}")
        return
    
    sitemap_entries = []
    index_entries = []
    
    for file_path in fact_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                # Handle both .dat and .json files
                content = f.read()
                fact = json.loads(content)
        except json.JSONDecodeError as e:
            print(f"⚠️ Error parsing {file_path.name}: {e}")
            continue
        
        # Get ID from filename (without extension)
        fact_id = file_path.stem  # This removes .dat or .json
        if not fact.get('id'):
            fact['id'] = fact_id
        
        # Generate slug and filename
        slug = slugify(fact.get('headline', fact_id))
        html_filename = f"{slug}.html"
        
        # Generate HTML
        html_content = generate_html_page(fact, html_filename)
        html_path = facts_output_dir / html_filename
        html_path.write_text(html_content, encoding='utf-8')
        
        # Cache JSON data for carousel (always save as .json)
        json_cache_path = facts_cache_dir / f"{fact_id}.json"
        with open(json_cache_path, 'w', encoding='utf-8') as f:
            json.dump(fact, f, indent=2, ensure_ascii=False)
        
        # Track for sitemap
        sitemap_entries.append(f"{SITE_URL}/spoof/{html_filename}")
        index_entries.append(f"{fact_id}.json")
        
        print(f"✅ Generated: {html_filename} from {file_path.name}")
    
    # ─── Update index.json for carousel ──────────────────────────
    index_path = output_dir / DATA_DIR / "index.json"
    index_path.parent.mkdir(parents=True, exist_ok=True)
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(index_entries, f, indent=2, ensure_ascii=False)
    
    # ─── Generate sitemap.xml ────────────────────────────────────
    sitemap_path = output_dir / "sitemap.xml"
    with open(sitemap_path, 'w', encoding='utf-8') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for url in sitemap_entries:
            f.write(f'  <url><loc>{url}</loc></url>\n')
        f.write('</urlset>\n')
    
    # ─── robots.txt ──────────────────────────────────────────────
    robots_path = output_dir / "robots.txt"
    robots_path.write_text(f'''User-agent: *
Allow: /
Sitemap: {SITE_URL}/sitemap.xml
''')
    
    print(f"\n✅ Generated {len(fact_files)} pages")
    print(f"📄 Sitemap: {sitemap_path}")
    print(f"📄 Index: {index_path}")

# ─── MAIN ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 3:
        print("Usage: python generate_pages.py <source_dir> <output_dir>")
        print("Example: python generate_pages.py temp-news/facts website/")
        sys.exit(1)
    
    source_dir = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])
    
    if not source_dir.exists():
        print(f"❌ Source directory not found: {source_dir}")
        sys.exit(1)
    
    generate_all_pages(source_dir, output_dir)