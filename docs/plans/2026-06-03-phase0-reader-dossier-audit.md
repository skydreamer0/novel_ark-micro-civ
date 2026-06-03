# Phase 0 讀者機密檔案／PWA 現況稽核

> 日期：2026-06-03  
> 對應計畫：`docs/plans/2026-06-03-reader-facing-dossier-pwa-plan.md` Phase 0  
> 範圍：只做檢查、防呆與記錄；不改 UI、不改小說正文、不新增讀者公開條目。

## 1. 本階段交付

- 新增 `scripts/check-public-dossier.mjs`，用於 Phase 0/後續 PR 的公開檔案防呆檢查。
- 掃描目前讀者端仍直接引用內部 `CANON_*`／`_GLOSSARY.json` 的位置。
- 掃描 PWA/mobile 缺口，供 Phase 3 使用。
- 將 UTF-8／BOM 檢查納入腳本，但 Phase 0 不修正文或不相關既有檔案。

## 2. 檢查腳本能力

`scripts/check-public-dossier.mjs` 目前會檢查：

1. **公開資料層存在性**：若 `reader/public-dossier/` 尚未存在，輸出 warning，提醒 Phase 1 建立。
2. **公開資料 schema**：未來若有 `reader/public-dossier/*.json`，會驗證必要欄位：
   - `id`
   - `title`
   - `category`
   - `unlockChapter`
   - `spoilerLevel`
   - `teaser`
   - `readerText`
   - `lockedText`
   - `sourceCanon`
3. **讀者端禁語**：公開資料層不得包含「本卷功能」「角色弧線」「伏筆」「後續揭露」「作者需注意」「V7 才揭露」「終局設計」「AI 續寫」「設定上」。
4. **UTF-8／BOM**：掃描 active text files；BOM 先以 warning 記錄，避免把既有不相關問題混進同一 PR。
5. **直接讀內部來源**：列出 reader 端仍直接引用 `CANON_*` 或 `_GLOSSARY.json` 的位置。
6. **PWA/mobile 基準**：列出 `manifest.json`、`reader/setting-page.html`、`sw.js` 的缺口。

## 3. 目前仍直接讀內部設定的位置

以下位置仍直接引用 `CANON_*` 或 `_GLOSSARY.json`。Phase 1 應優先讓「機密設定頁」改讀 `reader/public-dossier/`；主閱讀器內的 glossary popover 是否改讀公開資料層，可另列 Phase 1/2 後續決策。

| 檔案 | 行號 | 現況 |
| --- | ---: | --- |
| `reader/setting-page.js` | 1 | 註解標示載入 `_GLOSSARY.json` 與 `CANON_*.md`。 |
| `reader/setting-page.js` | 4 | `JSON_SOURCE` 指向 `../02_PROJECT_DATABASE/_GLOSSARY.json`。 |
| `reader/setting-page.js` | 113–114 | Markdown 來源含 `CANON_characters.md`、`CANON_world.md`。 |
| `reader/modules/dossier-data.js` | 13 | fetch `../02_PROJECT_DATABASE/_GLOSSARY.json`。 |
| `reader/modules/dossier-data.js` | 27–29 | Markdown 來源含 `CANON_characters.md`、`CANON_world.md`、`CANON_power.md`。 |
| `reader/modules/glossary.js` | 10–13 | 主閱讀器 glossary 來源含 `_GLOSSARY.json` 與三個 `CANON_*` 主檔。 |

## 4. PWA/mobile 缺口

Phase 3 建議處理下列項目：

### 4.1 `manifest.json`

目前已有：

- `name`
- `short_name`
- `start_url`
- `display`
- `background_color`
- `theme_color`
- `orientation`
- `icons`

目前缺口：

- `id`
- `scope`
- `lang`
- `dir`
- maskable icon purpose（例如 `"purpose": "any maskable"`）

### 4.2 `reader/setting-page.html`

目前設定頁缺少主閱讀器已具備或 PWA 需要的 mobile meta/link：

- `<link rel="manifest" href="../manifest.json">`
- `<link rel="apple-touch-icon" href="../assets/icon-192.png">`
- `<meta name="mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-title" ...>`
- `<meta name="theme-color" ...>`
- `viewport-fit=cover`

### 4.3 `sw.js`

目前已快取設定頁 shell 與部分模組；但因 `reader/public-dossier/` 尚未建立，所以尚未快取公開資料源。Phase 1 建立資料層後，Phase 1 或 Phase 3 需把相關 JSON 加入快取清單。

## 5. Phase 1 建議停止範圍

下一階段只建議做「最小公開資料層」，不要同時改 PWA 與大量 UI：

- 新增 `reader/public-dossier/index.json`。
- 放入 8–12 個 Ch.1–Ch.30 已揭露、安全、不劇透的條目。
- 修改 `reader/modules/dossier-data.js`，讓機密設定頁優先讀公開資料層。
- 保留或移除舊 CANON fallback 需明確決策；預設不讓讀者端主要顯示 `CANON_*` 長文。
- 跑 `node scripts/check-public-dossier.mjs`，確認公開資料層 schema 與禁語通過。

## 6. 本階段測試命令

```bash
node scripts/check-public-dossier.mjs
node scripts/check-reader-assets.mjs
python3 - <<'PY_PHASE0_UTF8'
from pathlib import Path
for p in [
    Path('scripts/check-public-dossier.mjs'),
    Path('docs/plans/2026-06-03-phase0-reader-dossier-audit.md'),
]:
    data = p.read_bytes()
    assert not data.startswith(b'\xef\xbb\xbf')
    data.decode('utf-8')
print('Phase 0 changed files UTF-8 OK')
PY_PHASE0_UTF8
```
