import { getGlobalProgress } from './modules/progress.js';
import { loadFullDossier } from './modules/dossier-data.js';
import { renderDossierCards, renderFilters } from './modules/dossier-render.js';
import { performSync } from './modules/dossier-sync.js';

let currentItems = [];
let currentFilter = 'all';
let currentProgress = 0;

export async function init() {
    const container = document.getElementById('dossier-container');
    const filterContainer = document.getElementById('dossier-filters');
    const syncStatus = document.getElementById('dossier-sync-status');
    const syncBtn = document.getElementById('dossier-sync-btn');

    if (!container) {
        console.error('Dossier container not found');
        return;
    }

    try {
        currentProgress = await getGlobalProgress();
        currentItems = await loadFullDossier();

        const handleFilterChange = (newFilter) => {
            currentFilter = newFilter;
            renderDossierCards(container, currentItems, currentProgress, currentFilter);
            if (filterContainer) {
                renderFilters(filterContainer, currentItems, currentFilter, handleFilterChange);
            }
        };

        if (filterContainer) {
            renderFilters(filterContainer, currentItems, currentFilter, handleFilterChange);
        }

        renderDossierCards(container, currentItems, currentProgress, currentFilter);

        if (syncBtn && syncStatus) {
            syncBtn.addEventListener('click', async () => {
                const newProgress = await getGlobalProgress();
                await performSync(syncStatus, currentItems, currentProgress, newProgress, (unlocks) => {
                    container.classList.add('pulse');
                    setTimeout(() => container.classList.remove('pulse'), 1000);
                });
                currentProgress = newProgress;
                renderDossierCards(container, currentItems, currentProgress, currentFilter);
            });
        }

    } catch (error) {
        console.error('Failed to initialize Dossier:', error);
    }
}
