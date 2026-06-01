var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
import shell from 'shelljs';
let GitService = class GitService {
    async generateEliteCommit() {
        const diff = shell.exec('git diff HEAD', { silent: true }).stdout;
        if (!diff)
            return 'No changes to commit.';
        // Logic to generate descriptive message from diff
        return `feat: implement elite automated update based on diff analysis`;
    }
    async commitAndPush(message) {
        shell.exec('git add .', { silent: true });
        shell.exec(`git commit -m "${message}"`, { silent: true });
    }
};
GitService = __decorate([
    injectable()
], GitService);
export { GitService };
