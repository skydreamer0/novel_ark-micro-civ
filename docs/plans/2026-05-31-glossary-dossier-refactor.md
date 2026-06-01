# Glossary & Secret Dossier Refactor Implementation Plan (REVISED)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the monolithic `setting-page.js` into a context-aware Reader Glossary (lightweight, safe) and an immersive Secret Dossier (Abyss UI, full archive).

**Architecture:** Modular ESM architecture under `reader/modules/`. Physical data isolation for Glossary. Two progress tracks: Contextual (current page) and Global (max read).

**Tech Stack:** Vanilla JS (ESM), CSS Variables, HTML5 LocalStorage.

---

### Slice 1: Core Progress Module (Foundation)

**Goal:** Centralize localStorage logic and distinguish between global and contextual progress.

**Files:**
- Create: `reader/modules/progress.js`

- [ ] **Step 1: Implement `progress.js`**
  - Define `getGlobalProgress()`: Returns highest value from `reader-read` (array) or `reader-last-read`.
  - Define `getContextualProgress(chapterId)`: If `chapterId` provided, use it; else fallback to `reader-last-read`.
  - Define utility `extractChapterNumber(path)`.
- [ ] **Step 2: Compatibility Rule**
  - **MANDATORY**: Existing localStorage keys `reader-read` and `reader-last-read` must be supported without modification to existing data.
- [ ] **Step 3: Acceptance Criteria**
  - `getGlobalProgress()` returns an integer (e.g., 150).
  - `getContextualProgress()` correctly identifies if a reader is currently on Chapter 50 despite having read to 150.
- [ ] **Step 4: Rollback Note**
  - Delete `reader/modules/progress.js`.

---

### Slice 2: Glossary Data & Rules (Safe Model)

**Goal:** Create a data loader that physically prevents dossier/spoiler fields from entering the Glossary memory.

**Files:**
- Create: `reader/modules/glossary-data.js`
- Create: `reader/modules/glossary-rules.js`

- [ ] **Step 1: Implement `glossary-data.js` (Safety Check)**
  - Fetch `_GLOSSARY.json`.
  - Map to Safe Model: `id, term, aliases, category, summary, first_seen_chapter`.
  - **MANDATORY EXCLUSION**: The following fields MUST NOT be exposed to the Glossary:
    - `dossier`
    - `details`
    - `unlock_stages`
    - `visibility`
    - `internal_note`
    - `spoiler_level` (if value is unsafe)
- [ ] **Step 2: Implement `glossary-rules.js`**
  - Define `isSafeToShow(termId, currentChapter)`: Check `first_seen_chapter` and `glossary.safe_until_chapter`.
- [ ] **Step 3: Acceptance Criteria**
  - `glossary-data.js` output contains NO `dossier` or `unlock` information.
  - Terms not yet seen in the current chapter return `false` for visibility.

---

### Slice 3: Glossary Popover (UI)

**Goal:** Implement the lightweight popover system in the reader view.

**Files:**
- Create: `reader/modules/glossary-popover.js`
- Modify: `reader/app.js` (Inject popover triggers)

- [ ] **Step 1: Implement `glossary-popover.js`**
  - Create a single shared DOM element for the popover (Lightweight UI).
  - Handle positioning near trigger element with mobile-friendly hitboxes.
  - Auto-hide on scroll or click-outside.
- [ ] **Step 2: Hook into Reader Flow**
  - Update `app.js` to scan for glossary terms in the chapter text.
  - Wrap terms in `<span class="glossary-trigger">`.
- [ ] **Step 3: Acceptance Criteria**
  - Tapping a term in the reader shows a minimalist summary.
  - No "Abyss UI" effects in popover.
  - Popover respects `getContextualProgress()`.

---

### Slice 4: Secret Dossier Data & Parser (Full Model)

**Goal:** Implement the complex loader for the Dossier, including Markdown supplemental merging.

**Files:**
- Create: `reader/modules/dossier-data.js`
- Create: `reader/modules/dossier-parser.js`
- Create: `reader/modules/dossier-merge.js`

- [ ] **Step 1: Implement `dossier-data.js`**
  - Load `_GLOSSARY.json` + `CANON_*.md`.
- [ ] **Step 2: Implement `dossier-parser.js`**
  - Regex-based heading parser: `### [Term] <!-- unlock: X -->`.
- [ ] **Step 3: Implement `dossier-merge.js`**
  - Combine JSON (Structure) with MD (Supplemental Archive).
- [ ] **Step 4: Filter Correction**
  - Ensure the filter system uses `category` (角色, 勢力, etc.).
  - Source (Core DB, MD) appears ONLY as a badge on the card.
- [ ] **Step 5: Acceptance Criteria**
  - Single card shows both JSON and MD content.
  - Filter bar correctly groups by category.

---

### Slice 5: Secret Dossier UI & Sync (Abyss UI)

**Goal:** Rebuild the dossier interface with multi-stage unlocking and "Abyss UI" aesthetics.

**Files:**
- Create: `reader/modules/dossier-render.js`
- Create: `reader/modules/dossier-lock.js`
- Create: `reader/modules/dossier-sync.js`
- Create: `reader/dossier.js` (New Entry Point)

- [ ] **Step 1: Implement `dossier-lock.js`**
  - Redaction logic: `██████` for restricted.
  - Multi-stage reveal based on `globalProgress`.
- [ ] **Step 2: Implement `dossier-render.js`**
  - Apply "Abyss UI" tokens.
- [ ] **Step 3: Implement `dossier-sync.js`**
  - "Sync Pulse" animation.
- [ ] **Step 4: Acceptance Criteria**
  - Dossier page shows immersive cards.
  - Redacted text "decrypts" if global progress matches.

---

### Slice 6: Integration, PWA & QA (Final Migration)

**Goal:** Finalize export/import and switch over entry points.

**Files:**
- Create: `reader/modules/dossier-memory.js`
- Modify: `reader/setting-page.html`
- Modify: `sw.js` (PWA Update)
- Archive: `reader/setting-page.js`

- [ ] **Step 1: Implement `dossier-memory.js`**
  - Base64 export/import for `localStorage`.
- [ ] **Step 2: Rollback Rule & Entry Switch**
  - **MANDATORY**: `setting-page.html` should switch to `dossier.js` ONLY after Slice 1 to Slice 5 pass verification.
- [ ] **Step 3: PWA Check**
  - Update `sw.js` to include new files in `reader/modules/` and `reader/dossier.js`.
  - Remove `reader/setting-page.js` from cache list.
- [ ] **Step 4: QA & Archiving**
  - Run **Manual QA Commands** (see below).
  - Do NOT delete `reader/setting-page.js`. Rename to `reader/setting-page.js.bak` or move to `archive/`.
- [ ] **Step 5: Acceptance Criteria**
  - PWA works offline with new modules.
  - All QA scenarios pass.

---

### Manual QA Commands (Scenarios)

1. **New User**: Clear localStorage → Verify Glossary and Dossier are 100% locked/empty.
2. **Re-reading Context**: Set `reader-read` to 150, `reader-last-read` to 50 → Glossary popover must NOT show Chapter 150 spoilers; Dossier must show Chapter 150 archive.
3. **Global Unlock**: Reach a chapter with new JSON unlock threshold → Trigger Sync Pulse → Verify card decrypted and toast appeared.
4. **Contextual Safe Mode**: Click term in Chapter 10 where `safe_until_chapter` is 5 → Verify popover says "No data" or redacted.
5. **Corrupted Storage**: Set `reader-read` to "invalid-data" → Verify app doesn't crash (fallbacks to 0).
6. **Memory Sync**: Export memory (Base64) → Clear browser → Import memory → Verify progress restored.
