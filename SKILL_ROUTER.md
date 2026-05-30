# SKILL_ROUTER.md — Ironclad Mapping Table

This file is the mandatory lookup table for all AI operations. Before performing any task, you MUST check this table to identify the required skills.

## 1. Core Workflow
| Task Category | Primary Skill (MANDATORY) | Secondary Skill (IF APPLICABLE) |
|---|---|---|
| **Planning & Design** | `sparc-methodology` | `enter_plan_mode` |
| **New Features** | `sparc-methodology` | `tdd` |
| **Bug Fixing** | `diagnose` | `source-command-sparc-debug` |
| **UI/UX Design** | `ui-ux-pro-max` | `impeccable` |
| **Frontend Polish** | `impeccable` | `design-taste-frontend` |
| **Architecture Refactor** | `improve-codebase-architecture` | `zoom-out` |
| **Code Review** | `github-code-review` | `Verification & Quality Assurance` |
| **Security Audit** | `source-command-sparc-security-review` | `V3 Security Overhaul` |
| **Testing** | `tdd` | `Verification & Quality Assurance` |
| **Documentation** | `source-command-sparc-docs-writer` | `grill-with-docs` |
| **Knowledge Mgmt** | `graphify` | `mcp__knowledge_work` |

## 2. Multi-Agent Coordination
- If the task is complex/multi-file: Use `source-command-sparc-sparc` (SPARC Orchestrator).
- If the task involves high-volume data: Invoke `generalist` sub-agent.
- If the task is purely investigative: Invoke `codebase_investigator`.

## 3. Mandatory Triggers
- **Trigger:** Any UI change. **Action:** MUST activate `ui-ux-pro-max` and check `tools/stop-slop`.
- **Trigger:** Any API or logic change. **Action:** MUST activate `tdd` and create a reproduction script.
- **Trigger:** Any new project init. **Action:** MUST activate `sparc-methodology` and create `GEMINI.md`.

## 4. Advanced Scenario Routing
| Scenario | Action / Skill Chain |
|---|---|
| **Performance Regression** | `diagnose` -> `V3 Performance Optimization` |
| **Complex Refactor** | `zoom-out` -> `improve-codebase-architecture` -> `sparc-methodology` |
| **New API Integration** | `sparc-methodology` -> `tdd` -> `mcp-server-patterns` |
| **Visual Polish Session** | `impeccable` -> `design-motion-principles` -> `high-end-visual-design` |
| **Security Breach/Audit** | `source-command-sparc-security-review` -> `V3 Security Overhaul` |

## 5. Ironclad Enforcement
Failure to activate the mapped skill is a breach of the Master Framework protocol. You must explicitly confirm skill activation in your response before writing code.
