---
description: "TypeScript and Node.js Specific Standards"
globs: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"]
alwaysApply: false
---

# TypeScript Standards

1. **Strict Mode:** Always use `strict: true` in tsconfig.
2. **Interfaces over Types:** Prefer `interface` for object shapes that are extendable.
3. **No Implicit Any:** Types must be explicitly defined. Never use `any` unless integrating with untyped legacy libraries.
4. **Inversify IoC:** Use `@injectable()` and `@inject()` for dependency injection. Do not instantiate classes directly.