# Local Agent Instructions

This repository has repo-local skills under `.agent/skills/`. Do not install or copy them into global skill directories.

When working in this repository:

1. For novel writing, chapter revision, arc planning, continuity checks, or quality review, read and follow `.agent/skills/novel-writer/SKILL.md`.
2. For new chapters, long-arc planning, multi-agent chapter design, foreshadowing checks, power-balance checks, or character consistency checks, also read and follow `.agent/skills/subagent-layered-novel/SKILL.md`.
3. Treat these local skills as authoritative for this repo even if they are not listed in the global Codex skill registry.
4. Before drafting any chapter prose, load the consolidated project knowledge base under `02_PROJECT_DATABASE/`. The legacy split files have been merged into 6 主檔 (and an indexed `VOLUMES/` tree):
   - `02_PROJECT_DATABASE/STATE.md` — 當前劇情狀態（章節錨點、開放伏筆、衝突弧線、續寫決策清單）。**每次續寫優先讀本檔前 100 行。**
   - `02_PROJECT_DATABASE/CANON_world.md` — 世界事實（母艦結構、深淵、規則霧、勢力、經濟、艦隊、術語表）。
   - `02_PROJECT_DATABASE/CANON_characters.md` — 角色卡（林燼／蘇嵐／燕九／顧衡／祁闕／白扣等的跨卷弧線與關係動態圖）。
   - `02_PROJECT_DATABASE/CANON_power.md` — 力量／資源／人口系統（V0–V14 主機版本、L/H/碎片/燃料、阿卡夏熔爐、投放 vs 製造雙人口體系）。
   - `02_PROJECT_DATABASE/STYLE.md` — 寫作風格（voice、視角法則、句式、描寫質地、主機台詞範本）。
   - `02_PROJECT_DATABASE/RULES.md` — 流程與鐵則（敘事鐵則、品質閘、寫作公式、修訂規則）。
   - `02_PROJECT_DATABASE/VOLUMES/volNN.md` — 各卷架構（vol01–vol04、vol05a–vol05c、vol06）。
   - `02_PROJECT_DATABASE/FUTURE.md` — 未來規劃（V8–V14 終局世界觀、章節大綱、寫作路線圖、字數進度）。**注意**：PART A 的設計者／外律者真相是 V7+ 才會逐步揭露的世界觀深層，在 V7 前的章節中避免直接寫出。
   - 另載入 `.ai/SUMMARY.md` 全局記憶、`.ai/視角技法示範.md` 示範段、目標卷最後 3 章正文。
5. Keep obsolete or archived material out of active continuation context. Do not use `02_PROJECT_DATABASE/04_ARCHIVE/`（含 `legacy_split/` 舊主檔備份）或 `processed_do_not_read` as current story evidence unless the user explicitly asks to inspect archives.
6. Keep changes scoped to the requested novel task. Do not modify unrelated reader app files, metadata, or chapter files.

For chapter production, use this local order:

1. Load `novel-writer`.
2. Load `subagent-layered-novel` when the task needs planning, continuity, or multi-perspective checks.
3. Read `STATE.md` 前 100 行（含 §1 快照、§1.3 下一章鉤子）→ 對應 `CANON_*.md` 段落 → 當前卷 `VOLUMES/volNN.md` → `STYLE.md`/`RULES.md`重點段。
4. Build the chapter plan or QA notes.
5. Write or revise prose only after the continuity and style constraints are clear.
6. Run the quality gate from `RULES.md` §6（含第四面牆 grep 檢查命令）。
7. 完稿後同步更新 `STATE.md`（§1 快照、§4 時間線、§6 伏筆、§7 弧線）與 `.ai/SUMMARY.md`——僅當該章工作確實改變了連貫性。

## Agent skills

### Issue tracker

Local markdown issues tracked in `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical triage roles mapped to default strings. See `docs/agents/triage-labels.md`.

### Domain docs

Multi-context layout using `CONTEXT-MAP.md`. See `docs/agents/domain.md`.

## Encoding policy (UTF-8 for Traditional Chinese content)

This repository contains **Traditional Chinese** content across `01_NOVEL_CONTENT/`, `02_PROJECT_DATABASE/`, `.ai/`, `.agent/`, and chapter files. All text files MUST be saved as **UTF-8** without BOM to avoid mojibake.

### Hard rules for agents

1. **Do NOT use PowerShell `>`, `>>`, `Out-File`, or `Set-Content` to write Chinese text.** PowerShell 5.1's default encoding is the #1 source of mojibake in this stack.
2. **Do NOT use `Get-Content`, `cat`, or `type` to verify Chinese content.** Terminal display lies about encoding.
3. **Prefer Python `pathlib` for reading/writing Chinese files** with explicit `encoding="utf-8"`.
4. **If PowerShell is required, use `pwsh` (PowerShell 7+), not `powershell.exe` (5.1).** PowerShell 7's UTF-8 support is significantly better.
5. **Verify file content using UTF-8 aware reading** (e.g. `Path(p).read_text(encoding="utf-8")` or the `Read` tool, not terminal output).
6. **Git commits**: CRLF/LF warnings are expected on Windows; do not change line endings to "fix" them.
7. **VS Code**: `"files.encoding": "utf8"`, `"files.autoGuessEncoding": false`.

### Recommended Python write

```python
from pathlib import Path
Path(file).write_text(content, encoding="utf-8")
```

### Recommended Python read

```python
from pathlib import Path
text = Path(file).read_text(encoding="utf-8")
```

### Recovery from mojibake

If a file already shows mojibake (`??`, `�`, or garbled CJK), do **not** try to "fix" it via the same broken write path. Use Python to:

1. Read raw bytes with `Path(p).read_bytes()`.
2. Detect encoding with `chardet` or `charset-normalizer` if needed.
3. Decode → re-encode as UTF-8 and rewrite.
4. Verify with a second Python read.

## Work principle

Less attention taken. More value delivered.

Reduce unnecessary questions and narration; deliver useful, verified results. Preserve required approvals, risk disclosures, and blocker reports. This principle does not expand authorization or override safety and project rules.
