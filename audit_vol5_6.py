import os
import re

def ensure_traditional_chinese(text):
    mapping = {
        '说': '說', '经': '經', '发': '發', '会': '會', '对': '對', '时': '時', '种': '種', 
        '后': '後', '开': '開', '动': '動', '产': '產', '门': '門', '问': '問', '从': '從', 
        '这': '這', '个': '個', '样': '樣', '见': '見', '当': '當', '与': '與', '关': '關',
        '进': '進', '体': '體', '实': '實', '质': '質', '证': '證', '战': '戰', '无': '無',
        '为': '為', '认': '認', '调': '調', '设': '設', '记': '記', '边': '邊', '运': '運',
        '连': '連', '选': '選', '还': '還', '虽': '雖', '离': '離', '难': '難', '显': '顯',
        '现': '現', '场': '場', '声': '聲', '报': '報', '处': '處', '内': '內', '预': '預',
        '总': '總', '头': '頭', '间': '間', '广': '廣', '应': '應', '义': '義'
    }
    for s, t in mapping.items():
        text = text.replace(s, t)
    return text

def audit_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # 1. Traditional Chinese and basic cleanup
    processed_lines = []
    for line in lines:
        l = ensure_traditional_chinese(line)
        l = re.sub(r'([^「\n\s])——([^」\n\s])', r'\1。\2', l) # Remove bridges
        l = re.sub(r'——\s*——', '——', l)
        processed_lines.append(l)

    # 2. Fix fragments and standalone dashes
    final_lines = []
    fragments = ["是。", "變成。", "她只是。", "中。", "了。", "的。", "站在。", "是", "我在", "她在", "他在", "不是。"]
    
    for line in processed_lines:
        stripped = line.strip()
        if not stripped:
            final_lines.append("\n")
            continue
        if stripped in ["——", "--"]:
            continue
        
        # Check if it's a fragment to be merged
        is_fragment = False
        if len(stripped) < 12:
            if stripped in fragments or not any(c in stripped for c in "。！？，」』"):
                if not stripped.startswith('#') and not stripped.startswith('「'):
                    is_fragment = True
        
        if is_fragment and len(final_lines) > 0:
            # Merge with previous non-blank line
            idx = len(final_lines) - 1
            while idx >= 0 and not final_lines[idx].strip():
                idx -= 1
            if idx >= 0:
                final_lines[idx] = final_lines[idx].rstrip() + stripped + "\n"
                continue
        
        final_lines.append(stripped + "\n")

    # 3. Apply 3-line paragraph limit
    content = "".join(final_lines)
    paragraphs = re.split(r'(\n\s*\n)', content)
    result_parts = []
    for p in paragraphs:
        if not p.strip() or p.strip().startswith('#'):
            result_parts.append(p)
            continue
        
        lines_in_p = p.strip().split('\n')
        if len(lines_in_p) > 3:
            chunks = []
            for i in range(0, len(lines_in_p), 3):
                chunks.append("\n".join(lines_in_p[i:i+3]))
            result_parts.append("\n\n".join(chunks))
        else:
            result_parts.append(p)
    
    final_content = "".join(result_parts)
    # Fix spacing
    final_content = re.sub(r'\n{3,}', '\n\n', final_content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(final_content)

def main():
    paths = [
        r"01_NOVEL_CONTENT/05_第五卷_黑箱斷流",
        r"01_NOVEL_CONTENT/06_第六卷_母艦全面反制"
    ]
    count = 0
    for base_path in paths:
        if not os.path.exists(base_path):
            continue
        for root, dirs, files in os.walk(base_path):
            for file in files:
                if file.endswith(".md"):
                    audit_file(os.path.join(root, file))
                    count += 1
    print(f"Vol 5-6 Clean: {count} files fixed.")

if __name__ == "__main__":
    main()
