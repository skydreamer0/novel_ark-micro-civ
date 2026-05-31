
import os
import re

def analyze_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    paragraphs = content.split('\n\n')
    for i, p in enumerate(paragraphs):
        p_lines = p.strip().splitlines()
        if len(p_lines) > 3:
            print(f"File: {os.path.basename(file_path)}, Paragraph {i+1}, Lines: {len(p_lines)}")
            print(p)
            print("-" * 20)

base_dir = r'01_NOVEL_CONTENT\01_第一卷_艙底種火'
analyze_file(os.path.join(base_dir, '第01章_欠稅通知.md'))
