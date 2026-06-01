var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
import { spawn } from 'child_process';
let ExecService = class ExecService {
    async executeCommand(command, args) {
        return new Promise((resolve) => {
            const child = spawn(command, args, { shell: true });
            let stdout = '';
            let stderr = '';
            child.stdout.on('data', (data) => {
                stdout += data.toString();
                process.stdout.write(data);
            });
            child.stderr.on('data', (data) => {
                stderr += data.toString();
                process.stderr.write(data);
            });
            child.on('close', (code) => {
                const exitCode = code ?? 0;
                resolve({
                    stdout,
                    stderr,
                    exitCode,
                    success: exitCode === 0 && !stderr.toLowerCase().includes('error')
                });
            });
        });
    }
};
ExecService = __decorate([
    injectable()
], ExecService);
export { ExecService };
