---
name: mcp
description: Launch the Model Context Protocol server for AI assistant integration.
---

# Command: /mcp

**Action:** Triggers the MCP configuration and launch sequence.

**Workflow:**
1. Loads the standard Ironclad MCPs defined in `mcp-configs/mcp-servers.json`.
2. Binds the AI harness to the Ironclad DDD Kernel.
3. Ensures all tools (like `TddService` and `StrategicPlanningService`) are exposed natively to the agent.