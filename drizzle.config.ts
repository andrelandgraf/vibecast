import { config as loadEnv } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { parseEnv } from '@neondatabase/env/v1';
import neonConfig from './neon';

loadEnv({ path: '.env.local' });
const env = parseEnv(neonConfig);

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  // Only manage the public schema; neon_auth is managed by Neon Auth.
  schemaFilter: ['public'],
  dbCredentials: {
    url: env.postgres.databaseUrl,
  },
});
