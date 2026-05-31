// Dossier View: Loads terms from _GLOSSARY.json and CANON_*.md
// and displays them in a classified dossier style.

const JSON_SOURCE = '../02_PROJECT_DATABASE/_GLOSSARY.json';

async function fetchTerms() {
  try {
    const res = await fetch(JSON_SOURCE);
    if (!res.ok) throw new Error('DB CONNECTION FAILED');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

function renderTerms(terms, filter = 'all') {
  const grid = document.getElementById('dossier-grid');
  const filtered = filter === 'all' 
    ? terms 
    : terms.filter(t => t.source === filter);

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="loading-state">【查無符合條件之名錄檔案】</div>';
    return;
  }

  grid.innerHTML = filtered.map(t => `
    <article class="dossier-card" data-source="${t.source}">
      <h2 class="term-title">${t.term}</h2>
      <div class="term-meta">
        <span class="meta-src">SRC: ${t.source || 'UNKNOWN'}</span>
        <span class="meta-ver">VER: ${t.v_version || '??'}</span>
      </div>
      <div class="term-desc">
        ${t.display_text || t.internal_note || '【數據損毀：權限不足】'}
      </div>
    </article>
  `).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  const terms = await fetchTerms();
  renderTerms(terms);

  // Filter Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTerms(terms, btn.dataset.source);
    });
  });
});
