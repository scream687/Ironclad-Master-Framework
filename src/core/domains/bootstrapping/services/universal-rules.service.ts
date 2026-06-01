import { injectable } from 'inversify';
import fs from 'fs';
import path from 'path';

export interface RuleFile {
  name: string;
  platform: string;
  filename: string;
  template: string;
}

@injectable()
export class UniversalRulesService {
  private readonly rules: RuleFile[] = [
    {
      name: 'Gemini CLI',
      platform: 'Google Gemini',
      filename: 'GEMINI.md',
      template: '# GEMINI.md — Ironclad Universal Synthesis\n\nThis project is governed by the **Ironclad Master Framework**.'
    },
    {
      name: 'Claude / Cline',
      platform: 'Anthropic Claude',
      filename: 'CLAUDE.md',
      template: '# CLAUDE.md — Ironclad Universal Synthesis\n\nThis project is governed by the **Ironclad Master Framework**.'
    },
    {
      name: 'Cursor',
      platform: 'Cursor IDE',
      filename: '.cursorrules',
      template: 'Project governed by Ironclad Master Framework. Follow TRUTH MANDATE and DDD Architecture.'
    },
    {
      name: 'Windsurf',
      platform: 'Windsurf IDE',
      filename: '.windsurfrules',
      template: 'Project governed by Ironclad Master Framework. Follow TRUTH MANDATE and DDD Architecture.'
    },
    {
      name: 'Roo Code',
      platform: 'Roo Code / Cline',
      filename: '.clinerules',
      template: 'Project governed by Ironclad Master Framework. Follow TRUTH MANDATE and DDD Architecture.'
    },
    {
      name: 'GitHub Copilot',
      platform: 'GitHub Copilot',
      filename: '.github/copilot-instructions.md',
      template: '# Copilot Instructions\n\nThis project is governed by the **Ironclad Master Framework**.'
    },
    {
      name: 'Aider',
      platform: 'Aider AI',
      filename: '.aiderules',
      template: 'Project governed by Ironclad Master Framework. Follow TRUTH MANDATE and DDD Architecture.'
    }
  ];

  public async syncAllRules(targetDir: string): Promise<string[]> {
    const synced: string[] = [];
    const distilledMandates = this.getDistilledMandates();

    for (const rule of this.rules) {
      const fullPath = path.join(targetDir, rule.filename);
      const dir = path.dirname(fullPath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const content = `${rule.template}\n\n## 🛠️ God-Tier Protocols\n${distilledMandates}\n\n---\n*Stay Ironclad. Optimized for ${rule.platform}.*`;
      fs.writeFileSync(fullPath, content);
      synced.push(rule.filename);
    }

    return synced;
  }

  private getDistilledMandates(): string {
    // This could be fetched from .ai-core/rules/ironclad-distilled.md
    return `1. **Understand**: Map architecture before coding.
2. **Plan**: Draft SPARC specs in plans/.
3. **Truth Factor**: Confidence < 0.95 = Activate Hallucination Escape.
4. **DDD Architecture**: Respect domain boundaries.
5. **Zero Slop**: No unauthorized logs or TODOs.`;
  }
}
