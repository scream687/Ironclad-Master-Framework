---
name: plan
description: Generate a strategic SPARC specification for any goal.
---

# Command: /plan

**Action:** Triggers the generation of a SPARC blueprint.

**Workflow:**
1. Delegate to the `ironclad-architect` agent.
2. The agent will read `plans/ROADMAP.json` to understand current objectives.
3. The agent will output a rigorous `SPARC-[FEATURE].md` document defining the Specification, Pseudocode, Architecture, Refinement, and Completion steps.
4. The agent will append the new objective to the `ROADMAP.json`.