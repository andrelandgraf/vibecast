import { sql } from 'drizzle-orm';
import { db } from './db';

// Verify the user is a member of the organization. Neon Auth stores membership
// in the managed `neon_auth.member` table (uuid columns, camelCase names).
export async function isMember(organizationId: string, userId: string): Promise<boolean> {
  try {
    const result = await db.execute(
      sql`select 1 from neon_auth.member where "organizationId"::text = ${organizationId} and "userId"::text = ${userId} limit 1`,
    );
    return (result.rows?.length ?? 0) > 0;
  } catch (error) {
    console.error('[org] membership check failed:', error);
    return false;
  }
}
