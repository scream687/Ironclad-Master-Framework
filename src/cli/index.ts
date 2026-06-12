import 'reflect-metadata';
import { execFileSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { IroncladKernel } from '../core/kernel/ironclad-kernel';
import { TaskManagementDomain } from '../core/domains/task-management/task-management.domain';
import { QualityAssuranceDomain } from '../core/domains/quality-assurance/quality-assurance.domain';
import { TruthEnforcementService } from '../core/domains/quality-assurance/services/truth-enforcement.service';
import { IntelligenceHubDomain } from '../core/domains/intelligence-hub/intelligence-hub.domain';
import { MemoryDomain } from '../core/domains/memory/memory.domain';
import { AutomationDomain } from '../core/domains/automation/automation.domain';
import { BootstrappingDomain } from '../core/domains/bootstrapping/bootstrapping.domain';
import { StrategicPlanningDomain } from '../core/domains/strategic-planning/strategic-planning.domain';

import { MVPRunAuditUseCase } from '../core/application/use-cases/mvp-run-audit.use-case';
import { GeneratePlanUseCase } from '../core/application/use-cases/generate-plan.use-case';
import { BrainstormUseCase } from '../core/application/use-cases/brainstorm.use-case';
import { RunHarnessUseCase } from '../core/application/use-cases/run-harness.use-case';
import { InfinityHarnessService } from '../core/domains/automation/services/infinity-harness.service';
import { TerminalUI } from '../formatter/terminal-ui';

async function main() {
  const kernel = new IroncladKernel();

  // Load Domains
  await kernel.loadDomain(new TaskManagementDomain());
  await kernel.loadDomain(new QualityAssuranceDomain());
  await kernel.loadDomain(new IntelligenceHubDomain());
  await kernel.loadDomain(new MemoryDomain());
  await kernel.loadDomain(new AutomationDomain());
  await kernel.loadDomain(new BootstrappingDomain());
  await kernel.loadDomain(new StrategicPlanningDomain());

  // Register Use Cases
  kernel.getContainer().bind(MVPRunAuditUseCase).toSelf().inSingletonScope();
  kernel.getContainer().bind(GeneratePlanUseCase).toSelf().inSingletonScope();
  kernel.getContainer().bind(BrainstormUseCase).toSelf().inSingletonScope();
  kernel.getContainer().bind(RunHarnessUseCase).toSelf().inSingletonScope();

  const program = new Command();

  
  program
    .name('ironclad')
    .description('Autonomous Business Operating System Command Center')
    .version('1.0.0-mvp')
    .enablePositionalOptions();

  program
    .command('audit')
    .description('Perform cinematic Truth Score verification')
    .option('--fix-preview', 'Show projected score and time saved via auto-fixes')
    .action(async (options) => {
      TerminalUI.renderHeader();
      const useCase = kernel.getContainer().get(MVPRunAuditUseCase);
      
      const stats = useCase.getStats();
      TerminalUI.renderStats(stats.files, stats.components, stats.routes);

      const result = await useCase.execute();
      
      if (options.fixPreview) {
          TerminalUI.renderFixPreview(result);
      } else {
          TerminalUI.renderTruthScore(result);
          
          const allIssues = Object.values(result.categories).flatMap((c: any) => c.issues);
          TerminalUI.renderTopIssues(allIssues);
          
          TerminalUI.renderCertification(result);
      }
    });

  program
    .command('plan')
    .description('Generate a strategic SPARC specification')
    .argument('<goal>', 'The goal of the plan')
    .option('-c, --context <context>', 'Additional context for the plan', '')
    .action(async (goal, options) => {
      const useCase = kernel.getContainer().get(GeneratePlanUseCase);
      const spinner = ora(`Generating SPARC spec for: ${goal}...`).start();
      const result = await useCase.execute(goal, options.context);
      spinner.succeed(`Plan generated at ${chalk.cyan(result.path)}`);
      console.log(chalk.gray('---'));
      console.log(result.content);
    });

  program
    .command('brainstorm')
    .description('Generate creative strategies or ideas')
    .argument('<topic>', 'The topic to brainstorm')
    .action(async (topic) => {
      const useCase = kernel.getContainer().get(BrainstormUseCase);
      const spinner = ora(`Brainstorming ideas for: ${topic}...`).start();
      const ideas = await useCase.execute(topic);
      spinner.succeed(`Brainstorming complete!`);
      console.log(chalk.gray('---'));
      ideas.forEach((idea, i) => console.log(`${i + 1}. ${idea}`));
    });

  program
    .command('init')
    .description('Initialize Ironclad Framework in the current repository')
    .action(() => {
      console.log(chalk.blue('🛡️ Initializing Ironclad Enterprise Ecosystem...'));
      const moduleDir = path.dirname(fileURLToPath(import.meta.url));
      execFileSync('node', [path.resolve(moduleDir, '../../install.js')], { stdio: 'inherit' });
    });

  program
    .command('dashboard')
    .description('Launch the Ironclad Pro Control Plane GUI')
    .action(async () => {
      console.log(chalk.magenta('🚀 Launching Ironclad Pro Dashboard Server...'));
      // We import it dynamically to avoid loading dashboard dependencies if not needed
      const { startDashboardServer } = await import('../pro/dashboard-server.js');
      // @ts-ignore
      await startDashboardServer();
    });

  program
    .command('mcp')
    .description('Start the Ironclad MCP Server')
    .action(async () => {
      console.log(chalk.cyan('Starting Ironclad MCP Server...'));
      // We import it dynamically to avoid loading MCP dependencies if not needed
      const { runMcpServer } = await import('../mcp/index.js');
      // @ts-ignore
      await runMcpServer();
    });

  program
    .command('harness')
    .description('Start the Ironclad Eternal Harness for autonomous continuity')
    .argument('<goal>', 'The high-level goal to accomplish')
    .action(async (goal) => {
      const useCase = kernel.getContainer().get(RunHarnessUseCase);
      await useCase.execute(goal);
    });

  program
    .command('infinity')
    .description('Launch the God-Tier Ironclad Infinity Loop for infinite autonomous continuity')
    .argument('<objective>', 'The high-level objective to accomplish')
    .action(async (objective) => {
      const service = kernel.getContainer().get(InfinityHarnessService);
      await service.runInfinityLoop(objective);
    });

  program.parse(process.argv);
}

main().catch(error => {
  console.error(chalk.red('Fatal Error in Ironclad Kernel:'));
  console.error(error);
  process.exit(1);
});
