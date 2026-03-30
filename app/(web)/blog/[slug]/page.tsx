'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams, notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogCoverImage } from '@/components/admin/BlogCoverImage';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = useQuery(api.blog.getBySlug, { slug });

  if (post === undefined) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-4 w-48 mb-8" />
        <Skeleton className="aspect-video w-full rounded-xl mb-8" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!post || !post.published) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <Link href="/blog" className="text-primary hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 fade-up">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>

      {(post.coverImageUrl || post.coverImageId) && (
        <div className="mb-8 overflow-hidden rounded-xl aspect-video bg-secondary/40">
          <BlogCoverImage
            imageId={post.coverImageId}
            imageUrl={post.coverImageUrl}
            alt={post.title}
          />
        </div>
      )}

      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(post.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {post.authorName}
          </span>
        </div>
        <h1 className="text-4xl font-bold leading-tight mb-4">{post.title}</h1>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div
        className="prose prose-invert prose-amber max-w-none text-foreground leading-relaxed
          prose-headings:font-display prose-headings:font-bold
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-code:font-mono prose-code:text-sm prose-code:bg-secondary/60 prose-code:px-1 prose-code:rounded
          prose-pre:bg-secondary/60 prose-pre:border prose-pre:border-border/50
          prose-blockquote:border-primary/40 prose-blockquote:text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
