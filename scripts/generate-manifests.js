import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const manifests = {
  profiles: {
    "enterprise": ["ironclad-tdd", "ironclad-shield", "ironclad-architect"],
    "frontend-pro": ["ui-demo", "frontend-patterns", "design-system", "accessibility"],
    "backend-pro": ["api-design", "backend-patterns", "database-migrations", "docker-patterns"]
  },
  components: {
    "core": ["rules", "agents", "skills", "hooks"],
    "dashboard": ["dashboard"]
  }
};

const manifestDir = path.join(__dirname, '../manifests');
if (!fs.existsSync(manifestDir)) fs.mkdirSync(manifestDir);

fs.writeFileSync(path.join(manifestDir, 'install-profiles.json'), JSON.stringify(manifests.profiles, null, 2));
fs.writeFileSync(path.join(manifestDir, 'install-components.json'), JSON.stringify(manifests.components, null, 2));
console.log('✅ Generated ECC-level manifest matrix.');