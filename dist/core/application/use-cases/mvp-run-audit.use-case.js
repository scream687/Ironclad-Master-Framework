var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
import { ArchitectureScanner } from '../../../scanners/architecture';
import { TestingScanner } from '../../../scanners/testing';
import { SecurityScanner } from '../../../scanners/security';
import { PerformanceScanner } from '../../../scanners/performance';
import { AccessibilityScanner } from '../../../scanners/accessibility';
import { TruthScoreCalculator } from '../../../scoring/truth-score';
import shell from 'shelljs';
import fs from 'fs';
let MVPRunAuditUseCase = class MVPRunAuditUseCase {
    archScanner = new ArchitectureScanner();
    testScanner = new TestingScanner();
    secScanner = new SecurityScanner();
    perfScanner = new PerformanceScanner();
    a11yScanner = new AccessibilityScanner();
    calculator = new TruthScoreCalculator();
    async execute() {
        const issues = [
            ...this.archScanner.scan(),
            ...this.testScanner.scan(),
            ...this.secScanner.scan(),
            ...this.perfScanner.scan(),
            ...this.a11yScanner.scan(),
        ];
        return this.calculator.calculate(issues);
    }
    getStats() {
        const searchPaths = ['src', 'lib', 'app', 'pages', 'components'].filter(p => fs.existsSync(p));
        const files = searchPaths.length > 0
            ? Array.from(shell.find(searchPaths).filter(f => f.match(/\.(ts|js|tsx|jsx|json)$/) && !f.includes('node_modules')))
            : Array.from(shell.ls('-R', '.').filter(f => f.match(/\.(ts|js|tsx|jsx|json)$/) &&
                !f.startsWith('.') &&
                !f.includes('node_modules')));
        const components = files.filter(f => f.match(/\.(tsx|jsx)$/));
        const routes = files.filter(f => f.includes('api') || f.includes('pages') || f.includes('app'));
        return {
            files: files.length,
            components: components.length,
            routes: routes.length
        };
    }
};
MVPRunAuditUseCase = __decorate([
    injectable()
], MVPRunAuditUseCase);
export { MVPRunAuditUseCase };
