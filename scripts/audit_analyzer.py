
import os
import re

def analyze_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.splitlines()
    
    # 1. Check for lines consisting ONLY of "——", "--", or "---"
    only_separators = [i+1 for i, line in enumerate(lines) if re.match(r'^\s*(——+|--+|---+)\s*$', line)]
    
    # 2. Check for lines ending in "——"
    ending_with_dash = [i+1 for i, line in enumerate(lines) if line.strip().endswith('——')]
    
    # 3. Check for paragraph length
    paragraphs = content.split('\n\n')
    long_paragraphs = []
    for i, p in enumerate(paragraphs):
        p_lines = p.strip().splitlines()
        if len(p_lines) > 3:
            long_paragraphs.append((i+1, len(p_lines), p_lines[0][:20]))
            
    # 4. Check for "Explanation Bridges" [Noun] —— [Filler]
    # Rough pattern: starts with a few chars, then ——, then more chars, and the whole line is short-ish
    bridges = []
    for i, line in enumerate(lines):
        if ' —— ' in line:
            # Check if it looks like [Noun] —— [Explanation]
            parts = line.split(' —— ')
            if len(parts) == 2 and len(parts[0].strip()) < 10 and len(parts[1].strip()) > 0:
                bridges.append((i+1, line))

    return {
        "only_separators": only_separators,
        "ending_with_dash": ending_with_dash,
        "long_paragraphs": long_paragraphs,
        "bridges": bridges
    }

base_dir = r'01_NOVEL_CONTENT\01_第一卷_艙底種火'
files = os.listdir(base_dir)
for file_name in files[:5]:
    file_path = os.path.join(base_dir, file_name)
    result = analyze_file(file_path)
    print(f"File: {file_name}")
    print(f"  Only separators: {result['only_separators']}")
    print(f"  Ending with dash: {result['ending_with_dash']}")
    print(f"  Long paragraphs: {len(result['long_paragraphs'])}")
    if result['bridges']:
        print(f"  Bridges: {result['bridges']}")
