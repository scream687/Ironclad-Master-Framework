var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
import shell from 'shelljs';
import path from 'path';
import fs from 'fs';
let SkillService = class SkillService {
    async fetchSkill(repo) {
        const repoName = repo.split('/').pop() || 'unknown';
        const targetDir = path.join('.ai-core', 'skills', repoName);
        if (fs.existsSync(targetDir)) {
            throw new Error(`Skill already exists: ${targetDir}`);
        }
        const result = shell.exec(`gh repo clone ${repo} ${targetDir} -- --depth 1`, { silent: true });
        if (result.code !== 0) {
            throw new Error(`Failed to clone repository: ${repo}. Error: ${result.stderr}`);
        }
    }
};
SkillService = __decorate([
    injectable()
], SkillService);
export { SkillService };
