#!/usr/bin/env python3
import os
import re

# Google AdSense script to add
adsense_script = '''    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9420599375364457"
            crossorigin="anonymous"></script>
'''

modified = 0
skipped = 0
errors = 0

print("Starting to add AdSense script to all HTML files...\n")

for root, dirs, files in os.walk('.'):
    # Skip hidden directories and node_modules
    dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules']
    
    for filename in sorted(files):
        if not filename.endswith('.html'):
            continue
        
        filepath = os.path.join(root, filename)
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check if already has adsense script
            if 'pagead2.googlesyndication.com' in content:
                skipped += 1
                print(f"✓ Skip (already has): {filepath}")
                continue
            
            # Find <head> tag position
            match = re.search(r'<head>', content, re.IGNORECASE)
            if not match:
                print(f"✗ Error: No <head> tag in {filepath}")
                errors += 1
                continue
            
            # Insert after <head>
            insert_pos = match.end()
            new_content = content[:insert_pos] + '\n' + adsense_script + content[insert_pos:]
            
            # Write back
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            modified += 1
            print(f"✓ Added: {filepath}")
        
        except Exception as e:
            print(f"✗ Error processing {filepath}: {e}")
            errors += 1

print("\n" + "="*70)
print("Summary:")
print(f"  ✓ Modified: {modified} files")
print(f"  - Skipped (already had): {skipped} files")
print(f"  ✗ Errors: {errors} files")
print(f"  Total processed: {modified + skipped + errors} files")
print("="*70)
