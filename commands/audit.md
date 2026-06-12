---
name: audit
description: Run a cinematic Truth Score verification on the codebase.
---

# Command: /audit

**Action:** Triggers the Ironclad Truth-First Audit on the current project.

**Workflow:**
1. Delegate to the `ironclad-auditor` or `code-reviewer` agent.
2. The agent will execute `ironclad audit` via bash or run the internal Node scripts to assess the codebase.
3. Check for hardcoded secrets, AST bloat, missing test coverage, and cinematic frontend mapping.
4. Report the final score out of 100.
5. If the score is < 0.95, recommend the `/build-fix` or `/refactor-clean` commands to remediate.