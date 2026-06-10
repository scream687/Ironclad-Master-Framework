# SPARC Specification: Automated Ironclad MCP Setup

## 1. Specification (Understand)

**Goal:** Automate the registration of the Ironclad MCP server and commands during npm installation.
- Users shouldn't have to manually edit JSON files to use the MCP tools.
- Commands like `/plan` and `/brainstorm` should be available in their favorite AI assistant (Claude, Cursor, etc.) immediately after `npm install -g`.

**Context:**
- MCP config files vary by tool:
  - Claude: `~/Library/Application Support/Claude/claude_desktop_config.json`
  - Cursor: `~/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/mcp_servers.json` (approximate)
- We need to detect these paths and inject the `ironclad` MCP server entry.

**Constraints:**
- **Karpathy Mandate**: Simple, robust detection. Don't break existing user configs.
- **Pocock Mandate**: Use a dedicated service for "MCP Registration".

---

## 2. Pseudocode (Logic)

### 2.1 McpSetupService
```typescript
async function setupMcp() {
  const mcpConfig = {
    "ironclad": {
      "command": "npx",
      "args": ["-y", "ironclad-master-framework", "mcp"]
    }
  };
  
  // 1. Detect platform (Darwin/Linux/Win)
  // 2. Locate config files for Claude Desktop
  // 3. Read existing JSON
  // 4. Merge mcpConfig into 'mcpServers' or 'tools'
  // 5. Write back safely
}
```

### 2.2 Post-install Hook
In `package.json`:
`"postinstall": "node dist/scripts/setup-mcp.js"`

---

## 3. Architecture (Refinement)

### 3.1 New Domain Service
- `src/core/domains/automation/services/mcp-setup.service.ts`

### 3.2 New Script
- `scripts/setup-mcp.ts`: A standalone wrapper that uses the service to perform the one-time setup.

---

## 4. Implementation Plan (Act)

1. **[Service]** Implement `McpSetupService` with multi-assistant detection.
2. **[Script]** Create `scripts/setup-mcp.ts`.
3. **[Package]** Add `postinstall` to `package.json`.
4. **[Binary]** Ensure `bin/ironclad.js` correctly handles the `mcp` command when called via `npx`.
5. **[Verify]** Run the setup script and check if the config files are updated.

---

## 5. Completion (Verify)
- Claude Desktop config includes "ironclad" entry.
- `ironclad mcp` command starts the server correctly.
- Fresh install on a new machine requires zero manual MCP configuration.
