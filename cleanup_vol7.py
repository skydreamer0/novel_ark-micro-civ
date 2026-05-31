import os
import re

def clean_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Rule 1: Delete lines consisting ONLY of '——', '--', or '---' 
    # (unless it is a scene separator '---' between beats).
    temp_lines = []
    for line in lines:
        stripped = line.strip()
        if stripped in ['——', '--']:
            continue
        temp_lines.append(line)
    
    # Rule 2: Merge fragments
    fragment_markers = ('不是', '是', '但', '而', '像是', '只有', '因為', '也就是', '而且', '所以', '或是', '即便', '然而', '但在')
    strong_terminators = ('」', '】', '！', '？', '…', ':', '：')
    
    merged_lines = []
    for line in temp_lines:
        curr_line = line.strip()
        if not curr_line:
            merged_lines.append(line)
            continue
            
        if not merged_lines:
            merged_lines.append(line)
            continue
            
        # Find the last non-empty line
        last_non_empty_idx = -1
        for i in range(len(merged_lines)-1, -1, -1):
            if merged_lines[i].strip():
                last_non_empty_idx = i
                break
        
        if last_non_empty_idx == -1:
            merged_lines.append(line)
            continue
            
        prev_line = merged_lines[last_non_empty_idx].rstrip()
        
        is_fragment = False
        # If curr_line starts with a fragment marker and prev_line doesn't end strongly
        if curr_line.startswith(fragment_markers):
            if not any(prev_line.endswith(t) for t in strong_terminators):
                is_fragment = True
        
        # If prev_line ends in a dash or a comma, it's definitely a fragment
        if (prev_line.endswith('——') or prev_line.endswith('，')) and curr_line:
            is_fragment = True
            
        # Special case: noun phrases ending in period following a subject
        # e.g. "他回頭。 \n 通道入口已經不見了。" -> Keep separate.
        # but "藍光在踏入後的第三秒。 \n 不是熄滅。" -> Merge.
        
        if is_fragment:
            # Merge: remove any empty lines between them
            while len(merged_lines) > last_non_empty_idx + 1:
                merged_lines.pop()
            
            # Merge text
            if prev_line.endswith('。'):
                prev_line = prev_line[:-1] + '，'
            
            # If prev_line ends in ——, just keep it or replace with comma? 
            # Rule 2 says "Merge back into a single logical line". 
            # Usually —— in middle of sentence is fine, but if it was at the end of a line, we merge.
            
            merged_lines[last_non_empty_idx] = prev_line + curr_line + '\n'
        else:
            merged_lines.append(line)

    # Rule 3: Strict 3-line paragraph limit
    final_lines = []
    para_count = 0
    for line in merged_lines:
        if line.strip() == "":
            para_count = 0
            final_lines.append(line)
        else:
            para_count += 1
            if para_count > 3:
                final_lines.append('\n')
                para_count = 1
            final_lines.append(line)

    # Rule 4: Remove 'Explanation Bridges'
    result_lines = []
    for line in final_lines:
        line = re.sub(r'^\[.*?\] —— ', '', line)
        line = re.sub(r'^【.*?】 —— ', '', line)
        result_lines.append(line)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(result_lines)

def main():
    dir_path = '01_NOVEL_CONTENT/07_第七卷_察覺與驚醒'
    files = [f for f in os.listdir(dir_path) if f.endswith('.md')]
    for file in files:
        full_path = os.path.join(dir_path, file)
        clean_file(full_path)
        print(f"Cleaned {file}")

if __name__ == "__main__":
    main()
