import shell from 'shelljs';
import fs from 'fs';
export class SecurityScanner {
    scan() {
        const issues = [];
        const searchPaths = ['src', 'lib', 'app', 'pages', 'components'].filter(p => fs.existsSync(p));
        const files = searchPaths.length > 0
            ? Array.from(shell.find(searchPaths)).filter(f => f.match(/\.(ts|js|tsx|jsx|json|env|sh)$/))
            : Array.from(shell.ls('-R', '.')).filter(f => f.match(/\.(ts|js|tsx|jsx|json|env|sh)$/) &&
                !f.startsWith('.') &&
                !f.includes('node_modules') &&
                !f.includes('dist'));
        const secretPatterns = [
            { name: 'Hardcoded API Key', regex: /(api_key|apikey|secret|password|token)\s*[:=]\s*['"][a-zA-Z0-9_-]{16,}['"]/gi },
            { name: 'Exposed Secret', regex: /AIza[0-9A-Za-z-_]{35}/g }, // Google API Key
        ];
        files.forEach(file => {
            if (fs.lstatSync(file).isDirectory())
                return;
            const content = fs.readFileSync(file, 'utf-8');
            secretPatterns.forEach(pattern => {
                if (content.match(pattern.regex)) {
                    issues.push({
                        category: 'security',
                        level: 'critical',
                        name: pattern.name,
                        message: `Potential secret found in: ${file}`,
                        file,
                        risk: 'Credentials could be leaked to public repositories or logs.',
                        fix: 'Move secret to an encrypted environment variable (.env)',
                        autoFixable: false
                    });
                }
            });
        });
        return issues;
    }
}
