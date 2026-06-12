---
name: upgrade
description: Perform self-evolution and sync latest agent rules.
---

# Command: /upgrade

**Action:** Syncs enterprise instincts and pulls the latest Ironclad rules.

**Workflow:**
1. Calls `CloudSyncService.pullTeamMemory()` to download new AgentDB vectors.
2. Updates `rules/common/` with any newly distilled enterprise coding standards.
3. Refreshes the local `.cursorrules`, `.claude/`, or `.gemini/` configurations via the `install.js` mechanism.