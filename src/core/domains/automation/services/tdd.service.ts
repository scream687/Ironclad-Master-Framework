import { injectable } from 'inversify';
import shell from 'shelljs';
import fs from 'fs';
import path from 'path';

@injectable()
export class TddService {
  public async runTracerBullet(feature: string): Promise<boolean> {
    const slug = feature.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const testDir = path.join(process.cwd(), '__tests__');
    const testFile = path.join(testDir, `${slug}.spec.ts`);
    const implFile = path.join(process.cwd(), 'src', `${slug}.ts`);

    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    // 1. Scaffold failing test (Red)
    if (!fs.existsSync(testFile)) {
      const testScaffold = `
import { ${feature.replace(/-/g, '')} } from '../src/${slug}';

describe('${feature} Module', () => {
  it('should be defined', () => {
    expect(${feature.replace(/-/g, '')}).toBeDefined();
  });

  it('should return tracer bullet success', () => {
    const instance = new ${feature.replace(/-/g, '')}();
    expect(instance.execute()).toBe(true);
  });
});
`;
      fs.writeFileSync(testFile, testScaffold.trim());
    }

    // 2. Scaffold minimal implementation stub if not exists
    if (!fs.existsSync(path.dirname(implFile))) {
      fs.mkdirSync(path.dirname(implFile), { recursive: true });
    }
    
    if (!fs.existsSync(implFile)) {
      const implScaffold = `
export class ${feature.replace(/-/g, '')} {
  public execute(): boolean {
    return false; 
  }
}
`;
      fs.writeFileSync(implFile, implScaffold.trim());
    }

    // 3. Execute tracer bullet test loop securely
    const sanitizedTestFile = testFile.replace(/"/g, '\\"');
    const testResult = shell.exec(`npm test -- "${sanitizedTestFile}"`, { silent: true });

    if (testResult.code !== 0) {
      return false;
    }

    return true;
  }
}
