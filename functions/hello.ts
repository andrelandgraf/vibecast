/**
 * A Neon Function. The default export's `fetch` handler is the entry — the same
 * contract the deployed Neon Functions runtime and `neon dev` both speak.
 *
 * When run under `neon dev` with a resolvable Neon branch, the branch's connection
 * details are injected into the environment (DATABASE_URL, and NEON_AUTH_BASE_URL /
 * NEON_DATA_API_URL when those integrations are enabled).
 */
export default {
  fetch(_req: Request): Response {
    const hasDb = Boolean(process.env.DATABASE_URL);
    return Response.json({
      function: 'hello',
      message: 'Hello from Neon Functions!',
      databaseUrlInjected: hasDb,
    });
  },
};
