import os
import re

def fix_newlines(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    punctuation = ('。', '」', '！', '？', '…', '：', '”', '’')
    
    for i in range(len(lines)):
        line = lines[i]
        new_lines.append(line)
        
        # Strip the line to check content
        stripped = line.strip()
        if not stripped:
            continue
            
        # Check if we should insert a blank line
        should_insert = False
        
        # Rule 1: Header
        if stripped.startswith('#'):
            should_insert = True
            
        # Rule 2: Strong punctuation
        elif stripped.endswith(punctuation):
            should_insert = True
            
        if should_insert:
            # Check if next line exists and is not already empty
            if i + 1 < len(lines):
                next_line = lines[i+1].strip()
                if next_line: # Next line is not empty
                    new_lines.append('\n')
            # If it's the last line and ends with punctuation, maybe add one? 
            # Usually not necessary for the very last line of the file.

    # Join and write back if changed
    new_content = "".join(new_lines)
    with open(file_path, 'r', encoding='utf-8') as f:
        old_content = f.read()
        
    if new_content != old_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    base_dir = '01_NOVEL_CONTENT'
    modified_count = 0
    total_count = 0
    
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.md'):
                total_count += 1
                file_path = os.path.join(root, file)
                if fix_newlines(file_path):
                    modified_count += 1
                    print(f"Fixed: {file_path}")
                else:
                    # print(f"Skipped: {file_path}")
                    pass
                    
    print(f"Finished. Modified {modified_count} out of {total_count} files.")

if __name__ == "__main__":
    main()
