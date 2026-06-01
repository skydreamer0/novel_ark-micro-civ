import { getContextualProgress } from './progress.js';

/**
 * Validates whether a term can be shown in the current context.
 * 
 * @param {Object} term - The safe glossary term object
 * @param {string|number} currentChapterId - The current context identifier
 * @returns {boolean} True if the term is safe to show
 */
export function isSafeToShow(term, currentChapterId) {
    if (!term || !term.summary) {
        return false;
    }
    
    const currentChapter = getContextualProgress(currentChapterId);
    
    if (currentChapter < (term.first_seen_chapter || 0)) {
        return false;
    }
    
    return true;
}

/**
 * Returns the safe summary for a term, or an obfuscation message if overridden by plot progression.
 * 
 * @param {Object} term - The safe glossary term object
 * @param {string|number} currentChapterId - The current context identifier
 * @returns {string|null} The safe summary text, or null if totally hidden
 */
export function getSafeSummary(term, currentChapterId) {
    if (!isSafeToShow(term, currentChapterId)) {
        return null;
    }
    
    const currentChapter = getContextualProgress(currentChapterId);
    
    // Check if the term has a safe_until_chapter override
    if (term.safe_until_chapter !== undefined && term.safe_until_chapter !== null) {
        if (currentChapter > term.safe_until_chapter) {
            return "資料尚未同步";
        }
    }
    
    return term.summary;
}
