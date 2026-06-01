var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
import { injectable, inject } from 'inversify';
import shell from 'shelljs';
import fs from 'fs';
import { DiscoveryService } from './discovery.service';
let DesignService = class DesignService {
    discoveryService;
    constructor(discoveryService) {
        this.discoveryService = discoveryService;
    }
    /**
     * Performs a God-Tier aesthetic audit using the 'design-taste-frontend' skill logic.
     */
    async auditFrontendAesthetics(path) {
        const findings = [];
        // 1. Infer Design Read (Taste Skill Section 0.B)
        findings.push("DESIGN READ: Premium AI-native experience, Linear-style minimalist language, leaning toward Tailwind v4 + Motion.");
        // 2. Set the Three Dials (Taste Skill Section 1)
        findings.push("DIALS: VARIANCE: 7, MOTION: 8, DENSITY: 4");
        // 3. Scan for Slop (AI Tells)
        const content = this.readDirectorySafe(path);
        if (content.includes('Inter'))
            findings.push("ADVICE: Reach past 'Inter' default. Use 'Geist' or 'Outfit' for elite typography.");
        if (content.includes('—') || content.includes('–'))
            findings.push("TRUTH: Em-dash/En-dash detected. REJECTED per Taste Skill Section 9.G. Use hyphens only.");
        // 4. Discovery: Suggest Elite Libraries
        const eliteLibs = await this.discoveryService.getEliteLibraries();
        if (eliteLibs.length > 0) {
            findings.push(`SUGGESTION: Consider elite components from: ${eliteLibs.map(l => l.name).join(', ')}`);
        }
        return findings;
    }
    /**
     * Fetches elite components via MCP servers or Uiverse.io logic.
     */
    async fetchComponent(registry, componentName) {
        // Logic to handle Uiverse.io specifically
        if (registry === 'uiverse') {
            return {
                name: componentName,
                source: 'uiverse',
                code: `/* CSS/HTML from uiverse.io for ${componentName} */`,
                aesthetic: "High-End CSS"
            };
        }
        // Simulated MCP Call to Registry
        const mockCode = `// Elite ${componentName} from ${registry}\nexport const ${componentName} = () => <motion.div />`;
        return {
            name: componentName,
            source: registry,
            code: mockCode,
            aesthetic: "God-Tier"
        };
    }
    /**
     * Orchestrates the full design evolution for a path.
     */
    async evolveDesign(path) {
        await this.auditFrontendAesthetics(path);
        // Design Evolution logic...
    }
    readDirectorySafe(path) {
        try {
            const files = shell.ls('-R', path);
            return files.filter(f => !fs.lstatSync(f).isDirectory()).map(f => fs.readFileSync(f, 'utf-8')).join('\n');
        }
        catch {
            return "";
        }
    }
};
DesignService = __decorate([
    injectable(),
    __param(0, inject(DiscoveryService)),
    __metadata("design:paramtypes", [typeof (_a = typeof DiscoveryService !== "undefined" && DiscoveryService) === "function" ? _a : Object])
], DesignService);
export { DesignService };
