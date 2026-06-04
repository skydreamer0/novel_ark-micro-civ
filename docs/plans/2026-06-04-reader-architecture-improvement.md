# Reader Architecture Improvement Plan

> **目標：** 修復現有 `reader/` 架構的結構性問題，不重寫、不引入新框架。
>
> **策略：** 以獨立 slice 逐步改善，每個 slice 可獨立測試、可回滾。

---

### Slice 1: 狀態持久化統一（Unify State Persistence）

**問題：** `loadState()` 只恢復部分欄位，TTS/glossary 設定散落各模組各自讀 localStorage；`saveState()` 用 if/else chain 一支支處理。

**目標：** 單一 entry point 管理所有持久化欄位，新增設定只需改一處。

**檔案：**
- 修改：`reader/modules/config.js`
- 修改：`reader/modules/state.js`
- 修改：`reader/modules/tts.js`（移除其內直接讀寫 localStorage）
- 修改：`reader/modules/glossary.js`（移除其內直接讀寫 localStorage）

**步驟：**
- [ ] 1. 在 `state.js` 定義 `PERSISTED_KEYS` 清單（所有需持久化的欄位與對應 localStorage key）
- [ ] 2. 改寫 `loadState()` 用清單迭代載入，涵蓋 theme / fontSize / ttsRate / ttsStartMode / glossaryEnabled / bookmarks / readChapters / scrollPositions
- [ ] 3. 改寫 `saveState(key)` 用清單查找對應 localStorage key，移除 if/else chain
- [ ] 4. 從 `tts.js` 移除 `reader-tts-rate` / `reader-tts-start-mode` 的直接讀寫
- [ ] 5. 從 `glossary.js` 移除 `reader-glossary-enabled` 的直接讀寫，改由 `loadState()` 載入
- [ ] 6. 加上 schema 版本號 `reader-schema-version`，日後 migration 用

**驗收：**
- 所有設定持久化行為與改動前完全一致
- 新增一個設定欄位只需在 `PERSISTED_KEYS` 加一筆

---

### Slice 2: Glossary 死碼清理與路徑統一

**問題：** `glossary-popover.js` + `glossary-data.js` + `glossary-rules.js` 是新的安全模型但未被 `main.js` 使用；`glossary.js` 是現行使用中的舊實作；兩套並存皆為 dead code 的一半。

**目標：** 決定保留哪條路徑，刪除另一條，消除混淆。

**檔案：**
- 決定 A：廢棄新路徑，刪除 `glossary-popover.js` / `glossary-data.js` / `glossary-rules.js`
- 決定 B：廢棄舊路徑，將 `main.js` 改接 `glossary-popover.js` 的 API
- 修改對應的 `sw.js` cache 清單

**步驟：**
- [ ] 1. 審視兩套實作的差異（功能面與 API 面）
- [ ] 2. 決定保留方案
- [ ] 3. 執行刪除或接線
- [ ] 4. 更新 `sw.js` cache 清單
- [ ] 5. 完整手動測試 glossary 功能

**驗收：**
- Glossary 浮窗功能正常
- 無未使用的模組殘留

---

### Slice 3: 拆分單體 CSS

**問題：** `reader/styles.css` ~31KB / 1540 行，所有樣式集中一支。

**目標：** 按功能拆分，各自管理。

**檔案：**
- 新增：`reader/base.css`（CSS 變數、reset、版面）
- 新增：`reader/sidebar.css`（側邊欄）
- 新增：`reader/content.css`（章節內容、排版）
- 新增：`reader/panel.css`（底部面板、設定）
- 新增：`reader/annotations.css`（註記、高亮）
- 新增：`reader/glossary.css`（詞彙浮窗）
- 修改：`reader/styles.css` → 保留為 `@import` 入口或直接移除
- 修改：`index.html` 的 `<link>` 指向

**步驟：**
- [ ] 1. 在 `styles.css` 中用註解標記各區塊行數範圍
- [ ] 2. 依序抽出至獨立檔案
- [ ] 3. 用 `@import` 或獨立的 `<link>` 載入
- [ ] 4. 確認無遺漏樣式（亮/暗主題、各狀態）

**驗收：**
- 頁面渲染與改動前完全一致
- 每支 CSS 不超過 400 行

---

### Slice 4: Dossier 資料快取

**問題：** 每次進入 `setting-page.html` 都重新 fetch `_GLOSSARY.json` + 3 支 `CANON_*.md`。

**目標：** 加入 session-level 快取，同次瀏覽 session 內不重複 fetch。

**檔案：**
- 修改：`reader/modules/dossier-data.js`

**步驟：**
- [ ] 1. 在模組內加 module-level cache Map（`sessionCache`）
- [ ] 2. fetch 前先檢查 cache
- [ ] 3. 成功 fetch 後寫入 cache

**驗收：**
- 首次載入 fetch 4 次
- 同次 session 再次進入 dossier 頁面 fetch 0 次

---

### Slice 5: Error Boundary（全域錯誤防護）

**問題：** 任何模組在 init 階段拋錯（GitHub API rate limit / network error）可能導致白畫面。

**目標：** 加入全域錯誤處理，讓 reader 在部分功能失敗時仍能降級運作。

**檔案：**
- 新增：`reader/error-boundary.js`
- 修改：`reader/app.js`
- 修改：`reader/modules/main.js`

**步驟：**
- [ ] 1. 實作 `window.onerror` / `window.onunhandledrejection` 攔截
- [ ] 2. 每個模組 init 包 try-catch，失敗時顯示降級訊息而非白畫面
- [ ] 3. 關鍵功能（章節渲染）與非關鍵功能（glossary、dossier）分級處理

**驗收：**
- GitHub API 離線時 reader 仍可開啟，顯示「章節列表無法載入」提示
- glossary load 失敗不影響閱讀

---

### Slice 6: Search 並行化

**問題：** `search.js` 用 for 迴圈逐章 fetch，耗時與章節數線性成長。

**目標：** 加入並行 fetch + 進度提示。

**檔案：**
- 修改：`reader/modules/search.js`

**步驟：**
- [ ] 1. 將 for 迴圈改為 `Promise.all` + chunk（避免一次開太多連線）
- [ ] 2. 加入搜尋進度顯示
- [ ] 3. 可選：預先 index 已知章節

**驗收：**
- 搜尋 100 章的時間 ≤ 逐章搜尋的 1/4
- UI 顯示搜尋進度

---

### Slice 7: marked.js CDN fallback

**問題：** `index.html:22` 從 CDN 載入 marked.js，CDN 掛掉無法渲染。

**目標：** 加入 inline fallback。

**檔案：**
- 修改：`index.html`
- 新增：`vendor/marked.min.js`（備份）

**步驟：**
- [ ] 1. 在 `window.marked` 未定義時，從本地 vendor 載入

**驗收：**
- CDN marked.js 失效時自動 fallback 至本地版本

---

### Slice 8: Circular Dependency 重構（最深入）

**問題：** `sidebar.js` ↔ `reader.js` ↔ `search.js` 之間存在環狀依賴。

**目標：** 透過提取共用函數或導入事件機制打破循環。

**檔案：**
- 新增：`reader/modules/navigator.js`（提取 `loadChapter` 與章節導航邏輯）
- 修改：`reader/modules/sidebar.js`（改 import navigator 而非 reader）
- 修改：`reader/modules/search.js`（改 import navigator 而非 reader）
- 修改：`reader/modules/reader.js`（移除 sidebar import，改由 navigator 觸發 callback）

**步驟：**
- [ ] 1. 分析所有跨模組呼叫的介面
- [ ] 2. 設計 navigator.js 的 API
- [ ] 3. 逐步置換 import 來源
- [ ] 4. 完整測試所有導航路徑

**驗收：**
- 無任何模組存在環狀 import
- 章節載入、側邊欄點擊、搜尋結果點擊、上下章按鈕皆正常

---

### 執行順序建議

```
Slice 1 (State) → Slice 2 (Glossary) → Slice 4 (Dossier cache) → Slice 5 (Error boundary)
   → Slice 3 (CSS) → Slice 6 (Search) → Slice 7 (CDN fallback) → Slice 8 (Circular deps)
```

高優先、低風險的先做（1, 2, 4, 5），組織性與效能改善在中間（3, 6, 7），最深的重構最後（8）。
