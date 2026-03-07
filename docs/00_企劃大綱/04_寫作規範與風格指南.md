# Novel Writing Rules Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a standalone, project-specific hard-rules document that governs all main-body chapters for this cyber-universe novel.

**Architecture:** Store the operational writing rules in one root-level Markdown file so drafting constraints stay easy to find during future writing sessions. Keep the design rationale and execution notes in `docs/plans/` so the creative spec and the production rulebook remain separated.

**Tech Stack:** Markdown, PowerShell

---

### Task 1: Record the approved design

**Files:**
- Create: `docs/plans/2026-03-07-novel-writing-rules-design.md`

**Step 1: Confirm the approved scope**

Run: `Get-Content README.md`  
Expected: The project context shows this is a cyber-universe novel with explicit continuity, pacing, and progression priorities.

**Step 2: Write the design summary**

Document the confirmed choices:
- standalone file
- project-specific rules
- hard constraints only
- applies to main-body chapters only

**Step 3: Verify the design doc**

Run: `Get-Content docs/plans/2026-03-07-novel-writing-rules-design.md`  
Expected: The file includes scope, structure, project-specific constraints, and implementation notes.

**Step 4: Commit**

Skip if the workspace has no `.git` directory. If git exists, commit with:

```bash
git add docs/plans/2026-03-07-novel-writing-rules-design.md
git commit -m "docs: add novel writing rules design"
```

### Task 2: Author the standalone rulebook

**Files:**
- Create: `NOVEL_WRITING_RULES.md`

**Step 1: Draft the fixed document structure**

Create these sections in order:
- purpose and scope
- core writing principles
- hard chapter specifications
- continuity rules between chapters
- pacing rules inside one chapter
- project-specific prohibitions
- pre-finish checklist
- references

**Step 2: Encode measurable constraints**

Add explicit conditions the writer can check manually:
- every chapter must exceed 3000 characters
- the first 500 characters must establish current pressure or goal
- each chapter must advance at least two of the three project story lines
- the ending must leave a carry-over pressure for the next chapter

**Step 3: Bind the rules to this project**

Add constraints that preserve the novel's identity:
- upgrades must come from risk, loot, analysis, or civilization feedback
- battle scenes must alter stakes, resources, power, intel, or relationships
- internal-civilization scenes must affect the external plot immediately or within the next chapter
- exposition cannot replace forward motion

**Step 4: Verify the file content**

Run: `Get-Content NOVEL_WRITING_RULES.md`  
Expected: The file is a complete standalone rulebook in Chinese and includes all required sections.

**Step 5: Commit**

Skip if the workspace has no `.git` directory. If git exists, commit with:

```bash
git add NOVEL_WRITING_RULES.md
git commit -m "docs: add novel writing rules"
```

### Task 3: Run manual completion checks

**Files:**
- Verify: `NOVEL_WRITING_RULES.md`

**Step 1: Check required keywords**

Run: `Select-String -Path NOVEL_WRITING_RULES.md -Pattern '3000','連貫','主線','檢查清單'`  
Expected: All required rule themes appear in the file.

**Step 2: Check that the rulebook is standalone**

Run: `Get-ChildItem -Force`  
Expected: `NOVEL_WRITING_RULES.md` exists at the project root without relying on another document to function.

**Step 3: Commit**

Skip if the workspace has no `.git` directory. If git exists, commit with:

```bash
git add NOVEL_WRITING_RULES.md docs/plans/2026-03-07-novel-writing-rules*.md
git commit -m "docs: finalize novel writing rules"
```
