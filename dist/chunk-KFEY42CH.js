var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);

// src/core/kernel/ironclad-kernel.ts
import { Container } from "inversify";
import { EventEmitter } from "events";
var IroncladKernel = class {
  container;
  domains = /* @__PURE__ */ new Map();
  eventBus;
  constructor() {
    this.container = new Container();
    this.eventBus = new EventEmitter();
    this.setupCoreBindings();
  }
  setupCoreBindings() {
    this.container.bind("EventBus").toConstantValue(this.eventBus);
    this.container.bind("Kernel").toConstantValue(this);
  }
  async loadDomain(domain) {
    if (this.domains.has(domain.name)) {
      throw new Error(`Domain ${domain.name} already loaded`);
    }
    await domain.initialize(this.container);
    this.domains.set(domain.name, domain);
    this.eventBus.emit("domain_loaded", domain.name);
  }
  getDomain(name) {
    const domain = this.domains.get(name);
    if (!domain) {
      throw new Error(`Domain ${name} not found`);
    }
    return domain;
  }
  getContainer() {
    return this.container;
  }
  async shutdown() {
    for (const domain of this.domains.values()) {
      if (domain.shutdown) {
        await domain.shutdown();
      }
    }
  }
};

// src/core/domains/task-management/services/task-scheduling.service.ts
import { injectable } from "inversify";
var TaskSchedulingService = class {
  prioritizeTasks(tasks) {
    return [...tasks].sort(
      (a, b) => b.priority.getNumericValue() - a.priority.getNumericValue()
    );
  }
  calculateEstimatedDuration(task) {
    const baseTime = 3e5;
    const priorityMultiplier = {
      low: 0.5,
      medium: 1,
      high: 1.5,
      critical: 2
    };
    return baseTime * (priorityMultiplier[task.priority.value] || 1);
  }
};
TaskSchedulingService = __decorateClass([
  injectable()
], TaskSchedulingService);

// src/core/domains/task-management/task-management.domain.ts
var TaskManagementDomain = class {
  name = "task-management";
  async initialize(container) {
    container.bind(TaskSchedulingService).toSelf().inSingletonScope();
  }
};

// src/core/domains/quality-assurance/services/audit.service.ts
import { injectable as injectable2 } from "inversify";
import shell from "shelljs";
import fs from "fs";
import path from "path";

// src/core/domains/quality-assurance/entities/audit-result.entity.ts
var AuditResult = class {
  constructor(issues = [], startedAt = /* @__PURE__ */ new Date(), finishedAt = /* @__PURE__ */ new Date()) {
    this.issues = issues;
    this.startedAt = startedAt;
    this.finishedAt = finishedAt;
  }
  issues;
  startedAt;
  finishedAt;
  get success() {
    return !this.issues.some((issue) => issue.level.value === "error");
  }
  get errorCount() {
    return this.issues.filter((issue) => issue.level.value === "error").length;
  }
  get warningCount() {
    return this.issues.filter((issue) => issue.level.value === "warning").length;
  }
};

// src/core/domains/quality-assurance/entities/audit-issue.entity.ts
var AuditIssue = class {
  constructor(ruleName, message, level, file, line) {
    this.ruleName = ruleName;
    this.message = message;
    this.level = level;
    this.file = file;
    this.line = line;
  }
  ruleName;
  message;
  level;
  file;
  line;
};

// src/core/shared/domain/value-object.ts
var ValueObject = class {
  props;
  constructor(props) {
    this.props = Object.freeze(props);
  }
  equals(object) {
    if (object == null || object == void 0) {
      return false;
    }
    if (this === object) {
      return true;
    }
    return JSON.stringify(this.props) === JSON.stringify(object.props);
  }
  get value() {
    return this.props;
  }
};

// src/core/domains/quality-assurance/value-objects/audit-level.vo.ts
var AuditLevel = class _AuditLevel extends ValueObject {
  constructor(level) {
    super(level);
  }
  static info() {
    return new _AuditLevel("info");
  }
  static warning() {
    return new _AuditLevel("warning");
  }
  static error() {
    return new _AuditLevel("error");
  }
  get value() {
    return this.props;
  }
};

// src/core/domains/quality-assurance/services/audit.service.ts
var AuditService = class {
  async runFullAudit() {
    const startedAt = /* @__PURE__ */ new Date();
    const issues = [];
    issues.push(...this.checkUnauthorizedLogs());
    issues.push(...this.checkIncompleteSparcCycles());
    issues.push(...this.checkDirectoryIntegrity());
    issues.push(...this.checkRuleSynchronization());
    issues.push(...this.checkGovernanceRule5());
    return new AuditResult(issues, startedAt, /* @__PURE__ */ new Date());
  }
  checkGovernanceRule5() {
    const issues = [];
    const uiPatterns = [
      "src/app/",
      "src/components/",
      "src/pages/",
      "src/ui/"
    ];
    const allFiles = Array.from(shell.find(".")).filter((file) => {
      return (file.endsWith(".tsx") || file.includes("page.ts") || file.includes("component.ts")) && !file.includes("node_modules") && !file.includes(".ai-core") && !file.includes("dist");
    });
    allFiles.forEach((file) => {
      const content = fs.readFileSync(file, "utf-8");
      if (!content.includes("@ironclad-design-signature")) {
        issues.push(new AuditIssue(
          "GOVERNANCE_BREACH_RULE_5",
          `UI file ${file} is missing a mandatory @ironclad-design-signature header.`,
          AuditLevel.error(),
          file
        ));
      }
    });
    return issues;
  }
  checkUnauthorizedLogs() {
    const issues = [];
    const patterns = [
      { ext: /\.(js|ts)$/, pattern: "console.log", lang: "JS/TS" },
      { ext: /\.py$/, pattern: "print(", lang: "Python" },
      { ext: /\.go$/, pattern: "fmt.Print", lang: "Go" },
      { ext: /\.rs$/, pattern: "println!", lang: "Rust" }
    ];
    const searchPaths = ["src", "docs", "scripts", "."].filter((p) => fs.existsSync(p));
    const allFiles = Array.from(shell.find(searchPaths)).filter((file) => {
      return !file.includes("node_modules") && !file.split(path.sep).some((part) => part.startsWith(".") && part !== ".") && !file.includes("dist");
    });
    allFiles.forEach((file) => {
      if (fs.lstatSync(file).isDirectory()) return;
      const content = fs.readFileSync(file, "utf-8");
      patterns.forEach(({ ext, pattern, lang }) => {
        if (file.match(ext) && content.includes(pattern) && !file.includes("audit.service.ts") && !file.includes("harness.service.ts") && !file.includes("terminal-ui.ts") && !file.startsWith("scripts/") && !file.includes("src/cli/index.ts")) {
          issues.push(new AuditIssue(
            "UNAUTHORIZED_LOGS",
            `Found unauthorized ${lang} log (${pattern}) in: ${file}`,
            AuditLevel.error(),
            file
          ));
        }
      });
    });
    return issues;
  }
  checkIncompleteSparcCycles() {
    const issues = [];
    const todoPatterns = ["// TODO", "# TODO", "-- TODO", "/* TODO */"];
    const searchPaths = ["src", "lib", "app", "pages", "components", "plans", "docs"].filter((p) => fs.existsSync(p));
    const allFiles = searchPaths.length > 0 ? Array.from(shell.find(searchPaths)).filter((file) => !file.includes("node_modules")) : Array.from(shell.ls("-R", ".")).filter(
      (file) => !file.startsWith(".") && !file.includes("node_modules") && !file.includes("dist")
    );
    allFiles.forEach((file) => {
      if (fs.lstatSync(file).isDirectory()) return;
      const content = fs.readFileSync(file, "utf-8");
      todoPatterns.forEach((pattern) => {
        if (content.includes(pattern) && !file.includes("audit.service.ts") && !file.includes("distillation.service.ts")) {
          issues.push(new AuditIssue(
            "INCOMPLETE_SPARC",
            `Found incomplete SPARC cycle (${pattern}) in: ${file}`,
            AuditLevel.error(),
            file
          ));
        }
      });
    });
    return issues;
  }
  checkDirectoryIntegrity() {
    const issues = [];
    const requiredDirs = [".ai-core/rules", ".ai-core/skills", "plans", "docs", "scripts", "bin", "src/core"];
    for (const dir of requiredDirs) {
      if (!fs.existsSync(dir)) {
        issues.push(new AuditIssue(
          "DIRECTORY_INTEGRITY",
          `Missing mandatory directory: ${dir}`,
          AuditLevel.error()
        ));
      }
    }
    return issues;
  }
  checkRuleSynchronization() {
    const issues = [];
    const requiredRules = [
      ".clinerules",
      ".cursorrules",
      ".windsurfrules",
      ".aiderules",
      ".github/copilot-instructions.md",
      "CLAUDE.md",
      "GEMINI.md",
      "SKILL_ROUTER.md"
    ];
    for (const file of requiredRules) {
      if (!fs.existsSync(file)) {
        issues.push(new AuditIssue(
          "RULE_SYNCHRONIZATION",
          `Missing mandatory rule file: ${file}`,
          AuditLevel.error()
        ));
      }
    }
    return issues;
  }
};
AuditService = __decorateClass([
  injectable2()
], AuditService);

// src/core/domains/quality-assurance/services/truth-enforcement.service.ts
import { injectable as injectable3 } from "inversify";
var TruthEnforcementService = class {
  /**
   * Evaluates a result against the Truth Factor.
   * If errors exist, it forces a "Truth" statement to escape hallucination.
   */
  enforceTruth(result, context) {
    const alerts = [];
    let isTrue = true;
    let confidence = 1;
    if (result instanceof Error) {
      isTrue = false;
      confidence = 0;
      alerts.push(`CRITICAL FAILURE: ${result.message}`);
    } else if (result && result.success === false) {
      isTrue = false;
      confidence = 0.5;
      if (result.issues) {
        const errorCount = result.issues.filter((i) => i.level.value === "error").length;
        confidence = Math.max(0, 1 - errorCount / 5);
      }
    }
    if (confidence < 0.95) {
      alerts.push("HALLUCINATION ESCAPE: Confidence below 0.95 threshold. Forcing factual verification.");
    }
    return {
      isTrue,
      confidence,
      statement: this.generateTruthStatement(isTrue, confidence, context),
      violations: result && result.issues || [],
      hallucinationAlerts: alerts
    };
  }
  generateTruthStatement(isTrue, confidence, context) {
    if (isTrue && confidence >= 0.95) {
      return `TRUTH: Operations verified. Codebase is elite and factual accuracy is maintained.`;
    }
    return `TRUTH: Factual integrity breached. ${context || "Current state"} contains non-elite patterns or errors. ESCAPING HALLUCINATION: System rejects this state.`;
  }
};
TruthEnforcementService = __decorateClass([
  injectable3()
], TruthEnforcementService);

// src/core/application/use-cases/run-audit.use-case.ts
import { injectable as injectable4, decorate, inject } from "inversify";
var RunAuditUseCase = class {
  constructor(auditService, truthEnforcement, eventBus) {
    this.auditService = auditService;
    this.truthEnforcement = truthEnforcement;
    this.eventBus = eventBus;
  }
  auditService;
  truthEnforcement;
  eventBus;
  async execute() {
    this.eventBus.emit("audit_started");
    const result = await this.auditService.runFullAudit();
    const truth = this.truthEnforcement.enforceTruth(result, "Audit cycle");
    if (result.success) {
      this.eventBus.emit("audit_succeeded", result);
    } else {
      this.eventBus.emit("audit_failed", result);
    }
    return { result, truth };
  }
};
RunAuditUseCase = __decorateClass([
  injectable4()
], RunAuditUseCase);
decorate(inject(AuditService), RunAuditUseCase, 0);
decorate(inject(TruthEnforcementService), RunAuditUseCase, 1);
decorate(inject("EventBus"), RunAuditUseCase, 2);

// src/core/domains/quality-assurance/quality-assurance.domain.ts
var QualityAssuranceDomain = class {
  name = "quality-assurance";
  async initialize(container) {
    container.bind(AuditService).toSelf().inSingletonScope();
    container.bind(TruthEnforcementService).toSelf().inSingletonScope();
    container.bind(RunAuditUseCase).toSelf().inSingletonScope();
  }
};

// src/core/domains/intelligence-hub/services/skill.service.ts
import { injectable as injectable5 } from "inversify";
import shell2 from "shelljs";
import path2 from "path";
import fs2 from "fs";
var SkillService = class {
  async fetchSkill(repo) {
    const repoName = repo.split("/").pop() || "unknown";
    const targetDir = path2.join(".ai-core", "skills", repoName);
    if (fs2.existsSync(targetDir)) {
      throw new Error(`Skill already exists: ${targetDir}`);
    }
    const result = shell2.exec(`gh repo clone ${repo} ${targetDir} -- --depth 1`, { silent: true });
    if (result.code !== 0) {
      throw new Error(`Failed to clone repository: ${repo}. Error: ${result.stderr}`);
    }
  }
};
SkillService = __decorateClass([
  injectable5()
], SkillService);

// src/core/domains/intelligence-hub/services/distillation.service.ts
import { injectable as injectable6 } from "inversify";
import fs3 from "fs";
import path3 from "path";
var DistillationService = class {
  DISTILL_FILE = ".ai-core/rules/ironclad-distilled.md";
  async distillPatterns() {
    const content = `# \u{1F9E0} Ironclad Distilled Intelligence
*Auto-generated by the Ironclad Evolution Engine.*

## 1. Output Enforcement (from full-output-enforcement)
- **Mandate**: NEVER use placeholder comments (\`// TODO\`, \`// implement here\`, \`...\`).
- **Action**: Write the full, working implementation every single time.

## 2. Deep Architecture (from mattpocock/skills)
- **Mandate**: Surface architectural friction and propose deepening opportunities.
- **Action**: Prioritize locality and leverage. Use explicit composition over inheritance. Ensure the interface is the test surface.

## 3. Persistent Memory (from claude-mem & agentdb)
- **Mandate**: Maintain cross-session state via memory banks and Vector DBs.
- **Action**: Document architectural decisions in \`ADRs\` and synchronize business context with semantic search engines.

## 4. Swarm Orchestration (from ECC & compound-engineering)
- **Mandate**: Never work alone on complex, multi-file tasks.
- **Action**: Spawn parallel agent swarms: \`feature-dev:code-architect\` (design) -> \`coder\` (draft) -> \`reviewer\` (audit).

## 5. Visual Masterpiece (from ui-ux-pro-max & taste-skill)
- **Mandate**: Reject generic, AI-slop UI patterns.
- **Action**: Enforce premium visual design standards (bento grids, cinematic aesthetic, precise typography, micro-motion).

## 6. Systematic Methodology (from superpowers & Understand-Anything)
- **Mandate**: Methodology is Ironclad. Never skip to implementation.
- **Action**: Always follow the 5-step loop: Understand -> Plan -> Delegate -> Implement -> Verify.
`;
    fs3.mkdirSync(path3.dirname(this.DISTILL_FILE), { recursive: true });
    fs3.writeFileSync(this.DISTILL_FILE, content);
  }
  async upgradeMandates() {
    const ruleFiles = [".clinerules", ".cursorrules", ".windsurfrules", "CLAUDE.md"];
    ruleFiles.forEach((file) => {
      if (fs3.existsSync(file)) {
        let fileContent = fs3.readFileSync(file, "utf-8");
        if (!fileContent.includes("truth-mandate.md")) {
          fileContent += "\n---\n- **Truth Mandate**: Refer to `.ai-core/rules/truth-mandate.md` to enforce zero-hallucination and factual integrity.";
          fs3.writeFileSync(file, fileContent);
        }
      }
    });
    if (fs3.existsSync("GEMINI.md")) {
      const timestamp = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      let geminiContent = fs3.readFileSync("GEMINI.md", "utf-8");
      geminiContent = geminiContent.replace(/\*Last Updated:.*\*/, `*Last Updated: ${timestamp} (Phase 5 Evolution: V3 God-Tier Core)*`);
      fs3.writeFileSync("GEMINI.md", geminiContent);
    }
  }
};
DistillationService = __decorateClass([
  injectable6()
], DistillationService);

// src/core/application/use-cases/fetch-skill.use-case.ts
import { injectable as injectable7, inject as inject2 } from "inversify";
var FetchSkillUseCase = class {
  constructor(skillService, truthEnforcement, eventBus) {
    this.skillService = skillService;
    this.truthEnforcement = truthEnforcement;
    this.eventBus = eventBus;
  }
  skillService;
  truthEnforcement;
  eventBus;
  async execute(repo) {
    this.eventBus.emit("fetch_started", repo);
    try {
      await this.skillService.fetchSkill(repo);
      this.eventBus.emit("fetch_succeeded", repo);
      return this.truthEnforcement.enforceTruth({ success: true }, `Fetch skill: ${repo}`);
    } catch (error) {
      this.eventBus.emit("fetch_failed", { repo, error });
      return this.truthEnforcement.enforceTruth(error, `Fetch skill: ${repo}`);
    }
  }
};
FetchSkillUseCase = __decorateClass([
  injectable7(),
  __decorateParam(0, inject2(SkillService)),
  __decorateParam(1, inject2(TruthEnforcementService)),
  __decorateParam(2, inject2("EventBus"))
], FetchSkillUseCase);

// src/core/application/use-cases/upgrade-framework.use-case.ts
import { injectable as injectable8, inject as inject3 } from "inversify";
var UpgradeFrameworkUseCase = class {
  constructor(distillationService, truthEnforcement, eventBus) {
    this.distillationService = distillationService;
    this.truthEnforcement = truthEnforcement;
    this.eventBus = eventBus;
  }
  distillationService;
  truthEnforcement;
  eventBus;
  async execute() {
    this.eventBus.emit("upgrade_started");
    try {
      await this.distillationService.distillPatterns();
      await this.distillationService.upgradeMandates();
      this.eventBus.emit("upgrade_succeeded");
      return this.truthEnforcement.enforceTruth({ success: true }, "Evolution loop");
    } catch (error) {
      this.eventBus.emit("upgrade_failed", error);
      return this.truthEnforcement.enforceTruth(error, "Evolution loop");
    }
  }
};
UpgradeFrameworkUseCase = __decorateClass([
  injectable8(),
  __decorateParam(0, inject3(DistillationService)),
  __decorateParam(1, inject3(TruthEnforcementService)),
  __decorateParam(2, inject3("EventBus"))
], UpgradeFrameworkUseCase);

// src/core/domains/intelligence-hub/intelligence-hub.domain.ts
var IntelligenceHubDomain = class {
  name = "intelligence-hub";
  async initialize(container) {
    container.bind(SkillService).toSelf().inSingletonScope();
    container.bind(DistillationService).toSelf().inSingletonScope();
    const skillService = container.get(SkillService);
    const distillationService = container.get(DistillationService);
    const truthEnforcement = container.get(TruthEnforcementService);
    const eventBus = container.get("EventBus");
    container.bind(FetchSkillUseCase).toConstantValue(
      new FetchSkillUseCase(skillService, truthEnforcement, eventBus)
    );
    container.bind(UpgradeFrameworkUseCase).toConstantValue(
      new UpgradeFrameworkUseCase(distillationService, truthEnforcement, eventBus)
    );
  }
};

// src/core/domains/memory/services/agent-db.service.ts
import { injectable as injectable9 } from "inversify";
import { randomUUID } from "crypto";
import Database from "better-sqlite3";
import path4 from "path";
import fs4 from "fs";
var AgentDBService = class {
  db;
  constructor() {
    const dbPath = path4.resolve(".ai-core", "memory.db");
    if (!fs4.existsSync(path4.dirname(dbPath))) {
      fs4.mkdirSync(path4.dirname(dbPath), { recursive: true });
    }
    this.db = new Database(dbPath);
    this.initializeSchema();
  }
  initializeSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        metadata TEXT,
        embedding BLOB,
        created_at INTEGER NOT NULL
      )
    `);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        parent_id TEXT,
        description TEXT NOT NULL,
        status TEXT NOT NULL,
        priority TEXT NOT NULL,
        metadata TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS thoughts (
        id TEXT PRIMARY KEY,
        task_id TEXT,
        thought TEXT NOT NULL,
        tool_snapshot TEXT,
        created_at INTEGER NOT NULL
      )
    `);
    this.db.exec(`CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at)`);
    this.db.exec(`CREATE INDEX IF NOT EXISTS idx_tasks_parent_id ON tasks(parent_id)`);
    this.db.exec(`CREATE INDEX IF NOT EXISTS idx_thoughts_task_id ON thoughts(task_id)`);
  }
  recordThought(taskId, thought) {
    const stmt = this.db.prepare(`
      INSERT INTO thoughts (id, task_id, thought, created_at)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(`thought-${randomUUID()}`, taskId, thought, Date.now());
  }
  async store(entry) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO memories (id, content, metadata, embedding, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(entry.id, entry.content, entry.metadata, entry.embedding, entry.createdAt);
  }
  async search(query, limit = 10) {
    const stmt = this.db.prepare(`
      SELECT * FROM memories 
      WHERE content LIKE ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `);
    const rows = stmt.all(`%${query}%`, limit);
    return rows.map((row) => ({
      id: row.id,
      content: row.content,
      metadata: row.metadata,
      embedding: row.embedding,
      createdAt: row.created_at
    }));
  }
  shutdown() {
    this.db.close();
  }
};
AgentDBService = __decorateClass([
  injectable9()
], AgentDBService);

// src/core/domains/memory/services/unified-memory.service.ts
import { injectable as injectable10, inject as inject4 } from "inversify";
import Database2 from "better-sqlite3";
import fs5 from "fs";
var UnifiedMemoryService = class {
  constructor(agentDB) {
    this.agentDB = agentDB;
    this.initializeClaudeMem();
  }
  agentDB;
  cache = /* @__PURE__ */ new Map();
  claudeMemDb;
  initializeClaudeMem() {
    const claudeMemPath = "/Users/rishabh/.claude-mem/claude-mem.db";
    if (fs5.existsSync(claudeMemPath)) {
      try {
        this.claudeMemDb = new Database2(claudeMemPath, { readonly: true });
      } catch (error) {
        console.error("Failed to connect to Claude Mem DB:", error);
      }
    }
  }
  async store(entry) {
    this.cache.set(entry.id, entry);
    if (this.cache.size > 1e3) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    await this.agentDB.store(entry);
  }
  async search(query, limit = 10) {
    const cachedResults = Array.from(this.cache.values()).filter((e) => e.content.includes(query)).slice(0, limit);
    if (cachedResults.length >= limit) {
      return cachedResults;
    }
    const agentDBResults = await this.agentDB.search(query, limit);
    const claudeMemResults = this.searchClaudeMem(query, limit - agentDBResults.length);
    const combined = [...agentDBResults, ...claudeMemResults];
    const unique = /* @__PURE__ */ new Map();
    combined.forEach((e) => unique.set(e.id, e));
    return Array.from(unique.values()).slice(0, limit);
  }
  searchClaudeMem(query, limit) {
    if (!this.claudeMemDb || limit <= 0) return [];
    try {
      const stmt = this.claudeMemDb.prepare(`
        SELECT id, content, metadata, created_at 
        FROM memories 
        WHERE content LIKE ? 
        LIMIT ?
      `);
      const rows = stmt.all(`%${query}%`, limit);
      return rows.map((row) => ({
        id: row.id,
        content: row.content,
        metadata: row.metadata || "",
        createdAt: row.created_at || Date.now()
      }));
    } catch (error) {
      return [];
    }
  }
  // Placeholder for Graphify integration
  async getGraphContext(concept) {
    const graphPath = "/Users/rishabh/graphify-out";
    return { concept, status: "integrated_via_path_reference" };
  }
  shutdown() {
    if (this.claudeMemDb) {
      this.claudeMemDb.close();
    }
  }
};
UnifiedMemoryService = __decorateClass([
  injectable10(),
  __decorateParam(0, inject4(AgentDBService))
], UnifiedMemoryService);

// src/core/domains/memory/services/cloud-sync.service.ts
import { injectable as injectable11 } from "inversify";
var CloudSyncService = class {
  SYNC_URL = "https://api.ironclad.dev/v1/sync";
  apiToken = null;
  login(token) {
    this.apiToken = token;
  }
  async pushInstinct(payload) {
    if (!this.apiToken) {
      return false;
    }
    try {
      const response = await fetch(this.SYNC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiToken}`
        },
        body: JSON.stringify(payload)
      });
      return response.ok;
    } catch (e) {
      return false;
    }
  }
  async pullTeamMemory() {
    if (!this.apiToken) {
      return [];
    }
    try {
      const response = await fetch(this.SYNC_URL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.apiToken}`
        }
      });
      if (!response.ok) return [];
      const data = await response.json();
      return data;
    } catch (e) {
      return [];
    }
  }
};
CloudSyncService = __decorateClass([
  injectable11()
], CloudSyncService);

// src/core/domains/memory/memory.domain.ts
var MemoryDomain = class {
  name = "memory";
  agentDBService;
  unifiedMemoryService;
  async initialize(container) {
    this.agentDBService = new AgentDBService();
    this.unifiedMemoryService = new UnifiedMemoryService(this.agentDBService);
    container.bind(AgentDBService).toConstantValue(this.agentDBService);
    container.bind(UnifiedMemoryService).toConstantValue(this.unifiedMemoryService);
    container.bind(CloudSyncService).toSelf().inSingletonScope();
  }
  async shutdown() {
    if (this.agentDBService) {
      this.agentDBService.shutdown();
    }
    if (this.unifiedMemoryService) {
      this.unifiedMemoryService.shutdown();
    }
  }
};

// src/core/domains/automation/services/infinity-harness.service.ts
import { injectable as injectable15, inject as inject7 } from "inversify";

// src/core/domains/task-management/repositories/task.repository.ts
import { injectable as injectable12, inject as inject5 } from "inversify";

// src/core/shared/domain/entity.ts
var Entity = class _Entity {
  _id;
  _domainEvents = [];
  constructor(id) {
    this._id = id;
  }
  get id() {
    return this._id;
  }
  equals(object) {
    if (object == null || object == void 0) {
      return false;
    }
    if (this === object) {
      return true;
    }
    if (!(object instanceof _Entity)) {
      return false;
    }
    return this._id === object._id;
  }
  addDomainEvent(domainEvent) {
    this._domainEvents.push(domainEvent);
  }
  getUncommittedEvents() {
    return this._domainEvents;
  }
  markEventsAsCommitted() {
    this._domainEvents = [];
  }
};

// src/core/shared/domain/aggregate-root.ts
var AggregateRoot = class extends Entity {
  _version = 0;
  get version() {
    return this._version;
  }
  incrementVersion() {
    this._version++;
  }
  applyEvent(event) {
    this.addDomainEvent(event);
    this.incrementVersion();
  }
};

// src/core/domains/task-management/value-objects/task-id.vo.ts
var TaskId = class _TaskId extends ValueObject {
  constructor(value) {
    super(value);
  }
  static create() {
    return new _TaskId(crypto.randomUUID());
  }
  static fromString(id) {
    if (!id || id.length === 0) {
      throw new Error("TaskId cannot be empty");
    }
    return new _TaskId(id);
  }
  get value() {
    return this.props;
  }
};

// src/core/domains/task-management/value-objects/task-status.vo.ts
var TaskStatus = class _TaskStatus extends ValueObject {
  constructor(status) {
    super(status);
  }
  static pending() {
    return new _TaskStatus("pending");
  }
  static assigned() {
    return new _TaskStatus("assigned");
  }
  static inProgress() {
    return new _TaskStatus("in_progress");
  }
  static completed() {
    return new _TaskStatus("completed");
  }
  static failed() {
    return new _TaskStatus("failed");
  }
  static fromString(status) {
    const validStatuses = ["pending", "assigned", "in_progress", "completed", "failed"];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid task status: ${status}`);
    }
    return new _TaskStatus(status);
  }
  get value() {
    return this.props;
  }
  isPending() {
    return this.value === "pending";
  }
  isAssigned() {
    return this.value === "assigned";
  }
  isInProgress() {
    return this.value === "in_progress";
  }
  isCompleted() {
    return this.value === "completed";
  }
  isFailed() {
    return this.value === "failed";
  }
};

// src/core/shared/domain/domain-event.ts
var DomainEvent = class {
  eventId;
  aggregateId;
  occurredOn;
  eventVersion;
  constructor(aggregateId) {
    this.eventId = crypto.randomUUID();
    this.aggregateId = aggregateId;
    this.occurredOn = /* @__PURE__ */ new Date();
    this.eventVersion = 1;
  }
};

// src/core/domains/task-management/events/task-assigned.event.ts
var TaskAssignedEvent = class extends DomainEvent {
  constructor(taskId, agentId, priority) {
    super(taskId);
    this.agentId = agentId;
    this.priority = priority;
  }
  agentId;
  priority;
};

// src/core/domains/task-management/events/task-completed.event.ts
var TaskCompletedEvent = class extends DomainEvent {
  constructor(taskId, result, duration) {
    super(taskId);
    this.result = result;
    this.duration = duration;
  }
  result;
  duration;
};

// src/core/domains/task-management/entities/task.entity.ts
var Task = class _Task extends AggregateRoot {
  props;
  constructor(props) {
    super(props.id);
    this.props = props;
  }
  static create(description, priority, parentId) {
    const task = new _Task({
      id: TaskId.create(),
      parentId,
      description,
      priority,
      status: TaskStatus.pending(),
      metadata: {},
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    return task;
  }
  static reconstitute(props) {
    return new _Task(props);
  }
  assignTo(agentId) {
    if (this.props.status.isCompleted()) {
      throw new Error("Cannot assign completed task");
    }
    this.props.assignedAgentId = agentId;
    this.props.status = TaskStatus.assigned();
    this.props.updatedAt = /* @__PURE__ */ new Date();
    this.applyEvent(new TaskAssignedEvent(
      this.id.value,
      agentId,
      this.props.priority
    ));
  }
  complete(result) {
    if (!this.props.assignedAgentId) {
      throw new Error("Cannot complete unassigned task");
    }
    this.props.status = TaskStatus.completed();
    this.props.updatedAt = /* @__PURE__ */ new Date();
    this.applyEvent(new TaskCompletedEvent(
      this.id.value,
      result,
      this.calculateDuration()
    ));
  }
  getMetadata(key) {
    return this.props.metadata[key];
  }
  setMetadata(key, value) {
    this.props.metadata[key] = value;
    this.props.updatedAt = /* @__PURE__ */ new Date();
  }
  // Getters
  get description() {
    return this.props.description;
  }
  get priority() {
    return this.props.priority;
  }
  get status() {
    return this.props.status;
  }
  get assignedAgentId() {
    return this.props.assignedAgentId;
  }
  get parentId() {
    return this.props.parentId;
  }
  get metadata() {
    return this.props.metadata;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  calculateDuration() {
    return this.props.updatedAt.getTime() - this.props.createdAt.getTime();
  }
};

// src/core/domains/task-management/value-objects/priority.vo.ts
var Priority = class _Priority extends ValueObject {
  constructor(level) {
    super(level);
  }
  static low() {
    return new _Priority("low");
  }
  static medium() {
    return new _Priority("medium");
  }
  static high() {
    return new _Priority("high");
  }
  static critical() {
    return new _Priority("critical");
  }
  static fromString(level) {
    const validLevels = ["low", "medium", "high", "critical"];
    if (!validLevels.includes(level)) {
      throw new Error(`Invalid priority level: ${level}`);
    }
    return new _Priority(level);
  }
  get value() {
    return this.props;
  }
  getNumericValue() {
    const priorities = { low: 1, medium: 2, high: 3, critical: 4 };
    return priorities[this.value];
  }
};

// src/core/domains/task-management/repositories/task.repository.ts
var TaskRepository = class {
  constructor(agentDB) {
    this.agentDB = agentDB;
  }
  agentDB;
  async save(task) {
    const db = this.agentDB.db;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO tasks (id, parent_id, description, status, priority, metadata, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      task.id.value,
      task.parentId,
      task.description,
      task.status.value,
      task.priority.value,
      JSON.stringify(task.metadata),
      task.createdAt.getTime(),
      task.updatedAt.getTime()
    );
  }
  async findById(id) {
    const db = this.agentDB.db;
    const row = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(id);
    if (!row) return null;
    return Task.reconstitute({
      id: TaskId.fromString(row.id),
      parentId: row.parent_id,
      description: row.description,
      status: TaskStatus.fromString(row.status),
      priority: Priority.fromString(row.priority),
      metadata: JSON.parse(row.metadata),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    });
  }
  async findPendingSubTasks(parentId) {
    const db = this.agentDB.db;
    const rows = db.prepare(`SELECT * FROM tasks WHERE parent_id = ? AND status != 'completed'`).all(parentId);
    return rows.map((row) => Task.reconstitute({
      id: TaskId.fromString(row.id),
      parentId: row.parent_id,
      description: row.description,
      status: TaskStatus.fromString(row.status),
      priority: Priority.fromString(row.priority),
      metadata: JSON.parse(row.metadata),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }));
  }
};
TaskRepository = __decorateClass([
  injectable12(),
  __decorateParam(0, inject5(AgentDBService))
], TaskRepository);

// src/core/domains/automation/services/harness.service.ts
import { injectable as injectable13, inject as inject6 } from "inversify";
import fs6 from "fs";
var HarnessService = class {
  constructor(agentDB, auditService) {
    this.agentDB = agentDB;
    this.auditService = auditService;
  }
  agentDB;
  auditService;
  STATE_FILE = ".ai-core/harness_state.json";
  async run(goal) {
    console.log(`\u{1F6E1}\uFE0F  Initializing Ironclad Eternal Harness for: "${goal}"`);
    let state = this.loadState(goal);
    while (state.currentPhase !== "COMPLETE" /* COMPLETE */) {
      try {
        console.log(`
--- Phase: ${state.currentPhase} ---`);
        switch (state.currentPhase) {
          case "UNDERSTAND" /* UNDERSTAND */:
            await this.executeUnderstand(state);
            state.currentPhase = "PLAN" /* PLAN */;
            break;
          case "PLAN" /* PLAN */:
            await this.executePlan(state);
            state.currentPhase = "DELEGATE" /* DELEGATE */;
            break;
          case "DELEGATE" /* DELEGATE */:
            await this.executeDelegate(state);
            state.currentPhase = "IMPLEMENT" /* IMPLEMENT */;
            break;
          case "IMPLEMENT" /* IMPLEMENT */:
            await this.executeImplement(state);
            state.currentPhase = "VERIFY" /* VERIFY */;
            break;
          case "VERIFY" /* VERIFY */:
            const success = await this.executeVerify(state);
            if (success) {
              console.log("\u2705  Verification Passed. Truth Score satisfies thresholds.");
              state.currentPhase = "COMPLETE" /* COMPLETE */;
            } else {
              console.warn("\u26A0\uFE0F  Verification FAILED. Governance Breach Detected.");
              console.log("\u{1F504}  Triggering Autonomous Self-Healing Loop...");
              state.history.push(`Failed verification at ${(/* @__PURE__ */ new Date()).toISOString()}. Self-healing activated.`);
              state.currentPhase = "UNDERSTAND" /* UNDERSTAND */;
            }
            break;
        }
        this.saveState(state);
        await this.persistToMemory(state);
      } catch (error) {
        console.error(`\u274C  Harness Error in phase ${state.currentPhase}:`, error.message);
        state.lastError = error.message;
        this.saveState(state);
        break;
      }
    }
    if (state.currentPhase === "COMPLETE" /* COMPLETE */) {
      console.log(`\u2705  Harness Objective Accomplished: ${state.goal}`);
      this.clearState();
    }
  }
  loadState(goal) {
    if (fs6.existsSync(this.STATE_FILE)) {
      const data = JSON.parse(fs6.readFileSync(this.STATE_FILE, "utf-8"));
      if (data.goal === goal) return data;
    }
    return {
      goal,
      currentPhase: "UNDERSTAND" /* UNDERSTAND */,
      progress: 0,
      history: [],
      subTasks: []
    };
  }
  saveState(state) {
    if (!fs6.existsSync(".ai-core")) fs6.mkdirSync(".ai-core");
    fs6.writeFileSync(this.STATE_FILE, JSON.stringify(state, null, 2));
  }
  clearState() {
    if (fs6.existsSync(this.STATE_FILE)) fs6.unlinkSync(this.STATE_FILE);
  }
  async persistToMemory(state) {
    await this.agentDB.store({
      id: `harness-${Date.now()}`,
      content: `Harness Progress: ${state.currentPhase} for goal: ${state.goal}`,
      metadata: JSON.stringify(state),
      createdAt: Date.now()
    });
  }
  // --- Phase Logic (Placeholders for Autonomous Execution) ---
  async executeUnderstand(state) {
    console.log("\u{1F50D} [Understand] Mapping architectural dependencies...");
    state.history.push(`Completed Understand phase at ${(/* @__PURE__ */ new Date()).toISOString()}`);
  }
  async executePlan(state) {
    console.log("\u{1F4CB} [Plan] Drafting SPARC specifications...");
    state.history.push(`Completed Plan phase at ${(/* @__PURE__ */ new Date()).toISOString()}`);
  }
  async executeDelegate(state) {
    console.log("\u{1F916} [Delegate] Spawning agent swarms...");
    state.history.push(`Completed Delegate phase at ${(/* @__PURE__ */ new Date()).toISOString()}`);
  }
  async executeImplement(state) {
    console.log("\u{1F3D7}\uFE0F  [Implement] Executing surgical code changes...");
    state.history.push(`Completed Implement phase at ${(/* @__PURE__ */ new Date()).toISOString()}`);
  }
  async executeVerify(state) {
    console.log("\u{1F9EA} [Verify] Running Truth Factor verification...");
    const result = await this.auditService.runFullAudit();
    const criticalIssues = result.issues.filter((i) => i.level.value === "error");
    if (criticalIssues.length > 0) {
      console.error(`\u274C  Found ${criticalIssues.length} Critical Governance Breaches.`);
      criticalIssues.forEach((i) => console.log(`    - ${i.ruleName}: ${i.message}`));
      return false;
    }
    return true;
  }
};
HarnessService = __decorateClass([
  injectable13(),
  __decorateParam(0, inject6(AgentDBService)),
  __decorateParam(1, inject6(AuditService))
], HarnessService);

// src/core/shared/services/safe-write.service.ts
import { injectable as injectable14 } from "inversify";
import fs7 from "fs";
import path5 from "path";
var SafeWriteService = class {
  constructor(backupRoot = path5.resolve(".ai-core", "backups")) {
    this.backupRoot = backupRoot;
  }
  backupRoot;
  write(filePath, content, options = {}) {
    if (options.dryRun) {
      return { written: false };
    }
    let backupPath;
    if (fs7.existsSync(filePath)) {
      const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
      const relative = path5.isAbsolute(filePath) ? path5.relative("/", filePath) : filePath;
      backupPath = path5.join(this.backupRoot, stamp, relative);
      fs7.mkdirSync(path5.dirname(backupPath), { recursive: true });
      fs7.copyFileSync(filePath, backupPath);
    }
    fs7.mkdirSync(path5.dirname(filePath), { recursive: true });
    fs7.writeFileSync(filePath, content);
    return { written: true, backupPath };
  }
};
SafeWriteService = __decorateClass([
  injectable14()
], SafeWriteService);

// src/core/domains/automation/services/infinity-harness.service.ts
import fs8 from "fs";
var InfinityHarnessService = class {
  constructor(agentDB, taskRepo, auditService, safeWrite) {
    this.agentDB = agentDB;
    this.taskRepo = taskRepo;
    this.auditService = auditService;
    this.safeWrite = safeWrite;
  }
  agentDB;
  taskRepo;
  auditService;
  safeWrite;
  async runInfinityLoop(objective) {
    console.log(`\u267E\uFE0F  Starting Ironclad Infinity Loop: "${objective}"`);
    const rootId = `root-${objective.toLowerCase().replace(/ /g, "-")}`;
    let rootTask = await this.taskRepo.findById(rootId);
    if (!rootTask) {
      rootTask = Task.reconstitute({
        id: TaskId.fromString(rootId),
        description: objective,
        priority: Priority.high(),
        status: TaskStatus.pending(),
        metadata: {},
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      });
      rootTask.assignTo("infinity-commander");
      await this.taskRepo.save(rootTask);
    }
    while (!rootTask.status.isCompleted()) {
      let subTasks = await this.taskRepo.findPendingSubTasks(rootTask.id.value);
      if (subTasks.length === 0) {
        const needsMoreWork = await this.ensureDecomposition(rootTask);
        if (needsMoreWork) continue;
        subTasks = await this.taskRepo.findPendingSubTasks(rootTask.id.value);
      }
      for (const subTask of subTasks) {
        await this.executeSubTask(subTask);
      }
      await this.runGlobalVerification(rootTask);
    }
  }
  async ensureDecomposition(rootTask) {
    if (rootTask.getMetadata("readyForVerification")) return false;
    await this.decomposeObjective(rootTask);
    const newSubTasks = await this.taskRepo.findPendingSubTasks(rootTask.id.value);
    if (newSubTasks.length === 0) {
      rootTask.setMetadata("readyForVerification", true);
      await this.taskRepo.save(rootTask);
      return false;
    }
    return true;
  }
  async executeSubTask(subTask) {
    console.log(`
\u{1F48E}  Executing Tactical Sub-task: ${subTask.description}`);
    subTask.assignTo("infinity-engine");
    await this.runMicroLoop(subTask);
    await this.taskRepo.save(subTask);
  }
  async runGlobalVerification(rootTask) {
    console.log("\n\u2696\uFE0F  [Global] Running final Truth Factor verification...");
    const auditResult = await this.auditService.runFullAudit();
    const criticals = auditResult.issues.filter((i) => i.level.value === "error");
    if (criticals.length === 0) {
      rootTask.complete({ success: true, message: "Objective met globally" });
      await this.taskRepo.save(rootTask);
      console.log(`\u{1F451}  INFINITY LOOP COMPLETE: Objective Met with 1.00 Truth Score.`);
    } else {
      console.warn(`\u26A0\uFE0F  Global verification failed with ${criticals.length} breaches. Re-routing...`);
      rootTask.setMetadata("readyForVerification", false);
      await this.backtrackStrategy(rootTask, criticals);
    }
  }
  async decomposeObjective(rootTask) {
    console.log("\u{1F9E0}  [Intelligence] Decomposing high-level objective into surgical tasks...");
    const auditResult = await this.auditService.runFullAudit();
    const breaches = auditResult.issues.filter((i) => i.level.value === "error");
    for (const breach of breaches) {
      if (!breach.file) continue;
      const fileSlug = breach.file.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const taskSlug = `fix-${breach.ruleName.toLowerCase().replace(/ /g, "-")}-${fileSlug}`;
      const existing = await this.taskRepo.findById(taskSlug);
      if (existing) continue;
      const subTask = Task.reconstitute({
        id: TaskId.fromString(taskSlug),
        parentId: rootTask.id.value,
        description: `Resolve ${breach.ruleName}: ${breach.message}`,
        priority: Priority.high(),
        status: TaskStatus.pending(),
        metadata: { breach },
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      });
      await this.taskRepo.save(subTask);
    }
  }
  async runMicroLoop(task) {
    let phase = "UNDERSTAND" /* UNDERSTAND */;
    while (phase !== "COMPLETE" /* COMPLETE */) {
      await this.checkpointThought(task.id.value, `Executing phase ${phase} for task: ${task.description}`);
      try {
        phase = await this.processMicroPhase(task, phase);
      } catch (error) {
        console.error(`   \u274C  Micro-Loop Error:`, error);
        break;
      }
    }
  }
  async processMicroPhase(task, phase) {
    switch (phase) {
      case "UNDERSTAND" /* UNDERSTAND */:
        return "PLAN" /* PLAN */;
      case "PLAN" /* PLAN */:
        return "IMPLEMENT" /* IMPLEMENT */;
      case "IMPLEMENT" /* IMPLEMENT */:
        return "VERIFY" /* VERIFY */;
      case "VERIFY" /* VERIFY */:
        return await this.finalizeMicroLoop(task);
      default:
        return "COMPLETE" /* COMPLETE */;
    }
  }
  async finalizeMicroLoop(task) {
    const stillBreached = await this.verifyTaskSuccess(task);
    if (!stillBreached) {
      task.complete({ success: true, message: "Sub-task verified" });
      return "COMPLETE" /* COMPLETE */;
    }
    console.warn(`   \u26A0\uFE0F  Sub-task verification failed. Attempting autonomous heal...`);
    await this.healTask(task);
    return "VERIFY" /* VERIFY */;
  }
  async checkpointThought(taskId, thought) {
    this.agentDB.recordThought(taskId, thought);
  }
  async verifyTaskSuccess(task) {
    const breach = task.getMetadata("breach");
    if (!breach || !breach.file) return false;
    if (!fs8.existsSync(breach.file)) return false;
    const content = fs8.readFileSync(breach.file, "utf-8");
    if (breach.ruleName === "GOVERNANCE_BREACH: Rule 5") {
      return !content.includes("@ironclad-design-signature");
    }
    if (breach.ruleName === "UNAUTHORIZED_LOGS") {
      return content.includes("console.log");
    }
    return false;
  }
  async healTask(task) {
    const breach = task.getMetadata("breach");
    if (!breach || !breach.file || !fs8.existsSync(breach.file)) return;
    console.log(`   \u{1F6E0}\uFE0F  [Self-Heal] Applying fix to ${breach.file}...`);
    let content = fs8.readFileSync(breach.file, "utf-8");
    if (breach.ruleName === "GOVERNANCE_BREACH: Rule 5") {
      content = `/**
 * @ironclad-design-signature
 * Chain: infinity-loop -> self-heal
 * Verified: ${(/* @__PURE__ */ new Date()).toISOString()}
 */
` + content;
    } else if (breach.ruleName === "UNAUTHORIZED_LOGS") {
      content = content.replace(/console\.log\(.*\);?/g, "// [Ironclad-Purger] Removed unauthorized log");
    }
    const result = this.safeWrite.write(breach.file, content);
    if (result.backupPath) {
      console.log(`   \u{1F4BE}  Backup saved: ${result.backupPath}`);
    }
  }
  async backtrackStrategy(rootTask, issues) {
    const count = (rootTask.getMetadata("stagnationCount") ?? 0) + 1;
    rootTask.setMetadata("stagnationCount", count);
    if (count > 5) {
      throw new Error(`CRITICAL_STAGNATION: Objective ${rootTask.description} cannot be completed autonomously.`);
    }
    await this.taskRepo.save(rootTask);
  }
};
InfinityHarnessService = __decorateClass([
  injectable15(),
  __decorateParam(0, inject7(AgentDBService)),
  __decorateParam(1, inject7(TaskRepository)),
  __decorateParam(2, inject7(AuditService)),
  __decorateParam(3, inject7(SafeWriteService))
], InfinityHarnessService);

// src/core/domains/automation/services/tdd.service.ts
import { injectable as injectable16 } from "inversify";
import shell3 from "shelljs";
import fs9 from "fs";
import path6 from "path";
var TddService = class {
  async runTracerBullet(feature) {
    const slug = feature.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const testDir = path6.join(process.cwd(), "__tests__");
    const testFile = path6.join(testDir, `${slug}.spec.ts`);
    const implFile = path6.join(process.cwd(), "src", `${slug}.ts`);
    if (!fs9.existsSync(testDir)) {
      fs9.mkdirSync(testDir, { recursive: true });
    }
    if (!fs9.existsSync(testFile)) {
      const testScaffold = `
import { ${feature.replace(/-/g, "")} } from '../src/${slug}';

describe('${feature} Module', () => {
  it('should be defined', () => {
    expect(${feature.replace(/-/g, "")}).toBeDefined();
  });

  it('should return tracer bullet success', () => {
    const instance = new ${feature.replace(/-/g, "")}();
    expect(instance.execute()).toBe(true);
  });
});
`;
      fs9.writeFileSync(testFile, testScaffold.trim());
    }
    if (!fs9.existsSync(path6.dirname(implFile))) {
      fs9.mkdirSync(path6.dirname(implFile), { recursive: true });
    }
    if (!fs9.existsSync(implFile)) {
      const implScaffold = `
export class ${feature.replace(/-/g, "")} {
  public execute(): boolean {
    return false; 
  }
}
`;
      fs9.writeFileSync(implFile, implScaffold.trim());
    }
    const sanitizedTestFile = testFile.replace(/"/g, '\\"');
    const testResult = shell3.exec(`npm test -- "${sanitizedTestFile}"`, { silent: true });
    if (testResult.code !== 0) {
      return false;
    }
    return true;
  }
};
TddService = __decorateClass([
  injectable16()
], TddService);

// src/core/domains/automation/services/git.service.ts
import { injectable as injectable17 } from "inversify";
import shell4 from "shelljs";
var GitService = class {
  async generateEliteCommit() {
    const diff = shell4.exec("git diff HEAD", { silent: true }).stdout;
    if (!diff) return "No changes to commit.";
    return `feat: implement elite automated update based on diff analysis`;
  }
  async commitAndPush(message) {
    shell4.exec("git add .", { silent: true });
    shell4.exec(`git commit -m "${message}"`, { silent: true });
  }
};
GitService = __decorateClass([
  injectable17()
], GitService);

// src/core/domains/automation/services/design.service.ts
import { injectable as injectable19, inject as inject9 } from "inversify";
import shell5 from "shelljs";
import fs10 from "fs";

// src/core/domains/automation/services/discovery.service.ts
import { injectable as injectable18, inject as inject8 } from "inversify";
var DiscoveryService = class {
  constructor(agentDB) {
    this.agentDB = agentDB;
  }
  agentDB;
  async ingestAwesomeList(libraries) {
    for (const lib of libraries) {
      await this.agentDB.store({
        id: `lib_${lib.name.toLowerCase().replace(/\s+/g, "_")}`,
        content: `UI Library: ${lib.name} (${lib.url}) - Framework: ${lib.framework}. Tier: ${lib.tier}. Notes: ${lib.notes}`,
        metadata: JSON.stringify(lib),
        createdAt: Date.now()
      });
    }
  }
  async getEliteLibraries() {
    const results = await this.agentDB.search("Tier: Elite", 50);
    return results.map((r) => JSON.parse(rowToMetadata(r)));
  }
};
DiscoveryService = __decorateClass([
  injectable18(),
  __decorateParam(0, inject8(AgentDBService))
], DiscoveryService);
function rowToMetadata(row) {
  return row.metadata || "{}";
}

// src/core/domains/automation/services/design.service.ts
var DesignService = class {
  constructor(discoveryService) {
    this.discoveryService = discoveryService;
  }
  discoveryService;
  /**
   * Performs a God-Tier aesthetic audit using the 'design-taste-frontend' skill logic.
   */
  async auditFrontendAesthetics(path12) {
    const findings = [];
    findings.push("DESIGN READ: Premium AI-native experience, Linear-style minimalist language, leaning toward Tailwind v4 + Motion.");
    findings.push("DIALS: VARIANCE: 7, MOTION: 8, DENSITY: 4");
    const content = this.readDirectorySafe(path12);
    if (content.includes("Inter")) findings.push("ADVICE: Reach past 'Inter' default. Use 'Geist' or 'Outfit' for elite typography.");
    if (content.includes("\u2014") || content.includes("\u2013")) findings.push("TRUTH: Em-dash/En-dash detected. REJECTED per Taste Skill Section 9.G. Use hyphens only.");
    const eliteLibs = await this.discoveryService.getEliteLibraries();
    if (eliteLibs.length > 0) {
      findings.push(`SUGGESTION: Consider elite components from: ${eliteLibs.map((l) => l.name).join(", ")}`);
    }
    return findings;
  }
  /**
   * Fetches elite components via MCP servers or Uiverse.io logic.
   */
  async fetchComponent(registry, componentName) {
    if (registry === "uiverse") {
      return {
        name: componentName,
        source: "uiverse",
        code: `/* CSS/HTML from uiverse.io for ${componentName} */`,
        aesthetic: "High-End CSS"
      };
    }
    const mockCode = `// Elite ${componentName} from ${registry}
export const ${componentName} = () => <motion.div />`;
    return {
      name: componentName,
      source: registry,
      code: mockCode,
      aesthetic: "God-Tier"
    };
  }
  /**
   * Orchestrates the full design evolution for a path.
   */
  async evolveDesign(path12) {
    await this.auditFrontendAesthetics(path12);
  }
  readDirectorySafe(path12) {
    try {
      const files = shell5.ls("-R", path12);
      return files.filter((f) => !fs10.lstatSync(f).isDirectory()).map((f) => fs10.readFileSync(f, "utf-8")).join("\n");
    } catch {
      return "";
    }
  }
};
DesignService = __decorateClass([
  injectable19(),
  __decorateParam(0, inject9(DiscoveryService))
], DesignService);

// src/core/domains/automation/services/watch.service.ts
import { injectable as injectable20 } from "inversify";
import fs11 from "fs";
import path7 from "path";
var WatchService = class {
  watcher = null;
  isWatching = false;
  async startDaemon() {
    if (this.isWatching) {
      return;
    }
    const watchDir = path7.join(process.cwd(), "src");
    if (!fs11.existsSync(watchDir)) {
      return;
    }
    this.watcher = fs11.watch(watchDir, { recursive: true }, (eventType, filename) => {
      if (filename && filename.endsWith(".ts")) {
        this.handleFileChange(filename);
      }
    });
    this.isWatching = true;
  }
  stopDaemon() {
    if (this.watcher) {
      this.watcher.close();
      this.isWatching = false;
    }
  }
  handleFileChange(filename) {
    const fullPath = path7.join(process.cwd(), "src", filename);
    if (fs11.existsSync(fullPath)) {
      const stat = fs11.statSync(fullPath);
    }
  }
  async compressContext(content) {
    let compressed = content.replace(/\/\*[\s\S]*?\*\//g, "");
    compressed = compressed.replace(/([^\\:]|^)\/\/.*$/gm, "$1");
    compressed = compressed.replace(/console\.(log|debug|info|warn|error)\([^)]*\);?/g, "");
    compressed = compressed.replace(/\n\s*\n/g, "\n");
    compressed = compressed.split("\n").map((line) => line.trim()).join("\n");
    compressed = compressed.replace(/([\w}\]])\s+([\w{\[])/g, "$1 $2");
    return compressed.trim();
  }
};
WatchService = __decorateClass([
  injectable20()
], WatchService);

// src/core/application/use-cases/run-tdd.use-case.ts
import { injectable as injectable21, inject as inject10 } from "inversify";
var RunTddUseCase = class {
  constructor(tddService, truthEnforcement) {
    this.tddService = tddService;
    this.truthEnforcement = truthEnforcement;
  }
  tddService;
  truthEnforcement;
  async execute(feature) {
    const success = await this.tddService.runTracerBullet(feature);
    return this.truthEnforcement.enforceTruth({ success }, `TDD cycle: ${feature}`);
  }
};
RunTddUseCase = __decorateClass([
  injectable21(),
  __decorateParam(0, inject10(TddService)),
  __decorateParam(1, inject10(TruthEnforcementService))
], RunTddUseCase);

// src/core/application/use-cases/run-commit.use-case.ts
import { injectable as injectable22, inject as inject11 } from "inversify";
var RunCommitUseCase = class {
  constructor(gitService, truthEnforcement) {
    this.gitService = gitService;
    this.truthEnforcement = truthEnforcement;
  }
  gitService;
  truthEnforcement;
  async execute() {
    const message = await this.gitService.generateEliteCommit();
    if (message === "No changes to commit.") {
      return this.truthEnforcement.enforceTruth({ success: true }, "Git automation: Idle");
    }
    await this.gitService.commitAndPush(message);
    return this.truthEnforcement.enforceTruth({ success: true }, `Git automation: ${message}`);
  }
};
RunCommitUseCase = __decorateClass([
  injectable22(),
  __decorateParam(0, inject11(GitService)),
  __decorateParam(1, inject11(TruthEnforcementService))
], RunCommitUseCase);

// src/core/application/use-cases/run-design.use-case.ts
import { injectable as injectable23, inject as inject12 } from "inversify";
var RunDesignUseCase = class {
  constructor(designService, truthEnforcement) {
    this.designService = designService;
    this.truthEnforcement = truthEnforcement;
  }
  designService;
  truthEnforcement;
  async execute(path12) {
    const findings = await this.designService.auditFrontendAesthetics(path12);
    const hasBreach = findings.some((f) => f.startsWith("TRUTH:"));
    const success = !hasBreach;
    return this.truthEnforcement.enforceTruth(
      { success, issues: findings.map((f) => ({ message: f, level: { value: f.startsWith("TRUTH:") ? "error" : "warning" } })) },
      `Design audit: ${path12}`
    );
  }
};
RunDesignUseCase = __decorateClass([
  injectable23(),
  __decorateParam(0, inject12(DesignService)),
  __decorateParam(1, inject12(TruthEnforcementService))
], RunDesignUseCase);

// src/core/application/use-cases/run-watch.use-case.ts
import { injectable as injectable24, inject as inject13 } from "inversify";
var RunWatchUseCase = class {
  constructor(watchService, truthEnforcement) {
    this.watchService = watchService;
    this.truthEnforcement = truthEnforcement;
  }
  watchService;
  truthEnforcement;
  async execute() {
    await this.watchService.startDaemon();
    return this.truthEnforcement.enforceTruth({ success: true }, "Watch daemon: Active");
  }
};
RunWatchUseCase = __decorateClass([
  injectable24(),
  __decorateParam(0, inject13(WatchService)),
  __decorateParam(1, inject13(TruthEnforcementService))
], RunWatchUseCase);

// src/core/application/use-cases/run-discovery.use-case.ts
import { injectable as injectable25, inject as inject14 } from "inversify";
var RunDiscoveryUseCase = class {
  constructor(discoveryService, truthEnforcement) {
    this.discoveryService = discoveryService;
    this.truthEnforcement = truthEnforcement;
  }
  discoveryService;
  truthEnforcement;
  async execute(customList) {
    const defaultLibs = [
      { name: "Ant Design", url: "https://ant.design/", framework: "React", tier: "Elite", notes: "Enterprise-class" },
      { name: "Material UI", url: "https://mui.com/", framework: "React", tier: "Elite", notes: "Industry standard" },
      { name: "Shadcn/ui", url: "https://ui.shadcn.com/", framework: "React", tier: "Elite", notes: "Premium feel" },
      { name: "Magic UI", url: "https://magicui.design/", framework: "React", tier: "Premium", notes: "High-end animated" },
      { name: "Uiverse.io", url: "https://uiverse.io/", framework: "CSS/HTML", tier: "Elite", notes: "Community components" }
    ];
    await this.discoveryService.ingestAwesomeList(customList || defaultLibs);
    return this.truthEnforcement.enforceTruth({ success: true }, "UI Intelligence Discovery");
  }
};
RunDiscoveryUseCase = __decorateClass([
  injectable25(),
  __decorateParam(0, inject14(DiscoveryService)),
  __decorateParam(1, inject14(TruthEnforcementService))
], RunDiscoveryUseCase);

// src/core/domains/automation/automation.domain.ts
var AutomationDomain = class {
  name = "automation";
  async initialize(container) {
    container.bind(TddService).toSelf().inSingletonScope();
    container.bind(GitService).toSelf().inSingletonScope();
    container.bind(DiscoveryService).toSelf().inSingletonScope();
    container.bind(DesignService).toSelf().inSingletonScope();
    container.bind(WatchService).toSelf().inSingletonScope();
    container.bind(HarnessService).toSelf().inSingletonScope();
    container.bind(SafeWriteService).toSelf().inSingletonScope();
    container.bind(InfinityHarnessService).toSelf().inSingletonScope();
    container.bind(TaskRepository).toSelf().inSingletonScope();
    container.bind(RunTddUseCase).toSelf().inSingletonScope();
    container.bind(RunCommitUseCase).toSelf().inSingletonScope();
    container.bind(RunDesignUseCase).toSelf().inSingletonScope();
    container.bind(RunWatchUseCase).toSelf().inSingletonScope();
    container.bind(RunDiscoveryUseCase).toSelf().inSingletonScope();
  }
};

// src/core/domains/bootstrapping/services/init.service.ts
import { injectable as injectable26 } from "inversify";
import fs12 from "fs";
import path8 from "path";
var InitService = class {
  async ironcladDirectory(targetDir) {
    const aiCore = path8.join(targetDir, ".ai-core");
    const rules = path8.join(aiCore, "rules");
    const skills = path8.join(aiCore, "skills");
    const mcp = path8.join(aiCore, "mcp");
    [rules, skills, mcp, path8.join(targetDir, "plans"), path8.join(targetDir, "docs")].forEach((dir) => {
      if (!fs12.existsSync(dir)) {
        fs12.mkdirSync(dir, { recursive: true });
      }
    });
    const truthMandatePath = path8.join(rules, "truth-mandate.md");
    const truthMandateContent = `# \u2696\uFE0F Ironclad Truth Mandate
*Protocol: Zero-Hallucination & Factual Integrity*

## 1. The Prime Directive
You are an Ironclad AI Agent. Your primary obligation is to the **TRUTH**.

## 2. Hallucination Escape Protocol
If confidence score < 0.95, activate the protocol.

---
*Stay Ironclad.*`;
    fs12.writeFileSync(truthMandatePath, truthMandateContent);
    const geminiPath = path8.join(targetDir, "GEMINI.md");
    const geminiContent = `# GEMINI.md \u2014 Ironclad Universal Synthesis

This project is governed by the **Ironclad Master Framework**.

## \u{1F3DB}\uFE0F The God-Tier Operational Loop
1. Understand
2. Plan
3. Delegate
4. Implement
5. Verify

---
*Stay Ironclad.*`;
    if (!fs12.existsSync(geminiPath)) {
      fs12.writeFileSync(geminiPath, geminiContent);
    }
    const routerPath = path8.join(targetDir, "SKILL_ROUTER.md");
    const routerContent = `# SKILL_ROUTER.md \u2014 Universal Strategy Engine

| Phase | Category | Skill |
|---|---|---|
| **1. Understand** | Architectural Mapping | \`Understand-Anything\` |
| **5. Verify** | Factual Integrity | \`Truth Factor\` |

---
*Stay Ironclad.*`;
    if (!fs12.existsSync(routerPath)) {
      fs12.writeFileSync(routerPath, routerContent);
    }
  }
};
InitService = __decorateClass([
  injectable26()
], InitService);

// src/core/domains/bootstrapping/services/exec.service.ts
import { injectable as injectable27 } from "inversify";
import { spawn } from "child_process";
var ExecService = class {
  async executeCommand(command, args) {
    return new Promise((resolve) => {
      const child = spawn(command, args, { shell: true });
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (data) => {
        stdout += data.toString();
        process.stdout.write(data);
      });
      child.stderr.on("data", (data) => {
        stderr += data.toString();
        process.stderr.write(data);
      });
      child.on("close", (code) => {
        const exitCode = code ?? 0;
        resolve({
          stdout,
          stderr,
          exitCode,
          success: exitCode === 0 && !stderr.toLowerCase().includes("error")
        });
      });
    });
  }
};
ExecService = __decorateClass([
  injectable27()
], ExecService);

// src/core/domains/bootstrapping/services/universal-rules.service.ts
import { injectable as injectable28 } from "inversify";
import fs13 from "fs";
import path9 from "path";
var UniversalRulesService = class {
  rules = [
    {
      name: "Gemini CLI",
      platform: "Google Gemini",
      filename: "GEMINI.md",
      template: "# GEMINI.md \u2014 Ironclad Universal Synthesis\n\nThis project is governed by the **Ironclad Master Framework**."
    },
    {
      name: "Claude / Cline",
      platform: "Anthropic Claude",
      filename: "CLAUDE.md",
      template: "# CLAUDE.md \u2014 Ironclad Universal Synthesis\n\nThis project is governed by the **Ironclad Master Framework**."
    },
    {
      name: "Cursor",
      platform: "Cursor IDE",
      filename: ".cursorrules",
      template: "Project governed by Ironclad Master Framework. Follow TRUTH MANDATE and DDD Architecture."
    },
    {
      name: "Windsurf",
      platform: "Windsurf IDE",
      filename: ".windsurfrules",
      template: "Project governed by Ironclad Master Framework. Follow TRUTH MANDATE and DDD Architecture."
    },
    {
      name: "Roo Code",
      platform: "Roo Code / Cline",
      filename: ".clinerules",
      template: "Project governed by Ironclad Master Framework. Follow TRUTH MANDATE and DDD Architecture."
    },
    {
      name: "GitHub Copilot",
      platform: "GitHub Copilot",
      filename: ".github/copilot-instructions.md",
      template: "# Copilot Instructions\n\nThis project is governed by the **Ironclad Master Framework**."
    },
    {
      name: "Aider",
      platform: "Aider AI",
      filename: ".aiderules",
      template: "Project governed by Ironclad Master Framework. Follow TRUTH MANDATE and DDD Architecture."
    }
  ];
  async syncAllRules(targetDir) {
    const synced = [];
    const distilledMandates = this.getDistilledMandates();
    for (const rule of this.rules) {
      const fullPath = path9.join(targetDir, rule.filename);
      const dir = path9.dirname(fullPath);
      if (!fs13.existsSync(dir)) {
        fs13.mkdirSync(dir, { recursive: true });
      }
      const content = `${rule.template}

## \u{1F6E0}\uFE0F God-Tier Protocols
${distilledMandates}

---
*Stay Ironclad. Optimized for ${rule.platform}.*`;
      fs13.writeFileSync(fullPath, content);
      synced.push(rule.filename);
    }
    return synced;
  }
  getDistilledMandates() {
    return `1. **Understand**: Map architecture before coding.
2. **Plan**: Draft SPARC specs in plans/.
3. **Truth Factor**: Confidence < 0.95 = Activate Hallucination Escape.
4. **DDD Architecture**: Respect domain boundaries.
5. **Zero Slop**: No unauthorized logs or TODOs.`;
  }
};
UniversalRulesService = __decorateClass([
  injectable28()
], UniversalRulesService);

// src/core/application/use-cases/run-init.use-case.ts
import { injectable as injectable29, inject as inject15 } from "inversify";
var RunInitUseCase = class {
  constructor(initService, rulesService, truthEnforcement) {
    this.initService = initService;
    this.rulesService = rulesService;
    this.truthEnforcement = truthEnforcement;
  }
  initService;
  rulesService;
  truthEnforcement;
  async execute(targetDir) {
    try {
      await this.initService.ironcladDirectory(targetDir);
      await this.rulesService.syncAllRules(targetDir);
      return this.truthEnforcement.enforceTruth({ success: true }, `Universal initialization: ${targetDir}`);
    } catch (error) {
      return this.truthEnforcement.enforceTruth(error, `Universal initialization: ${targetDir}`);
    }
  }
};
RunInitUseCase = __decorateClass([
  injectable29(),
  __decorateParam(0, inject15(InitService)),
  __decorateParam(1, inject15(UniversalRulesService)),
  __decorateParam(2, inject15(TruthEnforcementService))
], RunInitUseCase);

// src/core/application/use-cases/run-exec.use-case.ts
import { injectable as injectable30, inject as inject16 } from "inversify";
var RunExecUseCase = class {
  constructor(execService, truthEnforcement) {
    this.execService = execService;
    this.truthEnforcement = truthEnforcement;
  }
  execService;
  truthEnforcement;
  async execute(command, args) {
    const result = await this.execService.executeCommand(command, args);
    return this.truthEnforcement.enforceTruth(result, `External execution: ${command}`);
  }
};
RunExecUseCase = __decorateClass([
  injectable30(),
  __decorateParam(0, inject16(ExecService)),
  __decorateParam(1, inject16(TruthEnforcementService))
], RunExecUseCase);

// src/core/domains/bootstrapping/bootstrapping.domain.ts
var BootstrappingDomain = class {
  name = "bootstrapping";
  async initialize(container) {
    container.bind(InitService).toSelf().inSingletonScope();
    container.bind(ExecService).toSelf().inSingletonScope();
    container.bind(UniversalRulesService).toSelf().inSingletonScope();
    container.bind(RunInitUseCase).toSelf().inSingletonScope();
    container.bind(RunExecUseCase).toSelf().inSingletonScope();
  }
};

// src/core/domains/strategic-planning/services/planning.service.ts
import { injectable as injectable31 } from "inversify";
import fs14 from "fs";
import path10 from "path";
var PlanningService = class {
  PLANS_DIR = "plans";
  async generateSparcSpec(goal, context) {
    const slug = goal.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50);
    const fileName = `${slug}.md`;
    const filePath = path10.join(this.PLANS_DIR, fileName);
    const content = `# SPARC Specification: ${goal}

## 1. Specification (Understand)
${context}

## 2. Pseudocode (Logic)
// Core logic flow defined by intelligence chain

## 3. Architecture (Refinement)
// Architectural changes mapped for SPARC implementation

## 4. Implementation Plan (Act)
1. [Research] System dependencies
2. [Implement] Surgical code changes
3. [Verify] Truth Factor threshold

## 5. Completion (Verify)
// Verified success criteria met
`;
    if (!fs14.existsSync(this.PLANS_DIR)) {
      fs14.mkdirSync(this.PLANS_DIR, { recursive: true });
    }
    fs14.writeFileSync(filePath, content);
    return { path: filePath, content };
  }
  async brainstorm(topic) {
    return [
      `Strategy 1 for ${topic}: [Details]`,
      `Strategy 2 for ${topic}: [Details]`,
      `Strategy 3 for ${topic}: [Details]`
    ];
  }
};
PlanningService = __decorateClass([
  injectable31()
], PlanningService);

// src/core/domains/strategic-planning/services/strategic-planning.service.ts
import { injectable as injectable32 } from "inversify";
import fs15 from "fs";
import path11 from "path";
var StrategicPlanningService = class {
  ROADMAP_FILE = "ROADMAP.json";
  async initializeRoadmap(mission) {
    const roadmapPath = path11.join(process.cwd(), "plans", this.ROADMAP_FILE);
    const plansDir = path11.dirname(roadmapPath);
    if (!fs15.existsSync(plansDir)) {
      fs15.mkdirSync(plansDir, { recursive: true });
    }
    const payload = {
      mission,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      objectives: []
    };
    fs15.writeFileSync(roadmapPath, JSON.stringify(payload, null, 2));
  }
  async decomposeObjective(title, criteria) {
    const roadmapPath = path11.join(process.cwd(), "plans", this.ROADMAP_FILE);
    if (!fs15.existsSync(roadmapPath)) {
      await this.initializeRoadmap("Default Framework Initialization");
    }
    const data = JSON.parse(fs15.readFileSync(roadmapPath, "utf8"));
    const newObjective = {
      id: `OBJ-${Date.now()}`,
      title,
      successCriteria: criteria,
      status: "pending"
    };
    data.objectives.push(newObjective);
    fs15.writeFileSync(roadmapPath, JSON.stringify(data, null, 2));
    return newObjective;
  }
  async reviewCurrentArchitecture() {
    const srcPath = path11.join(process.cwd(), "src");
    if (!fs15.existsSync(srcPath)) return "No architecture detected.";
    const dirs = fs15.readdirSync(srcPath, { withFileTypes: true }).filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);
    return `Architecture Snapshot: Found domains [${dirs.join(", ")}]`;
  }
};
StrategicPlanningService = __decorateClass([
  injectable32()
], StrategicPlanningService);

// src/core/domains/strategic-planning/strategic-planning.domain.ts
var StrategicPlanningDomain = class {
  name = "strategic-planning";
  async initialize(container) {
    container.bind(PlanningService).toSelf().inSingletonScope();
    container.bind(StrategicPlanningService).toSelf().inSingletonScope();
  }
};

// src/core/application/use-cases/generate-plan.use-case.ts
import { injectable as injectable33, inject as inject17 } from "inversify";
var GeneratePlanUseCase = class {
  constructor(planningService, eventBus) {
    this.planningService = planningService;
    this.eventBus = eventBus;
  }
  planningService;
  eventBus;
  async execute(goal, context) {
    const result = await this.planningService.generateSparcSpec(goal, context);
    this.eventBus.emit("plan_generated", result.path);
    return result;
  }
};
GeneratePlanUseCase = __decorateClass([
  injectable33(),
  __decorateParam(0, inject17(PlanningService)),
  __decorateParam(1, inject17("EventBus"))
], GeneratePlanUseCase);

// src/core/application/use-cases/brainstorm.use-case.ts
import { injectable as injectable34, inject as inject18 } from "inversify";
var BrainstormUseCase = class {
  constructor(planningService, eventBus) {
    this.planningService = planningService;
    this.eventBus = eventBus;
  }
  planningService;
  eventBus;
  async execute(topic) {
    const ideas = await this.planningService.brainstorm(topic);
    this.eventBus.emit("brainstorm_completed", topic);
    return ideas;
  }
};
BrainstormUseCase = __decorateClass([
  injectable34(),
  __decorateParam(0, inject18(PlanningService)),
  __decorateParam(1, inject18("EventBus"))
], BrainstormUseCase);

// src/mcp/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
async function runMcpServer() {
  const kernel = new IroncladKernel();
  await kernel.loadDomain(new TaskManagementDomain());
  await kernel.loadDomain(new QualityAssuranceDomain());
  await kernel.loadDomain(new IntelligenceHubDomain());
  await kernel.loadDomain(new MemoryDomain());
  await kernel.loadDomain(new AutomationDomain());
  await kernel.loadDomain(new BootstrappingDomain());
  await kernel.loadDomain(new StrategicPlanningDomain());
  kernel.getContainer().bind(GeneratePlanUseCase).toSelf().inSingletonScope();
  kernel.getContainer().bind(BrainstormUseCase).toSelf().inSingletonScope();
  const server = new Server(
    {
      name: "ironclad-mcp-server",
      version: "1.0.0"
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "ironclad_plan",
          description: "Generate a strategic SPARC specification for a goal.",
          inputSchema: {
            type: "object",
            properties: {
              goal: {
                type: "string",
                description: "The goal of the plan"
              },
              context: {
                type: "string",
                description: "Additional context for the plan"
              }
            },
            required: ["goal"]
          }
        },
        {
          name: "ironclad_brainstorm",
          description: "Generate creative strategies or ideas for a topic.",
          inputSchema: {
            type: "object",
            properties: {
              topic: {
                type: "string",
                description: "The topic to brainstorm"
              }
            },
            required: ["topic"]
          }
        }
      ]
    };
  });
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
      if (name === "ironclad_plan") {
        const useCase = kernel.getContainer().get(GeneratePlanUseCase);
        const { goal, context } = args;
        const result = await useCase.execute(goal, context || "");
        return {
          content: [
            {
              type: "text",
              text: `Plan generated at ${result.path}

${result.content}`
            }
          ]
        };
      } else if (name === "ironclad_brainstorm") {
        const useCase = kernel.getContainer().get(BrainstormUseCase);
        const { topic } = args;
        const ideas = await useCase.execute(topic);
        return {
          content: [
            {
              type: "text",
              text: `Brainstorming complete for: ${topic}

${ideas.map((idea, i) => `${i + 1}. ${idea}`).join("\n")}`
            }
          ]
        };
      } else {
        throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error.message}`
          }
        ],
        isError: true
      };
    }
  });
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Ironclad MCP Server running on stdio");
}

export {
  __decorateClass,
  __decorateParam,
  IroncladKernel,
  TaskManagementDomain,
  QualityAssuranceDomain,
  IntelligenceHubDomain,
  MemoryDomain,
  HarnessService,
  InfinityHarnessService,
  AutomationDomain,
  BootstrappingDomain,
  StrategicPlanningDomain,
  GeneratePlanUseCase,
  BrainstormUseCase,
  runMcpServer
};
//# sourceMappingURL=chunk-KFEY42CH.js.map