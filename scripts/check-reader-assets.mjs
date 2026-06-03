import { readFileSync } from "node:fs";

const indexHtml = readFileSync("index.html", "utf8");
const swJs = readFileSync("sw.js", "utf8");

const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const settingPageHtml = readFileSync("reader/setting-page.html", "utf8");

for (const field of ["id", "scope", "lang", "dir", "display_override"]) {
  assert(field in manifest, `manifest.json must include ${field} for installable PWA metadata`);
}

assert(
  Array.isArray(manifest.icons) && manifest.icons.some((icon) => String(icon.purpose || "").includes("maskable")),
  'manifest.json must include at least one maskable icon purpose',
);

for (const snippet of [
  '<link rel="manifest" href="../manifest.json">',
  '<link rel="apple-touch-icon" href="../assets/icon-192.png">',
  '<meta name="mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-title"',
  '<meta name="theme-color"',
  'viewport-fit=cover',
]) {
  assert(settingPageHtml.includes(snippet), `reader/setting-page.html must include PWA/mobile snippet: ${snippet}`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const markedScript = indexHtml.match(/<script\b[^>]*\bsrc="([^"]*marked[^"]*)"[^>]*><\/script>/);
assert(markedScript, "index.html must load marked explicitly");
assert(
  markedScript[1].includes("/marked@"),
  `marked CDN URL must be versioned, got ${markedScript[1]}`,
);

assert(
  !/integrity="[^"]*"/.test(markedScript[0]),
  "marked CDN script must not use stale SRI hashes",
);

assert(
  indexHtml.includes('<meta name="mobile-web-app-capable" content="yes" />'),
  "index.html must include mobile-web-app-capable for current Chromium",
);

const cacheName = swJs.match(/CACHE_NAME\s*=\s*['"]mothership-reader-v(\d+)['"]/);
assert(cacheName, "sw.js must declare a versioned reader cache name");
assert(
  Number(cacheName[1]) >= 10,
  `service worker cache version must be bumped past v9, got v${cacheName[1]}`,
);

assert(
  !swJs.includes("https://cdn.jsdelivr.net/npm/marked/marked.min.js"),
  "service worker must not precache the unversioned marked CDN URL",
);

assert(
  !/['"]https?:\/\//.test(swJs.match(/const ASSETS = \[[\s\S]*?\];/)?.[0] || ""),
  "service worker app-shell cache must only precache same-origin assets",
);

assert(
  swJs.includes("e.request.mode === 'navigate'"),
  "service worker must treat navigations separately so index.html is not stuck cache-first",
);

assert(
  swJs.includes("/reader/public-dossier/") && swJs.includes("stale-while-revalidate"),
  "service worker must handle public dossier JSON with stale-while-revalidate caching",
);

console.log("reader asset checks passed");
