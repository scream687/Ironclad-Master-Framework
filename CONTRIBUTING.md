# Contributing to Ironclad

The **Ironclad Master Framework** is a living intelligence system. To maintain its high-performance state, all contributions must adhere to the following "Elite Standards."

## 🏛 The Golden Rules
1. **No Slop:** Never add generic or "boilerplate" assets. Every skill and rule must be battle-tested.
2. **Ironclad Verified:** Any change to the core framework logic (Skill Router, GEMINI.md) must be accompanied by an architectural rationale.
3. **Atomic Assets:** Skills and agents should be modular and self-contained within `.ai-core/`.

## 🛠 Adding a New Skill
To add a new skill to the framework:
1. Create a sub-directory in `.ai-core/skills/`.
2. Include a `SKILL.md` file following the standard schema.
3. Update `SKILL_ROUTER.md` to include the new skill in the appropriate task category.

## 🧠 Refactoring the Router
If you identify a new task pattern that the framework isn't handling optimally:
1. Open a discussion or PR proposing the new mapping.
2. Ensure the primary skill chosen is the most "Ironclad" version available (preferring TDD and SPARC-based skills).

## 🛡 Security First
Never commit secrets, API keys, or sensitive environment configurations. Use the provided `.gitignore`.

---
*Stay Ironclad.*
