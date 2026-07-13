# 🌌 末日母艦：我的體內有個微縮文明 (Ark-Micro-Civ)

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-brightgreen?style=for-the-badge&logo=github)](https://skydreamer0.github.io/novel_ark-micro-civ/)
[![Tech Stack](https://img.shields.io/badge/Web%20Reader-Vanilla%20JS%20%7C%20PWA-blue?style=for-the-badge)](#)
[![Encoding](https://img.shields.io/badge/Encoding-UTF--8%20(No%20BOM)-orange?style=for-the-badge)](#)

這是一個**融合小說內容創作、AI 協同寫作環境以及 PWA 離線閱讀器 SPA** 的一體化專案。本專案包含科幻小說《末日母艦：我的體內有個微縮文明》的完整設定庫、已發表的章節手稿，以及用於本地與線上閱讀的現代化單頁 Web 應用程式 (SPA)。

---

## 📂 專案目錄結構

介紹專案中各個模組的作用，以便開發與寫作：

| 目錄 / 檔案 | 職責與說明 |
| :--- | :--- |
| **`01_NOVEL_CONTENT/`** | 小說章節正文手稿，按卷區分（`01_第一卷` ～ `10_第十卷`），以 Markdown 格式儲存。 |
| **`02_PROJECT_DATABASE/`** | 小說設定與設定集主檔。包含當前狀態、世界觀 Facts、角色卡、力量系統、寫作風格指南與未來大綱。 |
| **`reader/`** | 閱讀器應用的前端實作（包括 CSS/JS/HTML），採 Vanilla JS + ES Modules 架構。 |
| **`.agent/`** | 本地 AI 寫作代理的技能（Skills，如 `novel-writer`）與工作流（Workflows）。 |
| **`scripts/`** | 自動化輔助腳本（例如字數統計、資產檢查、格式校正）。 |
| **`index.html`** | 閱讀器前端 SPA 的主入口頁面。 |
| **`sw.js`** / **`manifest.json`** | 閱讀器 PWA 離線支援與應用安裝設定。 |
| **`AGENTS.md`** | 本地 AI 代理在讀取與編輯本專案時需嚴格遵守的開發與寫作協作規範。 |
| **`CONTEXT-MAP.md`** | AI 代理人的網域上下文與設定檔案對照表。 |

---

## 📖 小說簡介與核心設定

### 故事大綱
母艦「方舟」載著最後的人類文明，航行在無盡的虛空中。底層居民唯一的出路，就是踏入外域裂縫，用命去換取資源。
林燼，一個欠著巨額生存稅的底層維修工兼拾荒者，在一次險些喪命的裂縫任務中，意外啟動了寄生在自己體內的神秘裝置——**「文明主機」**。它能在體內孕育微縮文明、吸收信仰之力。林燼以此為燃料，走上了一條與所有人截然不同的進化之路。但隨著力量的增長，他逐漸發現整座賽博都市、外域裂縫、高不可攀的統治階層……不過是更高維度收割體系中，一座精心設計的牧場。而他，要做的不是逃離，而是把整座牧場連根拔起。

### 📚 核心設定文檔導覽
設定資料庫統一存放於 `02_PROJECT_DATABASE/`，請點擊下方連結深入了解：

* **當前狀態與決策**：[`STATE.md`](02_PROJECT_DATABASE/STATE.md) — 追蹤章節錨點、開放伏筆、衝突弧線、待辦決策。**續寫與規劃前必讀！**
* **世界設定事實**：[`CANON_world.md`](02_PROJECT_DATABASE/CANON_world.md) — 母艦結構、深淵、規則霧、勢力、經濟與術語表。
* **人物誌角色卡**：[`CANON_characters.md`](02_PROJECT_DATABASE/CANON_characters.md) — 核心人物卡、跨卷弧線與關係動態圖。
* **力量與資源系統**：[`CANON_power.md`](02_PROJECT_DATABASE/CANON_power.md) — 文明主機版本 (V0–V14)、能源 (L/H/碎片/燃料) 與雙人口體系。
* **寫作風格與鐵則**：[`STYLE.md`](02_PROJECT_DATABASE/STYLE.md)（敘事質地與主機台詞）與 [`RULES.md`](02_PROJECT_DATABASE/RULES.md)（寫作公式與質量驗收閘）。
* **未來大綱與藍圖**：[`FUTURE.md`](02_PROJECT_DATABASE/FUTURE.md) — 終局揭密世界觀、寫作路線圖與規劃。
* **各卷大綱架構**：[`VOLUMES/`](02_PROJECT_DATABASE/VOLUMES/) — vol01 至 vol06 各卷分章細部規劃。

---

## 💻 閱讀器 Web App (SPA)

本專案的前端是一個高效的**漸進式網頁應用程式 (PWA)**，專為流暢閱讀本專案 Markdown 格式小說而設計。

### 🌟 特色功能
* **零依賴與極致效能 (Vanilla JS)**：使用原生 ES Modules，無需打包與編譯，隨啟隨用。
* **PWA 與離線支援**：註冊 Service Worker 進行 `stale-while-revalidate` 資源快取，即使無網路也能讀取已暫存章節。
* **動態詞彙提示 (Glossary)**：自動解析正文並為設定詞彙提供游標懸停/點擊即時浮窗提示。
* **機密檔案與解鎖 (Dossier)**：包含動態解鎖人物背景檔案等互動功能。
* **文字朗讀 (TTS)**：支援利用瀏覽器內建 Web Speech API 進行語音朗讀與語速調整。
* **全文字元檢索**：支援快速搜尋所有章節內文。

### 🛠️ 本地啟動與開發
由於閱讀器依賴 ES Modules 以及 Service Worker 進行快取，**無法直接透過 `file://` 協議雙擊開啟 `index.html`**。

請使用以下任一方式在本地運行靜態伺服器：

#### 1. 使用 Node.js (`npx`)
```bash
# 在專案根目錄下執行
npx http-server -p 8080
```
完成後瀏覽 [http://localhost:8080](http://localhost:8080)。

#### 2. 使用 Python
```bash
# Python 3
python -m http.server 8080
```
完成後瀏覽 [http://localhost:8080](http://localhost:8080)。

#### 3. VS Code Live Server 插件
在 VS Code 中安裝 `Live Server` 擴充套件，右鍵點選根目錄的 `index.html`，點選 **"Open with Live Server"**。

---

## 🤖 AI 協同寫作系統 (Agent Workflows)

本專案深度整合了專用寫作代理，支援人機協同寫作。詳細協作指南與硬性編碼規範請見 [AGENTS.md](AGENTS.md)。

### 🛠️ 支援的 AI 工作流命令
你可以直接在 AI 對話中利用以下工作流命令推動章節產出：
* `/chapter-planner`：規劃特定章節的節奏、衝突、伏筆佈局與鉤子。
* `/write-chapter`：依據最新設定與風格規範，撰寫新章節正文。
* `/chapter-qa`：完稿後的自動化質量審查（包含字數、伏筆回收、第四面牆檢測等）。
* `/chapter-fusion`：平滑融合設定變更、舊稿修訂與新橋段，消除拼接痕跡。
* `/volume-planner`：規劃全新分卷的大綱與結構。
* `/world-builder`：安全地擴充世界觀設定，避免與已有 CANON 設定衝突。
* `/full-chapter-pipeline`：一鍵執行 planner -> write -> QA 完整鏈條。

### ⚠️ Traditional Chinese 檔案編碼鐵則（防止亂碼）
為確保繁體中文內文在不同作業系統（特別是 Windows 終端）間傳輸時不發生亂碼（Mojibake），所有開發者與 AI 代理人必須遵守：
1. **所有文字檔案必須儲存為 UTF-8 without BOM 格式**。
2. **絕對不要在 PowerShell 中使用 `>`, `>>`, `Out-File` 或 `Set-Content` 寫入中文檔案**（預設會編碼為 ANSI/UTF-16）。
3. **推薦使用 Python 腳本** 進行讀寫操作並明確指定編碼：
   ```python
   from pathlib import Path
   # 寫入
   Path("path/to/file.md").write_text(content, encoding="utf-8")
   # 讀取
   text = Path("path/to/file.md").read_text(encoding="utf-8")
   ```

---

## 📈 小說寫作進度

| 卷數 | 章節範圍 | 卷標題 | 狀態 |
| :---: | :---: | :--- | :---: |
| **第一卷** | Ch.1 – 30 | 艙底種火 | ✅ 完稿 |
| **第二卷** | Ch.31 – 60 | 裂縫稅戰 | ✅ 完稿 |
| **第三卷** | Ch.61 – 90 | 聖城試煉 | ✅ 完稿 |
| **第四卷** | Ch.91 – 120 | 投放名冊 | ✅ 完稿 |
| **第五卷** | Ch.121 – 160 | 黑箱斷流 | ✅ 完稿 |
| **第六卷第一幕** | Ch.161 – 175 | 母艦全面反制 | ✅ 完稿 |
| **第六卷第二～三幕** | Ch.176 – 210 | 權限戰爭 | ⏳ 規劃中 |

> 全書規劃 390+ 章，目前已完成 175 章（進度約 44.9%）。

---
*(本專案僅供小說個人創作與閱讀器前端技術實驗使用。)*
