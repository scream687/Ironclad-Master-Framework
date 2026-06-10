import { McpSetupService } from '../src/core/domains/automation/services/mcp-setup.service.js';

async function run() {
  console.log('🛡️ Ironclad Auto-Setup: Registering MCP Tools...');
  const service = new McpSetupService();
  await service.autoRegister();
  console.log('✅ Ironclad Setup Complete.');
}

run().catch(console.error);
