# 🌐 Universal Orchestration Manifest
## The Unified 5-Step Operational Loop

This manifest defines the mandatory operating loop for all AI agents (Gemini, Claude, Cursor, Windsurf, Cline) operating within the **Ironclad Master Framework**. It leverages the 6 elite repositories integrated into `.ai-core/`.

---

## 🏛️ The God-Tier Synthesis

Every task, regardless of complexity, MUST follow this sequence. Skipping a phase is a breach of the Ironclad Protocol.

### Phase 1: Understand (Architectural Mapping)
**Engine**: `Lum1104/Understand-Anything`
- **Mandate**: Before any code is read or modified, map the architectural dependencies.
- **Action**: Use semantic search and dependency mapping to understand data flows.
- **Alternative**: Fallback to `graphify` if multimodal understanding is unavailable.

### Phase 2: Plan (Strategic Spec)
**Engine**: `obra/superpowers` (writing-plans)
- **Mandate**: No code generation without a numbered, executable plan.
- **Action**: Transform intent into a formal SPARC Specification and Implementation Plan.
- **Deliverable**: A `.md` plan file in the project's task tracker.

### Phase 3: Delegate (Swarm Orchestration)
**Engine**: `Infiniteyieldai/ECC` (Enterprise Command Center)
- **Mandate**: Never work alone on multi-file tasks.
- **Action**: Spawn parallel sub-agents (Architect, Coder, Reviewer) in ONE message.
- **Workflow**: `feature-dev:code-architect` (design) → `coder` (draft) → `feature-dev:code-reviewer` (audit).

### Phase 4: Implement (Standardized Engineering)
**Engine**: `anthropics/claude-plugins-official` (frontend-design)
- **Mandate**: Use official plugin standards for UI and system logic.
- **Action**: Apply the `frontend-design` workflow for all React/Next.js components.
- **Constraint**: Adhere to the `karpathy-guidelines` (Simplicity First, Surgical Changes).

### Phase 5: Verify (Autonomous Visual QA)
**Engine**: `vercel-labs/agent-browser`
- **Mandate**: "Done" requires visual and behavioral evidence.
- **Action**: Open the browser, take snapshots, and verify accessibility/responsiveness.
- **Threshold**: Truth Score ≥ 0.95 (via `verification-quality` skill).

---

## 🔌 Cross-CLI Compatibility Layer

| Platform | Protocol | Command Style |
|---|---|---|
| **Gemini CLI** | Native MCP | `activate_skill("name")` |
| **Claude Code** | Native Plugin | `Skill({ skill: "name" })` |
| **Cursor** | `.cursorrules` | System Prompt Override |
| **Windsurf** | `.windsurfrules` | Flow Context |
| **Cline** | `.clinerules` | Task Rules |

---
*Powered by Ironclad.*
