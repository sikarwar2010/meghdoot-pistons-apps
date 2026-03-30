'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { formatDate, truncate } from '@/lib/utils';
import { BookOpen, Tag, Calendar, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { BlogCoverImage } from '@/components/admin/BlogCoverImage';

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState<string | undefined>();
  const posts = useQuery(api.blog.listPublished, { tag: activeTag });

  // Collect all tags from posts
  const allTags = posts
    ? [...new Set(posts.flatMap((p) => p.tags))].filter(Boolean)
    : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 fade-up">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Technical Blog
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Engineering Insights
        </h1>
        <p className="text-muted-foreground">
          Technical articles, installation guides, and product updates from our
          engineering team.
        </p>
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(undefined)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              !activeTag
                ? 'border-primary bg-primary/20 text-primary'
                : 'border-border/50 bg-secondary/30 text-muted-foreground hover:text-foreground'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                activeTag === tag
                  ? 'border-primary bg-primary/20 text-primary'
                  : 'border-border/50 bg-secondary/30 text-muted-foreground hover:text-foreground'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Posts grid */}
      {posts === undefined ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-border/40 bg-card/30 py-20 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No posts published yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group gradient-border rounded-xl border border-border/50 bg-card/60 overflow-hidden hover:bg-card/90 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
            >
              {post.coverImageUrl || post.coverImageId ? (
                <div className="aspect-video overflow-hidden bg-secondary/40">
                  <BlogCoverImage
                    imageId={post.coverImageId}
                    imageUrl={post.coverImageUrl}
                    alt={post.title}
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-linear-to-br from-secondary/60 to-primary/10 flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-primary/30" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {post.authorName}
                  </span>
                </div>
                <h2 className="font-bold text-lg leading-snug mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {post.excerpt || truncate(post.content)}
                </p>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 rounded-full bg-secondary/50 px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        <Tag className="h-2.5 w-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
