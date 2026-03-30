'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import { slugify } from '@/lib/utils';
import { useEffect } from 'react';
import type { Blog } from '@/types';
import type { Id } from '@/convex/_generated/dataModel';
import { ImageUpload } from '@/components/admin/ImageUpload';

const blogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z
    .string()
    .min(3, 'Slug required')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug must be lowercase letters, numbers, and hyphens'
    ),
  content: z.string().min(10, 'Content is required'),
  excerpt: z.string().optional(),
  coverImageUrl: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  coverImageId: z.string().optional(),
  tags: z.string(),
  published: z.boolean(),
});
type BlogFormData = z.infer<typeof blogSchema>;

interface Props {
  initialData?: Blog;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BlogForm({ initialData, onSuccess, onCancel }: Props) {
  const create = useMutation(api.blog.create);
  const update = useMutation(api.blog.update);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      slug: initialData?.slug ?? '',
      content: initialData?.content ?? '',
      excerpt: initialData?.excerpt ?? '',
      coverImageUrl: initialData?.coverImageUrl ?? '',
      coverImageId: initialData?.coverImageId as string | undefined,
      tags: initialData?.tags.join(', ') ?? '',
      published: initialData?.published ?? false,
    },
  });

  const title = watch('title');

  // Auto-generate slug from title when creating
  useEffect(() => {
    if (!initialData && title) {
      setValue('slug', slugify(title));
    }
  }, [title, initialData, setValue]);

  const onSubmit = async (data: BlogFormData) => {
    try {
      const tags = data.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt || undefined,
        coverImageUrl: data.coverImageUrl || undefined,
        coverImageId: data.coverImageId as Id<'_storage'> | undefined,
        tags,
        published: data.published,
      };

      if (initialData) {
        await update({ id: initialData._id, ...payload });
        toast.success('Post updated!');
      } else {
        await create(payload);
        toast.success('Post created!');
      }
      onSuccess();
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to save post');
    }
  };

  const inputCls =
    'w-full rounded-lg border border-border/60 bg-secondary/30 px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors';

  return (
    <div className="space-y-6 fade-up">
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-2xl font-bold font-display">
          {initialData ? 'Edit Post' : 'New Blog Post'}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-xl border border-border/50 bg-card/40 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Title *
              </label>
              <input
                {...register('title')}
                placeholder="Post title"
                className={inputCls}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Slug *</label>
              <input
                {...register('slug')}
                placeholder="url-slug"
                className={`${inputCls} font-mono`}
              />
              {errors.slug && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.slug.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Excerpt
              </label>
              <textarea
                {...register('excerpt')}
                rows={2}
                placeholder="Brief summary (optional)"
                className={`${inputCls} resize-none`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Content * (HTML supported)
              </label>
              <textarea
                {...register('content')}
                rows={16}
                placeholder="Write your content here…"
                className={`${inputCls} resize-y font-mono text-xs`}
              />
              {errors.content && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.content.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Publish */}
          <div className="rounded-xl border border-border/50 bg-card/40 p-5 space-y-4">
            <h3 className="font-semibold text-sm">Publish Settings</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('published')}
                className="h-4 w-4 rounded accent-primary"
              />
              <span className="text-sm">Publish immediately</span>
            </label>
          </div>

          {/* Meta */}
          <div className="rounded-xl border border-border/50 bg-card/40 p-5 space-y-4">
            <h3 className="font-semibold text-sm">Media & Tags</h3>
            <ImageUpload
              value={watch('coverImageUrl')}
              imageId={watch('coverImageId') as Id<'_storage'> | undefined}
              onChange={(url, imageId) => {
                setValue('coverImageUrl', url);
                setValue('coverImageId', imageId as string | undefined);
              }}
            />
            <div className="pt-2">
              <label className="block text-xs text-muted-foreground mb-1.5">
                Tags (comma-separated)
              </label>
              <input
                {...register('tags')}
                placeholder="engine, piston, maintenance"
                className={inputCls}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {initialData ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
