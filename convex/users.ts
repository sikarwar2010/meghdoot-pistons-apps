import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';
import { getCurrentUser, requireAdmin } from './helpers';

// called from clerk webhook or on first sign-in
export const upsertUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .unique();

    if (existingUser) {
      // update existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
      });
      return existingUser._id;
    }

    // create new user
    return await ctx.db.insert('users', {
      ...args,
      role: 'user',
    });
  },
});

export const getUser = query({
  args: {},
  handler: async (ctx) => getCurrentUser(ctx),
});

export const setRole = mutation({
  args: {
    userId: v.id('users'),
    role: v.union(v.literal('admin'), v.literal('member'), v.literal('user')),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.userId, { role: args.role });
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query('users').collect();
  },
});

export const deleteUser = mutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.userId);
  },
});

export const getCurrentUserRole = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    return user?.role;
  },
});

export const listUsers = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query('users')
      .order('desc')
      .paginate(args.paginationOpts);
  },
});

export const updateStatus = mutation({
  args: {
    userId: v.id('users'),
    status: v.union(v.literal('active'), v.literal('suspended')),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    // ensure admin users can't easily suspend themselves to avoid lockout
    const callingUser = await getCurrentUser(ctx);
    if (
      callingUser &&
      callingUser._id === args.userId &&
      args.status === 'suspended'
    ) {
      throw new Error('You cannot suspend your own account');
    }
    await ctx.db.patch(args.userId, { status: args.status });
  },
});
