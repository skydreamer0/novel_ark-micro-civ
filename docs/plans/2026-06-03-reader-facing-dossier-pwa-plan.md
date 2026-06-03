# 讀者版機密檔案與手機 PWA 改善計畫案

> 建立日期：2026-06-03  
> 範圍：讀者端 `index.html`、`reader/setting-page.*`、PWA 設定、機密檔案資料層與中文 UTF-8 流程。  
> 原則：不改正文、不暴露 AI 內部設定、不讀取 `02_PROJECT_DATABASE/04_ARCHIVE/` 或 `processed_do_not_read` 作為現行證據。

## 1. 問題診斷

### 1.1 機密設定頁目前像「AI 設定檔」而非「讀者可讀檔案」

現有機密設定資料直接合併 `_GLOSSARY.json` 與 `CANON_characters.md`、`CANON_world.md`、`CANON_power.md`。這些 `CANON_*` 主檔本質是作者／AI 續寫用知識庫，內容會包含跨卷弧線、系統規則、力量版本與深層真相。若直接顯示給讀者，容易出現三個問題：

- **劇透風險**：內部設定會先於章節揭露角色真相、勢力底牌與終局規則。
- **口吻錯位**：文字像資料庫註解、寫作提醒或系統設計，不像小說世界內的檔案。
- **信任感破壞**：讀者看到「作者/AI 續寫用」語氣，會失去沉浸感。

### 1.2 PWA 已有基礎，但「手機可用」尚未形成完整驗收

現況已存在 `manifest.json`、`sw.js`，`index.html` 也有 mobile web app meta 與 manifest link；但機密設定頁 `reader/setting-page.html` 尚未補齊同等 PWA meta，且尚未有明確的手機驗收清單。PWA 不能只算「有 manifest」，還需要以下項目一起過關：

- 安裝入口與 `start_url` 體驗符合手機閱讀情境。
- iOS/Android 都有圖示、主題色、安全區域與 standalone 顯示檢查。
- Service Worker 快取策略涵蓋設定頁、章節目錄、必要資產與離線提示。
- 手機版字級、觸控範圍、返回閱讀器、橫向溢出都需要測試。

### 1.3 中文顯示與寫檔流程必須制度化

本 repo 已在 `AGENTS.md` 明確要求繁中內容使用 UTF-8，並禁止用 PowerShell 5.1 的重導向、`Out-File`、`Set-Content` 寫中文。計畫執行時需把這件事列為每次 PR 的品質閘，而不是只靠人工記得。

## 2. 目標

1. **建立讀者版資料層**：讀者端只讀「可公開、分章解鎖、世界內語氣」的檔案，不直接顯示 AI/作者內部 CANON 原文。
2. **改造機密設定敘述**：讓條目像母艦檔案、灰市傳聞、審計報告、裂縫倖存者口供，而不是設定卡。
3. **補齊手機 PWA 驗收**：讓主閱讀器與機密設定頁都能在手機上安裝、離線開啟、正常閱讀。
4. **建立中文安全流程**：所有繁中 `.md`、`.json`、`.html`、`.css`、`.js` 變更都用 UTF-8 驗證，避免 mojibake。

## 3. 非目標

- 不修改小說章節正文。
- 不重寫世界觀正典主檔。
- 不把 `02_PROJECT_DATABASE/04_ARCHIVE/`、`legacy_split/`、`processed_do_not_read` 帶回讀者端。
- 不在讀者端顯示 V7+ 才揭露的深層真相，除非讀者進度已達相應章節且條目已通過劇透審核。

## 4. 建議資訊架構

### 4.1 新增讀者公開資料源

新增一個讀者專用資料目錄，避免前端直接消化 AI 續寫主檔：

```text
reader/public-dossier/
  index.json
  characters.json
  world.json
  power.json
  incidents.json
  rumors.json
```

每個條目使用以下欄位：

```json
{
  "id": "lin-jin",
  "title": "林燼",
  "category": "角色檔案",
  "unlockChapter": 1,
  "spoilerLevel": "safe",
  "voice": "ark-dossier",
  "teaser": "底層維修工。欠稅、拾荒、裂縫任務，是他被允許擁有的全部未來。",
  "readerText": "可直接給讀者看的世界內敘述。",
  "lockedText": "同步率不足。此檔案仍被灰霧遮蔽。",
  "sourceCanon": ["CANON_characters.md#林燼"]
}
```

`sourceCanon` 只作維護追溯，不在 UI 顯示。

### 4.2 保留 CANON 作為生成來源，不作為公開輸出

實作流程應改成：

```text
CANON_* / STATE / VOLUMES（作者與 AI 內部正典）
        ↓ 人工或 agent 轉寫、劇透審核、讀者語氣改寫
reader/public-dossier/*.json（讀者公開資料）
        ↓ 前端依進度解鎖
reader/setting-page.html（沉浸式機密檔案）
```

這樣可保留正典一致性，又能避免把內部設定檔直接攤給讀者。

## 5. 讀者語氣規範

### 5.1 條目應像小說世界內文件

可採以下敘述來源感：

- **母艦審計紀錄**：冷、精準、帶行政壓迫感。
- **灰市情報備忘**：半真半假、帶風險提示。
- **裂縫倖存者口供**：破碎、感官化、帶恐懼。
- **文明主機殘響**：短句、機械、像系統回報但不出戲。

### 5.2 禁用語氣

讀者端條目避免出現：

- 「本卷功能」、「角色弧線」、「伏筆」、「後續揭露」、「作者需注意」。
- 「V7 才揭露」、「終局設計」、「AI 續寫」、「設定上」。
- 尚未在章節內揭露的真相直說。

### 5.3 範例轉寫

內部設定口吻：

> 林燼的跨卷弧線是從底層欠稅者成長為文明主機持有者，後續將逐步揭露母艦牧場真相。

讀者版口吻：

> 欠稅記錄顯示，林燼原本只是第九段維修工。裂縫任務後，他的體徵開始出現不可解釋的穩定化波動。審計系統將此人標記為：需觀察，不得提前清除。

## 6. PWA 手機改善清單

### 6.1 Manifest

- 將 `name`、`short_name` 改為更適合手機桌面的繁中名稱，例如：`末日母艦` / `母艦閱讀器`。
- 補 `id`、`scope`、`lang`、`dir`、`display_override`、`screenshots`（若有）。
- 增加 `purpose: "any maskable"` 圖示，避免 Android 圖示被裁切。
- 檢查 `start_url` 是否需導向 `./index.html` 或帶 `?source=pwa` 方便偵錯。

### 6.2 HTML meta

`index.html` 已有 mobile meta；`reader/setting-page.html` 也應補齊：

- `<link rel="manifest" href="../manifest.json">`
- `<link rel="apple-touch-icon" href="../assets/icon-192.png">`
- `<meta name="mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-title" content="母艦檔案">`
- `<meta name="theme-color" content="#050000">`
- `viewport-fit=cover` 與 safe-area CSS。

### 6.3 Service Worker

- 確認 `sw.js` 快取包含主閱讀器、設定頁、CSS/JS 模組、圖示、封面與必要資料源。
- 對章節 Markdown 採 network-first + cache fallback，避免離線時空白。
- 對 app shell 採 stale-while-revalidate，讓手機啟動速度穩定。
- 新增離線狀態訊息：`離線模式：顯示上次同步資料`。

### 6.4 手機 UI

- 設定頁卡片改為 mobile-first 單欄，桌機再升為雙欄或三欄。
- 觸控按鈕高度至少 44px。
- 避免 hover-only 互動；所有解鎖/遮蔽效果都要支援 tap。
- 檔案內文行長控制在手機可讀範圍，避免橫向捲動。
- 返回閱讀器按鈕固定在安全區域內。

## 7. 實作階段

### Phase 0 — 基準檢查與中文安全

- [ ] 用 `python3` 讀取目標中文檔，確認 UTF-8 可解碼。
- [ ] 用 `git status --short` 確認沒有不相關變更。
- [ ] 禁止使用 PowerShell 5.1 重導向寫中文檔。
- [ ] 若在 Windows 執行，優先使用 `pwsh`，中文內容仍以 Python `pathlib` 寫入。

### Phase 1 — 讀者資料層切分

- [ ] 新增 `reader/public-dossier/`。
- [ ] 建立 `index.json` 與第一批 20–40 個安全條目。
- [ ] 每個條目標註 `unlockChapter`、`spoilerLevel`、`sourceCanon`。
- [ ] 前端讀取來源改為 `reader/public-dossier/*.json`，暫停直接對外顯示 `CANON_*.md` 原文。

### Phase 2 — 條目轉寫與劇透審核

- [ ] 將角色、世界、力量三類各挑 10 個高頻條目重寫為讀者語氣。
- [ ] 將尚未揭露內容改寫為遮蔽文字或傳聞語氣。
- [ ] 建立禁語檢查：`角色弧線|伏筆|作者|AI|後續揭露|設定上|V7`。
- [ ] 以章節進度測試：Ch.1、Ch.30、Ch.90、Ch.175 各看到不同揭露層。

### Phase 3 — PWA 補強

- [ ] 補 `reader/setting-page.html` 的 manifest、apple icon、theme-color、viewport-fit meta。
- [ ] 更新 `manifest.json` 的手機顯示名稱、maskable icon、scope/id/lang。
- [ ] 檢查 `sw.js` 快取清單是否涵蓋新增公開資料源。
- [ ] 加入離線/快取失敗時的讀者友善訊息。

### Phase 4 — 手機閱讀體驗

- [ ] 手機單欄卡片、44px 觸控按鈕、安全區域 padding。
- [ ] 設定頁與閱讀器返回路徑一致。
- [ ] 檢查 iOS Safari standalone、Android Chrome install prompt。
- [ ] 若有可執行瀏覽器環境，對首頁與設定頁截圖留存。

### Phase 5 — 文件與維護流程

- [ ] README 將 `設定資料庫` 區塊分成「讀者公開檔案」與「作者內部正典」。
- [ ] 新增一段 contributor note：公開檔案不得直接貼 CANON 原文。
- [ ] 每次新增條目前，先填 `sourceCanon`，再寫 `readerText`。
- [ ] 每次 PR 都跑 UTF-8 驗證與禁語檢查。

## 8. 驗收標準

### 8.1 讀者體驗

- [ ] 沒有公開顯示 `CANON_*` 內部長段設定語氣。
- [ ] 機密檔案讀起來像世界內資料，而非作者註記。
- [ ] 未讀到相應章節時，只看到 teaser、遮蔽、傳聞或錯誤碼。
- [ ] 解鎖後文字補充閱讀樂趣，但不取代章節正文。

### 8.2 PWA

- [ ] Chrome DevTools Lighthouse PWA 類別無關鍵缺失。
- [ ] 手機瀏覽器可加入主畫面。
- [ ] 從主畫面啟動後是 standalone 體驗。
- [ ] 離線開啟首頁與機密設定頁不空白。
- [ ] 手機寬度 360px 下無橫向捲動。

### 8.3 中文與流程

- [ ] 所有新增/修改文字檔可用 `Path(p).read_text(encoding="utf-8")` 成功讀取。
- [ ] 未使用 PowerShell 5.1 重導向或 `Set-Content` 寫中文。
- [ ] 沒有新增 BOM。
- [ ] Git diff 顯示繁中內容正常。

## 9. 建議命令

```bash
# UTF-8 驗證
python3 - <<'PY'
from pathlib import Path
for p in Path('.').rglob('*'):
    if p.is_file() and p.suffix.lower() in {'.md', '.txt', '.json', '.html', '.css', '.js'}:
        if '02_PROJECT_DATABASE/04_ARCHIVE' in p.as_posix() or 'processed_do_not_read' in p.as_posix():
            continue
        p.read_text(encoding='utf-8')
print('UTF-8 OK')
PY

# 讀者端禁語初檢
rg -n "角色弧線|伏筆|作者|AI|後續揭露|設定上|V7" reader/public-dossier reader/setting-page.html reader/setting-page.js reader/dossier.js reader/modules || true

# PWA 資產清單檢查
node scripts/check-reader-assets.mjs
```

## 10. 推薦優先順序

1. **先做資料層切分**：這是避免劇透與 AI 設定感的根本。
2. **再做 30 個核心條目轉寫**：讓讀者立刻感覺機密檔案變成小說體驗的一部分。
3. **同步補 PWA meta 與 sw 快取**：確保手機可以安裝與離線開啟。
4. **最後補 README 與驗收腳本**：避免後續 agent 又把 CANON 原文直接公開。

## 11. 第一個可交付 PR 建議

第一個 PR 應控制範圍，避免一次改太大：

- 新增 `reader/public-dossier/index.json` 與 10 個安全條目。
- 修改 `reader/modules/dossier-data.js`，優先讀公開資料源。
- 補 `reader/setting-page.html` PWA meta。
- 更新 `sw.js` 快取新增資料源。
- 新增 `scripts/check-public-dossier.mjs` 檢查禁語與必要欄位。

完成後再開第二個 PR 擴充條目與手機 UI 細節。
