import { injectable } from 'inversify';
import { ArchitectureScanner } from '../../../scanners/architecture';
import { TestingScanner } from '../../../scanners/testing';
import { SecurityScanner } from '../../../scanners/security';
import { PerformanceScanner } from '../../../scanners/performance';
import { AccessibilityScanner } from '../../../scanners/accessibility';
import { TruthScoreCalculator } from '../../../scoring/truth-score';
import { TruthScoreResult, AuditIssue } from '../../../scoring/types';
import shell from 'shelljs';
import fs from 'fs';
import path from 'path';

@injectable()
export class MVPRunAuditUseCase {
  private archScanner = new ArchitectureScanner();
  private testScanner = new TestingScanner();
  private secScanner = new SecurityScanner();
  private perfScanner = new PerformanceScanner();
  private a11yScanner = new AccessibilityScanner();
  private calculator = new TruthScoreCalculator();

  public async execute(): Promise<TruthScoreResult> {
    const issues: AuditIssue[] = [
      ...this.archScanner.scan(),
      ...this.testScanner.scan(),
      ...this.secScanner.scan(),
      ...this.perfScanner.scan(),
      ...this.a11yScanner.scan(),
    ];

    return this.calculator.calculate(issues);
  }

  public getStats() {
      const searchPaths = ['src', 'lib', 'app', 'pages', 'components'].filter(p => fs.existsSync(p));
      const files = searchPaths.length > 0
        ? Array.from(shell.find(searchPaths).filter(f => f.match(/\.(ts|js|tsx|jsx|json)$/) && !f.includes('node_modules')))
        : Array.from(shell.ls('-R', '.').filter(f => 
            f.match(/\.(ts|js|tsx|jsx|json)$/) && 
            !f.startsWith('.') &&
            !f.includes('node_modules')
          ));

      const components = files.filter(f => f.match(/\.(tsx|jsx)$/));
      const routes = files.filter(f => f.includes('api') || f.includes('pages') || f.includes('app'));

      return {
          files: files.length,
          components: components.length,
          routes: routes.length
      };
  }
}
