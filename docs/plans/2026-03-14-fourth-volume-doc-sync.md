# Fourth Volume Doc Sync Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Synchronize the approved Volume 4 outline into planning, tracking, and writing-support documents so later chapter drafting can use clear progress markers.

**Architecture:** Treat `04_第四卷_投放名冊.md` as the source outline, then project its progress beats into the global roadmap, foreshadow tracking, and pressure-tracking documents. Apply only documentation and workflow changes needed to make Volume 4 planning directly usable.

**Tech Stack:** Markdown documentation, PowerShell verification commands, repository workflow docs

---

### Task 1: Record the approved design

**Files:**
- Create: `docs/plans/2026-03-14-fourth-volume-doc-sync-design.md`
- Verify: `docs/plans/2026-03-14-fourth-volume-doc-sync-design.md`

**Step 1: Write the design document**

Create a Markdown design doc that captures:
- scope of the sync
- target files
- progress-push requirements
- non-goals

**Step 2: Verify the design doc exists**

Run: `Get-Content 'docs/plans/2026-03-14-fourth-volume-doc-sync-design.md' | Select-Object -First 20`
Expected: file opens and includes goals, scope, and target file list

### Task 2: Expand Volume 4 planning detail

**Files:**
- Modify: `docs/00_企劃大綱/01_分卷大綱/04_第四卷_投放名冊.md`

**Step 1: Add progress sections**

Add sections for:
- act-level three-line goals
- three-chapter micro-cycles
- Volume 4 progress checkpoints

**Step 2: Verify the new sections are present**

Run: `rg -n "三線進度|微循環|進度檢查點" 'docs/00_企劃大綱/01_分卷大綱/04_第四卷_投放名冊.md'`
Expected: all new section headers are found

### Task 3: Upgrade the global roadmap

**Files:**
- Modify: `docs/00_企劃大綱/02_全書階段與揭密藍圖.md`

**Step 1: Add executable Volume 4 checkpoints**

Extend the Volume 4 section and the Volume 3→4 handoff notes with:
- early/mid/late volume goals
- required evidence, authority, and costs
- priority carry-over foreshadows

**Step 2: Verify the roadmap now contains Volume 4 execution detail**

Run: `rg -n "第四卷進度檢查點|卷初|卷中|卷末|優先回收" 'docs/00_企劃大綱/02_全書階段與揭密藍圖.md'`
Expected: the new execution markers appear in the roadmap

### Task 4: Expand foreshadow tracking through Chapter 120

**Files:**
- Modify: `docs/00_企劃大綱/02_寫作與追蹤/01_伏筆追蹤表.md`

**Step 1: Extend the tracking scope**

Update the document to cover Chapters 1-120 and add Volume 4 planning sections for:
- priority payoffs
- deepen-but-not-reveal threads
- new seeds introduced in Volume 4

**Step 2: Verify the new sections and scope**

Run: `rg -n "第 1～120 章|第四卷預定優先回收|第四卷預定加深|第四卷預定新埋" 'docs/00_企劃大綱/02_寫作與追蹤/01_伏筆追蹤表.md'`
Expected: the updated title and all three new planning sections are found

### Task 5: Expand financial pressure tracking into Volume 4

**Files:**
- Modify: `docs/00_企劃大綱/02_寫作與追蹤/02_財務壓力節點.md`

**Step 1: Replace the single-volume table with multi-volume tracking**

Add Volume 2-4 pressure tables or grouped sections, with Volume 4 specifically mapping:
- purification add-on fees
- transit bidding
- political protection fees
- war-loss and retaliation pressure

**Step 2: Verify Volume 4 ranges are present**

Run: `rg -n "91～95|96～100|101～105|106～110|111～115|116～120|加購|競價|保護費|報復" 'docs/00_企劃大綱/02_寫作與追蹤/02_財務壓力節點.md'`
Expected: all Volume 4 ranges and pressure labels are found

### Task 6: Repair workflow mappings if needed

**Files:**
- Modify: `.agent/workflows/write-chapter.md`
- Modify: `.agent/workflows/chapter-planner.md`

**Step 1: Extend the volume mapping**

If the workflows only map Chapter 1-60, add:
- 61～90 -> `03_第三卷_聖城試煉.md`
- 91～120 -> `04_第四卷_投放名冊.md`

**Step 2: Verify the workflow mappings**

Run: `rg -n "61～90|91～120|03_第三卷_聖城試煉|04_第四卷_投放名冊" '.agent/workflows/write-chapter.md' '.agent/workflows/chapter-planner.md'`
Expected: both workflow files include third- and fourth-volume mappings

### Task 7: Final verification sweep

**Files:**
- Verify: `docs/00_企劃大綱/01_分卷大綱/04_第四卷_投放名冊.md`
- Verify: `docs/00_企劃大綱/02_全書階段與揭密藍圖.md`
- Verify: `docs/00_企劃大綱/02_寫作與追蹤/01_伏筆追蹤表.md`
- Verify: `docs/00_企劃大綱/02_寫作與追蹤/02_財務壓力節點.md`
- Verify: `.agent/workflows/write-chapter.md`
- Verify: `.agent/workflows/chapter-planner.md`

**Step 1: Run repository-wide checks**

Run: `rg -n "第四卷預定|第四卷進度檢查點|反向投放|戰爭需求模型|91～120" docs .agent`
Expected: the new planning vocabulary appears in the synced files

**Step 2: Review diffs**

Run: `git diff -- docs .agent`
Expected: changes are limited to the planned documentation and workflow files
