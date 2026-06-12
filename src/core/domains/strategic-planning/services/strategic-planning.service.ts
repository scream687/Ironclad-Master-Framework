import { injectable } from 'inversify';
import fs from 'fs';
import path from 'path';

export interface Objective {
  id: string;
  title: string;
  successCriteria: string[];
  status: 'pending' | 'in_progress' | 'completed';
}

@injectable()
export class StrategicPlanningService {
  private readonly ROADMAP_FILE = 'ROADMAP.json';

  public async initializeRoadmap(mission: string): Promise<void> {
    const roadmapPath = path.join(process.cwd(), 'plans', this.ROADMAP_FILE);
    const plansDir = path.dirname(roadmapPath);

    if (!fs.existsSync(plansDir)) {
      fs.mkdirSync(plansDir, { recursive: true });
    }

    const payload = {
      mission,
      createdAt: new Date().toISOString(),
      objectives: [] as Objective[]
    };

    fs.writeFileSync(roadmapPath, JSON.stringify(payload, null, 2));
    console.log(`[StrategicPlanning] Initialized master roadmap for mission: ${mission}`);
  }

  public async decomposeObjective(title: string, criteria: string[]): Promise<Objective> {
    const roadmapPath = path.join(process.cwd(), 'plans', this.ROADMAP_FILE);
    
    if (!fs.existsSync(roadmapPath)) {
      await this.initializeRoadmap('Default Framework Initialization');
    }

    const data = JSON.parse(fs.readFileSync(roadmapPath, 'utf8'));
    
    const newObjective: Objective = {
      id: `OBJ-${Date.now()}`,
      title,
      successCriteria: criteria,
      status: 'pending'
    };

    data.objectives.push(newObjective);
    fs.writeFileSync(roadmapPath, JSON.stringify(data, null, 2));

    console.log(`[StrategicPlanning] Objective ${newObjective.id} decomposed and registered.`);
    return newObjective;
  }

  public async reviewCurrentArchitecture(): Promise<string> {
    // Genuinely scans the src directory to provide an architectural snapshot
    const srcPath = path.join(process.cwd(), 'src');
    if (!fs.existsSync(srcPath)) return 'No architecture detected.';

    const dirs = fs.readdirSync(srcPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    return `Architecture Snapshot: Found domains [${dirs.join(', ')}]`;
  }
}
