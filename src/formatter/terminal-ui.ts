import chalk from 'chalk';
import { TruthScoreResult, AuditIssue } from '../scoring/types';

export class TerminalUI {
  public static renderHeader() {
    console.log(chalk.hex('#C2512B').bold(`
╔════════════════════════════════════╗
║        IRONCLAD AUDIT v1.0         ║
╚════════════════════════════════════╝
`));
    console.log(chalk.dim('  Scanning Repository...\n'));
  }

  public static renderStats(fileCount: number, componentCount: number, routeCount: number) {
    console.log(chalk.green(`  ✓ ${fileCount} Files Scanned`));
    console.log(chalk.green(`  ✓ ${componentCount} Components Analyzed`));
    console.log(chalk.green(`  ✓ ${routeCount} Routes Audited`));
    console.log(chalk.dim('  ────────────────────────────\n'));
  }

  public static renderTruthScore(result: TruthScoreResult) {
    const scoreColor = result.totalScore > 85 ? chalk.green : result.totalScore > 70 ? chalk.yellow : chalk.red;
    
    console.log(chalk.bold(`  TRUTH SCORE: `) + scoreColor.bold(`${result.totalScore} / 100\n`));
    
    const categories = result.categories;
    Object.entries(categories).forEach(([name, data]) => {
        const catName = name.charAt(0).toUpperCase() + name.slice(1).padEnd(15);
        const catScore = data.score;
        const color = catScore > 85 ? chalk.green : catScore > 70 ? chalk.yellow : chalk.red;
        console.log(`  ${catName} ${color(catScore)}`);
    });
    
    console.log(chalk.dim('\n  ────────────────────────────\n'));
    console.log(`  Issues Found: ${chalk.bold(result.totalIssues)}\n`);
    console.log(`  Critical: ${chalk.red.bold(result.levelCounts.critical)}`);
    console.log(`  Major:    ${chalk.yellow.bold(result.levelCounts.major)}`);
    console.log(`  Minor:    ${chalk.blue.bold(result.levelCounts.minor)}\n`);
  }

  public static renderTopIssues(issues: AuditIssue[]) {
    if (issues.length === 0) return;

    console.log(chalk.hex('#C2512B').bold('  TOP ISSUES\n'));
    
    // Sort by level (critical first)
    const sorted = [...issues].sort((a, b) => {
        const priority = { critical: 0, major: 1, minor: 2 };
        return priority[a.level] - priority[b.level];
    }).slice(0, 3); // Show top 3

    sorted.forEach(issue => {
        const levelColor = issue.level === 'critical' ? chalk.red : issue.level === 'major' ? chalk.yellow : chalk.blue;
        console.log(`  ${levelColor.bold(`[${issue.level.toUpperCase()}]`)}`);
        console.log(chalk.bold(`  ${issue.name}`));
        console.log(chalk.dim(`  ${issue.file || 'N/A'}\n`));
        console.log(chalk.bold('  Risk:'));
        console.log(`  ${issue.risk}\n`);
        console.log(chalk.bold('  Fix:'));
        console.log(`  ${issue.fix}\n`);
        console.log(chalk.dim('  ────────────────────────\n'));
    });
  }

  public static renderCertification(result: TruthScoreResult) {
    const grade = result.totalScore > 90 ? 'A+' : result.totalScore > 80 ? 'A' : result.totalScore > 70 ? 'B' : 'C';
    const health = result.totalScore > 80 ? 'EXCELLENT' : result.totalScore > 60 ? 'GOOD' : 'CRITICAL';
    const healthColor = health === 'EXCELLENT' ? chalk.green : health === 'GOOD' ? chalk.yellow : chalk.red;

    console.log(chalk.dim('  ══════════════════════════\n'));
    console.log(chalk.bold('  IRONCLAD CERTIFICATION\n'));
    console.log(`  Truth Score: ${chalk.bold(result.totalScore)}`);
    console.log(`  Grade:       ${chalk.bold(grade)}`);
    console.log(`  Repository Health:`);
    console.log(`  ${healthColor.bold(health)}\n`);
    console.log(chalk.dim('  ══════════════════════════\n'));
    console.log(chalk.dim('  Share:'));
    console.log(chalk.blue.underline(`  ironclad.dev/share/${Math.random().toString(36).substring(7)}\n`));
  }

  public static renderFixPreview(result: TruthScoreResult) {
      const fixableCount = Object.values(result.categories).flatMap(c => c.issues).filter(i => i.autoFixable).length;
      const projectedScore = Math.min(100, result.totalScore + (fixableCount * 2));
      const hoursSaved = (fixableCount * 0.4).toFixed(1);

      console.log(chalk.bold(`  ${result.totalIssues} Issues Found`));
      console.log(chalk.green(`  ${fixableCount} Auto-Fixable\n`));
      console.log(chalk.bold('  Projected Truth Score:'));
      console.log(`  ${chalk.red(result.totalScore)} → ${chalk.green(projectedScore)}\n`);
      console.log(chalk.bold('  Estimated Time Saved:'));
      console.log(chalk.green(`  ${hoursSaved} Hours\n`));
      
      console.log(chalk.dim('  Current State'));
      console.log(chalk.dim('      ↓'));
      console.log(chalk.dim('   Problems'));
      console.log(chalk.dim('      ↓'));
      console.log(chalk.dim('  Improved State\n'));
  }
}
