import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { requireAdmin, requireMemberOrAdmin } from './helpers';
import type { Id } from './_generated/dataModel';

async function resolveCatalogImageUrl(
  ctx: { storage: { getUrl: (id: Id<'_storage'>) => Promise<string | null> } },
  doc: { imageId?: Id<'_storage'>; imageUrl?: string }
): Promise<string | undefined> {
  if (doc.imageId) {
    return (await ctx.storage.getUrl(doc.imageId)) ?? undefined;
  }

  if (doc.imageUrl) {
    return doc.imageUrl;
  }

  return undefined;
}

const pistonSpecsValidator = v.object({
  TL: v.number(),
  KH: v.number(),
  PIN: v.string(),
  bowlDia: v.optional(v.number()),
  bowlDepth: v.optional(v.number()),
});

const ringSizesValidator = v.object({
  ring1: v.number(),
  ring2: v.optional(v.number()),
  ring3: v.optional(v.number()),
  ring4: v.optional(v.number()),
  ring5: v.optional(v.number()),
  note: v.optional(v.string()),
  ring1Specification: v.optional(v.string()),
  ring2Specification: v.optional(v.string()),
  ring3Specification: v.optional(v.string()),
  ring4Specification: v.optional(v.string()),
  ring5Specification: v.optional(v.string()),
});

// ── Public Queries ─────────────────────────────────────────────

export const list = query({
  args: {
    brand: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let items = await ctx.db.query('catalog').collect();

    if (args.brand) {
      items = items.filter(
        (i) => i.brand.toLowerCase() === args.brand!.toLowerCase()
      );
    }

    if (args.search) {
      const q = args.search.toLowerCase();
      items = items.filter(
        (i) =>
          i.brand.toLowerCase().includes(q) ||
          i.model.toLowerCase().includes(q) ||
          String(i.boreDiameter).includes(q)
      );
    }

    return Promise.all(
      items.map(async (item) => ({
        ...item,
        imageUrl: await resolveCatalogImageUrl(ctx, item),
      }))
    );
  },
});

export const getBrands = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query('catalog').collect();
    const brands = [...new Set(all.map((i) => i.brand))].sort();
    return brands;
  },
});

export const getById = query({
  args: { id: v.id('catalog') },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) return null;

    return {
      ...item,
      imageUrl: await resolveCatalogImageUrl(ctx, item),
    };
  },
});

// ── Admin Mutations ────────────────────────────────────────────

export const create = mutation({
  args: {
    brand: v.string(),
    model: v.string(),
    boreDiameter: v.number(),
    pistonSpecs: pistonSpecsValidator,
    ringSizes: ringSizesValidator,
    pistonType: v.optional(v.string()),
    imageId: v.optional(v.id('_storage')),
  },
  handler: async (ctx, args) => {
    await requireMemberOrAdmin(ctx);
    const now = Date.now();
    return ctx.db.insert('catalog', {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id('catalog'),
    brand: v.optional(v.string()),
    model: v.optional(v.string()),
    boreDiameter: v.optional(v.number()),
    pistonSpecs: v.optional(pistonSpecsValidator),
    ringSizes: v.optional(ringSizesValidator),
    pistonType: v.optional(v.string()),
    imageId: v.optional(v.id('_storage')),
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
  args: { id: v.id('catalog') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
// Upload URL for catalog images
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireMemberOrAdmin(ctx);
    return ctx.storage.generateUploadUrl();
  },
});

// Get catalog image URL from storage
export const getImageUrl = query({
  args: { imageId: v.id('_storage') },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.imageId);
  },
});
