# Design Doc: Cold-Iron Novel Refactoring (Chapters 141-145, 154, 159)

## 1. Objective
Refactor 7 chapters of the "Ark-Micro-Civ" novel to remove AI padding ("水字數"), enforce a 3-line paragraph limit, and restore the "Cold, Metallic, Terse" tone defined in `STYLE.md`.

## 2. Target Files & Core Plot Points
- **141 (The 3rd Gate)**: Ming Deng's sacrifice is a 4-minute trap. Lin Jin uses the "0.7s read window" to reverse-entry Qi Que's system. Qi Que admits Saint City as an "equal system".
- **142 (V4 Upgrade)**: 4-faction merger creates "Consensus Council". System upgrades to V4 (Race Entropy Tuning). Lin Jin waits for 69.9% coverage to avoid Qi Que's trigger.
- **143 (White Buckle Rescue)**: Rescue at a "Landing Station". White Buckle's brain is pre-programmed. Revelation: Everyone is a "Landing Asset".
- **144 (Reverse Write)**: Using White Buckle's "Error" to inject a "Survival Contract" rule. Saving 11,724 grey-zone people.
- **145 (Signature Trace)**: Qi Que traces Lin Jin's signature. A mystery signature `0xAB_0xY_0xSS` appears. 
- **154 (Audit Search)**: Audit search fails due to fake supply records. Revelation of "Pre-launch Structure Safety Committee".
- **159 (Carrier Contact)**: Reconstruction of the "Naked Structure Net". Discovery that ARK-PRIME-00 was dismantled from inside. White Buckle's contamination reaches 49.7%.

## 3. Refactoring Strategy: "Cold-Iron" Reconstruction
We will not just "edit" the files; we will **reconstruct** them by filtering the original text through the `STYLE.md` lens.

### 3.1. The "Kill" List (What to Remove)
- **Opening Summaries**: Any paragraph that sets the stage or summarizes previous events.
- **Explanation Loops**: Keywords: "這意味著", "也就是說", "換句話說", "簡單來說".
- **Emotional Naming**: Replace "He felt fear" with "His throat moved".
- **Conclusion Sentences**: Remove sentences like "This battle taught everyone..." or "The future was uncertain."
- **AI Loops**: Specifically in 154 and 159, remove the repetitive paragraphs about Su Lan/Lin Jin's internal thoughts.

### 3.2. The "Hard" Rules (What to Enforce)
- **Paragraph Limit**: STRICT 3-line maximum.
- **Sensory Depth**: Every scene must have at least one of: machine oil smell, metal clanging, cold temperature, or neural lag.
- **System Prompts**: Use `【...】` for all system feedback.
- **Terseness**: One sentence = Three functions (Action + Sensory + Plot).

## 4. Implementation Plan
1. **Extraction**: Identify non-negotiable plot points for each chapter.
2. **Drafting**: Write the refactored content chapter by chapter.
3. **Verification**: 
   - Check line counts per paragraph.
   - Check word count reduction (target 30-50%).
   - Style-check for "机油味" (machine oil smell).

## 5. Metadata
- **Status**: Ready for implementation.
- **Date**: 2024-05-24
