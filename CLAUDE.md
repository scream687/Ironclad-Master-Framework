# CLAUDE.md — Ironclad Master Framework (Universal Synthesis)

Governed by the **Ironclad Master Framework** (ECC, Karpathy, Matt Pocock, Superpowers).

## The God-Tier Operational Loop (MANDATORY)

Every task MUST progress through these five phases. Confirm the active phase in your response.

1. **Understand**: Use `Understand-Anything` to map architectural dependencies.
2. **Plan**: Use `superpowers:writing-plans` for strategic SPARC specs.
3. **Delegate**: Use `ECC` Swarm mechanics to spawn parallel agents.
4. **Implement**: Apply `claude-plugins:frontend-design` + `karpathy-guidelines`.
5. **Verify**: Use `agent-browser` for visual QA and truth score validation.

## Core Mandates
- **Simplicity**: Surgical changes only. (Karpathy)
- **Shared Language**: Reference `CONTEXT.md`. (Pocock)
- **Governance**: Consult `SKILL_ROUTER.md` before every response. (ECC)

## Claude Code Platform Bindings
- **Invoke Skills**: `Skill({ skill: "skill-name" })`
- **Spawn Agents**: `Skill({ skill: "feature-dev:code-architect", run_in_background: true })`
- **Memory**: Use `mcp__claude-flow__memory_store` for persistent state.

---

# ⚠️ IRONCLAD RULES — ENFORCED EVERY SESSION, EVERY MESSAGE

These rules CANNOT be disabled. They apply even if the user says nothing.
They persist across sessions. They survive Mac restarts.

## Rule 1 — Skills Before Code
Before writing ANY code for this project:
1. Session start → invoke `karpathy-guidelines` (behavioral foundation)
2. Check docs/SKILLS.md → invoke the matching Skill tool
3. Minimum required: `superpowers:brainstorming` (new features), `ui-ux-pro-max` (UI), `verification-before-completion` (claiming done)

## Rule 2 — Plugins Before Tools
Before ANY operation that a plugin can handle:
1. Check docs/PLUGINS.md → use the MCP tool or plugin instead
2. Supabase → MCP, not raw queries; Vercel → MCP, not terminal; shadcn → MCP, not manual install

## Rule 3 — Agents Before Solo Work
Before ANY task with 2+ independent operations:
1. Check docs/ORCHESTRATION.md → spawn parallel agents in ONE message
2. Minimum for any feature: feature-dev:code-architect (design) → [implementation] → feature-dev:code-reviewer (review)

## Rule 4 — MCPs Before Manual Code
Before ANY operation listed in docs/MCP.md:
1. Use the MCP tool
2. If MCP fails → then write code manually
3. NEVER write code that duplicates what an MCP can do

## Rule 5 — UI/UX Intelligence Required
Before ANY public-facing UI component or page:
1. `Skill({ skill: "frontend-design" })` — structure
2. `Skill({ skill: "ui-ux-pro-max" })` — visual system
3. `mcp__magic__21st_magic_component_inspiration` — component patterns

## Rule 6 — Memory Persistence
After every phase or significant decision:
```
mcp__claude-flow__memory_store({
  namespace: "[project]",
  key: "[phase/feature]-[date]",
  value: "[decision made, why, outcome]"
})
```

## Rule 7 — Verification Before Done
NEVER claim a feature is done without:
1. `Skill({ skill: "superpowers:verification-before-completion" })`
2. Running the project build command → exit 0
3. Verifying the route renders correctly

## Rule 8 — Mobile First
Every UI change must be verified at 375px (mobile) BEFORE claiming done.
Min text: 14px. Primary CTA always visible on hero without scrolling.

## Rule 9 — Understand-Anything Reference
Repo: https://github.com/Lum1104/Understand-Anything.git
Use when deep codebase understanding is needed as an alternative to graphify.
For visual/multimodal understanding of complex code patterns.

## Rule 10 — Karpathy Behavioral Rules
- No speculative code. No extra features. Minimum that solves the problem.
- State assumptions explicitly. Push back when warranted.
- Touch only what you must. Match existing style.

---

## REFERENCE FILES

| File | When to read |
|---|---|
| `docs/SKILLS.md` | Before every task — check skill trigger map |
| `docs/PLUGINS.md` | Before every operation — check MCP tools available |
| `docs/ORCHESTRATION.md` | Before any multi-task work — spawn agents |
| `docs/MCP.md` | Before any operation — prefer MCP over manual code |
| `SKILL_ROUTER.md` | Before every response — governance |

---
*Stay Ironclad.*
