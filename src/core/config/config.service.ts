import fs from 'fs';
import path from 'path';

export interface IroncladConfig {
  rules: {
    /** Require @ironclad-design-signature headers in UI files (off by default). */
    designSignature: boolean;
  };
}

export const DEFAULT_CONFIG: IroncladConfig = {
  rules: {
    designSignature: false,
  },
};

export class ConfigService {
  public static load(cwd: string = process.cwd()): IroncladConfig {
    const configPath = path.join(cwd, '.ironclad.json');
    if (!fs.existsSync(configPath)) {
      return structuredClone(DEFAULT_CONFIG);
    }
    try {
      const raw = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      return {
        rules: {
          designSignature: raw?.rules?.designSignature === true,
        },
      };
    } catch {
      console.warn(`[Ironclad] Invalid .ironclad.json at ${configPath} — using defaults.`);
      return structuredClone(DEFAULT_CONFIG);
    }
  }
}
