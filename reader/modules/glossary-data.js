/**
 * Glossary Data Loader (Safe Model)
 * Physically prevents dossier/spoiler fields from entering memory.
 */

export async function loadSafeGlossary(url = '../02_PROJECT_DATABASE/_GLOSSARY.json') {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load glossary: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        
        const glossaryDict = {};
        
        // Support both array format and object format
        const items = Array.isArray(data) ? data : Object.values(data);
        
        for (const item of items) {
            // Determine primary key
            const id = item.id || item.term;
            if (!id) continue;
            
            // Extract core fields, supporting legacy structures
            const term = item.term || id;
            const aliases = Array.isArray(item.aliases) ? [...item.aliases] : [];
            const category = item.category || item.source || 'uncategorized';
            
            let summary = '';
            let first_seen_chapter = 0;
            let safe_until_chapter = null;
            
            if (item.glossary) {
                summary = item.glossary.summary || item.display_text || '';
                first_seen_chapter = item.first_seen_chapter !== undefined ? item.first_seen_chapter : (item.glossary.first_seen_chapter || 0);
                safe_until_chapter = item.glossary.safe_until_chapter !== undefined ? item.glossary.safe_until_chapter : null;
                
                // If unsafe, clear the summary immediately.
                if (item.glossary.spoiler_level === 'unsafe') {
                    summary = '';
                }
            } else {
                // Legacy fallback
                summary = item.summary || item.display_text || '';
                first_seen_chapter = item.first_seen_chapter || 0;
                safe_until_chapter = item.safe_until_chapter !== undefined ? item.safe_until_chapter : null;
                
                if (item.spoiler_level === 'unsafe') {
                    summary = '';
                }
            }
            
            // Construct the Safe Model object. 
            // Explicitly selecting ONLY safe properties.
            // MANDATORY EXCLUSION: dossier, details, unlock_stages, unlock, visibility, internal_note, mdContent, supplementalArchive
            glossaryDict[id] = {
                id,
                term,
                aliases,
                category,
                summary,
                first_seen_chapter,
                safe_until_chapter
            };
        }
        
        return glossaryDict;
    } catch (error) {
        console.error('Error loading safe glossary:', error);
        return {};
    }
}
