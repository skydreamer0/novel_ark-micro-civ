# 末日母艦：我的體內有個微縮文明

> 把長篇小說當成可演進系統來經營：世界觀是底層架構、章節是可部署單元、伏筆是跨版本相容契約。

[![Status](https://img.shields.io/badge/status-Vol.1%20In%20Progress-2563eb)](https://github.com/)
[![Workflow](https://img.shields.io/badge/workflow-GitHub%20NovelOps-0f766e)](https://github.com/)
[![Genre](https://img.shields.io/badge/genre-Cyberpunk%20%7C%20Survival-f97316)](https://github.com/)

---

## 專案定位

這不是單純「把稿子放上來」的倉庫，而是把小說拆成可維運的知識系統：

- **Story as Code**：設定、章節、術語、規範全部版本化。
- **Lore Architecture**：核心設定與世界觀採模組化管理，避免後期崩壞。
- **Narrative CI 思維**：每次新增章節都能追溯影響面（角色弧線、伏筆、經濟規則、力量體系）。
- **GitHub 協作式寫作**：用 issue / commit / PR 的節奏做長線連載管理。

如果你也在想「應該有人用 GitHub 寫小說」，答案是：**可以，而且很好用**。

---

## 世界觀一句話

在掛載於末日母艦上的巨型賽博都市中，底層維修工主角獲得可培育微縮文明的「文明主機」。當所有人被迫掠奪外域資源求生，他逐步發現整座城市與裂縫戰爭只是更高層收割體系的一環。

---

## Repository Architecture

```text
.
├─ docs/
│  ├─ 00_企劃大綱/         # 作品主線、分卷、揭密藍圖、追蹤表
│  ├─ 01_正文/             # 正文章節（連載主體）
│  ├─ 02_核心設定/         # 角色、陣營、力量與文明系統
│  └─ 03_世界觀/           # 母艦、資源、社會秩序、名詞辭典
├─ NOVEL_WRITING_RULES.md # 寫作硬規格（節奏、視角、禁忌）
├─ reader.config.json      # 網頁閱讀器的資料來源配置
├─ app.js / styles.css     # 閱讀器前端
└─ README.md               # 專案入口與協作規範
```

---

## 文檔導航（快速入口）

### 1) 先看全局
- `docs/00_企劃大綱/00_企劃大綱目錄.md`
- `docs/00_企劃大綱/01_作品總架構與主線.md`
- `docs/00_企劃大綱/02_全書階段與揭密藍圖.md`

### 2) 再看系統
- `docs/02_核心設定/01_核心設定與賣點.md`
- `docs/02_核心設定/03_力量與文明系統.md`
- `docs/03_世界觀/03_資源與轉化規則.md`

### 3) 最後進正文
- `docs/01_正文/第01章_欠稅通知.md` 起讀

---

## GitHub NovelOps（建議工作流）

### Branch Strategy
- `main`：可公開閱讀的穩定版本
- `feat/chXX-*`：單章或小段情節
- `arc/volXX-*`：整卷級調整
- `lore/*`：世界觀與設定修訂

### Commit Convention（推薦）
- `feat(chapter): 新增第34章 保證金陷阱`
- `lore(system): 調整裂縫稅制與黑市轉化規則`
- `refactor(outline): 重排第二卷揭密節點`
- `docs(glossary): 新增術語與勢力別名`

### PR Checklist（合併前自檢）
- [ ] 是否違反 `NOVEL_WRITING_RULES.md`
- [ ] 是否與既有設定衝突（角色能力/資源規則/時間線）
- [ ] 是否有推進至少一條主線（戰力、文明、陰謀）
- [ ] 新增名詞是否同步到辭典或對應文檔
- [ ] 關鍵伏筆是否可追溯（在哪章埋、預計在哪章收）

---

## 寫作原則（高壓長篇版）

1. **爽感優先，但不犧牲因果**：戰鬥與反殺要建立在可驗證規則上。  
2. **主角升級＝系統升級**：個體能力與文明演進必須雙向反哺。  
3. **每卷都有結算感**：卷末要有階段性勝利、代價與下一輪更高壓任務。  
4. **世界觀先行，橋段後掛**：先鎖定制度與資源流，再設計衝突。  

---

## 路線圖（Roadmap）

- [x] 第一卷主線架構與章節節奏落地
- [x] 核心勢力、資源體系、稅制壓迫機制定義
- [x] 力量系統與文明演進規則建立
- [ ] 第二卷（裂縫稅戰）完整展開
- [ ] 伏筆追蹤表與名詞辭典持續維護
- [ ] 建立章節級變更日誌（方便回溯與重寫）

---

## 如何貢獻

歡迎協作世界觀、章節打磨、錯漏修正：

1. 開 issue 說明你要改什麼（章節 / 設定 / 名詞 / 時間線）。
2. 建分支實作，保持單一主題提交。
3. 發 PR，附上「改動摘要 + 影響面 + 建議閱讀順序」。

---

## 閱讀器配置

可透過 `reader.config.json` 控制資料來源，不必硬改前端程式：

- `githubOwner` / `githubRepo` / `githubBranch`
- `includeExtensions`
- `includeFolders`

也支援 URL 參數臨時覆蓋：

- `?owner=<owner>&repo=<repo>&branch=<branch>`
- `&folders=docs/01_正文,docs/00_企劃大綱`
- `&ext=.md,.txt`

