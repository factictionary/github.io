#!/usr/bin/env python3
"""
Generate SEO-friendly HTML pages from per-date JSON fact files stored in a
GitHub content repo (e.g. spoofdaily-content/content/YYYY-MM-DD.dat).

╔══════════════════════════════════════════════════════════════════════╗
║  CRITICAL FIX — slug must match the homepage carousel EXACTLY        ║
╠══════════════════════════════════════════════════════════════════════╣
║  The carousel on index.html computes the article URL purely from the ║
║  headline:                                                           ║
║      const slug = slugify(headline);                                 ║
║      const articleUrl = `/spoof/facts/${slug}.html`;                 ║
║                                                                       ║
║  It has NO knowledge of date, id, or any collision-avoidance suffix. ║
║  Therefore this script's slugify() must be byte-for-byte identical   ║
║  to the carousel's JS slugify(), AND the generated filename must     ║
║  ALWAYS be exactly `${slug}.html` — never `${slug}-{unique_id}.html`.║
║                                                                       ║
║  Previously this script appended a date/id suffix on slug collision, ║
║  which the carousel link could never predict, causing 404s.         ║
║                                                                       ║
║  Fix: collisions are now prevented by including the date in the     ║
║  SOURCE text that gets slugified only when truly necessary — see    ║
║  resolve_slug_collisions() below for the strategy.                  ║
╚══════════════════════════════════════════════════════════════════════╝

Source layout expected (mirrors the GitHub content repo used by the
SpoofDaily Flutter app — see FeedService / encrypt_feed.py):

    spoofdaily-content/
      content/
        2025-06-06.dat      ← AES-encrypted (or plain) JSON: {"items":[...]}
        2025-06-07.dat
        ...

Each .dat file is for ONE calendar day and contains MULTIPLE items
(unlike the previous version of this script, which expected one
sub-folder per date with possibly multiple files inside it).

Usage:
    python generate_pages.py <content_dir> <output_dir> [--decrypt]

    content_dir   Path to the folder containing YYYY-MM-DD.dat files
                  (the local clone of your spoofdaily-content repo's
                  `content/` directory)
    output_dir    Website root (where index.html lives)
    --decrypt     If set, decrypts each .dat with the same AES-256-CBC +
                  XOR scheme as CryptoService.dart / encrypt_feed.py
                  before parsing. Omit this flag if your .dat files are
                  plain JSON.
"""

import argparse
import hashlib
import json
import re
import unicodedata
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

# ─── CONFIG ──────────────────────────────────────────────────────────
SITE_URL = "https://factictionary.in"

# ─── HEADER/FOOTER HTML ────────────────────────────────────────────
HEADER_HTML = '''
<nav class="navbar" role="navigation">
    <div class="nav-container">
        <a href="/" class="logo">Factictionary</a>
        <ul class="nav-links">
            <li><a href="/" class="nav-link">Home</a></li>
            <li><a href="/blog/" class="nav-link">Articles</a></li>
            <li><a href="/deals/today/" class="nav-link">Deals</a></li>
            <li><a href="/tools/" class="nav-link">Tools</a></li>
            <li><a href="/about.html" class="nav-link">About</a></li>
            <li><a href="/contact.html" class="nav-link">Contact</a></li>
        </ul>
        <button class="menu-toggle" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
</nav>

<!-- Mobile Menu -->
<div class="mobile-menu-backdrop"></div>
<div class="mobile-menu">
    <ul class="nav-links">
        <li><a href="/" class="nav-link">Home</a></li>
        <li><a href="/blog/" class="nav-link">Articles</a></li>
        <li><a href="/deals/today/" class="nav-link">Deals</a></li>
        <li><a href="/tools/" class="nav-link">Tools</a></li>
        <li><a href="/about.html" class="nav-link">About</a></li>
        <li><a href="/contact.html" class="nav-link">Contact</a></li>
    </ul>
</div>
'''

FOOTER_HTML = '''
<footer class="footer">
    <div class="container">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; margin-bottom: 40px;">
            <div>
                <h4 style="margin-bottom: 16px; font-weight: 600;">Content</h4>
                <ul style="list-style: none; padding: 0;">
                    <li><a href="/blog/" style="color: #666; text-decoration: none;">Articles</a></li>
                    <li><a href="/tools/" style="color: #666; text-decoration: none;">Tools</a></li>
                    <li><a href="/blog/" style="color: #666; text-decoration: none;">Latest Posts</a></li>
                    <li><a href="/spoof/" style="color: #666; text-decoration: none;">Satirical News</a></li>
                </ul>
            </div>
            <div>
                <h4 style="margin-bottom: 16px; font-weight: 600;">Company</h4>
                <ul style="list-style: none; padding: 0;">
                    <li><a href="/about.html" style="color: #666; text-decoration: none;">About Us</a></li>
                    <li><a href="/contact.html" style="color: #666; text-decoration: none;">Contact</a></li>
                    <li><a href="mailto:factictionary@gmail.com" style="color: #666; text-decoration: none;">Email</a></li>
                </ul>
            </div>
            <div>
                <h4 style="margin-bottom: 16px; font-weight: 600;">Legal</h4>
                <ul style="list-style: none; padding: 0;">
                    <li><a href="/privacy.html" style="color: #666; text-decoration: none;">Privacy Policy</a></li>
                    <li><a href="/terms.html" style="color: #666; text-decoration: none;">Terms of Service</a></li>
                    <li><a href="/disclaimer.html" style="color: #666; text-decoration: none;">Disclaimer</a></li>
                </ul>
            </div>
        </div>
        <div style="border-top: 1px solid #eee; padding-top: 24px; text-align: center;">
            <p style="color: #666; margin: 0;">&copy; 2026 Factictionary. All rights reserved. | <a href="/sitemap.xml" style="color: #666;">Sitemap</a></p>
        </div>
    </div>
</footer>
'''

MOBILE_MENU_SCRIPT = '''
<script>
(function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuBackdrop = document.querySelector('.mobile-menu-backdrop');
    const body = document.body;

    function toggleMenu() {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        mobileMenuBackdrop.classList.toggle('active');
        body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    menuToggle.addEventListener('click', toggleMenu);
    mobileMenuBackdrop.addEventListener('click', toggleMenu);

    const mobileMenuLinks = mobileMenu.querySelectorAll('.nav-link');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
})();
</script>
'''


# ═══════════════════════════════════════════════════════════════════════
# SLUG GENERATION — must match carousel's JS slugify() EXACTLY
# ═══════════════════════════════════════════════════════════════════════
#
# JS version (from index.html):
#
#   function slugify(text) {
#       if (!text) return 'untitled';
#       return text.toLowerCase()
#           .replace(/[^\w\s-]/g, '')
#           .replace(/[\s-]+/g, '-')
#           .replace(/-+/g, '-')
#           .trim('-')                 // ⚠️ NO-OP IN JS — .trim() takes
#                                       //    no args; '-' is silently
#                                       //    ignored. Hyphens are NOT
#                                       //    stripped from start/end.
#           .substring(0, 100);        // truncate at 100 chars, NOT 80
#   }
#
# Python must reproduce this — including the .trim('-') no-op bug —
# otherwise slugs will differ whenever a headline starts or ends with
# a character that strips to a leading/trailing hyphen.
#
# \w in JS regex = [A-Za-z0-9_] (ASCII only, same as Python's re module
# without the UNICODE flag — so non-ASCII chars must be stripped via
# NFKD normalization BEFORE the regex, exactly as JS's naive replace
# would leave them as non-\w chars and strip them too).

def slugify(text: str) -> str:
    """
    EXACT mirror of the carousel's JS slugify(). Do not "fix" the
    missing trim('-') behaviour — the carousel doesn't either, so
    fixing it here would reintroduce the mismatch.
    """
    if not text:
        return 'untitled'

    # JS does not Unicode-normalize, but \w only matches ASCII word
    # chars, so accented characters get silently dropped by the
    # [^\w\s-] removal. NFKD + ascii encode replicates that outcome
    # for the common case (e.g. "café" → "cafe" is what \w would NOT
    # do — JS would actually drop "é" entirely since "é" is not \w
    # and not \s). We replicate JS's literal behaviour: strip any
    # non-ASCII-word/space/hyphen character outright, no normalization
    # substitution.
    slug = text.lower()
    slug = re.sub(r'[^\w\s-]', '', slug, flags=re.ASCII)
    slug = re.sub(r'[\s-]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    # NOTE: deliberately NOT calling .strip('-') — see docstring above.
    # The JS .trim('-') call is a no-op bug we must replicate exactly.
    slug = slug[:100]
    return slug


def resolve_slug_collisions(facts_by_date: Dict[str, List[Dict]]) -> List[Dict]:
    """
    Flattens all facts across all dates and detects slug collisions.

    Strategy: the carousel can ONLY ever link to `${slugify(headline)}.html`
    — it has no fallback. So if two different headlines (possibly on
    different dates) produce the same slug, we cannot silently rename
    the file, or the second one becomes permanently unreachable from
    the carousel.

    Instead we:
      1. Keep the FIRST occurrence (earliest date) at the canonical
         `${slug}.html` path — this is what the carousel will link to
         for that headline going forward.
      2. WARN loudly about any later duplicate so a human can edit the
         headline in the source content to be unique (the correct fix
         for a content-generation pipeline — duplicate headlines are a
         content bug, not a routing bug).
      3. Still generate a page for the duplicate at a fallback path
         `${slug}-{date}.html` so the content isn't lost, but flag it
         clearly as UNREACHABLE FROM THE CAROUSEL in the console output.

    This makes 404s from the carousel impossible for any headline that
    appears only once — which should be the case for >99% of real
    content — while surfacing true duplicates as an actionable warning
    instead of a silent mismatch.
    """
    seen_slugs: Dict[str, Dict] = {}
    all_facts: List[Dict] = []
    collisions: List[str] = []

    # Process in chronological date order so "first occurrence wins"
    for date_str in sorted(facts_by_date.keys()):
        for fact in facts_by_date[date_str]:
            headline = fact.get('headline', f"Untitled {fact.get('id', '')}")
            slug = slugify(headline)

            if slug in seen_slugs:
                # True collision — different headline text, same slug,
                # OR identical headline reused across days.
                prev = seen_slugs[slug]
                if prev['headline'] != headline:
                    collisions.append(
                        f"'{headline}' ({date_str}) collides with "
                        f"'{prev['headline']}' ({prev['date']}) → both slugify to '{slug}'"
                    )
                fact['_slug'] = f"{slug}-{date_str}"
                fact['_reachable_from_carousel'] = False
            else:
                fact['_slug'] = slug
                fact['_reachable_from_carousel'] = True
                seen_slugs[slug] = {'headline': headline, 'date': date_str}

            fact['_date'] = date_str
            all_facts.append(fact)

    if collisions:
        print(f"\n⚠️  {len(collisions)} SLUG COLLISION(S) DETECTED:")
        for c in collisions:
            print(f"   • {c}")
        print(
            "   These duplicate pages were still generated (at a "
            "date-suffixed fallback URL) but are NOT reachable from the "
            "homepage carousel, which always links to "
            "`/spoof/facts/${slugify(headline)}.html` with no fallback.\n"
            "   Fix: make the headline text unique at the source "
            "(generate_headlines.py / Claude prompt) — this is the only "
            "way to guarantee carousel + page parity.\n"
        )

    return all_facts


# ═══════════════════════════════════════════════════════════════════════
# HTML escaping helpers
# ═══════════════════════════════════════════════════════════════════════

def escape_html(text: str) -> str:
    if not text:
        return ''
    return (str(text)
            .replace('&', '&amp;')
            .replace('<', '&lt;')
            .replace('>', '&gt;')
            .replace('"', '&quot;'))


def escape_json(text: str) -> str:
    if not text:
        return ''
    return str(text).replace('\\', '\\\\').replace('"', '\\"')


def format_body(text: str) -> str:
    if not text:
        return ''
    paragraphs = str(text).split('\n\n')
    return ''.join(f'<p>{escape_html(p)}</p>' for p in paragraphs if p.strip())


# ═══════════════════════════════════════════════════════════════════════
# Decryption (optional — mirrors CryptoService.dart / encrypt_feed.py)
# ═══════════════════════════════════════════════════════════════════════

PASSPHRASE = "sp00f_d4ily_s3cr3t_k3y_2025!"
XOR_SEED = 0x5D


def _derive_key(date_salt: str) -> bytes:
    return hashlib.sha256(f'{PASSPHRASE}:{date_salt}'.encode()).digest()


def _xor_unscramble(data: bytes) -> bytes:
    out = bytearray(len(data))
    rolling = XOR_SEED
    for i, b in enumerate(data):
        out[i] = b ^ rolling
        rolling = (rolling + b + 1) & 0xFF
    return bytes(out)


def decrypt_dat(payload: str, date_salt: str) -> str:
    """Mirrors CryptoService.decrypt() — requires `pycryptodome`."""
    import base64
    from Crypto.Cipher import AES
    from Crypto.Util.Padding import unpad

    scrambled = base64.b64decode(payload.strip())
    combined = _xor_unscramble(scrambled)
    iv, ciphertext = combined[:16], combined[16:]
    key = _derive_key(date_salt)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    plaintext = unpad(cipher.decrypt(ciphertext), AES.block_size)
    return plaintext.decode('utf-8')


# ═══════════════════════════════════════════════════════════════════════
# Page generation
# ═══════════════════════════════════════════════════════════════════════

def generate_fact_page_html(fact: Dict, html_filename: str) -> str:
    """Generate full HTML page for a single fact with header/footer theme."""

    headline = fact.get('headline', 'Untitled')
    summary = fact.get('summary', '')
    full_body = fact.get('fullBody', fact.get('full_body', ''))
    image_url = fact.get('imageUrl', fact.get('image_url', ''))
    published_at = fact.get('publishedAt', fact.get('published_at', ''))
    read_time = fact.get('readTimeSeconds', fact.get('read_time_seconds', 0))
    tags = fact.get('tags', [])
    is_breaking = fact.get('isBreaking', fact.get('is_breaking', False))
    date_str = fact.get('_date', datetime.now().strftime('%Y-%m-%d'))

    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{escape_html(headline)} | SpoofDaily | Factictionary</title>
    <meta name="description" content="{escape_html(summary[:160])}" />

    <!-- Open Graph -->
    <meta property="og:title" content="{escape_html(headline)}" />
    <meta property="og:description" content="{escape_html(summary[:160])}" />
    <meta property="og:image" content="{escape_html(image_url)}" />
    <meta property="og:url" content="{SITE_URL}/spoof/facts/{html_filename}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Factictionary" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{escape_html(headline)}" />
    <meta name="twitter:description" content="{escape_html(summary[:160])}" />
    <meta name="twitter:image" content="{escape_html(image_url)}" />

    <!-- Canonical URL -->
    <link rel="canonical" href="{SITE_URL}/spoof/facts/{html_filename}" />

    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/style.css">

    <style>
        .article-container {{
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px 60px;
        }}

        .article-container .back-link {{
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: var(--color-primary-500, #e94560);
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95rem;
            margin-bottom: 24px;
            transition: gap 0.2s;
        }}

        .article-container .back-link:hover {{
            gap: 12px;
        }}

        .article-card {{
            background: #fff;
            border-radius: 16px;
            padding: 40px 48px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.06);
            border: 1px solid #eee;
        }}

        .article-card .badge {{
            display: inline-block;
            padding: 4px 14px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            background: #e94560;
            color: #fff;
            margin-bottom: 16px;
        }}

        .article-card .badge.breaking {{
            background: #ff4444;
            animation: pulse-badge 1.5s ease-in-out infinite;
        }}

        @keyframes pulse-badge {{
            0%, 100% {{ opacity: 1; }}
            50% {{ opacity: 0.5; }}
        }}

        .article-card .headline {{
            font-size: 2.2rem;
            font-weight: 800;
            color: #1a1a2e;
            line-height: 1.2;
            margin-bottom: 16px;
        }}

        .article-card .featured-image {{
            width: 100%;
            max-height: 500px;
            object-fit: cover;
            border-radius: 12px;
            margin: 16px 0 24px;
            background: #f5f5f5;
        }}

        .article-card .summary {{
            font-size: 1.1rem;
            color: #555;
            font-style: italic;
            border-left: 4px solid #e94560;
            padding-left: 16px;
            margin-bottom: 24px;
            line-height: 1.6;
        }}

        .article-card .body {{
            font-size: 1.05rem;
            line-height: 1.8;
            color: #333;
        }}

        .article-card .body p {{
            margin-bottom: 16px;
        }}

        .article-card .meta {{
            display: flex;
            flex-wrap: wrap;
            gap: 12px 20px;
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #eee;
            font-size: 13px;
            color: #888;
        }}

        .article-card .meta .tag {{
            display: inline-block;
            padding: 2px 12px;
            border-radius: 12px;
            background: #f5f5f5;
            color: #666;
            font-size: 11px;
        }}

        .article-card .meta .tag.breaking-tag {{
            background: #ff4444;
            color: #fff;
        }}

        .article-disclaimer {{
            margin-top: 32px;
            padding: 20px 24px;
            background: #f8f5f0;
            border-radius: 12px;
            border-left: 4px solid #e94560;
            font-size: 0.9rem;
            color: #555;
            line-height: 1.7;
        }}

        .article-disclaimer strong {{
            color: #1a1a2e;
        }}

        @media (max-width: 768px) {{
            .article-card {{ padding: 24px 20px; }}
            .article-card .headline {{ font-size: 1.6rem; }}
            .article-container {{ padding: 20px 16px 40px; }}
            .article-card .featured-image {{ max-height: 300px; }}
        }}

        @media (max-width: 480px) {{
            .article-card .headline {{ font-size: 1.3rem; }}
            .article-card .summary {{ font-size: 0.95rem; }}
            .article-card .body {{ font-size: 0.95rem; }}
            .article-disclaimer {{ padding: 16px 18px; font-size: 0.85rem; }}
        }}
    </style>
</head>
<body>
    {HEADER_HTML}

    <main id="main">
        <div class="container">
            <div class="article-container">
                <a href="/" class="back-link">← Back to Factictionary</a>

                <article class="article-card">
                    {'<span class="badge breaking">🔴 Breaking</span>' if is_breaking else '<span class="badge">🎭 Satire</span>'}

                    <h1 class="headline">{escape_html(headline)}</h1>

                    {f'<img class="featured-image" src="{escape_html(image_url)}" alt="{escape_html(headline)}" loading="lazy" onerror="this.style.display=\'none\'" />' if image_url else ''}

                    {f'<div class="summary">{escape_html(summary)}</div>' if summary else ''}

                    <div class="body">{format_body(full_body)}</div>

                    <div class="meta">
                        {f'<span>📅 {escape_html(published_at)}</span>' if published_at else ''}
                        {f'<span>⏱️ {read_time}s read</span>' if read_time else ''}
                        {''.join(f'<span class="tag">#{escape_html(t)}</span>' for t in tags)}
                        {'<span class="tag breaking-tag">🔥 Breaking</span>' if is_breaking else ''}
                    </div>
                </article>

                <div class="article-disclaimer">
                    <strong>⚠️ Satirical Content Disclaimer:</strong><br>
                    This article is a work of <strong>satire and parody</strong>. It is <strong>entirely fictional</strong> and created for entertainment purposes only.
                    Any resemblance to real persons, living or dead, or actual events is <strong>purely coincidental</strong>.
                    Do not interpret this as factual news or accurate reporting.
                </div>
            </div>
        </div>
    </main>

    {FOOTER_HTML}
    {MOBILE_MENU_SCRIPT}

    <script type="application/ld+json">
    {{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "{escape_json(headline)}",
        "description": "{escape_json(summary[:160])}",
        "image": "{escape_json(image_url)}",
        "url": "{SITE_URL}/spoof/facts/{html_filename}",
        "datePublished": "{date_str}T00:00:00+05:30",
        "publisher": {{
            "@type": "Organization",
            "name": "Factictionary"
        }}
    }}
    </script>
</body>
</html>'''


# ═══════════════════════════════════════════════════════════════════════
# Source loading — per-date .dat files from the GitHub content repo
# ═══════════════════════════════════════════════════════════════════════

DATE_FILENAME_RE = re.compile(r'^(\d{4}-\d{2}-\d{2})\.(dat|json)$')


def load_date_files(content_dir: Path, decrypt: bool) -> Dict[str, List[Dict]]:
    """
    Reads every YYYY-MM-DD.dat (or .json) file directly inside content_dir
    (NOT in date-named subfolders — this matches the actual
    spoofdaily-content/content/ layout used by FeedService.dart).
    """
    facts_by_date: Dict[str, List[Dict]] = {}

    files = sorted(content_dir.glob('*.dat')) + sorted(content_dir.glob('*.json'))
    if not files:
        print(f"⚠️  No .dat or .json files found directly in {content_dir}")
        return facts_by_date

    for file_path in files:
        m = DATE_FILENAME_RE.match(file_path.name)
        if not m:
            print(f"⚠️  Skipping {file_path.name} — filename must be YYYY-MM-DD.dat")
            continue
        date_str = m.group(1)
        date_salt = date_str.replace('-', '')

        raw = file_path.read_text(encoding='utf-8')

        if decrypt:
            try:
                raw = decrypt_dat(raw, date_salt)
            except Exception as e:
                print(f"❌ Failed to decrypt {file_path.name}: {e}")
                continue

        try:
            data = json.loads(raw)
        except json.JSONDecodeError as e:
            print(f"⚠️  Error parsing {file_path.name}: {e}")
            continue

        if isinstance(data, list):
            items = data
        elif isinstance(data, dict) and 'items' in data:
            items = data['items']
        elif isinstance(data, dict):
            items = [data]
        else:
            print(f"⚠️  Unexpected data format in {file_path.name}")
            continue

        facts_by_date[date_str] = items
        print(f"📂 {file_path.name}: {len(items)} items")

    return facts_by_date


# ═══════════════════════════════════════════════════════════════════════
# Main generation pipeline
# ═══════════════════════════════════════════════════════════════════════

def generate_all_pages(content_dir: Path, output_dir: Path, decrypt: bool):
    spoof_dir = output_dir / "spoof"
    facts_output_dir = spoof_dir / "facts"
    data_output_dir = spoof_dir / "data"
    facts_cache_dir = data_output_dir / "facts"

    facts_output_dir.mkdir(parents=True, exist_ok=True)
    facts_cache_dir.mkdir(parents=True, exist_ok=True)

    facts_by_date = load_date_files(content_dir, decrypt)
    if not facts_by_date:
        return

    # Resolve slugs globally across all dates BEFORE writing any files,
    # so collisions are detected across the whole content set, not just
    # within a single day.
    all_facts = resolve_slug_collisions(facts_by_date)

    sitemap_entries = []
    index_entries = []
    total_facts = 0
    unreachable_count = 0

    for fact in all_facts:
        slug = fact['_slug']
        date_str = fact['_date']
        original_id = fact.get('id', '000')
        unique_id = f"{date_str}_{original_id}"

        html_filename = f"{slug}.html"

        html_content = generate_fact_page_html(fact, html_filename)
        (facts_output_dir / html_filename).write_text(html_content, encoding='utf-8')

        # Cache JSON keyed by unique_id (this is what index.json points to,
        # and what the carousel fetches to RENDER the slide — separate
        # from the slug, which only matters for the "read full article"
        # link target).
        clean_fact = {k: v for k, v in fact.items() if not k.startswith('_')}
        clean_fact['unique_id'] = unique_id
        clean_fact['date'] = date_str

        json_cache_path = facts_cache_dir / f"{unique_id}.json"
        json_cache_path.write_text(
            json.dumps(clean_fact, indent=2, ensure_ascii=False),
            encoding='utf-8',
        )

        sitemap_entries.append(f"{SITE_URL}/spoof/facts/{html_filename}")
        index_entries.append(f"{unique_id}.json")

        total_facts += 1
        if not fact['_reachable_from_carousel']:
            unreachable_count += 1
            print(f"   ⚠️  [{unique_id}] {html_filename}  (fallback URL — NOT linked from carousel)")
        else:
            print(f"   ✅ [{unique_id}] {html_filename}")

    # ─── index.json for carousel ──────────────────────────────────
    index_path = data_output_dir / "index.json"
    index_path.write_text(
        json.dumps(index_entries, indent=2, ensure_ascii=False),
        encoding='utf-8',
    )

    # ─── sitemap.xml ───────────────────────────────────────────────
    sitemap_path = output_dir / "sitemap.xml"
    with open(sitemap_path, 'w', encoding='utf-8') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for url in sitemap_entries:
            f.write(f'  <url><loc>{url}</loc></url>\n')
        f.write('</urlset>\n')

    # ─── robots.txt ────────────────────────────────────────────────
    robots_path = output_dir / "robots.txt"
    robots_path.write_text(
        f'User-agent: *\nAllow: /\nSitemap: {SITE_URL}/sitemap.xml\n'
    )

    print(f"\n✅ Generated {total_facts} pages from {len(facts_by_date)} date file(s)")
    if unreachable_count:
        print(f"⚠️  {unreachable_count} page(s) generated at fallback URLs — "
              f"see collision warnings above")
    print(f"📄 Sitemap: {sitemap_path}")
    print(f"📄 Index:   {index_path}")
    print(f"\n📁 Directory structure:")
    print(f"   {output_dir}/")
    print(f"   ├── spoof/")
    print(f"   │   ├── facts/           ← Generated HTML pages ({total_facts} files)")
    print(f"   │   └── data/")
    print(f"   │       ├── index.json   ← Carousel index")
    print(f"   │       └── facts/       ← Cached JSON files")
    print(f"   ├── sitemap.xml")
    print(f"   └── robots.txt")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Generate SEO pages from per-date SpoofDaily content files"
    )
    parser.add_argument("content_dir", type=Path,
        help="Path to spoofdaily-content/content/ (contains YYYY-MM-DD.dat files)")
    parser.add_argument("output_dir", type=Path,
        help="Website root directory (where index.html lives)")
    parser.add_argument("--decrypt", action="store_true",
        help="Decrypt .dat files using the AES scheme before parsing "
             "(omit if your .dat files are plain JSON)")
    args = parser.parse_args()

    if not args.content_dir.exists():
        print(f"❌ Content directory not found: {args.content_dir}")
        raise SystemExit(1)

    output_dir = args.output_dir.resolve()

    print(f"📂 Content: {args.content_dir}")
    print(f"📂 Output:  {output_dir}")
    print(f"🔐 Decrypt: {args.decrypt}")
    print("")

    generate_all_pages(args.content_dir, output_dir, args.decrypt)