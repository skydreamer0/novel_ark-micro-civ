import { loadSafeGlossary } from './glossary-data.js';
import { getSafeSummary, isSafeToShow } from './glossary-rules.js';

let glossaryDict = null;
let glossaryRegex = null; // Stored per prompt's state management, though we'll cache per chapter
let popoverElement = null;

const triggerChapterMap = new WeakMap();
const chapterRegexCache = new Map();

export async function initGlossarySystem() {
    glossaryDict = await loadSafeGlossary();
    injectStyles();
    createPopoverElement();
    bindPopoverEvents();
}

function injectStyles() {
    if (document.getElementById('glossary-popover-styles')) return;
    const style = document.createElement('style');
    style.id = 'glossary-popover-styles';
    style.textContent = `
        .glossary-trigger {
            border-bottom: 1px dashed #666;
            cursor: pointer;
            padding: 4px;
            margin: -4px 0;
            position: relative;
            display: inline-block;
            transition: background-color 0.2s ease;
        }
        .glossary-trigger:hover {
            background-color: rgba(100, 100, 100, 0.1);
        }
        #glossary-popover {
            position: absolute;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            max-width: 300px;
            z-index: 10000;
            display: none;
            font-size: 0.9em;
            color: #333;
            line-height: 1.4;
            white-space: pre-wrap;
        }
        #glossary-popover.visible {
            display: block;
        }
        #glossary-popover strong {
            display: block;
            margin-bottom: 6px;
            font-size: 1.05em;
            color: #111;
        }
        @media (prefers-color-scheme: dark) {
            #glossary-popover {
                background: #2a2a2a;
                border-color: #444;
                color: #eee;
                box-shadow: 0 4px 6px rgba(0,0,0,0.5);
            }
            #glossary-popover strong {
                color: #fff;
            }
            .glossary-trigger {
                border-bottom-color: #aaa;
            }
            .glossary-trigger:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
        }
    `;
    document.head.appendChild(style);
}

function createPopoverElement() {
    if (document.getElementById('glossary-popover')) {
        popoverElement = document.getElementById('glossary-popover');
        return;
    }
    popoverElement = document.createElement('div');
    popoverElement.id = 'glossary-popover';
    document.body.appendChild(popoverElement);
}

function getChapterRegex(chapterId) {
    if (chapterRegexCache.has(chapterId)) {
        return chapterRegexCache.get(chapterId);
    }

    const glossaryArray = Object.values(glossaryDict);
    const activeTerms = glossaryArray.filter(term => isSafeToShow(term, chapterId));
    if (activeTerms.length === 0) {
        chapterRegexCache.set(chapterId, null);
        return null;
    }

    const termMap = new Map();
    activeTerms.forEach(term => {
        termMap.set(term.term, term);
        if (Array.isArray(term.aliases)) {
            term.aliases.forEach(alias => termMap.set(alias, term));
        }
    });

    const sortedNames = Array.from(termMap.keys()).sort((a, b) => b.length - a.length);
    const escapedNames = sortedNames.map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedNames.join('|')})`, 'g');
    
    chapterRegexCache.set(chapterId, { regex, termMap });
    return chapterRegexCache.get(chapterId);
}

export function highlightTerms(sectionElement, chapterId) {
    if (!glossaryDict || Object.keys(glossaryDict).length === 0) return;
    
    const chapterData = getChapterRegex(chapterId);
    if (!chapterData) return;

    const { regex, termMap } = chapterData;

    const walk = document.createTreeWalker(sectionElement, NodeFilter.SHOW_TEXT, null, false);
    const nodesToReplace = [];
    
    while(walk.nextNode()) {
        const node = walk.currentNode;
        const parent = node.parentElement;
        if (parent) {
            // Skip elements that shouldn't be highlighted
            if (!parent.closest('mark, a, button, pre, code, .term, .annot-highlight, .glossary-trigger')) {
                nodesToReplace.push(node);
            }
        }
    }

    nodesToReplace.forEach(node => {
        const text = node.nodeValue;
        if (!regex.test(text)) return;

        regex.lastIndex = 0;
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;
        
        while ((match = regex.exec(text)) !== null) {
            const matchedText = match[0];
            const term = termMap.get(matchedText);
            
            if (match.index > lastIndex) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
            }
            
            const span = document.createElement('span');
            span.className = 'glossary-trigger';
            span.dataset.termId = term.id;
            span.textContent = matchedText;
            triggerChapterMap.set(span, chapterId);
            
            fragment.appendChild(span);
            lastIndex = regex.lastIndex;
        }
        
        if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
        
        node.parentNode.replaceChild(fragment, node);
    });
}

let activeTrigger = null;

export function bindPopoverEvents() {
    let hideTimeout;

    function showPopover(trigger) {
        if (!glossaryDict) return;
        const termId = trigger.dataset.termId;
        const term = glossaryDict[termId];
        if (!term) return;

        const chapterId = triggerChapterMap.get(trigger);
        const summary = getSafeSummary(term, chapterId);

        popoverElement.innerHTML = '';
        const titleEl = document.createElement('strong');
        titleEl.textContent = term.term;
        popoverElement.appendChild(titleEl);
        
        popoverElement.appendChild(document.createTextNode(summary || ''));
        
        popoverElement.classList.add('visible');
        activeTrigger = trigger;

        positionPopover(trigger);
    }

    function positionPopover(trigger) {
        const rect = trigger.getBoundingClientRect();
        const popoverRect = popoverElement.getBoundingClientRect();
        
        let top = rect.bottom + window.scrollY + 5;
        let left = rect.left + window.scrollX;

        if (left + popoverRect.width > window.innerWidth) {
            left = window.innerWidth - popoverRect.width - 10;
        }
        if (left < 10) left = 10;

        if (rect.bottom + popoverRect.height + 10 > window.innerHeight && rect.top - popoverRect.height - 10 > 0) {
            top = rect.top + window.scrollY - popoverRect.height - 5;
        }

        popoverElement.style.top = `${top}px`;
        popoverElement.style.left = `${left}px`;
    }

    function hidePopover() {
        popoverElement.classList.remove('visible');
        activeTrigger = null;
    }

    document.body.addEventListener('mouseover', (e) => {
        const trigger = e.target.closest('.glossary-trigger');
        if (trigger) {
            clearTimeout(hideTimeout);
            showPopover(trigger);
        }
    });

    document.body.addEventListener('mouseout', (e) => {
        const trigger = e.target.closest('.glossary-trigger');
        if (trigger) {
            hideTimeout = setTimeout(hidePopover, 300);
        }
    });

    document.body.addEventListener('click', (e) => {
        const trigger = e.target.closest('.glossary-trigger');
        if (trigger) {
            e.preventDefault();
            e.stopPropagation();
            if (activeTrigger === trigger) {
                hidePopover();
            } else {
                showPopover(trigger);
            }
        } else if (!e.target.closest('#glossary-popover')) {
            hidePopover();
        }
    });

    window.addEventListener('scroll', () => {
        if (activeTrigger) hidePopover();
    }, { passive: true, capture: true });
    
    window.addEventListener('resize', () => {
        if (activeTrigger) hidePopover();
    }, { passive: true });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hidePopover();
    });
}
