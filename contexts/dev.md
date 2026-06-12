# Ironclad Development Context

This file serves as the contextual bridge for AI harnesses operating in development mode.
It maps global variables, testing commands, and environment assumptions so the AI does not have to guess.

- Package Manager: Discovered dynamically by `.ironclad-pm.json`
- Test Runner: Custom Node.js runner in `tests/run-all.js`
- Build System: `tsc` targeting ESNext Node environments.