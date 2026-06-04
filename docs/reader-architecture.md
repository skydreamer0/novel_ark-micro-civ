# Reader Application Architecture

> 小說閱讀器 SPA 架構文件。與 `02_PROJECT_DATABASE/`（小說世界設定）分離，僅描述 `reader/` 目錄的技術實作。

---

## 技術棧

| 項目 | 選擇 |
|---|---|
| 語言 | 原生 JavaScript (ES Modules) |
| 框架 | 無（Vanilla JS） |
| Markdown 渲染 | marked.js v15.0.12（CDN） |
| 字型 | Noto Serif TC（正文）、Inter（UI） |
| 部署 | 純靜態站點（GitHub Pages） |
| 離線 | Service Worker（stale-while-revalidate） |
| PWA | manifest.json，`display: standalone` |
| 持久化 | `localStorage`（key 前綴 `reader-*`） |

---

## 啟動流程

```
index.html
  └─ <script type="module" src="reader/app.js">
       └─ import { init } from './modules/main.js'

main.js:init()
  1. loadExternalConfig()    從 reader/config.json 載入 GitHub repo 設定
  2. inferGithubRepo()       從 URL query param 推斷 repo（覆蓋 config.json）
  3. loadState()             從 localStorage 恢復所有 state（主題、字體、TTS 等）
  4. loadAnnotations()       從 localStorage 載入書籤/高亮
  5. applyTheme()            套用 data-theme 屬性
  6. applyFontSize()         套用 --content-font-size CSS 變數
  7. bindEvents()            綁定所有 UI 事件
  8. initTTS()               初始化朗讀引擎
  9. loadFileList()          fetch GitHub Git Trees API 取得章節列表
  10. renderSidebar()        渲染側邊欄
  11. loadGlossary() (async) 背景載入詞彙表（不阻塞首次渲染）
  12. serviceWorker.register()
  13. 根據 URL ?file= 或 reader-last-read 載入章節
```

---

## 模組依賴圖

```
main.js
 ├── config.js          ─── state.js
 ├── theme.js           ─── state.js, config.js
 ├── events.js          ─── state.js, config.js, theme.js, tts.js,
 │                          gestures.js, sidebar.js, reader.js,
 │                          search.js, glossary.js
 ├── tts.js             ─── state.js
 ├── github.js          ─── state.js, sort.js
 ├── sidebar.js         ─── state.js, reader.js, search.js, annotations.js
 ├── reader.js          ─── state.js, github.js, tts.js, sort.js,
 │                          config.js, sidebar.js, annotation_render.js,
 │                          glossary.js
 ├── search.js          ─── state.js, github.js, reader.js, sidebar.js
 ├── gestures.js        ─── state.js, reader.js
 ├── annotations.js     ─── state.js
 ├── annotation_render.js── state.js
 └── glossary.js        ─── state.js, github.js
      ├── annotateGlossary()
      ├── bindGlossaryPopover()
      └── setGlossaryEnabled()
```

**獨立子系統（Dossier 機密設定集）：**

```
dossier.js (獨立入口, setting-page.html 載入)
 ├── progress.js         (與主 reader 共用)
 ├── dossier-data.js
 │    ├── dossier-parser.js
 │    └── dossier-merge.js
 ├── dossier-render.js
 │    └── dossier-lock.js
 ├── dossier-sync.js
 │    └── dossier-lock.js
 └── dossier-memory.js
      └── progress.js
```

---

## 核心模組職責

### `state.js`
全域狀態中樞。export 三個物件：
- `config` — GitHub repo 設定（owner, repo, branch, include 規則）
- `state` — 執行時期狀態（~60 個欄位），包括：
  - 閱讀狀態：`files[]`, `activeIndex`, `readChapters`, `scrollPositions`
  - UI 狀態：`theme`, `fontSize`, `bottomPanelOpen`, `navHidden`
  - Glossary：`glossary` (Map), `glossaryRegex`, `glossaryEnabled`
  - TTS：`tts.speaking`, `ttsRate`, `ttsStartMode`
  - 搜尋：`searchMode`, `searchResults`, `searchContentCache`
  - 註記：`annotations`, `bookmarks`
- `els` — DOM 元素快取（~40 個元素）

### `config.js`
- `loadExternalConfig()` — fetch `reader/config.json`，合併 URL query 參數
- `saveState(key)` — 將 `state[key]` 寫入 localStorage（key = `reader-${key}`）
- `loadState()` — 從 localStorage 恢復所有持久化欄位

### `github.js`
- `getApiUrl(path)` — 組裝 GitHub raw URL
- `loadFileList()` — fetch `api.github.com/repos/{owner}/{repo}/git/trees/{branch}`，遞迴取得 `01_NOVEL_CONTENT/` 下所有 `.md` 檔案
- 結果 cache 到 `state.files`

### `reader.js`
章節載入與渲染核心：
- `loadChapter(path)` — fetch raw markdown → `marked.parse()` → 插入 DOM
- Infinite scroll（往下捲自動載入下一章）
- 追蹤當前可見標題（更新側邊欄 active 狀態）
- 每章渲染後呼叫 `annotateGlossary(section)` 將詞彙包成 `<span class="term">`

### `events.js`
全站 UI 事件綁定：
- 側邊欄開關、章節點擊、搜尋輸入
- 字體大小增減、主題切換、書籤按鈕
- TTS 播放/停止、語速滑桿、起始位置下拉
- 鍵盤快捷鍵（← → 翻頁、t 切換主題等）
- 底部面板拖曳手勢（委派 gestures.js）

### `theme.js`
- `applyTheme()` — `body.dataset.theme = state.theme`，切換月亮/太陽圖示
- `applyFontSize()` — `document.documentElement.style.setProperty('--content-font-size', ...)`

### `glossary.js`
行內詞彙彈窗系統（320 行）：
- `loadGlossary()` — 併發 fetch 4 個來源（`_GLOSSARY.json` + 3 個 `CANON_*.md`），建立 term → desc 的 Map
- `annotateGlossary(section)` — `TreeWalker` 遍歷 DOM 文字節點，匹配的字用 `<span class="term" data-term="...">` 包裹
- `bindGlossaryPopover()` — mouseover/mouseout/tap 顯示浮層
- `setGlossaryEnabled(bool)` — body class `no-glossary` 控制

### `glossary-data.js`（安全模型）
獨立的輕量載入器，**只暴露** `summary`, `first_seen_chapter`, `safe_until_chapter`。明確排除 `dossier`, `details`, `unlock`, `visibility`, `internal_note`。

### `tts.js`
文字轉語音：
- Web Speech API (`window.speechSynthesis`)
- 支援語速調整、從指定位置開始、段落佇列播放

### `search.js`
全文搜尋：
- `performFullTextSearch(query)` — fetch 所有章節 → regex 匹配
- 結果用 `renderSearchResults()` 在側邊欄顯示
- `AbortController` 支援取消進行中的搜尋

### `annotations.js` + `annotation_render.js`
書籤與高亮系統：
- 段落旁的小圓點書籤（`.para-bookmark-dot`）
- 選取文字高亮（`.annot-highlight`）
- 側邊註記抽屜（`.annot-panel`）

### `gestures.js`
觸控手勢：
- 水平滑動切換章節
- 底部面板拖曳開啟/關閉

### `sidebar.js`
側邊欄渲染：
- `renderSidebar()` — 依目錄結構分組顯示章節列表
- 支援搜尋過濾、摺疊卷夾
- `updateActiveSidebarItem()` — 隨閱讀進度更新 active 狀態

### `progress.js`
進度計算（被 reader 與 dossier 共用）：
- `getGlobalProgress()` — 從 `reader-last-read`（字串）和 `reader-read`（JSON 陣列）取最大章節號
- `getContextualProgress(chapterId)` — 當前章節的進度（與全域進度分離）
- `extractChapterNumber(path)` — 從 `第150章` 或檔案路徑解析數字

### `sort.js`
檔案排序工具：
- `naturalSort()` — 自然排序（數字感知）
- `countWords()` — 中文字數計算

---

## Dossier 機密設定集子系統

獨立 SPA 頁面 `reader/setting-page.html` → `reader/dossier.js`。

### 資料管線

```
1. progress.js          getGlobalProgress()         從 localStorage 取最高章節號
       ↓
2. dossier-data.js      併發 fetch：
       │                  _GLOSSARY.json（陣列，含 dossier 擴充欄位）
       │                  CANON_characters.md
       │                  CANON_world.md
       │                  CANON_power.md
       ↓
3. dossier-parser.js    從 Markdown 解析 ### 區段
                        HTML 註解語法：<!-- unlock: 30 visibility: partial category: 核心名詞 -->
       ↓
4. dossier-merge.js     JSON 優先：JSON 有定義就用 JSON 欄位，
                        Markdown 內容塞進 supplementalArchive
                        缺 JSON 的條目直接從 MD 建立
       ↓
5. dossier-render.js    evaluateLockState() → 卡片渲染
       ↓
6. dossier-lock.js      三級鎖定：
                        partial    → 文字模糊 +「數據過載：權限不足」
                        restricted → ████ 紅字塗黑
                        blackbox   → ██████ + ■■■ UNAUTHORIZED ACCESS ■■■
```

### 鎖定邏輯（`dossier-lock.js`）

```js
function evaluateLockState(item, globalProgress) {
    const isLocked = globalProgress < item.unlock;
    // 支援 multi-stage unlock: unlock_stages[{ chapter, text }]
    // 解鎖後依 stage 追加 supplementalArchive 內容
    return { isLocked, title, details, supplemental, currentStage, totalStages };
}
```

### 分類篩選
按鈕對應 `data-category`：`all` / `核心名詞` / `世界` / `角色` / `力量`

### 記憶片段（`dossier-memory.js`）
Base64 編碼的 localStorage 匯出/匯入，用於跨裝置同步讀取進度

### 同步脈衝（`dossier-sync.js`）
初始化時從 progress=0 動畫跑到 currentProgress，解鎖的卡片閃爍 pulse 動畫

---

## 讀者設定面板（Bottom Panel）

`index.html:134-190`，由 `gestures.js` 控制開啟/關閉。

| 設定項 | 控制方式 | state 欄位 | localStorage key |
|---|---|---|---|
| 字體大小 | A- / A+ | `fontSize` (rem) | `reader-font-size` |
| 主題 | 🌙 切換 | `theme` | `reader-theme` |
| 術語浮窗 | iOS 開關 | `glossaryEnabled` | `reader-glossary-enabled` |
| TTS 播放 | ▶ / ⏹ | `tts.speaking` | — |
| TTS 語速 | 滑桿 0.5-2.0 | `ttsRate` | `reader-tts-rate` |
| TTS 起始位置 | 下拉選單 | `ttsStartMode` | `reader-tts-start-mode` |

控制項綁定在 `events.js`（`bindEvents()`），各 handler 修改 `state` → 呼叫 `saveState()` → 觸發對應 UI 更新。

---

## 資料流摘要

```
[GitHub Repo (raw)]
  ├── api.github.com/repos/.../git/trees  →  github.js  →  state.files[]
  ├── raw/.../01_NOVEL_CONTENT/ChXX.md    →  reader.js (marked.parse) → DOM
  ├── raw/.../02_PROJECT_DATABASE/_GLOSSARY.json
  │                                        ├─ glossary.js (term Map)
  │                                        └─ dossier-data.js (合併用)
  └── raw/.../02_PROJECT_DATABASE/CANON_*.md
                                           ├─ glossary.js (解析摘要)
                                           └─ dossier-data.js (補充存檔)

[localStorage]
  ├── reader-last-read       →  進度恢復 + dossier 解鎖
  ├── reader-read            →  全域進度（getGlobalProgress）
  ├── reader-font-size       →  applyFontSize()
  ├── reader-theme           →  applyTheme()
  ├── reader-glossary-enabled→  setGlossaryEnabled()
  ├── reader-tts-rate        →  TTS 語速
  ├── reader-tts-start-mode  →  TTS 起始位置
  ├── reader-bookmarks       →  書籤 Set
  └── reader-annotations     →  高亮/註記資料
```

---

## PWA / Service Worker

`sw.js` 快取策略：
- **靜態資源**（`reader/`, `index.html`, `assets/`）：Cache First
- **章節內容**（`01_NOVEL_CONTENT/`）：Stale-while-revalidate
- **設定資料**（`02_PROJECT_DATABASE/`）：Network First（確保最新）
- 版本號 v16（`CACHE_VERSION`）

---

## 無後端設計的限制

1. 所有「鎖定」是客戶端 CSS 模糊/塗黑，可被 DevTools 繞過
2. 無讀者帳號系統，進度只存在單一瀏覽器的 localStorage
3. 跨裝置同步僅能透過手動 Base64 匯出/匯入
4. 章節內容完全公開（GitHub public repo），無付費牆可能
