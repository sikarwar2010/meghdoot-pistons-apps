import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // users synced from clerk
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    role: v.union(v.literal('admin'), v.literal('editor'), v.literal('user')),
  })
    .index('by_clerk_id', ['clerkId'])
    .index('by_email', ['email']),

  // blog project
  blogs: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    coverImageId: v.optional(v.id('_storage')),
    coverImageUrl: v.optional(v.string()),
    tags: v.array(v.string()),
    authorId: v.string(), // Clerk user ID
    authorName: v.string(),
    published: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_slug', ['slug'])
    .index('by_published', ['published'])
    .index('by_author', ['authorId'])
    .index('by_created_at', ['createdAt']),

  // ── Events ─────────────────────────────────────────────────────
  events: defineTable({
    title: v.string(),
    description: v.string(),
    eventDate: v.number(), // Unix timestamp
    location: v.string(),
    bannerImageId: v.optional(v.id('_storage')),
    bannerImageUrl: v.optional(v.string()),
    published: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_event_date', ['eventDate'])
    .index('by_published', ['published']),

  // ── Contact Queries ────────────────────────────────────────────
  contacts: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    resolved: v.boolean(),
    createdAt: v.number(),
  })
    .index('by_resolved', ['resolved'])
    .index('by_created_at', ['createdAt']),

  // ── Product Catalog ────────────────────────────────────────────
  catalog: defineTable({
    brand: v.string(),
    model: v.string(),
    boreDiameter: v.number(),
    pistonSpecs: v.object({
      TL: v.number(),
      KH: v.number(),
      PIN: v.string(), // e.g. "38 x 84"
      bowlDia: v.optional(v.number()),
      bowlDepth: v.optional(v.number()),
    }),
    ringSizes: v.object({
      ring1: v.number(),
      ring2: v.optional(v.number()),
      ring3: v.optional(v.number()),
      note: v.optional(v.string()), // e.g. "T15+"
    }),
    pistonType: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_brand', ['brand'])
    .index('by_bore', ['boreDiameter'])
    .index('by_model', ['model']),
});
