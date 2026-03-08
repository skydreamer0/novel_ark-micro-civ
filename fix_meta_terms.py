import os, glob, re

def fix_meta_terms(filepath):
    filename = os.path.basename(filepath)
    ch_match = re.search(r'第(\d+)章', filename)
    if not ch_match:
        return False
    current_chapter = int(ch_match.group(1))

    dir_name = os.path.basename(os.path.dirname(filepath))
    v_match = re.search(r'0(\d)_', dir_name)
    current_volume = int(v_match.group(1)) if v_match else 1

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    def replace_chapter(m):
        n = int(m.group(1))
        if n < current_chapter:
            return "之前" 
        elif n == current_chapter:
            return "這一次"
        else:
            return "接下來"

    def replace_volume(m):
        word = m.group(1)
        mapping = {'一': 1, '二': 2, '三': 3, '四': 4}
        v = mapping.get(word, 0)
        if v == 0:
            return m.group(0)
        
        if v < current_volume:
            return "前一階段" if v > 1 else "初期"
        elif v == current_volume:
            return "這個階段"
        else:
            return "接下來的階段"

    lines = content.split('\n')
    new_lines = []
    modified = False
    
    for line in lines:
        if line.startswith('#'):
            new_lines.append(line)
            continue
            
        old_line = line
        
        line = re.sub(r'第(\d+)章', replace_chapter, line)
        line = re.sub(r'第([一二三四])卷', replace_volume, line)
        
        replacements = {
            '本卷': '這階段',
            '這卷': '這階段',
            '卷末': '這階段尾聲',
            '上一卷': '上個階段',
            '下一卷': '接下來',
            '本章': '這一次',
            '這章': '這一次',
            '上一章': '稍早',
            '下一章': '接下來',
            '章末': '尾聲',
            '章結尾': '結束時',
            '章尾': '尾聲',
            '卷間': '階段間',
            '轉場': '局勢轉變',
            '讀者': '旁觀者',
            '作者': '記錄者'
        }
        for k, v in replacements.items():
            line = line.replace(k, v)
            
        # Post-replacement grammar fixes
        fixups = {
            '這一次結尾': '最後',
            '這一次一開始': '一開始',
            '這一次開場': '開場',
            '這一次的第一個': '的第一個',
            '這一次的任務': '這次任務',
            '這一次收尾': '這次收尾',
            '這一次後段': '行動後段',
            '這一次最後': '最後',
            '接下來開始': '接下來',
            '這一次的': '這次的',
            '這一次因此': '這次因此',
            '這一次的勝負': '這局的勝負',
            '這一次，': '這一次，',
            '這個階段第一章，': '到了這個階段，',
            '初期到這裡': '初期的局勢到這裡',
            '這個階段不只': '這階段不只',
            '這局的最後': '最後'
        }
        for k, v in fixups.items():
            line = line.replace(k, v)
        
        if old_line != line:
            modified = True
        new_lines.append(line)
        
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write('\n'.join(new_lines))
        return True
    return False

docs_path = r'c:\Users\User\OneDrive - MSFT (1)\0.專案\novel\novel_test\docs\01_正文'
files = glob.glob(os.path.join(docs_path, '**', '*.md'), recursive=True)
count = 0
for f in files:
    if fix_meta_terms(f):
        count += 1
        print(f"Fixed meta terms in {f}")

print(f"Total files modified: {count}")
