# ⚙️ Ironclad System Design

The **Ironclad Master Framework** is built on a recursive, feedback-driven architecture. It separates the "intent" from the "implementation" through a multi-layered governance system.

## 🏗️ The 4-Layer Architecture

### 1. The Governance Layer (`GEMINI.md`, `CLAUDE.md`, etc.)
- **Purpose**: Defines the rules of engagement.
- **Function**: Forces the AI agent to enter a "state of high-compliance" upon opening the folder.

### 2. The Strategy Engine (`SKILL_ROUTER.md`)
- **Purpose**: Intelligent task-to-tool mapping.
- **Function**: Acts as a middleware that intercepts user requests and routes them to the specialized `.ai-core` assets.

### 3. The Intelligence Hub (`.ai-core/`)
- **Purpose**: Persistent knowledge and capability storage.
- **Function**: Houses the "Atomic Skills" and "Persona Agents" that perform the actual work.

### 4. The Validation Layer (`Makefile`, `.github/workflows/`, `.husky/`)
- **Purpose**: Ensuring zero-slop output.
- **Function**: Automated audits, pre-commit hooks, and CI/CD pipelines that reject anything below the "Ironclad" standard.

## 🔄 The SPARC Execution Loop

1. **Specification**: Capture requirements with absolute clarity.
2. **Pseudocode**: Design the logic before touching the syntax.
3. **Architecture**: Validate the change against the system design.
4. **Refinement**: Implement surgically.
5. **Completion**: Verify via automated audits.

---
*Architecture is the foundation of precision.*
