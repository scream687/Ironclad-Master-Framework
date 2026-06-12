import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'cli/index': 'src/cli/index.ts',
    'mcp/server': 'src/mcp/server.ts',
  },
  format: ['esm'],
  target: 'node20',
  platform: 'node',
  clean: true,
  sourcemap: true,
  // better-sqlite3 is a native module — never bundle it
  external: ['better-sqlite3'],
});
