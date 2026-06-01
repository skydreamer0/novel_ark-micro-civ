// reader/modules/dossier-data.js

import { parseMarkdownSections } from './dossier-parser.js';
import { mergeDossierItems } from './dossier-merge.js';

/**
 * Loads the full dossier by fetching JSON and Markdown resources, then merging them.
 * @returns {Promise<Array>} The merged dossier items.
 */
export async function loadFullDossier() {
    try {
        // Fetch Glossary JSON
        const jsonResponse = await fetch('../02_PROJECT_DATABASE/_GLOSSARY.json');
        let jsonItems = [];
        if (jsonResponse.ok) {
            try {
                jsonItems = await jsonResponse.json();
            } catch(e) {
                console.error("Failed to parse _GLOSSARY.json", e);
            }
        } else {
            console.warn("Could not fetch _GLOSSARY.json");
        }
        
        // Fetch Markdown files
        const mdFiles = [
            { path: '../02_PROJECT_DATABASE/CANON_characters.md', label: 'Characters' },
            { path: '../02_PROJECT_DATABASE/CANON_world.md', label: 'World' },
            { path: '../02_PROJECT_DATABASE/CANON_power.md', label: 'Power' }
        ];
        
        let allMdItems = [];
        
        for (const file of mdFiles) {
            try {
                const mdResponse = await fetch(file.path);
                if (mdResponse.ok) {
                    const mdText = await mdResponse.text();
                    const mdItems = parseMarkdownSections(mdText, file.label);
                    allMdItems = allMdItems.concat(mdItems);
                } else {
                    console.warn(`Could not fetch ${file.path}`);
                }
            } catch (e) {
                console.warn(`Error fetching ${file.path}`, e);
            }
        }
        
        // Merge them
        const mergedDossier = mergeDossierItems(jsonItems, allMdItems);
        
        return mergedDossier;
    } catch (error) {
        console.error("Error loading dossier data:", error);
        return [];
    }
}
