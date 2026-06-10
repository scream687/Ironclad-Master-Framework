import { injectable } from 'inversify';
import fs from 'fs';
import path from 'path';

@injectable()
export class PlanningService {
  private readonly PLANS_DIR = 'plans';

  public async generateSparcSpec(goal: string, context: string): Promise<{ path: string; content: string }> {
    const slug = goal.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50);
    const fileName = `${slug}.md`;
    const filePath = path.join(this.PLANS_DIR, fileName);

    const content = `# SPARC Specification: ${goal}

## 1. Specification (Understand)
${context}

## 2. Pseudocode (Logic)
// Core logic flow defined by intelligence chain

## 3. Architecture (Refinement)
// Architectural changes mapped for SPARC implementation

## 4. Implementation Plan (Act)
1. [Research] System dependencies
2. [Implement] Surgical code changes
3. [Verify] Truth Factor threshold

## 5. Completion (Verify)
// Verified success criteria met
`;

    if (!fs.existsSync(this.PLANS_DIR)) {
      fs.mkdirSync(this.PLANS_DIR, { recursive: true });
    }

    fs.writeFileSync(filePath, content);
    return { path: filePath, content };
  }

  public async brainstorm(topic: string): Promise<string[]> {
    // In a real implementation, this would call an LLM.
    // For now, we return a template/placeholder that the AI assistant can fill.
    return [
      `Strategy 1 for ${topic}: [Details]`,
      `Strategy 2 for ${topic}: [Details]`,
      `Strategy 3 for ${topic}: [Details]`
    ];
  }
}
