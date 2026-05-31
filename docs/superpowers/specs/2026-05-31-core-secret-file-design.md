# 設計規格書：核心機密檔案系統 (Core Secret File)

**日期**：2026-05-31
**狀態**：已定案
**背景**：將 `reader/setting-page.html` 重構為具有沉浸感、隨劇情進度解鎖的「異星血肉科技」風檔案庫。

---

## 1. 核心目標
- **沉浸式體驗**：建立符合「母艦/母巢」設定的視覺氛圍 (Abyss UI)。
- **分級解鎖**：條目內容隨讀者閱讀進度 (localStorage) 分級揭露。
- **數據合併**：結合 JSON 的動態報告與 Markdown 的深度考據。
- **Sync Pulse**：將數據同步延遲包裝為劇情中的「駭入/同步」體驗。
- **進度持久化**：支援存檔碼導出/導入，解決跨設備同步問題。

---

## 2. 視覺與互動設計 (Abyss UI)

### 2.1 視覺風格
- **主色調**：深紅 (#800000)、黑 (#050000)、亮紅 (#ff3333)。
- **特效**：徑向漸變、掃描線、微弱脈動感、隨機 Glitch 特效。
- **字體**：`Noto Serif TC` (主要內容)、`Monospace` (系統狀態)。

### 2.2 分級揭露機制 (Graded Disclosure)
| 等級 | 標題 | 分類/章節標籤 | 內容狀態 | 互動效果 (Click) |
|---|---|---|---|---|
| **Level 1: Partial** | 清晰 | 顯示 | Mental-blur | 輕微震動 + 短警告 |
| **Level 2: Restricted** | 部分遮蔽 | 隱藏章節 (顯示需更高同步率) | 強 Mental-blur + 重影 | 中度 Shake + 錯誤代碼 |
| **Level 3: Blackbox** | 模糊/代號 | 顯示 BLACK BOX | 強效雜訊 + 錯誤提示 | 強 Shake + 紅色警告；連點 3 次顯示特殊文案 |

---

## 3. 數據架構與元數據 (Metadata)

### 3.1 數據源優先級
1. **JSON (`_GLOSSARY.json`)**：主要資料源。控制解鎖章節、階段、等級與分類。
2. **Markdown (`CANON_*.md`)**：補充資料層。提供深度設定與長篇說明。
3. **合併規則**：同名條目時，JSON 規則覆蓋 Markdown，但內容採「合併補充」。

### 3.2 標記規範
- **Markdown**：`### 條目名稱 <!-- unlock: 86 visibility: restricted category: character -->`
- **JSON**：
```json
{
  "term": "白扣",
  "category": "角色",
  "visibility": "blackbox",
  "unlock_stages": [
    { "chapter": 120, "text": "階段二說明" }
  ]
}
```

---

## 4. 實作邏輯 (Logic Flow)

### 4.1 進度判定
1. 讀取 `localStorage` 進度 (由閱讀器寫入)。
2. 計算 `user_progress`。
3. 比對條目之 `unlock` 章節號。

### 4.2 Sync Pulse (背景同步)
1. **快取優先**：進入頁面先顯示上次同步之快取數據。
2. **背景同步**：發送請求至 GitHub API 獲取最新內容。
3. **頂部狀態欄**：
   - 同步中：`正在同步母巢數據...`
   - 已更新：`同步完成：新增檔案已解封` (觸發解鎖動畫)
   - 離線：`離線模式：顯示上次同步資料`
4. **解鎖動畫**：內容從模糊轉清晰時，伴隨紅色掃描線掃過與「權限節點已重建」提示。

---

## 5. 進度管理 (Save/Load)

### 5.1 數據導出/導入
- **方案**：純前端處理，不依賴後端。
- **導出**：將進度與已解鎖條目轉為 JSON，Base64 編碼為「存檔碼」。
- **導入**：解析存檔碼，若進度較高則覆蓋 `localStorage`。
- **包裝**：UI 稱為「導出/導入記憶片段」，失敗時提示「本地記憶斷層」。

---

## 6. PWA 與性能優化
- **Service Worker**：Stale-while-revalidate 策略。
- **渲染優化**：僅重繪狀態改變的卡片，Markdown 解析結果使用 Session Cache。
- **手機適配**：Mobile-first 佈局，支援 Safe Area 與手勢操作。
