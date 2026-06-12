import {
  AutomationDomain,
  BootstrappingDomain,
  BrainstormUseCase,
  GeneratePlanUseCase,
  HarnessService,
  InfinityHarnessService,
  IntelligenceHubDomain,
  IroncladKernel,
  MemoryDomain,
  QualityAssuranceDomain,
  StrategicPlanningDomain,
  TaskManagementDomain,
  __decorateClass,
  __decorateParam,
  runMcpServer
} from "../chunk-KFEY42CH.js";

// src/cli/index.ts
import "reflect-metadata";
import { execFileSync } from "child_process";
import path3 from "path";
import { fileURLToPath } from "url";
import { Command } from "commander";
import chalk2 from "chalk";
import ora from "ora";

// src/core/application/use-cases/mvp-run-audit.use-case.ts
import { injectable } from "inversify";

// src/scanners/architecture.ts
import shell from "shelljs";
import fs2 from "fs";

// src/core/config/config.service.ts
import fs from "fs";
import path from "path";
var DEFAULT_CONFIG = {
  rules: {
    designSignature: false
  }
};
var ConfigService = class {
  static load(cwd = process.cwd()) {
    const configPath = path.join(cwd, ".ironclad.json");
    if (!fs.existsSync(configPath)) {
      return structuredClone(DEFAULT_CONFIG);
    }
    try {
      const raw = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      return {
        rules: {
          designSignature: raw?.rules?.designSignature === true
        }
      };
    } catch {
      console.warn(`[Ironclad] Invalid .ironclad.json at ${configPath} \u2014 using defaults.`);
      return structuredClone(DEFAULT_CONFIG);
    }
  }
};

// src/scanners/architecture.ts
var ArchitectureScanner = class {
  scan() {
    const issues = [];
    const config = ConfigService.load();
    const searchPaths = ["src", "lib", "app", "pages", "components"].filter((p) => fs2.existsSync(p));
    const files = searchPaths.length > 0 ? Array.from(shell.find(searchPaths)).filter((f) => f.match(/\.(ts|js|tsx|jsx)$/)) : Array.from(shell.ls("-R", ".")).filter(
      (f) => f.match(/\.(ts|js|tsx|jsx)$/) && !f.startsWith(".") && !f.includes("node_modules") && !f.includes("dist")
    );
    files.forEach((file) => {
      if (fs2.lstatSync(file).isDirectory()) return;
      const content = fs2.readFileSync(file, "utf-8");
      const lines = content.split("\n");
      if (lines.length > 500) {
        issues.push({
          category: "architecture",
          level: "major",
          name: "God Component Detected",
          message: `File has ${lines.length} lines.`,
          file,
          risk: "Violates Single Responsibility Principle. Hard to maintain and test.",
          fix: "Split the file into smaller, focused modules or hooks.",
          autoFixable: false
        });
      }
      const indentLevels = lines.map((line) => {
        const leading = line.match(/^[ \t]*/)?.[0] ?? "";
        const tabs = (leading.match(/\t/g) || []).length;
        const spaces = leading.length - tabs;
        return tabs + Math.floor(spaces / 2);
      });
      const maxNesting = Math.max(0, ...indentLevels);
      if (maxNesting > 8) {
        issues.push({
          category: "architecture",
          level: "minor",
          name: "Deep Nesting Detected",
          message: `Indentation level reached ${maxNesting}.`,
          file,
          risk: "High cyclomatic complexity. Reduced readability.",
          fix: "Extract nested logic into helper functions.",
          autoFixable: false
        });
      }
      if (config.rules.designSignature) {
        const isUiFile = file.match(/\.(tsx|jsx)$/) || file.includes("page.ts") || file.includes("component.ts");
        if (isUiFile && !content.includes("@ironclad-design-signature")) {
          issues.push({
            category: "architecture",
            level: "critical",
            name: "GOVERNANCE BREACH: Rule 5",
            message: `UI file is missing a mandatory @ironclad-design-signature.`,
            file,
            risk: 'Violates mandatory design intelligence protocol. Potential for "slop" UI.',
            fix: "Run the design intelligence chain (ui-ux-pro-max) and add the signature header.",
            autoFixable: false
          });
        }
      }
    });
    return issues;
  }
};

// src/scanners/testing.ts
import shell2 from "shelljs";
import fs3 from "fs";
import path2 from "path";
var TEST_FILE_RE = /\.(test|spec)\.(ts|js|tsx|jsx)$/;
var TestingScanner = class {
  scan() {
    const issues = [];
    const searchPaths = ["src", "lib", "app", "pages", "components"].filter((p) => fs3.existsSync(p));
    const isSourceFile = (f) => Boolean(f.match(/\.(ts|js|tsx|jsx)$/)) && !TEST_FILE_RE.test(f) && !f.includes("__tests__");
    const sourceFiles = searchPaths.length > 0 ? Array.from(shell2.find(searchPaths)).filter(isSourceFile) : Array.from(shell2.ls("-R", ".")).filter(
      (f) => isSourceFile(f) && !f.startsWith(".") && !f.includes("node_modules")
    );
    sourceFiles.forEach((file) => {
      if (fs3.lstatSync(file).isDirectory()) return;
      const ext = path2.extname(file);
      const stem = path2.basename(file, ext);
      const dir = path2.dirname(file);
      const suffixes = ["test", "spec"];
      const exts = [".ts", ".js", ".tsx"];
      const hasTest = suffixes.some(
        (suffix) => exts.some((testExt) => {
          const sibling = path2.join(dir, `${stem}.${suffix}${testExt}`);
          const nested = path2.join(dir, "__tests__", `${stem}.${suffix}${testExt}`);
          return fs3.existsSync(sibling) || fs3.existsSync(nested);
        })
      );
      if (!hasTest) {
        issues.push({
          category: "testing",
          level: "major",
          name: "Missing Test Suite",
          message: `No unit tests found for: ${file}`,
          file,
          risk: "Regressions go undetected. Logic remains unverified.",
          fix: `Create a test file at ${path2.join(dir, `${stem}.test${ext}`)}`,
          autoFixable: true
        });
      }
    });
    return issues;
  }
};

// src/scanners/security.ts
import shell3 from "shelljs";
import fs4 from "fs";
var SecurityScanner = class {
  scan() {
    const issues = [];
    const searchPaths = ["src", "lib", "app", "pages", "components"].filter((p) => fs4.existsSync(p));
    const files = searchPaths.length > 0 ? Array.from(shell3.find(searchPaths)).filter((f) => f.match(/\.(ts|js|tsx|jsx|json|env|sh)$/)) : Array.from(shell3.ls("-R", ".")).filter(
      (f) => f.match(/\.(ts|js|tsx|jsx|json|env|sh)$/) && !f.startsWith(".") && !f.includes("node_modules") && !f.includes("dist")
    );
    const secretPatterns = [
      { name: "Hardcoded API Key", regex: /(api_key|apikey|secret|password|token)\s*[:=]\s*['"][a-zA-Z0-9_-]{16,}['"]/gi },
      { name: "Exposed Secret", regex: /AIza[0-9A-Za-z-_]{35}/g }
      // Google API Key
    ];
    files.forEach((file) => {
      if (fs4.lstatSync(file).isDirectory()) return;
      const content = fs4.readFileSync(file, "utf-8");
      secretPatterns.forEach((pattern) => {
        if (content.match(pattern.regex)) {
          issues.push({
            category: "security",
            level: "critical",
            name: pattern.name,
            message: `Potential secret found in: ${file}`,
            file,
            risk: "Credentials could be leaked to public repositories or logs.",
            fix: "Move secret to an encrypted environment variable (.env)",
            autoFixable: false
          });
        }
      });
    });
    return issues;
  }
};

// src/scanners/performance.ts
import shell4 from "shelljs";
import fs5 from "fs";
var PerformanceScanner = class {
  scan() {
    const issues = [];
    const searchPaths = ["src", "lib", "app", "pages", "components"].filter((p) => fs5.existsSync(p));
    const files = searchPaths.length > 0 ? Array.from(shell4.find(searchPaths)).filter((f) => f.match(/\.(ts|js|tsx|jsx|png|jpg|jpeg|webp)$/)) : Array.from(shell4.ls("-R", ".")).filter(
      (f) => f.match(/\.(ts|js|tsx|jsx|png|jpg|jpeg|webp)$/) && !f.startsWith(".") && !f.includes("node_modules") && !f.includes("dist")
    );
    const IMAGE_RE = /\.(png|jpg|jpeg|webp)$/;
    const MAX_IMAGE_BYTES = 1024 * 500;
    const MAX_IMPORTS = 20;
    files.forEach((file) => {
      if (fs5.lstatSync(file).isDirectory()) return;
      if (file.match(IMAGE_RE)) {
        const stats = fs5.statSync(file);
        if (stats.size > MAX_IMAGE_BYTES) {
          issues.push({
            category: "performance",
            level: "major",
            name: "Unoptimized Image",
            message: `Image size is ${(stats.size / 1024).toFixed(2)}KB.`,
            file,
            risk: "Increased LCP (Largest Contentful Paint) and high bandwidth usage.",
            fix: "Compress image or use Next/Image components.",
            autoFixable: false
          });
        }
        return;
      }
      const content = fs5.readFileSync(file, "utf-8");
      const importMatches = content.match(/import\s+{[^}]+}\s+from\s+['"][^'"]+['"]/g) || [];
      if (importMatches.length > MAX_IMPORTS) {
        issues.push({
          category: "performance",
          level: "minor",
          name: "Import Bloat",
          message: `File has ${importMatches.length} imports.`,
          file,
          risk: "Increased bundle size and slower analysis time.",
          fix: "Use tree-shaking or split the component.",
          autoFixable: false
        });
      }
    });
    return issues;
  }
};

// src/scanners/accessibility.ts
import shell5 from "shelljs";
import fs6 from "fs";
var AccessibilityScanner = class {
  scan() {
    const issues = [];
    const searchPaths = ["src", "lib", "app", "pages", "components"].filter((p) => fs6.existsSync(p));
    const files = searchPaths.length > 0 ? Array.from(shell5.find(searchPaths)).filter((f) => f.match(/\.(tsx|jsx)$/)) : Array.from(shell5.ls("-R", ".")).filter(
      (f) => f.match(/\.(tsx|jsx)$/) && !f.startsWith(".") && !f.includes("node_modules") && !f.includes("dist")
    );
    files.forEach((file) => {
      if (fs6.lstatSync(file).isDirectory()) return;
      const content = fs6.readFileSync(file, "utf-8");
      const imgWithoutAlt = content.match(/<img(?![^>]*\balt=)[^>]*>/g) || [];
      if (imgWithoutAlt.length > 0) {
        issues.push({
          category: "accessibility",
          level: "major",
          name: "Missing Alt Text",
          message: `Found ${imgWithoutAlt.length} images without alt attributes.`,
          file,
          risk: "Screen readers cannot describe images to visually impaired users.",
          fix: 'Add descriptive alt="description" to all <img> tags.',
          autoFixable: true
        });
      }
      const emptyButtons = content.match(/<button\b[^>]*>\s*<\/button>/g) || [];
      if (emptyButtons.length > 0) {
        issues.push({
          category: "accessibility",
          level: "critical",
          name: "Unlabeled Interactive Element",
          message: `Found ${emptyButtons.length} empty buttons.`,
          file,
          risk: "Interactive elements without text or aria-labels are inaccessible.",
          fix: 'Add button text or aria-label="action name".',
          autoFixable: false
        });
      }
    });
    return issues;
  }
};

// src/scoring/truth-score.ts
var TruthScoreCalculator = class {
  weights = {
    architecture: 0.25,
    testing: 0.2,
    security: 0.2,
    performance: 0.15,
    accessibility: 0.2
  };
  calculate(issues) {
    const categories = [
      "architecture",
      "testing",
      "security",
      "performance",
      "accessibility"
    ];
    const resultCategories = {};
    let weightedSum = 0;
    categories.forEach((cat) => {
      const catIssues = issues.filter((i) => i.category === cat);
      const score = this.calculateCategoryScore(catIssues);
      const weight = this.weights[cat];
      resultCategories[cat] = {
        score,
        weight,
        issues: catIssues
      };
      weightedSum += score * weight;
    });
    const levelCounts = {
      critical: issues.filter((i) => i.level === "critical").length,
      major: issues.filter((i) => i.level === "major").length,
      minor: issues.filter((i) => i.level === "minor").length
    };
    return {
      totalScore: Math.round(weightedSum),
      categories: resultCategories,
      totalIssues: issues.length,
      levelCounts
    };
  }
  calculateCategoryScore(issues) {
    let score = 100;
    issues.forEach((issue) => {
      if (issue.level === "critical") score -= 20;
      else if (issue.level === "major") score -= 10;
      else if (issue.level === "minor") score -= 3;
    });
    return Math.max(0, score);
  }
};

// src/core/application/use-cases/mvp-run-audit.use-case.ts
import shell6 from "shelljs";
import fs7 from "fs";
var MVPRunAuditUseCase = class {
  archScanner = new ArchitectureScanner();
  testScanner = new TestingScanner();
  secScanner = new SecurityScanner();
  perfScanner = new PerformanceScanner();
  a11yScanner = new AccessibilityScanner();
  calculator = new TruthScoreCalculator();
  async execute() {
    const issues = [
      ...this.archScanner.scan(),
      ...this.testScanner.scan(),
      ...this.secScanner.scan(),
      ...this.perfScanner.scan(),
      ...this.a11yScanner.scan()
    ];
    return this.calculator.calculate(issues);
  }
  getStats() {
    const searchPaths = ["src", "lib", "app", "pages", "components"].filter((p) => fs7.existsSync(p));
    const files = searchPaths.length > 0 ? Array.from(shell6.find(searchPaths).filter((f) => f.match(/\.(ts|js|tsx|jsx|json)$/) && !f.includes("node_modules"))) : Array.from(shell6.ls("-R", ".").filter(
      (f) => f.match(/\.(ts|js|tsx|jsx|json)$/) && !f.startsWith(".") && !f.includes("node_modules")
    ));
    const components = files.filter((f) => f.match(/\.(tsx|jsx)$/));
    const routes = files.filter((f) => f.includes("api") || f.includes("pages") || f.includes("app"));
    return {
      files: files.length,
      components: components.length,
      routes: routes.length
    };
  }
};
MVPRunAuditUseCase = __decorateClass([
  injectable()
], MVPRunAuditUseCase);

// src/core/application/use-cases/run-harness.use-case.ts
import { injectable as injectable2, inject } from "inversify";
var RunHarnessUseCase = class {
  constructor(harnessService) {
    this.harnessService = harnessService;
  }
  harnessService;
  async execute(goal) {
    await this.harnessService.run(goal);
  }
};
RunHarnessUseCase = __decorateClass([
  injectable2(),
  __decorateParam(0, inject(HarnessService))
], RunHarnessUseCase);

// src/formatter/terminal-ui.ts
import chalk from "chalk";
var TerminalUI = class {
  static renderHeader() {
    console.log(chalk.hex("#C2512B").bold(`
\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
\u2551        IRONCLAD AUDIT v1.0         \u2551
\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D
`));
    console.log(chalk.dim("  Scanning Repository...\n"));
  }
  static renderStats(fileCount, componentCount, routeCount) {
    console.log(chalk.green(`  \u2713 ${fileCount} Files Scanned`));
    console.log(chalk.green(`  \u2713 ${componentCount} Components Analyzed`));
    console.log(chalk.green(`  \u2713 ${routeCount} Routes Audited`));
    console.log(chalk.dim("  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n"));
  }
  static renderTruthScore(result) {
    const scoreColor = result.totalScore > 85 ? chalk.green : result.totalScore > 70 ? chalk.yellow : chalk.red;
    console.log(chalk.bold(`  TRUTH SCORE: `) + scoreColor.bold(`${result.totalScore} / 100
`));
    const categories = result.categories;
    Object.entries(categories).forEach(([name, data]) => {
      const catName = name.charAt(0).toUpperCase() + name.slice(1).padEnd(15);
      const catScore = data.score;
      const color = catScore > 85 ? chalk.green : catScore > 70 ? chalk.yellow : chalk.red;
      console.log(`  ${catName} ${color(catScore)}`);
    });
    console.log(chalk.dim("\n  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n"));
    console.log(`  Issues Found: ${chalk.bold(result.totalIssues)}
`);
    console.log(`  Critical: ${chalk.red.bold(result.levelCounts.critical)}`);
    console.log(`  Major:    ${chalk.yellow.bold(result.levelCounts.major)}`);
    console.log(`  Minor:    ${chalk.blue.bold(result.levelCounts.minor)}
`);
  }
  static renderTopIssues(issues) {
    if (issues.length === 0) return;
    console.log(chalk.hex("#C2512B").bold("  TOP ISSUES\n"));
    const sorted = [...issues].sort((a, b) => {
      const priority = { critical: 0, major: 1, minor: 2 };
      return priority[a.level] - priority[b.level];
    }).slice(0, 3);
    sorted.forEach((issue) => {
      const levelColor = issue.level === "critical" ? chalk.red : issue.level === "major" ? chalk.yellow : chalk.blue;
      console.log(`  ${levelColor.bold(`[${issue.level.toUpperCase()}]`)}`);
      console.log(chalk.bold(`  ${issue.name}`));
      console.log(chalk.dim(`  ${issue.file || "N/A"}
`));
      console.log(chalk.bold("  Risk:"));
      console.log(`  ${issue.risk}
`);
      console.log(chalk.bold("  Fix:"));
      console.log(`  ${issue.fix}
`);
      console.log(chalk.dim("  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n"));
    });
  }
  static renderCertification(result) {
    let grade = "C";
    let health = "CRITICAL";
    let healthColor = chalk.red;
    if (result.totalScore === 100 && result.totalIssues === 0) {
      grade = "SSS";
      health = "GOD-TIER (SSS)";
      healthColor = chalk.hex("#FFD700").bold;
    } else if (result.totalScore > 95) {
      grade = "A++";
      health = "ELITE";
      healthColor = chalk.green;
    } else if (result.totalScore > 90) {
      grade = "A+";
      health = "EXCELLENT";
      healthColor = chalk.green;
    } else if (result.totalScore > 80) {
      grade = "A";
      health = "EXCELLENT";
      healthColor = chalk.green;
    } else if (result.totalScore > 70) {
      grade = "B";
      health = "GOOD";
      healthColor = chalk.yellow;
    }
    console.log(chalk.dim("  \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n"));
    console.log(chalk.bold("  IRONCLAD CERTIFICATION\n"));
    console.log(`  Truth Score: ${chalk.bold(result.totalScore)}`);
    console.log(`  Grade:       ${chalk.bold(grade)}`);
    console.log(`  Repository Health:`);
    console.log(`  ${healthColor(health)}
`);
    console.log(chalk.dim("  \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n"));
  }
  static renderFixPreview(result) {
    const fixableCount = Object.values(result.categories).flatMap((c) => c.issues).filter((i) => i.autoFixable).length;
    const projectedScore = Math.min(100, result.totalScore + fixableCount * 2);
    const hoursSaved = (fixableCount * 0.4).toFixed(1);
    console.log(chalk.bold(`  ${result.totalIssues} Issues Found`));
    console.log(chalk.green(`  ${fixableCount} Auto-Fixable
`));
    console.log(chalk.bold("  Projected Truth Score:"));
    console.log(`  ${chalk.red(result.totalScore)} \u2192 ${chalk.green(projectedScore)}
`);
    console.log(chalk.bold("  Estimated Time Saved:"));
    console.log(chalk.green(`  ${hoursSaved} Hours
`));
    console.log(chalk.dim("  Current State"));
    console.log(chalk.dim("      \u2193"));
    console.log(chalk.dim("   Problems"));
    console.log(chalk.dim("      \u2193"));
    console.log(chalk.dim("  Improved State\n"));
  }
};

// src/pro/dashboard-server.ts
import express from "express";
var app = express();
var getHtml = (score, files, issues) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ironclad Pro Dashboard</title>
    <style>
        body { font-family: -apple-system, sans-serif; background: #121212; color: #fff; padding: 40px; }
        .card { background: #1e1e1e; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
        .score { font-size: 48px; font-weight: bold; color: ${score > 90 ? "#4CAF50" : "#FFC107"}; }
        .stat { font-size: 18px; color: #aaa; }
    </style>
</head>
<body>
    <h1>\u{1F6E1}\uFE0F Ironclad Control Plane</h1>
    <div class="card">
        <div class="stat">Repository Truth Score</div>
        <div class="score">${score}/100</div>
    </div>
    <div class="card">
        <div class="stat">Scanned Files</div>
        <div style="font-size: 24px;">${files}</div>
    </div>
    <div class="card">
        <div class="stat">Issues Found</div>
        <div style="font-size: 24px; color: #f44336;">${issues}</div>
    </div>
</body>
</html>
`;
app.get("/", async (req, res) => {
  try {
    const useCase = new MVPRunAuditUseCase();
    const result = await useCase.execute();
    const stats = useCase.getStats();
    res.send(getHtml(result.totalScore, stats.files, result.totalIssues));
  } catch (e) {
    res.status(500).send("Error running audit");
  }
});
var startDashboardServer = async (port = 3001) => {
  app.listen(port, () => {
    console.log(`Ironclad Pro Dashboard live at http://localhost:${port}`);
  });
};

// src/cli/index.ts
async function main() {
  const kernel = new IroncladKernel();
  await kernel.loadDomain(new TaskManagementDomain());
  await kernel.loadDomain(new QualityAssuranceDomain());
  await kernel.loadDomain(new IntelligenceHubDomain());
  await kernel.loadDomain(new MemoryDomain());
  await kernel.loadDomain(new AutomationDomain());
  await kernel.loadDomain(new BootstrappingDomain());
  await kernel.loadDomain(new StrategicPlanningDomain());
  kernel.getContainer().bind(MVPRunAuditUseCase).toSelf().inSingletonScope();
  kernel.getContainer().bind(GeneratePlanUseCase).toSelf().inSingletonScope();
  kernel.getContainer().bind(BrainstormUseCase).toSelf().inSingletonScope();
  kernel.getContainer().bind(RunHarnessUseCase).toSelf().inSingletonScope();
  const program = new Command();
  program.name("ironclad").description("Autonomous Business Operating System Command Center").version("1.0.0-mvp").enablePositionalOptions();
  program.command("audit").description("Perform cinematic Truth Score verification").option("--fix-preview", "Show projected score and time saved via auto-fixes").action(async (options) => {
    TerminalUI.renderHeader();
    const useCase = kernel.getContainer().get(MVPRunAuditUseCase);
    const stats = useCase.getStats();
    TerminalUI.renderStats(stats.files, stats.components, stats.routes);
    const result = await useCase.execute();
    if (options.fixPreview) {
      TerminalUI.renderFixPreview(result);
    } else {
      TerminalUI.renderTruthScore(result);
      const allIssues = Object.values(result.categories).flatMap((c) => c.issues);
      TerminalUI.renderTopIssues(allIssues);
      TerminalUI.renderCertification(result);
    }
  });
  program.command("plan").description("Generate a strategic SPARC specification").argument("<goal>", "The goal of the plan").option("-c, --context <context>", "Additional context for the plan", "").action(async (goal, options) => {
    const useCase = kernel.getContainer().get(GeneratePlanUseCase);
    const spinner = ora(`Generating SPARC spec for: ${goal}...`).start();
    const result = await useCase.execute(goal, options.context);
    spinner.succeed(`Plan generated at ${chalk2.cyan(result.path)}`);
    console.log(chalk2.gray("---"));
    console.log(result.content);
  });
  program.command("brainstorm").description("Generate creative strategies or ideas").argument("<topic>", "The topic to brainstorm").action(async (topic) => {
    const useCase = kernel.getContainer().get(BrainstormUseCase);
    const spinner = ora(`Brainstorming ideas for: ${topic}...`).start();
    const ideas = await useCase.execute(topic);
    spinner.succeed(`Brainstorming complete!`);
    console.log(chalk2.gray("---"));
    ideas.forEach((idea, i) => console.log(`${i + 1}. ${idea}`));
  });
  program.command("init").description("Initialize Ironclad Framework in the current repository").action(() => {
    console.log(chalk2.blue("\u{1F6E1}\uFE0F Initializing Ironclad Enterprise Ecosystem..."));
    const moduleDir = path3.dirname(fileURLToPath(import.meta.url));
    execFileSync("node", [path3.resolve(moduleDir, "../../install.js")], { stdio: "inherit" });
  });
  program.command("dashboard").description("Launch the Ironclad Pro Control Plane GUI").action(async () => {
    console.log(chalk2.magenta("\u{1F680} Launching Ironclad Pro Dashboard Server..."));
    await startDashboardServer();
  });
  program.command("mcp").description("Start the Ironclad MCP Server").action(async () => {
    console.log(chalk2.cyan("Starting Ironclad MCP Server..."));
    await runMcpServer();
  });
  program.command("harness").description("Start the Ironclad Eternal Harness for autonomous continuity").argument("<goal>", "The high-level goal to accomplish").action(async (goal) => {
    const useCase = kernel.getContainer().get(RunHarnessUseCase);
    await useCase.execute(goal);
  });
  program.command("infinity").description("Launch the God-Tier Ironclad Infinity Loop for infinite autonomous continuity").argument("<objective>", "The high-level objective to accomplish").action(async (objective) => {
    const service = kernel.getContainer().get(InfinityHarnessService);
    await service.runInfinityLoop(objective);
  });
  program.parse(process.argv);
}
main().catch((error) => {
  console.error(chalk2.red("Fatal Error in Ironclad Kernel:"));
  console.error(error);
  process.exit(1);
});
//# sourceMappingURL=index.js.map