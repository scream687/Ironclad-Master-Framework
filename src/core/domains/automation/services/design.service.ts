import { injectable, inject } from 'inversify';
import shell from 'shelljs';
import fs from 'fs';
import { DiscoveryService, LibraryMetadata } from './discovery.service';

export interface DesignComponent {
  name: string;
  source: 'shadcn' | 'magic-ui' | '21st-dev' | 'framer-motion' | 'uiverse' | 'external';
  code: string;
  aesthetic: string;
}

@injectable()
export class DesignService {
  constructor(
    @inject(DiscoveryService) private discoveryService: DiscoveryService
  ) {}

  /**
   * Performs a God-Tier aesthetic audit using the 'design-taste-frontend' skill logic.
   */
  public async auditFrontendAesthetics(path: string): Promise<string[]> {
    const findings: string[] = [];
    
    // 1. Infer Design Read (Taste Skill Section 0.B)
    findings.push("DESIGN READ: Premium AI-native experience, Linear-style minimalist language, leaning toward Tailwind v4 + Motion.");

    // 2. Set the Three Dials (Taste Skill Section 1)
    findings.push("DIALS: VARIANCE: 7, MOTION: 8, DENSITY: 4");

    // 3. Scan for Slop (AI Tells)
    const content = this.readDirectorySafe(path);
    if (content.includes('Inter')) findings.push("ADVICE: Reach past 'Inter' default. Use 'Geist' or 'Outfit' for elite typography.");
    if (content.includes('—') || content.includes('–')) findings.push("TRUTH: Em-dash/En-dash detected. REJECTED per Taste Skill Section 9.G. Use hyphens only.");

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
  public async fetchComponent(registry: string, componentName: string): Promise<DesignComponent> {
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
      source: registry as any,
      code: mockCode,
      aesthetic: "God-Tier"
    };
  }

  /**
   * Orchestrates the full design evolution for a path.
   */
  public async evolveDesign(path: string): Promise<void> {
    await this.auditFrontendAesthetics(path);
    // Design Evolution logic...
  }

  private readDirectorySafe(path: string): string {
    try {
      const files = shell.ls('-R', path);
      return files.filter(f => !fs.lstatSync(f).isDirectory()).map(f => fs.readFileSync(f, 'utf-8')).join('\n');
    } catch {
      return "";
    }
  }
}
