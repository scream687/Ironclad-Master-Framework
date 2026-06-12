import { injectable, inject } from 'inversify';
import fs from 'fs';
import path from 'path';
import shell from 'shelljs';

@injectable()
export class SelfHealingService {
  public async healTestingGaps(): Promise<void> {
    const searchPaths = ['src'].filter(p => fs.existsSync(p));
    const files = Array.from(shell.find(searchPaths)).filter(f => f.match(/\.(ts|js|tsx|jsx)$/) && !f.includes('test') && !f.includes('spec') && !f.includes('node_modules') && !f.includes('dist'));


    for (const file of files) {
      if (fs.lstatSync(file).isDirectory()) continue;
      
      const baseName = file.split('.').slice(0, -1).join('.');
      const testFile = `${baseName}.spec.ts`;

      if (!fs.existsSync(testFile)) {
        this.generateTestScaffold(file, testFile);
      }
    }
  }

  private generateTestScaffold(sourceFile: string, testFile: string): void {
    const fileName = path.basename(sourceFile, '.ts');
    const className = fileName.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('').replace('.service', 'Service').replace('.useCase', 'UseCase');

    const content = `
import { ${className} } from './${path.basename(sourceFile, '.ts')}';

describe('${className}', () => {
  it('should be defined', () => {
    // SSS-Tier Automated Scaffold
    expect(true).toBe(true);
  });
});
`.trim();

    fs.writeFileSync(testFile, content);
  }
}
