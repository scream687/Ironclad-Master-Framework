# Ironclad v2 — Production Design Spec

**Date:** 2026-06-12
**Branch:** `feat/ironclad-v2-production`
**Status:** Approved by owner, pending implementation plan

## Goal

Upgrade Ironclad Master Framework from MVP to a production-ready, self-learning,
crash-proof autonomous engineering system. Installable into any repository with one
command; harnesses every present and future session; can upgrade any codebase to
SSS-level health through an audit → plan → fix → re-audit loop that never falls over.

## Locked Decisions

| Decision | Choice |
|---|---|
| Scope | Single master spec, phased implementation (Phase 0 → 7) |
| Working copy | `~/Developer/Ironclad-Master-Framework`, branch `feat/ironclad-v2-production` |
| Agent engine | Claude Code headless (`claude -p` subprocesses) |
| Guardrails | Sandboxed tool allowlist + iteration/wall-clock/spend ceilings |
| Architecture | Approach A — evolve existing DDD core in place |

---

## Section 1: Foundation & Bug Fixes (Phase 0)

All critical/high findings from the 2026-06-12 code review are fixed before any new
feature work:

1. **ESM crash:** `init` command uses CommonJS `require()` in a `"type":"module"`
   package (`src/cli/index.ts:106`). Replace with `import`.
2. **Binary read:** `PerformanceScanner` reads `.png/.jpg/.webp` as UTF-8. Images get
   `statSync` only.
3. **Unsafe writes:** `healTask()` overwrites source files with no backup. All
   self-heal writes go through a new `SafeWriteService`: backup to
   `.ai-core/backups/<ISO-timestamp>/` first; `--dry-run` flag supported everywhere.
4. **Broken test detection:** nested-test path in `TestingScanner` produces
   double-extension paths that never exist. Fix to strip extension before matching.
5. **Nesting false positives:** `ArchitectureScanner` counts mid-line whitespace.
   Use leading-whitespace only.
6. **Broken bin:** `bin/ironclad.js` spawns dev-only `tsx`. Bin points at compiled
   `dist/cli/index.js`; real build pipeline; verified via `npm pack` smoke install.
7. **Wrong start script:** `package.json` `start` points at nonexistent
   `dist/bin/ironclad.js`.
8. **Rule 5 flood:** `@ironclad-design-signature` governance check becomes opt-in via
   `.ironclad.json` (default off).
9. **Fake share URL** removed from `TerminalUI.renderCertification`.
10. **Invasive postinstall** removed; setup runs only on explicit `ironclad init`.
11. **Encapsulation:** all `(x as any).props` casts replaced with typed accessors on
    `Task` (`getMetadata()` / `setMetadata()`); `AgentDBService.dbInstance` backdoor
    removed in favor of typed repository methods.
12. **Random IDs:** `thought-${Math.random()...}` replaced with UUID v7 (monotonic,
    collision-free).

New top-level config `.ironclad.json` controls all behavior: budgets, allowlists,
rule toggles, memory limits, concurrency, model routing. Nothing hardcoded.

## Section 2: Tiered Persistent Memory ("SSS cache")

`AgentDBService` → `MemoryService`. One SQLite DB (`.ai-core/memory.db`), WAL mode,
busy-timeout, single writer. Three tiers:

| Tier | Contents | Lifetime | Storage cost |
|---|---|---|---|
| HOT | Current loop phase outputs, recent agent transcripts, working notes | Current objective | Full text |
| WARM | Completed sub-task results, verified fixes, decisions + reasons | Per project, TTL weeks | Summaries |
| COLD | Cross-objective patterns, agent performance stats, learned rules | Permanent | One-liners |

- **Promotion:** sub-task completes → HOT transcript compacted (headless
  `claude -p --model haiku` summarization) → WARM entry → HOT rows cleared.
  Objective completes → WARM distills into COLD facts.
- **Keying:** every entry keyed `(project, objective, task)` — no cross-project bleed.
- **Schema:** versioned migrations (`schema_version` table); FTS5 full-text index;
  typed repository methods only.

## Section 3: Token Economy

`TokenEconomyService`, budgets from `.ironclad.json`:

- **Per-spawn context pack:** each `claude -p` call receives task description +
  relevant WARM summaries + COLD facts, capped (default ~8k tokens). Agents never
  receive raw history. Every subprocess starts fresh and cheap.
- **Auto-compact:** HOT tier exceeding row/byte budget → oldest completed transcripts
  summarized and promoted immediately.
- **Auto-clear:** WARM entries past TTL with zero retrieval hits pruned; HOT cleared
  on objective completion. `ironclad memory stats` shows tier sizes + token estimates.
- **Cost ledger:** every spawn logs model/duration/approx tokens to a `spend` table;
  `ironclad cost` reports per-objective spend.

## Section 4: Crash-Proof Infinity Harness

Persistent state machine; every transition is a SQLite transaction:

- **Checkpointing:** objective, sub-task queue, current phase, attempt counts, last
  agent output written BEFORE each phase. Crash/reboot → `ironclad resume` (or
  re-running `ironclad infinity`) continues from the exact phase that died.
- **Real phases:** UNDERSTAND / PLAN / IMPLEMENT / VERIFY each spawn `claude -p` with
  phase-specific agent prompt + token-budgeted context pack + sandboxed
  `--allowedTools` (Read, Edit, Write, build/test/lint Bash; no push, no installs, no
  deletes outside repo).
- **Hard ceilings:** per-task max attempts (3), per-objective max iterations (50),
  wall-clock budget (4h), spend budget. Any ceiling → clean stop + written status
  report. Never hangs.
- **Escalation ladder:** retry same agent → escalate model (haiku→sonnet) → decompose
  task → mark blocked with human-readable reason and continue. Stagnation detection
  (same audit failures 3 consecutive cycles) triggers strategy backtrack.
- **Independent VERIFY:** re-runs scanners/build/tests; never trusts the implementing
  agent's claim.
- **Mandatory post-code re-audit:** every IMPLEMENT phase is followed by re-audit of
  touched files + build + tests before the task can complete. Full-repo re-audit after
  each upgrade-loop cycle. No code lands unaudited.

## Section 5: Agent Hierarchy

Defined as data (markdown + frontmatter in `.ai-core/agents/`), parsed by a new
`AgentRegistryService`:

```
ORCHESTRATOR (harness — routes, never implements)
  └── DOMAIN LEADS (planner, architect, security-lead, quality-lead)
        └── SPECIALISTS (existing 60+ catalog: reviewers, build-resolvers, …)
```

- Routing table: task type → agent → model tier → tool allowlist.
- Model routing is part of the token economy: specialists on haiku where possible,
  leads on sonnet.
- Agent success rate per task type recorded in COLD memory; routing prefers agents
  with better track records (trust strikes lower priority — see Section 9).

## Section 6: Universal Install + Session Auto-Attach

`npx ironclad init` in any repo:

1. Drops `.ironclad.json` + `.ai-core/` (memory DB, agent catalog, rules), tailored
   to detected stack (lockfile/manifest detection: Next.js, Python, Go, …).
2. Installs Claude Code hooks into `.claude/settings.json`:
   - **SessionStart:** loads Ironclad memory context into every new session.
   - **Stop:** compacts the session's learnings back into WARM memory.
   Every present and future session is harnessed automatically.
3. Registers the Ironclad MCP server (`ironclad_plan`, `ironclad_brainstorm`,
   `ironclad_audit`, `ironclad_upgrade`, `ironclad_swarm_status`).

## Section 7: SSS Upgrade Pipeline

`ironclad upgrade [--target sss]` — point at any codebase:

```
AUDIT (5 scanners) → score → PLAN (fix tasks, critical-first)
  → INFINITY LOOP (harness executes) → RE-AUDIT
  → repeat until Truth Score ≥ target or ceiling hit
  → CERTIFICATION report
```

`ironclad check` = audit only. `brainstorm`/`plan` share the same memory and
pipeline. One pipeline, consistent behavior.

## Section 8: Testing & Production-Readiness Bar

- Unit tests for every service (vitest); ≥80% coverage on `src/core`.
- Harness integration test: kill process mid-phase, restart, assert exact resume.
- Fixture repo with known defects; `ironclad upgrade` must measurably raise its score
  in CI.
- GitHub Actions: build, test, `npm pack` smoke-install into clean directory.
- Graceful degradation when `claude` CLI absent (framework-only mode).

## Section 9: Brutal Truth Factor

- **No grade inflation.** SSS requires: score 100, zero issues, passing build,
  passing tests, coverage ≥80%. Below 60 = F, stamped "NOT PRODUCTION READY".
- **Claims never trusted.** `TruthEnforcementService` independently re-runs
  build/tests/scanners. Agent reports contradicting empirical reality are logged to
  COLD memory as trust strikes, lowering that agent's routing priority.
- **Brutal reporting.** Certification states what's broken, claimed-vs-verified, and
  what was NOT checked. `--brutal` flag surfaces every minor issue.

## Section 10: Swarm Execution + Skill/Plugin/MCP Routing

- **Agent swarm:** orchestrator builds a sub-task dependency graph; independent tasks
  run as parallel `claude -p` subprocesses (default concurrency 3, bounded by spend
  budget). Results merge through single-writer SQLite checkpoints — no state
  corruption.
- **Skill router:** `SkillRegistryService` indexes `skills/` (300+) +
  `SKILL_ROUTER.md` into a task-type → required-skills map. Matching skills are
  injected into each spawned agent's prompt. Every task runs with its required
  skills — none skipped.
- **Plugin + MCP wiring:** spawned agents inherit project MCP servers (`.mcp.json`)
  within the allowlist. Ironclad's own MCP server exposes the full command set for
  any MCP-capable client. Plugins detected at `init` are recorded in the routing
  table; tasks prefer plugin/MCP tools over hand-written code.

## Section 11: Continuous SSS Learning + Anti-Generic Enforcement

- **Learn from every run:** objectives, fixes, failures, verification outcomes
  distill into COLD memory as reusable patterns. Router, planner, and agents consult
  learned patterns before acting. Never starts from zero.
- **Anti-generic (anti-slop) enforcement:** `GenericnessDetector` scanner flags
  template slop — default Tailwind/shadcn boilerplate as finished design, stock hero
  sections, uniform spacing without hierarchy, generic naming (`utils2.ts`,
  `handleStuff`), copy-paste duplication. Generic output = major issue, blocks SSS
  certification. UI tasks always route through design-intelligence skills
  (`ui-ux-pro-max`, `impeccable`, design-quality rules).
- **Self-upgrading:** `ironclad evolve` reviews COLD memory, promotes high-confidence
  patterns into `.ai-core/rules/`, retires stale patterns. The framework runs its own
  SSS pipeline on itself.

---

## Implementation Phases

| Phase | Delivers | Sections |
|---|---|---|
| 0 | Foundation fixes, `.ironclad.json`, SafeWriteService, build pipeline | 1 |
| 1 | Tiered MemoryService + migrations + FTS5 | 2 |
| 2 | TokenEconomyService + cost ledger | 3 |
| 3 | Crash-proof harness + headless spawner + ceilings + escalation | 4 |
| 4 | AgentRegistry + hierarchy + model routing | 5 |
| 5 | Universal init + session hooks + MCP expansion | 6 |
| 6 | Upgrade pipeline + Brutal Truth + GenericnessDetector | 7, 9, 11 |
| 7 | Swarm execution + skill router + evolve + full test suite | 8, 10, 11 |

Each phase ends with: build green, tests green, self-audit pass, commit.

## Error Handling Principles

- Every subprocess spawn has a timeout and captured stderr; failures recorded, never
  swallowed.
- SQLite transactions around all state mutations; partial writes impossible.
- Any unexpected exception in the loop = checkpoint + clean exit with status report,
  never a hang or silent death.

## Out of Scope (v2)

- Vector embeddings / HNSW semantic search (schema reserves the `embedding` column).
- Cloud sync of memory.
- The Pro dashboard GUI and GitHub App (untouched, not blocking).
