#!/usr/bin/env python3
"""
Fix corrupted Unicode characters in all HTML tool files
This script replaces corrupted UTF-8 sequences with proper Unicode characters
"""

import os
import glob

# Define the replacements
replacements = {
    "âœ"": "✓",           # Corrupted checkmark
    "ðŸ"": "📁",          # Corrupted folder
    "ðŸŽµ": "🎵",         # Corrupted music note
    "ðŸŽ¬": "🎬",         # Corrupted movie camera
    "ðŸ"‹": "📋",         # Corrupted clipboard
    "ðŸ"„": "📄",         # Corrupted document
    "ðŸ› ï¸": "🛠️",       # Corrupted tools
    "âˆž": "∞",           # Corrupted infinity
    "ðŸ–¼ï¸": "🖼️",       # Corrupted picture frame
    "ðŸ"": "📁",          # Another corrupted folder variant
    "ðŸ"": "📄",          # Another corrupted document variant
    "ðŸ"": "📋",          # Another corrupted clipboard variant
}

def fix_file(filepath):
    """Fix corrupted Unicode characters in a single file"""
    try:
        # Read file with UTF-8 encoding
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        
        # Check if file has corrupted characters
        has_corrupted = any(corrupted in content for corrupted in replacements.keys())
        
        if not has_corrupted:
            return False
        
        # Replace all corrupted characters
        for corrupted, correct in replacements.items():
            content = content.replace(corrupted, correct)
        
        # Write back with UTF-8 encoding
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return True
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    """Main function to fix all tool files"""
    tools_dir = "github.io/tools"
    
    if not os.path.exists(tools_dir):
        print(f"Error: {tools_dir} directory not found")
        return
    
    # Find all HTML files
    html_files = glob.glob(os.path.join(tools_dir, "*.html"))
    
    print(f"Found {len(html_files)} HTML files")
    print("Starting Unicode fix...\n")
    
    fixed_count = 0
    for filepath in sorted(html_files):
        filename = os.path.basename(filepath)
        if fix_file(filepath):
            print(f"✓ Fixed: {filename}")
            fixed_count += 1
        else:
            print(f"  OK: {filename}")
    
    print(f"\n✓ Total files fixed: {fixed_count}")
    print("Unicode fix complete!")

if __name__ == "__main__":
    main()
