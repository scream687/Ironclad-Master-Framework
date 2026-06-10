# SPARC Specification: MCP /plan and /brainstorm Integration

## 1. Specification (Understand)

**Goal:** Implement `/plan` and `/brainstorm` as MCP tools within the Ironclad Master Framework.
- `/plan`: Generates a SPARC specification based on user input.
- `/brainstorm`: Generates a set of creative strategies or ideas for a given problem.

**Context:**
- The framework follows a DDD architecture.
- Logic should be encapsulated in use cases and domains.
- MCP server should expose these use cases as tools.

**Constraints:**
- **Karpathy Mandate**: Simple implementation. Use LLM capabilities for the actual content generation.
- **Pocock Mandate**: Deep architecture. Proper use of domains and services.
- **MCP Standard**: Adhere to Model Context Protocol (MCP) for tool definitions.

---

## 2. Pseudocode (Logic)

### 2.1 GeneratePlanUseCase
```typescript
async function execute(goal: string, context: string): Promise<string> {
  // 1. Construct prompt for LLM (following SPARC structure)
  // 2. Call LLM (simulated or via existing intelligence hub)
  // 3. Save to plans/ directory with timestamp/slug
  // 4. Return the path and content
}
```

### 2.2 BrainstormUseCase
```typescript
async function execute(topic: string): Promise<string[]> {
  // 1. Construct prompt for brainstorming
  // 2. Call LLM
  // 3. Return list of ideas
}
```

### 2.3 MCP Server
```typescript
// Define MCP tools:
// tool: ironclad_plan(goal: string, context: string)
// tool: ironclad_brainstorm(topic: string)
```

---

## 3. Architecture (Refinement)

### 3.1 New Domain: `StrategicPlanningDomain`
- Location: `src/core/domains/strategic-planning/`
- Entities: `Plan`, `BrainstormSession`

### 3.2 New Use Cases
- `src/core/application/use-cases/generate-plan.use-case.ts`
- `src/core/application/use-cases/brainstorm.use-case.ts`

### 3.3 MCP Entry Point
- `src/mcp/index.ts`: The MCP server implementation.

---

## 4. Implementation Plan (Act)

1. **[Dependencies]** Install `@modelcontextprotocol/sdk`.
2. **[Domain]** Create `StrategicPlanningDomain` and register it in `IroncladKernel`.
3. **[UseCases]** Implement `GeneratePlanUseCase` and `BrainstormUseCase`.
4. **[MCP]** Implement the MCP server in `src/mcp/index.ts`.
5. **[CLI]** Update `src/cli/index.ts` to (optionally) start the MCP server or expose these commands locally.

---

## 5. Completion (Verify)

- `ironclad plan "Fix the engine"` generates a file in `plans/`.
- `ironclad brainstorm "How to scale"` returns ideas.
- MCP server correctly registers tools and handles requests.
