# SKILL_ROUTER.md — Universal Strategy Engine

This file is the mandatory lookup table for all AI operations. Before performing any task, you MUST check this table to identify the required skills.

## 1. Core Workflow
| Task Category | Primary Skill (MANDATORY) | Secondary Skill (IF APPLICABLE) |
|---|---|---|
| **Planning & Design** | `sparc-methodology` | `enter_plan_mode` |
| **New Features** | `sparc-methodology` | `tdd` |
| **Bug Fixing** | `diagnose` | `source-command-sparc-debug` |
| **UI/UX Design** | `ui-ux-pro-max` | `impeccable` |
| **Architecture Refactor** | `improve-codebase-architecture` | `zoom-out` |
| **Token Optimization** | `caveman` | `zoom-out` |
| **Deep Investigation** | `codebase_investigator` | `Understand-Anything` |
| **Enterprise Ops** | `ECC` | `Verification & Quality Assurance` |

## 2. Advanced Scenario Routing
| Scenario | Action / Skill Chain |
|---|---|
| **Performance Regression** | `diagnose` -> `V3 Performance Optimization` |
| **Complex Refactor** | `zoom-out` -> `improve-codebase-architecture` -> `sparc-methodology` |
| **Visual Polish Session** | `impeccable` -> `design-motion-principles` -> `high-end-visual-design` |
| **Security Breach/Audit** | `source-command-sparc-security-review` -> `V3 Security Overhaul` |
| **Insane Complexity** | `Understand-Anything` -> `graphify` -> `codebase_investigator` |

## 3. Mandatory Triggers
- **Trigger:** Any UI change. **Action:** MUST activate `ui-ux-pro-max`.
- **Trigger:** Verbose output detected. **Action:** MUST activate `caveman` mode.
- **Trigger:** New domain concepts found. **Action:** MUST update `CONTEXT.md` (Pocock Shared Language).
- **Trigger:** Missing external skill. **Action:** MUST execute `make fetch-skill`.

## 4. Ironclad Enforcement
Failure to activate the mapped skill is a breach of the Master Framework protocol. You must explicitly confirm skill activation in your response before writing code.
