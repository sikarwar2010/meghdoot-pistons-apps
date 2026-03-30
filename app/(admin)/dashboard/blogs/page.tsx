'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import { toast } from 'sonner';
import { BlogForm } from '@/components/admin/blogform';
import { Plus, Edit, Trash2, Eye, EyeOff, BookOpen } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Blog } from '@/types';
import type { Id } from '@/convex/_generated/dataModel';
import { BlogCoverImage } from '@/components/admin/BlogCoverImage';

export default function AdminBlogsPage() {
  const blogs = useQuery(api.blog.listAll);
  const remove = useMutation(api.blog.remove);
  const update = useMutation(api.blog.update);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);

  const handleDelete = async (id: Id<'blogs'>) => {
    if (!confirm('Delete this post permanently?')) return;
    try {
      await remove({ id });
      toast.success('Post deleted');
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to delete');
    }
  };

  const handleTogglePublish = async (blog: Blog) => {
    try {
      await update({
        id: blog._id,
        published: !blog.published,
        title: '',
        slug: '',
        content: '',
        tags: [],
      });
      toast.success(blog.published ? 'Post unpublished' : 'Post published');
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to update');
    }
  };

  if (showForm || editing) {
    return (
      <BlogForm
        initialData={editing ?? undefined}
        onSuccess={() => {
          setShowForm(false);
          setEditing(null);
        }}
        onCancel={() => {
          setShowForm(false);
          setEditing(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Blog Posts</h1>
          <p className="text-sm text-muted-foreground">
            {blogs?.length ?? 0} total posts
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Post
        </button>
      </div>

      <div className="rounded-xl border border-border/50 overflow-hidden">
        {!blogs || blogs.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No blog posts yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Create your first post
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-secondary/40 border-b border-border/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Cover
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                  Author
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                  Tags
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {blogs?.map((blog) => (
                <tr
                  key={blog._id}
                  className="hover:bg-secondary/20 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="h-16 w-24 rounded-lg overflow-hidden border border-border/50 bg-secondary/30">
                      <BlogCoverImage
                        imageId={blog.coverImageId}
                        imageUrl={blog.coverImageUrl}
                        alt={blog.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm truncate max-w-50">
                      {blog.title}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mt-1">
                      {blog.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                    {blog.authorName}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-secondary/60 px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                      {blog.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{blog.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                    {formatDate(blog.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        blog.published
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                          : 'bg-secondary/60 border border-border/40 text-muted-foreground'
                      }`}
                    >
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleTogglePublish(blog as Blog)}
                        title={blog.published ? 'Unpublish' : 'Publish'}
                        className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                      >
                        {blog.published ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => setEditing(blog as Blog)}
                        className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
