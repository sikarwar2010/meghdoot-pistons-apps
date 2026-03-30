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
  note: v.optional(v.string()),
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

// Seed initial data from the uploaded image
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const now = Date.now();

    const entries = [
      {
        brand: 'ANDORIA',
        model: 'C330,S-231,4/6 Cyl,1807',
        boreDiameter: 102.0,
        pistonSpecs: {
          TL: 130.0,
          KH: 75.3,
          PIN: '38 x 84',
          bowlDia: 29.0,
          bowlDepth: 33.5,
        },
        ringSizes: { ring1: 2.5, ring2: 2.5, ring3: 4.5, note: undefined },
        imageId: undefined,
      },
      {
        brand: 'ANDORIA',
        model: 'S-320,1234',
        boreDiameter: 120.0,
        pistonSpecs: {
          TL: 165.0,
          KH: 99.8,
          PIN: '45 x 98',
          bowlDia: 36.0,
          bowlDepth: 43.5,
        },
        ringSizes: { ring1: 3.0, ring2: 5.5 },
        imageId: undefined,
      },
      {
        brand: 'ANDORIA',
        model: 'S-231,4/6 Cyl,3576',
        boreDiameter: 135.0,
        pistonSpecs: {
          TL: 164.0,
          KH: 95.5,
          PIN: '45 x 115',
          bowlDia: 41.0,
          bowlDepth: 50.7,
        },
        ringSizes: { ring1: 4.0, ring2: 3.0, ring3: 5.0, note: 'T15+' },
        imageId: undefined,
      },
      {
        brand: 'ASAA',
        model: 'F-140,2421',
        boreDiameter: 140.0,
        pistonSpecs: {
          TL: 195.0,
          KH: 105.0,
          PIN: '50 x 120',
          bowlDia: undefined,
          bowlDepth: undefined,
        },
        ringSizes: { ring1: 5.0 },
        imageId: undefined,
      },
      {
        brand: 'ARMSTRONG',
        model: '6/8',
        boreDiameter: 107.95,
        pistonSpecs: {
          TL: 115.4,
          KH: 66.27,
          PIN: '31.75 x 90',
          bowlDia: 60.15,
          bowlDepth: 29.0,
        },
        ringSizes: { ring1: 3.17, ring2: 6.35 },
        imageId: undefined,
      },
      {
        brand: 'ARMSTRONG',
        model: '14/22',
        boreDiameter: 107.95,
        pistonSpecs: {
          TL: 146.0,
          KH: 95.15,
          PIN: '38.10 x 90',
          bowlDia: 60.3,
          bowlDepth: 28.0,
        },
        ringSizes: { ring1: 3.17, ring2: 6.35 },
        imageId: undefined,
      },
    ];

    for (const entry of entries) {
      await ctx.db.insert('catalog', {
        ...entry,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { seeded: entries.length };
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
