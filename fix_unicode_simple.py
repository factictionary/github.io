#!/usr/bin/env python3
"""
Fix corrupted Unicode characters in all HTML tool files
"""

import os
import glob

def fix_file(filepath):
    """Fix corrupted Unicode characters in a single file"""
    try:
        # Read file
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        
        original_content = content
        
        # Replace corrupted characters using hex codes
        content = content.replace('\xc3\xa2\xc2\x9c\xc2\x9d', '\xe2\x9c\x93')  # checkmark
        content = content.replace('\xc3\xb0\xc5\x92\xc2\x9d', '\xf0\x9f\x93\x81')  # folder
        content = content.replace('\xc3\xb0\xc5\x92\xc2\xb5', '\xf0\x9f\x8e\xb5')  # music
        content = content.replace('\xc3\xb0\xc5\x92\xc2\xac', '\xf0\x9f\x8e\xac')  # camera
        content = content.replace('\xc3\xb0\xc5\x92\xc2\x8b', '\xf0\x9f\x93\x8b')  # clipboard
        content = content.replace('\xc3\xb0\xc5\x92\xc2\x84', '\xf0\x9f\x93\x84')  # document
        
        if content != original_content:
            # Write back
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print("Error: " + str(e))
        return False

def main():
    """Main function"""
    tools_dir = "tools"
    
    if not os.path.exists(tools_dir):
        print("Error: tools directory not found")
        return
    
    # Find all HTML files
    html_files = glob.glob(os.path.join(tools_dir, "*.html"))
    
    print("Found " + str(len(html_files)) + " HTML files")
    print("Starting fix...\n")
    
    fixed_count = 0
    for filepath in sorted(html_files):
        filename = os.path.basename(filepath)
        if fix_file(filepath):
            print("Fixed: " + filename)
            fixed_count += 1
    
    print("\nTotal fixed: " + str(fixed_count))

if __name__ == "__main__":
    main()
