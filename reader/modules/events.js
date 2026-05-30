import { state, els } from './state.js';
import { saveState } from './config.js';
import { applyTheme, applyFontSize } from './theme.js';
import { toggleTTS, stopTTS, playNextChunk } from './tts.js';
import { toggleBottomPanel, handleTouchStart, handleTouchEnd } from './gestures.js';
import { updateBookmarkUI, renderSidebar } from './sidebar.js';
import { updateReadingProgress, loadChapter } from './reader.js';
import { performFullTextSearch } from './search.js';

// --- Event Listeners ---

export function bindEvents() {
  // Scroll
  window.addEventListener("scroll", updateReadingProgress, { passive: true });

  // Save scroll on unload
  window.addEventListener("beforeunload", () => {
    saveState("scroll");
    saveState("bookmarks");
  });

  // Sidebar Toggles
  const toggleSidebar = () => els.app.classList.toggle("sidebar-collapsed");
  els.menuBtn.onclick = toggleSidebar;
  els.sidebarCloseBtn.onclick = () => els.app.classList.add("sidebar-collapsed");
  els.sidebarOverlay.onclick = () => els.app.classList.add("sidebar-collapsed");

  // Settings
  els.themeToggle.onclick = () => {
    state.theme = state.theme === "light" ? "dark" : "light";
    applyTheme();
  };

  els.ttsToggle.onclick = toggleTTS;

  els.fontSizeInc.onclick = () => {
    state.fontSize = Math.min(state.fontSize + 0.1, 2.0);
    applyFontSize();
  };

  els.fontSizeDec.onclick = () => {
    state.fontSize = Math.max(state.fontSize - 0.1, 0.8);
    applyFontSize();
  };

  // Bookmark
  els.bookmarkBtn.onclick = () => {
    if (state.activeIndex < 0) return;
    const path = state.files[state.activeIndex].path;
    if (state.bookmarks.has(path)) {
      state.bookmarks.delete(path);
    } else {
      state.bookmarks.add(path);
    }
    updateBookmarkUI();
    saveState("bookmarks");
    renderSidebar();
  };

  // Navigation
  els.prevBtn.onclick = () => {
    if (state.activeIndex > 0) loadChapter(state.files[state.activeIndex - 1].path);
  };

  els.nextBtn.onclick = () => {
    if (state.activeIndex < state.files.length - 1) loadChapter(state.files[state.activeIndex + 1].path);
  };

  // Search mode toggle
  let modeToggle = els.searchWrap.querySelector('.search-mode-toggle');
  if (!modeToggle) {
    modeToggle = document.createElement('button');
    modeToggle.className = 'search-mode-toggle';
    modeToggle.type = 'button';
    modeToggle.textContent = '全文';
    els.searchWrap.appendChild(modeToggle);
  }
  els.searchModeToggle = modeToggle;

  els.searchModeToggle.onclick = () => {
    state.searchMode = state.searchMode === 'filter' ? 'fulltext' : 'filter';
    els.searchInput.placeholder = state.searchMode === 'filter' ? '搜尋章節...' : '搜尋內容...';
    els.searchInput.value = '';
    state.filterText = '';
    state.searchResults = [];
    state.searchContentCache = {};
    els.searchModeToggle.classList.toggle('active', state.searchMode === 'fulltext');
    renderSidebar();
  };

  // Search
  let searchDebounce = null;
  els.searchInput.oninput = (e) => {
    state.filterText = e.target.value;
    if (state.searchMode === 'fulltext') {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => performFullTextSearch(state.filterText), 300);
    } else {
      renderSidebar();
    }
  };

  // Keyboard Shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT") return;

    if (e.key === "ArrowLeft") els.prevBtn.click();
    if (e.key === "ArrowRight") els.nextBtn.click();
    if (e.key.toLowerCase() === "t") els.themeToggle.click();
    if (e.key.toLowerCase() === "b") els.bookmarkBtn.click();
  });

  // Click behavior
  document.querySelector(".main-wrapper").addEventListener("click", (e) => {
    if (e.target.closest("button, a, input, .bottom-nav, .top-nav, .nav-btn, .chapter-divider, .bottom-panel")) return;

    const clickY = e.clientY;
    const windowH = window.innerHeight;
    const windowW = window.innerWidth;

    if (window.innerWidth <= 1024) {
      const isCenter = clickY > windowH * 0.3 && clickY < windowH * 0.7 &&
        e.clientX > windowW * 0.3 && e.clientX < windowW * 0.7;

      if (isCenter) {
        toggleBottomPanel(!state.bottomPanelOpen);
        return;
      }
    }

    if (clickY > windowH * 0.7) {
      window.scrollBy({ top: windowH * 0.85, behavior: "smooth" });
    }
  });

  // Gestures
  document.addEventListener("touchstart", handleTouchStart, { passive: true });
  document.addEventListener("touchend", handleTouchEnd, { passive: true });

  // Bottom Panel Interactions
  els.bottomPanelOverlay.onclick = () => toggleBottomPanel(false);
  els.bottomPanelHandle.onclick = () => toggleBottomPanel(false);

  // Panel TTS Controls
  els.ttsPanelToggle.onclick = toggleTTS;
  els.ttsStopBtn.onclick = stopTTS;
  els.ttsRateInput.oninput = (e) => {
    state.ttsRate = parseFloat(e.target.value);
    els.ttsRateLabel.textContent = state.ttsRate.toFixed(1) + "x";

    if (state.tts.speaking && !state.tts.paused) {
      window.speechSynthesis.cancel();
      setTimeout(playNextChunk, 50);
    }
  };
  els.ttsStartSelect.onchange = (e) => {
    state.ttsStartMode = e.target.value;
  };

  // Panel Settings Controls
  els.panelThemeToggle.onclick = () => els.themeToggle.click();
  els.panelFontInc.onclick = () => {
    els.fontSizeInc.click();
    els.panelFontLabel.textContent = state.fontSize.toFixed(1);
  };
  els.panelFontDec.onclick = () => {
    els.fontSizeDec.click();
    els.panelFontLabel.textContent = state.fontSize.toFixed(1);
  };
}
