import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const PUBLIC_DOSSIER_DIR = "reader/public-dossier";
const REQUIRED_DOSSIER_FIELDS = [
  "id",
  "title",
  "category",
  "unlockChapter",
  "spoilerLevel",
  "teaser",
  "readerText",
  "lockedText",
  "sourceCanon",
];
const BANNED_READER_TERMS = [
  "本卷功能",
  "角色弧線",
  "伏筆",
  "後續揭露",
  "作者需注意",
  "V7 才揭露",
  "終局設計",
  "AI 續寫",
  "設定上",
];
const TEXT_EXTENSIONS = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".txt",
  ".yaml",
  ".yml",
]);
const SCAN_ROOTS = [
  "AGENTS.md",
  "README.md",
  "docs/plans",
  "index.html",
  "manifest.json",
  "reader",
  "scripts",
  "sw.js",
];
const DIRECT_CANON_SCAN_FILES = [
  "reader/dossier.js",
  "reader/setting-page.js",
  "reader/modules/dossier-data.js",
  "reader/modules/glossary.js",
];
const SETTING_PAGE_REQUIRED_SNIPPETS = [
  '<link rel="manifest" href="../manifest.json">',
  '<link rel="apple-touch-icon" href="../assets/icon-192.png">',
  '<meta name="mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-title"',
  '<meta name="theme-color"',
  "viewport-fit=cover",
];

const errors = [];
const warnings = [];
const infos = [];

function readUtf8(file) {
  const bytes = readFileSync(file);
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    warnings.push(`BOM detected: ${file}`);
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function isTextFile(file) {
  return TEXT_EXTENSIONS.has(file.slice(file.lastIndexOf(".")).toLowerCase());
}

function walk(path) {
  if (!existsSync(path)) return [];
  const statEntries = [];
  const stack = [path];
  while (stack.length) {
    const current = stack.pop();
    if (!existsSync(current)) continue;
    const entries = readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const child = join(current, entry.name);
      const normalized = child.replaceAll("\\", "/");
      if (normalized.includes("/.git/") || normalized.includes("__pycache__")) continue;
      if (normalized.includes("02_PROJECT_DATABASE/04_ARCHIVE") || normalized.includes("processed_do_not_read")) continue;
      if (entry.isDirectory()) {
        stack.push(child);
      } else {
        statEntries.push(normalized);
      }
    }
  }
  return statEntries;
}

function collectScanFiles() {
  const files = [];
  for (const root of SCAN_ROOTS) {
    if (!existsSync(root)) continue;
    if (readdirSyncSafe(root) === null) {
      files.push(root);
    } else {
      files.push(...walk(root));
    }
  }
  return [...new Set(files)].filter(isTextFile);
}

function readdirSyncSafe(path) {
  try {
    return readdirSync(path, { withFileTypes: true });
  } catch {
    return null;
  }
}

function checkUtf8AndBom() {
  let checked = 0;
  for (const file of collectScanFiles()) {
    try {
      readUtf8(file);
      checked += 1;
    } catch (error) {
      errors.push(`UTF-8 decode failed: ${file} (${error.message})`);
    }
  }
  infos.push(`UTF-8 scan checked ${checked} active text files.`);
}

function normalizeDossierItems(parsed, file) {
  if (Array.isArray(parsed)) return parsed;
  if (parsed && Array.isArray(parsed.items)) return parsed.items;
  errors.push(`${file} must be a JSON array or an object with an items array.`);
  return [];
}

function checkPublicDossier() {
  if (!existsSync(PUBLIC_DOSSIER_DIR)) {
    warnings.push(`${PUBLIC_DOSSIER_DIR} does not exist yet; Phase 1 should create it.`);
    return;
  }

  const jsonFiles = walk(PUBLIC_DOSSIER_DIR).filter((file) => file.endsWith(".json"));
  if (jsonFiles.length === 0) {
    warnings.push(`${PUBLIC_DOSSIER_DIR} exists but contains no JSON files.`);
    return;
  }

  const seenIds = new Map();

  for (const file of jsonFiles) {
    let text;
    try {
      text = readUtf8(file);
    } catch (error) {
      errors.push(`UTF-8 decode failed: ${file} (${error.message})`);
      continue;
    }

    for (const term of BANNED_READER_TERMS) {
      if (text.includes(term)) {
        errors.push(`${file} contains reader-facing banned term: ${term}`);
      }
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      errors.push(`JSON parse failed: ${file} (${error.message})`);
      continue;
    }

    const items = normalizeDossierItems(parsed, file);
    items.forEach((item, index) => {
      if (item.id) {
        const previous = seenIds.get(item.id);
        if (previous) {
          errors.push(`${file}[${index}] duplicates id "${item.id}" already used by ${previous}.`);
        } else {
          seenIds.set(item.id, `${file}[${index}]`);
        }
      }

      for (const field of REQUIRED_DOSSIER_FIELDS) {
        if (!(field in item)) {
          errors.push(`${file}[${index}] missing required field: ${field}`);
        }
      }
      if (item.sourceCanon && !Array.isArray(item.sourceCanon)) {
        errors.push(`${file}[${index}].sourceCanon must be an array.`);
      }
      if (typeof item.unlockChapter !== "number") {
        errors.push(`${file}[${index}].unlockChapter must be a number.`);
      }
    });
  }
}

function checkDirectCanonReads() {
  for (const file of DIRECT_CANON_SCAN_FILES) {
    if (!existsSync(file)) continue;
    const lines = readUtf8(file).split(/\r?\n/);
    lines.forEach((line, index) => {
      if (line.includes("CANON_") || line.includes("_GLOSSARY.json")) {
        warnings.push(`Direct internal source reference: ${file}:${index + 1}: ${line.trim()}`);
      }
    });
  }
}

function checkPwaBaseline() {
  if (!existsSync("manifest.json")) {
    errors.push("manifest.json is missing.");
  } else {
    const manifest = JSON.parse(readUtf8("manifest.json"));
    for (const field of ["name", "short_name", "start_url", "display", "icons"]) {
      if (!(field in manifest)) warnings.push(`manifest.json missing field: ${field}`);
    }
    for (const field of ["id", "scope", "lang", "dir"]) {
      if (!(field in manifest)) warnings.push(`manifest.json should add mobile/PWA field: ${field}`);
    }
    const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
    if (!icons.some((icon) => String(icon.purpose || "").includes("maskable"))) {
      warnings.push('manifest.json should add an icon with purpose including "maskable".');
    }
  }

  if (existsSync("reader/setting-page.html")) {
    const settingPage = readUtf8("reader/setting-page.html");
    for (const snippet of SETTING_PAGE_REQUIRED_SNIPPETS) {
      if (!settingPage.includes(snippet)) {
        warnings.push(`reader/setting-page.html missing PWA/mobile snippet: ${snippet}`);
      }
    }
  }

  if (existsSync("sw.js")) {
    const sw = readUtf8("sw.js");
    for (const asset of [
      "./reader/setting-page.html",
      "./reader/setting-page.css",
      "./reader/dossier.js",
      "./assets/icon-192.png",
      "./assets/icon-512.png",
    ]) {
      if (!sw.includes(asset)) warnings.push(`sw.js cache list missing asset: ${asset}`);
    }
    if (!sw.includes("reader/public-dossier")) {
      warnings.push("sw.js does not cache reader/public-dossier assets yet; Phase 1/3 should add them after the data layer exists.");
    }

    if (existsSync(PUBLIC_DOSSIER_DIR)) {
      for (const file of walk(PUBLIC_DOSSIER_DIR).filter((entry) => entry.endsWith(".json"))) {
        const assetPath = `./${file}`;
        if (!sw.includes(assetPath)) {
          warnings.push(`sw.js cache list missing public dossier asset: ${assetPath}`);
        }
      }
    }
  }
}

checkUtf8AndBom();
checkPublicDossier();
checkDirectCanonReads();
checkPwaBaseline();

for (const info of infos) console.log(`INFO ${info}`);
for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);

if (errors.length > 0) {
  console.error(`Public dossier check failed with ${errors.length} error(s) and ${warnings.length} warning(s).`);
  process.exit(1);
}

console.log(`Public dossier check passed with ${warnings.length} warning(s).`);
