import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { paginationOptsValidator } from 'convex/server';
import { requireMemberOrAdmin } from './helpers';

// Helper to resolve bannerImageId → a signed URL from Convex storage.
// Also handles legacy events where the broken manual URL was stored in bannerImageUrl.
async function resolveBannerUrl(
  ctx: { storage: { getUrl: (id: string) => Promise<string | null> } },
  doc: { bannerImageId?: string; bannerImageUrl?: string }
): Promise<string | undefined> {
  // Prefer storageId stored from the fixed upload flow
  if (doc.bannerImageId) {
    return (await ctx.storage.getUrl(doc.bannerImageId)) ?? undefined;
  }
  // Detect the legacy broken URL pattern: .../api/storage/<storageId>
  // and re-resolve via getUrl() to get a proper signed URL
  if (doc.bannerImageUrl) {
    const storageMatch = doc.bannerImageUrl.match(/\/api\/storage\/([^?#]+)/);
    if (storageMatch) {
      const legacyStorageId = storageMatch[1];
      const resolved = await ctx.storage.getUrl(legacyStorageId);
      if (resolved) return resolved;
    }
    // Plain external URL (pasted by user) — return as-is
    return doc.bannerImageUrl;
  }
  return undefined;
}

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db
      .query('events')
      .withIndex('by_published', (q) => q.eq('published', true))
      .collect();
    return Promise.all(
      events.map(async (e) => ({
        ...e,
        bannerImageUrl: await resolveBannerUrl(ctx, e),
      }))
    );
  },
});

export const listPublishedPaginated = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query('events')
      .withIndex('by_published', (q) => q.eq('published', true))
      .order('desc')
      .paginate(args.paginationOpts);
    return {
      ...result,
      page: await Promise.all(
        result.page.map(async (e) => ({
          ...e,
          bannerImageUrl: await resolveBannerUrl(ctx, e),
        }))
      ),
    };
  },
});

export const getById = query({
  args: { id: v.id('events') },
  handler: async (ctx, args) => {
    const e = await ctx.db.get(args.id);
    if (!e) return null;
    return { ...e, bannerImageUrl: await resolveBannerUrl(ctx, e) };
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await requireMemberOrAdmin(ctx);
    const events = await ctx.db.query('events').order('desc').collect();
    return Promise.all(
      events.map(async (e) => ({
        ...e,
        bannerImageUrl: await resolveBannerUrl(ctx, e),
      }))
    );
  },
});

export const listAllPaginated = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    await requireMemberOrAdmin(ctx);
    const result = await ctx.db
      .query('events')
      .order('desc')
      .paginate(args.paginationOpts);
    return {
      ...result,
      page: await Promise.all(
        result.page.map(async (e) => ({
          ...e,
          bannerImageUrl: await resolveBannerUrl(ctx, e),
        }))
      ),
    };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    eventDate: v.number(), // Unix timestamp
    location: v.string(),
    bannerImageId: v.optional(v.id('_storage')),
    bannerImageUrl: v.optional(v.string()),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireMemberOrAdmin(ctx);
    const now = Date.now();
    return ctx.db.insert('events', {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id('events'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    eventDate: v.optional(v.number()),
    location: v.optional(v.string()),
    bannerImageId: v.optional(v.id('_storage')),
    bannerImageUrl: v.optional(v.string()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireMemberOrAdmin(ctx);
    const { id, ...rest } = args;
    const filtered = Object.fromEntries(
      Object.entries(rest).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, { ...filtered, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id('events') },
  handler: async (ctx, args) => {
    await requireMemberOrAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireMemberOrAdmin(ctx);
    return ctx.storage.generateUploadUrl();
  },
});
