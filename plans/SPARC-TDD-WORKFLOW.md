# SPARC: Ironclad TDD Workflow Skill

## 1. Specification (S)
**Goal:** Define the exact execution protocol for the `ironclad-tdd` skill. This skill forces the AI into a strict Test-Driven Development loop, completely eliminating the "code first, test later" anti-pattern.
**Reference Benchmark:** ECC `tdd-workflow` skill and `tdd-guide` agent.
**Key Requirements:**
1. **Red Phase Isolation:** The AI must first write a failing test and *prove* it fails by executing the test runner. It cannot write implementation logic until the test failure is verified.
2. **Tracer Bullet Orchestration:** Integration with the `TddService.runTracerBullet()` infrastructure for automated test scaffolding and runner execution.
3. **Green Phase Minimums:** The AI must write the *minimum* code required to pass the test. No speculative feature bloat.
4. **Refactor Phase Gating:** Refactoring must immediately trigger the `ironclad audit` to ensure the 0.95 Truth Factor is maintained before concluding the loop.

## 2. Pseudocode & Workflow Flowchart (P)

```markdown
[Trigger: /ecc:tdd "Feature Name"]

1. System spawns TDD Agent.
2. Agent reads domain interfaces and existing architectural context via AgentDB.
3. Agent calls `run_shell_command` -> `ironclad mcp tdd-scaffold "Feature Name"`
4. TddService scaffolds test file.
5. Agent modifies test file with assertions (RED).
6. Agent runs test. ASSERT failure.
7. Agent implements logic in source file (GREEN).
8. Agent runs test. ASSERT success.
9. Agent refactors for DRY/SOLID (REFACTOR).
10. System runs `PreToolUse` Truth Check -> 0.95+ required to save.
```

## 3. Architecture (A)
**Skill Boundary & Dependencies:**
*   **SKILL.md Definition:** Located at `skills/ironclad-tdd/SKILL.md`. This contains the YAML frontmatter and the exact prompt instructions the AI must follow.
*   **Agent Binding:** Will be executed by the specialized `agents/ironclad-tdd-guide.md` subagent.
*   **Backend Support:** Relies on the `TddService` class in the Ironclad Kernel to physically interface with the file system and `shell.exec`.

**Data Flow:**
`User Prompt -> TDD Guide Agent -> SKILL.md Instructions -> TddService.runTracerBullet() -> Jest/Mocha Output -> Agent Analysis`

## 4. Refinement & Optimization (R)
*   **Token Isolation:** During the TDD loop, the agent will aggressively use the `WatchService.compressContext()` to strip out unrelated tests and AST bloat, ensuring it stays hyper-focused on the active red-green file pair.
*   **Anti-Hallucination:** By requiring the stderr output of the failing test (Red phase) before proceeding, the agent is mathematically blocked from hallucinating successful test coverage.

## 5. Completion (C)
*   **Phase 1:** Draft SKILL.md with strict instructions. *(Completed during Phase 1 scaffold)*
*   **Phase 2:** Bind `TddService` to actually execute the tracer bullet. *(Completed during DDD service implementation)*
*   **Phase 3:** Integrate Truth Factor hooks. *(Completed via PreToolUse hook)*
*   **Next Steps:** Formally define the `agents/ironclad-tdd-guide.md` persona to enforce these steps natively across all harnesses.