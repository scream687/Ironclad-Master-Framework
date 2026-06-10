import shell from 'shelljs';
import fs from 'fs';
export class TestingScanner {
    scan() {
        const issues = [];
        const searchPaths = ['src', 'lib', 'app', 'pages', 'components'].filter(p => fs.existsSync(p));
        const sourceFiles = searchPaths.length > 0
            ? Array.from(shell.find(searchPaths)).filter(f => f.match(/\.(ts|js|tsx|jsx)$/) && !f.includes('test') && !f.includes('spec'))
            : Array.from(shell.ls('-R', '.')).filter(f => f.match(/\.(ts|js|tsx|jsx)$/) &&
                !f.startsWith('.') &&
                !f.includes('node_modules') &&
                !f.includes('test') &&
                !f.includes('spec'));
        sourceFiles.forEach(file => {
            if (fs.lstatSync(file).isDirectory())
                return;
            const baseName = file.split('.').slice(0, -1).join('.');
            const extensions = ['test.ts', 'spec.ts', 'test.js', 'spec.js', 'test.tsx', 'spec.tsx'];
            const hasTest = extensions.some(ext => {
                const testPath = `${baseName}.${ext}`;
                const nestedTestPath = file.replace('src/', 'src/__tests__/'); // Simple nested check
                return fs.existsSync(testPath) || fs.existsSync(nestedTestPath);
            });
            if (!hasTest) {
                issues.push({
                    category: 'testing',
                    level: 'major',
                    name: 'Missing Test Suite',
                    message: `No unit tests found for: ${file}`,
                    file,
                    risk: 'Regressions go undetected. Logic remains unverified.',
                    fix: `Create a test file at ${baseName}.test.ts`,
                    autoFixable: true
                });
            }
        });
        return issues;
    }
}
