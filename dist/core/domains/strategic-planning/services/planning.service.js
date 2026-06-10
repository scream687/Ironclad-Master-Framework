var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
import fs from 'fs';
import path from 'path';
let PlanningService = class PlanningService {
    PLANS_DIR = 'plans';
    async generateSparcSpec(goal, context) {
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
    async brainstorm(topic) {
        // In a real implementation, this would call an LLM.
        // For now, we return a template/placeholder that the AI assistant can fill.
        return [
            `Strategy 1 for ${topic}: [Details]`,
            `Strategy 2 for ${topic}: [Details]`,
            `Strategy 3 for ${topic}: [Details]`
        ];
    }
};
PlanningService = __decorate([
    injectable()
], PlanningService);
export { PlanningService };
