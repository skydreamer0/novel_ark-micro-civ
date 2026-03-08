import os
import glob
import re

base_dir = r"c:\Users\User\OneDrive - MSFT (1)\0.專案\novel\novel_test\docs\01_正文"

def clean_filename(title):
    # Remove invalid characters for Windows filenames
    title = re.sub(r'[<>:"/\\|?*]', '_', title)
    title = title.replace("：", "_")
    title = title.replace(" ", "")
    title = title.replace("#", "")
    return title.strip("_ ")

for filepath in glob.glob(os.path.join(base_dir, "*.md")):
    old_name = os.path.basename(filepath)
    
    # Extract chapter number from current filename, e.g. volume-1-chapter-21
    match = re.match(r"volume-1-chapter-(\d+)", old_name)
    if not match:
        continue
    ch_num = match.group(1)
    
    new_title = ""
    # Find the H2 line like "## 第21章：收編邀請"
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("## "):
                title_text = line[3:].strip()
                # Split by ':' or '_' or spaces to get just the title part
                parts = re.split(r'[：: ]', title_text, 1)
                if len(parts) > 1:
                    title_text = parts[1]
                new_title = clean_filename(title_text)
                break
    
    if new_title:
        new_name = f"第{ch_num}章_{new_title}.md"
        new_filepath = os.path.join(base_dir, new_name)
        
        if filepath != new_filepath:
            print(f"Renaming {old_name} -> {new_name}")
            os.rename(filepath, new_filepath)
    else:
        new_name = f"第{ch_num}章.md"
        new_filepath = os.path.join(base_dir, new_name)
        print(f"Renaming {old_name} -> {new_name}")
        os.rename(filepath, new_filepath)

print("Fix completed.")
