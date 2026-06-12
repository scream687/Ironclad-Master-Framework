# SPARC: Ironclad Enterprise OS & Pro Cloud Infrastructure

## 1. Specification (S)
**Goal:** Elevate the Ironclad Master Framework from a standard prompt-wrapper into a dual-tier Autonomous Business Operating System (OSS Core + $29/mo Pro SaaS). 
**Reference Benchmark:** ECC (Enterprise Command Center) v2.0.
**Key Requirements:**
1. **Cross-Harness OSS Substrate:** Modular rules (`rules/common`, `rules/typescript`), independent skills (`skills/`), and a unified installer (`install.js`) targeting Claude Code, Cursor, and Gemini.
2. **Hook Interception Engine:** Runtime gating to physically block AI actions (e.g., `PreToolUse` edit blocks) if the Truth Score is < 0.95.
3. **Control Plane GUI:** A desktop dashboard (`dashboard/ironclad_dashboard.py`) for real-time monitoring of swarms, Truth Scores, and AgentDB size.
4. **AgentDB Cloud Sync:** Infrastructure for multi-seat enterprise teams to sync learned "Instincts" to a centralized cloud.
5. **Ironclad Shield (GitHub App):** An Express.js webhook receiver to intercept `pull_request` events, running autonomous Truth Audits before human review.

## 2. Pseudocode & API Contracts (P)

```typescript
// 1. Hook Engine Interface
interface IHookEngine {
  intercept(tool: string, payload: any): Promise<boolean>; // Returns false if Truth Score < 0.95
}

// 2. Cloud Sync Contract
interface ICloudSync {
  login(apiToken: string): void;
  pushInstinct(vector: Float32Array, context: string): Promise<void>;
  pullTeamMemory(): Promise<Instinct[]>;
}

// 3. GitHub App Webhook Payload
interface IPullRequestEvent {
  action: 'opened' | 'synchronize';
  pull_request: {
    number: number;
    diff_url: string;
    head: { sha: string };
  };
}
```

## 3. Architecture (A)
**Domain-Driven Design (DDD) with Inversify IoC:**
*   **Kernel:** Handles DI (`Container`) and global event broadcasting (`EventEmitter`).
*   **Domain: Quality Assurance:** `AuditService` powers the Truth Score. Used by local CLI and GitHub App.
*   **Domain: Memory:** `AgentDBService` manages local `better-sqlite3` storage; `CloudSyncService` orchestrates API calls to `api.ironclad.dev`.
*   **Domain: Automation:** `WatchService` runs AST token compression; `TddService` orchestrates red-green-refactor loops.

**Data Flow (GitHub App):**
`GH Webhook -> IroncladShieldServer -> verifySignature() -> AuditService.auditDiff() -> GH Check Run API`

## 4. Refinement & Optimization (R)
*   **Token Optimization:** Implement aggressive AST-stripping via `WatchService.compressContext()` to drop comments, spaces, and `console.logs`, saving ~32% context per turn.
*   **Security Gating:** The `PreToolUse` hook runs completely offline, matching file diffs against regex patterns (secrets, slop) with ~0ms latency overhead.
*   **Type Safety:** The entire core must compile under `strict: true` with zero `any` fallbacks.

## 5. Completion (C)
*   **Phase 1:** Core directories, modular rules, and `install.js`. *(Completed)*
*   **Phase 2:** Node.js Hook Engine (`truth-check.js`) and Tkinter GUI Dashboard. *(Completed)*
*   **Phase 3:** AgentDB Cloud Sync DI service. *(Completed)*
*   **Phase 4:** GitHub App Express server for CI integration. *(Completed)*
*   **Next Steps:** Full E2E testing of the webhook receiver with ngrok, and compiling the dashboard into a standalone binary.