---
name: brainstorm
description: Access the Intelligence Hub for creative strategic ideation.
---

# Command: /brainstorm

**Action:** Engages the agent in an unconstrained exploration mode prior to formal planning.

**Workflow:**
1. The agent enters a "creative context" where strict `PreToolUse` hooks may be temporarily bypassed for scratchpad files.
2. Cross-reference existing `AgentDB` memories to find similar past patterns.
3. Output 3-5 alternative architectural strategies.
4. Once the user selects a strategy, the workflow transitions to `/plan`.