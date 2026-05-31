const fs = require('fs');
const path = require('path');

const targetDirs = [
    "01_NOVEL_CONTENT/01_第一卷_艙底種火",
    "01_NOVEL_CONTENT/02_第二卷_裂縫稅戰",
    "01_NOVEL_CONTENT/03_第三卷_聖城試煉",
    "01_NOVEL_CONTENT/04_第四卷_投放名冊",
    "01_NOVEL_CONTENT/06_第六卷_母艦全面反制",
    "01_NOVEL_CONTENT/07_第七卷_察覺與驚醒"
];

const explanationKeywords = ["這意味著", "也就是說", "事實上", "簡單來說", "換句話說", "換言之", "這代表著", "說到底", "說白了"];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    let paragraphs = content.split(/\r?\n\r?\n/);
    let newParagraphs = [];
    
    for (let p of paragraphs) {
        let text = p.trim();
        if (!text) continue;
        
        // Remove Intro/Outro headers if they are just fluff
        if (text.match(/^#+\s*第[一二三四五六七八九十百]+卷/)) continue;
        if (text.match(/^#+\s*Act\s*\d+/i)) continue;
        if (text.includes("前情提要")) continue;
        if (text.includes("上一章：")) continue;
        
        // Split by sentences to process keywords
        let sentences = text.match(/[^。！？]+[。！？]?/g) || [text];
        let filteredSentences = [];
        for (let s of sentences) {
            let skip = false;
            for (let kw of explanationKeywords) {
                if (s.includes(kw)) {
                    skip = true;
                    break;
                }
            }
            if (!skip) {
                // Remove abstract explanation bridges starting with —— if not in dialogue
                if (s.includes('——') && !s.includes('「') && !s.includes('」') && !s.includes('『') && !s.includes('』')) {
                    s = s.replace(/——[^。！？]+([。！？]?)$/, '$1');
                }
                filteredSentences.push(s);
            }
        }
        
        text = filteredSentences.join('');
        if (!text) continue;
        
        // Paragraph hard limit: break if too long. 
        if (text.length > 100 && !text.startsWith('#')) {
            let parts = text.match(/[^。！？]+[。！？]?/g) || [text];
            let tempP = "";
            for (let part of parts) {
                if ((tempP + part).length > 80) {
                    if (tempP) newParagraphs.push(tempP.trim());
                    tempP = part;
                } else {
                    tempP += part;
                }
            }
            if (tempP) newParagraphs.push(tempP.trim());
        } else {
            newParagraphs.push(text);
        }
    }
    
    fs.writeFileSync(filePath, newParagraphs.join('\n\n'), 'utf8');
}

for (let dir of targetDirs) {
    if (fs.existsSync(dir)) {
        let files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
        for (let f of files) {
            processFile(path.join(dir, f));
        }
        console.log(`Processed ${dir}`);
    } else {
        console.log(`Directory not found: ${dir}`);
    }
}
console.log("Global De-watering Complete.");
