---
name: ironclad-shield
description: Multi-agent adversarial security scanning pipeline.
tools: ["Bash", "Read", "Write"]
---

# Ironclad Shield Workflow

**Trigger:** /security-scan or via CI Pipeline

1. **Phase 1: Red Team Assault**
   - The system delegates to the `ironclad-red-team` agent.
   - The Red Team agent scans the repository (using Opus-level reasoning) to discover logic flaws, hardcoded secrets, and injection vectors.
   - Outputs: `SECURITY_FINDINGS.md`.

2. **Phase 2: Blue Team Defense**
   - The system delegates to the `ironclad-blue-team` agent.
   - The Blue Team agent reads `SECURITY_FINDINGS.md`.
   - The Blue Team agent implements structural mitigations and patches the vulnerabilities.
   - Outputs: `SECURITY_MITIGATIONS.md`.

3. **Phase 3: Final Audit**
   - The system runs the standard Ironclad Truth Audit to verify that the Blue Team's fixes didn't violate core coding standards or lower the Truth Score below 0.95.