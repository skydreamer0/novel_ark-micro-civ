import { state, els } from './state.js';
import { getApiUrl } from './github.js';
import { loadChapter } from './reader.js';
import { renderSidebar } from './sidebar.js';

export async function performFullTextSearch(query) {
  if (!query || !query.trim()) {
    state.searchResults = [];
    state.isSearching = false;
    renderSidebar();
    return;
  }

  if (state.searchAbortController) {
    state.searchAbortController.abort();
  }
  state.searchAbortController = new AbortController();
  const signal = state.searchAbortController.signal;

  state.isSearching = true;
  state.searchResults = [];
  renderSidebar();

  const q = query.toLowerCase().trim();
  const files = state.files;
  const results = [];
  const MAX_RESULTS = 20;

  for (const file of files) {
    if (signal.aborted) return;

    let content = state.searchContentCache[file.path];
    if (!content) {
      try {
        const url = getApiUrl(file.path);
        const resp = await fetch(url, { signal });
        if (!resp.ok) continue;
        content = await resp.text();
        state.searchContentCache[file.path] = content;
      } catch (err) {
        if (err.name === 'AbortError') return;
        continue;
      }
    }

    if (signal.aborted) return;

    const lower = content.toLowerCase();
    let idx = 0;
    while (results.length < MAX_RESULTS) {
      const pos = lower.indexOf(q, idx);
      if (pos === -1) break;

      const start = Math.max(0, pos - 60);
      const end = Math.min(content.length, pos + q.length + 60);
      let snippet = content.slice(start, end);
      if (start > 0) snippet = '…' + snippet;
      if (end < content.length) snippet = snippet + '…';

      results.push({ path: file.path, title: file.title, snippet });
      idx = pos + q.length;
    }

    if (results.length >= MAX_RESULTS) break;
  }

  if (signal.aborted) return;

  state.searchResults = results;
  state.isSearching = false;
  renderSidebar();
}

export function renderSearchResults(results) {
  const list = els.chapterList;
  list.innerHTML = '';

  if (state.isSearching) {
    const status = document.createElement('div');
    status.className = 'search-status';
    status.textContent = '🔍 搜尋中...';
    list.appendChild(status);
    return;
  }

  if (results.length === 0) {
    const status = document.createElement('div');
    status.className = 'search-status';
    status.textContent = '無符合結果';
    list.appendChild(status);
    return;
  }

  results.forEach(r => {
    const btn = document.createElement('button');
    btn.className = 'chapter-btn';

    const title = document.createElement('div');
    title.className = 'search-result-title';
    title.textContent = r.title;

    const snippet = document.createElement('div');
    snippet.className = 'search-result-snippet';
    snippet.textContent = r.snippet;

    btn.appendChild(title);
    btn.appendChild(snippet);
    btn.onclick = () => {
      loadChapter(r.path);
      state.searchMode = 'filter';
      state.filterText = '';
      state.searchResults = [];
      els.searchInput.value = '';
      els.searchInput.placeholder = '搜尋章節...';
      const toggle = els.searchWrap?.querySelector('.search-mode-toggle');
      if (toggle) toggle.classList.remove('active');
      renderSidebar();
    };
    list.appendChild(btn);
  });
}
