import { parseEnv } from '@neondatabase/env/v1';
import config from './neon.js';

/**
 * Demonstrates reading the Neon branch env via the policy. Synchronous + network-free:
 * `parseEnv` validates the NEON_* vars already present in `process.env` (injected by
 * `neon dev`, `neon-env run -- …`, or a hosting platform) against the `neon.ts` policy
 * and returns the typed `NeonEnv` shape.
 *
 * Run with the vars injected, e.g.:
 *   neon-env run -- bun run index.ts
 *   neonctl-test dev   # serves the functions; this script is just for the env demo
 */
const env = parseEnv(config, process.env.NEON_BRANCH_NAME ?? 'main');
console.log('Pooled DATABASE_URL:', env.postgres.databaseUrl);
console.log('Direct  DATABASE_URL:', env.postgres.databaseUrlUnpooled);
