import { injectable } from 'inversify';
import fs from 'fs';
import path from 'path';
import shell from 'shelljs';

@injectable()
export class InitService {
  public async ironcladDirectory(targetDir: string): Promise<void> {
    const aiCore = path.join(targetDir, '.ai-core');
    const rules = path.join(aiCore, 'rules');
    const skills = path.join(aiCore, 'skills');
    const mcp = path.join(aiCore, 'mcp');

    // 1. Create Core Structure
    [rules, skills, mcp, path.join(targetDir, 'plans'), path.join(targetDir, 'docs')].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // 2. Inject Truth Mandate
    const truthMandatePath = path.join(rules, 'truth-mandate.md');
    const truthMandateContent = `# ⚖️ Ironclad Truth Mandate
*Protocol: Zero-Hallucination & Factual Integrity*

## 1. The Prime Directive
You are an Ironclad AI Agent. Your primary obligation is to the **TRUTH**.

## 2. Hallucination Escape Protocol
If confidence score < 0.95, activate the protocol.

---
*Stay Ironclad.*`;
    fs.writeFileSync(truthMandatePath, truthMandateContent);

    // 3. Inject GEMINI.md Template
    const geminiPath = path.join(targetDir, 'GEMINI.md');
    const geminiContent = `# GEMINI.md — Ironclad Universal Synthesis

This project is governed by the **Ironclad Master Framework**.

## 🏛️ The God-Tier Operational Loop
1. Understand
2. Plan
3. Delegate
4. Implement
5. Verify

---
*Stay Ironclad.*`;
    if (!fs.existsSync(geminiPath)) {
      fs.writeFileSync(geminiPath, geminiContent);
    }

    // 4. Inject SKILL_ROUTER.md
    const routerPath = path.join(targetDir, 'SKILL_ROUTER.md');
    const routerContent = `# SKILL_ROUTER.md — Universal Strategy Engine

| Phase | Category | Skill |
|---|---|---|
| **1. Understand** | Architectural Mapping | \`Understand-Anything\` |
| **5. Verify** | Factual Integrity | \`Truth Factor\` |

---
*Stay Ironclad.*`;
    if (!fs.existsSync(routerPath)) {
      fs.writeFileSync(routerPath, routerContent);
    }
  }
}
