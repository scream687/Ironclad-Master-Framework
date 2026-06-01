import 'reflect-metadata';
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { IroncladKernel } from '../core/kernel/ironclad-kernel';
import { TaskManagementDomain } from '../core/domains/task-management/task-management.domain';
import { QualityAssuranceDomain } from '../core/domains/quality-assurance/quality-assurance.domain';
import { IntelligenceHubDomain } from '../core/domains/intelligence-hub/intelligence-hub.domain';
import { MemoryDomain } from '../core/domains/memory/memory.domain';
import { RunAuditUseCase } from '../core/application/use-cases/run-audit.use-case';
import { FetchSkillUseCase } from '../core/application/use-cases/fetch-skill.use-case';
import { UpgradeFrameworkUseCase } from '../core/application/use-cases/upgrade-framework.use-case';
const IRONCLAD_LOGO = `
  ${chalk.hex('#C2512B')('🛡️  IRONCLAD MASTER FRAMEWORK')}
  ${chalk.hex('#1C1C1C')('High-Performance AI Engineering Shell')}
  ${chalk.dim('----------------------------------------')}
`;
async function main() {
    const kernel = new IroncladKernel();
    // Load Domains
    await kernel.loadDomain(new TaskManagementDomain());
    await kernel.loadDomain(new QualityAssuranceDomain());
    await kernel.loadDomain(new IntelligenceHubDomain());
    await kernel.loadDomain(new MemoryDomain());
    const program = new Command();
    program
        .name('ironclad')
        .description('Autonomous Business Operating System Command Center')
        .version('1.2.0 (V3 God-Tier)');
    console.log(IRONCLAD_LOGO);
    program
        .command('audit')
        .description('Perform elite anti-slop verification')
        .action(async () => {
        const spinner = ora('Initializing Ironclad Audit...').start();
        const useCase = kernel.getContainer().get(RunAuditUseCase);
        const result = await useCase.execute();
        if (result.success) {
            spinner.succeed(chalk.green('Ironclad Audit: SUCCESS. Codebase is elite.'));
        }
        else {
            spinner.fail(chalk.red('Ironclad Audit: FAILED. Please remediate the slop.'));
            result.issues.forEach((issue) => {
                console.log(`  - [${issue.level.value.toUpperCase()}] ${issue.ruleName}: ${issue.message} ${issue.file ? `(${issue.file})` : ''}`);
            });
            process.exit(1);
        }
    });
    program
        .command('fetch')
        .description('Integrate external intelligence from GitHub')
        .argument('<repo>', 'GitHub repository (user/repo)')
        .action(async (repo) => {
        const spinner = ora(`Fetching external intelligence from GitHub: ${repo}...`).start();
        const useCase = kernel.getContainer().get(FetchSkillUseCase);
        try {
            await useCase.execute(repo);
            spinner.succeed(chalk.green(`Skill integrated into intelligence hub: ${repo}`));
        }
        catch (error) {
            spinner.fail(chalk.red(`Failed to fetch intelligence: ${repo}`));
            console.error(error);
            process.exit(1);
        }
    });
    program
        .command('upgrade')
        .description('Trigger the Ironclad Evolution Engine')
        .action(async () => {
        const spinner = ora('Triggering Ironclad Evolution Loop...').start();
        const useCase = kernel.getContainer().get(UpgradeFrameworkUseCase);
        try {
            await useCase.execute();
            spinner.succeed(chalk.green('Ironclad Evolution: SUCCESS. The framework has ascended.'));
        }
        catch (error) {
            spinner.fail(chalk.red('Ironclad Evolution: FAILED.'));
            console.error(error);
            process.exit(1);
        }
    });
    program.parse(process.argv);
}
main().catch(error => {
    console.error(chalk.red('Fatal Error in Ironclad Kernel:'));
    console.error(error);
    process.exit(1);
});
