'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  Package,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

function isElevatedEditor(me: { role: string } | null | undefined) {
  if (!me) return false;
  return me.role === 'admin' || me.role === 'member' || me.role === 'editor';
}

export default function AdminDashboard() {
  const me = useQuery(api.users.getUser);
  const roleSettled = me !== undefined;
  const elevated = isElevatedEditor(me ?? null);

  const blogs = useQuery(api.blog.listAll);
  const events = useQuery(
    api.events.listAll,
    roleSettled && elevated ? {} : 'skip'
  );
  const contacts = useQuery(api.contacts.listAll, elevated ? {} : 'skip');
  const catalog = useQuery(api.catalog.list, elevated ? {} : 'skip');

  const stats = (
    elevated
      ? [
          {
            label: 'Blog Posts',
            value: blogs?.length ?? '—',
            published: blogs?.filter((b) => b.published).length ?? 0,
            icon: BookOpen,
            href: '/dashboard/blogs',
            color: 'text-sky-400',
            bg: 'bg-sky-400/10 border-sky-400/20',
          },
          {
            label: 'Events',
            value: events?.length ?? '—',
            published: events?.filter((e) => e.published).length ?? 0,
            icon: Calendar,
            href: '/dashboard/events',
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10 border-emerald-400/20',
          },
          {
            label: 'Catalog Entries',
            value: catalog?.length ?? '—',
            published: null as number | null,
            icon: Package,
            href: '/dashboard/catalog',
            color: 'text-amber-400',
            bg: 'bg-amber-400/10 border-amber-400/20',
          },
          {
            label: 'Contact Queries',
            value: contacts?.length ?? '—',
            published: contacts?.filter((c) => !c.resolved).length ?? 0,
            publishedLabel: 'unresolved',
            icon: MessageSquare,
            href: '/dashboard/contacts',
            color: 'text-violet-400',
            bg: 'bg-violet-400/10 border-violet-400/20',
          },
        ]
      : [
          {
            label: 'Blog Posts',
            value: blogs?.length ?? '—',
            published: blogs?.filter((b) => b.published).length ?? 0,
            icon: BookOpen,
            href: '/dashboard/blogs',
            color: 'text-sky-400',
            bg: 'bg-sky-400/10 border-sky-400/20',
          },
        ]
  ) satisfies Array<{
    label: string;
    value: number | string;
    published: number | null;
    publishedLabel?: string;
    icon: typeof BookOpen;
    href: string;
    color: string;
    bg: string;
  }>;

  return (
    <div className="space-y-8 fade-up">
      <div>
        <h1 className="text-2xl font-bold font-display mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {elevated
            ? 'Overview of your AutoParts platform'
            : 'Your blog workspace'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group gradient-border rounded-xl border border-border/50 bg-card/60 p-5 hover:bg-card/90 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg border ${stat.bg}`}
              >
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="text-3xl font-bold font-display mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            {stat.published !== null && (
              <div className={`mt-2 text-xs ${stat.color}`}>
                {stat.published} {stat.publishedLabel ?? 'published'}
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div
        className={`grid grid-cols-1 gap-6 ${elevated ? 'lg:grid-cols-2' : ''}`}
      >
        {/* Recent Blogs */}
        <div className="rounded-xl border border-border/50 bg-card/40 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-sky-400" />
              <h2 className="font-semibold text-sm">Recent Blog Posts</h2>
            </div>
            <Link
              href="/dashboard/blogs"
              className="text-xs text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-border/30">
            {blogs?.slice(0, 5).map((post) => (
              <div
                key={post._id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{post.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(post.createdAt)}
                  </p>
                </div>
                <span
                  className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    post.published
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                      : 'bg-secondary/60 text-muted-foreground'
                  }`}
                >
                  {post.published ? 'Live' : 'Draft'}
                </span>
              </div>
            )) ?? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No posts yet
              </div>
            )}
          </div>
        </div>

        {elevated ? (
          <div className="rounded-xl border border-border/50 bg-card/40 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-violet-400" />
                <h2 className="font-semibold text-sm">Recent Inquiries</h2>
              </div>
              <Link
                href="/dashboard/contacts"
                className="text-xs text-primary hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-border/30">
              {contacts?.slice(0, 5).map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {c.email}
                    </p>
                  </div>
                  <span
                    className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      c.resolved
                        ? 'bg-secondary/60 text-muted-foreground'
                        : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                    }`}
                  >
                    {c.resolved ? 'Done' : 'Open'}
                  </span>
                </div>
              )) ?? (
                <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No contacts yet
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
