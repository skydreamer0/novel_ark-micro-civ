---
description: 協助擴展與維護小說世界觀，確保新設定不與既有文件衝突。
---

# 世界觀擴張工作流 (World Builder)
// turbo-all

此工作流用於在現有的「賽博母艦」框架下，定義新的細節（如：特定艙段、組織、技術或裂縫類型）。

## 執行步驟

### Step 1: 讀取核心設定
// turbo
1. 讀取 `02_PROJECT_DATABASE/CANON_world.md`，確認母艦結構與生存方程式。
// turbo
2. 讀取 `02_PROJECT_DATABASE/CANON_world.md §13-§16 經濟`，確認資源類型與轉化流程。
// turbo
3. 讀取 `02_PROJECT_DATABASE/CANON_world.md §10-§12 社會階級`，確認稅制與社會結構。
// turbo
4. 讀取 `02_PROJECT_DATABASE/CANON_power.md §1-§9 主機版本`，確認「雙層煉化權限」與「文明主機」邏輯。
// turbo
5. 讀取 `02_PROJECT_DATABASE/CANON_world.md §8 熵潮與規則密度`，確認熵化邏輯與規則密度設定。
// turbo
6. 若涉及艙段或社會組織，讀取 `02_PROJECT_DATABASE/CANON_world.md §2 母艦物理結構`。

### Step 2: 定義新元素
7. 使用以下結構描述新物件：
   - **名稱**：（例如：第 13 號貧民窟「鐵鏽帶」）
   - **視覺特徵**：（陰冷、霓虹燈閃爍、機油味）
   - **壓迫機制**：（該地段受哪個公司控制？稅收如何？）
   - **機遇點**：（主角能在這裡拾取什麼外域殘骸？）
8. 若新增的是**裂縫類型**，按照世界觀中的裂縫分類標準，先指定五大類之一，再加 1～2 個詞綴。
9. 若新增的是**勢力**，需定義：收入來源、壟斷手段、對主角態度（參照 `02_PROJECT_DATABASE/CANON_world.md §17 勢力一覽` 的格式）。

### Step 3: 衝突檢查
10. 檢查新設定是否破壞了以下硬約束：
    - 「母艦宇宙正在衰亡」的大背景（必須未違背熵潮與規則密度流失的邏輯）
    - 母艦生存方程式的三條硬約束（能源、人口、污染）
    - 主角的核心差異（雙層煉化 + 唯一反熵的文明主機）
11. 確認沒有與 `02_PROJECT_DATABASE/CANON_world.md §23 統一術語表` 中已定義的名詞衝突。

### Step 4: 更新文檔
12. 將確認的新設定寫入對應的細節文件：
    - 場景/母艦結構 → `02_PROJECT_DATABASE/CANON_world.md §2 母艦物理結構`
    - 資源/經濟 → `02_PROJECT_DATABASE/CANON_world.md §13-§16 經濟`
    - 制度/社會 → `02_PROJECT_DATABASE/CANON_world.md §10-§12 社會階級`
    - 熵潮/規則 → `02_PROJECT_DATABASE/CANON_world.md §8 熵潮與規則密度`
13. 同步更新 `02_PROJECT_DATABASE/CANON_world.md §23 統一術語表`，為每個新名詞建立條目。
14. 若涉及勢力，同步更新 `02_PROJECT_DATABASE/CANON_world.md §17 勢力一覽`。
15. 若設定影響主角能力或文明演化，同步更新 `02_PROJECT_DATABASE/CANON_power.md` 下的對應文件。
