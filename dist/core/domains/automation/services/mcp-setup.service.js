var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
import fs from 'fs';
import path from 'path';
import os from 'os';
let McpSetupService = class McpSetupService {
    async autoRegister() {
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
    async injectConfig(configPath, key) {
        if (!fs.existsSync(configPath)) {
            // Create directory if it doesn't exist, but maybe don't create the file 
            // if the app isn't installed.
            const dir = path.dirname(configPath);
            if (!fs.existsSync(dir))
                return;
            fs.writeFileSync(configPath, JSON.stringify({ [key]: {} }, null, 2));
        }
        try {
            const content = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            if (!content[key])
                content[key] = {};
            content[key]['ironclad'] = {
                command: 'npx',
                args: ['-y', 'ironclad-master-framework', 'mcp']
            };
            fs.writeFileSync(configPath, JSON.stringify(content, null, 2));
            // [Ironclad-Purger] Removed unauthorized log
        }
        catch (error) {
            console.error(`❌ Failed to update MCP config at ${configPath}:`, error);
        }
    }
};
McpSetupService = __decorate([
    injectable()
], McpSetupService);
export { McpSetupService };
