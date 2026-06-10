import { injectable } from 'inversify';
import fs from 'fs';
import path from 'path';
import os from 'os';

@injectable()
export class McpSetupService {
  public async autoRegister(): Promise<void> {
    const platform = os.platform();
    const home = os.homedir();
    
    const configs = [
      // Claude Desktop
      {
        path: platform === 'darwin' 
          ? path.join(home, 'Library/Application Support/Claude/claude_desktop_config.json')
          : path.join(home, '.config/Claude/claude_desktop_config.json'),
        key: 'mcpServers'
      }
    ];

    for (const config of configs) {
      await this.injectConfig(config.path, config.key);
    }
  }

  private async injectConfig(configPath: string, key: string): Promise<void> {
    if (!fs.existsSync(configPath)) {
      // Create directory if it doesn't exist, but maybe don't create the file 
      // if the app isn't installed.
      const dir = path.dirname(configPath);
      if (!fs.existsSync(dir)) return;
      
      fs.writeFileSync(configPath, JSON.stringify({ [key]: {} }, null, 2));
    }

    try {
      const content = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if (!content[key]) content[key] = {};

      content[key]['ironclad'] = {
        command: 'npx',
        args: ['-y', 'ironclad-master-framework', 'mcp']
      };

      fs.writeFileSync(configPath, JSON.stringify(content, null, 2));
      // [Ironclad-Purger] Removed unauthorized log
    } catch (error) {
      console.error(`❌ Failed to update MCP config at ${configPath}:`, error);
    }
  }
}
