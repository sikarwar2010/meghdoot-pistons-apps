import { QueryCtx, MutationCtx } from './_generated/server';

export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return ctx.db
    .query('users')
    .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
    .unique();
}

export async function requireUser(ctx: QueryCtx | MutationCtx) {
  const user = await getCurrentUser(ctx);
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const user = await requireUser(ctx);
  if (user.role !== 'admin') throw new Error('Forbidden: Admin only');
  return user;
}

export async function requireMemberOrAdmin(ctx: QueryCtx | MutationCtx) {
  const user = await requireUser(ctx);
  if (user.role !== 'admin' && user.role !== 'member' && user.role !== 'editor')
    throw new Error('Forbidden: Member or Admin only');
  return user;
}

// Non-throwing version - returns null if not authenticated
export async function getCurrentUserOrNull(ctx: QueryCtx | MutationCtx) {
  try {
    return await getCurrentUser(ctx);
  } catch {
    return null;
  }
}
