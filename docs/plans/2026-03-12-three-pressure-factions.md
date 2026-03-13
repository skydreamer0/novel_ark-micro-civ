# Three Pressure Factions Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 清譜會, 盲舵會, and 續焰團 to the canonical faction, oppression, sector, ideology, and glossary documents without conflicting with the mothership's existing hard constraints.

**Architecture:** Update the main faction dossier first so each group has a stable gameplay and story identity, then thread each faction into the worldbuilding files that govern social pressure, inter-sector movement, and faith. Finish by updating the glossary so future chapter drafting uses one canonical vocabulary.

**Tech Stack:** Markdown documentation, ripgrep (`rg`) consistency checks, Git status review

> Worktree note: this repository already contains unrelated in-progress edits, so execution in the shared tree should verify and stage only the touched documentation files instead of creating a commit here.

---

### Task 1: Add the three faction entries to the core faction dossier

**Files:**
- Modify: `docs/02_核心設定/02_角色與陣營/02_陣營與敵對勢力.md`
- Reference: `docs/03_世界觀/04_社會秩序與壓迫.md`
- Reference: `docs/03_世界觀/07_其他艙段與平行社會.md`
- Reference: `docs/03_世界觀/08_都市信仰與意識形態.md`

**Step 1: Insert the new sections**

```markdown
## 6. 污染金融勢力：清譜會
## 7. 封鎖帶領港勢力：盲舵會
## 8. 動員型宗教外包：續焰團
```

Each section must include:

- 收入來源
- 壟斷手段
- 對主角態度
- 首要衝突點
- 戰鬥兵種 / 執行單位

**Step 2: Verify the headings exist**

Run: `rg -n "^## (6|7|8)\\." "docs/02_核心設定/02_角色與陣營/02_陣營與敵對勢力.md"`

Expected: three new numbered section headers for 清譜會, 盲舵會, and 續焰團

**Step 3: Verify each faction name appears in the file**

Run: `rg -n "清譜會|盲舵會|續焰團" "docs/02_核心設定/02_角色與陣營/02_陣營與敵對勢力.md"`

Expected: multiple hits for all three factions, covering summary and detail bullets

**Step 4: Review only the touched file**

Run: `git -c safe.directory='C:/Users/User/OneDrive - MSFT (1)/0.專案/novel/novel_test' diff -- "docs/02_核心設定/02_角色與陣營/02_陣營與敵對勢力.md"`

Expected: only the three new faction sections plus the renumbered template heading

### Task 2: Add the pollution-settlement oppression node

**Files:**
- Modify: `docs/03_世界觀/04_社會秩序與壓迫.md`
- Reference: `docs/03_世界觀/03_資源與轉化規則.md`

**Step 1: Add the new制度節點 section**

```markdown
## 5. 新增制度節點：污染清算網與「延淨排序」
```

The section must define:

- 清譜會的制度角色
- 污染評級與清艙估值
- 押金凍結與延後淨化
- 1～3 章內的劇情後果模板

**Step 2: Verify the heading and key terms**

Run: `rg -n "污染清算網|延淨排序|清艙估值|清譜會" "docs/03_世界觀/04_社會秩序與壓迫.md"`

Expected: the new section heading and its core mechanics

**Step 3: Review only the touched file**

Run: `git -c safe.directory='C:/Users/User/OneDrive - MSFT (1)/0.專案/novel/novel_test' diff -- "docs/03_世界觀/04_社會秩序與壓迫.md"`

Expected: one new section appended after the躍階氧稅 block

### Task 3: Add blind-route brokerage to inter-sector rules

**Files:**
- Modify: `docs/03_世界觀/07_其他艙段與平行社會.md`
- Reference: `docs/03_世界觀/06_熵潮與存在級威脅.md`

**Step 1: Expand the interaction rules**

```markdown
| **盲舵領航** | ... |
### 5.1 盲舵會與舊航道市場
```

The new content must explain:

- why封鎖帶 creates value for盲舵會
- what information or access they monopolize
- why they never sell a full route outright
- how they support dead-sector plotlines

**Step 2: Verify the new route-brokerage terms**

Run: `rg -n "盲舵領航|盲舵會|舊航道" "docs/03_世界觀/07_其他艙段與平行社會.md"`

Expected: a new table row and a new explanatory subsection

**Step 3: Review only the touched file**

Run: `git -c safe.directory='C:/Users/User/OneDrive - MSFT (1)/0.專案/novel/novel_test' diff -- "docs/03_世界觀/07_其他艙段與平行社會.md"`

Expected: the interaction rules now reference 盲舵會 as the specialized blockade-running broker

### Task 4: Add續焰團 to the ideology map

**Files:**
- Modify: `docs/03_世界觀/08_都市信仰與意識形態.md`
- Reference: `docs/03_世界觀/04_社會秩序與壓迫.md`

**Step 1: Add the new subsection under Ever-Sailing ideology**

```markdown
### 2.4 續焰團（恆航教的底層動員變體）
```

The subsection must cover:

- 教義包裝
- 組織狀態
- 高層默許原因
- 劇情價值

**Step 2: Verify the ideology linkage**

Run: `rg -n "續焰團|恆航教|奉航志願書" "docs/03_世界觀/08_都市信仰與意識形態.md"`

Expected: the new subsection shows 續焰團 as a practical, bottom-layer extension of Ever-Sailing language

**Step 3: Review only the touched file**

Run: `git -c safe.directory='C:/Users/User/OneDrive - MSFT (1)/0.專案/novel/novel_test' diff -- "docs/03_世界觀/08_都市信仰與意識形態.md"`

Expected: one new subsection inserted after the恆航教裂痕 block

### Task 5: Canonize the terminology and run consistency checks

**Files:**
- Modify: `docs/03_世界觀/05_專有名詞辭典.md`
- Verify: `docs/02_核心設定/02_角色與陣營/02_陣營與敵對勢力.md`
- Verify: `docs/03_世界觀/04_社會秩序與壓迫.md`
- Verify: `docs/03_世界觀/07_其他艙段與平行社會.md`
- Verify: `docs/03_世界觀/08_都市信仰與意識形態.md`

**Step 1: Add glossary entries for the new faction names and core role terms**

```markdown
| 清譜會 | ... |
| 盲舵會 | ... |
| 續焰團 | ... |
```

Add the canonical terms introduced by the four documentation edits.

**Step 2: Run cross-file consistency checks**

Run: `rg -n "清譜會|盲舵會|續焰團|延淨排序|舊航道|奉航志願書" docs`

Expected: all terms resolve to the updated canonical docs without alternate names

**Step 3: Review the full documentation diff**

Run: `git -c safe.directory='C:/Users/User/OneDrive - MSFT (1)/0.專案/novel/novel_test' diff -- "docs/plans/2026-03-12-three-pressure-factions-design.md" "docs/plans/2026-03-12-three-pressure-factions.md" "docs/02_核心設定/02_角色與陣營/02_陣營與敵對勢力.md" "docs/03_世界觀/04_社會秩序與壓迫.md" "docs/03_世界觀/05_專有名詞辭典.md" "docs/03_世界觀/07_其他艙段與平行社會.md" "docs/03_世界觀/08_都市信仰與意識形態.md"`

Expected: the new factions read as one coherent pressure chain across faction, institution, transit, ideology, and terminology
