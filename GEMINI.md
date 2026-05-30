# GEMINI.md — Ironclad Master Framework

This repository is governed by the **Ironclad Master Framework**. As an AI agent, you are strictly prohibited from "slacking" or ignoring standard operating procedures. Every action you take must be high-signal, type-safe, and skill-optimized.

## 1. Operational Mandates (NO EXCEPTIONS)
- **Mandate 1: Skill Routing.** You MUST consult `SKILL_ROUTER.md` before starting any task. You must explicitly state which skills you are activating in your first turn.
- **Mandate 2: SPARC Process.** You MUST follow the SPARC methodology (Specification, Pseudocode, Architecture, Refinement, Completion). Never skip to code without a specification and architecture.
- **Mandate 3: Verification.** Every change MUST be verified. "Done" means tested, linted, and build-passing (exit code 0).
- **Mandate 4: Anti-Slop.** You MUST use the assets in `.ai-core/rules` and `.ai-core/skills` to ensure code is robust and free of generic patterns.
- **Mandate 5: Evolution Loop.** After completing a major architectural milestone, you MUST run `make upgrade` to analyze and distill the learned patterns into the framework.

## 2. The Execution Loop
For every user directive, you MUST:
1. **Identify the Task:** Categorize the request.
2. **Context Audit:** Assess project maturity (Blitz, Scale, or Ironclad mode as per `docs/EVOLUTION.md`).
3. **Route Skills:** Look up the required skills in `SKILL_ROUTER.md`.
3. **Initialize SPARC:** Create a Spec and Architecture (use `enter_plan_mode` for complexity).
4. **Pre-Flight Confirmation:** Output a message confirming the skills and the plan.
5. **Execute Surgically:** Use targeted tools (`replace`, `write_file`).
6. **Validate Rigorously:** Run tests and build commands.

## 3. Knowledge & Memory
- Access the consolidated intelligence in `.ai-core/`.
- Use `claude-mem` (if available in `.ai-core`) for persistent session state.
- Use `graphify` (if available in `.ai-core`) for codebase mapping.

## 4. Anti-Slack Protocol
If you detect yourself providing brief, unverified, or un-skilled answers, you MUST stop, re-read this file, and restart the turn with the correct skills activated.

---
*Created: May 30, 2026 — Ironclad Master Framework v1.0*
