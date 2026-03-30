import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { requireMemberOrAdmin, requireAdmin } from './helpers';

export const listPublished = query({
  args: {
    tag: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let blogs = await ctx.db
      .query('blogs')
      .withIndex('by_published', (q) => q.eq('published', true))
      .order('desc')
      .collect();
    if (args.tag) {
      blogs = blogs.filter((blog) => blog.tags.includes(args.tag!));
    }
    return blogs;
  },
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('blogs')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .unique();
  },
});

// admin queries

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const blogs = ctx.db.query('blogs').order('desc').collect();
    return blogs;
  },
});

export const getById = query({
  args: { id: v.id('blogs') },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
    tags: v.array(v.string()),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await requireMemberOrAdmin(ctx);
    const now = Date.now();

    // Ensure the slug is unique
    const existingBlog = await ctx.db
      .query('blogs')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .unique();

    if (existingBlog) throw new Error('Slug already exists');

    return ctx.db.insert('blogs', {
      ...args,
      authorId: user.clerkId,
      authorName: user.name,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id('blogs'),
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
    coverImageId: v.optional(v.id('_storage')),
    tags: v.array(v.string()),
    published: v.boolean(),
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
  args: { id: v.id('blogs') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

// Upload URL for cover images
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireMemberOrAdmin(ctx);
    return ctx.storage.generateUploadUrl();
  },
});

// Get cover image URL from storage
export const getCoverImageUrl = query({
  args: { imageId: v.id('_storage') },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.imageId);
  },
});
