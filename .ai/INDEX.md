# 《微光文明》檔案索引

> 本索引定義專案所有目錄與檔案的用途，以及 AI 在寫作/續寫時應如何讀取。
> **路徑格式**：以專案根目錄 `novel_ark-micro-civ/` 為起點。

---

## 📂 目錄結構總覽

```
novel_ark-micro-civ/
├── .ai/                          ← ★ AI 入口（先讀這裡）
│   ├── SUMMARY.md                ← ★ 必讀。全書一句話摘要 + 核心設定 + 進度
│   └── INDEX.md                  ← 本檔案。完整的檔案地圖
│
├── 01_NOVEL_CONTENT/             ← ★ 小說正文
│   ├── 01_第一卷_艙底種火/       ← 第1～30章
│   ├── 02_第二卷_裂縫稅戰/       ← 第31～60章
│   ├── 03_第三卷_聖城試煉/       ← 第61～90章
│   └── 04_第四卷_投放名冊/       ← 第91～120章
│
├── 02_PROJECT_DATABASE/          ← ★ 專案資料庫（寫作參考）
│   ├── 00_CORE/                  ← ★ 核心設定（AI 續寫前必須讀取）
│   ├── 01_RULES/                 ← 寫作規則與風格指南
│   ├── 02_DETAILS/               ← 補充細節（需要時再讀）
│   └── 99_ARCHIVE/               ← ❌ 封存資料（AI 不應讀取）
│
├── .agent/                       ← 本機 AI 代理設定（opencode）
├── assets/                       ← 網頁讀者介面資源
├── docs/                         ← 開發/修復文件
│   ├── plans/                    ← ❌ 已封存，請讀 99_ARCHIVE
│   └── roadmap/                  ← ❌ 已封存，請讀 99_ARCHIVE
│
├── app.js                        ← 網頁閱讀器
├── index.html                    ← 網頁閱讀器入口
├── styles.css                    ← 網頁樣式
├── sw.js                         ← Service Worker
├── manifest.json                 ← PWA manifest
├── reader.config.json            ← 閱讀器設定
└── robots.txt                    ← 爬蟲規則
```

---

## 📖 應讀取順序（AI 快速上手）

### 第1步（必讀）：`.ai/SUMMARY.md`
全書濃縮——5 分鐘內了解世界觀、角色、進度、寫作規則。

### 第2步（必讀）：`02_PROJECT_DATABASE/00_CORE/`
依編號順序讀取，即可完整掌握核心設定。

| # | 檔案 | 內容 |
|---|---|---|
| 00 | `unified_arch.md` | **最高邏輯準則**：母艦=OS、權限/能級循環 |
| 01 | `world_summary.md` | **世界觀總結**：母艦結構、經濟、外域、人口控制 |
| 02 | `power_system.md` | **力量體系**：H-Compute、主機版本、覆寫、代價 |
| 03 | `characters.md` | **角色卡**：主角、盟友、反派人設與行為邏輯 |
| 04 | `plot_outline.md` | **劇情大綱**：重大轉折（無細節描寫） |
| 05 | `glossary.md` | **詞彙表**：統一全書用語 |
| 06 | `factions.md` | **勢力設定**：勢力類型、壟斷點、戰鬥風格 |
| 07 | `foreshadowing.md` | **伏筆追蹤表**：已埋/已回收/待回收 |
| 08 | `current_state.md` | **目前進度**：第120章狀態錨點 |
| 09 | `volume_outlines.md` | **分卷大綱**：各卷劇情與章節分配 |

### 第3步（需要時）：`02_PROJECT_DATABASE/01_RULES/`

| # | 檔案 | 內容 |
|---|---|---|
| 01 | `writing_rules.md` | **寫作硬性規範**：字數、節奏、章節連貫性、防混規則 |
| 02 | `style_guide.md` | **語感標準**：節奏、段落、台詞、系統提示風格 |
| 03 | `revision_rules.md` | **修訂與審稿**：品質門檻、AI 味檢測 |
| 04 | `global_rules.md` | **AI 寫作工作流**：Prompt 模板、修訂 Prompt、審稿 Prompt |

### 第4步（補充用）：`02_PROJECT_DATABASE/02_DETAILS/`

| 目錄 | 內容 |
|---|---|
| `worldview/` | 母艦結構、熵潮、社會秩序、意識形態等細部設定 |
| `power/` | 力量文明詳細表格、資源轉化公式 |
| `templates/` | 反派誤判、打臉五步法、章節鉤子等寫作模板 |

---

## ❌ 不需讀取的區域

以下目錄為歷史封存或網頁技術檔案，AI 續寫時不要讀取：

| 路徑 | 原因 |
|---|---|
| `02_PROJECT_DATABASE/99_ARCHIVE/` | 舊版設定/計劃/範例，與現行設定不一致 |
| `02_PROJECT_DATABASE/99_ARCHIVE/no_crawl/` | 明確標記為「不爬蟲」的舊資料 |
| `docs/plans/` | 修復計劃文件（2026-05-16 歷史紀錄） |
| `docs/roadmap/` | 修復路線圖（歷史紀錄） |
| `assets/` | 網頁前端資源 |
| `.agent/` | 本機 AI 代理設定 |
| `*.js`, `*.css`, `*.html`, `sw.js`, `manifest.json`, `reader.config.json` | 網頁閱讀器代碼 |

---

## 🔄 寫作/續寫工作流

```
1. 讀 .ai/SUMMARY.md                    → 喚醒全局記憶
2. 讀 02_PROJECT_DATABASE/00_CORE/08    → 確認當前狀態錨點
3. 讀 02_PROJECT_DATABASE/00_CORE/07    → 確認伏筆回收狀態
4. 讀 02_PROJECT_DATABASE/01_RULES/01   → 確認寫作規範
5. 讀目標卷最後 3 章正文                → 確認文風與連貫性
6. 撰寫新章
7. 更新 00_CORE/08（current_state.md）
8. 更新 00_CORE/07（foreshadowing.md）
9. 更新 .ai/SUMMARY.md
```
