import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { requireAdmin } from './helpers';

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('contacts', {
      ...args,
      createdAt: Date.now(),
      resolved: false,
    });
  },
});

export const listAll = query({
  args: {
    resolved: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const query = ctx.db.query('contacts');
    if (args.resolved !== undefined) {
      query.filter((q) => q.eq(q.field('resolved'), args.resolved));
    }
    return query.collect();
  },
});

export const markResolved = mutation({
  args: { id: v.id('contacts') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { resolved: true });
  },
});

export const remove = mutation({
  args: { id: v.id('contacts') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
