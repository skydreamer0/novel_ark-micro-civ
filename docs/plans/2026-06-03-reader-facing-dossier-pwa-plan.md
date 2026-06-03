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

## 2.1 分階段處理原則

這個改善案必須拆成多個小 PR 處理，不能一次把資料層、UI、PWA、README、驗收腳本全部混在同一個變更中。

- **一次只做一個階段**：每次開始前先確認目前要做的是 Phase 0、1、2、3、4 或 5。
- **每階段都要有停止點**：完成該階段後先提交、建立 PR、回報驗收結果，再進下一階段。
- **禁止跨階段偷改**：例如 Phase 1 只建立資料層與最小讀取切換，不順手重寫大量 UI；Phase 3 只補 PWA，不順手新增劇透條目。
- **每階段都跑 UTF-8 檢查**：若掃到既有非本階段問題，只記錄 warning，不把不相關正文或封存檔納入同一 PR。
- **任何會影響讀者畫面的階段都要截圖**：若環境可執行瀏覽器，手機寬度與桌機寬度各留一張；若環境不可行，在 PR 測試區明確標註限制。


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

## 7. 分階段實作路線

> 執行規則：每個 Phase 都是獨立交付單位。除非使用者明確要求，否則 agent 完成一個 Phase 後必須停止，不得自動進入下一個 Phase。

### Phase 0 — 基準檢查與防呆（文件／腳本，不改 UI）

**目的**：先把現況量清楚，避免後續一邊改 UI 一邊發現資料源、PWA、UTF-8 問題。

**允許修改**：

- `docs/plans/` 下的計畫文件。
- 新增或修改檢查腳本，例如 `scripts/check-public-dossier.mjs`。
- 必要時補 README 的「如何跑檢查」一句話；不改讀者介面。

**交付物**：

- [ ] 明確列出現有前端仍直接讀 `CANON_*` 的位置。
- [ ] 明確列出目前 PWA 已有項目與缺口。
- [ ] 建立或規劃 UTF-8／BOM／禁語檢查命令。
- [ ] 記錄既有 BOM 或 mojibake 問題，但不在本階段修正文。

**停止點**：提交 Phase 0 PR，回報「下一階段要不要開始建立讀者公開資料層」。

### Phase 1 — 讀者公開資料層最小切片（資料，不大改視覺）

**目的**：先切斷「讀者端直接顯示 AI/作者內部 CANON 原文」的主要風險。

**允許修改**：

- 新增 `reader/public-dossier/index.json`。
- 新增第一批 8–12 個安全條目，只選 Ch.1–Ch.30 已揭露內容。
- 修改 `reader/modules/dossier-data.js`，讓前端優先讀公開資料層；必要時保留舊來源為開發 fallback，但預設不公開顯示 `CANON_*` 長文。
- 更新 `sw.js` 快取新增的公開資料源。

**禁止修改**：

- 不重寫大量 CSS。
- 不新增 Ch.30 之後才揭露的真相條目。
- 不改小說正文與 `CANON_*` 主檔。

**交付物**：

- [ ] 公開資料條目具備 `id`、`title`、`category`、`unlockChapter`、`spoilerLevel`、`teaser`、`readerText`、`lockedText`、`sourceCanon`。
- [ ] UI 能顯示公開資料層條目。
- [ ] 舊 CANON 原文不再作為讀者端主要顯示內容。
- [ ] 禁語檢查不命中公開資料層。

**停止點**：提交 Phase 1 PR，請使用者確認「讀者口吻」是否正確，再進 Phase 2。

### Phase 2 — 條目轉寫與劇透審核（內容，不碰 PWA）

**目的**：把機密檔案從設定卡改成小說世界內可讀文本。

**允許修改**：

- `reader/public-dossier/*.json`。
- 必要的資料驗證腳本。

**分批方式**：

- Phase 2A：角色檔案 10 則。
- Phase 2B：世界／地點／勢力檔案 10 則。
- Phase 2C：力量／資源／事件檔案 10 則。

每個子階段都可獨立 PR；如果條目文字量大，優先拆成 2A、2B、2C。

**驗收重點**：

- [ ] 條目像「母艦檔案／灰市情報／裂縫口供」，不是作者設定。
- [ ] 未揭露內容使用遮蔽、錯誤碼、傳聞或同步率不足提示。
- [ ] Ch.1、Ch.30、Ch.90、Ch.175 測試能看到不同揭露層。

**停止點**：每個 2A/2B/2C PR 後停下，讓使用者抽查語氣與劇透程度。

### Phase 3 — PWA 安裝與離線能力（平台，不重寫內容）

**目的**：補齊手機可安裝、可離線開啟、設定頁同樣具備 PWA meta 的缺口。

**允許修改**：

- `manifest.json`。
- `index.html`。
- `reader/setting-page.html`。
- `sw.js`。
- 必要時更新 `scripts/check-reader-assets.mjs`。

**交付物**：

- [ ] `manifest.json` 補 `id`、`scope`、`lang`、`dir`、maskable icon purpose。
- [ ] 設定頁補 manifest、apple touch icon、theme-color、standalone 相關 meta。
- [ ] Service Worker 快取公開資料源與設定頁必要資產。
- [ ] 離線時首頁與設定頁不空白，至少顯示上次快取或友善錯誤。

**停止點**：提交 Phase 3 PR，附手機/PWA 檢查結果或環境限制說明。

### Phase 4 — 手機閱讀體驗與沉浸式 UI（視覺，不改資料規則）

**目的**：處理「手機可以看」與「像讀者用的機密檔案」的實際介面問題。

**允許修改**：

- `reader/setting-page.css`。
- `reader/setting-page.html` 的語意結構。
- 必要的 `reader/dossier.js` 或 render module 小幅調整。

**交付物**：

- [ ] 360px 寬度無橫向捲動。
- [ ] 觸控按鈕高度至少 44px。
- [ ] 無 hover-only 功能；遮蔽與解鎖互動支援 tap。
- [ ] 返回閱讀器按鈕在 safe area 內可操作。
- [ ] 若可行，提供手機寬度截圖。

**停止點**：提交 Phase 4 PR，請使用者確認視覺風格再擴充動畫或特效。

### Phase 5 — 文件、維護流程與長期防回歸

**目的**：避免後續又把 AI 內部設定直接放回讀者端。

**允許修改**：

- `README.md`。
- `docs/plans/` 或 `docs/agents/` 相關維護說明。
- 檢查腳本與 CI 說明。

**交付物**：

- [ ] README 分清楚「讀者公開檔案」與「作者內部正典」。
- [ ] contributor note 明確禁止公開資料層直接貼 `CANON_*` 原文。
- [ ] 每次新增條目前需填 `sourceCanon`，再寫 `readerText`。
- [ ] 文件列出 UTF-8／禁語／PWA asset 檢查命令。

**停止點**：提交 Phase 5 PR，整個改善案才算進入維護狀態。

### 建議執行順序

1. **Phase 0**：補防呆與檢查，不碰 UI。
2. **Phase 1**：建立最小公開資料層，先解決 AI 設定外露問題。
3. **Phase 2A–2C**：分批轉寫條目，讓使用者可逐批審口吻。
4. **Phase 3**：補 PWA 安裝與離線。
5. **Phase 4**：調手機 UI 與沉浸感。
6. **Phase 5**：補 README 與長期防回歸。

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

## 10. 下一步建議

下一個 PR 建議只做 **Phase 0**，不要直接進入大改：

- 新增 `scripts/check-public-dossier.mjs` 的雛形，先定義必要欄位、禁語與 UTF-8/BOM 檢查。
- 掃描現有讀者端資料來源，列出仍直接讀 `CANON_*` 的位置。
- 掃描 PWA 缺口，確認 `manifest.json`、`sw.js`、`reader/setting-page.html` 需要補哪些項目。
- 記錄既有 BOM 問題為 warning，不在同一 PR 修正文。

Phase 0 通過後，再開 Phase 1：新增 `reader/public-dossier/index.json` 與 8–12 個 Ch.1–Ch.30 安全條目，並讓設定頁優先讀公開資料層。
