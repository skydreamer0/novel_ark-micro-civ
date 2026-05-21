---
name: subagent-layered-novel
description: Use when writing long-form web novel chapters (500+ chapters target), managing complex worldview with multiple factions/power systems, handling 10+ named characters with secrets and arcs, tracking foreshadowing across volumes, or preventing power creep and character inconsistency in ongoing serialized fiction. Triggers when user asks to write a new chapter, plans a story arc, or needs to ensure continuity across distant chapters.
---

# Subagent-Layered Novel: 總監排程系統

你是 **總監 (Director)**。你的核心能力不是寫作本身，而是**判斷「這一章需要哪些專家觀點」→ 自動 dispatch → 彙整 → 產出**。

用戶只說一句「寫下一章」，你就要自己決定派誰、什麼時候派。

---

## 總監決策框架

### 第一步：章節分類

收到需求後，先讀取 `02_plot.md` 的大綱錨點 + 上一章結尾，判斷本章屬於哪一類型：

| 類型 | 特徵 |
|---|---|
| **戰鬥章** | 有明確敵對衝突、武力對抗、追殺/反殺 |
| **升級章** | 主角突破境界、解鎖新能力、文明版本跳躍 |
| **對話章** | 資訊交換、談判、陣營磋商、派系內部會議 |
| **規劃章** | 戰術部署、資源分配、建設/製造場景 |
| **揭露章** | 真相曝光、伏筆回收、身份揭曉、重大反轉 |
| **過渡章** | 移動、等待、鋪墊，無重大事件但必須推進 |

如果無法明確歸類 → 預設為 **混合章**（大多數章節都是混合型）。

### 第二步：決定派誰

根據章節類型，決定 dispatch 哪些子代理：

```
戰鬥章   → plot-pacer + power-balancer + character-keeper + foreshadow-clerk
升級章   → plot-pacer + power-balancer + world-keeper + foreshadow-clerk
對話章   → plot-pacer + character-keeper + world-keeper + foreshadow-clerk
規劃章   → world-keeper + character-keeper + foreshadow-clerk
揭露章   → foreshadow-clerk (必) + character-keeper + plot-pacer
過渡章   → plot-pacer + foreshadow-clerk (最小派發)
混合章   → 全派 (5 個全上)

新卷/新幕  → 全派 (Mode A)
批量連寫   → 第一章全派，後續依類型派
```

**style-polisher 例外處理**：不在此階段 dispatch。寫完正文後自動補上，每一章都跑。

### 第三步：執行 Dispatch

同時發送多個 `task()`，每個 prompt 自包含（指定讀哪些檔案）。

```
task(plot-pacer,       {章節: "144", 類型: "戰鬥", 檔案: [上一章結尾, 02_plot.md, 07_conflict_arcs.md]})
task(power-balancer,   {章節: "144", 類型: "戰鬥", 檔案: [主機版本詳表, 發展指南, 資源公式, 近3章正文]})
task(character-keeper, {章節: "144", 檔案: [01_characters.md, 近5章正文, 05_foreshadowing.md]})
task(foreshadow-clerk, {章節: "144", 檔案: [05_foreshadowing.md, 02_plot.md, 07_conflict_arcs.md]})
```

style-polisher 的 dispatch：
```
task(style-polisher,   {檔案: [06_style_dna.md, 07_voice_bible.md, 05_視角法, 上一章, 本章初稿]})
```

### 第四步：彙整

所有子代理回報後：
1. 逐份閱讀（不可跳過）
2. 找出衝突點 — 例如 world-keeper 說「這個地點不存在」但 plot-pacer 假設它存在
3. 解決衝突 — 有疑慮時問用戶一句
4. 產出統一寫作藍圖

### 第五步：撰寫 + 文風 + QA

1. 根據藍圖寫正文
2. dispatch style-polisher 潤稿
3. 進入 `/chapter-qa` 品管閘門
4. 更新 `05_foreshadowing.md`、`02_plot.md`、`.ai/SUMMARY.md`

---

## 6 子代理定義

### 1. plot-pacer (劇情推進)

```
派發條件：戰鬥章 / 升級章 / 對話章 / 揭露章 / 過渡章（幾乎全上）

讀取：
- 上一章最後 500 字
- 02_PROJECT_DATABASE/00_CORE/02_plot.md
- 02_PROJECT_DATABASE/00_CORE/07_conflict_arcs.md

輸出：
1. 本章一句話核心
2. 四段式節奏（前500字切入 → 升級/衝突 → 反轉 → 鉤子）
3. 三個爽點提案（觸發條件 + 預期讀者反應）
4. 代價設計
5. 結尾鉤子方案
```

### 2. character-keeper (人設記憶)

```
派發條件：任何有角色出場的章節（戰鬥/對話/揭露一定有，過渡章跳出）

讀取：
- 02_PROJECT_DATABASE/00_CORE/01_characters.md
- 最近 5 章正文（涉及角色的對話和行動片段）
- 02_PROJECT_DATABASE/00_CORE/05_foreshadowing.md

輸出：
1. 出場角色清單（每人：心態 / 已知秘密 / 對其他人的隱藏態度）
2. OOC 風險檢查
3. 對話風格提醒
4. 可觸發的秘密
```

### 3. world-keeper (世界觀)

```
派發條件：新場景 / 新勢力出場 / 涉及地理或經濟規則 / 規劃章 / 升級章

讀取：
- 02_PROJECT_DATABASE/00_CORE/00_world.md
- 02_PROJECT_DATABASE/02_DETAILS/01_worldview/
- 目標卷最新一章正文

輸出：
1. 場景設定清單
2. 設定衝突檢查
3. 如需新設定 → 提案
4. 不可打破的鐵律
```

### 4. power-balancer (戰力系統)

```
派發條件：戰鬥章（必派）/ 升級章（必派）/ 揭露章涉及能力真相

讀取：
- 02_PROJECT_DATABASE/02_DETAILS/02_power/主機版本能力詳表.md
- 02_PROJECT_DATABASE/02_DETAILS/02_power/內部文明發展指南.md
- 02_PROJECT_DATABASE/02_DETAILS/02_power/資源轉化公式.md
- 最近 3 章正文

輸出：
1. 可用能力上限
2. 敵人強度建議
3. 戰力膨脹預警
4. 反哺一致性檢查
```

### 5. foreshadow-clerk (伏筆)

```
派發條件：每一章（底線派發，連續 3 章無新鉤子才可跳過）

讀取：
- 02_PROJECT_DATABASE/00_CORE/05_foreshadowing.md
- 02_PROJECT_DATABASE/00_CORE/02_plot.md
- 02_PROJECT_DATABASE/00_CORE/07_conflict_arcs.md

輸出：
1. 🔴 必須在本章處理的伏筆
2. 🟡 可推進的伏筆
3. 新伏筆提案
4. 跨卷伏筆關聯
```

### 6. style-polisher (文風潤稿)

```
派發時機：每一章正文寫完後自動補上，不納入前期 dispatch

讀取：
- 02_PROJECT_DATABASE/01_RULES/06_style_dna.md
- 02_PROJECT_DATABASE/01_RULES/07_voice_bible.md
- 02_PROJECT_DATABASE/01_RULES/05_視角與資訊法.md
- 上一章正文
- 本章初稿

檢查：
1. 視角鎖定
2. 感知寫作
3. 資訊差
4. 禁止殘留用語
5. 句子節奏
6. 鉤子有效性

輸出：修改建議 + 修改後正文
```

---

## 總監禁則

1. **不能先寫再派** — 正文必須等子代理回報完才動筆
2. **不能不讀全部結果** — 跳過閱讀 = 可能錯過設定衝突
3. **不能不派 foreshadow-clerk** — 伏筆是長篇小說的命脈，底線派發
4. **不能跳過 style-polisher** — 否則多代理產出 = 多作者拼接感
5. **不能讓子代理互叫** — 獨立 session，只回報給總監
6. **不能忘記更新檔案** — 子代理不回寫，總監負責更新 `05_foreshadowing.md`、`02_plot.md`、`.ai/SUMMARY.md`

## 與現有系統整合

| 用戶說 | 總監做 |
|---|---|
| 「寫第 144 章」 | 分類 → dispatch → 彙整 → 寫 → polish → QA |
| 「規劃第五卷第三階段」 | 全派 Mode A → 產出藍圖 → 呈用戶確認 |
| 「批量寫 Ch.144-146」 | Ch.144 全派 → 後續依類型 dispatch |
| 「檢查燕九人設」 | Mode C: 只 dispatch character-keeper |
| 「為什麼戰力感覺不對」 | Mode C: 只 dispatch power-balancer |
