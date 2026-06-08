import { defineConfig } from '@neondatabase/config/v1';

/**
 * Neon Platform policy for this workspace. Declares the branch's services and the
 * Preview-feature functions to deploy. `neon dev` (no `--source`) serves every function
 * below locally; `neonctl deploy` / `neonctl config apply` provisions them on the branch.
 */
export default defineConfig(() => ({
  // Branch-level integrations (uncomment to enable on the branch).
  // auth: {},
  // dataApi: {},
  preview: {
    functions: [
      {
        slug: 'hello',
        name: 'Hello',
        source: './functions/hello.ts',
        // Local dev: bind this exact port (omit `port` to auto-pick a free one).
        dev: { port: 8787 },
      },
      {
        slug: 'goodbye',
        name: 'Goodbye',
        source: './functions/goodbye.ts',
        dev: { port: 8788 },
      },
    ],
  },
}));
