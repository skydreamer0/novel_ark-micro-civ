# Local Agent Instructions

This repository has repo-local skills under `.agent/skills/`. Do not install or copy them into global skill directories.

When working in this repository:

1. For novel writing, chapter revision, arc planning, continuity checks, or quality review, read and follow `.agent/skills/novel-writer/SKILL.md`.
2. For new chapters, long-arc planning, multi-agent chapter design, foreshadowing checks, power-balance checks, or character consistency checks, also read and follow `.agent/skills/subagent-layered-novel/SKILL.md`.
3. Treat these local skills as authoritative for this repo even if they are not listed in the global Codex skill registry.
4. Before drafting any chapter prose, load the required project files listed by `novel-writer`, especially `.ai/SUMMARY.md`, `02_PROJECT_DATABASE/00_CORE/02_plot.md`, `02_PROJECT_DATABASE/00_CORE/12_current_structure_plan.md`, `02_PROJECT_DATABASE/00_CORE/07_conflict_arcs.md`, `.ai/視角技法示範.md`, the writing rules, style references, voice bible, and the latest relevant chapter text.
5. Keep obsolete or archived material out of active continuation context. Do not use `processed_do_not_read` as current story evidence unless the user explicitly asks to inspect archives.
6. Keep changes scoped to the requested novel task. Do not modify unrelated reader app files, metadata, or chapter files.

For chapter production, use this local order:

1. Load `novel-writer`.
2. Load `subagent-layered-novel` when the task needs planning, continuity, or multi-perspective checks.
3. Read the required current-state files.
4. Build the chapter plan or QA notes.
5. Write or revise prose only after the continuity and style constraints are clear.
6. Run the quality gate from `novel-writer`.
7. Update `.ai/SUMMARY.md`, `02_PROJECT_DATABASE/00_CORE/02_plot.md`, and `02_PROJECT_DATABASE/00_CORE/05_foreshadowing.md` only when the chapter work actually changes continuity.
