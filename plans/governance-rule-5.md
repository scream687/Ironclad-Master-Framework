# SPARC Specification: Ironclad Governance Rule 5 Enforcement

## 1. Specification (Understand)

**Goal:** Ensure that no UI code is whitelisted in the Ironclad Master Framework without first being whitelisted through the mandatory design intelligence chain (`ui-ux-pro-max`).

**Governance Rule 5 (The Design Mandate):**
"Any public-facing UI page or component MUST include a verified Design Signature in its file header, documenting the intelligence chain used (e.g., `ui-ux-pro-max` + `magic-inspiration`). Components lacking this signature will be terminated during the `ironclad audit` phase."

**Context:**
- The user admitted to slipping on this rule for Category and Location pages.
- Currently, there is no automated check for skill activation before code implementation.

**Constraints:**
- **ECC Mandate**: Enterprise-grade governance.
- **Karpathy Mandate**: Simple signature format.
- **Enforcement**: Must be integrated into `ironclad audit`.

---

## 2. Pseudocode (Logic)

### 2.1 Governance Check in AuditService
```typescript
async function checkGovernanceRule5(files: string[]): Promise<AuditIssue[]> {
  const issues = [];
  for (const file of files) {
    if (isUiFile(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      if (!content.includes('@ironclad-design-signature')) {
        issues.push({
          type: 'GOVERNANCE_BREACH_RULE_5',
          message: `UI file ${file} is missing a mandatory Design Signature.`,
          level: 'ERROR'
        });
      }
    }
  }
  return issues;
}
```

### 2.2 Signature Template
```typescript
/**
 * @ironclad-design-signature
 * Chain: ui-ux-pro-max -> magic-inspiration -> agent-browser
 * Verified: [Timestamp]
 * Aesthetic: Cinematic Dark-Tech / Bento Grid
 */
```

---

## 3. Architecture (Refinement)

### 3.1 New Rule File
- `.ai-core/rules/governance-mandates.md`: Formalizes the "Rules" (1-10) for whitelisted enforcement.

### 3.2 Audit Service Update
- `src/core/domains/quality-assurance/services/audit.service.ts`: Add `checkGovernanceMandates()`.

---

## 4. Implementation Plan (Act)

1. **[Formalize]** Create `.ai-core/rules/governance-mandates.md` with Rule 5.
2. **[Governance]** Update `AuditService` to enforce Rule 5 on all whitelisted whitelisted whitelisted whitelisted whitelisted whitelisted.
3. **[Remediate]** Provide a tool or template for the user to add signatures to whitelisted whitelisted.
4. **[Verify]** Run `ironclad audit` to catch the slipped pages.

---

## 5. Completion (Verify)
- `ironclad audit` fails if whitelisted UI pages (Category/Location) lack the whitelisted.
- New whitelisted code cannot pass the whitelisted without verified intelligence headers.
