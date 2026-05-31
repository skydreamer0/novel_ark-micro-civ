# Core Secret File Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the "機密設定集" into an immersive, progressive-unlock Abyss-themed database.

**Architecture:** A hybrid data-driven system merging JSON stages and Markdown metadata, using `localStorage` for progress tracking and a Background Sync (Sync Pulse) UI to handle latency.

**Tech Stack:** Vanilla HTML/CSS/JS (PWA), Base64 for Save/Load, CSS Animations for Abyss effects.

---

### Task 1: Abyss UI Shell & Basic Layout

**Files:**
- Modify: `reader/setting-page.html`
- Modify: `reader/setting-page.css`

- [ ] **Step 1: Update HTML Structure**
Update the header and grid container to match the Abyss UI concept.

```html
<!-- reader/setting-page.html -->
<header class="dossier-header">
  <div class="header-main">
    <h1>[ 核心機密檔案系統 ]</h1>
    <div id="sync-status" class="status">> 正在初始化母巢連線...</div>
  </div>
  <a href="../index.html" class="back-btn">返回主機</a>
</header>
<div id="save-load-controls" class="save-load-bar">
  <button id="export-btn">導出記憶片段</button>
  <button id="import-btn">載入記憶片段</button>
</div>
<main id="dossier-grid" class="dossier-grid">
  <!-- Dynamic content -->
</main>
```

- [ ] **Step 2: Implement Abyss CSS Theme**
Add the dark-red pulsing background, scanlines, and card styles.

```css
/* reader/setting-page.css */
:root {
  --bg: #050000;
  --abyss-red: #800000;
  --abyss-bright: #ff3333;
  --text: #e0e0e0;
  --text-dim: #888;
  --border: #300000;
  --glow: rgba(255, 0, 0, 0.2);
}
body {
  background: var(--bg);
  background-image: 
    radial-gradient(circle at 50% 50%, #1a0000 0%, #050000 100%),
    repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px);
  background-size: cover, 100% 3px;
  color: var(--text);
  font-family: 'Noto Serif TC', serif;
}
.card {
  background: rgba(20, 0, 0, 0.6);
  border: 1px solid var(--border);
  padding: 25px;
  transition: all 0.3s ease;
}
.card:hover {
  border-color: var(--abyss-red);
  box-shadow: 0 0 20px var(--glow);
}
/* Add pulse animation */
@keyframes pulse {
  0% { opacity: 0.2; }
  50% { opacity: 0.4; }
  100% { opacity: 0.2; }
}
```

- [ ] **Step 3: Commit UI Shell**
```bash
git add reader/setting-page.html reader/setting-page.css
git commit -m "feat(ui): implement abyss ui shell for secret archive"
```

---

### Task 2: Progress Tracking & Unlock Logic

**Files:**
- Modify: `reader/setting-page.js`

- [ ] **Step 1: Implement Progress Detection**
Read the highest chapter from `localStorage`.

```javascript
function getReadingProgress() {
  const read = JSON.parse(localStorage.getItem('reader-read') || '[]');
  if (read.length === 0) return 0;
  const chapters = read.map(path => {
    const m = path.match(/第(\d+)章/);
    return m ? parseInt(m[1]) : 0;
  });
  return Math.max(...chapters);
}
```

- [ ] **Step 2: Update UI Status Header**
Show the detected progress in the header.

```javascript
function updateStatusHeader(progress) {
  const el = document.getElementById('sync-status');
  el.textContent = `> 已偵測到載體進度：Ch.${progress} | 感知延遲：穩定 | 正在同步母巢數據...`;
}
```

- [ ] **Step 3: Commit Progress Logic**
```bash
git commit -m "feat(arch): add reading progress detection logic"
```

---

### Task 3: JSON/Markdown Parser & Merging

**Files:**
- Modify: `reader/setting-page.js`

- [ ] **Step 1: Implement Markdown Metadata Parser**
Regex to extract `<!-- unlock: XX visibility: YY -->`.

```javascript
function parseMDMetadata(text) {
  const metaRegex = /<!--\s*unlock:\s*(\d+)\s*(?:visibility:\s*(\w+))?\s*(?:category:\s*([\u4e00-\u9fa5\w]+))?\s*-->/;
  const lines = text.split('\n');
  const items = [];
  let currentItem = null;

  for (const line of lines) {
    const headingMatch = line.match(/^###\s+(.+)$/);
    if (headingMatch) {
      const rawTitle = headingMatch[1];
      const metaMatch = rawTitle.match(metaRegex);
      const title = rawTitle.replace(metaRegex, '').trim();
      currentItem = {
        term: title,
        unlock: metaMatch ? parseInt(metaMatch[1]) : 0,
        visibility: metaMatch && metaMatch[2] ? metaMatch[2] : 'partial',
        category: metaMatch && metaMatch[3] ? metaMatch[3] : '未知',
        content: ''
      };
      items.push(currentItem);
    } else if (currentItem) {
      currentItem.content += line + '\n';
    }
  }
  return items;
}
```

- [ ] **Step 2: Implement Merging Strategy**
JSON takes priority over Markdown.

```javascript
function mergeSources(jsonTerms, mdTerms) {
  const merged = new Map();
  // 1. Process Markdown (Baseline)
  mdTerms.forEach(t => merged.set(t.term, { ...t, source: 'Canon Archive' }));
  // 2. Process JSON (Override)
  jsonTerms.forEach(t => {
    const existing = merged.get(t.term) || {};
    merged.set(t.term, {
      ...existing,
      ...t,
      source: existing.term ? 'Merged File' : 'Dynamic Report'
    });
  });
  return Array.from(merged.values());
}
```

- [ ] **Step 3: Commit Parser**
```bash
git commit -m "feat(arch): implement md/json parser and merging strategy"
```

---

### Task 4: Graded Locked States (Levels 1-3)

**Files:**
- Modify: `reader/setting-page.css`
- Modify: `reader/setting-page.js`

- [ ] **Step 1: Add Locked State CSS**
Implement Level 1 (Partial), Level 2 (Restricted), Level 3 (Blackbox).

```css
/* reader/setting-page.css */
.card.level-1 .content { filter: blur(8px); opacity: 0.4; }
.card.level-2 .title { text-shadow: 0 0 10px red; } /* Partially redacted handled in JS */
.card.level-3 .content { filter: blur(15px); }

@keyframes shake {
  0% { transform: translate(1px, 1px); }
  20% { transform: translate(-3px, 0); }
  /* ... */
}
.shake { animation: shake 0.5s; }
```

- [ ] **Step 2: Implement Redaction Logic in JS**
Handle title masking for Level 2 and Level 3.

```javascript
function renderCard(item, userProgress) {
  const isLocked = userProgress < item.unlock;
  let displayTitle = item.term;
  if (isLocked) {
    if (item.visibility === 'restricted') displayTitle = item.term.replace(/./g, (c, i) => i % 2 ? '■' : c);
    if (item.visibility === 'blackbox') displayTitle = '[ REDACTED ]';
  }
  // Return HTML string with appropriate classes
}
```

- [ ] **Step 3: Commit Locked States**
```bash
git commit -m "feat(ui): add graded locked states and redaction logic"
```

---

### Task 5: Multi-stage Unlock (JSON)

**Files:**
- Modify: `reader/setting-page.js`

- [ ] **Step 1: Render Multiple Stages**
Filter `unlock_stages` by user progress.

```javascript
function renderStages(stages, progress) {
  return stages
    .filter(s => progress >= s.chapter)
    .map((s, i) => `<div class="stage"><small>[階段 ${i+1}]</small> ${s.text}</div>`)
    .join('');
}
```

- [ ] **Step 2: Add Stage Indicators (Dots)**
Visual dots for progress.

```javascript
function renderDots(stages, progress) {
  return stages.map(s => `<div class="dot ${progress >= s.chapter ? 'active' : ''}"></div>`).join('');
}
```

- [ ] **Step 3: Commit Multi-stage**
```bash
git commit -m "feat(ui): support multi-stage unlocking for json entries"
```

---

### Task 6: Sync Pulse & Background Revalidate

**Files:**
- Modify: `reader/setting-page.js`

- [ ] **Step 1: Implement "Sync Pulse" UI States**
Update header status message during fetch.

```javascript
async function syncData() {
  const status = document.getElementById('sync-status');
  status.textContent = '正在同步母巢數據...';
  try {
    // Fetch latest data
    status.textContent = '同步完成：新增檔案已解封';
    // Trigger transition if new unlocks found
  } catch (e) {
    status.textContent = '離線模式：顯示上次同步資料';
  }
}
```

- [ ] **Step 2: Re-render specific cards on update**
Avoid full page refresh.

- [ ] **Step 3: Commit Sync Pulse**
```bash
git commit -m "feat(ux): add sync pulse and background revalidation"
```

---

### Task 7: Save/Load (Memory Fragments)

**Files:**
- Modify: `reader/setting-page.js`

- [ ] **Step 1: Implement Export Logic**
Base64 encode the progress state.

```javascript
function exportMemory() {
  const state = {
    version: 1,
    highestChapter: getReadingProgress(),
    exportedAt: new Date().toISOString()
  };
  const code = btoa(JSON.stringify(state));
  copyToClipboard(code);
  alert('記憶片段已導出至剪貼簿');
}
```

- [ ] **Step 2: Implement Import Logic**
Decode and update `localStorage` if progress is higher.

```javascript
function importMemory(code) {
  try {
    const state = JSON.parse(atob(code));
    // Validation and localStorage update
  } catch (e) {
    alert('無效的記憶片段');
  }
}
```

- [ ] **Step 3: Commit Save/Load**
```bash
git commit -m "feat(ux): implement memory fragment export/import"
```

---

### Task 8: PWA Cache & Offline Optimization

**Files:**
- Modify: `sw.js`
- Modify: `manifest.json`

- [ ] **Step 1: Update Service Worker Asset List**
Add the new setting page assets to cache.

```javascript
// sw.js
const ASSETS = [
  // ... existing
  './reader/setting-page.html',
  './reader/setting-page.css',
  './reader/setting-page.js'
];
```

- [ ] **Step 2: Update Manifest Theme Color**
Match the Abyss UI theme.

```json
// manifest.json
{
  "background_color": "#050000",
  "theme_color": "#800000"
}
```

- [ ] **Step 3: Commit PWA Changes**
```bash
git commit -m "chore(pwa): optimize for secret archive theme and offline access"
```

---

### Task 9: Final QA & Cleanup

- [ ] **Step 1: Verify on Mobile**
Check safe areas and responsive grid.
- [ ] **Step 2: Test Lockdown Levels**
Verify Level 1 (Mental-blur), Level 2 (Redacted), Level 3 (Blackbox).
- [ ] **Step 3: Test Progress Unlock**
Manually edit `localStorage` and refresh to see cards unlock with animations.
- [ ] **Step 4: Remove Mockup Files**
Delete `design-mockup.html` and `final-design.html`.
- [ ] **Step 5: Final Commit**
```bash
git rm design-mockup.html final-design.html
git commit -m "cleanup: remove design mockups after successful implementation"
```
