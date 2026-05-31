import { loadExternalConfig, inferGithubRepo, loadState } from './config.js';
import { applyTheme, applyFontSize } from './theme.js';
import { bindEvents } from './events.js';
import { initTTS } from './tts.js';
import { loadFileList } from './github.js';
import { renderSidebar } from './sidebar.js';
import { loadChapter } from './reader.js';
import { state } from './state.js';
import { loadAnnotations } from './annotations.js';

// --- Main ---

export async function init() {
  await loadExternalConfig();
  inferGithubRepo();
  loadState();
  loadAnnotations();
  applyTheme();
  applyFontSize();
  bindEvents();

  initTTS();
  await loadFileList();
  renderSidebar();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('SW Registered!', reg))
      .catch(err => console.error('SW Failed', err));
  }

  const params = new URLSearchParams(window.location.search);
  const file = params.get("file") || localStorage.getItem("reader-last-read");

  if (file) {
    const fileExists = state.files.some(f => f.path === file);
    if (fileExists) {
      loadChapter(file);
    }
  } else if (state.files.length > 0) {
    // Optionally load first chapter if nothing else
  }
}
