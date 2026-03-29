'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { formatDateTime } from '@/lib/utils';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import type { Id } from '@/convex/_generated/dataModel';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const event = useQuery(api.events.getById, { id: id as Id<'events'> });

  if (event === undefined) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="aspect-video w-full rounded-xl mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-4 w-64 mb-8" />
      </div>
    );
  }

  if (!event || !event.published) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
        <Link href="/events" className="text-primary hover:underline">
          ← Back to Events
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 fade-up">
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </Link>

      {event.bannerImageUrl && (
        <div className="mb-8 overflow-hidden rounded-xl aspect-video bg-secondary/40">
          <img
            src={event.bannerImageUrl}
            alt={event.title}
            className="h-full w-full object-contain"
          />
        </div>
      )}

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
            <Calendar className="h-4 w-4" />
            {formatDateTime(event.eventDate)}
          </span>
          <span className="flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/40 px-3 py-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {event.location}
          </span>
        </div>
        <h1 className="text-4xl font-bold leading-tight">{event.title}</h1>
      </div>

      <div className="rounded-xl border border-border/40 bg-card/40 p-6">
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
          {event.description}
        </p>
      </div>
    </article>
  );
}
