---
description: 一鍵全流程：從章節規劃到正文撰寫到品質審查，串聯 /chapter-planner → /write-chapter → /chapter-qa 三步。
---

# 一鍵全流程 (Full Chapter Pipeline)

> 整合「規劃 → 撰寫 → 審查」三階段的端到端工作流。
> 使用此工作流可省去手動切換三個獨立工作流的步驟。

---

## Phase 1: 章節規劃（等同 `/chapter-planner`）

### Step 1.1: 讀取上下文
// turbo
1. 讀取目標卷最後一章完整內容（`01_NOVEL_CONTENT/0X_第X卷/` 中最新章節），重點關注最後 1000 字。
// turbo
2. 讀取 `02_PROJECT_DATABASE/STATE.md (§1 快照、§4 時間線、§9 決策清單)` 中的分卷大綱與進度錨點。
// turbo
3. 讀取 `02_PROJECT_DATABASE/STATE.md §6 開放伏筆`，確認是否有 🔴 待回收伏筆。
// turbo
4. 讀取 `02_PROJECT_DATABASE/STATE.md §7 衝突弧線`，確認當前高張力弧線。
// turbo
5. 讀取 `02_PROJECT_DATABASE/CANON_power.md §1-§9 主機版本`，確認主角當前能力。

### Step 1.2: 確認本章目標
若使用者未給予完整指示，依據上下文自行定義：
- **【本章目標】**：主角要完成什麼、拿到什麼、撐過什麼。
- **【本章必推主線】**：戰力線、文明線、真相線（至少兩條）。
- **【本章主要衝突】**：壓力來源。
- **【本章不可逆變化】**：結束後什麼東西不能回到原狀。
- **【本章結尾鉤子】**：下一章能直接承接的壓力。

### Step 1.3: 產出章節規劃
參考 `02_PROJECT_DATABASE/RULES.md §7 專家小組` 的六位專家視角，產出 9 點標準格式：
1. 本章一句話核心
2. 四段式節奏規劃（前 500 字切入危機）
3. 本章推動的主線
4. 本章主要衝突與轉折
5. 本章代價與收穫
6. 本章不可逆變化
7. 本章章尾鉤子
8. 設定衝突檢查
9. 可能產生拼接感的位置與修補方案

**⚠️ 呈給使用者確認後才進入 Phase 2。**

---

## Phase 2: 正文撰寫（等同 `/write-chapter`）

### Step 2.1: 寫作準備
// turbo
1. 讀取 `02_PROJECT_DATABASE/STYLE.md §2 視角法則`。
// turbo
2. 讀取 `02_PROJECT_DATABASE/STYLE.md §7 範例段落`。
// turbo
3. 讀取 `02_PROJECT_DATABASE/STYLE.md §6 角色台詞風格`。
// turbo
4. 讀取 `.ai/視角技法示範.md` — 確認視角鎖定與感知寫作的具體範例。

### Step 2.2: 正文撰寫
嚴格依據 Phase 1 確認的規劃撰寫正文：
- 使用繁體中文。
- 字數 **3000～4500 字** 為目標。
- 每章鎖定單一感知主體，不跳入其他角色內心。
- 戰鬥必須改變局勢，對話必須服務於信息差與壓力。
- 章尾必須留下可直接承接下一章的壓力。

### Step 2.3: 正文輸出
將正文寫入 `01_NOVEL_CONTENT/0X_第X卷/第XXX章_章名.md`。

文末必須以 HTML 註釋格式附上：
<!--
1. 本章推進了哪些主線
2. 哪個伏筆被觸發、推進或回收
3. 哪個變化不可逆
4. 下章可直接承接的壓力
-->

---

## Phase 3: 品質審查（等同 `/chapter-qa`）

### Step 3.1: 基礎規格品管
1. **字數檢核**：≥ 3000 字（排除空白行與章名）。
2. **開場檢核**：前 500 字內是否有危機/衝突/異常。
3. **後設污染檢查**：執行工具掃描，禁絕 `【...卷...】` 等後設用語滲入正文。

### Step 3.2: 六位專家聯合會審
依據 `02_PROJECT_DATABASE/RULES.md §7 專家小組` 定義的六位專家進行審查。

### Step 3.3: 伏筆與辭典檢查
- 比對 `02_PROJECT_DATABASE/STATE.md §6 開放伏筆` 確認可回收項目。
- 掃描是否有未收錄於 `02_PROJECT_DATABASE/CANON_world.md §23 統一術語表` 的新名詞。

### Step 3.4: 產出品管評級
整合審查結果，給出 🟢/🟡/🔴 評級。

- **🟢 → 進入 Phase 4**
- **🟡 → 列出修改項，修改後進入 Phase 4**
- **🔴 → 退回 Phase 2 重寫**

---

## Phase 4: 文檔同步

// turbo
1. 更新 `02_PROJECT_DATABASE/STATE.md (§1 快照、§4 時間線、§9 決策清單)` 的進度錨點。
// turbo
2. 更新 `02_PROJECT_DATABASE/STATE.md §6 開放伏筆`（新伏筆/已回收伏筆）。
// turbo
3. 更新 `02_PROJECT_DATABASE/STATE.md §7 衝突弧線`（弧線狀態變化）。
// turbo
4. 更新 `.ai/SUMMARY.md`（進度與敘事線描述）。
// turbo
5. 掃描新增專有名詞，提示更新 `02_PROJECT_DATABASE/CANON_world.md §23 統一術語表`。
