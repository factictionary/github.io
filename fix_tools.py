#!/usr/bin/env python3
"""Fix all HTML files in tools/ directory.
Fixes: unicode mojibake, nav, footer, conflicting styles, favicon.
"""

import os
import re
import glob

STANDARD_NAV = '''    <nav class="navbar" role="navigation">
        <div class="nav-container">
            <a href="/" class="logo">Factictionary</a>
            <ul class="nav-links">
                <li><a href="/blog/" class="nav-link">Articles</a></li>
                <li><a href="/glossary/" class="nav-link">Glossary</a></li>
                <li><a href="/tools/" class="nav-link active">Tools</a></li>
                <li><a href="/about.html" class="nav-link">About</a></li>
                <li><a href="/contact.html" class="nav-link">Contact</a></li>
            </ul>
        </div>
    </nav>'''

STANDARD_FOOTER = '''    <footer class="footer">
        <div class="container text-center">
            <p>&copy; 2026 Factictionary. Your Ultimate Guide to Tech, Wealth, and Modern Living.</p>
        </div>
    </footer>'''

# Mojibake replacements: read file as latin-1, replace, re-encode as utf-8
# Each tuple: (corrupted_latin1_string, correct_unicode_char_or_string)
MOJIBAKE_REPLACEMENTS = [
    # Hamburger menu
    ('â˜°', '☰'),
    # Lock
    ('ðŸ"'', '🔒'),
    # Refresh
    ('ðŸ"„', '🔄'),
    # Folder
    ('ðŸ"', '📁'),
    # Closed book
    ('ðŸ"•', '📕'),
    # Rocket
    ('ðŸš€', '🚀'),
    # Down arrow with variation selector
    ('â¬‡ï¸', '⬇️'),
    # Hourglass
    ('â³', '⏳'),
    # Check mark box
    ('âœ…', '✅'),
    # X mark
    ('âŒ', '❌'),
    # Check mark
    ('âœ"', '✔'),
    # Sparkles
    ('âœ¨', '✨'),
    # Wrench
    ('ðŸ"§', '🔧'),
    # Tools with variation selector
    ('ðŸ› ï¸', '🛠️'),
    # Music note
    ('ðŸŽµ', '🎵'),
    # Target
    ('ðŸŽ¯', '🎯'),
    # Bar chart
    ('ðŸ"Š', '📊'),
    # Lightning
    ('âš¡', '⚡'),
    # Video camera
    ('ðŸ"¹', '📹'),
    # Trash with variation selector
    ('ðŸ—'ï¸', '🗑️'),
    # Clipboard
    ('ðŸ"‹', '📋'),
    # Magnifying glass
    ('ðŸ"', '🔍'),
    # Books
    ('ðŸ"š', '📚'),
    # Timer with variation selector
    ('â±ï¸', '⏱️'),
    # Clamp with variation selector
    ('ðŸ—œï¸', '🗜️'),
    # Chart down
    ('ðŸ"‰', '📉'),
    # Chart up
    ('ðŸ"ˆ', '📈'),
    # Rewind with variation selector
    ('â®ï¸', '⏮️'),
    # Fast forward with variation selector
    ('â­ï¸', '⏭️'),
    # Play with variation selector
    ('â–¶ï¸', '▶️'),
    # Pause with variation selector
    ('â¸ï¸', '⏸️'),
    # Scissors with variation selector
    ('âœ‚ï¸', '✂️'),
    # Fire
    ('ðŸ"¥', '🔥'),
    # Up arrow with variation selector
    ('â¬†ï¸', '⬆️'),
    # Equivalence
    ('â‰¡', '≡'),
    # Multiplication sign
    ('Ã—', '×'),
    # Em dash
    ('â€"', '\u2014'),
    # Bullet
    ('â€¢', '\u2022'),
    # Left single quote
    ('â€˜', '\u2018'),
    # Right single quote
    ('â€™', '\u2019'),
    # Left double quote
    ('â€œ', '\u201C'),
    # Right double quote
    ('â€', '\u201D'),
    # Degree
    ('Â°', '°'),
    # Half
    ('Â½', '½'),
    # Middle dot
    ('Â·', '·'),
    # Right angle quote
    ('Â»', '»'),
    # Left angle quote
    ('Â«', '«'),
    # Microscope
    ('ðŸ"¬', '🔬'),
    # Telescope
    ('ðŸ"­', '🔭'),
    # Crystal ball
    ('ðŸ"®', '🔮'),
    # Postal horn
    ('ðŸ"¯', '📯'),
    # Newspaper
    ('ðŸ"°', '📰'),
    # Mobile phone
    ('ðŸ"±', '📱'),
    # Mobile phone with arrow
    ('ðŸ"²', '📲'),
    # Vibration mode
    ('ðŸ"³', '📳'),
    # Mobile phone off
    ('ðŸ"´', '📴'),
    # No mobile phones
    ('ðŸ"µ', '📵'),
    # Antenna bars
    ('ðŸ"¶', '📶'),
    # Camera
    ('ðŸ"·', '📷'),
    # Camera with flash
    ('ðŸ"¸', '📸'),
    # Television
    ('ðŸ"º', '📺'),
    # Radio
    ('ðŸ"»', '📻'),
    # Videocassette
    ('ðŸ"¼', '📼'),
    # Film projector
    ('ðŸ"½', '📽️'),
    # Ribbon
    ('ðŸŽ', '🎀'),
    # Birthday cake
    ('ðŸŽ‚', '🎂'),
    # Clapper board
    ('ðŸŽ¬', '🎬'),
    # Video game
    ('ðŸŽ®', '🎮'),
    # Musical score
    ('ðŸŽ¼', '🎼'),
    # Musical keyboard
    ('ðŸŽ¹', '🎹'),
    # Violin
    ('ðŸŽ»', '🎻'),
    # Light bulb
    ('ðŸ'¡', '💡'),
    # Floppy disk
    ('ðŸ'¾', '💾'),
    # Optical disk
    ('ðŸ'¿', '💿'),
    # Desktop computer with variation selector
    ('ðŸ–¥ï¸', '🖥️'),
    # Printer with variation selector
    ('ðŸ–¨ï¸', '🖨️'),
    # Computer mouse with variation selector
    ('ðŸ–±ï¸', '🖱️'),
    # Trackball with variation selector
    ('ðŸ–²ï¸', '🖲️'),
    # Card index dividers with variation selector
    ('ðŸ—‚ï¸', '🗂️'),
    # Card file box with variation selector
    ('ðŸ—ƒï¸', '🗃️'),
    # File cabinet with variation selector
    ('ðŸ—„ï¸', '🗄️'),
    # Spiral calendar with variation selector
    ('ðŸ—"ï¸', '🗓️'),
    # Old key with variation selector
    ('ðŸ—ï¸', '🗝️'),
    # Rolled-up newspaper with variation selector
    ('ðŸ—žï¸', '🗞️'),
    # Speaking head with variation selector
    ('ðŸ—£ï¸', '🗣️'),
    # Left speech bubble with variation selector
    ('ðŸ—¨ï¸', '🗨️'),
    # Right anger bubble with variation selector
    ('ðŸ—¯ï¸', '🗯️'),
    # Ballot box with variation selector
    ('ðŸ—³ï¸', '🗳️'),
    # World map with variation selector
    ('ðŸ—ºï¸', '🗺️'),
    # Mount fuji
    ('ðŸ—»', '🗻'),
    # Tokyo tower
    ('ðŸ—¼', '🗼'),
    # Statue of liberty
    ('ðŸ—½', '🗽'),
    # Japan map
    ('ðŸ—¾', '🗾'),
    # Moyai
    ('ðŸ—¿', '🗿'),
]

# Global CSS rules that should be removed from bottom style blocks
GLOBAL_CSS_PATTERNS = [
    r'body\s*\{',
    r'\*\s*\{',
    r'\.navbar\s*\{',
    r'\.nav-container\s*\{',
    r'\.logo\s*\{',
    r'\.nav-links\s*\{',
    r'\.nav-link\s*\{',
    r'\.btn\s*\{',
    r'\.btn-primary\s*\{',
    r'\.btn-secondary\s*\{',
    r'\.footer\s*\{',
    r'\.container\s*\{',
    r'\.menu-toggle\s*\{',
]

def fix_mojibake(content):
    """Fix unicode mojibake by treating content as latin-1 encoded utf-8."""
    # Encode to bytes as latin-1 (preserving byte values), then decode as utf-8
    try:
        raw_bytes = content.encode('latin-1')
        fixed = raw_bytes.decode('utf-8')
        return fixed
    except (UnicodeDecodeError, UnicodeEncodeError):
        # If that fails, do manual string replacements
        for corrupted, correct in MOJIBAKE_REPLACEMENTS:
            content = content.replace(corrupted, correct)
        return content

def fix_nav(content):
    """Replace navbar with standard nav."""
    return re.sub(
        r'<nav[^>]*class="navbar"[^>]*>.*?</nav>',
        STANDARD_NAV,
        content,
        flags=re.DOTALL
    )

def fix_footer(content):
    """Replace footer with standard footer."""
    return re.sub(
        r'<footer[^>]*>.*?</footer>',
        STANDARD_FOOTER,
        content,
        flags=re.DOTALL
    )

def remove_conflicting_styles(content):
    """Remove <style> blocks that contain global CSS rules."""
    def should_remove_style_block(style_content):
        for pattern in GLOBAL_CSS_PATTERNS:
            if re.search(pattern, style_content):
                return True
        return False

    def process_style_block(match):
        style_content = match.group(1)
        if should_remove_style_block(style_content):
            return ''
        return match.group(0)

    return re.sub(
        r'<style>(.*?)</style>',
        process_style_block,
        content,
        flags=re.DOTALL
    )

def add_favicon_if_missing(content):
    """Add favicon link if missing."""
    if 'rel="icon"' not in content:
        content = content.replace(
            '<link rel="stylesheet" href="/assets/css/style.css">',
            '<link rel="icon" type="image/x-icon" href="/favicon.ico">\n    <link rel="stylesheet" href="/assets/css/style.css">'
        )
    return content

def process_file(filepath):
    """Process a single HTML file."""
    # Read as latin-1 to get raw bytes as characters
    with open(filepath, 'r', encoding='latin-1') as f:
        content_latin = f.read()

    original_latin = content_latin

    # Fix mojibake: treat latin-1 content as misread utf-8
    content = fix_mojibake(content_latin)

    # Fix nav
    content = fix_nav(content)

    # Fix footer
    content = fix_footer(content)

    # Remove conflicting style blocks
    content = remove_conflicting_styles(content)

    # Add favicon if missing
    content = add_favicon_if_missing(content)

    # Write back as UTF-8 without BOM
    with open(filepath, 'w', encoding='utf-8', newline='') as f:
        f.write(content)

    return True

def main():
    fixed = 0
    unchanged = 0
    errors = []

    # Get all HTML files in tools/ recursively, excluding .bak
    pattern = os.path.join('tools', '**', '*.html')
    files = glob.glob(pattern, recursive=True)
    files = [f for f in files if not f.endswith('.bak')]
    files.sort()

    for filepath in files:
        try:
            # Read original for comparison
            with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
                original = f.read()

            process_file(filepath)

            with open(filepath, 'r', encoding='utf-8') as f:
                after = f.read()

            if after != original:
                print(f"FIXED: {os.path.basename(filepath)}")
                fixed += 1
            else:
                print(f"UNCHANGED: {os.path.basename(filepath)}")
                unchanged += 1
        except Exception as e:
            print(f"ERROR: {os.path.basename(filepath)}: {e}")
            errors.append((filepath, str(e)))

    print(f"\nSummary: {fixed} fixed, {unchanged} unchanged, {len(errors)} errors")
    if errors:
        print("Errors:")
        for f, e in errors:
            print(f"  {f}: {e}")

if __name__ == '__main__':
    main()
