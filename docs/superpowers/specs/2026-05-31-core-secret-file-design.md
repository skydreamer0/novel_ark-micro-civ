# 設計規格書：核心機密檔案系統 (Core Secret File)

**日期**：2026-05-31
**狀態**：等待評審
**背景**：目前 `reader/setting-page.html` (機密設定集) 視覺單調且缺乏互動。為了拓展小說邊界，需將其重構為具有沉浸感、隨劇情進度解鎖的「異星血肉科技」風檔案庫。

---

## 1. 核心目標
- **沉浸式體驗**：建立符合「母艦/母巢」設定的視覺氛圍 (Abyss UI)。
- **進度聯動**：條目內容隨讀者閱讀進度 (localStorage) 自動解鎖。
- **低維護成本**：內容定義與解鎖規則直接嵌入現有設定檔 (Markdown/JSON)。
- **PWA/行動端優化**：確保在手機 standalone 模式下完美呈現，並支援離線存取。

---

## 2. 視覺與互動設計 (Abyss UI)

### 2.1 視覺風格
- **主色調**：深紅 (#800000)、黑 (#050000)、亮紅 (#ff3333)。
- **背景特效**：徑向漸變、掃描線、微弱的脈動感 (Pulse animation)。
- **字體**：`Noto Serif TC` (襯線體)，營造檔案的嚴肅與神祕感。

### 2.2 解鎖特效 (Locked State)
- **Mental-blur (精神壓迫)**：
  - 未解鎖條目套用 `blur(8px)`、`skewX` 扭曲、紅藍重影動畫。
  - 疊加提示文字：`[ 數據過載：權限不足 ]`。
- **解鎖動畫**：達到條件時，模糊濾鏡平滑消失，文字從暗灰色轉為清晰。

### 2.3 階層式解鎖 (Multi-stage)
- 支援同一條目顯示多個「階段」。
- 底部顯示進度點 (Stage dots)，視覺化呈現該角色/系統的資訊揭露程度。

---

## 3. 數據架構與元數據 (Metadata)

### 3.1 Markdown 標籤 (`CANON_*.md`)
在 `###` 標題後方加入隱形註解：
```markdown
### 條目名稱 <!-- unlock: 章節號 -->
```
- **解析器**：JS 使用 Regex 提取 `unlock` 數值。

### 3.2 JSON 結構 (`_GLOSSARY.json`)
支援 `unlock_stages` 欄位：
```json
{
  "term": "名詞",
  "unlock_stages": [
    { "chapter": 10, "text": "初期說明" },
    { "chapter": 100, "text": "後期真相" }
  ]
}
```

---

## 4. 實作邏輯 (Logic Flow)

1. **獲取進度**：讀取 `localStorage['reader-last-read']` 或 `reader-read`，計算已讀最高章節。
2. **檔案處理**：
   - 遍歷所有條目。
   - 比較 `user_progress` 與 `unlock_at`。
3. **渲染規則**：
   - `進度 < 解鎖點` -> 套用 `.locked` class。
   - `進度 >= 解鎖點` -> 顯示全文。
   - **多階段**：僅顯示 `chapter <= 進度` 的所有段落。

---

## 5. PWA 與行動端相容性 (PWA & Mobile)

### 5.1 響應式佈局
- **Dossier Grid**：在手機端自動轉為單欄顯示 (Mobile-first)。
- **Safe Area**：確保內容不被手機瀏海或手勢列遮擋。

### 5.2 PWA 整合
- **Service Worker**：將 `setting-page.js` 與 `setting-page.css` 加入 `sw.js` 預存清單。
- **Theme Color**：`manifest.json` 的 `theme_color` 需與機密檔案頁面風格協調（深色系）。
- **Offline**：即使離線也能查看已解鎖的機密檔案。

---

## 6. 測試計畫
- **功能測試**：手動修改 `localStorage` 模擬不同章節進度，驗證內容是否正確解鎖。
- **視覺測試**：在不同螢幕尺寸下檢查 CSS 特效與佈局。
- **PWA 測試**：斷網模式下驗證頁面是否可正常讀取快取數據。
