import os
import re

def clean_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # 1. First pass: Remove standalone dashes and standalone fragments
    pass1_lines = []
    for line in lines:
        stripped = line.strip()
        if stripped in ["——", "--", "---"]:
            continue
        # Standard fragments to remove
        if stripped in ["是。", "是", "站在。", "站在", "的。", "的", "了。", "了", "中。", "中", "一種。", "有一種。", "是："]:
            continue
        pass1_lines.append(line)

    # 2. Second pass: Join broken sentences ending in ——
    pass2_lines = []
    i = 0
    while i < len(pass1_lines):
        line = pass1_lines[i]
        stripped = line.strip()
        
        if stripped.endswith("——"):
            # Look ahead for the next non-empty line
            next_i = i + 1
            while next_i < len(pass1_lines) and not pass1_lines[next_i].strip():
                next_i += 1
            
            if next_i < len(pass1_lines):
                next_line = pass1_lines[next_i].strip()
                # Join them
                # Regex for "Anything followed by ——"
                if re.match(r'^.+——$', stripped):
                    # If it's short (like "文件名——" or "還有一個——"), use colon
                    if len(stripped) < 15:
                        combined = stripped.replace("——", "：") + " " + next_line
                    else:
                        combined = stripped.rstrip("—") + next_line
                else:
                    combined = stripped.rstrip("—") + next_line
                pass2_lines.append(combined + "\n")
                i = next_i + 1
                continue
        
        pass2_lines.append(line)
        i += 1

    # 3. Third pass: Remove punctuation padding and fix common fragments
    final_lines = []
    for line in pass2_lines:
        stripped = line.strip()
        # Remove trailing dashes that didn't get joined
        # But NOT if it's a dialogue marker like 「——
        if stripped.endswith("——") and not stripped.startswith("「"):
            stripped = stripped.rstrip("—")
        
        final_lines.append(stripped + "\n" if stripped else "\n")

    # 4. Fourth pass: Remove excessive empty lines
    very_final_lines = []
    for j in range(len(final_lines)):
        if not final_lines[j].strip():
            if j > 0 and not very_final_lines[-1].strip():
                continue
        very_final_lines.append(final_lines[j])

    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(very_final_lines)

def main():
    base_dir = r"C:\Users\User\OneDrive - MSFT (1)\0.專案\novel\novel_ark-micro-civ\01_NOVEL_CONTENT"
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(".md"):
                clean_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
