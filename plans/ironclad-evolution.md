# SPARC Specification: Ironclad Evolution Pass (v1.1)

## 1. Specification (Understand)

**Goal:** Transform the Ironclad Master Framework from a "rule-heavy shell" into a functional "Autonomous Business Operating System shell" by fleshing out the core execution logic and integrating elite engineering skills.

**Context:**
- Rule files (`.clinerules`, `.cursorrules`, etc.) are being refactored to a unified 5-step loop.
- `Makefile` and `scripts/install.sh` are skeletal.
- 23+ elite skills are sitting untracked in `.ai-core/skills/`.

**Constraints:**
- **Karpathy Mandate**: Keep it simple. Don't over-engineer the shell.
- **ECC Mandate**: Enterprise governance. Scripts must be robust.
- **Pocock Mandate**: Use deep modules. The `Makefile` should be the "interface" to the framework's complexity.

---

## 2. Pseudocode (Logic)

### 2.1 Audit Logic (`make audit`)
```bash
function audit() {
  # 1. Run eslint with stop-slop rules
  # 2. Check for console.log/TODO/boilerplate
  # 3. Verify directory structure
}
```

### 2.2 Skill Routing
Update `SKILL_ROUTER.md` to map specific files/folders in `.ai-core/skills/` to task categories.

---

## 3. Architecture (Refinement)

### 3.1 Directory Structure
- `.ai-core/rules/`: Core anti-slop rules.
- `.ai-core/skills/`: Integrated atomic toolsets.
- `scripts/`: Implementation details for Makefile targets.

### 3.2 Global Rules
Ensure `.clinerules`, `.cursorrules`, `.windsurfrules`, and `CLAUDE.md` all point to the SAME `SKILL_ROUTER.md`.

---

## 4. Implementation Plan (Act)

1. **[Refine]** Finalize the unstaged changes in rule files.
2. **[Implement]** Create `scripts/audit.sh` to perform real anti-slop checks.
3. **[Update]** Flesh out the `Makefile` to call these scripts.
4. **[Map]** Update `SKILL_ROUTER.md` with the newly discovered skills in `.ai-core/skills/`.
5. **[Governance]** Create `.github/workflows/ironclad-audit.yml`.

---

## 5. Completion (Verify)

- `make audit` returns a real report.
- `make install` sets up the local environment correctly.
- All rule files are perfectly synchronized.
