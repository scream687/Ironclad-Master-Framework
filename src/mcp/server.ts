// src/mcp/server.ts — standalone MCP server entrypoint
import { runMcpServer } from './index';

runMcpServer().catch((error) => {
  console.error('Fatal error in MCP server:', error);
  process.exit(1);
});
