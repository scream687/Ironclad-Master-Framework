# SPARC Specification: The Ironclad Infinity Loop (God-Tier Harness)

## 1. Specification (Understand)

**Goal:** Create an "Exceptional Level of Harness" for absolute autonomous continuity in long-running tasks. The agent must never fail to complete an objective, even if it requires thousands of turns or multiple session restarts.

**Key Mandates:**
- **Zero-Failure Persistence**: Every thought, discovery, and action must be checkpointed to AgentDB.
- **Recursive Autonomy**: High-level goals must automatically decompose into a tree of sub-tasks.
- **Dynamic Backtracking**: The system must detect stagnation and autonomously return to the "Understand" phase to re-route strategy.
- **Swarm Delegation**: Support spawning specialized sub-agents for parallel execution of decomposed tasks.

**Context:**
- Current `HarnessService` is linear and lacks sub-task management.
- Continuity is currently limited to phase-level recovery, not mental-state recovery.

---

## 2. Pseudocode (Logic)

### 2.1 The God-Loop (Macro)
```typescript
async function runInfinityLoop(objective: string) {
  let objectiveTask = await TaskManager.initializeObjective(objective);
  
  while (!objectiveTask.isComplete()) {
    // 1. Decompose if needed
    if (objectiveTask.needsDecomposition()) {
      await objectiveTask.decompose(); 
    }
    
    // 2. Process Next Sub-task
    const currentSubTask = objectiveTask.getNextPending();
    if (currentSubTask) {
      await runMicroLoop(currentSubTask);
    } else {
      // 3. Final Verification of Parent
      const success = await verify(objectiveTask);
      if (success) objectiveTask.complete();
      else objectiveTask.backtrack(); // Re-analyze why sub-tasks didn't solve it
    }
    
    await AgentDB.checkpoint(objectiveTask);
  }
}
```

### 2.2 The Micro-Loop (SPARC + Self-Healing)
```typescript
async function runMicroLoop(task: Task) {
  state.phase = UNDERSTAND;
  while (state.phase !== COMPLETE) {
    await state.checkpointMentalState(); // Thought persistence
    try {
      await executePhase(state.phase);
      if (state.phase === VERIFY) {
        const breaches = await audit(task.scope);
        if (breaches.length > 0) {
          await state.heal(breaches);
          continue; // Recursive re-verify
        }
      }
      state.next();
    } catch (error) {
      if (isStagnant(error)) state.backtrackToStrategy();
      else throw error;
    }
  }
}
```

---

## 3. Architecture (Refinement)

### 3.1 TaskTree Extension
- `Task`: Add `parentId: string`, `subTasks: Task[]`, `metadata: Record<string, any>`.
- `TaskRepository`: Backed by SQLite (AgentDB) for ACID-compliant task tracking.

### 3.2 Mental Context Store
- New collection in AgentDB: `thoughts`. Stores: `timestamp`, `taskId`, `thought`, `toolResultSnapshot`.

---

## 4. Implementation Plan (Act)

1.  **[Entity]** Upgrade `Task` entity and schema to support hierarchy and rich metadata.
2.  **[Service]** Implement `TaskDecompositionService` (AI-driven goal splitting).
3.  **[Service]** Implement `InfinityHarnessService` with nested loop logic.
4.  **[Service]** Implement `MentalContextService` for checkpointing "Thinking".
5.  **[Verify]** Launch the loop on the objective: "Eliminate all 111 Governance Breaches autonomously."

---

## 5. Completion (Verify)

- Objective is decomposed into 111+ discrete tasks.
- Agent resumes correctly even after `kill -9` of the terminal.
- Agent backtracking is observed when a file cannot be healed in 3 tries.
- **Truth Score hits 100/100.**
